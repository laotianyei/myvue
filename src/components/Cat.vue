<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dialog title="角色分配" width="50%" :visible.sync="showCatDialog">
      <el-form :rules="validation">
        <el-form-item label="分類名称：" label-width="120px" prop="cat_name">
          <el-input v-model="model"></el-input>
        </el-form-item>
        <el-form-item label="分類上級：" label-width="120px">
          <!-- 级联选择器
          change-on-select 允许选择一级
          clearable 支持清空选项
          -->
          <el-cascader
            :props="props"
            :options="options"
            v-model="selectedOptions"
            expand-trigger="hover"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showCatDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addCat()">添加分类</el-button>
      <!-- 表格 -->
      <el-table style="width: 100%" border stripe row-key="cat_id" :data="catListData">
        <el-table-column label="分类名称" prop="cat_name">
          <template slot-scope="info">
            <el-tag>{{info.row.cat_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="420">
          <template slot-scope="info">
            <!-- {{info.row.cat_level}} -->
            <el-tag v-if="info.row.cat_level == 0">一級</el-tag>
            <el-tag v-else-if="info.row.cat_level == 1">二級</el-tag>
            <el-tag v-else>三級</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="420">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 
      :current-page 当前页数
      page-size     显示几条数据
      page-sizes    每页显示几条数据
      total         总条目数parameter.total
      
        
      -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="parameter.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="parameter.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.cateData()
  },
  methods: {
    // 分页相关
    // 页面大小发生改变触发
    handleSizeChange(val) {
      this.cateData()
      this.parameter.pagesize = val
      // console.log(val)
    },
    // 当前页发生改变时触发
    handleCurrentChange(val) {
      // console.log(val)
      this.cateData()
      this.parameter.pagenum = val
    },
    // 添加分类
    async addCat() {
      this.showCatDialog = true
      const { data: dt } = await this.$http.get('/categories', { type: 2 })
      this.options = dt.data
    },
    // 获取分类数据
    // catRef

    async cateData() {
      const { data: dt } = await this.$http.get('/categories', {
        aa: this.parameter
      })

      this.catListData = dt.data
      
      // console.log(this.catListData)
    }
  },
  data() {
    return {
      selectedOptions: [],
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 添加分類對話框
      showCatDialog: false,
      model: '',

      // 分类列表数据
      catListData: [],
      
      parameter:{
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      tot:0,
      validation: {
        cat_name: { required: true, message: '请输入用户名', trigger: 'blur' }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>