const username = ge("username");
const tokens = ge("tokens");
const sent = ge("messages");
const spin = ge("spin");
const packsOpened = ge("packs");

let isViewingOtherUser = false;
let searchUsername = null;
let currentUserData = null;

if (localStorage.loggedin == "true") {
  sessionStorage = localStorage;
}

function ge(id) {
  return document.getElementById(id);
}

function getSearchParameter() {
  const params = new URLSearchParams(window.location.search);
  return params.get('search');
}

document.addEventListener('DOMContentLoaded', function() {
    searchUsername = getSearchParameter();
    if (searchUsername) {
      fetch("/user", {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        if (data.username.toLowerCase() === searchUsername.toLowerCase()) {
          window.location.href = '/dashboard';
        } else {
          isViewingOtherUser = true;
          fetchOtherUserData(searchUsername);
        }
      })
      .catch(error => {
        console.error('Error checking current user:', error);
        window.location.href = '/dashboard';
      });
    } else {
      fetchCurrentUserData();
    }
});

function fetchOtherUserData(searchUser) {
  fetch('/getUserStats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: searchUser }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      displayUserProfile(data.user, true);
    } else {
      alert('User not found.');
      window.location.href = '/dashboard';
    }
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
    alert('Error loading user profile.');
    window.location.href = '/dashboard';
  });
}

function fetchCurrentUserData() {
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
      displayUserProfile(data, false);
    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });
}

function displayUserProfile(data, isOther) {
  if (!isOther) {
    currentUserData = data;
  }
  const badgesContainer = document.getElementById("badges");
  const badgesContainerParent = document.getElementById("badges-container");
  badgesContainer.innerHTML = ""; 

  if (!data.badges || data.badges.length === 0) {
      badgesContainerParent.style.display = 'none'; 
  } else {
      badgesContainerParent.style.display = 'block';
      data.badges.forEach(badge => {
          const badgeHTML = `<img src="${badge.image}" alt="${badge.name}" class="badge" />`;
          badgesContainer.innerHTML += badgeHTML;
      });
  }
  
  username.innerHTML = data.username;
  ge("role").innerHTML = data.role;
  
  const pfpImg = ge("pfp");
  const bannerImg = ge("banner");
  
  if (data.pfp) {
    pfpImg.src = data.pfp;
  }
  pfpImg.onerror = function () { this.src = "https://izumiihd.github.io/pixelitcdn/assets/img/blooks/logo.png"; };
  
  if (data.banner) {
    bannerImg.src = data.banner;
  }
  bannerImg.onerror = function () { this.src = "https://via.placeholder.com/1500x500?text=Banner"; };
  
  const usernameElement = ge("username");
  const roleColors = {
    "Owner": "#020202",
    "Veteran": "#969a5c",
    "Verified": "#5ab65b",
    "Plus": "#5657d3",
    "Tester": "#80a1d3",
    "Helper": "#4b69c3",
    "Moderator": "#ab53c4",
    "Admin": "#dc6dc1",
    "Community Manager": "#69c95d",
    "Developer": "#6a76c7",
    "Artist": "#ca964c"
  };
  
  if (roleColors[data.role]) {
    usernameElement.style.color = roleColors[data.role];
    ge("role").style.color = roleColors[data.role];
  }

  const stats = data.stats || {};
  ge("tokens").textContent = formatNumber(data.tokens);
  ge("messages").textContent = formatNumber(stats.sent);
  ge("packs").textContent = formatNumber(stats.packsOpened);

  updateButtonsForViewingMode(isOther, data.username);
  
  if (!isOther) {
    setupPfpClickListener(data.packs);
    if (sessionStorage.loggedin === "true") {
      updateTokens();
  }
  }
}
  

function setupPfpClickListener(packs) {
  const pfpImg = ge("pfp");
  if (pfpImg) {
    pfpImg.onclick = () => openPfpChangeModal(packs);
  }
}

function handlePfpClick() {
  if (currentUserData) {
    openPfpChangeModal(currentUserData.packs);
  }
}

