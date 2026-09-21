export type Language = "tr" | "en";

export const translations = {
  en: {
    start: {
      title: "SAVE THE KING",
      subtitle:
        "Defeat the enemy and save the king!",
      play: "PLAY",
      language: "LANGUAGE",
    },

    gameplay: {
      attack: "ATTACK",
      king: "KING",
      enemy: "ENEMY",
    },

    end: {
  winTitle: "YOU WIN!",
  winSubtitle:
    "The king has been saved!",
  loseTitle: "YOU LOSE!",
  loseSubtitle:
    "The king has been defeated.",
  playAgain: "PLAY AGAIN",
  upgrade: "UPGRADES",
},

    upgrades: {
  title: "UPGRADES",
  coins: "COINS",
  health: "KING HEALTH",
  attack: "KING ATTACK",
  upgrade: "UPGRADE",
  continue: "CONTINUE",
},
  },

  tr: {
    start: {
      title: "KRALI KURTAR",
      subtitle:
        "Düşmanı yen ve kralı kurtar!",
      play: "OYNA",
      language: "DİL",
    },

    gameplay: {
      attack: "SALDIR",
      king: "KRAL",
      enemy: "DÜŞMAN",
    },

    end: {
  winTitle: "KAZANDIN!",
  winSubtitle:
    "Kral kurtarıldı!",
  loseTitle: "KAYBETTİN!",
  loseSubtitle:
    "Kral yenildi.",
  playAgain: "TEKRAR OYNA",
  upgrade: "GELİŞTİRMELER",
},

    upgrades: {
  title: "GELİŞTİRMELER",
  coins: "COIN",
  health: "KRAL CANI",
  attack: "KRAL VURUŞU",
  upgrade: "GELİŞTİR",
  continue: "DEVAM ET",
},
  },
} as const;