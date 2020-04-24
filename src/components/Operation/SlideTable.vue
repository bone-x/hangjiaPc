<template>
  <div class="SlideTable">
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      fixed="right"
      border>
      <el-table-column
        prop="id"
        label="排序"
        min-width="20"></el-table-column>

      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="展示标题"
        width="100"></el-table-column>

      <el-table-column
        prop="address"
        label="图片"
        width="150"
        height="80"></el-table-column>

      <el-table-column
        :show-overflow-tooltip="true"
        prop="tolink"
        label="跳转链接"
        width="200"></el-table-column>

      <el-table-column
        prop="ontime"
        label="生效时间"
        min-width="50"></el-table-column>

      <el-table-column
        prop="maker"
        label="创建人"
        min-width="40"></el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        min-width="40"></el-table-column>

      <el-table-column
        prop="remark"
        label="操作"
        min-width="80">
        <template slot-scope="props">
          <span
            :class="{ gray: props.$index === 0 }"
            class="finger"
            @click="toUp(props)">上移</span>
          <span
            :class="{ gray: props.$index === props.length - 1 }"
            class="finger"
            @click="toDown(props)">下移</span>
          <span
            class="finger"
            @click="toEdit(props)">编辑</span>
          <span
            class="finger"
            @click="toDelete(props)">删除</span>
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
    return {

    };
  },
  methods: {
    toUp(props) {
      if (props.$index > 0) {
        this.$emit('up', { index: props.$index, id: props.row.id });
      }
    },
    toDown(props) {
      if (props.$index < this.tableData.length - 1) {
        this.$emit('down', { index: props.$index, id: props.row.id });
      }
      console.log('down');
    },
    toDelete(props) {
      this.$emit('delete', { index: props.$index });
      console.log('delete');
    },
    toEdit(props) {
      this.$emit('edit', { index: props });
      console.log('edit', props);
    },
  },
};
</script>

<style lang="scss" scoped>
.SlideTable {
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
