// ==UserScript==
// @name         Advanced Ignore
// @namespace    https://www.destiny.gg/
// @version      1.1.0
// @description  Adds more ignore settings (embeds, nsfw, separate ignore and harsh ignore, allow mentions to be shown)
// @author       Fritz
// @match        *://*.destiny.gg/embed/chat*
// @match        *://*.omniliberal.dev/embed/chat*
// @include      http://www.destiny.gg/embed/chat/*
// @include      https://www.destiny.gg/embed/chat/*
// @include      http://www.omniliberal.dev/embed/chat/*
// @include      https://www.omniliberal.dev/embed/chat/*
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/advancedIgnore.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/advancedIgnore.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://github.com/Fritz-02/dgg-scripts/releases/download/v1.2.0/dggFunctions-1.2.0.min.js
// ==/UserScript==

/*
Instructions:
1. Install with Tampermonkey extension (or Violentmonkey with Firefox)
2. Open DGG chat
3. Open chat settings (cogwheel below chat)
4. Scroll down until you see the "ADVANCED IGNORE" settings
*/

const settingItems = [
  new SettingItem("ignoredEmbedders", [], "textarea", {
    text: "Ignore people watching...",
    placeholder: "Comma separated... (e.g. destiny,hasanabi,obamna)",
  }),
  new SettingItem("ignoredNSFW", [], "textarea", {
    text: "Ignored NSFW/NSFL posters",
    placeholder: "Comma separated...",
  }),
  new SettingItem("ignored", [], "textarea", {
    text: "Ignored chatters",
    placeholder: "Comma separated...",
  }),
  new SettingItem("harshIgnored", [], "textarea", {
    text: "Harsh ignored chatters",
    placeholder: "Comma separated...",
  }),
  new SettingItem("mentionsEnabled", false, "checkbox", {
    text: "Show mentions?",
  }),
  new SettingItem("hideSub", false, "checkbox", {
    text: "Hide sub messages",
  }),
  new SettingItem("hideNewUsers", false, "checkbox", {
    text: "Hide new users",
  }),
];
const settings = new Settings("Advanced Ignore", settingItems, "fritz-");
settings.build();

let mentionRegex = null;
const regexNSFW = /\bnsf[wl]\b/i;
const newUserFlair = "flair58";

let property = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
const data = property.get;

const isSubMsg = (msgType) =>
  msgType == "SUBSCRIPTION" || msgType == "GIFTSUB" || msgType == "DONATION";

const isNewUser = (msgData) => msgData.features.includes(newUserFlair);

const checkMention = (msgData) =>
  !(settings.mentionsEnabled && mentionRegex?.test(msgData.data));

const checkEmbed = (embedId) =>
  embedId && settings.ignoredEmbedders.includes(embedId.toLowerCase());

const checkNSFW = (msgData) =>
  regexNSFW.test(msgData.data) &&
  settings.ignoredNSFW.includes(msgData.nick.toLowerCase());

function checkIgnored(msgData) {
  const username = msgData.nick.toLowerCase();
  return (
    settings.ignored.includes(username) ||
    settings.harshIgnored.includes(username) ||
    settings.harshIgnored.some((v) => msgData.data.includes(v))
  );
}

const checks = (msgData) =>
  checkMention(msgData) &&
  (checkEmbed(msgData?.watching?.id) ||
    checkNSFW(msgData) ||
    checkIgnored(msgData));

function lookAtMessage() {
  let socket = this.currentTarget instanceof WebSocket;
  if (!socket) {
    return data.call(this);
  }
  let msg = data.call(this);
  let dataArray = msg.split(/ (.*)/s);
  const msgType = dataArray[0];
  const msgData = JSON.parse(dataArray[1]);
  if (msgType == "ME" && msgData) {
    mentionRegex = new RegExp(msgData.nick, "i");
  } else if (
    (msgType == "MSG" &&
      !msgData.features.includes("moderator") &&
      checks(msgData)) ||
    (isSubMsg(msgType) && settings.hideSub) ||
    isNewUser(msgData)
  ) {
    msg = 'OBAMNA {data: "LULW"}';
  }
  return msg;
}

property.get = lookAtMessage;
Object.defineProperty(MessageEvent.prototype, "data", property);
