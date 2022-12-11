<!-- Form for changing allergies (block style) -->
<template>
    <BForm @submit.prevent="submit">
        <h3>Delete account</h3>
        <article>
            <BFormGroup id="deleteacct" label="Deleting your account is irreversible." label-for="deleteacct">
            </BFormGroup>
        </article>
        <BButton variant="primary" @click="callDelete" block>Delete account</BButton>
        <BModal id="bv-modal-deleteacct" hide-backdrop hide-header-close hide-footer>
            <p>
                Are you sure you want to delete your account? Deleting your account is permanent and irreversible.
                Proceed only if you understand these consequences.
            </p>
            <div class="buttons">
                <BButton class="danger" @click="submit">Yes, delete</BButton>
                <BButton @click="$bvModal.hide('bv-modal-deleteacct')">No, cancel</BButton>
            </div>
        </BModal>
        <BAlert v-for="(status, alert, index) in alerts" :key="index"
            :variant="status === 'error' ? 'danger' : 'success'" show>
            {{ alert }}
        </BAlert>
    </BForm>
</template>
    
<script>
export default {
    name: "DeleteAcctForm",
    methods: {
        callDelete() {
            this.$bvModal.show('bv-modal-deleteacct');
        },
        async submit() {
            this.$bvModal.hide('bv-modal-deleteacct');
            const options = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin", // Sends express-session credentials with request
                callback: () => {
                    this.$router.push({ name: 'Login' }); // Goes to Home page after deleting account
                    this.$store.commit("clearRecipes");
                    this.$store.commit("updateShowSuggested", false);
                    this.$store.commit("updateShowByName", false);
                    this.$store.commit('alert', {
                        message: 'Your account has been deleted!', status: 'success'
                    });
                }
            };

            try {
                const r = await fetch("/api/users", options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.$store.commit("setUsername", null);
                this.$store.commit("setUser", null);
                options.callback();
            } catch (e) {
                this.$set(this.alerts, e, "error");
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    },
};
</script>

<style scoped>
.danger {
    border-color: red;
    background-color: red;
}

.buttons {
    gap: 0.25em;
    display: flex;
    align-items: center;
}
</style>