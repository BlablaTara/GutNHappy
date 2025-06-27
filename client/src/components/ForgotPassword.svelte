<script>
  import toastr from "toastr";

  import { fetchPost } from "../utils/fetch.js";

  let email = "";

  async function sendReset() {
    const resetResult = await fetchPost("/api/users/forgot-password", {
      email,
    });

    if (resetResult.error) {
      toastr.error(resetResult.error);
    } else {
      toastr.success("Reset link sent to your email");
      toastr.info("Check spam");
      setTimeout(() => {
        window.location.href = "/login?reset=1";
      }, 2000);
    }
  }
</script>

<h2>Forgot Password</h2>
<input class="input" type="email" placeholder="Type your email ..." bind:value={email} />
<button on:click={sendReset}>Send Reset Link</button>

<style>


.input {
  padding: 1rem;
  border-radius: 15px;
  
}

</style>
