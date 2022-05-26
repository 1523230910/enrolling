<script>
export default {
    naem: 'Home',

    data: () => ({

    }),

    created(){
        if(localStorage.getItem("login_token")){
            this.$router.replace({ path: '/lists/add' })
        }else{
            this.$router.replace({ path: '/login' })
        }
    },
    
    methods: {
        
    }
}
</script>

<template>

</template>

<style scoped>

</style>
