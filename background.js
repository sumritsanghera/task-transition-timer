//background.js
let lastActiveTab = null;
let transitionInProgress = false;

browser.tabs.onActivated.addListener(async (activeInfo) => {
  if (transitionInProgress) return;
  
  const currentTab = await browser.tabs.get(activeInfo.tabId);
  if (!lastActiveTab) {
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

  // After 5 seconds, close transition and go to intended tab
  setTimeout(async () => {
    await browser.tabs.remove(transitionTab.id);
    await browser.tabs.update(currentTab.id, { active: true });
    lastActiveTab = currentTab;
    transitionInProgress = false;
  }, 5000);
});
