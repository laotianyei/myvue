<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="
注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 
      
      -->
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            :props="props"
            :options="options"
            expand-trigger="hover"
            change-on-select
            clearable
            @change="change()"
            v-model="selectedOptions"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tabs>
        <el-tab-pane label="动态参数" :disabled="a">
          <el-button type="primary" size="mini" :disabled="a">添加参数</el-button>
          <el-table border :data="manyList">
            <el-table-column width="60" type="expand">
              <!-- attr_name -->
              <template slot-scope="info">
                <el-tag
                  closable
                  v-for="(temp,index) in info.row.arr_attr_vals"
                  :key="index"
                >{{temp}}</el-tag>
                <!-- {{info.row}} -->
              </template>
            </el-table-column>
            <el-table-column type="index" width="60" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column width="780" label="操作"></el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" :disabled="a">
          <el-button type="primary" size="mini" :disabled="a">添加属性</el-button>
          <el-table border :data="onlyList">
            <el-table-column width="60" type="expand">
              <template slot-scope="info">
                <el-tag
                  closable
                  v-for="(temp,index) in info.row.arr_attr_vals"
                  :key="index"
                >{{temp}}</el-tag>
                <!-- {{info.row}} -->
              </template>
            </el-table-column>
            <el-table-column type="index" width="60" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column width="780" label="操作">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.cateData()
  },
  methods: {
    change() {
      let aa = this.selectedOptions.length
      if (aa == 3) {
        this.a = false
        this.threeId = this.selectedOptions[2]
        this.parOnly()
        this.parMany()
      }
    },
    async parMany() {
      const { data: dt } = await this.$http.get(
        `categories/${this.threeId}/attributes`,
        { params: { sel: this.many } }
      )
      dt.data.forEach(item => {
        item.arr_attr_vals = item.attr_vals.split(' ')
      })
      this.manyList = dt.data
      console.log(this.manyList)
    },
    async parOnly() {
      const { data: dt } = await this.$http.get(
        `categories/${this.threeId}/attributes`,
        { params: { sel: this.only } }
      )
      dt.data.forEach(item => {
        item.arr_attr_vals = item.attr_vals.split(' ')
      })
      this.onlyList = dt.data
      // console.log(this.onlyList)
    },
    async cateData() {
      const { data: dt } = await this.$http.get('/categories', {
        params: { type: 3 }
      })
      this.options = dt.data
      // console.log(dt.data)
    }
  },
  data() {
    return {
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      options: [],
      a: true,
      // b: true,

      selectedOptions: [],
      // 第三级别id
      threeId: [],
      // 动态参数
      only: 'only',
      many: 'many',
      onlyList: [],
      manyList: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
</style>
