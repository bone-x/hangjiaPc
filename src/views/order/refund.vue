<template>
  <div class="content-container">
    <!-- 交易管理 - 退款管理 -->
    <div>
      <el-form
        ref="form"
        :model="refundSearchData"
        label-width="100"
        size="large"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              label="退款创建时间"
              label-width="100px"
            >
              <el-date-picker
                v-model="refundSearchData.timers"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                range-separator="-"
                start-placeholder="年 / 月"
                end-placeholder="年 / 月"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:380px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="退款状态"
              label-width="208px"
            >
              <el-select
                v-model="refundSearchData.status"
                placeholder="全部"
                style="width:350px"
              >
                <el-option
                  label="审核中"
                  value="1"
                ></el-option>
                <el-option
                  label="已退款"
                  value="2"
                ></el-option>
                <el-option
                  label="退款失败"
                  value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="订单来源"
              label-width="465px"
            >
              <el-select
                v-model="refundSearchData.source"
                placeholder="订单来源"
                style="width:350px"
              >
                <el-option
                  label="PC"
                  value="4"
                ></el-option>
                <el-option
                  label="APP"
                  value="5"
                ></el-option>
                <el-option
                  label="小程序"
                  value="6"
                ></el-option>
                <el-option
                  label="H5"
                  value="7"
                ></el-option>
                <el-option
                  label="私域H5"
                  value="8"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="关键词"
              label-width="100px"
            >
              <el-select
                v-model="refundSearchData.keyword"
                placeholder="退款编号"
                style="width:380px"
              >
                <el-option
                  label="退款编号"
                  value="1"
                ></el-option>
                <el-option
                  label="订单编号"
                  value="2"
                ></el-option>
                <el-option
                  label="购买者ID"
                  value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="65px">
              <el-input
                v-model="refundSearchData.keywordValue"
                placeholder="关键词"
                style="width:350px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="180px">
              <el-input
                v-model="refundSearchData.goodsName"
                placeholder="请输入商品名称"
                style="width:350px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="margin-bottom:20px;text-align:right;padding-right:30px">
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
                v-permission="['trade:refund:select']"
                v-model="filterInput"
                type="primary"
                @click="onSubmit"
              >搜索</el-button>
            </el-col>
            <el-col :span="3">
              <el-button
                v-permission="['trade:refund:export']"
                type="primary"
                @click="exportDataAll"
              >导出</el-button>
            </el-col>
            <el-col :span="3">
              <el-button
                v-permission="['trade:refund:save']"
                type="primary"
                @click="goAddRefund"
              >新建退款</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!-- 订单表格部分 -->
      <el-table
        ref="multipleTable"
        :data="refundAllData"
        tooltip-effect="dark"
        style="width: 100%"
        class="billtable"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="orderCode"
          label="订单号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="refundCode"
          label="退款编号"
          width="180"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="goodsName"
          label="商品名称"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="goodsType"
          label="商品类型"
          width="120"
        >
          <template slot-scope="props">
            <span v-if="props.row.goodsType === 0">其他</span>
            <span v-if="props.row.goodsType === 1">直播</span>
            <span v-if="props.row.goodsType === 2">录播</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="实付金额"
          width="150"
        >
          <template slot-scope="props">
            <span>￥{{ props.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundFee"
          label="退款金额"
          width="150"
        >
          <template slot-scope="props">
            <span>￥{{ props.row.refundFee }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="source"
          label="订单来源"
          show-overflow-tooltip
        >
          <template slot-scope="props">
            <span v-if="props.row.source === 4">PC</span>
            <span v-if="props.row.source === 5">APP</span>
            <span v-if="props.row.source === 6">小程序</span>
            <span v-if="props.row.source === 7">H5</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundStatus"
          label="退款状态"
          width="100"
        >
          <template slot-scope="props">
            <span v-if="props.row.refundStatus === 0">无</span>
            <span v-if="props.row.refundStatus === 1">审核中</span>
            <span v-if="props.row.refundStatus === 2">已退款</span>
            <span v-if="props.row.refundStatus === 3">退款失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="操作"
          width="200"
          fixed="right"
        >
          <template slot-scope="props">
            <el-button
              v-permission="['trade:refund:export']"
              type="primary"
              @click="exportSingledata(props.$index, props.row)"
            >导出</el-button>
            <el-button
              type="primary"
              plain
              @click.native="goDetail(props.$index, props.row)"
            >详情</el-button>
            <el-button
              v-permission="['trade:refund:auth']"
              v-if="props.row.refundStatus === 1"
              type="primary"
              plain
              @click="checkList(props.$index, props.row)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;text-align:right">
        <el-button
          v-permission="['trade:refund:export']"
          type="primary"
          @click="exportData"
        >导出</el-button>

        <el-button
          type="primary"
          @click="toggleAllSelection(refundAllData)"
        >全选</el-button>

        <span style="margin-left:10px;width:100px;font-size:13px">共{{ calculationData }}页 {{ totalCount }}条数据</span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col
            :span="8"
            :offset="8"
          >
            <el-pagination
              :current-page.sync="pageNum"
              :page-size="pageSize"
              :total="totalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </div>

      <!--点击审核出现的弹窗部分-->
      <el-dialog
        :visible.sync="centerDialogVisible"
        title="提示"
        width="30%"
        center
        @close="closeDialog"
      >
        <el-form>
          <el-form-item>
            <template>
              <el-radio
                v-model="radio"
                label="0"
                @click.native="isShow = false"
              >通过</el-radio>
              <el-radio
                v-model="radio"
                label="1"
                @click.native="isShow = true"
              >驳回</el-radio>
            </template>
          </el-form-item>
          <el-form-item v-if="isShow">
            <el-input
              :rows="2"
              v-model="textarea"
              type="textarea"
              placeholder="备注，请输入驳回原因，最多50字"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="promiseChioce"
            >确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  refundList,
  exportRefundOrder,
  exportRefundOrderAll,
  orderReview,
} from '@/api/order';

export default {
  name: 'OrderRefund',
  components: {},
  data() {
    return {
      row: '',
      // 时间范围
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = '';
            // console.log(maxDate);
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate !== '') {
            const day365 = (360 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day365;
            if (maxTime < new Date()) {
              maxTime = new Date();
            }
            // console.log(new Date(), maxTime, Date.now());
            return time.getTime() > maxTime;
          }
          // return time.getTime() > Date.now();
        },
      },
      isShow: false,
      // 搜索框过滤关键词
      filterInput: '',
      centerDialogVisible: false,
      radio: '0',
      textarea: '',
      isIndeterminate: true,
      // 退款管理表格数据
      refundAllData: [],
      // 退款搜索所需参数
      refundSearchData: {
        id: '',
        timers: '',
        startTime: '',
        endTime: '',
        refundStatus: '',
        source: '4',
        paymentType: '',
        keywordValue: '',
        keyword: '1',
        goodsName: '',
        name: '',
        billmethods: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        status: null,
      },
      totalPage: 10,
      totalCount: 10,
      total: 10,
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      // 总表格数据条数
      calculationData: '',
      multipleSelection: [],
      refundIds: '', // id
    };
  },
  computed: {},
  created() {
    this.getRefundData();
  },
  methods: {
    async exportDataAll() {
      // 导出查询的数据
      const params = {
        beginDate: this.refundSearchData.timers[0] || null,
        endDate: this.refundSearchData.timers[1] || null,
        refundStatus: this.refundSearchData.status || null,
        source: this.refundSearchData.source || null,
        keyword: this.refundSearchData.keyword || null,
        keywordValue: this.refundSearchData.keywordValue || null,
        goodsName: this.refundSearchData.goodsName || null,
        paymentType: this.refundSearchData.paymentType,
      };
      // exportRefundOrderAll(params).then(res => {
      //   console.log(res, "导出查询的数据");
      // });
      const response = await exportRefundOrderAll(params);
      if (response.code !== 200) return Promise.reject();
      const { url } = response.result;
      if (url) {
        window.open(url, '_self');
      }
      console.log('导出的列表excel', response);
    },
    // 退款管理总表格数据
    getRefundData() {
      // 获取订单状态
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        beginDate: this.refundSearchData.timers[0] || null,
        endDate: this.refundSearchData.timers[1] || null,
        refundStatus: this.refundSearchData.status || null, // 订单
        source: this.refundSearchData.source || null,
        keywordValue: this.refundSearchData.keywordValue || null,
        keyword: this.refundSearchData.keyword || null,
        goodsName: this.refundSearchData.goodsName || null,
        paymentType: this.refundSearchData.paymentType,
      };
      refundList(params)
        .then(res => {
          this.refundAllData = res.result.list;
          this.totalCount = res.result.totalCount;
          this.totalPage = res.result.totalPage;
          this.calculationData = res.result.totalPage;
          console.log('退款数据', res.result.totalPage);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 重置条件项
    reset() {
      this.refundSearchData.timers = '';
      this.refundSearchData.status = '';
      this.refundSearchData.source = '';
      this.refundSearchData.paymentType = '';
      this.refundSearchData.keywordValue = '';
      this.refundSearchData.keyword = '';
      this.refundSearchData.goodsName = '';
    },

    // 点击清空
    onClearSelected() {
      this.reset();
      this.getRefundData();
    },

    // 点击搜索
    onSubmit() {
      // 获取订单状态
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        beginDate: this.refundSearchData.timers[0] || null,
        endDate: this.refundSearchData.timers[1] || null,
        refundStatus: this.refundSearchData.status || null, // 订单
        source: this.refundSearchData.source || null,
        keywordValue: this.refundSearchData.keywordValue || null,
        keyword: this.refundSearchData.keyword || null,
        goodsName: this.refundSearchData.goodsName || null,
        paymentType: this.refundSearchData.paymentType,
      };
      refundList(params).then(res => {
        this.refundAllData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },
    checkList(index, row) {
      // 审核操作
      this.centerDialogVisible = true;
      this.row = row;
    },
    // 新建退款跳转
    goAddRefund() {
      this.$router.push({
        name: 'OrderRefundAdd',
      });
    },
    // 导出
    async exportData() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择至少一条数据',
        });
      } else {
        this.refundIds = this.multipleSelection.map(item => {
          return item.refundId;
        });
        console.log(this.refundIds, '铺货数据id');
        const params = {
          refundIds: this.refundIds.join(','),
        };
        const res = await exportRefundOrder(params);
        if (res.code !== 200) return Promise.reject();
        const { url } = res.result;
        if (url) {
          window.open(url, '_self');
          this.getRefundData();
        }
        this.getRefundData();
      }
    },
    // 单个导出
    async exportSingledata(index, row) {
      console.log(index, row);
      const params = {
        refundIds: row.refundId,
      };
      const res = await exportRefundOrder(params);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },
    // 跳转详情
    goDetail(index, row) {
      this.$router.push({
        name: 'OrderRefundDetails',
        params: { id: row.refundId },
      });
    },
    // 弹窗的提交
    onSubmitDialog() {
      console.log('submitDialog!');
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val, '选中的数据');
    },
    // 页码
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.getRefundData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRefundData();
      this.getRefundData();
      console.log(`当前页: ${val}`);
    },
    promiseChioce() {
      // 审核详情确认
      const params = {
        refundId: this.row.refundId,
        num: Number(this.radio),
        failReason: this.textarea || null,
      };
      orderReview(params).then(res => {
        console.log(res, '审核的数据');
        this.closeDialog();
      });
    },
    closeDialog() {
      // 审核弹窗初始化
      this.centerDialogVisible = false;
      this.textarea = '';
      this.radio = '0';
    },
    toggleAllSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.orderlist {
  padding: 30px;
  .selectform-one,
  .selectform-two {
    display: flex;
    justify-content: start;
    .maketime,
    .billorigin {
      margin-right: 3%;
    }
    .paymethods,
    .keyword {
      margin-left: 3%;
    }
  }
  .selectform-three {
    display: flex;
    // justify-content: flex-end;
    padding-right: 4%;
  }
  .billtable {
    margin: 20px 0px;
  }
  .tablefoot {
    font-size: 13px;
    text-align: right;
    margin: 20px 0px;
  }
  .block {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
