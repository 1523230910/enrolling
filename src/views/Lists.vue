<script>
import { DocumentAdd,Document,User as UserIcon,SetUp } from '@element-plus/icons-vue'
export default {
  naem: "Lists",

  data: () => ({}),

  components: {
    DocumentAdd,Document,UserIcon,SetUp
  },

  created() {},

  methods: {},
};
</script>

<template>
  <el-container>
    <el-header>
      <router-link to="/">Enrolling</router-link>
    </el-header>
      <el-aside>
        <el-menu mode="vertical" default-active="1">
          <el-menu-item index="1">
            <el-icon><DocumentAdd /></el-icon>
            <span>信息添加</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Document /></el-icon>
            <span>信息查询</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><SetUp /></el-icon>
            <span>平台设置</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><UserIcon /></el-icon>
            <span>账号设置</span>
          </el-menu-item>
        </el-menu>
        <el-footer> Copyright @ 2022 Immers </el-footer>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
  </el-container>
</template>

<style scoped>
.el-aside {
  display: inline-flex;
  flex-flow: column wrap;
  justify-content: space-between;
  background: var(--el-fill-color-blank);
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  vertical-align: top;
  width: unset;
}

.el-menu{
  border: none;
}


.el-main{
  min-height: 200vh;
  display: inline-block;
  width: 200px;
}

</style>
