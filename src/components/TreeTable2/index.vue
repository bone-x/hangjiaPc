<template>
  <!-- eslint-disable -->
  <el-table
    ref="c-tree-table-2"
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    @select="onSelectionChange"
    @select-all="onSelectionChange"
  >
    <el-table-column type="selection" align="center" width="50" v-if="isUseSelect"></el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      :key="column.value"
      :label="column.text"
      :width="column.width"
    >
      <template slot-scope="scope">
        <span v-if="index > 0">
          <span
            v-for="space in scope.row._level"
            v-if="index === 1"
            :key="space"
            class="ms-tree-space"
          />
          <span
            v-if="iconShow(index,scope.row)"
            class="tree-ctrl"
            @click="toggleExpanded(scope.$index)"
          >
            <i v-if="!scope.row._expanded" class="el-icon-arrow-right"/>
            <i v-else class="el-icon-arrow-down"/>
          </span>
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>
/* eslint-disable */
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from "./eval";

export default {
  name: "TreeTable",
  props: {
    isUseSelect: {
      type: Boolean,
      default: true
    },
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data(newVal) {
      this.$nextTick(() => {
        if (this.$refs["c-tree-table-2"]) {
          this.$refs["c-tree-table-2"].bodyWrapper.scrollTop = 0;
        }
      });
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    }
  },
  methods: {
    onSelectionChange(selection) {
      this.$emit("on-select", selection);
    },
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 1 && record.children && record.children.length > 0;
    }
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
