// File: transition.js

// Get DOM elements
const proceedButton = document.querySelector('.proceed');
const returnButton = document.querySelector('.return');

// Function to proceed to new tab
function proceedToNewTab() {
    window.close();
}

// Function to return to previous tab
function returnToPreviousTab() {
    browser.runtime.sendMessage({ action: 'returnToPrevious' });
}

// Add event listeners
proceedButton.addEventListener('click', proceedToNewTab);
returnButton.addEventListener('click', returnToPreviousTab);