// ==UserScript==
// @name         [dev] DGG Mentions Fixed
// @namespace    https://www.destiny.gg/
// @version      dev-2022.09.29
// @description  If /mentions is disabled, this will just replace the disabled message
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/dev/mentionsEnabled.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/dev/mentionsEnabled.js
// @homepageURL  https://github.com/Fritz-02/dgg-scripts
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// @require      https://raw.githubusercontent.com/Fritz-02/dgg-scripts/main/dggFunctions/dggFunctions-1.0.0.min.js
// ==/UserScript==

// Yoinked DGGMsg from vyneer's utilities, check out his script here: https://vyneer.me/utilities
const timeOptions = {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
};

const settingItems = [
  new SettingItem("mentions", 3, "input-number", {
    text: "How Many Mentions You Want?",
    name: "How Many Mentions You Want?",
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
  "fritz-mentions."
);
settings.build();

class DGGMsg {
  constructor(str, user, type, stamp) {
    let msg = document.createElement("div");
    msg.className = `msg-chat ${type}`;
    let time;
    if (stamp != "") {
      time = new Date(stamp * 1000);
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
      console.error("[ERROR] [fritz-mentions]: ", error);
    });
}

function getMentions() {
  new DGGMsg(
    `[MentionsEnabled] Getting last ${settings.mentions} mentions for ${settings.username}...`,
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
        console.error("[ERROR] [fritz-mentions]: ", error);
      });
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const message = mutation.addedNodes[i];
      const textElement = message.querySelector("span.text");
      const text = textElement ? textElement.textContent : "";
      if (
        message.className.includes("msg-error") &&
        text === "The `/mentions` command is disabled."
      ) {
        text.innerText =
          "The `/mentions` command is disabled. [DGG Mentions Fixed: Retrieving mentions...]";
        getMentions();
      }
    }
  });
});

if (settings.username == null) {
  fetchUsername();
}

const target = document.querySelector(".chat-lines.nano-content");
observer.observe(target, { childList: true });
