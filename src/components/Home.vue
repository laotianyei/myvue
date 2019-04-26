<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isOpen ? '65px':'200px'">
        <div class="toggle_bar" @click="isOpen=!isOpen">lll</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isOpen"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.id+''"
            :style="{width:isOpen ? '65px':'200px'}"
            v-for="(item,index) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class=" 'iconfont icon-' + iconList[index]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item2.path">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.leftListData()
  },

  methods: {
    async leftListData() {
      const { data: dt } = await this.$http.get('menus')
      // 存放路由
      // console.log(dt.data[0].path)
      if (dt.meta.status != 200) {
        this.$message.error(dt.meta.msg)
      }
      this.menuList = dt.data
    },
    logout() {
      this.$confirm('确认要退出吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'info',
            message: '退出成功'
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel' ? '取消退出' : '退出成功'
          })
        })
    }
  },

  data() {
    return {
      isOpen: false,
      menuList: '',
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    .logo-box {
      display: flex;
      font-size: 22px;
      color: #fff;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.toggle_bar {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  user-select: none;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  letter-spacing: 0.1em; /*间距*/
  cursor: pointer;
}
</style>
