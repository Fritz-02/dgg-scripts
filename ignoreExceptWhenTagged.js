// ==UserScript==
// @name         Ignore Except When Tagged
// @namespace    https://www.destiny.gg/
// @version      1.2.2
// @description  Does what /ignore does, except you'll see messages you're tagged in.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreExceptWhenTagged.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreExceptWhenTagged.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions.js
// ==/UserScript==


createStorageItem("iewt-ignored", []);
createStorageItem("iewt-harshIgnored", []);

newSettingGroup("ignore except when tagged");
createSetting({
    "text": "Ignored chatters",
    "type": "textarea",
    "placeholder": "Comma separated...",
    "storageName": "iewt-ignored"
});
createSetting({
    "text": "Harsh ignored chatters",
    "type": "textarea",
    "placeholder": "Comma separated...",
    "storageName": "iewt-harshIgnored"
});


const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let textElement = message.querySelector("span.text");
            let text = textElement ? textElement.textContent.toLowerCase() : "";
            let username = message.getAttribute("data-username");
            if (message.className.includes("msg-highlight") || message.className.includes("msg-own") || message.className.includes("msg-historical")) {
                continue;
            }
            if (storage["iewt-ignored"].includes(username) || storage["iewt-harshIgnored"].includes(username)|| storage["iewt-harshIgnored"].some(v => text.includes(v))) {
                message.remove();
            }
        }
    });
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
