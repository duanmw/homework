<template>
  <div class="dashboard-container">
    <h3>laoshi</h3>
    <div class="dashboard-text">
      <countTo :startVal="startVal" :endVal="endVal" :duration="2000"></countTo>
    </div>
    <div class="course">
      <el-row :gutter="24"></el-row>
      <!-- <transition-group name="fade-up" tag="div" appear>
        <span v-for="item in items" v-bind:key="item" class="list-complete-item">{{ item }}</span>
      </transition-group>-->
    </div>
    <div class="dashboard-text">name:{{ name=='null'? '': name }}</div>
    <div class="dashboard-text">email:{{ email }}</div>
    <div class="dashboard-text">number:{{ number }}</div>
    <div class="dashboard-text">
      roles:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import countTo from "vue-count-to"; //https://github.com/PanJiaChen/vue-countTo
export default {
  name: "Dashboard",
  components: {
    countTo
  },
  data() {
    return {
      startVal: 0,
      endVal: 27
    };
  },
  methods: {},
  computed: {
    ...mapGetters(["name", "roles", "email", "number"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  margin: 30px;
  .dashboard-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
