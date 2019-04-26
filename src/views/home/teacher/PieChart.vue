<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
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
    setOptions(chartdata) {
      this.chart.setOption({
        title: {
          text: "学生总数",
          subtext: chartdata.stucount,
          textStyle: {
            color: "#C0C4CC",
            fontSize: 18
          },
          subtextStyle: {
            fontSize: 18,
            color: "#409EFF"
          },
          x: "center",
          y: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          y: "top",
          data: ["已提交", "未提交"]
        },

        series: [
          {
            name: chartdata.wname,
            type: "pie",
            radius: [65, 95],
            minShowLabelAngle: 1,
            label: {
              fontSize: 13
            },
            data: chartdata.data,
            animationEasing: "cubicInOut",
            animationDuration: 2600
          }
        ]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    }
  }
};
</script>