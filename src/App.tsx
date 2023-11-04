import { useEffect } from "preact/hooks";
import { useClipboardStore } from "./stores/clipboard-store";
import { ClipboardUtil } from "./utils/clipboard-util";
import { appWindow } from "@tauri-apps/api/window";

function App() {
  const store = useClipboardStore();

  useEffect(() => {
    void ClipboardUtil.init(store);
  }, []);

  return (
    <div>
      <ul>
        {store.history.map((e) => (
          <li>
            {(e.startsWith("data:image") && (
              <div
                onClick={(_) => {
                  void ClipboardUtil.writeImage(e);
                  void appWindow.hide();
                }}
              >
                <img src={e}></img>
              </div>
            )) || (
              <button
                onClick={(_) => {
                  void ClipboardUtil.writeText(e);
                  void appWindow.hide();
                }}
              >
                {e}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
