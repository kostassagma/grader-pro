import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface AuthStoreType {
  encryptedUsername: string;
  encryptedPassword: string;
  cookie: string;
  setAutCredentials: (
    encryptedUsername: string,
    encryptedPassword: string,
    cookie: string
  ) => void;
}

export const useAuthStore = create<AuthStoreType>()(
  devtools(
    persist(
      (set) => ({
        encryptedUsername: "",
        encryptedPassword: "",
        cookie: "",
        setAutCredentials: (
          encryptedUsername: string,
          encryptedPassword: string,
          cookie: string
        ) => {
          set({ encryptedUsername, encryptedPassword, cookie });
        },
      }),
      {
        name: "auth-store",
      }
    )
  )
);
