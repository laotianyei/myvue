<template>
  <!-- 角色 -->
  <div>
    <com-crumb nm="角色"></com-crumb>
    <!-- 分配权限对话框 -->
    <el-dialog title="角色分配" :visible.sync="rolesDiaLog" width="30%">
      
      <el-form label-width="120px" :model="allotRolesData">
        <el-form-item label="角色名称：">{{allotRolesData.roleName}}</el-form-item>
        <el-form-item label="选取权限：">
          <!-- 权限树 -->
          <el-tree
            :data=" rolesTreeData"
            :props="roles"
            show-checkbox
            :default-expand-all="true"
            :default-checked-keys=defaultchecked
            node-key="id"
            ref="tree"
          ></el-tree>
          <!-- :check-on-click-node="pid" -->
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="rolesDiaLog = false">取 消</el-button>
        <el-button type="primary" @click="rightsTreeAdd()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <!-- 角色表格 -->
      <el-table border :data="rolesListData" stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(item,index) in info.row.son"
              :key="item.id"
              :style="{'border-top':'1px solid rgb(235,238,245)','border-bottom' :index ?'1px solid rgb(235,238,245)':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="delTag(info.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 第一个不要设置上边框否则会边框重叠 -->
                <el-row
                  v-for="(item2,index2) in item.children"
                  :key="item2.id"
                  :style="{'border-top' :index2==0 ?'':'1px solid rgb(235,238,245)'}"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="delTag(info.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-col>
                      <el-tag
                        closable
                        type="danger"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="delTag(info.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="600"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="600"></el-table-column>
        <el-table-column prop="authName" label="操作">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="allotRoles(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.rolesList()
  },
  methods: {
    async rightsTreeAdd(){
      // 全选和半选的id
      var arr1 = this.$refs.tree.getCheckedKeys()
      var arr2 = this.$refs.tree.getHalfCheckedKeys()
      // console.log(arr1);
      
      var he = arr1.concat(arr2).join(',')
      const {data:dt} = await this.$http.post(`roles/${this.allotRolesData.id}/rights`,{rids:he})
      if(dt.meta.status != 200){
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.rolesDiaLog = false
      this.rolesList()
    }
    ,
    async allotRoles(rolesData) {
      this.allotRolesData = rolesData
      const {data:dt} = await this.$http.get('/rights/tree')
      // console.log(rolesData)
      // 存放第三级别的id
      var key = []
      this.getHaveRights(rolesData,key)
      this.defaultchecked = key

      this.rolesTreeData = dt.data
      this.rolesDiaLog = true
    },
    getHaveRights(node,arr){
      // 递归
      // 如果是第一个字段
      if(node.son){
        node.children = node.son
      }
      // 如果是第三个字段把第三个字段的id传到arr
      if(!node.children){
        return arr.push(node.id)
        //return console.log(node.id) 
      }
      
      node.children.forEach(item=>{
        this.getHaveRights(item,arr)
      })
      // console.log(arr)
    },
    // 删除权限 角色数据，权限id/:roleId/rights/:rightId
    async delTag(role, rightsId) {
      const { data: dt } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightsId}`
      )
      // console.log(dt.data)
      // console.log(role.son)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          // this.rolesList()   数据全部刷新会刷新页面，用户体验不好
          role.son = dt.data //数据局部更新
        })
        .catch(() => {})
    },

    async rolesList() {
      const { data: dt } = await this.$http.get('/roles')
      // console.log(dt.data)
      // 不加遍历对象会报错 [Vue warn]: Error in callback for watcher "data": "Error: if there's nested data, rowKey is required."
      // 原因：el-table组件本身也有使用children字段，而我们的数据提供也有此字段，但是该数据的样子不符合el-table表格的要求，所以报错了
      dt.data.forEach(item => {
        // 把children赋值给son然后再把children删了
        item.son = item.children
        delete item.children
      })

      this.rolesListData = dt.data
    }
  },
  data() {
    return {
      rolesListData: [],
      rolesDiaLog: false,
      allotRolesData: {
        id: '',
        roleDesc: '',
        roleName: ''
      },
      roles:{
        label:'authName',
        children:'children'
      },
      // 权限树数据
      rolesTreeData:[],

      defaultchecked:[]
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
