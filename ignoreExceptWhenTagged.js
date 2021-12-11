// ==UserScript==
// @name         Ignore Except When Tagged
// @namespace    https://www.destiny.gg/
// @version      1.0
// @description  Does what /ignore does, except you'll see messages you're tagged in.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @updateURL    https://github.com/Fritz-02/dgg-scripts/raw/main/ignoreExceptWhenTagged.js
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// ==/UserScript==


const storage = {};
storage["iewt-ignored"] = window.localStorage.getItem("iewt-ignored") ? JSON.parse(window.localStorage.getItem("iewt-ignored")) : [];
storage["iewt-harshIgnored"] = window.localStorage.getItem("iewt-harshIgnored") ? JSON.parse(window.localStorage.getItem("iewt-harshIgnored")) : [];

//console.log(storage);


// Settings
const settings = document.querySelector("#chat-settings-form");

function createSetting(setting) {
    let settingGroup = document.createElement("div");
    settingGroup.className = "form-group row";

    let settingLabel = document.createElement("label");
    settingLabel.innerHTML = setting.text;
    if (setting.hint) {settingLabel.title = setting.hint};
    settingGroup.appendChild(settingLabel);

    let settingInput;
    settingInput = document.createElement("textarea");
    settingInput.style.resize = "vertical";
    settingInput.className = "form-control";
    settingInput.placeholder = setting.placeholder;

    settingInput.value = storage[setting.storageName] == "[]" ? "" : storage[setting.storageName];

    settingInput.addEventListener("change", () => {
        let val = settingInput.value.toLowerCase().replace(" ", "").split(",").filter(String);
        //console.log(val);
        if (settingInput.value.length > 0) {
            storage[setting.storageName] = val;
            window.localStorage.setItem(
                setting.storageName, JSON.stringify(val)
            );
        } else {
            storage[setting.storageName] = [];
            window.localStorage.setItem(
                setting.storageName, JSON.stringify(storage[setting.storageName])
            );
        }
    });
    settingGroup.appendChild(settingInput);
    settings.appendChild(settingGroup);
}

let settingHeading = document.createElement("h4");
settingHeading.innerHTML = "ignore except when tagged";
settings.appendChild(settingHeading);


createSetting({
    "text": "Ignored chatters",
    "type": "textarea",
    "placeholder": "Comma separated...",
    "storageName": "iewt-ignored"
});
createSetting({
    "text": "Harsh ignored chatters",
    "type": "textarea",
    "placeholder": "Comma separated...",
    "storageName": "iewt-harshIgnored"
});


const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let textElement = message.querySelector("span.text");
            let text = textElement ? textElement.textContent.toLowerCase() : "";
            let username = message.getAttribute("data-username");
            if (message.className.includes("msg-highlight")) {
                continue;
            }
            if (storage["iewt-ignored"].includes(username) || storage["iewt-harshIgnored"].includes(username)|| storage["iewt-harshIgnored"].some(v => text.includes(v))) {
                message.remove();
            }
        }
    });
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
