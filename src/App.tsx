import { useEffect } from "preact/hooks";
import { useClipboardStore } from "./stores/clipboard-store";
import { ClipboardUtil } from "./utils/clipboard-util";

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
            <button onClick={(_) => ClipboardUtil.write(e)}>{e}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
