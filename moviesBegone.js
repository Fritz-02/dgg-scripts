// ==UserScript==
// @name         Movies Begone
// @namespace    https://www.destiny.gg/
// @version      0.1
// @description  Removes automatically embedded twitch movie streams (technically any auto embed twitch streams for now :p)
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/bigscreen/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/moviesBegone.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/moviesBegone.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=destiny.gg
// @grant        none
// ==/UserScript==

const abyssShield = document.querySelector("#abyss-shield");

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!location.hash) {
      // checks if you're watching an embed (e.g. bigscreen#twitch/JaydrVeranda), and skips over if so
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const element = mutation.addedNodes[i];
        let src = element.getAttribute("src");
        if (element.tagName == "IFRAME" && src) {
          if (src.match(/https:\/\/player\.twitch\.tv/)) {
            console.log(`MoviesBegone - REMOVED SRC: ${src}`);
            element.removeAttribute("src");
            abyssShield.setAttribute("style", "z-index: 50;");
          }
        }
      }
    }
  });
});

const streamWrap = document.querySelector("#stream-wrap");
observer.observe(streamWrap, { childList: true });
