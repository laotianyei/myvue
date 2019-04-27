<template>
    <!-- 面包屑共享 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{nm}}管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{nm}}用户列表</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  // 组件父向子传值的方式
    props:['nm']
}
</script>

<style lang="less" scoped>
</style>
