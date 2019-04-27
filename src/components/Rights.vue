<template>
  <div>
    <com-crumb nm="权限"></com-crumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="rightsListData" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="280"></el-table-column>
        <el-table-column prop="path" label="路径" width="280"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level == '0' ">一级</el-tag>
            <el-tag v-else-if="info.row.level == '1' " type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: dt } = await this.$http.get('rights/list')
      // console.log(dt)

      this.rightsListData = dt.data
    }
  },
  data() {
    return {
      rightsListData: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
