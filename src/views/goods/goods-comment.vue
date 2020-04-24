<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <multi-cascader
          :options="filterConfig.categoryOptions"
          v-model="filterConfig.categorySelected"
          @on-change="onCategoryValueChange"
        ></multi-cascader>
      </el-col>

      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model="filter.goodsName"
          name="goodsName"
          placeholder="请输入商品名称"
          title="请输入商品名称"
          type="text"
        ></el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click.native="getGoodsCommentList(1)">查询</el-button>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>

      <el-col :offset="10" :span="3" center>
        <el-button v-permission="['goods:evaluate:export']" style="margin-left: 20px;" @click.native="exportData">导出</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="goods-table"
      :data="goodsCommentList"
      max-height="700"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column width="100" type="index" label="No." align="center"></el-table-column>
      <el-table-column min-width="300" prop="$goodsCategoryDir" label="商品类目"></el-table-column>
      <el-table-column min-width="200" prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column min-width="100" prop="$goodEvaluationRate" label="综合好评率"></el-table-column>
      <el-table-column min-width="100" prop="teacherScore" label="讲师平均分"></el-table-column>
      <el-table-column min-width="100" prop="courseScore" label="商品平均分"></el-table-column>
      <el-table-column min-width="100" prop="evaluationCount" label="评价人数"></el-table-column>
      <el-table-column min-width="200" prop="$evaluationTime" label="最近评价时间"></el-table-column>

      <el-table-column label="操作" min-width="100" fixed="right">
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'GoodsCommentDetails', params: { id: scope.row.goodsId } }"
          >
            <el-button size="mini">查看明细</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24" style="text-align: center;">
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="oncurrPageChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
import MultiCascader from "@/components/MultiCascader";
import {
  goodsCategoryAll,
  getGoodsCommentList,
  getExportGoodsComment,
} from "@/api/goods";
import { formatDate } from "@/utils";

const AdapterCategoryMenuData = function (data = []) {
  /**
    id: key,
    level,
    label: `${key}菜单${level}-${i}`,
    value: key,
    checked: false,
    children: hasChilren ? [] : null,
   */
  const temp = data.map(i => {
    const item = {
      id: i.id,
      value: i.id,
      level: i.level,
      label: i.name,
      checked: false
    };
    if (i.childList) {
      item.children = AdapterCategoryMenuData(i.childList);
    }

    return item;
  });
  return temp;
};

export default {
  name: "GoodsComment",
  components: {
    MultiCascader
  },
  data() {
    return {
      filterConfig: {
        categoryOptions: [],
        categorySelected: [],
      },
      filter: {
        goodsName: "",
        categoryIds: "",
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      selectedItems: [],
      goodsCommentList: [],
    };
  },
  created() {
    // 获取商品类目菜单列表
    goodsCategoryAll().then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.filterConfig.categoryOptions = menuData;
    });

    // 获取列表
    this.getGoodsCommentList();
  },
  methods: {
    // 清空筛选栏
    clearFormFilter() {
      this.filterConfig.categorySelected = [];
      this.filter.goodsName = "";
      this.filter.categoryIds = "";
    },

    // 遍历树获取所需商品类目id，对接到filter.categoryIds
    adapterSelectedCategoryIds(treeArr) {
      const ids = [];
      const recurve = arr => {
        arr.forEach(i => {
          if (i.label === "全选") return false;
          if (i.checked) {
            ids.push(i.id);
          } else if (i.indeterminate && i.children && i.children.length > 0) {
            recurve(i.children);
          }
        });
      };
      recurve(treeArr);
      this.filter.categoryIds = ids.join(",");
    },

    // 获取商品评价列表
    async getGoodsCommentList(pageNum = 1) {
      const options = {
        pageNum,
        goodsName: this.filter.goodsName,
        goodsCategoryId: this.filter.categoryIds,
        pageSize: this.filter.pageSize || 10,
      };
      const res = await getGoodsCommentList(options);
      if (res.code !== 200) return Promise.reject();
      const {
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0,
        list = [],
      } = res.result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;

      this.goodsCommentList = list.map(i => {
        i.$goodsCategoryDir = '';
        if (_.isArray(i.goodsCategoryNameArr)) i.$goodsCategoryDir = i.goodsCategoryNameArr.join('>');
        i.$goodEvaluationRate = `${i.goodEvaluationRate}%`;
        i.$evaluationTime = formatDate(i.evaluationTime, 8);
        return i;
      });
    },

    // 商品类目选中值改变时触发
    onCategoryValueChange(values, item, arr) {
      this.adapterSelectedCategoryIds(arr);
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getGoodsCommentList(pageNum);
    },
    
    // 导出数据
    async exportData() {
      const options = {
        goodsName: this.filter.goodsName,
        goodsCategoryId: this.filter.categoryIds,
      };
      const res = await getExportGoodsComment(options);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },
  }
};
</script>

<style lang="less" scoped>
.table-goods-cover {
  display: inline-block;
  width: 100px;
  height: 60px;
}
</style>
