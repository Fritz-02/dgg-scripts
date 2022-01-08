// ==UserScript==
// @name         Hide Untagged Users
// @namespace    https://www.destiny.gg/
// @version      0.1.2
// @description  Hides untagged users' messages except when tagged
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/hideUntaggedUsers.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/hideUntaggedUsers.js
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// ==/UserScript==


const tagList = window.localStorage.getItem("chat.settings") ? JSON.parse(window.localStorage.getItem("chat.settings"))[11][1] : [];
const taggedUsers = tagList.map(item => item[0]);
const msgTypes = ["msg-highlight", "msg-own", "msg-ui", "msg-status", "msg-info", "msg-whisper", "msg-broadcast"];


const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let username = message.getAttribute("data-username");
            if (msgTypes.some(v => message.className.includes(v)) || taggedUsers.includes(username)) {
                continue;
            } else {
                message.remove();
            }
        }
    });
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
