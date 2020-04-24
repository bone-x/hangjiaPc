<template>
  <div class="content-container">
    <el-row :gutter="30" type="flex" align="middle">
      <el-col :span="12">
        <span class="color-section"></span>
        <span class="title">实时概况</span>
        <span class="text-tips">数据每隔3小时刷新一次</span>
      </el-col>

      <el-col :span="12" right>
        <label>数据来源：</label>
        <el-select v-model="from.clientType">
          <el-option value="PC" label="PC">PC</el-option>
          <el-option value="APP" label="APP">APP</el-option>
          <el-option value="WEB" label="H5">H5</el-option>
          <el-option value="WEAPP" label="微信小程序">微信小程序</el-option>
        </el-select>

        <el-button style="margin-left: 20px;" icon="el-icon-search" @click.native="getPageData">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 数据卡片组 -->
    <div style="margin: 30px 0;">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="data-card">
            <el-row class="data-card-title">
              <el-col :span="12">销售额</el-col>
              <el-col :offset="10" :span="2" right title="0点截至#上次数据刷新时间#，所有付款订单金额之和">
                <i class="el-icon-question"></i>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" class="data-card-main">
              <div :title="today.saleAmount" class="cell-ellipsis">
                <count-to
                  :start-val="0"
                  :end-val="today.saleAmount"
                  :duration="1600"
                  :decimals="2"
                  class="card-panel-num"
                />
              </div>
            </el-row>
            <el-row class="data-card-footer">
              <el-col :span="24">
                <div :title="yester.saleAmount" class="cell-ellipsis">
                  昨日销售额&nbsp;&nbsp; ¥
                  <count-to
                    :start-val="0"
                    :end-val="yester.saleAmount"
                    :duration="10"
                    :decimals="2"
                    class="card-panel-num"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-card">
            <el-row class="data-card-title">
              <el-col :span="12">支付笔数</el-col>
              <el-col :offset="10" :span="2" right title="0点截至#上次数据刷新时间#，付款成功的订单数">
                <i class="el-icon-question"></i>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" class="data-card-main">
              <div :title="today.saleAccount" class="cell-ellipsis">
                <count-to
                  :start-val="0"
                  :end-val="today.saleAccount"
                  :duration="1600"
                  class="card-panel-num"
                />
              </div>
            </el-row>
            <el-row class="data-card-footer">
              <el-col :span="24">
                <div :title="yester.saleAccount" class="cell-ellipsis">昨日支付笔数&nbsp;&nbsp;
                  <count-to
                    :start-val="0"
                    :end-val="yester.saleAccount"
                    :duration="10"
                    class="card-panel-num"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-card">
            <el-row class="data-card-title">
              <el-col :span="12">访问量</el-col>
              <el-col :offset="10" :span="2" right title="0点截至#上次数据刷新时间#，网站所有页面被访问的次数之和">
                <i class="el-icon-question"></i>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" class="data-card-main">
              <div :title="today.pageView" class="cell-ellipsis">
                <count-to
                  :start-val="0"
                  :end-val="today.pageView"
                  :duration="1600"
                  class="card-panel-num"
                />
              </div>
            </el-row>
            <el-row class="data-card-footer">
              <el-col :span="24">
                <div :title="yester.pageView" class="cell-ellipsis">昨日访问量&nbsp;&nbsp;
                  <count-to
                    :start-val="0"
                    :end-val="yester.pageView"
                    :duration="10"
                    class="card-panel-num"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-card">
            <el-row class="data-card-title">
              <el-col :span="12">访客数</el-col>
              <el-col :offset="10" :span="2" right title="0点截至#上次数据刷新时间#，网站各页面的访问人数（同一访客多次访问去重）">
                <i class="el-icon-question"></i>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" class="data-card-main">
              <div :title="today.viwer" class="cell-ellipsis">
                <count-to
                  :start-val="0"
                  :end-val="today.viwer"
                  :duration="1600"
                  class="card-panel-num"
                />
              </div>
            </el-row>
            <el-row class="data-card-footer">
              <el-col :span="24">
                <div :title="yester.viwer" class="cell-ellipsis">昨日访客数&nbsp;&nbsp;
                  <count-to
                    :start-val="0"
                    :end-val="yester.viwer"
                    :duration="10"
                    class="card-panel-num"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="6">
          <div class="data-card">
            <el-row class="data-card-title">
              <el-col :span="12">退款额</el-col>
              <el-col :offset="10" :span="2" right title="0点截至#上次数据刷新时间#，所有退款订单金额之和">
                <i class="el-icon-question"></i>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" class="data-card-main">
              <div :title="today.refund" class="cell-ellipsis">
                <count-to
                  :start-val="0"
                  :end-val="today.refund"
                  :duration="1600"
                  :decimals="2"
                  class="card-panel-num"
                />
              </div>
            </el-row>
            <el-row class="data-card-footer">
              <el-col :span="24">
                <div :title="yester.refund" class="cell-ellipsis">
                  昨日退款额&nbsp;&nbsp; ¥
                  <count-to
                    :start-val="0"
                    :end-val="yester.refund"
                    :duration="10"
                    :decimals="2"
                    class="card-panel-num"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-card">
            <el-row class="data-card-title">
              <el-col :span="12">退款笔数</el-col>
              <el-col :offset="10" :span="2" right title="0点截至#上次数据刷新时间#，退款成功的订单数">
                <i class="el-icon-question"></i>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" class="data-card-main">
              <div :title="today.refundNumber" class="cell-ellipsis">
                <count-to
                  :start-val="0"
                  :end-val="today.refundNumber"
                  :duration="1600"
                  class="card-panel-num"
                />
              </div>
            </el-row>
            <el-row class="data-card-footer">
              <el-col :span="24">
                <div :title="yester.refundNumber" class="cell-ellipsis">昨日退款笔数&nbsp;&nbsp;
                  <count-to
                    :start-val="0"
                    :end-val="yester.refundNumber"
                    :duration="10"
                    :decimals="2"
                    class="card-panel-num"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 数据图表 -->
    <div class="data-echart">
      <el-tabs v-model="dataEchartType">
        <el-tab-pane label="销售额" name="saleAmount"></el-tab-pane>
        <el-tab-pane label="支付笔数" name="saleAccount"></el-tab-pane>
        <el-tab-pane label="访问量" name="pageView"></el-tab-pane>
        <el-tab-pane label="访客数" name="viwer"></el-tab-pane>
        <el-tab-pane label="退款额" name="refund"></el-tab-pane>
        <el-tab-pane label="退款笔数" name="refundNumber"></el-tab-pane>
      </el-tabs>
      <div style="padding: 30px;">
        <line-chart :chart-data="lineChartData[dataEchartType]"/>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import CountTo from "vue-count-to";
