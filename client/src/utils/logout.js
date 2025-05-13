import { fetchPost } from "./fetch.js";
import { navigate } from "svelte-routing";

export async function logout() {
    await fetchPost("/api/logout");
    navigate("/login");
}