<template>
  <div class="question-container">
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="18">
          <template v-if="$route.params.work">
            <router-link :to="{ name: 'StuHomework', params: { course } }" tag="span">
              <el-button size="small" icon="el-icon-back">返回</el-button>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/home" tag="span">
              <el-button size="small" icon="el-icon-back">返回</el-button>
            </router-link>
          </template>
          <span class="workname">作业：{{this.work.name?this.work.name:"无数据，请返回重试！"}}</span>
          <span v-if="this.work.showanswer==='no'" class="showans">
            <svg-icon icon-class="cannotsee"/>答案不可见
          </span>
        </el-col>
        <el-col :xs="24" :sm="6">
          <span class="score">
            <span>成绩：{{this.work.maxscore?this.work.maxscore:0}}</span>
            总分：{{this.work.quescount*2}}
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="content-area" v-loading="loading">
      <el-card v-for="(i,index) in questions" :key="'ques'+index" shadow="never">
        <div class="ques-title">{{index+1+' ('+getTypeName(i.question.type)+'). '+i.question.title}}</div>
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
import { allQuestionByWid } from "@/api/homework";
export default {
  name: "StuQuestion",
  data() {
    return {
      loading: false,
      course: {},
      work: {},
      questions: [],
      isRight: true,
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
      allQuestionByWid(this.work.id)
        .then(res => {
          this.loading = false;
          this.questions = res.data.questions;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    }
  },
  created() {
    if (this.$route.params.work) {
      this.work = this.$route.params.work;
      this.getQuestion(); 
    }
    if (this.$route.params.course) {
      this.course = this.$route.params.course;
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
    .showans {
      font-size: 14px;
      vertical-align: middle;
      margin-left: 10px;
      color: #909399;
    }
    .score {
      float: right;
      margin-top: 8px;
      span {
        margin-right: 16px;
        color: #67c23a;
      }
    }
  }
  .content-area {
    min-height: calc(100vh - 150px); // for v-loading
  }
  .el-card {
    margin-bottom: 10px;
    .ques-title {
      font-size: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;
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

