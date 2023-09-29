// ==UserScript==
// @name         Ignore Watchers
// @namespace    https://www.destiny.gg/
// @version      1.0.0
// @description  Ignores people who are watching certain embeds
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreWatchers.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreWatchers.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.1.0.min.js
// ==/UserScript==

const settingItems = [
  new SettingItem("ignoredWatchers", [], "textarea", {
    text: "Ignore people watching...",
    placeholder: "Comma separated... (e.g. destiny,hasanabi,obamna)",
  }),
];
const settings = new Settings("ignore watchers", settingItems, "fritz-");
settings.build();

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
  if (msgType == "MSG") {
    const watchingId = msgData?.watching?.id;
    if (
      watchingId &&
      settings.ignoredWatchers.includes(watchingId.toLowerCase())
    ) {
      return;
    }
  }
  return msg;
}

property.get = lookAtMessage;
Object.defineProperty(MessageEvent.prototype, "data", property);
