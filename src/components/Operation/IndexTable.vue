<template>
  <div class="IndexTable">
    <el-table
      :data="tableData"
      style="width: 100%"
      fixed="right"
      row-key="id"
      stripe
      border>
      <el-table-column
        prop="date"
        label="排序"></el-table-column>

      <el-table-column
        prop="name"
        label="商品一级类目"
        min-width="80"></el-table-column>

      <el-table-column
        prop="address"
        label="创建人"
        min-width="80"></el-table-column>

      <el-table-column
        prop="date"
        label="创建时间"
        min-width="80"></el-table-column>

      <el-table-column
        prop="remark"
        label="操作"
        min-width="100"
        fixed="right">
        <template slot-scope="props">
          <el-button
            :class="{ gray: props.$index === 0 }"
            class="finger"
            type="primary"
            plain
            @click="forUp(props)">上移123</el-button>
          <el-button
            :disabled="props.$index === props.length - 1 "
            class="finger"
            type="primary"
            plain
            @click="forDown(props)">下移</el-button>
          <el-button
            type="danger"
            @click="forDelete(props)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    forUp(props) {
      if (props.$index > 0) {
        this.$emit('up', { index: props.$index, id: props.row.id });
      }
    },
    forDown(props) {
      if (props.$index < this.tableData.length - 1) {
        this.$emit('down', { index: props.$index, id: props.row.id });
      }
      // console.log(props);
    },
    forDelete(props) {
      this.$emit('delete', { index: props.$index });
      // console.log(888);
    },
  },
};
</script>

<style lang="scss" scoped>
.IndexTable {
  // min-width: 1200px;
  .finger {
    cursor: pointer;
    color: rgba(24, 144, 255, 1);
    margin-right: 8px;
    &.gray {
      color: #999;
    }
  }
}
</style>
