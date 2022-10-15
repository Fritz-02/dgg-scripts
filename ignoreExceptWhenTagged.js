// ==UserScript==
// @name         Ignore Except When Tagged
// @namespace    https://www.destiny.gg/
// @version      2.0.0
// @description  Does what /ignore does (and more), except you'll see messages you're tagged in.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreExceptWhenTagged.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreExceptWhenTagged.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.0.0.min.js
// ==/UserScript==

const settingItems = [
  new SettingItem("ignored", [], "textarea", {
    text: "Ignored chatters",
    placeholder: "Comma separated...",
  }),
  new SettingItem("harshIgnored", [], "textarea", {
    text: "Harsh ignored chatters",
    placeholder: "Comma separated...",
  }),
];
const settings = new Settings(
  "ignore except when tagged",
  settingItems,
  "iewt-"
);
settings.build();


let prevMsgDeleted = false;
const ignoredClassNames = ["msg-highlight", "msg-historical", "msg-own"];
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const message = mutation.addedNodes[i];
      const textElement = message.querySelector("span.text");
      const text = textElement ? textElement.textContent.toLowerCase() : "";
      const username = message.getAttribute("data-username");
      if (ignoredClassNames.some((v) => message.className.includes(v))) {
        continue;
      }
      const ignored = settings.ignored;
      const harshIgnored = settings.harshIgnored;
      if (
        ignored.includes(username) ||
        harshIgnored.includes(username) ||
        harshIgnored.some((v) => text.includes(v))
      ) {
        message.remove();
        prevMsgDeleted = true;
      } else {
        if (message.className.includes("msg-continue") && prevMsgDeleted) {
          message.classList.remove("msg-continue");
        }
        prevMsgDeleted = false;
      }
    }
  });
});

let target = document.querySelector(".chat-lines.nano-content");
observer.observe(target, { childList: true });
