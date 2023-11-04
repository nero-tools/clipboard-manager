import { useEffect } from "preact/hooks";
import { useClipboardStore } from "./stores/clipboard-store";
import { ClipboardUtil } from "./utils/clipboard-util";
import ClipboardEntry from "./components/clipboard-entry";

function App() {
  const store = useClipboardStore();

  useEffect(() => {
    void ClipboardUtil.init(store);
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
