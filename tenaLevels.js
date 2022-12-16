// ==UserScript==
// @name         DGG User Level Info
// @namespace    https://www.destiny.gg/
// @version      1.0.0
// @description  Adds chatter's level from tena.dev when right-clicking on their name.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/userLevelInfo.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/userLevelInfo.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        GM.xmlHttpRequest
// @connect      tena.dev
// ==/UserScript==

const userInfo = document.querySelector("#chat-user-info div div.user-info");
const levelHeader = document.createElement("h5");
levelHeader.setAttribute("class", "tena-level");
const subheader = document.querySelector("h5.flairs-subheader");
userInfo.insertBefore(levelHeader, subheader);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const username = mutation.addedNodes[0];
    if (username) {
      GM.xmlHttpRequest({
        method: "GET",
        url: `https://tena.dev/api/users/${username.nodeValue}`,
        onload: (response) => {
          if (response.status == 200) {
            const data = JSON.parse(response.response);
            const level = data.level;
            levelHeader.innerHTML = `Level: ${level}`;
          }
        },
      });
    }
  });
});

const target = document.querySelector(
  "#chat-user-info div.chat-menu-inner div.toolbar h5 span"
);
console.log(target);
observer.observe(target, { childList: true });
