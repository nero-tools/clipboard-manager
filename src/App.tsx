import { useEffect } from "preact/hooks";
import { useClipboardStore } from "./stores/clipboard-store";
import { ClipboardUtil } from "./utils/clipboard-util";
import ClipboardEntry from "./components/clipboard-entry";
import { ShortcutUtil } from "./utils/shortcut-util";
import { appWindow } from "@tauri-apps/api/window";

function App() {
  const store = useClipboardStore();

  useEffect(() => {
    void ClipboardUtil.init(store);
    void ShortcutUtil.register("CommandOrControl+Shift+V", async (_) => {
      await appWindow.show();
      await appWindow.onFocusChanged(({ payload: focused }) => {
        if (!focused) {
          appWindow.hide();
        }
      });
      await appWindow.setFocus();
    });
    void ShortcutUtil.register("Escape", async (_) => {
      if (await appWindow.isVisible()) {
        await appWindow.hide();
      }
    });
  }, []);

  return (
    <div class="min-h-screen min-w-screen h-full w-full bg-[#1e1e1e] text-gray-300 select-none">
      <div class="flex flex-col gap-2 p-3">
        {store.history.map((e) => (
          <ClipboardEntry data={e} />
        ))}
      </div>
    </div>
  );
}

export default App;
