const TARGET_BASE = 'https://testops.moscow.alfaintra.net/project/163/test-cases/';
const TARGET_PATTERN = /\/iframe\/issue-tracker-testcase\/\d+/;
let lastProcessedLink = null;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "createTab") {
        chrome.tabs.create({ url: message.url, active: true });
    } else if (message.action === "updateTab") {
        chrome.tabs.update({ url: message.url });
    } else if (message.action === "storeLink") {
        lastProcessedLink = message.url;
    }
    return true;
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'redirect-context-menu',
        title: "Открыть в ТестОпс",
        contexts: ["link"],
        targetUrlPatterns: ["*://*.net/iframe/issue-tracker-testcase/*"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'redirect-context-menu' && lastProcessedLink) {
        const newUrl = processLink(lastProcessedLink);
        if (newUrl) {
            chrome.tabs.create({ url: newUrl, active: true });
        }
    }
});

function processLink(linkUrl) {
    try {
        const url = new URL(linkUrl);
        const pathParts = url.pathname.split('/');
        const targetIndex = pathParts.indexOf('issue-tracker-testcase');

        if (targetIndex === -1 || targetIndex >= pathParts.length - 1) return null;

        const targetId = pathParts[targetIndex + 1];
        if (!/^\d+$/.test(targetId)) return null;

        return `https://testops.moscow.alfaintra.net/project/163/test-cases/${targetId}`;
    } catch (error) {
        console.error('Link processing error:', error);
        return null;
    }
}