<script>
    import { authStore } from "../../stores/authStore";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { navigate } from "svelte-routing";
    import toastr from "toastr";

    let user;
    let loading = true;

    onMount(() => {
        const store = get(authStore)
        user = store.user;
        loading = false;
    });

    async function deleteProfile() {
        const confirmed = confirm("Are you sure you want to delete your account?");
        if (!confirmed) 
        return;

        try {
            const resultDB = await fetch("/api/protected/profile", {
                method: "DELETE",
            });

            if (!resultDB.ok) {
                toastr.error("Could not delete profile.")
                return;
            }

            authStore.set({ isLoggedIn: false, user: null, loading: false });
            toastr.success("Profile deleted successfully!");
            navigate("/");
        } catch (error) {
            toastr.error("Something went wrong while deleting your profile.");
        }
    }

</script>

{#if loading}
    <p>Loading...</p>
{:else if user}
    <div class="container">
        <h1>Your Profile</h1>
        <p><strong>Username: </strong> {user.username}</p>
        <p><strong>Email: </strong> {user.email}</p>

        <button class="delete-button" on:click={deleteProfile}>Delete Account</button> 
    </div>
{:else}
    <p>Your are not logged ind anymore.</p>
{/if}

<style>

    p {
        font-size: 1.5rem;
        color: #666;
    }

    .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    }

    .delete-button {
        margin-top: 2rem;
        padding: 0.75rem 1.5rem;
        background-color: #e63946;
        color: white;
        border: none;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
</style>