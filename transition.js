// File: transition.js

// Initialize variables
let timeLeft = 5;
let timerInterval;

// Get DOM elements
const timerElement = document.querySelector('.timer');
const proceedButton = document.querySelector('.proceed');
const returnButton = document.querySelector('.return');

// Function to start countdown
function startCountdown() {
    // Get saved transition time from storage
    browser.storage.local.get('transitionTime')
        .then((data) => {
            timeLeft = data.transitionTime || 5;
            timerElement.textContent = timeLeft;
            
            timerInterval = setInterval(() => {
                timeLeft--;
                timerElement.textContent = timeLeft;
                
                if (timeLeft === 0) {
                    clearInterval(timerInterval);
                    proceedToNewTab();
                }
            }, 1000);
        });
}

// Function to proceed to new tab
function proceedToNewTab() {
    // Update statistics
    browser.storage.local.get('taskStays')
        .then((data) => {
            const stays = (data.taskStays || 0) + 1;
            browser.storage.local.set({ taskStays: stays });
        });
    
    window.close();
}

// Function to return to previous tab
function returnToPreviousTab() {
    // Update statistics
    browser.storage.local.get('taskReturns')
        .then((data) => {
            const returns = (data.taskReturns || 0) + 1;
            browser.storage.local.set({ taskReturns: returns });
        });
    
    browser.runtime.sendMessage({ action: 'returnToPrevious' });
}

// Add event listeners
proceedButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    proceedToNewTab();
});

returnButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    returnToPreviousTab();
});

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', startCountdown);