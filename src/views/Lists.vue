<script>
import axios from "axios"
import {
  DocumentAdd,
  Document,
  User as UserIcon,
  SetUp,
} from "@element-plus/icons-vue"

export default {
  naem: "Lists",

  data: () => ({
    token: localStorage.getItem("login_token"),
    lists: JSON.parse(localStorage.getItem("lists")),
    info: JSON.parse(localStorage.getItem("info")),
    asideLoad: localStorage.getItem("lists") ? false : true,
    infoLoad: localStorage.getItem("info") ? true : false,
  }),

  components: {
    DocumentAdd,
    Document,
    UserIcon,
    SetUp,
  },

  created() {
    if (!localStorage.getItem("login_token")) {
      this.$router.replace({ path: "/" })
      return false;
    }

    axios({
      url: "//enroll.immers.icu/api/user-info",
      method: "post",
      headers: {
        token: this.token,
      },
    }).then(res => {
      if(res.data.status_code == 200){
        this.info = res.data.data;
        localStorage.setItem('info',JSON.stringify(res.data.data))
      }else{
        this.Quit()
      }
    })

    axios({
      url: "//enroll.immers.icu/api/lists",
      method: "post",
      headers: {
        token: this.token,
      },
    }).then(res => {
      this.lists = res.data.data
      localStorage.setItem('lists',JSON.stringify(res.data.data))
      this.asideLoad = false
    })


  },

  methods: {
    Quit() {
      localStorage.removeItem("login_token");
      this.$router.replace({ path: "/" });
    },
  },
};
</script>

<template>
  <el-container>
    <el-header>
      <router-link to="/">Enrolling</router-link>
      <el-row align="middle" v-show="info">
        <h2>{{ info.name }}，{{ info.role ? info.role.name : '' }}你好！</h2>
        <el-button @click="Quit">退出</el-button>
      </el-row>
    </el-header>
    <el-container>
      <el-aside v-loading="asideLoad">
        <el-menu mode="vertical" :default-active="$route.path" :router="true">
          <el-menu-item v-for="list of lists" :key="list.id" :index="list.url">
            <el-icon>
              <component :is="list.icon"></component>
            </el-icon>
            <span>{{ list.name }}</span>
          </el-menu-item>
        </el-menu>
        <el-footer>Copyright @ 2022 WarmEpoch</el-footer>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-aside {
  display: inline-flex;
  flex-flow: column wrap;
  justify-content: space-between;
  background: var(--el-fill-color-blank);
  position: sticky !important;
  ;
  top: 60px;
  height: calc(100vh - 60px);
  vertical-align: top;
  width: unset;
}

.el-menu {
  border: none;
}
</style>
