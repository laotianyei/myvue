<template>
  <div>
    <!-- 面包屑 -->
    <!-- <com-crumb nm="用户"></com-crumb> -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户分配角色 -->
    <el-dialog title="用户分配角色" :visible.sync="showRolesDiaLog">
      <el-form :model="rolesDiaLog" :rules="userRules" ref="roleRef">
        <el-form-item label="当前用户：">{{rolesDiaLog.username}}</el-form-item>
        <el-form-item label="当前角色：">{{rolesDiaLog.role_name}}</el-form-item>
        <el-select placeholder="请选择" v-model="rolesDiaLog.rrid">
          <!-- 在这需要用roleList循环下拉菜单 -->
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
            :label="item.roleName"
          ></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRolesDiaLog = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改用户" :visible.sync="updateUsers">
      <el-form :model="updateForm" label-width="80px" :rules="updateRules" ref="updateForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUsers = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加 -->
    <!-- @close 关闭的回调 -->
    <el-dialog title="添加用户" :visible.sync="addUserDiaLog" @close="$refs.ruleForm.resetFields()">
      <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDiaLog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- clearable可清空 -->
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            clearable
            v-model="queryData.query"
            @keyup.enter.native="getUserList()"
            @clear="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDiaLog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" class="tabel-css" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" :width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" :width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" :width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" :width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" :width="190">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            :width="60"
            @change="userState(info.row,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" :width="180">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDiaLog(info.row.id)"
            ></el-button>

            <el-button type="danger" icon="el-icon-delete" circle @click="delUser(info.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="Top Center 提示文字"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="userAllotRoles(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryData.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },

  methods: {
    async assignRoles() {
      // roleRef
      this.$refs.roleRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            `/users/${this.rolesDiaLog.id}/role`,
            { rid: this.rolesDiaLog.rrid }
          )
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.showRolesDiaLog = false
          this.getUserList()
        }
      })
    },
    // 用户分配角色
    async userAllotRoles(userRole) {
      const { data: dt } = await this.$http.get('roles')
      this.roleList = dt.data
      this.rolesDiaLog = userRole
      this.showRolesDiaLog = true
      // console.log(dt)
    },
    // 修改用户
    xiugai() {
      this.$refs.updateForm.validate(async valid => {
        // users/:uId/state/:type
        if (valid == true) {
          const { data: dt } = await this.$http.put(
            '/users/' + this.updateForm.id,
            this.updateForm
          )
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.getUserList()
          this.updateUsers = false
        }
      })
    },
    // 修改用户显示对话框
    async showEditDiaLog(id) {
      // 显示对话框
      this.updateUsers = true
      const { data: dt } = await this.$http.get('/users/' + id)
      // console.log(dt.data)
      this.updateForm = dt.data
    },

    // 删除用户
    delUser(id) {
      this.$confirm('确定要删除该条记录吗?', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('/users/' + id)
          // console.log(dt)
          // console.log(id)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 删除成功 刷新页面重新获取数据
          this.$message.success(dt.meta.msg)
          if (this.userList.length == 1 && this.queryData.pagenum > 1) {
            this.queryData.pagenum--
          }
          // console.log(this)
          this.getUserList()
        })
        .catch(action => {})
    },
    // 添加用户

    tianjia() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid == true) {
          const { data: dt } = await this.$http.post('/users', this.ruleForm)
          // console.log(dt)
          // 数据添加成功 提示一下，关闭对话框，刷新页面
          if (dt.meta.status != 201) {
            // 添加失败
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addUserDiaLog = false //关闭对话框
          this.getUserList() //重新获取一下数据就能完成刷新的效果
        }
      })
    },

    // 用户状态
    async userState(id,open) {
      const {data:dt} = await this.$http.put(`users/${id.id}/state/${open}`)
      console.log(dt)
      if(dt.meta.status != 200){
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    handleSizeChange(val) {
      this.getUserList()
      this.queryData.pagesize = val
      // console.log(val)
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.getUserList()
      this.queryData.pagenum = val
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.queryData
      })
      this.queryData.total = dt.data.total
      // console.log(dt)
      if (dt.meta.status == !200) {
        return this.$message.error(dt.meta.msg)
      }
      this.userList = dt.data.users
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('请输入正确的手机号'))
      }
      // 校验成功继续执行
      callback()
    }

    return {
      userList: [],
      // value3: true,
      // 不让会话框页面加载的时候就打开
      addUserDiaLog: false,
      updateUsers: false,
      showRolesDiaLog: false,

      updateForm: {
        id: '',
        mobile: '',
        email: ''
      },

      queryData: {
        query: '', //
        pagenum: 1, // 当前页码
        pagesize: 3, // 每页显示条数
        total: null
      },
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 校验规则

      // 用户分配角色
      rolesDiaLog: {
        username: '',
        role_name: '',
        rrid: 0
      },
      // 角色数据
      roleList: [],

      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
        email: { required: true, message: '请输入邮箱', trigger: 'blur' },
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile }
        ]
      },
      updateRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      },
      userRules: {
        rid: [
          { required: true, message: '请选取要分配的角色', trigger: 'blur' }
        ]
      }
    }
  }
  // handleSizeChange(val){
  //   this.getUserList()
  //   this.queryData.pagesize = val
  //   console.log(val)
  // },
  // handleCurrentChange(val){
  //   console.log(val)
  //   this.getUserList()
  //   this.queryData.pagenum = val
  // }
}
</script>

<style lang="less" scoped>
</style>
