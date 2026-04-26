import emojiMap from './emojiMap.js';

function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function parseMessage(str) {

    Object.keys(emojiMap).forEach(shortcode => {
        const regex = new RegExp(shortcode, 'g');
        str = str.replace(regex, emojiMap[shortcode]);
    });
    const safeStr = escapeHTML(str);
    const parsed = marked.parse(safeStr);
    const sanitized = DOMPurify.sanitize(parsed);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = sanitized;
    highlightMentions(wrapper);

    return wrapper.innerHTML;
}

function highlightMentions(node) {
    if (!username) return;
    if (node.nodeType === Node.TEXT_NODE) {
        const mentionRegex = new RegExp(`@${escapeRegExp(username)}\\b`, 'gi');
        const text = node.nodeValue;
        if (!mentionRegex.test(text)) return;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        mentionRegex.lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            const before = text.slice(lastIndex, match.index);
            if (before) fragment.appendChild(document.createTextNode(before));

            const mentionSpan = document.createElement('span');
            mentionSpan.className = 'mention';
            mentionSpan.textContent = match[0];
            fragment.appendChild(mentionSpan);

            lastIndex = match.index + match[0].length;
        }

        const after = text.slice(lastIndex);
        if (after) fragment.appendChild(document.createTextNode(after));

        node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        Array.from(node.childNodes).forEach(child => highlightMentions(child));
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ge(id) {
    return document.getElementById(id);
}

let messages = [];
let username, pfp, badges;
let currentReply = null;

fetch("/user", {
    method: 'GET',
    credentials: 'include', 
    headers: {
        'Content-Type': 'application/json'
    },
})
.then((response) => {
    if (!response.ok) {
        if (response.status === 401) {
            window.location.href = "/login"; 
        } else {
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.status} - ${text}`);
            });
        }
    }
    return response.json();
})
.then((data) => {
    username = data.username;
    pfp = data.pfp;
    badges = data.badges;
    if (data.muted) {
        const mutePopup = document.createElement('div');
        mutePopup.style.cssText = `
            display: flex;
            align-items: center;
            position: fixed;
            top: 10%;
            right: 0%;
            background-color: #6f057a;
            box-shadow: inset 0 -0.365vw #570066, 3px 3px 15px rgba(0, 0, 0, 0.6);
            color: red;
            padding: 10px 20px;
            z-index: 1000;
            width: 340px;
            height: 150x; 
            border-radius: 5px;
        `;

        const muteImage = document.createElement('img');
        muteImage.src = 'https://izumiihd.github.io/pixelitcdn/assets/img/blooks/logo.png';
        muteImage.style.width = '60px';
        muteImage.style.borderRadius = '5px';
        muteImage.onerror = function() {
            this.src = 'https://izumiihd.github.io/pixelitcdn/assets/img/blooks/blooks/logo.png';
        };

        const muteText = document.createElement('div');
        muteText.textContent = "You are currently serving a mute and players will not be able to see your messages. Mute duration: " + (data.muteDuration) + " minutes. Mute reason: " + (data.muteReason || "No reason provided.");
        muteText.style.color = 'red';
        muteText.style.marginLeft = '10px'; 

        mutePopup.appendChild(muteImage);
        mutePopup.appendChild(muteText);
        document.body.appendChild(mutePopup);
    }
})
.catch((error) => {
    console.error("Error fetching user data:", error);
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDate = date.toLocaleString(undefined, options).replace(',', '');

    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === new Date(now.setDate(now.getDate()-1)).toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return formattedDate;
    }
}

// message grouping stuff
function createMessageContent(message) {
    const content = document.createElement('div');
    const mediaUrlPattern = /(https?:\/\/[^\s]+\.(gif|jpeg|jpg|png|bmp|webp|svg|tiff|tif|ico)|data:image\/[a-zA-Z]+;base64,[^\s]+)/i;
    if (mediaUrlPattern.test(message.msg) && isValidUrl(message.msg)) {
        const img = document.createElement('img');
        img.src = message.msg;
        img.className = 'chatImages';
        img.style.marginTop = '10px';
        img.draggable = false;
        img.onclick = () => openModal(message.msg);
        img.onerror = function() {
            this.src = 'https://izumiihd.github.io/pixelitcdn/assets/img/blooks/logo.png';
        };
        content.appendChild(img);
    } else {
        content.innerHTML = parseMessage(message.msg);
        twemoji.parse(content);
    }
    return content;
}

function createGroupedMessageItem(message) {
    const wrapper = document.createElement('div');
    wrapper.className = 'groupedMessage';

    const textContainer = document.createElement('div');
    textContainer.className = 'messageText';

    if (message.replyTo) {
        const replyPreview = document.createElement('div');
        replyPreview.className = 'replyPreview';
        const previewText = `@${message.replyTo.sender}: ${message.replyTo.msg}`;
        replyPreview.textContent = previewText.length > 140 ? previewText.slice(0, 137) + '...' : previewText;
        textContainer.appendChild(replyPreview);
    }

    const content = createMessageContent(message);
    if (content.firstChild && content.firstChild.tagName === 'IMG') {
        textContainer.appendChild(content.firstChild);
    } else {
        textContainer.innerHTML += content.innerHTML;
    }

    if (username && new RegExp(`@${escapeRegExp(username)}\\b`, 'i').test(message.msg)) {
        wrapper.classList.add('mentionMessage');
    }

    const replyButton = document.createElement('button');
    replyButton.className = 'replyButton';
    replyButton.type = 'button';
    replyButton.innerHTML = '<i class="fa-solid fa-reply"></i>';
    replyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        setReplyTarget(message);
    });

    const messageRow = document.createElement('div');
    messageRow.className = 'messageRow';
    messageRow.appendChild(textContainer);
    messageRow.appendChild(replyButton);
    wrapper.appendChild(messageRow);
    return wrapper;
}

function createMessageGroupElement(group) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-group';
    wrapper.dataset.sender = group.sender;

    const pfpDiv = document.createElement('div');
    pfpDiv.className = 'pfp';
    const img = document.createElement('img');
    img.src = group.pfp;
    img.draggable = false;
    img.style.filter = 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))';
    img.onerror = function() {
        this.src = 'https://izumiihd.github.io/pixelitcdn/assets/img/blooks/logo.png';
    };
    pfpDiv.appendChild(img);

    const container = document.createElement('div');
    container.className = 'messageContainer';

    const header = document.createElement('div');
    header.className = 'usernameAndBadges';

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'username';
    usernameDiv.innerHTML = `${escapeHTML(group.sender)} <span class="timestamp" style="font-size: 10px;">${formatTimestamp(group.items[0].timestamp)}</span>`;

    const badgesDiv = document.createElement('div');
    badgesDiv.className = 'badges';
    badgesDiv.innerHTML = (group.badges || []).map(badge => `<img src="${escapeHTML(badge.image)}" draggable="false" class="badge" />`).join('');

    header.appendChild(usernameDiv);
    header.appendChild(badgesDiv);

    const groupedMessages = document.createElement('div');
    groupedMessages.className = 'groupedMessages';
    group.items.forEach(message => groupedMessages.appendChild(createGroupedMessageItem(message)));

    container.appendChild(header);
    container.appendChild(groupedMessages);
    wrapper.appendChild(pfpDiv);
    wrapper.appendChild(container);

    return wrapper;
}

function appendMessageToDOM(message) {
    const messagesContainer = ge('chatContainer');
    const lastGroup = messagesContainer.lastElementChild;
    const lastSender = lastGroup?.dataset?.sender;

    if (lastSender === message.sender) {
        const groupedMessages = lastGroup.querySelector('.groupedMessages');
        groupedMessages.appendChild(createGroupedMessageItem(message));
    } else {
        messagesContainer.appendChild(createMessageGroupElement({
            sender: message.sender,
            pfp: message.pfp,
            badges: message.badges,
            items: [message]
        }));
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setReplyTarget(message) {
    const target = message.replyTo || message;
    currentReply = {
        sender: target.sender,
        msg: target.msg,
        timestamp: target.timestamp
    };
    const replyBanner = ge('replyBanner');
    const replyBannerText = ge('replyBannerText');
    replyBannerText.innerHTML = `
        <div class="replyBannerTitle">Replying to @${escapeHTML(currentReply.sender)}</div>
        <div class="replyBannerMessage">${escapeHTML(currentReply.msg)}</div>
    `;
    replyBanner.style.display = 'flex';
    const sendField = ge('send');
    sendField.value = 'Reply: ';
    sendField.placeholder = 'Message';
    sendField.focus();
    sendField.setSelectionRange(sendField.value.length, sendField.value.length);
}

function clearReplyTarget() {
    currentReply = null;
    const replyBanner = ge('replyBanner');
    const replyBannerText = ge('replyBannerText');
    replyBannerText.textContent = '';
    replyBanner.style.display = 'none';
    const sendField = ge('send');
    sendField.value = '';
    sendField.placeholder = 'Message';
}

function openModal(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImage.src = imageSrc;
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        closeModal();
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

document.addEventListener("paste", (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result; 
                const timestamp = Date.now(); 
                const chatMessage = { sender: username, msg: imageUrl, badges, pfp, timestamp }; 
                appendMessageToDOM(chatMessage);
                socket.emit("message", chatMessage); 
            };
            reader.readAsDataURL(file); 
            break; 
        }
    }
});

// more message grouping stff duh
function updateMessages(newMessages) {
    const messagesContainer = ge('chatContainer');
    const fragment = document.createDocumentFragment();

    const grouped = [];
    newMessages.forEach(message => {
        const previousGroup = grouped[grouped.length - 1];
        if (previousGroup && previousGroup.sender === message.sender) {
            previousGroup.items.push(message);
        } else {
            grouped.push({
                sender: message.sender,
                pfp: message.pfp,
                badges: message.badges,
                items: [message]
            });
        }
    });

    grouped.forEach(group => fragment.appendChild(createMessageGroupElement(group)));

    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(fragment);
}

const byte = (str) => new Blob([str]).size;

document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    console.info("Chat service initialized and connection established.");
    const sendInput = ge("send"); 
    const filteredWords = ["nigger", "nigga", "chink", "tranny", "faggot", "nga"];
    let lastMessageTime = 0; 

    sendInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const msg = e.target.value.trim();
            if (msg === "") {
                e.target.value = "";
                return;
            }
            if (byte(msg) > 1000) {
                alert("Message is too long!");
                e.target.value = "";
                return;
            }

            const currentTime = Date.now();
            if (currentTime - lastMessageTime < 2000) {
                return;
            }

            const timestamp = currentTime;
            const chatMessage = {
                sender: username,
                msg,
                badges,
                pfp,
                timestamp,
                replyTo: currentReply ? { sender: currentReply.sender, msg: currentReply.msg, timestamp: currentReply.timestamp } : undefined
            };
            const lowerCaseMessage = msg.toLowerCase();
            const containsFilteredWord = filteredWords.some(word => lowerCaseMessage.includes(word));
            if (containsFilteredWord) {
                alert("Your message has been flagged for inappropriate content and has been logged in the audit logs for staff to review.");
                socket.emit("logFilteredMessage", {
                    username: username,
                    message: msg,
                    timestamp: timestamp
                });
                e.target.value = ""; 
                return; 
            }

            appendMessageToDOM(chatMessage);
            socket.emit("message", chatMessage);
            e.target.value = "";
            clearReplyTarget();
            lastMessageTime = currentTime;
        }
    });

    socket.on("chatupdate", (data) => {
        if (Array.isArray(data) && data.length > 0) {
            messages = data;
            updateMessages(messages);
            twemoji.parse(document.body); 
            const messagesContainer = ge("chatContainer");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;  
        }
    });

    // erm reply stuff
    const cancelReplyButton = ge('cancelReplyButton');
    cancelReplyButton?.addEventListener('click', () => {
        clearReplyTarget();
    });

    function adjustInputHeight(input) {
        input.style.height = '30%'; 
        const maxWidth = window.innerWidth * 0.9; 
        const currentWidth = Math.min(maxWidth, input.value.length * 10); 
        input.style.width = `100%`;
    }

    socket.emit("getChat");
});


document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.querySelector('.chatContainer');

    messagesContainer.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('messageText')) {
            event.target.style.wordBreak = 'break-word';
            event.target.style.whiteSpace = 'normal'; 
            event.target.style.overflowWrap = 'break-word'; 
        }
    });

    messagesContainer.addEventListener('mouseout', function(event) {
        if (event.target.classList.contains('messageText')) {
            event.target.style.whiteSpace = 'normal'; 
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('/user') 
    .then(response => response.json())
    .then(data => {
      const userRole = data.role;
      const allowedRoles = ['Owner', 'Admin', 'Moderator', 'Helper', 'Developer', 'Community Manager'];
      if (allowedRoles.includes(userRole)) {
        document.getElementById('wrench-icon').style.display = 'inline';
      }
    })
  .catch(error => {
   console.error('Error fetching user role:', error);
    });
});

function logout() {
  fetch('/logout', { method: 'POST' })
    .then(response => {
      if (response.ok) {
        sessionStorage.clear();
        localStorage.removeItem('loggedIn');
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    })
    .catch(error => console.error('Error:', error));
}

window.openModal = openModal;
window.closeModal = closeModal;