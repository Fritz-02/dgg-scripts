// A group of classes used in dgg userscripts.
const settingsForm = document.querySelector("#chat-settings-form");

class SettingItem {
  constructor(keyName, defaultValue, type, options) {
    this.keyName = keyName;
    this.defaultValue = defaultValue;
    this.type = type;
    this.options = options;
    this.parent;
  }
  build() {
    const div = document.createElement("div");
    div.className = "form-group row";
    const label = document.createElement("label");
    label.innerHTML = this.options.text;
    if (this.options.hint !== undefined) {
      label.title = this.options.hint;
    }
    div.appendChild(label);

    let input;
    let appendToDiv = true;
    switch (this.type) {
      case "checkbox":
        div.className = "form-group checkbox";
        input = document.createElement("input");
        if (this.options.name !== undefined) {
          label.name = this.options.name;
        }
        input.type = "checkbox";
        input.checked = this.parent[this.keyName];

        input.addEventListener("change", () => {
          this.parent[this.keyName] = input.checked;
        });
        label.prepend(input);
        appendToDiv = false;
        break;
      case "input-number":
        label.style.marginBottom = 0;
        input = document.createElement("input");
        if (this.options.name !== undefined) {
          label.name = this.options.name;
        }
        input.type = "number";
        input.className = "form-control";
        input.min = this.options.min;
        input.max = this.options.max;
        input.placeholder = this.options.placeholder;
        input.value = this.parent[this.keyName];
        input.style.marginLeft = ".6em";
        input.addEventListener("change", () => {
          this.parent[this.keyName] = input.value;
        });
        break;
      case "select":
        div.className = "form-group";
        label.htmlFor = this.options.id;
        input = document.createElement("select");
        input.id = this.options.id;
        if (this.options.name) {
          label.name = this.options.name;
        }
        input.className = "form-control";
        for (const option in this.options.options) {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.innerHTML = this.options.options[option];
          input.appendChild(optionElement);
        }
        input.value = this.parent[this.keyName];
        input.addEventListener("change", () => {
          this.parent[this.keyName] = parseInt(input.value);
        });
        break;
      case "textarea":
        input = document.createElement("textarea");
        input.style.resize = "vertical";
        input.className = "form-control";
        input.placeholder = this.options.placeholder;
        input.value = this.parent[this.keyName];
        input.addEventListener("change", () => {
          let val = input.value
            .toLowerCase()
            .replaceAll(" ", "")
            .split(",")
            .filter(String);
          if (input.value.length > 0) {
            this.parent[this.keyName] = val;
          } else {
            this.parent[this.keyName] = [];
          }
        });
        break;
      case "input":
        input = document.createElement("input");
        input.className = "form-control";
        input.placeholder = this.options.placeholder;
        input.value = this.parent[this.keyName];
        input.addEventListener("change", () => {
          let val = input.value.replaceAll(" ", "");
          if (input.value.length > 0) {
            this.parent[this.keyName] = val;
          } else {
            this.parent[this.keyName] = null;
          }
        });
        break;
      default:
        console.error(`Invalid setting input type: ${this.type}`);
    }
    if (appendToDiv) {
      div.appendChild(input);
    }
    settingsForm.appendChild(div);
  }
}

class Settings {
  #settingItems;
  #keyPrefix;

  constructor(title, settingItems, keyPrefix) {
    this.title = title;
    this.#settingItems = settingItems;
    this.#keyPrefix = keyPrefix;
    for (const settingItem of this.#settingItems) {
      settingItem.parent = this;
      const keyName = settingItem.keyName;
      const privateKeyName = `#${keyName}`;
      Object.defineProperty(this, keyName, {
        set: function (value) {
          this[privateKeyName] = value;
          this.#save(keyName, value);
        },
        get: function () {
          if (this[privateKeyName] === undefined) {
            this[privateKeyName] =
              this.#load(keyName) ?? settingItem.defaultValue;
          }
          return this[privateKeyName];
        },
      });
    }
  }
  #getFullKeyName(key) {
    return `${this.#keyPrefix}${key}`;
  }
  #save(keyName, value) {
    const fullKeyName = this.#getFullKeyName(keyName);
    window.localStorage.setItem(fullKeyName, JSON.stringify(value));
  }
  #load(keyName) {
    const fullKeyName = this.#getFullKeyName(keyName);
    const item = window.localStorage.getItem(fullKeyName);
    if (item != null) {
      const parsedItem = JSON.parse(item);
      return parsedItem;
    }
  }
  build() {
    const heading = document.createElement("h4");
    heading.innerHTML = this.title;
    settingsForm.appendChild(heading);
    for (const item of this.#settingItems) {
      item.build();
    }
  }
}
