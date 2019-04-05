<template>
  <div class="work-container">
    <!-- <h3>全部作业</h3> -->
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12">
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
          <router-link
            :to="{ name: 'addHomework', params: { courseId,courseName,suggestName}}"
            tag="span"
          >
            <el-button :disabled="!courseId" size="medium" icon="el-icon-circle-plus-outline">添加作业</el-button>
          </router-link>
          <!-- <el-button size="medium" icon="el-icon-view">查看成绩</el-button> -->
          <el-button :disabled="!courseId" size="medium" icon="el-icon-printer">统计成绩</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-area" v-loading="loading">
      <el-collapse v-model="activeName">
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
                <!-- <router-link :to="'/homework?id='+6" tag="a"></router-link> -->
                习题数量：{{i.quescount}}&nbsp;&nbsp;
                <router-link
                  :to="{ name: 'Question', params: { wid:i.id,wname:i.name,courseId,courseName }}"
                  tag="span"
                >
                  <el-button size="small" icon="el-icon-tickets">查看习题</el-button>
                </router-link>
                <!-- <el-button size="small">查看习题</el-button> -->
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-button size="small" icon="el-icon-view">查看成绩</el-button>
                <el-button size="small" icon="el-icon-edit" :disabled="!i.state">修改设置</el-button>
                <el-button
                  plain
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="handleDelete(i)"
                >删除作业</el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
        </transition-group>
      </el-collapse>
      <br>
      <transition name="slow-fade" appear>
        <el-alert
          v-if="courses.length!=0&&!courseId"
          title="请先选择一个课程"
          type="warning"
          center
          show-icon
        ></el-alert>
        <!-- <el-alert  title="此课程暂无作业" type="info" center show-icon></el-alert> -->
        <div v-else-if="courses.length==0||homeworks.length==0" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";
import { addWork, deleteWork, allWorkByCid } from "@/api/homework";
// import AddQuestion from "./AddQuestion";
export default {
  name: "Homework",
  components: {
    // AddQuestion
  },
  data() {
    return {
      formVisible: {
        one: false,
        two: false,
        three: false
      },
      loading: false,
      courses: [],
      homeworks: [],
      activeName: "1",
      // workState: 0,
      courseId: "",
      courseName: "",
      value1: "2018-10-21",
      suggestName: "",
      form: {
        name: "",
        startTime: "",
        closeTime: "",
        showAnswer: true,
        maxSubmit: 1
      },
      rules: {
        name: [
          { required: true, message: "作业名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "作业名长度在 2 到 20 个字符",
            trigger: "blur"
          }
        ],
        startTime: [
          {
            type: "date",
            required: true,
            message: "请选择开放时间",
            trigger: "blur"
          }
        ],
        closeTime: [
          {
            type: "date",
            required: true,
            message: "请选择关闭时间",
            trigger: "blur"
          }
        ],
        maxSubmit: [
          {
            required: true,
            message: "提交次数不能为空",
            trigger: "blur"
          }
        ]
      },
      pickerOptions0: {
        disabledDate(time) {
          // if (this.form.closeTime != "") {
          //   return time.getTime() > Date.now() || time.getTime() > this.form.closeTime;
          // } else {
          //   return time.getTime() > Date.now();
          // }
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天
        }
      }
    };
  },
  watch: {
    homeworks(newValue) {
      this.suggestName =
        this.courseName + "第" + (newValue.length + 1) + "次作业";
    }
  },
  methods: {
    getWork(courseId) {
      let obj = {};
      obj = this.courses.find(item => {
        return item.id === courseId; //筛选出匹配id的课程
      });
      this.courseName = obj.name; //设置对应课程名
      this.loading = true;
      allWorkByCid(courseId)
        .then(res => {
          this.loading = false;
          this.homeworks = res.data.works;
          // console.log(this.homeworks);
          let now = new Date();

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
          // console.log(this.homeworks);
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    handleDelete(item) {
      this.$confirm(
        "此操作将永久删除作业：" + item.name + "，不可撤销，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // this.$emit("before-delete");
          this.loading = true;
          return deleteWork(item);
        })
        .then(res => {
          // this.$emit("after-delete", this.index); //传数据过去
          this.$message.success("删除成功！");
          this.getWork(item.cid);
        })
        .catch(() => {
          // this.$emit("after-delete");
          this.loading = false;
          this.$message({
            type: "info",
            duration: 2000,
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    if (this.$route.params.courseId && this.$route.params.courseName) {
      this.courseId = this.$route.params.courseId;
      this.courseName = this.$route.params.courseName;
      this.courses.push({
        id: this.courseId,
        name: this.courseName
      });
      this.getWork(this.courseId);
    }

    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
        // if (this.$route.params.courseId) {
        //   this.courseId = this.$route.params.courseId;
        //   this.getWork(this.courseId);
        // }
      })
      .catch(error => {
        // this.loading = false;
        this.$message.error(error + " 数据获取失败");
      });
  }
};
</script>
<style lang="scss">
.nodata-tip {
  /*全局可用*/
  margin-top: 4vh;
  text-align: center;
  font-size: 8em;
  color: #409eff;
}
.work-container {
  .el-collapse-item__header {
    // font-size: 14px;
    &.is-active {
      .work-name {
        color: #409eff;
      }
    }
  }
  .my-dialog .el-dialog__body {
    padding: 20px;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
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
  .content-area {
    min-height: calc(100vh - 200px); // for v-loading
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
