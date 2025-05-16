<script>
    import { authStore } from "../../stores/authStore.js";

    let name = '';

    $: name = $authStore.user ? $authStore.user.name : "";
    
</script>

<div>
    <h1>Dashboard</h1>
    <p>Welcome {name}</p>
</div>
