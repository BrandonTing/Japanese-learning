import { type CursorOptions } from "@/cursorUtil";

type CursorType = keyof typeof CursorOptions

const localStorageKey = "cursorType"

class UserSetting {
  cursorType = $state<CursorType>("default")
  constructor() {
    const existing = localStorage.getItem(localStorageKey)
    if (existing) {
      this.cursorType = existing as CursorType
    }
  }
  changeCursorType(type: CursorType) {
    this.cursorType = type
    localStorage.setItem(localStorageKey, type)
  }
}

export const userSetting = new UserSetting()