// ==UserScript==
// @name         DGG NSFW Link Shortener
// @namespace    https://www.destiny.gg/
// @version      1.0
// @description  Shortens extremely long nsfw links in chat
// @author       Fritz
// @match        www.destiny.gg/embed/chat*
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/nsfwLinkShortener.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/nsfwLinkShortener.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions.js
// ==/UserScript==

createStorageItem("nsfwLinkMaxLength", 150);
newSettingGroup("nsfw link shortener");
createSetting({
    "text": "NSFW Link Max Length",
    "type": "input-number",
    "name": "NSFW Link Max Length",
    "placeholder": 100,
    "min": 10,
    "storageName": "nsfwLinkMaxLength"
});

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let nsfwLinks = message.querySelectorAll(".externallink.nsfw-link");
            nsfwLinks.forEach((link) => {
                let nsfwText = link.innerText;
                if (nsfwText.length > storage.nsfwLinkMaxLength) {
                    let newText = nsfwText.slice(0, storage.nsfwLinkMaxLength - 3) + "...";
                    link.textContent = newText;
                }
            });
        }
    })
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
