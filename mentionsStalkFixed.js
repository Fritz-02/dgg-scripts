// ==UserScript==
// @name         DGG Mentions/Stalk Fixed
// @namespace    https://www.destiny.gg/
// @version      1.1.1
// @description  Fixes /mentions and /stalk while OverRustle is down, and when /mentions is disabled
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/mentionsStalkFixed.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/mentionsStalkFixed.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        GM.xmlHttpRequest
// @connect      rustlesearch.dev
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.0.0.min.js
// ==/UserScript==

/* 
How to use:
  Just use /mentions or /stalk like normal.
  By default only the last 3 messages will be retrieved. This can be changed in chat settings near the bottom by scrolling down.
  Visuals: https://i.imgur.com/qwff2Oi.png
*/

// Yoinked DGGMsg from vyneer's utilities, check out his script here: https://vyneer.me/utilities
const timeOptions = {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
};

const settingItems = [
  new SettingItem("mentions", 3, "input-number", {
    text: "How Many Mentions/Messages You Want?",
    name: "How Many Mentions/Messages You Want?",
    placeholder: 3,
    min: 1,
    max: 100,
  }),
  new SettingItem("username", null, "input", {
    text: "Get mentions for...",
    placeholder: "Username should be here",
  }),
];
const settings = new Settings(
  "Mentions Enabled",
  settingItems,
  "fritz-mentionsStalk."
);
settings.build();

class DGGMsg {
  constructor(str, user, type, stamp) {
    let msg = document.createElement("div");
    msg.className = `msg-chat ${type}`;
    let time;
    if (stamp) {
      time = new Date(stamp * (stamp.toString().length == 13 ? 1 : 1000));
    } else {
      time = new Date();
    }
    let msgInnerTime = document.createElement("time");
    msgInnerTime.className = "time";
    msgInnerTime.innerHTML = time.toLocaleTimeString("en-US", timeOptions);
    msg.appendChild(msgInnerTime);
    if (user) {
      let userTitle = document.createElement("a");
      userTitle.setAttribute("title", "");
      userTitle.classList.add("user");
      userTitle.innerHTML = user;
      msg.appendChild(userTitle);
      let ctrl = document.createElement("span");
      ctrl.className = "ctrl";
      ctrl.innerHTML = ": ";
      msg.appendChild(ctrl);
    }
    let msgInnerText = document.createElement("span");
    msgInnerText.className = "text";
    msgInnerText.innerHTML = str;
    msg.appendChild(msgInnerText);
    target.appendChild(msg);
  }
  update() {
    target.scrollTop = target.scrollHeight;
  }
}

function fetchUsername() {
  fetch("https://www.destiny.gg/api/chat/me", { credentials: "include" })
    .then((response) => response.json())
    .then((data) => {
      settings.username = data.nick;
    })
    .catch((error) => {
      console.error("[ERROR] [fritz-mentionsStalk]: ", error);
    });
}

function getMentions() {
  new DGGMsg(
    `[MSFixed] Getting last ${settings.mentions} mentions for ${settings.username}...`,
    "",
    "msg-info"
  ).update();
  if (settings.username) {
    fetch(
      `https://www.destiny.gg/api/chat/mentions?username=${settings.username}&limit=${settings.mentions}`,
      { credentials: "include" }
    )
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          new DGGMsg(
            item.text,
            item.nick,
            "msg-historical",
            item.date
          ).update();
        });
        new DGGMsg(
          `End (<a target="_blank" class="externallink " href="https://dgg.overrustlelogs.net/mentions/${settings.username}" rel="nofollow">https://dgg.overrustlelogs.net/mentions/${settings.username}</a>)`,
          "",
          "msg-info"
        ).update();
      })
      .catch((error) => {
        console.error("[ERROR] [fritz-mentionsStalk]: ", error);
      });
  }
}

function rustleSearch({ username = "", text = "" }) {
  if (username || text) {
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://api-v2.rustlesearch.dev/anon/search?username=${username}&text=${text}&channel=Destinygg`,
      onload: (response) => {
        if (response.status == 200) {
          const data = JSON.parse(response.response);
          const messages = data.data.messages.slice(0, settings.mentions);
          messages.reverse().forEach((item) => {
            new DGGMsg(
              item.text,
              item.username,
              "msg-historical",
              item.searchAfter
            ).update();
          });
          let rustleURL =
            "https://rustlesearch.dev/?" +
            (username ? `username=${username}&` : "") +
            (text ? `text=${text}&` : "") +
            "channel=Destinygg";
          new DGGMsg(
            `End (<a target="_blank" class="externallink " href="${rustleURL}" rel="nofollow">${rustleURL}</a>)`,
            "",
            "msg-info"
          ).update();
        }
      },
    });
  }
}

function getRustleSearchStalk(username) {
  new DGGMsg(
    `[MSFixed] Getting messagse for ${username}...`,
    "",
    "msg-info"
  ).update();
  new DGGMsg(
    `Stalked ${username}`,
    "",
    "msg-info"
  ).update();
  rustleSearch({ username: username });
}

function getRustleSearchMentions() {
  if (settings.username) {
    new DGGMsg(
      `[MSFixed] Getting last ${settings.mentions} mentions for ${settings.username} from RustleSearch.dev...`,
      "",
      "msg-info"
    ).update();
    rustleSearch({ text: settings.username });
  }
}

const noMentionsReceivedRegex =
  /^No mentions for \S* received. Try again later$/;
const noMessagesReceivedRegex =
  /^No messages for (\S*) received. Try again later$/;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const message = mutation.addedNodes[i];
      const textElement = message.querySelector("span.text");
      const text = textElement ? textElement.textContent : "";
      if (message.className.includes("msg-error")) {
        if (text === "The `/mentions` command is disabled.") {
          text.innerText =
            "The `/mentions` command is disabled. [DGG Mentions Fixed: Retrieving mentions...]";
          getMentions();
        } else if (noMentionsReceivedRegex.test(text)) {
          getRustleSearchMentions();
        } else if (noMessagesReceivedRegex.test(text)) {
          let match = noMessagesReceivedRegex.exec(text);
          getRustleSearchStalk(match[1]);
        }
      }
    }
  });
});

// If username is null (e.g. running the script for the first time), fetch chatter's username
if (settings.username == null) {
  fetchUsername();
}

const target = document.querySelector(".chat-lines.nano-content");
observer.observe(target, { childList: true });
