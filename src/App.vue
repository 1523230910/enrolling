<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style>
.el-container.is-vertical {
  background: var(--el-bg-color-page);
  display: block;
}

body,
h1 {
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--el-bg-color);
  position: sticky;
  top: 0;
  z-index: 11;
}

.el-header a {
  padding: 10px 0 10px 6%;
  color: var(--el-color-primary);
  font-size: 1.5rem;
  font-weight: bold;
}

.el-header a:active {
  opacity: .8;
}

.el-header h2 {
  font-size: .9rem;
  font-weight: 400;
}

.el-header .el-button {
  margin-left: 12px;
}

.el-footer {
  text-align: center;
  color: var(--el-color-info-light-5);
  line-height: var(--el-footer-height);
}
.el-message .el-message__badge{
    display: none;
}

@media screen and (max-width: 768px) {
  .el-header h2{
    display: none;
  }
  .el-footer{
    display: none;
  }
  .el-container{
    flex-wrap: wrap;
  }
}
</style>
