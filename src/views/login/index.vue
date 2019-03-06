<template>
  <div class="login-container">
    <canvas id="bg-particles" width="100%" height="100%"></canvas>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">vue-admin-template</h3>
      <div style="margin-top: 20px">
        <el-radio-group v-model="loginForm.role">
          <el-radio-button label="student">学生</el-radio-button>
          <el-radio-button label="teacher">教师</el-radio-button>
        </el-radio-group>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon :icon-class="loginForm.role === 'student' ? 'user' : 'email'"/>
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          :placeholder="loginForm.role === 'student' ? '学号' : 'email'"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
        <!-- <span class="show-pwd" @click="showPwd"> -->
        <span class="show-pwd" @mousedown="pwdType=''" @mouseup="pwdType='password'">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>

      <!-- <el-radio-group v-model="loginForm.role" size="mini">
        <el-radio label="student" border>学生</el-radio>
        <el-radio label="teacher" border>教师</el-radio>
      </el-radio-group>-->
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </el-form-item>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span>password: admin</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import particles from '@/utils/particles'

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      //验证方法在validate。js里
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        role: "student"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },

  created() {
    // console.log("--"+this.$route)
    particles()
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-radio-group {
    width: 100%;
    margin-bottom: 22px;
    .el-radio-button {
      width: 50%;
      .el-radio-button__inner {
        width: 100%;
        // background: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(200, 200, 200, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
@keyframes bgcolor-change {
  0% {
    background: #292e49;
  }
  25% {
    background: #0a3b67;
  }
  50% {
    background: #0f5867;
  }
  75% {
    background: #444f5a;
  }
  100% {
    background: #292e49;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  animation: bgcolor-change 12s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  #bg-particles {
    position: absolute;
    top: 0;
    // z-index: 0;
  }
  .login-form {
    position: relative;
    top: -10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 20px;
    width: 420px;
    // height: 380px;
    max-width: 100%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    text-align:center;
    // margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 4px 5px 4px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    // -webkit-user-select: none;
		// 	-moz-user-select: none;
		// 	-ms-user-select: none;
		// 	user-select: none;
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 26px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
