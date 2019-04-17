<template>
  <div class="course-container" v-loading="loading">
    <!-- <transition enter-active-class="animated zoomInUp" :duration="{ leave: 0 }" appear>
      <el-alert v-if="courses.length!=0" title="你有作业未提交" type="warning" center show-icon></el-alert>
    </transition>-->
    <h3>我的课程</h3>
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
            <router-link :to="{ name: 'StuHomework', params: { cid:course.id, cname:course.name }}" tag="a">
              <courseCard :index="index" :key="index" :courseData="course"></courseCard>
            </router-link>
          </el-col>
        </transition-group>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CourseCard from "./CourseCard";
import { allCourseBySid } from "@/api/course";

export default {
  name: "Home",
  components: {
    CourseCard
  },
  data() {
    return {
      loading: false,
      courses: []
    };
  },
  // computed: {
  //   ...mapGetters(["name", "roles", "email", "number"])
  // },
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
