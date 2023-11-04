import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Configuration {
  maxNumberOfEntries: number;
}

export interface ClipboardState {
  configuration: Configuration;
  history: string[];
  add: (text: string) => void;
  clear: () => void;
  slice: () => void;
  pop: () => void;
}

export const useClipboardStore = create<ClipboardState>()(
  devtools(
    persist(
      (set) => ({
        configuration: {
          maxNumberOfEntries: 100,
        },
        history: [],

        add: (text: string) =>
          set((state) => {
            if (
              state.history.length >
              state.configuration.maxNumberOfEntries + 1
            ) {
              state.history.pop();
            }

            return {
              history: [text, ...state.history],
            };
          }),
        clear: () => set((_) => ({ history: [] })),
        slice: () =>
          set((state) => {
            const temp = state.history;
            temp.slice();
            return temp;
          }),
        pop: () =>
          set((state) => {
            const temp = state.history;
            temp.pop();
            return temp;
          }),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
