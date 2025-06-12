import { mount } from "svelte";
import "./css/app.css";
import App from "./App.svelte";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: 3000,
};

// @ts-ignore
const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
