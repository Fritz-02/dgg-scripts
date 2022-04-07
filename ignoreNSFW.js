// ==UserScript==
// @name         DGG NSFW Ignorer
// @namespace    https://www.destiny.gg/
// @version      1.1.2
// @description  Ignores NSFW messages from specified chatters.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreNSFW.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreNSFW.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions.js
// ==/UserScript==


createStorageItem("nsfwIgnoredChatters", []);
createStorageItem("nsfwShowMentions", false);

console.log(storage);

newSettingGroup("ignore nsfw posters");
createSetting({
    "text": "Ignored NSFW posters",
    "type": "textarea",
    "placeholder": "Comma separated...",
    "storageName": "nsfwIgnoredChatters"
});
createSetting({
    "text": "Always show mentions",
    "name": "nsfwMentionCheckbox",
    "type": "checkbox",
    "hint": "Show ignored nsfw when mentioned",
    "storageName": "nsfwShowMentions"
});


const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let username = message.getAttribute("data-username");
            let isNSFW = message.querySelector('.externallink.nsfw-link');
            if (storage.nsfwShowMentions) {
                let isHighlighted = message.className.includes("msg-highlight");
                if (isHighlighted) {
                    continue;
                }
            }
            if (isNSFW && storage.nsfwIgnoredChatters.includes(username)) {
                message.remove();
            }
        }
    })
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
