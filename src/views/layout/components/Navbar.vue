<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb/>
    <el-dropdown class="avatar-container" :show-timeout="100" @visible-change="changeIcon">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <span class="username" v-if="name!='null'">&nbsp;{{name}}</span>
        <span class="username" v-else>&nbsp;{{email}}</span>
        <span class="username" ><i :class="dropdownIcon"/></span>
        
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item disabled>
          <div v-if="roles.includes('admin')" class="role" style="color: #FEDB25;border: 2px solid #FEDB25;">管理员</div>
          <div v-else-if="roles.includes('teacher')" class="role" style="color: #64d9d6;border: 2px solid #64d9d6;">教师</div>
          <div v-else-if="roles.includes('student')" class="role" style="color: #8cc4ff;border: 2px solid #8cc4ff;">学生</div>
          <div class="dropdown-username">{{name}}</div>
        </el-dropdown-item>
        <router-link to="/profile">
          <el-dropdown-item divided>
            <svg-icon icon-class="profile"/>&nbsp;&nbsp;个人中心
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">
            <svg-icon icon-class="logout"/>&nbsp;&nbsp;退出登录
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dropdownIcon:'el-icon-caret-bottom'
    }
  },
  computed: {
    ...mapGetters(["name", "email", "sidebar", "avatar", "roles"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    changeIcon(bool) {
      if (bool) {
        //下拉菜单显示
        this.dropdownIcon = "el-icon-caret-top";
      } else {
        //下拉菜单隐藏
        this.dropdownIcon = "el-icon-caret-bottom";
      }
    },
    logout() {
      // this.$store.dispatch('LogOut').then(() => {
      this.$store.dispatch("FedLogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  }
};
</script>
<style lang="scss">
.role {
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  color: #8cc4ff;
  border: 3px solid #8cc4ff;
  line-height: 22px;
  text-align: center;
  padding: 0px 12px;
  border-radius: 24px;
}
.dropdown-username {
  text-align: center;
  margin-bottom: -6px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: relative;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
      .username {
        display: inline-block;
        vertical-align: top;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>

