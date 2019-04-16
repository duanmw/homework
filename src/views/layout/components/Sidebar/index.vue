<template>
  <div :class="['has-logo', isDark?'dark-theme':'light-theme']">
    <logo :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import variables from "@/styles/variables.scss";
import SidebarItem from "./SidebarItem";
import Logo from "./Logo";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routers", "sidebar", "roles", "darkTheme"]),
    // routes() {
    //   return this.$router.options.routes
    // },
    variables() {
      return variables;
    },
    isDark() {
      if (this.roles.includes("student")) {
        return false;
      } else {
        return this.darkTheme;
      }
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
