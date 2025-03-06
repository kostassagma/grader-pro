import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface CompType {
  label: string;
  id: string;
}

interface SeriesType {
  label: string;
  comps: CompType[];
}

interface SeriesStoreType {
  series: SeriesType[];
  selected: string;
  setSelected: (newSelected: string) => void;
  setSeries: (series: SeriesType[]) => void;
}

export const useCompsStore = create<SeriesStoreType>()(
  devtools(
    persist(
      (set) => ({
        series: [],
        selected: "",
        setSelected: (selected: string) => {
          set({ selected });
        },
        setSeries: (series: SeriesType[]) => {
          set({ series });
        },
      }),
      {
        name: "comps-store",
      }
    )
  )
);
