<template>
  <div class="question-container">
    <div class="title-bar">
      <el-row>
        <el-col :xs="24">
          <router-link
            :to="{ name: routerName, params: { courseId,courseName,activeName:this.$route.params.activeName }}"
            tag="span"
          >
            <el-button size="small" icon="el-icon-back">返回</el-button>
          </router-link>
          <span class="workname">作业：{{$route.params.wname?$route.params.wname:"无数据，请返回重试！"}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="content-area" v-loading="loading">
      <el-card v-for="(i,index) in questions" :key="'ques'+index" shadow="never">
        <el-row class="ques-title">
          <el-col :xs="24" :sm="21">
            <div
              class="text-title"
            >{{index+1+' ('+getTypeName(i.question.type)+'). '+i.question.title}}</div>
          </el-col>
          <el-col :xs="24" :sm="3">
            <span class="right-percent">
              正确率：
              <span>{{i.rightcount}}/{{i.totalsubmit}}</span>
            </span>
          </el-col>
        </el-row>
        <el-row v-if="i.question.type!='c'">
          <el-col v-for="(ans,index)  in i.answer" :key="'ans'+ans.id" :xs="24" :sm="12">
            <div
              :class="{ 'right-item': ans.correct=='yes' }"
              class="option"
            >{{String.fromCharCode(index+65)}}. {{ans.content}}</div>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xs="24" :sm="12">
            <div :class="{ 'right-item': i.answer[0].correct=='yes' }" class="option">✔ 正确</div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div :class="{ 'right-item': i.answer[0].correct=='no' }" class="option">✘ 错误</div>
          </el-col>
        </el-row>
        <div v-if="i.question.desc" class="answer-desc">解析：{{i.question.desc}}</div>
      </el-card>
      <transition name="slow-fade" appear>
        <div v-if="questions.length==0" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { getOneCourse } from "@/api/course";
import { allQByWid2 } from "@/api/homework";
export default {
  name: "Question",
  data() {
    return {
      loading: false,
      courseId: "",
      courseName: "",
      work: {},
      questions: [],
      // worktate: 0,
      workId: "",
      routerName: "Homework"
    };
  },
  methods: {
    getTypeName(type) {
      switch (type) {
        case "a":
          return "单选题";
        case "b":
          return "多选题";
        case "c":
          return "判断题";
        case "d":
          return "填空题";
        default:
          return "";
      }
    },
    getQuestion() {
      this.loading = true;
      allQByWid2(this.work.id)
        .then(res => {
          this.loading = false;
          this.questions = res.data.questions;
          // console.log(this.homework);
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    }
  },
  created() {
    if (this.$route.params.courseId && this.$route.params.courseName) {
      this.courseId = this.$route.params.courseId;
      this.courseName = this.$route.params.courseName;
    }
    if (this.$route.params.wid && this.$route.params.wname) {
      this.work.id = this.$route.params.wid;
      this.work.name = this.$route.params.wname;
      this.getQuestion();
    }
    if (this.$route.params.routerName) {
      //设置“返回按钮”要返回的路由
      this.routerName = this.$route.params.routerName;
    }
  }
};
</script>
<style lang="scss">
.question-container {
  .el-card__body {
    padding: 14px 20px;
  }
}
</style>

<style lang="scss" scoped>
.question-container {
  margin: 30px;
  .title-bar {
    color: #444;
    padding: 0 0 20px;
    .workname {
      vertical-align: middle;
      margin-left: 20px;
    }
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .content-area {
    min-height: calc(100vh - 140px); // for v-loading
  }
  .el-card {
    margin-bottom: 10px;

    .ques-title {
      font-size: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;
      .text-title {
        line-height: 1.4em;
      }
      .right-percent {
        float: right;
        color: #606266;
        span {
          color: #1f8eff;
        }
      }
    }
    .option {
      color: #606266;
      font-size: 13px;
      padding-top: 13px;
    }
    .right-item {
      color: #88bf6d;
    }
    .answer-desc {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #ebeef5;
      color: #606266;
      font-size: 12px;
    }
  }
}
</style>

