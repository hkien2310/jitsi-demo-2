"use client";
import { create } from "zustand";
import cachedKeys from "../const/cachedKeys";

export type cachedKeyType = keyof typeof cachedKeys;

const useStore = create<{ [key: string]: any }>((set) => ({
  state: {},
  save: (key: cachedKeyType, value: any, isFunction: boolean) => {
    if (isFunction) {
      return set((rootState) => ({
        state: {
          ...rootState.state,
          [key]: value(rootState.state),
        },
      }));
    } else {
      return set((rootState) => ({
        state: {
          ...rootState.state,
          [key]: value,
        },
      }));
    }
  },
}));

export const useSave = () => useStore((rootState) => rootState.save);
export const useGet = (key: string) => useStore((rootState) => rootState.state?.[key]);
export default useStore;
