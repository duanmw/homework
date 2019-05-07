<template>
  <div class="course-container" v-loading="loading">
    <h3>全部课程</h3>
    <div class="course">
      <el-row :gutter="24">
        <transition-group name="fade-up" tag="div" appear>
          <el-col
            v-for="(course,index) in courses"
            :ref="'card'+index"
            :key="'cou'+index"
            :xs="24"
            :sm="12"
            :md="8"
          >
            <courseCard
              @after-update="afterUpdate"
              @before-delete="loading=true"
              @after-delete="afterDelete"
              :index="index"
              :key="index"
              :courseData="course"
            ></courseCard>
          </el-col>
          <el-col key="addC" :xs="24" :sm="12" :md="8">
            <el-card
              shadow="hover"
              header="添加课程"
              class="add-card"
              @click.native="dialogFormVisible = true"
            >
              <div class="add-course">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </el-card>
          </el-col>
        </transition-group>
      </el-row>
      <el-dialog
        custom-class="my-dialog"
        title="添加课程"
        :visible.sync="dialogFormVisible"
        @closed="handleClose"
      >
        <el-form size="medium" :model="form" :rules="rules" ref="addCourseForm">
          <el-form-item label="课程名称：" prop="name">
            <el-input clearable maxlength="20" v-model.trim="form.name"></el-input>
          </el-form-item>

          <el-form-item label="课程简介：">
            <el-input maxlength="50" show-word-limit type="textarea" v-model="form.info"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CourseCard from "./CourseCard";
import { isExist, addCourse, allCourseByTid } from "@/api/course";

export default {
  name: "Course",
  components: {
    CourseCard
  },
  data() {
    return {
      noshow: false,
      loading: false,
      dialogFormVisible: false,
      form: {
        name: "",
        info: ""
      },
      rules: {
        name: [
          { required: true, message: "课程名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "课程名长度在 2 到 20 个字符",
            trigger: "blur"
          }
        ]
      },
      courses: []
    };
  },
  methods: {
    handleAdd() {
      this.$refs.addCourseForm.validate(valid => {
        if (valid) {
          isExist(this.$store.getters.id, this.form.name)
            .then(res => {
              if (res.message == "true") {
                return Promise.reject("exist");
              } else {
                this.dialogFormVisible = false;
                this.loading = true;
                return addCourse(
                  this.$store.getters.id,
                  this.form.name,
                  this.form.info
                );
              }
            })
            .then(res => {
              return allCourseByTid(this.$store.getters.id);
            })
            .then(res => {
              this.courses = res.data.courses;
              this.loading = false;
              this.$message.success("添加成功！"); //添加成功！
            })
            .catch(error => {
              this.loading = false;
              if (error == "exist") {
                this.$message.warning("此课程名已存在！请更换");
              } else {
                this.$message.error(error + " 添加失败！");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      // 每次关闭，移除校验结果，以免下一次打开仍显示
      // this.$refs.addCourseForm.clearValidate();
      //移除校验结果并重置表单为初始值
      this.$refs.addCourseForm.resetFields();
      this.form.info = "";
    },
    afterUpdate(val) {
      this.courses[val.index].name = val.data.name;
      this.courses[val.index].info = val.data.info;
    },
    afterDelete(index) {
      this.loading = false;
      if (index!=undefined) {
        this.courses.splice(index, 1); //删除一个
        this.$message.success("删除成功！"); //删除成功！
      }
    }
  },
  created() {
    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
      })
      .catch(error => {
        this.$message.error(error + " 数据获取失败");
      });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.course-container {
  margin: 30px;
  .el-col {
    margin-bottom: 24px;
    transition: all 0.7s; //进入离开过渡动画均有效，在.fade-up-move设置进入无动画
  }
  .el-card {
    border: 1px solid #dbdfe6;
    background-color: #fcfeff;
  }
  .add-card {
    .add-course {
      color: #666666;
      text-align: center;
      font-size: 26px;
      line-height: 70px;
      height: 72px;
      transform: perspective(1px) translateZ(0);
      transition-duration: 0.5s;
    }
    &:hover {
      color: #409eff;
      cursor: pointer;
      .add-course {
        color: #409eff;
        transform: scale(1.2);
        transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
        &:active {
          color: #3a8ee6;
        }
      }
    }
  }
}
</style>
