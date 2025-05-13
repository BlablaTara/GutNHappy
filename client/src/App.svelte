<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home from "./pages/Home/Home.svelte";
    import Dashboard from "./pages/Dashboard/Dashboard.svelte";
    import About from "./pages/About/About.svelte";

    import NavBar from "./components/NavBar.svelte";
    import FlipCard from "./components/FlipCard.svelte";
    import PrivateRoute from "./components/PrivateRoute.svelte";
    import ForgotPassword from "./components/ForgotPassword.svelte";
    import ResetPassword from "./components/ResetPassword.svelte";

    import "./css/navigation.css"

    export let url;

</script>

<Router {url}>

    <NavBar />
    <!-- <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
    </nav> -->

    <div>
        <Route path="/"><Home/></Route>
        <Route path="/dashboard">
            <PrivateRoute component={Dashboard}/>
        </Route>
        <Route path="/about"><About/></Route>
        <Route path="/login"><FlipCard/></Route>
        <Route path="/forgot-password"><ForgotPassword/></Route>
        <Route path="/reset-password"><ResetPassword/></Route>

    </div>

</Router>




