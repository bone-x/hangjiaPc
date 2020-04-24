<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
  >
    <el-table-column
      label="类别ID"
      width="80"
      align="center"
    >
      <template slot-scope="scope">{{ scope.row.id }}</template>
    </el-table-column>
    <el-table-column
      v-if="columns.length===0"
      width="150"
      align="center"
    >
      <template slot-scope="scope">
        <span
          v-for="space in scope.row._level"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(0,scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <i
            v-if="!scope.row._expanded"
            class="el-icon-plus"
          />
          <i
            v-else
            class="el-icon-minus"
          />
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      v-else
      :key="column.value"
      :label="column.text"
      :width="column.width"
      align="center"
    >
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span
          v-for="space in scope.row._level"
          v-if="index === 0"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(index,scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <i
            v-if="!scope.row._expanded"
            class="el-icon-plus"
          />
          <i
            v-else
            class="el-icon-minus"
          />
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <el-table-column
      label="所属项目"
      width="200"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.productId === 1">行家</span>
        <span v-if="scope.row.productId === 2">子墨学院</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      fixed="right"
      width="300"
      align="left"
    >
      <template slot-scope="scope">
        <span v-permission="['info:category:update']">
          <el-button
            v-if="scope.row.name !== '热点' && scope.row.name !== '早报' && scope.row.name !== '大事'"
            size="mini"
            :class="scope.row.parent && scope.row.parent.name === '热点' || scope.row.parent && scope.row.parent.name === '早报' || scope.row.parent && scope.row.parent.name === '大事' ? 'hide' : ''"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
        </span>
        <span v-permission="['info:category:delete']">
          <el-button
            v-if="scope.row.name !== '热点' && scope.row.name !== '早报' && scope.row.name !== '大事'"
            :class="scope.row.parent && scope.row.parent.name === '热点' || scope.row.parent && scope.row.parent.name === '早报' || scope.row.parent && scope.row.parent.name === '大事' ? 'hide' : ''"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </span>
        <span v-permission="['info:category:save']">
          <el-button
            v-if="scope.row.name !== '热点' && scope.row.name !== '早报' && scope.row.name !== '大事'"
            v-show="scope.row._level === 1"
            size="mini"
            type="info"
            @click.native="Addsecondtype(scope.$index, scope.row)"
          >添加二级类别</el-button>
        </span>

      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './tree';

export default {
  name: 'LTreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false,
    },
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
    },
  },
  methods: {
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;';
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return (
        index === 0 &&
        record.subInfCategoryVOList &&
        record.subInfCategoryVOList.length > 0
      );
    },
    handleEdit(index, row) {
      this.$emit('selection-change', index, row);
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.$emit('selection-del', index, row);
      console.log(index, row);
    },
    Addsecondtype(index, row) {
      this.$emit('selection-add', index, row);
    },
  },
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
    content: '';
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
.hide {
  display: none;
}
</style>
