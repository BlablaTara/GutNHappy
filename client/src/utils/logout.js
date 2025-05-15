import { fetchPost } from "./fetch.js";
import { navigate } from "svelte-routing";
import { authStore } from "../stores/authStore.js";

export async function logout() {
    await fetchPost("/api/logout");
    authStore.set({ isLoggedIn: false, user: null, loading: false });
    navigate("/login");
}