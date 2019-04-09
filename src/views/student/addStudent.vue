<template>
  <div class="add-student">
    <sticky :z-index="3">
      <div class="title-bar">
        <el-row>
          <el-col :xs="24" :sm="12">
            <el-button size="small" icon="el-icon-back" @click="beforeBack">返回</el-button>
            <!-- <span class="classname">给课程：{{$route.params.courseName}} 添加学生</span> -->
            <span class="classname">导入学生 - {{courseName?courseName:"无数据，请返回重试！"}}</span>
          </el-col>
          <el-col :xs="24" :sm="12">
            <!-- 习题总数：{{quesCount}}
            &nbsp;&nbsp;&nbsp;-->
            <el-button
              :disabled="courseName==''"
              size="medium"
              icon="el-icon-circle-check-outline"
              @click="handleAdd()"
            >确认添加</el-button>
          </el-col>
        </el-row>
      </div>
    </sticky>
    <div class="content">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
      </el-table>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
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
      tableHeader: []
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
      if (this.quesCount > 0) {
        this.$confirm("返回将不会保存已添加习题，是否继续？", "提示", {
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
    handleAdd() {}
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
.add-student {
  .box-type-one,
  .box-type-two {
    .el-input {
      width: calc(100% - 90px);
    }
  }
}
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
  .content{
    padding: 30px;
  }
}
</style>


