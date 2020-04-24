<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
import { debounce } from "@/utils";

require("echarts/theme/macarons"); // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "500px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.__resizeHandler();
      }
    },
    setOptions({ xAxisData, legend, series } = {}) {
      const options = {
        grid: {
          left: 30,
          right: 50,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          formatter(params) {
            let str = '';
            if (params && params.length > 0) {
              let title = '时间：';
              if (params[0]) {
                // 标题
                let preXValue = xAxisData[Number(params[0].dataIndex) - 1];
                let xValue = xAxisData[Number(params[0].dataIndex)];
                const xValueToNumber = Number(xValue);
                const preXValueToNumber = Number(preXValue);

                if (xValueToNumber >= 0) {
                  if (xValueToNumber < 10) {
                    xValue = `0${xValue}:00`;
                  } else {
                    xValue = `${xValue}:00`;
                  }
                }

                if (preXValueToNumber >= 0) {
                  if (preXValueToNumber < 10) {
                    preXValue = `0${preXValue}:00`;
                  } else {
                    preXValue = `${preXValue}:00`;
                  }
                }

                if (preXValue) {
                  title += `${preXValue} ~ `;
                }
                title += `${xValue}`;
                str += title;

                // 子项
                params.forEach(i => {
                  str += `<br /><span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${i.color}'></span>`;
                  str += `${i.seriesName}: ${i.value}`;
                });
              }
              
            }
            return str;
          },
          padding: [5, 10]
        },
        xAxis: {
          data: xAxisData || [],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend,
        series,
      };
      this.chart.setOption(options);
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    }
  }
};
</script>
