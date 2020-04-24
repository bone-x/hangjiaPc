<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="选择商品类目"
      width="60%"
      left>
      <!-- 表格部分 -->
      <el-table
        ref="multipleTable"
        :data="tableData2"
        tooltip-effect="dark"
        style="width: 100%;overflow-y: scroll;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="商品一级类目"
          min-width="70">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品二级类目"
          min-width="120"></el-table-column>
      </el-table>
      <!-- 以上是表格部分 -->
      <span
        slot="footer"
        class="dialog-footer tablefoot">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
};
</script>
<style scoped lang="scss">

</style>
