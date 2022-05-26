<script>
export default {
    naem: 'Empty',

    created() {
        this.$router.replace({ path: this.$route.query.url })
    },
}
</script>

<template>

</template>

<style scoped>
</style>
