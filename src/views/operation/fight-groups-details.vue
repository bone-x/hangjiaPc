<template>
  <div class="content-container">
    <!-- 总览 -->
    <h4>
      <span class="color-block-primary"></span>
      拼团详情
    </h4>
    <section style="padding: 10px;">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="24">
          <label>团名：</label>
          <span>{{ groupName }}</span>
        </el-col>
      </el-row>

      <el-row style="margin-bottom: 10px;">
        <el-col :span="5">
          <label>开始时间：</label>
          <span>{{ groupStartTime }}</span>
        </el-col>
        <el-col :span="4">
          <label>有效期：</label>
          <span>{{ effectiveTerm }}h</span>
        </el-col>
        <el-col :span="4">
          <label>已进行：</label>
          <span style="color: red;">{{ toTimeStr }}</span>
        </el-col>
      </el-row>

      <el-row style="margin-bottom: 10px;">
        <el-col :span="24">
          <label>总订单数：</label>
          <span style="color: red;">{{ orderNum }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <label>总成交量：</label>
          <span>{{ quantity }}</span>
        </el-col>
        <el-col :span="16">
          <label>总成交金额：</label>
          <span style="color: red;">{{ account }}元</span>
        </el-col>
      </el-row>
    </section>

    <!-- 拼团详情 -->
    <h4>
      <span class="color-block-primary"></span>
      拼团详情
    </h4>
    <section style="padding: 10px;">
      <!-- 过滤栏 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-cascader
            :options="filterConfig.categoryOptions"
            v-model="filter.categorySelected"
            placeholder="商品类目"
            change-on-select
          ></el-cascader>
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
          <el-button @click.native="clearFormFilter">清空</el-button>
        </el-col>

        <el-col :span="2" style="text-align: center;">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click.native="getFightGroupGoodsList(1)"
          >搜索</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table
        ref="table"
        :data="tableData"
        :default-sort="filterConfig.sort"
        max-height="600"
        tooltip-effect="dark"
        border
        style="width: 100%; margin-top: 30px;"
        @sort-change="onTableSort"
      >
        <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
        <el-table-column min-width="150" prop="goodsName" label="拼团商品" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="150" prop="goodsCategoryName" label="商品类目" show-overflow-tooltip></el-table-column>
        <el-table-column width="150" prop="price" label="商品原价"></el-table-column>
        <el-table-column width="150" prop="groupPrice" label="拼团价"></el-table-column>
        <el-table-column width="150" prop="groupSize" label="初始成团数"></el-table-column>
        <el-table-column width="150" prop="stockCount" label="商品可用库存"></el-table-column>
        <el-table-column :sort-orders="['ascending', 'descending']" width="150" prop="quantity" label="成交数量" sortable="custom"></el-table-column>
        <el-table-column width="150" prop="$account" label="成交金额"></el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <router-link
              :to="{ name: 'OperationFightGroupsDetailsOne', params: { id: (scope.row.groupId + ',' + scope.row.goodsTemplateId) } }"
            >
              <el-button size="mini">详情</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-row style="margin-top: 20px;" type="flex" justify="center" align="middle">
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          style="display: inline-block;"
          @current-change="oncurrPageChange"
        ></el-pagination>
        <el-button size="mini" style="margin-left: 20px;">跳转</el-button>
      </el-row>
    </section>

    <!-- 全局操作按钮 -->
    <el-row :gutter="30" type="flex" justify="center" align="middle" style="margin-top: 50px;">
      <el-col :span="5" center>
        <el-button size="medium" @click.native="goBack">返回</el-button>
      </el-col>
      <el-col v-if="activityStatus !== 3 && publishStatus !== 3" :span="5" center>
        <el-button size="medium" type="primary" @click.native="onSetDownGroup">下架</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { goodsCategoryAll, goodsDelete } from "@/api/goods";

import {
  getFightGroupInfo,
  getFightGroupGoodsList,
  changeFightGroupsUpAndDown
} from "@/api/operation";

import { formatDate, toTimeByMsec } from "@/utils";

const AdapterCategoryMenuData = function(data = []) {
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
    if (i.childList && i.childList.length > 0) {
      item.children = AdapterCategoryMenuData(i.childList);
    }

    return item;
  });
  return temp;
};

