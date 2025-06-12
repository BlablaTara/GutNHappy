<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import toastr from "toastr";

  import { authStore } from "../stores/authStore.js";
  import { fetchPost } from "../utils/fetch.js";

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
  let loginData = { username: "MissTerror", password: "ttt" };
  let signupData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  async function login() {
    const response = await fetchPost("/api/login", loginData);

    if (response.error) {
      if (response.status === 429) {
        toastr.error(
          "You have used 3 login attempts. Try again in 15 minutes."
        );
      } else {
        toastr.error(response.error);
      }
    } else {
      toastr.success("Login successful! - redirecting...");

      if (!response.error) {
        authStore.set({
          isLoggedIn: true,
          user: response.user,
          loading: false,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        authStore.set({ isLoggedIn: false, user: null, loading: false });
        toastr.error("Couldn't verify login. Please try again.");
      }
    }
  }

  async function signup() {
    if (signupData.password !== signupData.confirmPassword) {
      toastr.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetchPost("/api/signup", {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });

      if (response.error) {
        toastr.error(response.error);
      } else {
        toastr.success("Signup successful! - redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch {
      toastr.error("Signup failed. Please try again.");
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
          type="username"
          placeholder="Username..."
          bind:value={loginData.username}
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
      </div>

      <div class="side back">
        <div class="header-row">
          <h2>Sign Up</h2>
          <button class="switch-button" on:click={() => (isFlipped = false)}
            >Login</button
          >
        </div>
        <input placeholder="Username..." bind:value={signupData.username} />
        <input
          type="email"
          placeholder="Email..."
          bind:value={signupData.email}
        />
        <input
          type="password"
          placeholder="Password..."
          bind:value={signupData.password}
        />
        <input
          type="password"
          placeholder="Confirm password..."
          bind:value={signupData.confirmPassword}
        />
        <button on:click={signup}>Sign Up</button>
      </div>
    </div>
  </div>
</div>

<style>
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
</style>
