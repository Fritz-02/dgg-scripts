// ==UserScript==
// @name         DGG NSFW Ignorer
// @namespace    https://www.destiny.gg/
// @version      1.0.1
// @description  Ignores NSFW messages from specified chatters.
// @author       Fritz
// @include      /https?:\/\/www\.destiny\.gg\/embed\/chat/
// @icon         https://www.google.com/s2/favicons?domain=destiny.gg
// @grant        none
// ==/UserScript==

const storage = {};
storage.nsfwIgnoredChatters = window.localStorage.getItem("nsfwIgnoredChatters") ? JSON.parse(window.localStorage.getItem("nsfwIgnoredChatters")) : [];
storage.nsfwShowMentions = window.localStorage.getItem("nsfwShowMentions") ? JSON.parse(window.localStorage.getItem("nsfwShowMentions")) : false;

console.log(storage);


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
    let appendToGroup = true;
    switch (setting.type) {
        case 'textarea':
            settingInput = document.createElement("textarea");
            settingInput.style.resize = "vertical";
            settingInput.className = "form-control";
            settingInput.placeholder = setting.placeholder;

            settingInput.value = storage[setting.storageName] == "[]" ? "" : storage[setting.storageName];

            settingInput.addEventListener("change", () => {
                let val = settingInput.value.toLowerCase().replaceAll(" ", "").split(",").filter(String);
                console.log(val);
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
            break;
        case "checkbox":
            settingGroup.className = "form-group checkbox";

            settingInput = document.createElement("input");
            if (setting.name) {settingLabel.name = setting.name};
            settingInput.type = "checkbox";
            settingInput.checked = storage[setting.storageName];

            settingInput.addEventListener("change", () => {
                storage[setting.storageName] = settingInput.checked;
                window.localStorage.setItem(
                    setting.storageName,
                    settingInput.checked
                );
            });
            settingLabel.prepend(settingInput);
            appendToGroup = false;
            break;
        default:
            console.log("Invalid input type");
    }
    if (appendToGroup) {settingGroup.appendChild(settingInput);}
    settings.appendChild(settingGroup);
}


// Change/add/remove the follow to create your script's settings
let settingGroup = document.createElement("h4");
settingGroup.innerHTML = "nsfw ignore list";
settings.appendChild(settingGroup);
createSetting({
    "text": "Ignored NSFW posters",
    "type": "textarea",
    "placeholder": "Comma separated...",
    "storageName": "nsfwIgnoredChatters"
});
createSetting({
    "text": "Always show mentions",
    "name": "nsfwMentionCheckbox",
    "type": "checkbox",
    "hint": "Show ignored nsfw when mentioned",
    "storageName": "nsfwShowMentions"
});


const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let message = mutation.addedNodes[i];
            let username = message.getAttribute("data-username");
            let isNSFW = message.querySelector('.externallink.nsfw-link');
            if (storage.nsfwShowMentions) {
                let isHighlighted = message.className.includes("msg-highlight");
                if (isHighlighted) {
                    continue;
                }
            }
            if (isNSFW && storage.nsfwIgnoredChatters.includes(username)) {
                message.remove();
            }
        }
    })
});

let target = document.querySelector('.chat-lines.nano-content');
observer.observe(target, {childList: true});