import LineChart from "./components/LineChart";
import { getDayDataContrast, getHourDataContrast } from "@/api/data";

export default {
  name: "DataStatistics",
  components: {
    LineChart,
    CountTo
  },
  data() {
    return {
      dataEchartType: "saleAmount",
      from: {
        clientType: "PC"
      },
      today: {
        saleAmount: 0,
        saleAccount: 0,
        pageView: 0,
        viwer: 0,
        refund: 0,
        refundNumber: 0
      },
      yester: {
        saleAmount: 0,
        saleAccount: 0,
        pageView: 0,
        viwer: 0,
        refund: 0,
        refundNumber: 0
      },
      lineChartData: {
        // 销售额
        saleAmount: {
          xAxisData: [],
          legend: {
            data: ["今日", "昨日"]
          },
          series: [
            {
              name: "今日",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              type: "line",
              data: [],
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            },
            {
              name: "昨日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#3888fa",
                  lineStyle: {
                    color: "#3888fa",
                    width: 2
                  },
                  areaStyle: {
                    color: "#f3f8ff"
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ]
        },
        // 支付笔数
        saleAccount: {
          xAxisData: [],
          legend: {
            data: ["今日", "昨日"]
          },
          series: [
            {
              name: "今日",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              type: "line",
              data: [],
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            },
            {
              name: "昨日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#3888fa",
                  lineStyle: {
                    color: "#3888fa",
                    width: 2
                  },
                  areaStyle: {
                    color: "#f3f8ff"
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ]
        },
        // 访问量
        pageView: {
          xAxisData: [],
          legend: {
            data: ["今日", "昨日"]
          },
          series: [
            {
              name: "今日",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              type: "line",
              data: [],
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            },
            {
              name: "昨日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#3888fa",
                  lineStyle: {
                    color: "#3888fa",
                    width: 2
                  },
                  areaStyle: {
                    color: "#f3f8ff"
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ]
        },
        // 访客数
        viwer: {
          xAxisData: [],
          legend: {
            data: ["今日", "昨日"]
          },
          series: [
            {
              name: "今日",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              type: "line",
              data: [],
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            },
            {
              name: "昨日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#3888fa",
                  lineStyle: {
                    color: "#3888fa",
                    width: 2
                  },
                  areaStyle: {
                    color: "#f3f8ff"
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ]
        },
        // 退款额
        refund: {
          xAxisData: [],
          legend: {
            data: ["今日", "昨日"]
          },
          series: [
            {
              name: "今日",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              type: "line",
              data: [],
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            },
            {
              name: "昨日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#3888fa",
                  lineStyle: {
                    color: "#3888fa",
                    width: 2
                  },
                  areaStyle: {
                    color: "#f3f8ff"
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ]
        },
        // 退款笔数
        refundNumber: {
          xAxisData: [],
          legend: {
            data: ["今日", "昨日"]
          },
          series: [
            {
              name: "今日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            },
            {
              name: "昨日",
              smooth: true,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#3888fa",
                  lineStyle: {
                    color: "#3888fa",
                    width: 2
                  }
                }
              },
              data: [],
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.getPageData();
  },
  methods: {
    getPageData() {
      this.getDayDataContrast();
      this.getHourDataContrast();
    },

    // 按天统计
    async getDayDataContrast() {
      const options = {
        clientType: this.from.clientType
      };
      const res = await getDayDataContrast(options);
      if (res.code !== 200) return Promise.reject();
      const { dcDcStatisticsYesterDay, dcStatisticsToday } = res.result;
      this.today = { ...this.today, ...dcStatisticsToday };
      this.yester = { ...this.yester, ...dcDcStatisticsYesterDay };
    },

    // 按小时统计
    async getHourDataContrast() {
      const options = {
        clientType: this.from.clientType
      };
      const res = await getHourDataContrast(options);
      if (res.code !== 200) return Promise.reject();
      const {
        dcDcStatisticsYesterDay = [],
        dcStatisticsToday = []
      } = res.result;

      const obj = _.merge({}, this.lineChartData);
      let xAxisData = [];

      const today = {
        saleAmount: [],
        saleAccount: [],
        pageView: [],
        viwer: [],
        refund: [],
        refundNumber: []
      };
      const yester = {
        saleAmount: [],
        saleAccount: [],
        pageView: [],
        viwer: [],
        refund: [],
        refundNumber: []
      };
      dcStatisticsToday.forEach(i => {
        const {
          createTime,
          saleAmount = 0,
          saleAccount = 0,
          pageView = 0,
          viwer = 0,
          refund = 0,
          refundNumber = 0
        } = i;
        const h = new Date(createTime).getHours();
        xAxisData.push(h);

        today.saleAmount.push(saleAmount);
        today.saleAccount.push(saleAccount);
        today.pageView.push(pageView);
        today.viwer.push(viwer);
        today.refund.push(refund);
        today.refundNumber.push(refundNumber);
      });
      obj.saleAmount.series[0].data = today.saleAmount;
      obj.saleAccount.series[0].data = today.saleAccount;
      obj.pageView.series[0].data = today.pageView;
      obj.viwer.series[0].data = today.viwer;
      obj.refund.series[0].data = today.refund;
      obj.refundNumber.series[0].data = today.refundNumber;

      dcDcStatisticsYesterDay.forEach(i => {
        const {
          createTime,
          saleAmount = 0,
          saleAccount = 0,
          pageView = 0,
          viwer = 0,
          refund = 0,
          refundNumber = 0
        } = i;
        const h = new Date(createTime).getHours();
        xAxisData.push(h);

        yester.saleAmount.push(saleAmount);
        yester.saleAccount.push(saleAccount);
        yester.pageView.push(pageView);
        yester.viwer.push(viwer);
        yester.refund.push(refund);
        yester.refundNumber.push(refundNumber);
      });
      obj.saleAmount.series[1].data = yester.saleAmount;
      obj.saleAccount.series[1].data = yester.saleAccount;
      obj.pageView.series[1].data = yester.pageView;
      obj.viwer.series[1].data = yester.viwer;
      obj.refund.series[1].data = yester.refund;
      obj.refundNumber.series[1].data = yester.refundNumber;

      // x轴  - 去重&排序
      xAxisData = _.uniq(xAxisData).sort((a, b) => a - b);

      obj.saleAmount.xAxisData = xAxisData;
      obj.saleAccount.xAxisData = xAxisData;
      obj.pageView.xAxisData = xAxisData;
      obj.viwer.xAxisData = xAxisData;
      obj.refund.xAxisData = xAxisData;
      obj.refundNumber.xAxisData = xAxisData;

      this.lineChartData = obj;
    }
  }
};
</script>

<style lang="less" scoped>
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

.text-tips {
  display: inline-block;
  font-size: 14px;
  color: #909399;
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
    height: 90px;
    font-size: 28px;
    border-bottom: 1px solid #e4e7ed;
  }
  &-footer {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #666;
  }
}
.cell-ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-echart {
  background-color: #fff;
}
.data-echart /deep/ .el-tabs__header {
  margin: 0;
}
.data-echart /deep/ .el-tabs__nav-wrap {
  padding: 0 20px;
  height: 50px;
  .el-tabs__item {
    height: 50px;
    line-height: 50px;
  }
}
</style>
