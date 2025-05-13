<script>
    import { fetchPost } from "../utils/fetch.js";
    import toastr from 'toastr';

    let email = '';
    let error = '';

    async function sendReset() {
        const res = await fetchPost('/api/forgot-password', { email });

        if (res.error) {
            toastr.error(res.error);
        } else {
            toastr.success('Reset link sent to your email');
            //toastr.info("Check spam")
            setTimeout(() => {
                window.location.href = "/login?reset=1";
            }, 2000); //gør at den venter 2 sekunder så brugeren når at se toasteren
            

        }
    }

</script>

<h2>Forgot Password</h2>
<input type="email" placeholder="Type your email ..." bind:value={email} />
<button on:click={sendReset}>Send Reset Link</button>

<p style="color: red;">{error}</p>