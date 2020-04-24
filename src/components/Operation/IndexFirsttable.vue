<template>
  <div>
    <el-table
      v-loading="loading"
      :data="getDataList"
      element-loading-text="正在加载......"
      style="width: 100%"
      @row-click="rowClick"
    >
      <el-table-column width="80">
        <template slot-scope="props">
          <span class="tran_box">
            <el-checkbox v-model="props.row.selected"></el-checkbox>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="编号"
        width="180"></el-table-column>
      <el-table-column
        prop="name"
        label="姓名"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      dataList: [
        { id: 1, name: 'name1', selected: false },
        { id: 2, name: 'name2', selected: false },
        { id: 3, name: 'name3', selected: false },
        { id: 4, name: 'name4', selected: false },
        { id: 5, name: 'name5', selected: false },
      ],
      currentId: null,
    };
  },
  computed: {
    getDataList() {
      const that = this;
      if (!that.currentId.id) {
        that.dataList.map((item) => {
          item.selected = false;
        });
        return that.dataList;
      }
      that.dataList.map((item) => {
        item.selected = item.id === that.currentId.id;
      });
      return that.dataList;
    },
  },
  created: {},
  methods: {
    rowClick(row, column, cell, event) {
      this.currentId = row.id;
    },
  },
};
</script>
<style>
  .tran_box .el-checkbox__inner {
    border-radius: 9px;
  }
</style>
