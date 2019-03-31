<template>
  <div class="question-container">
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12">
          <router-link :to="{ name: 'Homework', params: { courseId,courseName }}" tag="span">
            <el-button size="small" icon="el-icon-back">返回</el-button>
          </router-link>
          <span class="workname">作业：{{$route.params.wname}}</span>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-button size="medium" icon="el-icon-circle-plus-outline">添加习题</el-button>
          <!-- <el-button size="medium" icon="el-icon-view">查看成绩</el-button> -->
          <el-button size="medium" icon="el-icon-printer">统计成绩</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-area" v-loading="loading">
      <el-card v-for="(i,index) in 7" :key="'ques'+i" shadow="never">
        <div class="ques-title">{{index+1}}. sadfkmak 1+1=?</div>
        <el-row>
          <el-col v-for="(j,index)  in 6" :key="i+'op'+j" :xs="24" :sm="12">
            <div
              :class="{ 'right-item': isRight }"
              class="option"
            >{{String.fromCharCode(index+65)}}. asdjfalsvgnnasbv谁的悲哀八二</div>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never">
        <div class="ques-title">sadfkmak 1+1=_</div>
        <el-row>
          <el-col :xs="24" :sm="12">
            <div :class="{ 'right-item': isRight }" class="option">A.asdjfalsvgnnasbv谁的悲哀八二</div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div :class="{ 'right-item': isRight }" class="option">A.asdjfalsvgnnasbv谁的悲哀八二</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getOneCourse } from "@/api/course";
import { addwork } from "@/api/homework";
export default {
  name: "Question",
  data() {
    return {
      loading: false,
      courseId: "",
      courseName: "",
      works: [],
      questions: [],
      activeName: "1",
      // workState: 0,
      isRight: true,
      workId: ""
    };
  },
  methods: {
    getQuestion() {
      this.loading = true;
      // allWorkByCid(this.workId)
      //   .then(res => {
      //     this.loading = false;
      //     this.homeworks = res.data.works;
      //     console.log(this.homeworks);
      //     let now = new Date();

      //     this.homeworks.forEach(item => {
      //       let start = new Date(item.starttime);
      //       let end = new Date(item.closetime);
      //       if (now < start) {
      //         item.state = 1; //1：未开始
      //       } else if (now >= start && now < end) {
      //         item.state = 2; //2：开放中
      //       } else {
      //         item.state = 0; //0：已关闭
      //       }
      //     });
      //     // console.log(this.homeworks);
      //   })
      //   .catch(error => {
      this.loading = false;
      //     this.$message.error(error + " 数据获取失败");
      //   });
    }
  },
  created() {
    this.courseId = this.$route.params.cid;
    if (this.courseId) {
      getOneCourse(this.courseId).then(res => {
        this.courseName = res.data.course.name;
        // console.log(res.data);
      });
    }
    if (this.$route.params.wid) {
      this.works.push({
        id: this.$route.params.wid,
        name: this.$route.params.wname
      });
      this.workId = this.works[0].id;
      this.getQuestion();
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
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
    }
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .content-area {
    height: calc(100vh - 96px); // for v-loading
  }
  .el-card {
    margin-bottom: 8px;

    .ques-title {
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;
    }
    .option {
      padding-top: 10px;
    }
    .right-item {
      color: #88bf6d;
    }
  }
}
</style>

