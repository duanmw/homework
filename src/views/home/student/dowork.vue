<template>
  <div class="dowork-container" v-loading="loading">
    <el-row class="title-bar">
      <el-col :xs="24" :sm="12">
        <template v-if="$route.params.course">
          <router-link
            :to="{ name: 'StuHomework', params: { course:this.$route.params.course,activeName:this.$route.params.activeName } }"
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
          <span class="workname">无作业数据，请返回重试！</span>
        </template>
      </el-col>
      <el-col :xs="24" :sm="12">
        <span
          class="spendtime-text"
        >用时&nbsp;{{Math.floor(spendtime/60).toString().padStart(2,'0')}}:{{(spendtime%60).toString().padStart(2,'0')}}</span>
        <el-tooltip :content="'完成度：'+doneCount+'/'+quesCount" placement="top">
          <el-progress
            :show-text="false"
            :percentage="quesCount ? Math.floor(doneCount/quesCount*100) : 0"
            :color="doneCount==quesCount?'#67C23A':'#79BBFF'"
          ></el-progress>
        </el-tooltip>
        <span :class="['percent-text',doneCount==quesCount?'green':'']">{{doneCount}}/{{quesCount}}</span>
        <el-button
          size="medium"
          :disabled="!quesCount"
          type="primary"
          @click="handleSubmit"
          icon="el-icon-circle-check-outline"
        >提交作业</el-button>
      </el-col>
    </el-row>

    <div class="content-area" v-loading="loading">
      <div
        v-for="(ques,index) in form"
        :class="['overview', index==activeIndex?'active':'',ques.aid>0||ques.correct||ques.answer?'done':'']"
        @click="handleChange(index)"
      >{{index+1}}</div>
      <el-card
        v-for="(i,index) in questions"
        :key="'ques'+index"
        v-show="index==activeIndex"
        shadow="never"
      >
        <div class="ques-title">{{'['+getTypeName(i.question.type)+']. '+i.question.title}}</div>
        <template v-if="i.question.type==='a'">
          <div class="option-box" v-waves v-for="(ans,aindex)  in i.answer" :key="'ans'+ans.id">
            <el-radio v-model="form[index].aid" :label="ans.id">{{ans.content}}</el-radio>
          </div>
        </template>
        <template v-else-if="i.question.type==='b'">
          <el-checkbox-group v-model="form[index].aid">
            <!-- <div > -->
            <el-checkbox
              class="option-box"
              v-waves
              v-for="(ans,aindex)  in i.answer"
              :key="'ans'+ans.id"
              :label="ans.id"
            >{{ans.content}}</el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else-if="i.question.type==='c'">
          <div class="option-box" v-waves>
            <el-radio v-model="form[index].correct" label="yes">正确</el-radio>
          </div>
          <div class="option-box" v-waves>
            <el-radio v-model="form[index].correct" label="no">错误</el-radio>
          </div>
        </template>
        <template v-else-if="i.question.type==='d'">
          <div class="option-box">
            <el-input v-model="form[index].answer"></el-input>
          </div>
        </template>
        <!-- <div v-if="i.question.desc" class="answer-desc">解析：{{i.question.desc}}</div> -->
      </el-card>
      <template v-if="quesCount>1">
        <el-button size="medium" :disabled="activeIndex==0" @click="handlePrev">上一题</el-button>
        <el-button size="medium" :disabled="activeIndex+1==quesCount" @click="handleNext">下一题</el-button>
      </template>
      <transition name="slow-fade" appear>
        <div v-if="questions.length==0" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { allCourseBySid } from "@/api/course";
import { oneWork, allQuestionByWid } from "@/api/homework";

