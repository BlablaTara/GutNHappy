<script>
  import { Router, Route } from "svelte-routing";
  import "./css/navigation.css";
  import Home from "./pages/Home/Home.svelte";
  import Dashboard from "./pages/Dashboard/Dashboard.svelte";
  import Profile from "./pages/Profile/Profile.svelte";
  import AddHealth from "./pages/AddHealth/AddHealth.svelte";
  import Leaderboard from "./pages/Leaderboard/Leaderboard.svelte";

  import NavBar from "./components/NavBar.svelte";
  import FlipCard from "./components/FlipCard.svelte";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import ForgotPassword from "./components/ForgotPassword.svelte";
  import ResetPassword from "./components/ResetPassword.svelte";
  import { onMount } from "svelte";
  import { fetchGet } from "./utils/fetch";
  import { authStore } from "./stores/authStore";

  export let url;

  onMount(async () => {
    try {
      const resultDB = await fetchGet("/api/protected");
      authStore.set({
        isLoggedIn: !!resultDB.isLoggedIn,
        user: resultDB.user ?? null,
        loading: false,
      });
    } catch {
      authStore.set({ isLoggedIn: false, user: null, loading: false });
    }
  });
</script>

<Router {url}>
  <NavBar />

  <div>
    <Route path="/"><Home /></Route>
    <Route path="/login"><FlipCard /></Route>

    <Route path="/dashboard">
      <PrivateRoute component={Dashboard} />
    </Route>
    <Route path="/add-health">
      <PrivateRoute component={AddHealth} />
    </Route>
    <Route path="/leaderboard">
      <PrivateRoute component={Leaderboard} />
    </Route>
    <Route path="/profile">
      <PrivateRoute component={Profile} />
    </Route>

    <Route path="/users/forgot-password"><ForgotPassword /></Route>
    <Route path="/users/reset-password"><ResetPassword /></Route>
  </div>
</Router>

<!--Small bg-pictures-->
<div class="bg-image bg1"></div>
<div class="bg-image bg2"></div>
<div class="bg-image bg3"></div>
<div class="bg-image bg4"></div>
<div class="bg-image bg5"></div>
<div class="bg-image bg6"></div>
<div class="bg-image bg7"></div>
<div class="bg-image bg8"></div>
