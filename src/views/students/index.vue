<template>
  <div class="student-container">
    <!-- <h3>全部作业</h3> -->
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12">
          课程：&nbsp;
          <el-select @change="getStudent" v-model="courseId" placeholder="请选择课程" size="medium">
            <el-option
              v-for="course in courses"
              :key="'optc'+course.id"
              :label="course.name"
              :value="course.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12">
          <router-link :to="{ name: 'addHomework', params: { courseId,courseName}}" tag="span">
            <el-button :disabled="!courseId" size="medium" icon="el-icon-circle-plus-outline">添加学生</el-button>
          </router-link>
          <!-- <el-button size="medium" icon="el-icon-view">查看成绩</el-button> -->
          <el-button :disabled="!courseId" size="medium" icon="el-icon-printer">统计成绩</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <transition name="slow-fade" appear>
        <el-alert
          v-if="courses.length!=0&&!courseId"
          title="请先选择一个课程"
          type="warning"
          center
          show-icon
        ></el-alert>
        <!-- <div v-else-if="courses.length==0||students.length==0" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>-->
      </transition>
      <div class="table-title">xxxx课程学生表</div>
      <el-table
        v-loading="loading"
        :data="students"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <!-- <el-table-column align="center" label="学号" width="80"> -->
        <el-table-column align="center" label="学号">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="班级">
          <!-- <el-table-column width="120px" align="center" label="班级"> -->
          <template slot-scope="scope">
            <span>{{ scope.row.classname }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column min-width="300px" label="姓名"> -->
        <el-table-column align="center" label="姓名">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" size="small"/>
              <!-- <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-circle-close-outline"
                type="warning"
                @click="cancelEdit(row)"
              >取消</el-button>-->
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >确定</el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >编辑</el-button>
            <el-button
              v-if="row.edit"
              class="cancel-btn"
              size="small"
              icon="el-icon-circle-close-outline"
              type="warning"
              @click="cancelEdit(row)"
            >取消</el-button>
            <el-button
              v-else
              size="small"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="deleteOne(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";

export default {
  name: "Students",
  components: {},
  data() {
    return {
      courseId: "",
      courseName: "",
      loading: false,
      courses: [],
      students: [
        {
          number: "1501511234",
          classname: "1506031",
          name: "小明",
          edit: false
        },
        {
          number: "1501511236",
          classname: "1506031",
          name: "小s明",
          edit: false
        }
      ]
    };
  },
  watch: {},
  methods: {
    getStudent() {
      this.students = this.students.map(v => {
        this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
        v.originalName = v.name; //  will be used when user click the cancel botton
        return v;
      });
    },
    handleCurrentChange(row, oldRow) {
      // console.log("row",row);
      console.log("oldRow", oldRow);
      if (oldRow && oldRow.edit) {
        this.cancelEdit(oldRow);
      }
    },
    cancelEdit(row) {
      row.name = row.originalName;
      row.edit = false;
      this.$message({
        message: "已取消编辑",
        type: "warning"
      });
    },
    confirmEdit(row) {
      console.log("row", row);
      row.edit = false;
      row.originalName = row.name;
      this.$message({
        message: "确认编辑",
        type: "success"
      });
    },
    deleteOne(row) {
      this.$confirm(
        "此操作将删除学生：" + row.name + "，不可撤销，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // this.loading = true;
          // return deleteWork(item);
        })
        // .then(res => {
        //   this.$message.success("删除成功！");
        //   this.getWork(item.cid);
        // })
        .catch(() => {
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
      this.getStudent(this.courseId);
    }

    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
      })
      .catch(error => {
        // this.loading = false;
        this.$message.error(error + " 数据获取失败");
      });

    this.getStudent();
  }
};
</script>
<style lang="scss">
.student-container {
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.student-container {
  margin: 30px;
  .title-bar {
    color: #444;
    padding: 0 0 10px;
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .content-area {
    min-height: calc(100vh - 200px); // for v-loading
    .table-title {
      color: #909399;
      text-align: center;
      padding: 12px;
      font-weight: bold;
    }
    .edit-input {
      // padding-right: 95px;
      margin-top: 1px;
    }
    .cancel-btn {
      // position: absolute;
      // right: 15px;
      // top: 12px;
    }
  }
}
</style>