import waves from "@/directive/waves/index.js"; // 水波纹指令
// import md5 from "blueimp-md5";

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
      activeIndex: 0,
      questions: [],
      form: [], //存用户答案
      spendtime: 0,
      timer: ""
    };
  },
  computed: {
    quesCount() {
      return this.questions.length;
    },
    doneCount() {
      let num = 0;
      this.form.forEach(ele => {
        if (ele.aid > 0 || ele.correct || ele.answer) num++;
      });
      return num;
    }
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
          return "题";
      }
    },
    getQuestion() {
      this.loading = true;
      allQuestionByWid(this.work.id)
        .then(res => {
          this.loading = false;
          this.questions = res.data.questions;
          this.questions.forEach(q => {
            if (q.type === "a" || q.type === "b") {
              this.form.push({
                qnumber: q.question.number,
                aid: [] //选择题存是aid
              });
            } else if (q.type === "c") {
              this.form.push({
                qnumber: q.question.number,
                correct: "" //判断题存的是yes或no
              });
            } else if (q.type === "d") {
              this.form.push({
                qnumber: q.question.number,
                answer: "" //填空题存填的内容
              });
            }
          });
          for (let index = 0; index < this.questions.length; index++) {
            this.form.push({
              qnumber: this.questions[index].question.number,
              aid: [] //!除了判断题存的是yes或no,其他类型题存的是aid
            });
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    handleChange(index) {
      // this.$message.info(index);
      this.activeIndex = index;
    },
    handlePrev() {
      this.activeIndex--;
    },
    handleNext() {
      this.activeIndex++;
    },
    handleSubmit() {
      this.$confirm(
        (this.doneCount < this.quesCount
          ? "你还有" + (this.quesCount - this.doneCount) + "题未完成，"
          : "") + "确定要提交此次作业？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$message.success("cg");
          // this.$router.push({
          //   path: "/homework/dowork",
          //   query: { work: work.id }
          // });
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  },
  created() {
    // this.loading = true;
    if (this.$route.params.course && this.$route.params.work) {
      // oneWork(this.$route.query.work)
      //   .then(res => {
      this.work = this.$route.params.work;
      // })
      // .then(res => {
      this.getQuestion();
      // })
      // .catch(err => {
      //   this.$message.error(err + "数据获取失败");
      // });
    }
    // if (
    //   localStorage.getItem("dostate") &&
    //   localStorage.getItem("dos") &&
    //   md5(localStorage.getItem("dostate") + "spendtime") ===
    //     localStorage.getItem("dos")
    // ) {
    //   this.spendtime = Math.floor(
    //     (new Date().getTime() - localStorage.getItem("dostate")) / 1000
    //   );

    //   // console.log(this.spendtime);
    // } else {
    //   this.spendtime = 4450; //4450s = 74:10
    //   localStorage.setItem("dostate", new Date().getTime() - 4450 * 1000);
    //   localStorage.setItem(
    //     "dos",
    //     md5(new Date().getTime() - 4450 * 1000 + "spendtime")
    //   ); //加盐
    // }
  },
  mounted() {
    // if (this.quesCount > 0) {
      this.timer = setInterval(() => {
        this.spendtime++;
      }, 1000);
    // }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem("dostate");
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
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    console.log("定时器清理了");
  }
};
</script>
<style lang="scss">
.dowork-container {
  .el-card__body {
    padding: 14px 20px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dowork-container {
  color: #444444;
  min-height: calc(100vh - 200px); // for v-loading
  margin: 30px;
  .title-bar {
    .spendtime-text {
      width: 90px;
      display: inline-block;
      // text-align: center;
      vertical-align: middle;
    }
    .el-progress {
      display: inline-block;
      width: calc(100% - 290px);
      .el-progress-bar {
        width: 100%;
      }
    }
    .percent-text {
      width: 60px;
      display: inline-block;
      padding-left: 6px;
      vertical-align: middle;
      &.green {
        color: #67c23a;
      }
    }
    .el-col {
      margin-bottom: 24px;
      transition: all 0.6s; //进入离开过渡动画均有效
    }
  }
  .content-area {
    min-height: calc(100vh - 150px); // for v-loading
    .overview {
      border: 1px solid #f5f5f5;
      text-align: center;
      color: #c3c3c3;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      display: inline-block;
      background-color: #f5f5f5;
      margin: 0 10px 16px 0;
      transition: all 0.3s;
      &.active {
        border: 1px solid #66b1ff;
      }
      &.done {
        color: #53d015;
        font-weight: bold;
      }
      &:hover {
        color: #f4f4f5;
        background-color: #66b1ff;
        cursor: pointer;
      }
    }
  }
  .el-card {
    margin-bottom: 10px;
    .ques-title {
      font-size: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;
    }
    .option-box {
      margin-top: 10px;
      width: 100%;
      .el-radio {
        font-size: 15px !important;
        width: 100%;
        padding: 8px;
        border: 1px solid #ebeef5;
        border-radius: 3px;

        &:hover {
          border: 1px solid #dcdfe6;
          background-color: #fafafb;
        }
        &.is-checked {
          border: 1px solid #53a8ff;
        }
      }
      &.el-checkbox {
        & + .el-checkbox {
          margin-left: 0;
        }
        padding: 8px;
        border: 1px solid #ebeef5;
        border-radius: 3px;

        &:hover {
          border: 1px solid #dcdfe6;
          background-color: #fafafb;
        }
        &.is-checked {
          border: 1px solid #53a8ff;
        }
      }
    }
  }
}
</style>