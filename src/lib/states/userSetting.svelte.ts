import { typeVariableNameMap, type CursorOptions } from "@/cursorUtil";

type CursorType = keyof typeof CursorOptions

const localStorageKey = "cursorType"

class UserSetting {
  cursorType = $state<CursorType>("default");
  constructor() {
    const existing = localStorage.getItem(localStorageKey)
    if (existing) {
      this.cursorType = existing as CursorType
      this.setCssVariable(this.cursorType)
    }
  }
  changeCursorType(type: CursorType) {
    this.cursorType = type
    localStorage.setItem(localStorageKey, type)
  }
  setCssVariable(cursorType: CursorType) {
    if (cursorType === "default") {
      return
    }
    Object.entries(typeVariableNameMap).forEach(value => {
      const [key, { prefix, amount }] = value
      for (let i = 1; i <= amount; i++) {
        document.documentElement.style.setProperty(`--cursor${prefix ? `-${prefix}` : ""}-image-${i}`, `url("/cursor-image/${cursorType}/${key}/${i}.png")`)
      }
    })
  }
}

export const userSetting = new UserSetting()