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
            学生总数：{{rightContent?tableData.length:"？？"}}
            &nbsp;&nbsp;&nbsp;
            <el-button
              :disabled="courseName==''||tableData.length==0 || !rightContent"
              size="medium"
              icon="el-icon-circle-check-outline"
              @click="handleAdd()"
            >确认添加</el-button>
          </el-col>
        </el-row>
      </div>
    </sticky>
    <div class="content">
      <upload-excel-component
        v-if="courseId"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />

      <transition enter-active-class="animated fadeInUp" :duration="{ leave: 0 }" appear>
        <el-alert
          v-if="tableData.length!=0"
          title="请务必检查以下数据的正确性，再点击“确定添加”，添加时会忽略系统中已存在学号的数据项"
          type="warning"
          show-icon
          style="margin-top:10px"
        ></el-alert>
      </transition>

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
import { addStudent, haveOne, addSC } from "@/api/student";
import md5 from "blueimp-md5";
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
      exampleHeader: ["学号", "班级", "姓名"],
      rightContent: false,
      loading: null,
      existSid: [],
      students: []
    };
  },
  computed: {},
  watch: {
    tableData(val) {
      if (this.tableHeader.length > 0) {
        if (this.tableHeader.toString() != this.exampleHeader.toString()) {
          this.rightContent = false;
          this.$notify({
            type: "warning",
            title: "请检查内容格式",
            duration: 5000,
            dangerouslyUseHTMLString: true,
            message: `<p>Excel内容格式要求：</p>
                      <table class="example-table" cellspacing="0" cellpadding="0">
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
                      </table>`
          });
        } else {
          this.rightContent = true;
          if (this.tableData.length == 0) {
            this.$message.success("内容格式正确，但无数据");
          } else {
            this.$message.success("内容格式正确，可以添加了");
          }
        }
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "请不要上传大小超过1M的文件",
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
      this.$confirm(
        "请务必先确认以下" +
          this.tableData.length +
          "名学生数据无误。是否立即添加到课程：" +
          this.courseName +
          "？",
        "提示",
        {
          confirmButtonText: "确定添加",
          cancelButtonText: "取消添加",
          type: "warning"
        }
      )
        .then(() => {
          this.existSid.splice(0, this.existSid.length); //清空待添加关联的学号数组
          this.students.splice(0, this.students.length); //清空待添加关联的学号数组
          //添加前判断学号唯一！暂不实现
          this.loading = this.$loading({
            lock: true,
            text: "正在添加...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.6)"
          });

          // let students = [];
          this.tableData.forEach(item => {
            haveOne(item["学号"]).then(res => {
              if (res.data.id) {
                //如果存在则把学生id加到“待添加关联”数组
                this.existSid.push({ sid: res.data.id, cid: this.courseId });
              } else {
                //如果不存在则把学生信息加到“待添加学生”数组
                let obj = {};
                obj.number = item["学号"];
                obj.name = item["姓名"];
                obj.classname = item["班级"];
                obj.password = md5("123456"); //学生登录默认密码123456
                this.students.push(obj);
              }
            });
          });
        })
        .then(() => {
          return addStudent(this.students);
        })
        .then(res => {
          this.loading.text = "1/2 学生信息添加成功";

          let scArr = []; //存放sc关联数据
          if (res.data.sid.length > 0) {
            //遍历数组
            for (let id of res.data.sid) {
              scArr.push({ sid: id, cid: this.courseId });
            }
          }
          // else {
          //   throw "作业ID获取失败";
          // }
          return addSC(this.existSid.concat(scArr));
        })
        .then(res => {
          this.loading.text = "2/2 学生课程关联添加成功";
          this.loading.close();
          this.$message.success("学生添加成功!");
          this.returnBack(); //添加成功就返回
        })
        .catch(error => {
          if (this.loading) this.loading.close();
          if (error != "cancel") {
            //此处注意排除点击“取消”的error情况
            this.$message.error(error + " 添加失败");
            // this.returnBack();
            //如果不返回，就要清空数据
            this.tableData.splice(0, this.tableData.length);
            this.tableHeader.splice(0, this.tableHeader.length);
          }
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
.example-table {
  margin-top: 4px;
  font-size: 12px;
  vertical-align: middle;
  border-collapse: collapse;
  text-align: center;
  td {
    border: 1px solid rgb(219, 221, 224);
    padding: 2px 10px;
  }
}
</style>

<style lang="scss" scoped>
.add-student {
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
    }
  }
}
</style>


