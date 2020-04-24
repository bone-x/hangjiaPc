<template>
  <div class="content-container">
    <!-- 运营管理 - 虚拟币 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="filter.mobile" placeholder="搜索用户手机号"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button plain type="primary" icon="el-icon-search" @click.native="getVirtualCurrencyList(1)">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="virtual-currency-table"
      :data="tableData"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column show-overflow-tooltip min-width="200" prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column min-width="150" prop="mobile" label="手机号"></el-table-column>
      <el-table-column min-width="150" prop="mail" label="邮箱"></el-table-column>
      <el-table-column min-width="150" prop="$virtualCurrency" label="当前余额"></el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click.native="onShowDetails(scope.row)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24" center>
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

    <!-- 明细弹窗 -->
    <el-dialog
      :visible.sync="state.isShowDetailsWindow"
      :title="state.detailsWindowTitle"
      width="800px"
      custom-class="dialog-window"
    >
      <!-- table -->
      <el-table
        ref="details-table"
        :data="tableDataDialog"
        border
        style="margin-top: 30px;"
      >
        <el-table-column prop="behaviorRecordStr" label="行为记录"></el-table-column>
        <el-table-column prop="balanceRecordStr" label="交易记录"></el-table-column>
        <el-table-column prop="$currentBalance" label="当前余额"></el-table-column>
        <el-table-column prop="$createTime" label="时间"></el-table-column>
      </el-table>

      <!-- pagination -->
      <el-row style="margin-top: 20px;">
        <el-col :span="24" center>
          <el-pagination
            :current-page.sync="filterDialogTable.currPage"
            :page-size="filterDialogTable.pageSize"
            :total="filterDialogTable.totalCount"
            background
            layout="prev, pager, next, total, jumper"
            @current-change="onDetailsWindowCurrentPageChange"
          ></el-pagination>
        </el-col>
      </el-row>
      <!-- foolter -->
      <el-row :gutter="20" type="flex" align="middle" justify="center" style="margin-top: 30px;">
        <el-col :span="24" center>
          <el-button type="primary" @click.native="state.isShowDetailsWindow = false">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVirtualCurrencyList,
  getVirtualCurrencyDetailsList
} from "@/api/order";
import { formatDate } from "@/utils";

export default {
  name: "OrderVirtualCurrency",
  components: {},
  data() {
    return {
      state: {
        isShowDetailsWindow: false,
        detailsWindowTitle: "余额明细"
      },
      filter: {
        mobile: "",
        currPage: 1,
        pageSize: 20,
        totalPage: 1,
        totalCount: 0
      },
      tableData: [],
      filterDialogTable: {
        userId: '',
        currPage: 1,
        pageSize: 6,
        totalPage: 1,
        totalCount: 0
      },
      tableDataDialog: [],
    };
  },
  created() {
    this.getVirtualCurrencyList();
  },
  methods: {
    async getVirtualCurrencyList(pageNum = 1) {
      const options = {
        mobile: this.filter.mobile,
        pageSize: this.filter.pageSize,
        pageNum
      };
      const res = await getVirtualCurrencyList(options);
      if (res.code !== 200) return Promise.reject();
      const {
        list = [],
        currPage = 1,
        pageSize = 20,
        totalPage = 1,
        totalCount = 0
      } = res.result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 20;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;
      this.tableData = list.map(li => {
        li.$createTime = formatDate(li.createTime, 8);
        li.$virtualCurrency = Number(li.virtualCurrency || 0).toFixed(2);
        if (!li.mail) li.mail = '*';
        return li;
      });

      if (this.$refs["virtual-currency-table"]) {
        this.$refs["virtual-currency-table"].bodyWrapper.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    },

    async getVirtualCurrencyDetailsList(pageNum = 1) {
      const options = {
        userId: this.filterDialogTable.userId,
        pageNum,
        pageSize: this.filterDialogTable.pageSize,
      };
      const res = await getVirtualCurrencyDetailsList(options);
      if (res.code !== 200) return Promise.reject();
      const {
        list = [],
        currPage = 1,
        pageSize = 20,
        totalPage = 1,
        totalCount = 0
      } = res.result;

      this.filterDialogTable.currPage = currPage;
      this.filterDialogTable.pageSize = pageSize || 20;
      this.filterDialogTable.totalPage = totalPage;
      this.filterDialogTable.totalCount = totalCount;
      this.tableDataDialog = list.map(li => {
        li.$createTime = formatDate(li.createTime, 8);
        li.$currentBalance = Number(li.currentBalance || 0).toFixed(2);
        return li;
      });

      if (this.$refs["details-table"]) {
        this.$refs["details-table"].bodyWrapper.scrollTop = 0;
      }
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getVirtualCurrencyList(pageNum);
    },

    // 查看余额明细
    onShowDetails(item) {
      this.filterDialogTable.userId = item.userId;
      this.state.detailsWindowTitle = `${item.nickName}的余额明细`;
      this.getVirtualCurrencyDetailsList();
      this.state.isShowDetailsWindow = true;
    },

    // 当前页改变 - dialog
    onDetailsWindowCurrentPageChange(pageNum = 1) {
      this.getVirtualCurrencyDetailsList(pageNum);
    },
  }
};
</script>

<style scoped lang="less">
</style>