function openPfpChangeModal(packs) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: #6f057a;
    box-shadow: inset 0 -0.365vw #61056b, 3px 3px 15px rgba(0, 0, 0, 0.6);
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 950px
    max-height: 100vh;
    overflow-y: auto;
    font-family: 'pixelify sans';
  `;

  const title = document.createElement('h2');
  title.textContent = 'Select A Profile Picture';
  title.style.cssText = `
    color: white;
    text-align: center;
    margin-bottom: 20px;
  `;
  modalContent.appendChild(title);

  const pixelGrid = document.createElement('div');
  pixelGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
  `;

  packs.forEach(pack => {
    if (pack.blooks && pack.blooks.length > 0) {
      pack.blooks.forEach(blook => {
        if (blook.owned && blook.owned > 0) {
          const pixelItem = document.createElement('div');
          pixelItem.style.cssText = `
            text-align: center;
            cursor: pointer;
            border-radius: 5px;
            padding: 8px;
            background-color: #6f057a;
            box-shadow: inset 0 -0.365vw #61056b, 3px 3px 15px rgba(0, 0, 0, 0.6);
          `;
          pixelItem.onmouseover = () => {
            pixelItem.style.transform = 'scale(1.1)';
          };
          pixelItem.onmouseout = () => {
            pixelItem.style.transform = 'scale(1)';
          };

          const img = document.createElement('img');
          img.src = blook.imageUrl;
          img.style.cssText = `
            width: 70px;
            height: 70px;
            object-fit: contain;
            margin-bottom: 5px;
          `;

          const label = document.createElement('div');
          label.textContent = blook.name;
          label.style.cssText = `
            color: white;
            font-size: 12px;
            word-wrap: break-word;
          `;

          pixelItem.appendChild(img);
          pixelItem.appendChild(label);

          pixelItem.onclick = async () => {
            try {
              const response = await fetch('/changePfp', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: blook.name, parent: pack.name })
              });

              if (response.ok) {
                const pfpImg = ge('pfp');
                pfpImg.src = blook.imageUrl;
                document.body.removeChild(modal);
              } else {
                alert('Error changing profile picture');
              }
            } catch (error) {
              console.error('Error:', error);
              alert('Error changing profile picture');
            }
          };

          pixelGrid.appendChild(pixelItem);
        }
      });
    }
  });

  modalContent.appendChild(pixelGrid);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    background-color: #b30000;
    box-shadow: inset 0 -0.365vw #800000, 3px 3px 15px rgba(0, 0, 0, 0.6);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'pixelify sans';
    font-size: 14px;
    width: 100%;
    margin-top: 10px;
  `;
  closeButton.onmouseover = () => {
    closeButton.style.boxShadow = 'inset 0 -0.5vw #800000, 3px 3px 15px rgba(0, 0, 0, 0.6)';
  };
  closeButton.onmouseout = () => {
    closeButton.style.boxShadow = 'inset 0 -0.365vw #800000, 3px 3px 15px rgba(0, 0, 0, 0.6)';
  };
  closeButton.onclick = () => document.body.removeChild(modal);
  modalContent.appendChild(closeButton);

  modal.appendChild(modalContent);
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };

  document.body.appendChild(modal);
}

function updateButtonsForViewingMode(isOther, username) {
  const unlockButton = document.querySelector('.unlockBlooks');
  const manageButton = document.querySelector('.manageBlooks');
  const claimButton = document.querySelector('.spin');
  const viewUserButton = document.querySelector('.viewUser');
  
  if (isOther) {
    if (unlockButton) unlockButton.style.display = 'none';
    if (manageButton) manageButton.style.display = 'none';
    if (claimButton) claimButton.style.display = 'none';
    if (viewUserButton) viewUserButton.style.display = 'none';
    
    const buttonContainer = document.querySelector('.button_container');
    if (buttonContainer) {
      const backButton = document.createElement('button');
      backButton.className = 'button';
      backButton.innerHTML = '<i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i>Back';
      backButton.style.backgroundColor = '#1976d2';
      backButton.style.boxShadow = 'inset 0 -0.265vw #0d47a1, 3px 3px 15px rgba(0, 0, 0, 0.6)';
      backButton.onclick = () => window.location.href = '/dashboard';
      buttonContainer.appendChild(backButton);
    }
  }
}

function updateTokens() {
  socket.emit("getTokens", sessionStorage.username);
}

socket.on("tokens", (tokensr, sentr, messagesCount, packsOpenedr) => { 
    document.getElementById('tokens').textContent = formatNumber(tokensr);
    document.getElementById('messages').textContent = formatNumber(sentr);
    const messagesElement = document.getElementById('messages');
    messagesElement.textContent = formatNumber(messagesCount); 
    document.getElementById('packs').textContent = formatNumber(packsOpenedr);
});

function formatNumber(num) {
  if (num === null || num === undefined || num === '0') return '0';
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

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

function openViewUserPopup() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: #6f057a;
    box-shadow: inset 0 -0.365vw #61056b, 3px 3px 15px rgba(0, 0, 0, 0.6);
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    font-size: 26px;
    width: 420px;
  `;

  const title = document.createElement('h2');
  title.textContent = "View User";
  modalContent.appendChild(title);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Username';
  input.id = 'viewUsernameInput';
  input.style.cssText = `
    width: 60%;
    height: 50px;
    margin-bottom: 10px;
    display: inline;
    font-family: 'pixelify sans';
    font-size: 28px;
    text-align: center;
    border: 3px solid #5e046e;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: transparent;
    color: white;
    margin-right: 5px;
    appearance: textfield;
    -webkit-appearance: none;
  `;
  modalContent.appendChild(input);

  const br = document.createElement('br');
  modalContent.appendChild(br);

  const viewButton = document.createElement('button');
  viewButton.textContent = 'View Profile';
  viewButton.style.cssText = `
    background-color: green;
    box-shadow: inset 0 -0.365vw #006400, 3px 3px 15px rgba(0, 0, 0, 0.6);
    font-family: 'pixelify sans';
    color: white;
    padding: 10px 20px;
    margin: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    margin-left: 60px;
  `;

  viewButton.onmouseover = () => {
    viewButton.style.boxShadow = 'inset 0 -0.5vw #006400, 3px 3px 15px rgba(0, 0, 0, 0.6)';
  };

  viewButton.onmouseout = () => {
    viewButton.style.boxShadow = 'inset 0 -0.365vw #006400, 3px 3px 15px rgba(0, 0, 0, 0.6)';
  };

  viewButton.onclick = () => {
    const searchUser = input.value.trim();
    if (!searchUser) {
      alert('Please enter a username.');
      return;
    }
    window.location.href = `/dashboard?search=${encodeURIComponent(searchUser)}`;
  };

  modalContent.appendChild(viewButton);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = `
    background-color: red;
    box-shadow: inset 0 -0.365vw #b30000, 3px 3px 15px rgba(0, 0, 0, 0.6);
    font-family: 'pixelify sans';
    color: white;
    padding: 10px 20px;
    margin: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    margin-right: 60px;
  `;

  cancelButton.onmouseover = () => {
    cancelButton.style.boxShadow = 'inset 0 -0.5vw #b30000, 3px 3px 15px rgba(0, 0, 0, 0.6)';
  };

  cancelButton.onmouseout = () => {
    cancelButton.style.boxShadow = 'inset 0 -0.365vw #b30000, 3px 3px 15px rgba(0, 0, 0, 0.6)';
  };

  cancelButton.onclick = () => {
    document.body.removeChild(modal);
  };

  modalContent.appendChild(cancelButton);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  input.focus();
}

document.addEventListener('DOMContentLoaded', function() {
  const viewUserButton = document.querySelector('.viewUser');
  if (viewUserButton) {
    viewUserButton.addEventListener('click', openViewUserPopup);
  }
});