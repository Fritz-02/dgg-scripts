// ==UserScript==
// @name         Clear Ignore List
// @namespace    https://www.destiny.gg/
// @version      0.1
// @description  Clears DGG ignore list
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @downloadURL  https://github.com/Fritz-02/dgg-scripts/raw/main/clearIgnoreList.js
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/clearIgnoreList.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=destiny.gg
// @grant        none
// ==/UserScript==

// OBSOLETE due to the /unignoreall command being added

if (
  confirm(
    "Are you sure you want to clear your DGG ignore list? I am not liable for any issues that come up (tag list accidently getting wiped, etc.)"
  )
) {
  const userData = await fetch("https://www.destiny.gg/api/chat/me", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrerPolicy: "no-referrer",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      data.settings[15] = ["ignorenicks", []];
      console.log(data.settings[15]);
      return data;
    });

  fetch("https://www.destiny.gg/api/chat/me/settings", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "text/plain;charset=UTF-8",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-guard": "YEE",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(userData.settings),
    method: "POST",
    mode: "cors",
    credentials: "include",
  }).then((response) => {
    alert("IGNORE LIST CLEARED");
  });
}
