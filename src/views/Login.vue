<script>
import axios from "axios";
export default {
  naem: "Login",

  data: () => ({
    login: {
      name: '',
      password: ''
    },
    rules: {
      name: [{required: true,message: '请输入账号'}],
      password: [{required: true,min: 8,message: '密码至少为 8 个字符'}]
    },
    loading: false,
  }),

  created() {
    if (localStorage.getItem("login_token")) {
      this.$router.replace({ path: "/lists/add" });
    }
  },

  methods: {
    Login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          axios({
            url: "http://enroll.immers.icu/api/login",
            method: "post",
            data: this.login,
          })
            .then((res) => {
              if (res.data.status_code == 200) {
                localStorage.setItem(
                  "login_token",
                  res.data.data
                );
                this.$router.replace({ path: "/lists/add" });
              } else {
                ElMessage({
                  message: res.data.message,
                  type: "error",
                });
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
  },
};
</script>

<template>
  <el-container>
    <el-header>
      <router-link to="/">Enrolling</router-link>
    </el-header>
    <el-main>
      <el-form :model="login" :rules="rules" ref="form" label-position="top">
        <el-form-item prop="name" label="账号" size="large">
          <el-input v-model="login.name"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="large">
          <el-input v-model="login.password" type="password" @keyup.enter="Login"></el-input>
        </el-form-item>
        <el-button type="primary" @click="Login" size="large" v-loading.fullscreen.lock="loading">登录</el-button>
      </el-form>
    </el-main>
    <el-footer>Copyright @ 2022 WarmEpoch</el-footer>
  </el-container>
</template>

<style scoped>
.el-main {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  --el-main-padding: 20px 3%;
  min-height: calc(100vh - 120px);
}

.el-form {
  width: 480px;
  padding: 2rem;
  background: var(--el-bg-color);
  border-radius: 1rem;
  box-shadow: 0 0 3rem var(--el-color-primary-light-5);
  box-sizing: border-box;
}
</style>
