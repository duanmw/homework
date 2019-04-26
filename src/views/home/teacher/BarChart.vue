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
          text: "各分数段人数分布",
          textStyle: {
            fontSize: 18,
            color: "#C0C4CC"
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
        xAxis: [
          {
            name: "*" + 2 * this.chartData.quescount + "分",
            nameTextStyle: {
              fontSize: 13,
              padding: [8, 0, 0, 0]
            },
            nameGap:8,
            type: "category",
            data: [
              "[0%-20%]",
              "(20%-40%]",
              "(40%-60%]",
              "(60%-80%]",
              "(80%-100%]"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "(人)",
            type: "value",
            axisTick: {
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: "此分数段人数",
            type: "bar",
            barWidth: "50%",
            data: this.chartData.data,
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#C0C4CC",
                  fontSize: 16
                }
              }
            },
            animationDuration: 4000, //初始动画的时长
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#06ECFE"
                    },
                    {
                      offset: 0.8,
                      color: "#45B4FE"
                    }
                  ],
                  false
                )
              }
            }
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