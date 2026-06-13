import { create } from "zustand";

interface userstate {
  username: string;
  role: string;
  setUsername: (username: string) => void;
  setRole: (role: string) => void;
}

const userStore = create<userstate>((set) => ({
  username: "",
  role: "",
  setUsername: (username: string) => set({ username }),
  setRole: (role: string) => set({ role }),
}));

export default userStore;