export default {
  name: "OperationFightGroupsDetails",
  components: {},
  data() {
    return {
      groupName: "",
      groupStartTime: "",
      effectiveTerm: "",
      toTimeStr: "",
      toTimeNum: 0,
      isStartTimer: null,
      orderNum: 0,
      quantity: 0,
      account: 0,
      activityStatus: 0,
      publishStatus: 0,

      filterConfig: {
        categoryOptions: [],
        sort: {
          prop: "quantity",
          order: "descending"
        }
      },
      filter: {
        goodsName: "",
        categorySelected: [],
        sidx: "",
        sort: "",
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      tableData: []
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    // 获取总览信息
    this.getFightGroupInfo();
    // 获取商品类目菜单列表
    goodsCategoryAll().then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.filterConfig.categoryOptions = menuData;
    });
    // 获取默认列表数据
    this.getFightGroupGoodsList();
  },

  methods: {
    onRouteChange(to) {
      if (to.name === "OperationFightGroupsDetails") {
        this.getFightGroupInfo();
        this.getFightGroupGoodsList(this.filter.currPage);
      } else {
        clearInterval(this.isStartTimer);
      }
    },

    // 清空筛选栏
    clearFormFilter() {
      this.filter.categorySelected = [];
      this.filter.goodsName = "";
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 获取拼团总览信息
    async getFightGroupInfo() {
      const res = await getFightGroupInfo(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();

      // 活动状态
      this.activityStatus = res.result.activityStatus;

      // 上架状态
      this.publishStatus = res.result.publishStatus;

      // 团名
      this.groupName = res.result.groupName;
      // 开始时间
      if (res.result.groupStartTime) {
        this.groupStartTime = formatDate(res.result.groupStartTime, 8);
      }
      // 有效期
      this.effectiveTerm = res.result.effectiveTerm;
      // 已进行时间
      if (res.result.activityStatus === 1) {
        this.toTimeStr = "00:00:00";
      } else if (res.result.activityStatus === 2) {
        const s =
          +new Date(formatDate(res.result.sysDate, 8)) -
          +new Date(formatDate(res.result.groupStartTime, 8));
        this.toTimeStr = toTimeByMsec(s);
        this.toTimeNum = s;
        clearInterval(this.isStartTimer);
        this.isStartTimer = setInterval(() => {
          this.toTimeNum += 1000;
          this.toTimeStr = toTimeByMsec(this.toTimeNum);
        }, 1000);
      } else if (res.result.activityStatus === 3) {
        this.toTimeStr = "24:00:00";
      }

      // 总订单数
      this.orderNum = res.result.orderNum;

      // 总成交量
      this.quantity = res.result.quantity;

      // 总成交金额
      this.account = res.result.account;
    },

    // 适配商品列表数据到UI
    adapterTableDataToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0
      } = result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;

      this.tableData = list.map(item => {
        // 成交金额
        item.$account = `${item.account}元`;
        return item;
      });
    },

    // 根据参数获取商品列表
    async getFightGroupGoodsList(pageNum = 1) {
      const options = {
        groupId: this.$route.params.id,
        goodsName: this.filter.goodsName,
        sortOrder: this.filter.sort,
        goodsCategoryId: 0,
        // 页码
        pageNum
      };

      if (this.filter.categorySelected.length > 0) {
        options.goodsCategoryId = this.filter.categorySelected[
          this.filter.categorySelected.length - 1
        ];
      }

      // 发起请求
      const res = await getFightGroupGoodsList(options);
      if (res.code !== 200) return Promise.reject();
      this.adapterTableDataToUI(res.result);

      this.$nextTick(() => {
        // 清空选择的项
        this.$refs.table.clearSelection();

        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 下架
    async onSetDownGroup() {
      const confimRes = await this.$confirm(
        "是否确认下架，下架后用户将无法再参与该团？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      if (confimRes) {
        // 确认删除的回调
        const { code } = await changeFightGroupsUpAndDown(
          [this.$route.params.id],
          3
        );
        if (code === 200) {
          this.$message({
            message: "下架成功！",
            type: "success"
          });
          // 获取总览信息
          this.getFightGroupInfo();
          // 重新获取列表
          this.getFightGroupGoodsList();
          window.scrollTo(0, 0);
        }
      }
    },

    // 监听表格排序事件
    onTableSort({ prop, order }) {
      if (prop) this.filter.sidx = String(prop).replace("$", "");
      else this.filter.sidx = "";

      if (order === "descending") this.filter.sort = "desc";
      else if (order === "ascending") this.filter.sort = "asc";
      else this.filter.sort = "";

      this.getFightGroupGoodsList();
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getFightGroupGoodsList(pageNum);
    }
  }
};
</script>

<style lang="less" scoped>
.table-goods-cover {
  display: inline-block;
  width: 100px;
  height: 60px;
}
.color-block-primary {
  display: inline-block;
  width: 5px;
  height: 20px;
  margin-right: 2px;
  background-color: #409eff;
  vertical-align: bottom;
}
</style>
