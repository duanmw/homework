<template>
  <div class="course-container" v-loading="loading">
    <el-row>
      <el-col :xs="24" :sm="12">
        <template v-if="$route.params.work">
          <router-link
            :to="{ name: 'StuHomework', params: { course,activeName:this.$route.params.activeName } }"
            tag="span"
          >
            <el-button size="small" icon="el-icon-back">返回</el-button>
          </router-link>&nbsp;&nbsp;
          <span class="workname">作业：{{work.name}}</span>
        </template>
        <template v-else>
          <router-link to="/home" tag="span">
            <el-button size="small" icon="el-icon-back">返回</el-button>
          </router-link>&nbsp;&nbsp;
          <span class="workname">作业：{{work.name}}</span>
        </template>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-progress :show-text="false" :percentage="90" :color="1?'#79BBFF':'#67C23A'"></el-progress>
        <span class="percent-num">{{questions.length}}/{{questions.length}}</span>
        <el-button size="medium" icon="el-icon-circle-check-outline">提交作业</el-button>
      </el-col>
    </el-row>

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
      <div v-for="i in 8" class="overview">{{i}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { allCourseBySid } from "@/api/course";
import { oneWork, allQuestionByWid } from "@/api/homework";

import waves from "@/directive/waves/index.js"; // 水波纹指令

export default {
  name: "DoWork",
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      courses: [],
      work: {},
      questions: []
    };
  },
  // computed: {
  //   ...mapGetters(["name", "roles", "email", "number"])
  // },
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
          return "题";
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
    // this.loading = true;
    if (this.$route.query.work) {
      oneWork(this.$route.query.work)
        .then(res => {
          this.work = res.data.work;
        })
        .then(res => {
          return this.getQuestion();
        })
        .catch(err => {
          this.$message.error(err + "数据获取失败");
        });
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用,可以访问组件实例 `this`
    this.$confirm("你本次作业尚未提交，是否确定离开本页？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      closeOnClickModal: false
    })
      .then(() => {
        next();
      })
      .catch(err => {
        next(false);
        this.$message({
          type: "info",
          message: err
        });
      });
  }
};
</script>
<style lang="scss">
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.course-container {
  min-height: calc(100vh - 200px); // for v-loading
  margin: 30px;
  .el-progress {
    display: inline-block;
    width: calc(100% - 190px);
    .el-progress-bar {
      width: 100%;
    }
  }
  .percent-num {
    width: 60px;
    display: inline-block;
    text-align: center;
  }
  .el-col {
    margin-bottom: 24px;
    transition: all 0.7s; //进入离开过渡动画均有效
  }
  .overview {
    text-align: center;
    color: #909399;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    display: inline-block;
    background-color: #f4f4f5;
    margin: 20px 10px 0 0;
    transition: all 0.3s;
    &:hover {
      color: #f4f4f5;
      background-color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
