// ==UserScript==
// @name         DGG Link Shortener
// @namespace    https://www.destiny.gg/
// @version      2.0.0
// @description  Shortens extremely long links in chat.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/linkShortener.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/linkShortener.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.0.0.min.js
// ==/UserScript==

const settingItems = [
    new SettingItem("linkMaxLength", 150, "input-number", {
      text: "Link Max Length",
      name: "Link Max Length",
      placeholder: 100,
      min: 10,
    }),
    new SettingItem("onlyNSFW", false, "checkbox", {
        text: "Only shorten NSFW links",
        name: "nsfwMentionCheckbox"
      }),
  ];
const settings = new Settings(
    "Link Shortener",
    settingItems,
    "fritz-shortener."
);
settings.build();

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            const message = mutation.addedNodes[i];
            const links = message.querySelectorAll(settings.onlyNSFW ? ".externallink.nsfw-link" : ".externallink");
            const maxLength = settings.linkMaxLength;
            links.forEach((link) => {
                const linkText = link.innerText;
                if (linkText.length > maxLength) {
                    link.textContent = linkText.slice(0, maxLength - 3) + "...";
                }
            });
        }
    })
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
