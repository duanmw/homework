<template>
  <div class="card" v-loading="loading">
    <el-card shadow="hover">
      <div slot="header">
        <span class="text-overflow course-name">
          <span class="title-icon" :style="colorStyle[index%4]">
            <svg-icon icon-class="course-title"/>
          </span>
          {{courseData.name}}
        </span>
        <span
          class="text-overflow creator"
        >教师：{{ courseData.teacher.name?courseData.teacher.name:courseData.teacher.email}}</span>
      </div>
      <div class="cardbody clearfix">
        <div class="left-body">{{courseData.info? courseData.info:"暂无简介"}}</div>
        <div class="right-body">
          <span class="item">
            <span class="inner-icon" :style="colorStyle[index%4]">
              <svg-icon icon-class="homework"/>
            </span>
            作业：{{courseData.workcount}}
          </span>
          <span class="item">
            <span class="inner-icon" :style="colorStyle[index%4]">
              <svg-icon icon-class="student"/>
            </span>
            学生：{{courseData.stucount}}
          </span>
        </div>
      </div>
      <div class="split-line"></div>

      <div class="card-bottom text-overflow">
        <el-tooltip
          class="item"
          :content="substrDate(courseData.lastwork.starttime)  + '开放，'+substrDate(courseData.lastwork.closetime)+'关闭'"
          placement="bottom-start"
        >
          <span>最新作业：</span>
        </el-tooltip>
        {{courseData.lastwork.name}}，{{courseData.lastwork.starttime | substrDate}}开放，{{courseData.lastwork.closetime | substrDate}}关闭
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CourseCard",
  props: {
    courseData: Object,
    index: Number
  },
  data() {
    return {
      loading: false,
      colorStyle: [
        {
          color: "#30BA78"
        },
        {
          color: "#30DECE"
        },
        {
          color: "YellowGreen"
        },
        {
          color: "SlateBlue"
        }
      ]
    };
  },
  filters: {
    substrDate(value) {
      if (!value) return "";
      if (value.length == 19) {
        return value.substring(0, 16);
      } else {
        return value;
      }
    }
  },
  methods: {
    substrDate(value) {
      if (!value) return "";
      if (value.length == 19) {
        return value.substring(0, 16);
      } else {
        return value;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  .el-card {
    border: 1px solid #dbdfe6;
    background-color: #fcfeff;
    &:hover {
      border-radius: 8px;
      box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.12);
      .course-name {
        color: #409eff;
        transition: all 0.3s;
      }
    }
  }
  .course-name {
    margin-bottom: -4px;
    width: 60%;
    display: inline-block;
  }
  .creator {
    font-size: 14px;
    color: #909399;
    width: 39%;
    margin-top: 1px;
    text-align: right;
    float: right;
  }

  .cardbody {
    height: 72px;
    position: relative;
    .left-body {
      display: inline-block;
      // max-width: 60%;
      width: 60%;
      max-width: calc(100% - 100px);
      max-height: 72px;
      overflow: hidden;
      color: #666666;
      font-size: 12px;
      line-height: 18px;
      text-align: center;
      position: absolute;
      top: 50%;
      // right: 0;
      transform: translateY(-50%);
    }
    .right-body {
      display: inline-block;
      font-size: 14px;
      color: #444444;
      min-width: 107px;
      width: 39%;
      line-height: 28px;
      padding-left: 10%;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      .item {
        display: block;
        .inner-icon {
          opacity: 0.8;
        }
      }
    }
  }
  .card-bottom {
    padding-top: 6px;
    color: #666666;
    font-size: 13px;
  }
}
</style>
