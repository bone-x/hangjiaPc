<template>
  <div class="content-container">
    <!-- 筛选栏 -->
    <el-row
      :gutter="20"
      type="flex"
      align="middle"
      style="background-color: #fff; padding: 20px 0;"
    >
      <el-col :span="20">
        <span
          class="quick-input-item"
          @click="onSetFilterDateTime(1)"
        >今日</span>
        <span
          class="quick-input-item"
          style="margin-left: 10px;"
          @click="onSetFilterDateTime(2)"
        >本周</span>
        <span
          class="quick-input-item"
          style="margin-left: 10px;"
          @click="onSetFilterDateTime(3)"
        >本月</span>
        <span
          class="quick-input-item"
          style="margin-left: 10px;"
          @click="onSetFilterDateTime(4)"
        >全年</span>

        <span style="margin-left: 50px;">选择日期：</span>
        <el-date-picker
          v-model="filter.dateRange"
          :default-time="['00:00:00', '23:59:59']"
          type="datetimerange"
          size="large"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <label style="margin-left: 30px;">数据来源：</label>
        <el-select v-model="filter.clientType">
          <el-option
            value="PC"
            label="PC"
          >PC</el-option>
          <el-option
            value="APP"
            label="APP"
          >APP</el-option>
          <el-option
            value="WEB"
            label="H5"
          >H5</el-option>
          <el-option
            value="WEAPP"
            label="微信小程序"
          >微信小程序</el-option>
        </el-select>

        <el-button
          type="primary"
          icon="el-icon-search"
          style="margin-left: 30px;"
          @click.native="getPageData(1)"
        >查询</el-button>
      </el-col>
      <el-col
        :span="4"
        center
      >
        <el-button
          v-permission="['data:canalysis:export']"
          style="margin-left: 20px;"
          @click.native="exportData"
        >导出查询数据</el-button>
      </el-col>
    </el-row>

    <!-- 流量概况 -->
    <el-row
      type="flex"
      align="middle"
      style="margin: 30px 0;"
    >
      <span class="color-section"></span>
      <span class="title">用户概况</span>
    </el-row>

    <el-row
      :gutter="20"
      style="margin-top: 20px;"
    >
      <el-col :span="6">
        <div class="data-card">
          <el-row class="data-card-title">
            <el-col :span="12">付费商品数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="按照筛选的结束时间点，平台状态为已上架的付费商品数"
            >
              <i class="el-icon-question"></i>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="data-card-main"
          >
            <div
              :title="payGoods"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="payGoods"
                :duration="1600"
                class="card-panel-num"
              />
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card">
          <el-row class="data-card-title">
            <el-col :span="12">免费商品总数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="按照筛选的结束时间点，平台状态为已上架的免费商品数"
            >
              <i class="el-icon-question"></i>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="data-card-main"
          >
            <div
              :title="freeGoods"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="freeGoods"
                :duration="1600"
                class="card-panel-num"
              />
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card">
          <el-row class="data-card-title">
            <el-col :span="12">商品访问量</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，所有商品页被访问的次数"
            >
              <i class="el-icon-question"></i>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="data-card-main"
          >
            <div
              :title="goodsViewAccount"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="goodsViewAccount"
                :duration="1600"
                class="card-panel-num"
              />
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card">
          <el-row class="data-card-title">
            <el-col :span="12">商品访客数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，所有商品页面的访问人数（同一访客多次访问会去重）"
            >
              <i class="el-icon-question"></i>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="data-card-main"
          >
            <div
              :title="goodsViewerAccount"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="goodsViewerAccount"
                :duration="1600"
                class="card-panel-num"
              />
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      style="margin-top: 20px;"
    >
      <el-col :span="6">
        <div class="data-card">
          <el-row class="data-card-title">
            <el-col :span="12">销售额</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，所有付款订单金额之和"
            >
              <i class="el-icon-question"></i>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="data-card-main"
          >
            <div
              :title="goodsSaleAccount"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="goodsSaleAccount"
                :duration="1600"
                :decimals="2"
                class="card-panel-num"
              />
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card">
          <el-row class="data-card-title">
            <el-col :span="12">支付笔数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，付款成功的订单数"
            >
              <i class="el-icon-question"></i>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="data-card-main"
          >
            <div
              :title="goodsPayAccount"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="goodsPayAccount"
                :duration="1600"
                class="card-panel-num"
              />
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px;">
      <el-col :span="24">
        <div style="padding: 30px; background-color: #fff;">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>

    <!-- 数据table -->
    <el-row style="margin-top: 30px;">
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          @sort-change="onSortChange"
        >
          <el-table-column
            type="index"
            label="排名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品名称"
            min-width="180"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            prop="goodsViewAccount"
            label="访问量"
            min-width="180"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            prop="goodsViewerAccount"
            label="访问数"
            min-width="180"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            prop="goodsPayUser"
            label="付费用户数"
            min-width="180"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            prop="$goodsSaleAccount"
            label="付款金额"
            min-width="180"
            sortable="custom"
          ></el-table-column>
        </el-table>
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
          @current-change="onPageChnage"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import CountTo from 'vue-count-to';
