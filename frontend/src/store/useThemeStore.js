// import {create} from 'zustand';

// export const useThemeStore = create( (set) => ({
//     theme : localStorage.getItem('chat-theme') || 'light', //used to get theme from local storage of the user
//     setTheme : (theme) => { 
//         localStorage.setItem('chat-theme', theme), //used to set theme to local storage of the user
//         set({theme}) //used to update the theme state in the store
//     }, 
// }));



import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));