// ==UserScript==
// @name         DGG No White Links
// @namespace    https://www.destiny.gg/
// @version      1.0.1
// @description  Removes any links posted by white names (except for white names with flairs)
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/noWhiteLinks.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/noWhiteLinks.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// ==/UserScript==

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const message = mutation.addedNodes[i];
      const hasFlairs = message.querySelector("span.features");
      const links = message.querySelectorAll(".externallink");
      if (!hasFlairs && links) {
        links.forEach((link) => {
          link.textContent = "[redacted link]";
          link.removeAttribute("href");
        });
      }
    }
  });
});

let target = document.querySelector(".chat-lines.nano-content");
observer.observe(target, { childList: true });
