<template>
  <div class="order_list">
    <!-- 交易管理 - 订单管理 -->
    <div class="orderlist">
      <el-form
        ref="form"
        :rules="rules2"
        :model="formData"
        label-width="80px"
        size="large"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="timers"
              label="创建时间"
            >
              <el-date-picker
                v-model="timers"
                :default-time="['00:00:00', '23:59:59']"
                size="large"
                type="datetimerange"
                range-separator="至"
                start-placeholder="年/月"
                end-placeholder="年/月"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 380px"
                @change="dateTimeChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="status"
              label="订单状态"
            >
              <el-select
                v-model="formData.status"
                placeholder="全部"
                style="width:350px"
              >
                <el-option
                  v-for="item in statusList"
                  :label="item.label"
                  :key="item.index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="ordersource"
              label="订单来源"
            >
              <el-select
                v-model="formData.source"
                placeholder="订单来源"
                style="width:350px"
              >
                <el-option
                  v-for="item in sourceList"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="支付方式">
              <el-select
                v-model="formData.paymentType"
                placeholder="支付方式"
                style="width:380px"
              >
                <el-option
                  v-for="item in paymentTypeList"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="关键词"
              label-width="80px"
            >
              <el-select
                v-model="formData.keyword"
                placeholder="订单号"
                style="width:350px"
              >
                <el-option
                  v-for="item in keywordList"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="keyword"
              label-width="80px"
              label
              prop="keywordValue"
            >
              <el-input
                v-model="formData.keywordValue"
                placeholder="关键词"
                style="width:350px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label
              label-width="80px"
              prop="inputNum"
            >
              <el-input
                v-model="formData.goodsName"
                placeholder="商品名称"
                style="width:380px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="keyword"
              label-width="80px"
              label
              prop="orgName"
            >
              <el-input
                v-model="formData.orgName"
                placeholder="请输入机构名称"
                style="width:350px"
              ></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row style="display:flex; justify-content: flex-end">
          <el-form-item size="large">
            <el-col :span="6">
              <el-button
                style="margin-right:120px"
                type="danger"
                @click.native="onClearSelected"
              >清空</el-button>
            </el-col>
            <el-col :span="6">
              <el-button
                style="margin-right:60px"
                type="primary"
                @click.native="onSearch"
              >搜索</el-button>
            </el-col>
            <el-col :span="6">
              <el-button
                v-permission="['trade:order:export']"
                type="primary"
                @click.native="exportSearchData"
              >导出</el-button>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- 订单表格部分 -->
      <el-table
        ref="multipleTable"
        :data="orderDataList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        tooltip-effect="dark"
        style="width: 100%"
        class="billtable"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="订单号"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="goodsName"
          label="商品名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="totalFee"
          label="订单总金额"
          width="120"
          align="center"
        >
          <template slot-scope="props">
            <span v-if="props.row.paymentType === 2">{{ Number(props.row.totalFee || 0).toFixed(2) }}行家币</span>
            <span v-else>￥{{ Number(props.row.totalFee || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payment"
          label="实付金额/行家币"
          align="center"
        >
          <template slot-scope="props">
            <span v-if="props.row.paymentType === 2">{{ Number(props.row.payment || 0).toFixed(2) }}行家币</span>
            <span v-else-if="props.row.paymentType === 3">{{ Number(props.row.points || 0).toFixed(2) }}积分</span>
            <span v-else>￥{{ Number(props.row.payment || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentType"
          label="支付方式"
          width="120"
          align="center"
        >
          <template slot-scope="props">
            <span v-if="props.row.paymentType === 0">支付宝</span>
            <span v-if="props.row.paymentType === 1">微信</span>
            <span v-if="props.row.paymentType === 2">行家币</span>
            <span v-if="props.row.paymentType === 3">积分支付</span>
          </template>
        </el-table-column>
        <!-- 原来：0 待支付 1 已支付  2 交易完成  3 交易关闭 ，改后增加发起支付（不用显示） -->
        <el-table-column
          prop="status"
          label="订单状态"
          align="center"
        >
          <template slot-scope="props">
            <span v-if="props.row.status === 0">待支付</span>
            <span v-if="props.row.status === 2">已支付</span>
            <span v-if="props.row.status === 3">交易完成</span>
            <span v-if="props.row.status === 4">交易关闭</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          width="100"
          align="center"
        >
          <template slot-scope="props">
            <span>{{ timeFormat(props.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="操作"
          width="250"
          fixed="right"
          align="center"
        >
          <template slot-scope="props">
            <el-button
              v-permission="['trade:order:export']"
              type="primary"
              @click.native="exportSingleData(props.row.id)"
            >导出</el-button>
            <router-link :to="{ name: 'OrderListDetails', params: { id: props.row.id } }">
              <el-button
                v-permission="['trade:order:select']"
                type="primary"
                plain
              >详情</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="tablefoot">
        <el-button
          v-permission="['trade:order:export']"
          type="primary"
          @click.native="exportAll"
        >导出选中</el-button>
        <el-button
          type="primary"
          @click.native="toggleSelection([...orderDataList])"
        >全选</el-button>
        <span style="margin-left:10px">共{{ totalPage }}页 {{ totalCount }}条数据</span>
      </div>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page.sync="formData.pageNum"
          :page-size="formData.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <el-button
          type="primary"
          size="mini"
          style="height: 28px; margin-left: 10px"
          @click.native="handleCurrentChange"
        >确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrderList,
  exportSearchOrder,
  exportSingleOrder,
} from '@/api/order';
import { formatDate } from '@/utils/index';

export default {
  name: 'OrderList',
  components: {},
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /^[0-9]*$/;
      if (!reg.test(value)) {
        callback(new Error('请输入数字！'));
      } else {
        callback();
      }
    };
    return {
      rules2: {
        keywordValue: [{ validator: validatePass, trigger: 'blur' }], // keyword校验
      },
      statusList: [
        {
          label: '待支付',
          value: 0,
        },
        {
          label: '已支付',
          value: 2,
        },
        {
          label: '交易完成',
          value: 3,
        },
        {
          label: '交易关闭',
          value: 4,
        },
      ],
      sourceList: [
        {
          label: 'PC',
          value: 4,
        },
        {
          label: 'APP',
          value: 5,
        },
        {
          label: '小程序',
          value: 6,
        },
        {
          label: 'H5',
          value: 7,
        },
        {
          label: '私域H5',
          value: 8,
        },
      ],
      paymentTypeList: [
        {
          label: '支付宝',
          value: 0,
        },
        {
          label: '微信',
          value: 1,
        },
        {
          label: '行家币',
          value: 2,
        },
        {
          label: '积分支付',
          value: 3,
        },
      ],
      keywordList: [
        {
          label: '购买者ID',
          value: 1,
        },
        {
          label: '订单号',
          value: 2,
        },
      ],
      timers: '', // 创建时间
      formData: {
        orgName: '',
        endDate: '',
        beginDate: '',
        status: '',
        source: '',
        paymentType: '',
        keywordValue: '',
        keyword: '',
        goodsName: '',
        organization: '',
        pageSize: 10,
        pageNum: 1,
      },
      totalPage: 1,
      totalCount: 0, // 表格数据
      orderDataList: [],
      multipleSelection: [], // 多选数据
      orderIds: '',
    };
  },
  created() {
    this.getOrderData();
  },

  methods: {
    timeFormat: formatDate, // 时间戳转化

    // 获取表格数据
    getOrderData() {
      this.formData.paymentType = Number(this.formData.paymentType) || '';
      getOrderList(this.formData).then(res => {
        this.orderDataList = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 获取时间
    dateTimeChange(date) {
      if (date !== null) {
        [this.formData.beginDate, this.formData.endDate] = date;
      } else {
        this.formData.beginDate = '';
        this.formData.endDate = '';
      }
    },

    // 重置条件项
    reset() {
      this.timers = '';
      this.formData.endDate = '';
      this.formData.beginDate = '';
      this.formData.status = '';
      this.formData.source = '';
      this.formData.paymentType = '';
      this.formData.keywordValue = '';
      this.formData.keyword = '';
      this.formData.goodsName = '';
      this.formData.organization = '';
      this.formData.orgName = '';
    },

    // 点击清空
    onClearSelected() {
      this.reset();
      this.getOrderData();
    },

    // 搜索订单表格数据
    onSearch() {
      this.getOrderData();
    },

    // 单选获取每个商品数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 搜索导出
    exportSearchData() {
      const data = {
        endDate: this.formData.endDate,
        beginDate: this.formData.beginDate,
        status: this.formData.status,
        source: this.formData.source,
        paymentType: this.formData.paymentType,
        keywordValue: this.formData.keywordValue,
        keyword: this.formData.keyword,
        goodsName: this.formData.goodsName,
        orgName: this.formData.orgName,
      };
      exportSearchOrder(data)
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

    // 所选、全选导出
    async exportAll() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择至少一条数据',
        });
      } else {
        this.orderIds = this.multipleSelection.map(item => {
          return item.id;
        });
        const params = {
          orderIds: this.orderIds.join(','),
        };
        const res = await exportSingleOrder(params);
        if (res.code !== 200) return Promise.reject();
        const { url } = res.result;
        if (url) {
          window.open(url, '_self');
          this.getOrderData();
        }
      }
    },

    // 导出单条数据
    exportSingleData(id) {
      const params = {
        orderIds: id,
      };
      exportSingleOrder(params)
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

    // 表格方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    // 页码
    handleSizeChange(val) {
      this.formData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.formData.pageNum = val;
      this.getOrderData();
    },
  },
};
</script>

<style lang="less" scoped>
.orderlist {
  padding: 30px;
  background-color: #f7f7f7;
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .selectform-one,
  .selectform-two {
    display: flex;
    justify-content: start;
    .maketime,
    .billorigin {
      margin-right: 3%;
    }
    .paymethods {
      margin-left: 3%;
    }
  }
  .selectform-three {
    display: flex;
    justify-content: space-between;
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
