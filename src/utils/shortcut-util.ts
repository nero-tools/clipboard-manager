import {
  isRegistered,
  unregister,
  register,
} from "@tauri-apps/api/globalShortcut";
import { invoke } from "@tauri-apps/api/tauri";

export class ShortcutUtil {
  static async isRegistered(shortcut: string) {
    if (!(await invoke("is_using_wayland"))) await isRegistered(shortcut);
  }

  static async register(shortcut: string, handler: (shortcut: string) => void) {
    if (!(await invoke("is_using_wayland"))) await register(shortcut, handler);
  }

  static async unregister(shortcut: string) {
    if (!(await invoke("is_using_wayland"))) await unregister(shortcut);
  }
}
