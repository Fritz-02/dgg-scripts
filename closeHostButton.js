// ==UserScript==
// @name         [beta] Close Host Button
// @namespace    https://www.destiny.gg/
// @version      0.1
// @description  Adds a button to close a hosted embed.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/bigscreen/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/closeHostButton.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/closeHostButton.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=destiny.gg
// @grant        none
// ==/UserScript==

const closedEmbeds = window.localStorage.getItem("fritz.closedEmbeds")
  ? JSON.parse(window.localStorage.getItem("fritz.closedEmbeds"))
  : [];

function handleClick() {
  const embed = document.getElementById("embed");
  const iframe = embed.firstChild;

  const src = iframe.getAttribute("src");
  const url = new URL(src);
  switch (url.hostname) {
    case "player.twitch.tv":
      const channel = url.searchParams.get("channel");
      console.log(src);
      closedEmbeds.push(src);
      break;
    case "www.youtube.com":
      const urlWithoutParams = url.origin + url.pathname;
      console.log(urlWithoutParams);
      closedEmbeds.push(urlWithoutParams);
      break;
  }
  window.localStorage.setItem(
    "fritz.closedEmbeds",
    JSON.stringify(closedEmbeds)
  );
  embed.removeChild(embed.firstChild);
  const offlineText = document.getElementById("offline-text");
  offlineText.setAttribute("style", "z-index: 50;");
  console.log("YOU CLOSED VIM LULW");
}

const hostPillType = document.getElementById("host-pill-type").textContent;

if (!["OFFLINE", "EMBED"].some((v) => hostPillType == v)) {
  const hostPillButton = document.getElementById("host-pill-button");

  const divider = document.createElement("div");
  divider.className = "divider";

  const closeButtonDiv = document.createElement("div");
  closeButtonDiv.setAttribute("id", "close-host-icon");
  closeButtonDiv.className = "d-flex";
  closeButtonDiv.style.height = "100%";
  closeButtonDiv.style.cursor = "pointer";
  closeButtonDiv.style.margin = "0.375rem";

  const otherDiv = document.createElement("div");
  otherDiv.className = "d-flex align-items-center";
  otherDiv.style.padding = "0.25rem";
  otherDiv.style.opacity = ".5";
  closeButtonDiv.appendChild(otherDiv);

  const imageElem = document.createElement("i");
  imageElem.className = "fas fa-fw fa-times-circle pe-none";
  otherDiv.appendChild(imageElem);

  closeButtonDiv.addEventListener("click", handleClick);

  hostPillButton.appendChild(divider);
  hostPillButton.appendChild(closeButtonDiv);
}
