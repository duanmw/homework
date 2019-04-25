<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
const animationDuration = 6000;
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
      default: "300px"
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          text: "总分：" + 2 * this.chartData.quescount,
          textStyle: {
            color: "#C0C4CC",
            fontSize: 20
            // align: 'center'
          },
          x: "center",
          y: "top"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // grid: {
        //   top: 10,
        //   left: "2%",
        //   right: "2%",
        //   bottom: "3%",
        //   containLabel: true
        // },
        xAxis: [
          {
            type: "category",
            data: ["0%-20%", "20%-40%", "40%-60%", "60%-80%", "80%-100%"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "总分" + 2 * this.chartData.quescount + "人数",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: this.chartData.data,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>