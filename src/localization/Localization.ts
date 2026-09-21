import {
  translations,
  type Language,
} from "./translations";

export class Localization {
  private language: Language = "en";

  setLanguage(
    language: Language,
  ): void {
    this.language = language;
  }

  getLanguage(): Language {
    return this.language;
  }

  get(
    key: string,
  ): string {
    const value =
      this.getValue(
        translations[this.language],
        key,
      );

    return value ?? key;
  }

  private getValue(
    object: unknown,
    key: string,
  ): string | undefined {
    const keys = key.split(".");

    let current: unknown = object;

    for (const part of keys) {
      if (
        typeof current !== "object" ||
        current === null
      ) {
        return undefined;
      }

      current = (
        current as Record<
          string,
          unknown
        >
      )[part];
    }

    return typeof current === "string"
      ? current
      : undefined;
  }
}