<template>
  <div class="work-container">
    <!-- <h3>全部作业</h3> -->
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12" class="left-part">
          课程：&nbsp;
          <el-select @change="getWork" v-model="courseId" placeholder="请选择课程" size="medium">
            <el-option
              v-for="course in courses"
              :key="'optc'+course.id"
              :label="course.name"
              :value="course.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-button size="medium" icon="el-icon-circle-plus-outline">添加作业</el-button>
          <!-- <el-button size="medium" icon="el-icon-view">查看成绩</el-button> -->
          <el-button size="medium" icon="el-icon-printer">统计成绩</el-button>
        </el-col>
      </el-row>
    </div>
    <el-collapse v-model="activeName" accordion>
      <transition-group name="fade-up" tag="div" appear>
        <el-collapse-item v-for="i in homeworks" :key="'work'+i.id" :name="i.id">
          <div slot="title" class="panel-title">
            <span v-if="i.state==1" class="wait-state">未开放</span>
            <span v-else-if="i.state==2" class="opening-state">开放中</span>
            <span v-else class="closed-state">已关闭</span>
            <span class="work-name">{{i.name}}</span>
            <span class="create-time">创建于 {{i.createtime}}</span>
            <!-- <router-link :to="'/homework?id='+6" tag="a">习题数量：xx</router-link> -->
          </div>
          <div>
            <!-- <el-date-picker :readonly="true" v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
          </div>
          <el-row>
            <el-col :xs="24" :sm="12">开始时间：{{i.starttime}}</el-col>
            <el-col :xs="24" :sm="12">关闭时间：{{i.closetime}}</el-col>
            <el-col :xs="24" :sm="12">关闭后是否显示答案：{{i.showanswer}}</el-col>
            <el-col :xs="24" :sm="12">最大提交次数：{{i.maxsubmit}}</el-col>
            <el-col :xs="24" :sm="12">
              <router-link :to="'/homework?id='+6" tag="a">习题数量：xx</router-link>
              <el-button size="small">查看习题</el-button>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-button size="small" icon="el-icon-view">查看成绩</el-button>
              <el-button size="small" icon="el-icon-edit" :disabled="!i.state">修改设置</el-button>
              <el-button size="small" icon="el-icon-delete">删除作业</el-button>
            </el-col>
          </el-row>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </el-collapse-item>
      </transition-group>
    </el-collapse>
    <br>
    <el-alert v-if="!courseId" title="请先选择一个课程" type="warning" center show-icon></el-alert>
    <el-alert v-else-if="homeworks.length==0" title="此课程暂无作业" type="info" center show-icon></el-alert>
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";
import { addWork, allWorkByCid } from "@/api/homework";
export default {
  name: "Homework",
  computed: {},
  data() {
    return {
      courses: [],
      homeworks: [],
      activeName: "1",
      // workState: 0,
      courseId: "",
      value1: "2018-10-21",
      value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
    };
  },
  methods: {
    getWork() {
      allWorkByCid(this.courseId).then(res => {
        this.homeworks = res.data.works;
        console.log(this.homeworks);
        let now = new Date();
        // let time=new Date(this.homeworks[1].starttime)
        // console.log(now,time);
        // console.log(now<time);

        this.homeworks.forEach(item => {
          let start = new Date(item.starttime);
          let end = new Date(item.closetime);
          if (now < start) {
            item.state = 1; //1：未开始
          } else if (now >= start && now < end) {
            item.state = 2; //2：开放中
          } else {
            item.state = 0; //0：已关闭
          }
        });
        console.log(this.homeworks);
      });
    }
  },
  created() {
    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
        // console.log(this.courses);
      })
      .catch(error => {
        // this.loading = false;
        this.$message.error(error + " 数据获取失败");
      });
  }
};
</script>
<style lang="scss">
.work-container {
  .el-collapse-item__header {
    // font-size: 14px;
    &.is-active {
      .work-name {
        color: #409eff;
        // font-weight: 600;
      }
    }
  }
}
// @media screen and (min-width: 769px) and (max-width: 904px) {
//   .left-part {
//     width: 300px;
//   }
// }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@mixin work-state($color) {
  display: inline-block;
  font-size: 12px;
  padding: 0 4px;
  height: 20px;
  line-height: 20px;
  color: $color;
  border-radius: 4px;
  border: 1px solid $color;
  margin-right: 8px;
}
.work-container {
  margin: 30px;
  .title-bar {
    color: #444;
    padding: 0 0 20px;
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .panel-title {
    .opening-state {
      @include work-state(#67c23a);
    }
    .wait-state {
      @include work-state(#e6a23c);
    }
    .closed-state {
      @include work-state(#909399);
    }
    .work-name {
      // vertical-align: top;
      font-size: 14px;
    }
    .create-time {
      margin-left: 10px;
      color: #c0c4cc;
    }
    .el-button {
      float: right;
      margin-top: 8px;
      margin-right: 10px;
      // line-height: 48px;
    }
  }
  .el-collapse-item .el-col {
    margin-top: 12px;
  }
}
</style>
