const REDIRECT_PATH = '/iframe/issue-tracker-testcase/';
const TARGET_BASE = 'https://testops.moscow.alfaintra.net/project/163/test-cases/';

function handleClick(e) {
    const link = e.target.closest('a[href*="/iframe/issue-tracker-testcase/"]');
    if (!link) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    try {
        const url = new URL(link.href);
        const pathParts = url.pathname.split('/');
        const targetIndex = pathParts.indexOf('issue-tracker-testcase');
        
        if (targetIndex === -1 || targetIndex >= pathParts.length - 1) return;
        
        const targetId = pathParts[targetIndex + 1];
        if (!/^\d+$/.test(targetId)) return;

        const newUrl = `${TARGET_BASE}${targetId}`;
        const isMiddleClick = e.button === 1 || e.type === 'auxclick';
        const isModifiedClick = e.metaKey || e.ctrlKey;

        chrome.runtime.sendMessage({
            action: isMiddleClick || isModifiedClick ? "createTab" : "updateTab",
            url: newUrl
        });

    } catch (error) {
        console.error('Redirect Error:', error);
    }
}

document.addEventListener('auxclick', handleClick, true);
document.addEventListener('click', handleClick, true);