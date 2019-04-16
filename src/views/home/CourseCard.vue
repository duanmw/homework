<template>
  <div class="card" v-loading="loading">
    <el-card shadow="hover">
      <div slot="header">
        <span class="text-overflow course-name" :title="'创建于'+courseData.createtime">
          <span class="title-icon" :style="colorStyle[index%4]">
            <svg-icon icon-class="course-title"/>
          </span>
          {{courseData.name}}
        </span>
      </div>
      <div class="cardbody clearfix">
        <div class="left-body">{{courseData.info? courseData.info:"暂无简介"}}</div>

        <div class="right-body">
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
  </div>
</template>

<script>
import { updateCourse, deleteCourse, allCourseByTid } from "@/api/course";
export default {
  name: "CourseCard",
  props: {
    courseData: Object,
    index: Number
  },
  data() {
    return {
      loading: false,
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
    .title-icon {
      margin-left: -1px;
      margin-right: 8px;
      color: #409eff;
    }
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
