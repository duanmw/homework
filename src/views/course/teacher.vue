<template>
  <div class="course-container" v-loading="loading">
    <h3>全部课程</h3>
    <div class="course">
      <el-row :gutter="24">
        <!-- <transition-group enter-active-class="animated fadeInDown" tag="div" appear> -->
        <transition-group name="fade-transform" tag="div" appear>
          <el-col v-for="(course,index) in courses" :key="index" :xs="24" :sm="12" :md="8">
            <courseCard :index="index" :key="index" :courseData="course"></courseCard>
          </el-col>
          <el-col key="addC" :xs="24" :sm="12" :md="8">
            <el-card shadow="hover" header="添加课程">
              <div class="add-course" @click="dialogFormVisible = true">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </el-card>
          </el-col>
        </transition-group>
      </el-row>
      <!-- <FormDialog :dialogFormVisible="false"></FormDialog> -->
      <el-dialog
        custom-class="course-form"
        width="40%"
        title="添加课程"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form">
          <el-form-item label="课程名称：">
            <el-input clearable maxlength="20" v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="课程简介：">
            <el-input maxlength="50" type="textarea" v-model="form.info"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CourseCard from "./CourseCard";
import { addCourse, allCourseByTid } from "@/api/course";
// import FormDialog from "./FormDialog";
export default {
  name: "Course",
  components: {
    CourseCard
    // FormDialog
  },
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      form: {
        name: "",
        info: ""
      },
      courses: []
      // courses: [
      //   {
      //     name: "Hello World",
      //     info: "some info"
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters(["name", "roles", "email", "number"])
  },
  methods: {
    handleAdd() {
      this.dialogFormVisible = false;
      this.loading = true;
      addCourse(this.$store.getters.id, this.form.name, this.form.info)
        .then(res => {
          return allCourseByTid(this.$store.getters.id);
        })
        .then(res => {
          this.courses = res.data.courses;
          console.log(this.courses);
          this.loading = false;
          this.$message.success("添加成功!");
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 添加失败");
        });
    }
  },
  created() {
    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
        console.log(this.courses);
        // this.loading = false;
        // this.$message.success("添加成功!");
      })
      .catch(error => {
        // this.loading = false;
        this.$message.error(error + " 数据获取失败");
      });
  }
};
</script>
<style lang="scss">
@media screen and (max-width: 992px) {
  .course-form {
    min-width: 60%;
  }
}
@media screen and (max-width: 768px) {
  .course-form {
    min-width: 80%;
  }
}
@media screen and (max-width: 600px) {
  .course-form {
    min-width: 98%;
  }
}
.course-form .el-dialog__body {
  padding: 20px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.course-container {
  margin: 30px;
  .el-col {
    margin-bottom: 24px;
  }
  .el-card {
    border: 1px solid #dbdfe6;
    background-color: #fcfeff;
  }
  .add-course {
    color: #666666;
    text-align: center;
    font-size: 26px;
    line-height: 70px;
    height: 72px;
    &:hover {
      color: #409eff;
      cursor: pointer;
    }
    &:active {
      color: #3a8ee6;
    }
  }
}
</style>
