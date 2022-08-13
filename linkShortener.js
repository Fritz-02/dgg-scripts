// ==UserScript==
// @name         DGG Link Shortener
// @namespace    https://www.destiny.gg/
// @version      1.0
// @description  Shortens extremely long links in chat
// @author       Fritz
// @match        www.destiny.gg/embed/chat*
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/linkShortener.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/linkShortener.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions.js
// ==/UserScript==

createStorageItem("linkMaxLength", 150);
newSettingGroup("link shortener");
createSetting({
    "text": "Link Max Length",
    "type": "input-number",
    "name": "Link Max Length",
    "placeholder": 100,
    "min": 10,
    "storageName": "linkMaxLength"
});

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let links = message.querySelectorAll(".externallink");
            links.forEach((link) => {
                let linkText = link.innerText;
                if (linkText.length > storage.linkMaxLength) {
                    let newText = linkText.slice(0, storage.linkMaxLength - 3) + "...";
                    link.textContent = newText;
                }
            });
        }
    })
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
