class HeaderDates {
  displayMode = $state<"Kanji" | "Hirakana">("Kanji")
  constructor() { }
  toggleDisplayMode() {
    this.displayMode = this.displayMode === "Kanji" ? "Hirakana" : "Kanji"
  }
}

export const headerDateState = new HeaderDates();