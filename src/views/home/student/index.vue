<template>
  <div class="course-container" v-loading="loading">
    <h3>我的课程</h3>
    <transition name="slow-fade" appear>
      <div v-if="courses.length==0" class="nodata-tip">
        <svg-icon icon-class="nodata"/>
      </div>
    </transition>
    <div class="course">
      <el-row :gutter="30">
        <!-- <transition-group enter-active-class="animated fadeInDown" tag="div" appear> -->
        <transition-group name="fade-up" tag="div" appear>
          <el-col
            v-for="(course,index) in courses"
            :ref="'card'+index"
            :key="'cou'+index"
            :xs="24"
            :sm="12"
          >
            <router-link :to="{ name: 'StuHomework', params: {course }}" tag="a">
              <courseCard v-waves :index="index" :key="index" :courseData="course"></courseCard>
            </router-link>
          </el-col>
        </transition-group>
      </el-row>
    </div>
  </div>
</template>

<script>
import CourseCard from "./CourseCard";
import { allCourseBySid } from "@/api/course";
import waves from "@/directive/waves/index.js"; // 水波纹指令

export default {
  name: "Home",
  components: {
    CourseCard
  },
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      courses: []
    };
  },
  methods: {},
  created() {
    this.loading = true;
    allCourseBySid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.$message.error(error + " 数据获取失败");
      });
  }
};
</script>
<style lang="scss">
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.course-container {
  min-height: calc(100vh - 200px); // for v-loading
  margin: 30px;
  // h3 {
  //   color: #303133;
  // }
  .el-col {
    margin-bottom: 24px;
    transition: all 0.7s; //进入离开过渡动画均有效，在.fade-up-move设置进入无动画
  }
}
</style>
