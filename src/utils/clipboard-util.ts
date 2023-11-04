import {
  writeText,
  readText,
  readImage,
  writeImage,
} from "tauri-plugin-clipboard-api";
import { ClipboardState } from "../stores/clipboard-store";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class ClipboardUtil {
  static async init(store: ClipboardState) {
    store.clear();

    let previousData = "";

    for (;;) {
      let text = await this.readText();
      if (text !== null && text.length > 0 && text !== previousData) {
        previousData = text;
        store.add(text);
      }

      let image = await this.readImage();
      if (image !== null && image.length > 0 && image !== previousData) {
        previousData = image;
        store.add(image);
        console.log(image);
      }

      await delay(1000);
    }
  }

  static async writeText(text: string) {
    await writeText(text);
  }

  static async writeImage(data: string) {
    await writeImage(data.replace("data:image/png;base64,", ""));
  }

  private static async readText(): Promise<string | null> {
    try {
      return await readText();
    } catch (e) {
      return null;
    }
  }

  private static async readImage(): Promise<string | null> {
    try {
      return `data:image/png;base64,${await readImage()}`;
    } catch (e) {
      return null;
    }
  }
}
