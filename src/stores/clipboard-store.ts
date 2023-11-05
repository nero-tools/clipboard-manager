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
}

export const useClipboardStore = create<ClipboardState>()(
  devtools(
    persist(
      (set) => ({
        configuration: {
          maxNumberOfEntries: 100,
        },
        history: [],

        add: (data: string) =>
          set((state) => {
            // Determine whether copied data already exists within history.
            // In case it already exists bring it up to the first position.
            const existingElement = state.history.find(
              (other) => data === other
            );
            if (existingElement !== undefined) {
              return {
                history: [
                  existingElement,
                  ...state.history.filter((other) => other !== existingElement),
                ],
              };
            }

            // Remove element at the end in case history limit has been reached.
            if (
              state.history.length >
              state.configuration.maxNumberOfEntries + 1
            ) {
              state.history.pop();
            }

            return {
              history: [data, ...state.history],
            };
          }),
        clear: () => set((_) => ({ history: [] })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