import { dateTimeRange, formatDate, formatNumber } from '@/utils';
import {
  getGoodsAnalysisData,
  getGoodsAnalysisData2,
  getExportGoodsData,
} from '@/api/data';
import LineChart from './components/LineChart';

export default {
  name: 'DataGoods',
  components: {
    CountTo,
    LineChart,
  },
  data() {
    return {
      payGoods: 0,
      freeGoods: 0,
      goodsViewAccount: 0,
      goodsViewerAccount: 0,
      goodsSaleAccount: 0,
      goodsPayAccount: 0,
      filter: {
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
        sort: {
          goodsViewAccount: 'DESC',
          goodsViewerAccount: '',
          goodsSaleAccount: '',
          goodsPayUser: '',
        },
        dateRange: dateTimeRange.thisDay(),
        clientType: 'PC',
      },
      lineChartData: {
        xAxisData: [],
        legend: {
          data: [
            '付费商品数',
            '免费商品数',
            '商品访问量',
            '商品访问数',
            '销售额',
            '支付笔数',
          ],
        },
        series: [
          {
            name: '付费商品数',
            itemStyle: {
              normal: {
                color: '#1890FF',
                lineStyle: {
                  color: '#1890FF',
                  width: 2,
                },
              },
            },
            smooth: true,
            type: 'line',
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          },
          {
            name: '免费商品数',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#2FC25B',
                lineStyle: {
                  color: '#2FC25B',
                  width: 2,
                },
              },
            },
            data: [],
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
          },
          {
            name: '商品访问量',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FFCC00',
                lineStyle: {
                  color: '#FFCC00',
                  width: 2,
                },
              },
            },
            data: [],
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
          },
          {
            name: '商品访问数',
            itemStyle: {
              normal: {
                color: '#ff0000',
                lineStyle: {
                  color: '#ff0000',
                  width: 2,
                },
              },
            },
            smooth: true,
            type: 'line',
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          },
          {
            name: '销售额',
            itemStyle: {
              normal: {
                color: '#660000',
                lineStyle: {
                  color: '#660000',
                  width: 2,
                },
              },
            },
            smooth: true,
            type: 'line',
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          },
          {
            name: '支付笔数',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#800080',
                lineStyle: {
                  color: '#800080',
                  width: 2,
                },
              },
            },
            data: [],
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
          },
        ],
      },
      tableData: [],
    };
  },
  mounted() {
    this.getPageData();
  },
  methods: {
    async getPageData(pageNum = 1) {
      if (!this.filter.dateRange) this.filter.dateRange = ['', ''];
      // 清空排序
      this.filter.sort = {
        goodsViewAccount: 'DESC',
        goodsViewerAccount: '',
        goodsSaleAccount: '',
        goodsPayUser: '',
      };

      const options = {
        pageNum,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        pageSize: this.filter.pageSize,
        clientType: this.filter.clientType,
      };
      const isSameDay = moment(options.startTime).isSame(
        options.endTime,
        'day'
      );

      const res = await getGoodsAnalysisData(options);
      if (res.code !== 200) return Promise.reject();

      const {
        dcGoodsStatisticsDay = {},
        pageInfo = {},
        dcGoodsStatisticsDayList = [],
      } = res.result;

      const {
        payGoods = 0,
        freeGoods = 0,
        goodsViewAccount = 0,
        goodsViewerAccount = 0,
        goodsSaleAccount = 0,
        goodsPayAccount = 0,
      } = dcGoodsStatisticsDay;

      // 付费商品数
      this.payGoods = payGoods;
      // 免费商品数
      this.freeGoods = freeGoods;
      // 商品访问量
      this.goodsViewAccount = goodsViewAccount;
      // 商品访客数
      this.goodsViewerAccount = goodsViewerAccount;
      // 销售额
      this.goodsSaleAccount = goodsSaleAccount;
      // 支付笔数
      this.goodsPayAccount = goodsPayAccount;

      // echart数据
      const obj = _.merge({}, this.lineChartData);
      let xAxisData = [];
      const payGoodsArr = [];
      const freeGoodsArr = [];
      const goodsViewAccountArr = [];
      const goodsViewerAccountArr = [];
      const goodsSaleAccountArr = [];
      const goodsPayAccountArr = [];

      dcGoodsStatisticsDayList.forEach(i => {
        const {
          createTime,
          days,
          payGoods = 0,
          freeGoods = 0,
          goodsViewAccount = 0,
          goodsViewerAccount = 0,
          goodsSaleAccount = 0,
          goodsPayAccount = 0,
        } = i;

        let X;
        if (isSameDay) {
          X = new Date(createTime).getHours();
        } else {
          X = formatDate(days, 9);
        }
        xAxisData.push(X);

        payGoodsArr.push(payGoods);
        freeGoodsArr.push(freeGoods);
        goodsViewAccountArr.push(goodsViewAccount);
        goodsViewerAccountArr.push(goodsViewerAccount);
        goodsSaleAccountArr.push(goodsSaleAccount);
        goodsPayAccountArr.push(goodsPayAccount);
      });

      obj.series[0].data = payGoodsArr;
      obj.series[1].data = freeGoodsArr;
      obj.series[2].data = goodsViewAccountArr;
      obj.series[3].data = goodsViewerAccountArr;
      obj.series[4].data = goodsSaleAccountArr;
      obj.series[5].data = goodsPayAccountArr;

      xAxisData = _.uniq(xAxisData);
      xAxisData = xAxisData.sort((a, b) => {
        if (typeof a === 'string') a = +new Date(a);
        if (typeof b === 'string') b = +new Date(b);
        return a - b;
      });
      obj.xAxisData = xAxisData;
      this.lineChartData = obj;

      // table数据
      this.handleTableData(pageInfo);

      return Promise.resolve();
    },

    // 针对表格获取数据
    async getPageData2(pageNum = 1) {
      const options = {
        pageNum,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        goodsViewAccount: this.filter.sort.goodsViewAccount,
        goodsViewerAccount: this.filter.sort.goodsViewerAccount,
        goodsSaleAccount: this.filter.sort.goodsSaleAccount,
        goodsPayUser: this.filter.sort.goodsPayUser,
        clientType: this.filter.clientType,
      };
      // ASC DESC
      const res = await getGoodsAnalysisData2(options);
      if (res.code !== 200) return Promise.reject();

      this.handleTableData(res.result);
    },

    // 当前页改变
    onPageChnage() {
      if (
        this.filter.sort.goodsViewAccount ||
        this.filter.sort.goodsViewerAccount ||
        this.filter.sort.goodsSaleAccount ||
        this.filter.sort.goodsPayUser
      ) {
        this.getPageData2(this.filter.currPage);
      } else {
        this.getPageData(this.filter.currPage);
      }
    },

    // 处理表格数据
    handleTableData(pageInfo = {}) {
      const {
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0,
        list = [],
      } = pageInfo;
      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;

      this.tableData = list.map(i => {
        i.$goodsSaleAccount = formatNumber(i.goodsSaleAccount || 0);
        return i;
      });
    },

    // 监听排序改变
    onSortChange({ column, prop, order }) {
      let sortType = '';
      const key = String(prop).replace('$', '');
      if (order === 'descending') {
        sortType = 'DESC';
      } else if (order === 'ascending') {
        sortType = 'ASC';
      }

      this.filter.sort = {
        goodsViewAccount: '',
        goodsViewerAccount: '',
        goodsSaleAccount: '',
        goodsPayUser: '',
      };

      if (this.filter.sort[key] !== undefined) {
        this.filter.sort[key] = sortType;
      }

      this.getPageData2(this.filter.currPage);
    },

    // 时间快捷筛选
    onSetFilterDateTime(type = Number) {
      switch (type) {
        case 1:
          // 今日
          this.filter.dateRange = dateTimeRange.thisDay();
          break;
        case 2:
          // 本周
          this.filter.dateRange = dateTimeRange.thisWeek();
          break;
        case 3:
          // 本月
          this.filter.dateRange = dateTimeRange.thisMonth();
          break;
        case 4:
          // 全年
          this.filter.dateRange = dateTimeRange.thisYear();
          break;
        default:
          break;
      }
      this.getPageData();
    },

    // 导出数据
    async exportData() {
      const options = {
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        goodsViewAccount: this.filter.sort.goodsViewAccount,
        goodsViewerAccount: this.filter.sort.goodsViewerAccount,
        goodsSaleAccount: this.filter.sort.goodsSaleAccount,
        goodsPayUser: this.filter.sort.goodsPayUser,
        clientType: this.filter.clientType,
      };
      const res = await getExportGoodsData(options);
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
.quick-input-item {
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #409eff;
  }
}

.color-section {
  display: inline-block;
  margin-right: 8px;
  width: 4px;
  height: 16px;
  background-color: #409eff;
  line-height: 1;
}

.title {
  display: inline-block;
  margin-right: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  line-height: 1;
}

.data-card {
  width: 100%;
  padding: 20px 20px 0;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  &-title {
    font-size: 14px;
    color: #909399;
  }
  &-main {
    height: 120px;
    font-size: 32px;
  }
}

/deep/ .el-date-editor .el-range-separator {
  min-width: 30px;
}
/deep/ .el-date-editor {
  min-width: 380px;
}
</style>
