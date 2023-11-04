import { readText, writeText } from "@tauri-apps/api/clipboard";
import { ClipboardState } from "../stores/clipboard-store";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class ClipboardUtil {
  static async init(store: ClipboardState) {
    store.clear();

    let previousText = "";

    for (;;) {
      let text = await readText();

      if (text !== null && text.length > 0 && text !== previousText) {
        previousText = text;
        store.add(text);
      }

      await delay(1000);
    }
  }

  static async read(): Promise<string | null> {
    return await readText();
  }

  static async write(text: string) {
    await writeText(text);
  }
}
