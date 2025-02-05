// File: background.js

let lastActiveTab = null;
let transitionInProgress = false;

browser.tabs.onActivated.addListener(async (activeInfo) => {
    if (transitionInProgress) return;
    
    const currentTab = await browser.tabs.get(activeInfo.tabId);
    if (!lastActiveTab) {
        lastActiveTab = currentTab;
        return;
    }

    // Skip internal Firefox pages and extension pages
    if (!currentTab.url || 
        currentTab.url.startsWith('about:') || 
        currentTab.url.startsWith('moz-extension://')) {
        lastActiveTab = currentTab;
        return;
    }

    // Skip transition for same-domain tabs
    if (new URL(currentTab.url).hostname === new URL(lastActiveTab.url).hostname) {
        lastActiveTab = currentTab;
        return;
    }

    transitionInProgress = true;
    
    // Create transition page
    const transitionTab = await browser.tabs.create({
        url: browser.runtime.getURL("transition.html"),
        active: true
    });
});

// Handle return to previous tab request
browser.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'returnToPrevious' && lastActiveTab) {
        try {
            await browser.tabs.update(lastActiveTab.id, { active: true });
            transitionInProgress = false;
        } catch (error) {
            console.error('Error returning to previous tab:', error);
            transitionInProgress = false;
        }
    }
});