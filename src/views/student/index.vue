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
          <el-button :disabled="!courseId" size="medium" icon="el-icon-circle-plus-outline">添加学生</el-button>
          <router-link :to="{ name: 'addStudent', params: { courseId,courseName}}" tag="span">
            <el-button :disabled="!courseId" size="medium" icon="el-icon-upload2">导入学生</el-button>
          </router-link>
          <!-- <el-button :disabled="!courseId" size="medium" icon="el-icon-printer">统计成绩</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <!-- <div class="table-title">{{courseName?courseName:"??课程"}} 学生表</div> -->
      <el-table
        size="medium"
        v-loading="loading"
        :data="students"
        border
        highlight-current-row
        style="width: 100%"
        @current-change="CurrentRowChange"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <!-- <el-table-column align="center" label="学号" width="80"> -->
        <el-table-column align="center" label="学号">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.number" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ row.number }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="班级">
          <!-- <el-table-column width="120px" align="center" label="班级"> -->
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.classname" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ row.classname }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column min-width="300px" label="姓名"> -->
        <el-table-column align="center" label="姓名">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" size="small"/>
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

      <el-pagination
        v-show="total>0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <transition enter-active-class="animated zoomInUp" :duration="{ leave: 0 }" appear>
        <el-alert
          v-if="courses.length!=0&&!courseId"
          title="请先选择一个课程"
          type="warning"
          center
          show-icon
        ></el-alert>
      </transition>
    </div>
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";
import { allStudentByCid } from "@/api/student";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Student",
  components: { Pagination },
  data() {
    return {
      courseId: "",
      courseName: "",
      loading: false,
      courses: [],
      total: 0,
      page: 1,
      limit: 10,
      // listQuery: {
      //   page: 1,
      //   limit: 10
      // },
      students: []
    };
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getStudent(this.courseId);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getStudent(this.courseId);
    },
    /**
     * 因为下拉框的@change事件，因此第一个参数一定为cid
     * 第几页page对应后台第几页要减1
     */
    getStudent(cid, page = this.page - 1, size = this.limit) {
      this.loading = true;
      let obj = {};
      obj = this.courses.find(item => {
        return item.id === cid; //筛选出匹配课程id的课程
      });
      this.courseName = obj.name; //设置对应课程名
      // console.log(this.listQuery);
      // let  page= this.listQuery.page;
      // let  limit = this.listQuery.limit;
      console.log("limit:", this.limit);

      allStudentByCid(cid, page, size)
        .then(res => {
          this.loading = false;
          this.total = res.data.students.totalElements;
          this.students = res.data.students.content;
          this.students = this.students.map(stu => {
            this.$set(stu, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
            stu.originalNumber = stu.number; //  取消编辑后使用original值
            stu.originalClassname = stu.classname;
            stu.originalName = stu.name;
            return stu;
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    CurrentRowChange(row, oldRow) {
      // console.log("row",row);
      console.log("oldRow", oldRow);
      if (oldRow && oldRow.edit) {
        this.cancelEdit(oldRow);
      }
    },
    cancelEdit(row) {
      row.number = row.originalNumber;
      row.classname = row.originalClassname;
      row.name = row.originalName;
      row.edit = false;
      // this.$message({
      //   message: "已取消编辑",
      //   type: "warning"
      // });
    },
    confirmEdit(row) {
      console.log("row", row);
      row.edit = false;
      row.originalNumber = row.number;
      row.originalClassname = row.classname;
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
    padding: 0 0 20px;
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .content-area {
    .table-title {
      color: #909399;
      padding: 12px 0;
    }
    .edit-input {
      margin-top: 1px;
      width: 90%;
    }
    .el-pagination {
      padding: 30px 0;
    }
  }
}
</style>
