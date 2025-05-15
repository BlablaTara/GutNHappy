<script>
  import { fetchPost } from "../utils/fetch.js";
  import toastr from "toastr";
  import { onMount } from "svelte";

  onMount(() => {
    console.log("FlipCard route Mountet");
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-bottom-center",
        timeOut: "3000",
      };
      toastr.info("Remember to check your spam folder.", "Heads up!");
    }
  });

  let isFlipped = false;

  let loginData = { email: "bent@bent.dk", password: "" };
  let signupData = { name: "", email: "", password: "", confirmPassword: "" };
  let error = "";

  async function login() {
    error = "";
    const response = await fetchPost("/api/login", loginData);

    if (response.error) {
      if (response.status === 429) {
        toastr.error(
          "You have used 3 login attempts. Try again in 15 minutes."
        );
      } else {
        toastr.error(response.error);
      }
      error = response.error; //viser rød respons i formen
    } else {
      toastr.success("Login successful! - redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500); //venter 2 sek med at skifte.
    }
  }

  async function signup() {
    error = "";
    if (signupData.password !== signupData.confirmPassword) {
      toastr.error("Passwords do not match!");
      error = "Passwords do not match."; //Rød respons
      return;
    }

    console.log("Signup data being sent:", {
      //log
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
    });

    try {
      const response = await fetchPost("/api/signup", {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      if (response.error) {
        toastr.error(response.error);
        error = response.error; //Rød respons
      } else {
        toastr.success("Signup successful! - redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500); //venter 2 sek med at skifte.
      }
    } catch {
      toastr.error("Signup failed. Please try again.");
      error = "Signup failed. Please try again."; //Rød respons
    }
  }
</script>

<div class="flip-wrapper">
  <div class="card-container">
    <div class="card {isFlipped ? 'flipped' : ''}">
      <div class="side front">
        <div class="header-row">
          <h2>Login</h2>
          <button class="switch-button" on:click={() => (isFlipped = true)}
            >Sign Up</button
          >
        </div>

        <input
          type="email"
          placeholder="Email..."
          bind:value={loginData.email}
        />
        <input
          type="password"
          placeholder="Password..."
          bind:value={loginData.password}
        />
        <button on:click={login}>Login</button>
        <p class="forgot-password">
          Forgot password? - Click <a href="/forgot-password">here</a>
        </p>

        {#if !isFlipped && error}
          <p style="color: red;">{error}</p>
        {/if}
      </div>

      <div class="side back">
        <div class="header-row">
          <h2>Sign Up</h2>
          <button class="switch-button" on:click={() => (isFlipped = false)}
            >Login</button
          >
        </div>
        <input
          placeholder="Name..."
          bind:value={signupData.name}
          on:input={() => (error = "")}
        />
        <input
          type="email"
          placeholder="Email..."
          bind:value={signupData.email}
          on:input={() => (error = "")}
        />
        <input
          type="password"
          placeholder="Password..."
          bind:value={signupData.password}
          on:input={() => (error = "")}
        />
        <input
          type="password"
          placeholder="Confirm password..."
          bind:value={signupData.confirmPassword}
          on:input={() => (error = "")}
        />
        <button on:click={signup}>Sign Up</button>
        {#if !isFlipped && error}
          <p style="color: red;">{error}</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  
  .flip-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px);
  }

  .card-container {
    perspective: 1000px;
    width: 300px;
    height: 450px;
  }

  .card {
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    position: relative;
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

  .side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    padding: 2rem;
    box-sizing: border-box;
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .back {
    transform: rotateY(180deg);
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .switch-button {
    padding: 0.4rem 0.8rem;
    border: 2px solid #0a5c32;
    background-color: transparent;
    color: #0a5c32;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .switch-button:hover {
    background-color: #0a5c32;
    color: white;
  }

  .forgot-password {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    text-align: center;
  }

  .forgot-password a {
    text-decoration: underline;
    color: blue;
    cursor: pointer;
  }

  button {
    margin-top: 1rem;
    display: block;
    padding: 0.6rem;
    font-weight: 600;
    background-color: #0a5c32;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  input {
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
</style>
