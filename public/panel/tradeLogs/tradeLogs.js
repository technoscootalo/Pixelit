let allLogs = [];

async function fetchTradeLogs() {
  try {
    const res = await fetch('/getTradeLogs', {
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    const container = document.getElementById('logsContainer');
    container.innerHTML = '';

    if (!data.success || !data.logs || data.logs.length === 0) {
      container.innerHTML = '<p>No trade logs found in the past 24 hours.</p>';
      document.getElementById('result-count').textContent = '';
      return;
    }

    allLogs = data.logs;
    renderLogs(allLogs);
  } catch (err) {
    console.error('Error fetching trade logs:', err);
    document.getElementById('logsContainer').innerHTML = '<p>Error loading trade logs.</p>';
    document.getElementById('result-count').textContent = '';
  }
}

function renderLogs(logs) {
  const container = document.getElementById('logsContainer');
  container.innerHTML = '';

  if (logs.length === 0) {
    container.innerHTML = '<p>No matching trade logs found.</p>';
    document.getElementById('result-count').textContent = '0 results';
    return;
  }

  document.getElementById('result-count').textContent = logs.length + ' result' + (logs.length !== 1 ? 's' : '');

  logs.forEach(log => {
    const card = document.createElement('div');
    card.className = 'log-card';

    const time = new Date(log.timestamp).toLocaleString();

    const senderPixels = (log.senderOffer?.pixels || []).map(p => `${p.name} x${p.quantity}`).join(', ') || 'None';
    const recipientPixels = (log.recipientOffer?.pixels || []).map(p => `${p.name} x${p.quantity}`).join(', ') || 'None';

    card.innerHTML = `
      <strong>Trade ID:</strong> ${log.tradeId}<br>
      <strong>${log.sender}</strong> traded with <strong>${log.recipient}</strong><br>
      <em>${time}</em>
      <div class="offer-section">
        <strong>${log.sender}</strong> offered:<br>
        <span>Tokens: ${log.senderOffer?.tokens || 0} | Pixels: ${senderPixels}</span>
      </div>
      <div class="offer-section">
        <strong>${log.recipient}</strong> offered:<br>
        <span>Tokens: ${log.recipientOffer?.tokens || 0} | Pixels: ${recipientPixels}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterLogs() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const filterType = document.getElementById('filter-type').value;

  if (!query) {
    renderLogs(allLogs);
    return;
  }

  const filtered = allLogs.filter(log => {
    if (filterType === 'tradeId') {
      return log.tradeId.toLowerCase().includes(query);
    }
    if (filterType === 'username') {
      return log.sender.toLowerCase().includes(query) || log.recipient.toLowerCase().includes(query);
    }
    if (filterType === 'item') {
      const senderItems = (log.senderOffer?.pixels || []).map(p => p.name.toLowerCase()).join(' ');
      const recipientItems = (log.recipientOffer?.pixels || []).map(p => p.name.toLowerCase()).join(' ');
      return senderItems.includes(query) || recipientItems.includes(query);
    }
    const tradeIdMatch = log.tradeId.toLowerCase().includes(query);
    const userMatch = log.sender.toLowerCase().includes(query) || log.recipient.toLowerCase().includes(query);
    const senderItems = (log.senderOffer?.pixels || []).map(p => p.name.toLowerCase()).join(' ');
    const recipientItems = (log.recipientOffer?.pixels || []).map(p => p.name.toLowerCase()).join(' ');
    const itemMatch = senderItems.includes(query) || recipientItems.includes(query);
    return tradeIdMatch || userMatch || itemMatch;
  });

  renderLogs(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchTradeLogs();

  document.getElementById('search-btn').addEventListener('click', filterLogs);
  document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') filterLogs();
  });
  document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-type').value = 'all';
    renderLogs(allLogs);
  });
  document.getElementById('filter-type').addEventListener('change', filterLogs);
});

