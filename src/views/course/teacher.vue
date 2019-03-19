<template>
  <div class="course-container">
    <h3>全部课程</h3>
    <div class="course">
      <el-row :gutter="24">

        <el-col v-for="i in 5" :key="i" :xs="24" :sm="12" :md="8">
          <courseCard :index=i :key="i"></courseCard>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="8">
          <courseCard></courseCard>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <courseCard></courseCard>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CourseCard from "./CourseCard";

export default {
  // name: "CTeacher",
  components: {
    CourseCard
  },
  computed: {
    ...mapGetters(["name", "roles", "email", "number"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.course-container {
  margin: 30px;
  .el-col{
    margin-bottom:24px; 
  }
  // .course-name {
  //   // min-width: 196px;
  //   // margin-left: 4px;
  //   margin-bottom: -4px;
  //   width: calc(100% - 70px);
  //   white-space: nowrap;
  //   display: inline-block;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   .title-icon {
  //     margin-right: 4px;
  //     color: #409eff;
  //   }
  // }

}
</style>
