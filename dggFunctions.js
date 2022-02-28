// A group of functions and variables used in dgg userscripts.
const settings = document.querySelector("#chat-settings-form");
const storage = {};


// Shortcut for creating new storage item
function createStorageItem(name, defaultValue) {
    storage[name] = window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : defaultValue;
}


// Create new heading that settings created after will be put under.
function newSettingGroup(text) {
    let settingGroup = document.createElement("h4");
    settingGroup.innerHTML = text;
    settings.appendChild(settingGroup);
}


// Constructs and adds a setting to dgg's settings menu.
function createSetting(setting) {
    /* 
     * setting should be an object with the following properties (optional are in parentheses):
     *   type: checkbox, input-number, select, textarea
     *   storageName: the name of the property in the storage object.
     *   (hint)
     *   (text)
     *   (name): used in [checkbox, input-number, select]
     *   (min): used in [input-number] to set the min number the setting can go
     *   (max): used in [input-number] to set the max number the setting can go
     *   (placeholder): used in [input-number, textarea]
     */
    let settingGroup = document.createElement("div");
    settingGroup.className = "form-group row";

    let settingLabel = document.createElement("label");
    settingLabel.innerHTML = setting.text;
    if (setting.hint) {settingLabel.title = setting.hint};
    settingGroup.appendChild(settingLabel);

    let settingInput;
    let appendToGroup = true;
    switch (setting.type) {
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
        case "input-number":
            settingLabel.style.marginBottom = 0;

            settingInput = document.createElement("input");
            if (setting.name) {settingLabel.name = setting.name};
            settingInput.type = "number";
            settingInput.className = "form-control";
            settingInput.max = setting.max;
            settingInput.min = setting.min;
            settingInput.placeholder = setting.placeholder;
            settingInput.value = storage[setting.storageName];
            settingInput.style.marginLeft = ".6em";
            settingInput.addEventListener("change", () => {
                storage[setting.storageName] = settingInput.value;
                window.localStorage.setItem(setting.storageName, settingInput.value);
            });
            break;
        case "select":
                settingGroup.className = "form-group";
    
                settingLabel.htmlFor = setting.id;
                settingInput = document.createElement("select");
                settingInput.id = setting.id;
                if (setting.name) {settingLabel.name = setting.name};
                settingInput.className = "form-control";
    
                for (const option in setting.options) {
                    let optionElement = document.createElement("option");
                    optionElement.value = option;
                    optionElement.innerHTML = setting.options[option];
                    settingInput.appendChild(optionElement);
                }
    
                settingInput.value = storage[setting.storageName];
                settingInput.addEventListener("change", () => {
                    storage[setting.storageName] = parseInt(settingInput.value);
                    window.localStorage.setItem(
                        setting.storageName,
                        settingInput.value
                    );
                });
                break;
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
        default:
            console.error("Invalid input type");
    }
    if (appendToGroup) {settingGroup.appendChild(settingInput);}
    settings.appendChild(settingGroup);
}
