import { mount } from "svelte";
import "./css/app.css";
import App from "./App.svelte";
import "toastr/build/toastr.min.css";

// @ts-ignore
const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
