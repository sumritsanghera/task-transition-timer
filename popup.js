// popup.js
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    browser.storage.local.get(['transitionTime', 'enabled', 'taskStays', 'taskReturns'])
      .then((data) => {
        document.getElementById('transitionTime').value = data.transitionTime || 5;
        document.getElementById('enableExtension').checked = data.enabled !== false;
        document.getElementById('taskStays').textContent = data.taskStays || 0;
        document.getElementById('taskReturns').textContent = data.taskReturns || 0;
      });
  
    // Save transition time when changed
    document.getElementById('transitionTime').addEventListener('change', (e) => {
      browser.storage.local.set({ transitionTime: parseInt(e.target.value) });
    });
  
    // Toggle extension
    document.getElementById('enableExtension').addEventListener('change', (e) => {
      browser.storage.local.set({ enabled: e.target.checked });
    });
  
    // Reset statistics
    document.getElementById('resetStats').addEventListener('click', () => {
      browser.storage.local.set({ taskStays: 0, taskReturns: 0 })
        .then(() => {
          document.getElementById('taskStays').textContent = '0';
          document.getElementById('taskReturns').textContent = '0';
        });
    });
  });