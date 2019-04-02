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
          <router-link :to="{ name: 'addHomework', params: { courseId,courseName }}" tag="span">
            <el-button :disabled="!courseId" size="medium" icon="el-icon-circle-plus-outline">添加作业</el-button>
          </router-link>
          <!-- <el-button size="medium" icon="el-icon-view">查看成绩</el-button> -->
          <el-button :disabled="!courseId" size="medium" icon="el-icon-printer">统计成绩</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-area" v-loading="loading">
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
                <el-button plain type="danger" size="small" icon="el-icon-delete">删除作业</el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
        </transition-group>
      </el-collapse>
      <br>
      <transition name="slow-fade" appear>
        <el-alert v-if="!courseId" title="请先选择一个课程" type="warning" center show-icon></el-alert>
        <!-- <el-alert  title="此课程暂无作业" type="info" center show-icon></el-alert> -->
        <div v-else-if="homeworks.length==0" class="tip">
          <svg-icon icon-class="nodata"/>
        </div>
      </transition>
    </div>
    <!-- 类course-form宽度做了响应式,所以加上此类名 -->
    <!-- :fullscreen="true" -->
    <el-dialog
      top="10vh"
      custom-class="course-form"
      width="40%"
      title="添加作业 - 设置信息"
      :visible.sync="formVisible.one"
      @closed="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="addWorkForm" size="medium" label-width="100px">
        <el-form-item label="作业名称：" prop="name">
          <el-input clearable maxlength="20" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label-width="156px" label="作业允许提交次数：" prop="maxSubmit">
          <el-input-number v-model="form.maxSubmit" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label-width="170px" label="作业关闭后显示答案：">
          <el-switch v-model="form.showAnswer"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible.one = false">取 消</el-button>
        <el-button type="primary" @click="toStepTwo">下一步</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      :append-to-body="true"
      top="10vh"
      :fullscreen="true"
      width="40%"
      :visible.sync="formVisible.two"
      @closed="handleClose"
    >
      <AddQuestion/>
        <div slot="title">
          {{'作业（'+form.name+'） - 添加习题'}}&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="medium" @click="formVisible.two = false;formVisible.one = true">上一步</el-button>
          <el-button size="medium" type="primary" @click="toStepThree">下一步</el-button>
        </div>
    </el-dialog>
    <el-dialog
      top="10vh"
      custom-class="course-form"
      width="40%"
      :title="'确认添加（'+form.name+'）'"
      :close-on-click-modal="false"
      :visible.sync="formVisible.three"
      @closed="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="submitWorkForm" size="medium" label-width="100px">
        <el-form-item label="作业名称：" prop="name">
          <el-input clearable maxlength="20" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="开放时间：" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions0"
            default-time="00:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="关闭时间：" prop="closeTime">
          <el-date-picker
            v-model="form.closeTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible.three = false;formVisible.two = true">上一步</el-button>
        <el-button type="primary" @click="handleAddWork">确认添加</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";
import { addWork, allWorkByCid } from "@/api/homework";
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
      this.form.name =
        this.courseName + "第" + (newValue.length + 1) + "次作业";
      // console.log(newValue)
      // },
      // deep: true
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
          console.log(this.homeworks);
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
    toStepTwo() {
      this.$refs.addWorkForm.validate(valid => {
        if (valid) {
          this.formVisible.one = false;
          // this.formVisible.two = true;
          this.$router.push({
            path: "/homework/addhomework",
            meta: { workinfo: this.form }
          });
        }
      });
    },
    toStepThree() {
      // this.$refs.addQuestionForm.validate(valid => {
      // if (valid) {
      this.formVisible.two = false;
      this.formVisible.three = true;
      // }
      // });
    },
    handleClose() {},
    handleAddWork() {
      // this.$router.push({
      //   name: "addHomework",
      //   params: { courseId:this.courseId, courseName:this.courseName }
      // });
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
  .course-form .el-dialog__body {
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
    .tip {
      margin-top: 4vh;
      text-align: center;
      font-size: 8em;
      color: #409eff;
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
