<script>
    import { fetchPost } from "../utils/fetch.js";
    import toastr from "toastr";


    let params = new URLSearchParams(window.location.search);
    let token = params.get("token");

    let newPassword = '';
    let confirmPassword = '';

    async function resetPassword() {
        if (newPassword !== confirmPassword) {
            toastr.error("Passwords do not match!");
            return;
        }

        const res = await fetchPost('/api/reset-password', {
            token,
            newPassword
        });

        if (res.error) {
            toastr.error(res.error);
    
        } else {
            toastr.success("Password has been reset! - redirecting...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);  
        }
    }
</script>

<h2>Reset your Password</h2>
<input type="password" placeholder="New password" bind:value={newPassword} />
<input type="password" placeholder="Confirm password" bind:value={confirmPassword} />
<button on:click={resetPassword}>Reset Password</button>