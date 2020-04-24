<template>
  <div class="content-container">
    <!-- 私域H5管理 - 商品订单 -->
    <el-form
      ref="form"
      :model="filterData"
      label-width="10px"
      size="large"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-date-picker
              v-model="filterData.timeRange"
              :default-time="['00:00:00', '23:59:59']"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请输入下单时间"
              end-placeholder=""
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item style="margin-right: 20px">
            <el-input
              v-model.trim="filterData.goodsName"
              placeholder="请输入商品名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            prop="code"
            style="margin-right: 20px"
          >
            <el-input
              v-model.trim="filterData.code"
              placeholder="请输入订单编号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            prop="mobile"
            style="margin-right: 20px"
          >
            <el-input
              v-model.trim="filterData.mobile"
              placeholder="请输入用户手机号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="goodsId">
            <el-input
              v-model.trim="filterData.goodsId"
              placeholder="请输入商品ID"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="right">
        <el-col :span="2">
          <el-form-item>
            <el-button
              type="primary"
              plain
              @click.native="handleSearchSelected"
            >查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button
              v-permission="['trade:ordersiyu:export']"
              type="primary"
              @click.native="handleExportSelected"
            >导出</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button
              type="danger"
              @click.native="handleClearSelected"
            >清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="orderDataList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 30px"
      class="billtable"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{(filterData.pageNum - 1) * filterData.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="订单编号"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="goodsId"
        label="商品ID"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="goodsName"
        label="商品名称"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.goodsName">{{ scope.row.goodsName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="用户手机号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="goodsPrice"
        label="商品售价"
        align="center"
      >
        <template slot-scope="scope">
          <span>￥{{ Number(scope.row.goodsPrice || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="paidAmount"
        label="实付金额"
        align="center"
      >
        <template slot-scope="scope">
          <span>￥{{ Number(scope.row.paidAmount || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operatorsName"
        label="绑定运营"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.operatorsName">{{ scope.row.operatorsName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 3">交易完成</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.createTime">{{ timeFormat(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['trade:ordersiyu:export']"
            type="primary"
            size="mini"
            @click.native="exportSingleData(scope.row.id)"
          >导出</el-button>
          <router-link :to="{ name: 'H5OrderDetails', params: { id: scope.row.id } }">
            <el-button
              v-permission="['trade:ordersiyu:detail']"
              type="primary"
              plain
              size="mini"
            >详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 30px;">
      <el-col
        :span="24"
        style="text-align: right;"
      >
        <el-button
          v-permission="['trade:ordersiyu:export']"
          type="primary"
          @click.native="exportSelectedData"
        >导出选中</el-button>
        <el-button
          type="primary"
          @click.native="toggleSelection([...orderDataList])"
        >全选</el-button>
        <span style="margin-left:10px; font-size: 16px">共{{ filterData.totalPage }}页 {{ filterData.totalCount }}条数据</span>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      class="row-bg"
      justify="center"
      tyle="margin-top: 30px;"
    >
      <el-col :span="6">
        <el-pagination
          :current-page.sync="filterData.pageNum"
          :page-size="filterData.pageSize"
          :total="filterData.totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          size="mini"
          @click.native="handleCurrentChange"
        >确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getOrderPage,
  exportBySelect,
  exportByOrderIds,
} from '@/api/h5-private';
import { formatDate } from '@/utils/index';

export default {
  name: 'H5GoodsOrder',
  data() {
    return {
      filterData: {
        timeRange: null,
        beginDate: null,
        endDate: null,
        goodsName: null,
        code: null,
        mobile: null,
        pageNum: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 1,
        multipleSelection: [],
        orderIds: '',
        goodsId: null,
      },
      orderDataList: [],
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    this.getH5OrderList();
  },

  methods: {
    timeFormat: formatDate, // 时间戳转化

    onRouteChange(to) {
      if (to.name === 'H5GoodsOrder') {
        this.getH5OrderList();
      }
    },

    // 获取h5订单列表
    getH5OrderList() {
      if (this.filterData.timeRange !== null) {
        this.filterData.beginDate = this.filterData.timeRange[0];
        this.filterData.endDate = this.filterData.timeRange[1];
      } else {
        this.filterData.beginDate = null;
        this.filterData.endDate = null;
      }
      const options = {
        beginDate: this.filterData.beginDate,
        endDate: this.filterData.endDate,
        goodsName: this.filterData.goodsName,
        code: this.filterData.code,
        mobile: this.filterData.mobile,
        pageNum: this.filterData.pageNum,
        pageSize: this.filterData.pageSize,
        goodsId: this.filterData.goodsId,
      };
      getOrderPage(options).then(res => {
        this.orderDataList = res.result.list;
        this.filterData.totalCount = res.result.totalCount;
        this.filterData.totalPage = res.result.totalPage;
      });
    },

    // 查询
    handleSearchSelected() {
      this.getH5OrderList();
    },

    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    // 导出
    handleExportSelected() {
      if (this.filterData.timeRange !== null) {
        this.filterData.beginDate = this.filterData.timeRange[0];
        this.filterData.endDate = this.filterData.timeRange[1];
      } else {
        this.filterData.beginDate = null;
        this.filterData.endDate = null;
      }
      const options = {
        beginDate: this.filterData.beginDate,
        endDate: this.filterData.endDate,
        goodsName: this.filterData.goodsName,
        code: this.filterData.code,
        mobile: this.filterData.mobile,
        goodsId: this.filterData.goodsId,
      };
      exportBySelect(options)
        .then(res => {
          if (res.code !== 200) return false;
          const { url } = res.result;
          if (url) {
            window.open(url);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 单个导出
    exportSingleData(item) {
      const options = {
        orderIds: item,
      };
      exportByOrderIds(options)
        .then(res => {
          if (res.code !== 200) return false;
          const { url } = res.result;
          if (url) {
            window.open(url);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 多选导出
    exportSelectedData() {
      if (this.filterData.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一条数据');
      } else {
        this.filterData.orderIds = this.filterData.multipleSelection.map(
          item => {
            return item.id;
          }
        );
        const options = {
          orderIds: this.filterData.orderIds.join(','),
        };
        exportByOrderIds(options)
          .then(res => {
            if (res.code !== 200) return false;
            const { url } = res.result;
            if (url) {
              window.open(url);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    // 清空
    handleClearSelected() {
      this.filterData.timeRange = null;
      this.filterData.goodsName = null;
      this.filterData.code = null;
      this.filterData.mobile = null;
      this.filterData.goodsId = null;
      this.getH5OrderList();
    },

    // 勾选获取每个商品数据
    handleSelectionChange(val) {
      this.filterData.multipleSelection = val;
    },

    // 分页
    handleCurrentChange(val) {
      this.filterData.pageNum = val;
      this.getH5OrderList();
    },

    handleSizeChange(val) {
      this.filterData.pageSize = val;
    },
  },
};
</script>
<style lang="less" scoped>
</style>