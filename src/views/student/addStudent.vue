<template>
  <div class="add-student">
    <!-- class-name 此类名当sticky为真时才会绑定到div上 -->
    <sticky class-name="fixed-bar" :z-index="3">
      <div class="title-bar">
        <el-row>
          <el-col :xs="24" :sm="12">
            <el-button size="small" icon="el-icon-back" @click="beforeBack">返回</el-button>
            <!-- <span class="classname">给课程：{{$route.params.courseName}} 添加学生</span> -->
            <span class="classname">导入学生 - {{courseName?courseName:"无数据，请返回重试！"}}</span>
          </el-col>
          <el-col :xs="24" :sm="12">
            学生总数：{{tableData.length}}
            &nbsp;&nbsp;&nbsp;
            <el-button
              :disabled="courseName==''||tableData.length==0"
              size="medium"
              icon="el-icon-circle-check-outline"
              @click="handleAdd()"
            >确认添加</el-button>
          </el-col>
        </el-row>
      </div>
    </sticky>
    <div class="content">
      <transition enter-active-class="animated fadeInRight" appear>
        <el-alert
          title="Excel内容格式说明"
          close-text="我知道了"
          type="info"
          show-icon
          style="margin-bottom:20px"
        >
          <div class="tip-content" slot="title">
            Excel内容格式示例：
            <table class="example-table" cellspacing="0" cellpadding="0" align="center">
              <tr>
                <td>学号</td>
                <td>班级</td>
                <td>姓名</td>
              </tr>
              <tr>
                <td>xxx</td>
                <td>xxx</td>
                <td>xxx</td>
              </tr>
            </table>
          </div>
        </el-alert>
      </transition>
      <upload-excel-component
        v-if="courseId"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />

      <!-- <transition enter-active-class="animated fadeInUp" :duration="{ leave: 0 }" appear>
        <el-alert
          v-if="tableData.length!=0"
          title="请务必检查以下数据的正确性，再点击“确定添加”"
          type="warning"
          show-icon
          style="margin-top:10px"
        ></el-alert>
      </transition>-->

      <el-table
        size="medium"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column v-if="tableData.length!=0" type="index" width="80"></el-table-column>
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
      </el-table>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { addStudent } from "@/api/student";
export default {
  name: "AddStudent",
  components: {
    Sticky,
    UploadExcelComponent
  },
  data() {
    return {
      courseId: "",
      courseName: "",
      suggestName: "",
      tableData: [],
      tableHeader: [],
      exampleHeader: ["", "", ""]
    };
  },
  computed: {},
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
    },

    beforeBack() {
      if (this.tableData.length > 0) {
        this.$confirm("放弃添加，直接返回？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.returnBack();
          })
          .catch(() => {
            return false;
          });
      } else {
        this.returnBack();
      }
    },
    returnBack() {
      this.$router.push({
        name: "Student",
        params: { courseId: this.courseId, courseName: this.courseName }
      });
    },
    handleAdd() {
      let loading; //
      this.$confirm(
        "确认以下" +
          this.tableData.length +
          "名学生数据无误，立即添加到课程：" +
          this.courseName +
          "？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // addStudent();
          //先判断学号唯一！！！
          loading = this.$loading({
            lock: true,
            text: "Loading...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.6)"
          });

          let students = [];
          this.tableData.forEach(item => {
            let obj = {};
            obj.number = item["学号"];
            obj.name = item["姓名"];
            obj.classname = item["班级"];
            obj.password = "";
            students.push(obj);
          });
          return addStudent(students);
        })
        .then(res => {
          loading.text = "1/4 学生信息添加成功";
          // if (res.data.wid) {
          //   this.newWorkId = res.data.wid;
          // } else {
          //   throw "作业ID获取失败";
          // }
          // return addQuestion(this.questions);
        })
        .then(res => {
          loading.text = "2/4 习题题目添加成功";
          // this.questions.forEach(i => {
          //   this.w_q.push({ wid: this.newWorkId, qnumber: i.number });
          // });
          // return addAnswer(this.answers);
        })
        .catch(error => {
          loading.close();
          this.$message.error(error + " 添加失败");
          return false;
        });
    }
  },
  created() {
    if (this.$route.params.courseId && this.$route.params.courseName) {
      this.courseId = this.$route.params.courseId;
      this.courseName = this.$route.params.courseName;
      this.suggestName = this.$route.params.suggestName;
    }
  }
};
</script>
<style lang="scss">
</style>

<style lang="scss" scoped>
.add-student {
  // margin: 30px;
  margin: 14px 0 30px;

  .title-bar {
    color: #444;
    padding: 10px 30px;
    background-color: #ffffff;
    border-bottom: 1px solid #ebeef5;

    .classname {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
    }
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .content {
    padding: 30px;
    .tip-content {
      font-size: 16px;
      margin-top: 1px;
      .example-table {
        font-size: 12px;
        vertical-align: middle;
        display: inline-block;
        border-collapse: collapse;
        text-align: center;
        // border: 1px solid rgb(219, 221, 224);
        td {
          border: 1px solid rgb(219, 221, 224);
          padding: 2px 6px;
        }
      }
    }
  }
}
</style>


