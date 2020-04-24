<template>
  <div class="content-container">
    <!-- 交易管理 - 开票管理
    <router-view></router-view>-->
    <!-- 过滤栏 -->
    <el-form
      ref="form"
      label-width="100px"
      style="margin-top: 30px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="开票创建时间"
            class="maketime"
            label-width="130px"
          >
            <el-date-picker
              v-model="filter.dateRange"
              :default-time="['00:00:00', '23:59:59']"
              size="large"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="年/月"
              end-placeholder="年/月"
              unlink-panels
              style="width:380px"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="开票状态"
            label-width="95px"
          >
            <el-select
              v-model="filter.invoiceStatus"
              placeholder="全部"
              style="width:350px"
            >
              <el-option
                :value="1"
                label="等待开票"
              ></el-option>
              <el-option
                :value="2"
                label="已开票"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="关键词"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select
              v-model="filter.keyword"
              style="width:380px"
            >
              <el-option
                :value="1"
                label="开票编号"
              ></el-option>
              <el-option
                :value="2"
                label="订单编号"
              ></el-option>
              <el-option
                :value="3"
                label="购买者ID"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="7">
            <el-input
              v-model="filter.keywordValue"
              placeholder="请输入关键词"
              style="width:350px"
            ></el-input>
          </el-col>

          <el-col :span="7">
            <el-input
              v-model="filter.goodsName"
              placeholder="请输入商品名称"
              class="keyword"
              style="width:350px"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row
          :gutter="10"
          type="flex"
          justify="end"
        >
          <el-col :span="3">
            <el-button
              type="danger"
              @click.native="onClearSelected"
            >清空</el-button>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              @click.native="getBillingList(1)"
            >搜索</el-button>
          </el-col>

          <el-col :span="3">
            <el-button
              v-permission="['trade:invoice:export']"
              type="primary"
              @click.native="exportDataByFilter(state.selectedItems)"
            >导出</el-button>
          </el-col>

          <el-col :span="4">
            <router-link
              v-permission="['trade:invoice:save']"
              :to="{ name: 'OrderInvoiceAdd' }"
            >
              <el-button type="primary">新建开票</el-button>
            </router-link>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <!-- 订单表格部分 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          class="billtable"
          border
          @selection-change="items => { state.selectedItems = items }"
        >
          <el-table-column
            type="selection"
            align="center"
            width="50px"
          ></el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="code"
            label="开票编号"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="orderCode"
            label="订单编号"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品名称"
          ></el-table-column>
          <el-table-column
            prop="paymentType"
            label="支付方式"
            width="120"
          >
            <template slot-scope="props">
              <span v-if="props.row.paymentType === 0">支付宝</span>
              <span v-if="props.row.paymentType === 1">微信</span>
              <span v-if="props.row.paymentType === 2">行家币</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="$price"
            label="实付金额"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="$invoiceStatus"
            label="开票状态"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="$createTime"
            label="创建时间"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="操作"
            width="200"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="['trade:invoice:export']"
                type="primary"
                @click.native="exportDataBySelected([scope.row])"
              >导出</el-button>
              <router-link :to="{ name: 'OrderInvoiceDetails', params: { id: scope.row.invoiceId } }">
                <el-button
                  v-permission="['trade:invoice:select']"
                  type="primary"
                  plain
                >详情</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row
      :gutter="20"
      type="flex"
      justify="end"
      style="margin-top: 30px;"
    >
      <el-col
        :span="20"
        right
      >
        <el-button
          v-permission="['trade:invoice:export']"
          type="primary"
          @click.native="exportDataBySelected(state.selectedItems)"
        >导出选中</el-button>
        <el-button
          type="primary"
          @click.native="onSelectedAll"
        >全选</el-button>
        <span style="margin-left:10px;font-size:14px;">共{{ filter.totalPage }}页 {{ filter.totalCount }}条数据</span>
      </el-col>
    </el-row>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col
        :span="24"
        center
      >
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="getBillingList(filter.currPage)"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  BillingList,
  BillingExportBySelected,
  BillingExportByFilter,
} from '@/api/order';
import { formatDate } from '@/utils';

export default {
  name: 'OrderInvoice',
  components: {},
  data() {
    return {
      state: {
        selectedItems: [],
      },
      filter: {
        dateRange: [],
        invoiceStatus: '',
        keyword: 1,
        keyworkValue: '',
        goodsName: '',
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
        paymentType: '',
      },
      tableData: [],
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  mounted() {
    this.getBillingList();
  },
  methods: {
    // 路由变动
    onRouteChange(to) {
      if (to.name === 'OrderInvoice') {
        this.getBillingList(this.filter.currPage);
      }
    },

    // 根据参数获取开票列表
    async getBillingList(pageNum = 1) {
      // if (!this.filter.dateRange) this.filter.dateRange = ['', ''];
      const options = {
        pageNum,
        beginDate: this.filter.dateRange[0] || '',
        endDate: this.filter.dateRange[1] || '',
        invoiceStatus: this.filter.invoiceStatus,
        keyword: this.filter.keyword,
        keywordValue: this.filter.keywordValue,
        goodsName: this.filter.goodsName,
        paymentType: this.filter.paymentType,
        pageSize: this.filter.pageSize,
      };
      const res = await BillingList(options);
      if (res.code !== 200) return Promise.reject();

      this.filter.currPage = res.result.currPage;
      this.filter.pageSize = res.result.pageSize || 10;
      this.filter.totalPage = res.result.totalPage;
      this.filter.totalCount = res.result.totalCount;
      this.tableData = res.result.list.map(i => {
        i.$createTime = formatDate(i.createTime, 8);
        i.$price = `￥ ${Number(i.price || 0).toFixed(2)}`;

        if (i.invoiceStatus === 1) i.$invoiceStatus = '等待开票';
        else if (i.invoiceStatus === 2) i.$invoiceStatus = '已开票';
        else i.$invoiceStatus = '无';

        return i;
      });
      window.scrollTo(0, 0);
    },

    // 重置条件项
    reset() {
      this.filter.dateRange = '';
      this.filter.invoiceStatus = '';
      this.filter.keyword = '';
      this.filter.keywordValue = '';
      this.filter.goodsName = '';
      this.filter.paymentType = '';
    },

    // 点击清空
    onClearSelected() {
      this.reset();
      this.getBillingList();
    },

    // 选中全部
    onSelectedAll() {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleAllSelection();
    },

    // 导出数据 - 根据选中
    async exportDataBySelected(items = []) {
      if (items.length <= 0) {
        this.$message.error('至少选中一条数据');
        return Promise.reject();
      }

      const isUnPass = items.some(i => i.invoiceStatus === 2);
      if (isUnPass) {
        this.$message.error('只能导出等待开票的数据，请重新选择开票状态');
        return Promise.reject();
      }

      const ids = items.map(i => i.invoiceId);
      const res = await BillingExportBySelected(ids);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },

    // 导出数据 - 根据过滤参数
    async exportDataByFilter() {
      const options = {
        beginDate: this.filter.dateRange[0],
        endDate: this.filter.dateRange[1],
        invoiceStatus: this.filter.invoiceStatus,
        keyword: this.filter.keyword,
        keywordValue: this.filter.keywordValue,
        goodsName: this.filter.goodsName,
        paymentType: this.filter.paymentType,
      };
      const res = await BillingExportByFilter(options);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
