chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "createTab") {
        chrome.tabs.create({ url: message.url, active: true });
    } else if (message.action === "updateTab") {
        chrome.tabs.update({ url: message.url });
    }
    return true;
});