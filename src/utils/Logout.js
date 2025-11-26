import { getDefaultStore, useAtom } from "jotai"
import { authUserAtom } from "../store/other"

export const Logout = () =>{
     const store = getDefaultStore();
     store.set(authUserAtom,{});
     window.location.href = "/";
}