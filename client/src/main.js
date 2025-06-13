import { mount } from "svelte";
import App from "./App.svelte";
import toastr from "toastr";
import "./css/app.css";
import "toastr/build/toastr.min.css";

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
