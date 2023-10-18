// ==UserScript==
// @name         Ignore Embedders
// @namespace    https://www.destiny.gg/
// @version      1.1.1
// @description  Ignores people who are watching certain embeds
// @author       Fritz
// @match        *://*.destiny.gg/embed/chat*
// @include      http://www.destiny.gg/embed/chat/*
// @include      https://www.destiny.gg/embed/chat/*
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreEmbedders.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreEmbedders.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.1.0.min.js
// ==/UserScript==

/*
Instructions:
1. Install with Tampermonkey or similar extension
2. Open DGG chat
3. Open chat settings (cogwheel below chat)
4. Scroll down until you see the "IGNORE EMBEDDERS" settings
5. Put in embeds you want ignored, separated by a comma (e.g. hasanabi,xqc,obamna).
   Use the embed ID (#platform/ID, e.g. #kick/xqc).
*/

const settingItems = [
  new SettingItem("ignoredEmbedders", [], "textarea", {
    text: "Ignore people watching...",
    placeholder: "Comma separated... (e.g. destiny,hasanabi,obamna)",
  }),
  new SettingItem("mentionsEnabled", false, "checkbox", {
    text: "Show mentions?",
  }),
];
const settings = new Settings("ignore embedders", settingItems, "fritz-");
settings.build();

let mentionRegex = null;
let property = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
const data = property.get;
function lookAtMessage() {
  let socket = this.currentTarget instanceof WebSocket;
  if (!socket) {
    return data.call(this);
  }
  let msg = data.call(this);
  let dataArray = msg.split(/ (.*)/s);
  const msgType = dataArray[0];
  const msgData = JSON.parse(dataArray[1]);
  if (msgType == "ME") {
    mentionRegex = new RegExp(msgData.nick, "i");
  } else if (msgType == "MSG") {
    const watchingId = msgData?.watching?.id;
    if (
      watchingId &&
      settings.ignoredEmbedders.includes(watchingId.toLowerCase()) &&
      (!mentionRegex?.test(msgData.data) || !settings.mentionsEnabled)
    ) {
      return;
    }
  }
  return msg;
}

property.get = lookAtMessage;
Object.defineProperty(MessageEvent.prototype, "data", property);
