// ==UserScript==
// @name         [dev] DGG NSFW Ignorer
// @namespace    https://www.destiny.gg/
// @version      dev-2022.09.23
// @description  Ignores NSFW messages from specified chatters.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/dev/ignoreNSFW.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/dev/ignoreNSFW.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.0.0.min.js
// ==/UserScript==

const settingItems = [
  new SettingItem("ignoredChatters", [], "textarea", {
    text: "Ignored NSFW posters",
    placeholder: "Comma separated...",
  }),
  new SettingItem("showMentions", false, "checkbox", {
    text: "Always show mentions",
    hint: "Show ignored nsfw when mentioned",
    name: "nsfwMentionCheckbox",
  }),
];
const settings = new Settings(
  "Ignore NSFW Posters",
  settingItems,
  "fritz-nsfw."
);
settings.build();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const message = mutation.addedNodes[i];
      const username = message.getAttribute("data-username");
      const isNSFW = message.querySelector(".externallink.nsfw-link");
      if (
        settings.showMentions &&
        message.className.includes("msg-highlight")
      ) {
        continue;
      }
      if (isNSFW && settings.ignoredChatters.includes(username)) {
        message.remove();
      }
    }
  });
});

let target = document.querySelector(".chat-lines.nano-content");
observer.observe(target, { childList: true });
