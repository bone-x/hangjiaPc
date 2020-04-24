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
          v-permission="['data:uanalysis:export']"
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
            <el-col :span="12">新注册用户数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，平台第一次注册的用户数"
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
              :title="totalnewUser"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="totalnewUser"
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
            <el-col :span="12">登陆用户数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，登录过平台的用户数"
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
              :title="totalloginAccount"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="totalloginAccount"
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
            <el-col :span="12">付费用户数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，付款成功的用户数（同一用户多次付款去重）"
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
              :title="totalpayUserAccount"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="totalpayUserAccount"
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
            <el-col :span="12">累积用户数</el-col>
            <el-col
              :offset="10"
              :span="2"
              right
              title="筛选时间内，平台的全部注册用户数"
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
              :title="totaltotalUser"
              class="cell-ellipsis"
            >
              <count-to
                :start-val="0"
                :end-val="totaltotalUser"
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
        >
          <el-table-column
            prop="$date"
            label="时间"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="$newUser"
            label="新注册用户数"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="$loginAccount"
            label="登陆用户数"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="$payUserAccountArr"
            label="付费用户数"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="$totalUser"
            label="累积用户数"
            min-width="180"
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
          @current-change="getPageData(filter.currPage)"
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
import { getUserAnalysisData, getExportUserData } from '@/api/data';
import LineChart from './components/LineChart';

export default {
  name: 'DataUser',
  components: {
    CountTo,
    LineChart,
  },
  data() {
    return {
      totalnewUser: 0,
      totalloginAccount: 0,
      totalpayUserAccount: 0,
      totaltotalUser: 0,
      filter: {
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
        dateRange: dateTimeRange.thisDay(),
        clientType: 'PC',
      },
      lineChartData: {
        xAxisData: [],
        legend: {
          data: ['新注册用户数', '登陆用户数', '付费用户数', '累积用户数'],
        },
        series: [
          {
            name: '新注册用户数',
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
            name: '登陆用户数',
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
            name: '付费用户数',
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
            name: '累积用户数',
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

      const res = await getUserAnalysisData(options);
      if (res.code !== 200) return Promise.reject();

      const {
        totalnewUser = 0,
        totalloginAccount = 0,
        totalpayUserAccount = 0,
        totaltotalUser = 0,
        pageInfo = {},
        dcPoList = [],
      } = res.result;

      // 新注册用户数
      this.totalnewUser = totalnewUser;
      // 登陆用户数
      this.totalloginAccount = totalloginAccount;
      // 付费用户数
      this.totalpayUserAccount = totalpayUserAccount;
      // 累积用户数
      this.totaltotalUser = totaltotalUser;

      // echart数据
      const obj = _.merge({}, this.lineChartData);
      let xAxisData = [];
      const newUserArr = [];
      const loginAccountArr = [];
      const payUserAccountArr = [];
      const totalUserArr = [];

      dcPoList.forEach(i => {
        const {
          createTime,
          days,
          newUser,
          loginAccount,
          payUserAccount,
          totalUser,
        } = i;
        let X;
        if (isSameDay) {
          X = new Date(createTime).getHours();
        } else {
          X = formatDate(days, 9);
        }
        xAxisData.push(X);

        newUserArr.push(newUser);
        loginAccountArr.push(loginAccount);
        payUserAccountArr.push(payUserAccount);
        totalUserArr.push(totalUser);
      });

      obj.series[0].data = newUserArr;
      obj.series[1].data = loginAccountArr;
      obj.series[2].data = payUserAccountArr;
      obj.series[3].data = totalUserArr;

      xAxisData = _.uniq(xAxisData);
      xAxisData = xAxisData.sort((a, b) => {
        if (typeof a === 'string') a = +new Date(a);
        if (typeof b === 'string') b = +new Date(b);
        return a - b;
      });
      obj.xAxisData = xAxisData;
      this.lineChartData = obj;

      // table数据
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
        if (isSameDay) {
          i.$date = formatDate(i.createTime, 8);
        } else {
          i.$date = formatDate(i.days, 9);
        }

        i.$newUser = formatNumber(i.newUser || 0, 0);
        i.$loginAccount = formatNumber(i.loginAccount || 0, 0);
        i.$payUserAccountArr = formatNumber(i.payUserAccount || 0, 0);
        i.$totalUser = formatNumber(i.totalUser || 0, 0);

        return i;
      });

      return Promise.resolve();
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
        clientType: this.filter.clientType,
      };
      const res = await getExportUserData(options);
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

/deep/ .el-date-editor {
  min-width: 380px;
}
</style>
