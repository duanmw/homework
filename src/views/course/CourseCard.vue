<template>
  <!-- 修改课程时未判断课程名的重复与否 -->
  <div class="card" v-loading="loading">
    <el-card shadow="hover">
      <div slot="header">
        <span class="text-overflow course-name" :title="'创建于'+courseData.createtime">
          <span class="title-icon" :style="colorStyle[index%4]">
            <svg-icon icon-class="course-title"/>
          </span>
          {{courseData.name}}
        </span>
        <el-dropdown @command="handleCommand" :show-timeout="100" @visible-change="changeIcon">
          <el-button :icon="operateIcon" style="padding: 0" type="text">操作</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="update">修改课程</el-dropdown-item>
            <el-dropdown-item command="delete">删除课程</el-dropdown-item>
            <el-dropdown-item command="a">
              <router-link
                :to="{ name: 'Homework', params: { courseId:courseData.id,courseName:courseData.name }}"
                tag="span"
              >管理作业</router-link>
            </el-dropdown-item>
            <el-dropdown-item command="b">
              <router-link
                :to="{ name: 'Student', params: { courseId:courseData.id,courseName:courseData.name }}"
                tag="span"
              >管理学生</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="cardbody clearfix">
        <div class="left-body">{{courseData.info? courseData.info:"暂无简介"}}</div>
        <!-- <div
        class="left-body"
        >暂无课程简介123</div>-->
        <div class="right-body">
          <!-- <router-link :to="'/homework?can='+index" tag="a"> -->
          <router-link
            :to="{ name: 'Homework', params: { courseId:courseData.id,courseName:courseData.name }}"
            tag="a"
          >
            <span class="inner-icon" :style="colorStyle[index%4]">
              <svg-icon icon-class="homework"/>
            </span>
            作业：{{courseData.workcount}}
          </router-link>
          <router-link
            :to="{ name: 'Student', params: { courseId:courseData.id,courseName:courseData.name }}"
            tag="a"
          >
            <span class="inner-icon" :style="colorStyle[index%4]">
              <svg-icon icon-class="student"/>
            </span>
            学生：{{courseData.stucount}}
          </router-link>
          <!-- <div class="textitem">
          <span :style="colorStyle[index%4]"><svg-icon icon-class="student"/></span> 学生：30
          </div>-->
        </div>
      </div>
    </el-card>
    <el-dialog
      custom-class="my-dialog"
      title="修改课程"
      :visible.sync="dialogFormVisible"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-form size="medium" :model="form" :rules="rules" ref="updateCourseForm">
        <el-form-item label="课程名称：" prop="name">
          <el-input clearable maxlength="20" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="课程简介：">
          <el-input maxlength="50" type="textarea" v-model="form.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  isExist,
  updateCourse,
  deleteCourse,
  allCourseByTid
} from "@/api/course";
export default {
  name: "CourseCard",
  props: {
    courseData: Object,
    index: Number
  },
  data() {
    return {
      loading: false,
      operateIcon: "el-icon-circle-plus-outline",
      dialogFormVisible: false,
      form: {
        name: this.courseData.name,
        info: this.courseData.info
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
      colorStyle: [
        {
          color: "#30BA78"
        },
        {
          color: "#30DECE"
        },
        {
          color: "YellowGreen"
        },
        {
          color: "SlateBlue"
        }
      ]
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "update":
          this.dialogFormVisible = true;
          break;
        case "delete":
          this.$confirm(
            "此操作将永久删除课程：" +
              this.courseData.name +
              "，以及课程内的作业，是否继续？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$emit("before-delete");
              return deleteCourse(this.courseData);
            })
            .then(res => {
              this.$emit("after-delete", this.index); //传数据过去
            })
            .catch(err => {
              this.$emit("after-delete");
              if (err == "cancel") {
                this.$message({
                  type: "info",
                  duration: 2000,
                  message: "已取消删除"
                });
              } else {
                this.$message.error(err + " 删除失败！");
              }
            });
          break;
        default:
          break;
      }
    },
    changeIcon(bool) {
      if (bool) {
        //下拉菜单显示
        this.operateIcon = "el-icon-remove-outline";
      } else {
        //下拉菜单隐藏
        this.operateIcon = "el-icon-circle-plus-outline";
      }
    },
    handleUpdate() {
      this.$refs.updateCourseForm.validate(valid => {
        if (valid) {
          isExist(this.$store.getters.id, this.form.name)
            .then(res => {
              if (
                res.message == "true" &&
                this.form.name != this.courseData.name
              ) {
                //如果存在课程名且不跟修改前不一样，说明重复
                this.$message.warning("此课程名已存在！请更换");
                return Promise.reject("exist");
              } else {
                this.dialogFormVisible = false;
                this.loading = true;
                let obj = Object.assign({}, this.courseData, this.form); //合并对象
                return updateCourse(obj);
              }
            })
            .then(res => {
              let theCourse = { index: this.index, data: this.form };
              this.$emit("after-update", theCourse);
              this.loading = false;
              this.$message.success("修改成功!");
            })
            .catch(error => {
              this.loading = false;
              if (error != "exist") this.$message.error(error + " 修改失败！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleOpen() {
      // 每次打开，重新设置form值，防止值为上一次未保存修改的
      this.form.name = this.courseData.name;
      this.form.info = this.courseData.info;
    },
    handleClose() {
      // 每次关闭，移除校验结果，以免下一次打开仍显示
      this.$refs.updateCourseForm.clearValidate();
      //移除校验结果并重置表单为初始值
      // this.$refs.updateCourseForm.resetFields();
    }
  }
};
</script>
<style>
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  .el-card {
    border: 1px solid #dbdfe6;
    background-color: #fcfeff;
  }
  .course-name {
    margin-bottom: -4px;
    width: calc(100% - 60px);
    display: inline-block;
  }
  .el-dropdown {
    right: -8px;
  }
  .cardbody {
    height: 72px;
    position: relative;
    .left-body {
      display: inline-block;
      // max-width: 60%;
      width: 60%;
      max-width: calc(100% - 100px);
      max-height: 72px;
      overflow: hidden;
      color: #666666;
      font-size: 12px;
      line-height: 18px;
      text-align: center;
      position: absolute;
      top: 50%;
      // right: 0;
      transform: translateY(-50%);
    }
    .right-body {
      display: inline-block;
      font-size: 14px;
      color: #444444;
      min-width: 107px;
      width: 39%;
      line-height: 28px;
      padding-left: 10%;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      a {
        display: block;
        &:hover {
          color: #409eff;
        }
        .inner-icon {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
