<template>
  <div class="box-container">
    <canvas id="bg-particles" width="100%" height="100%"></canvas>
    <transition name="scale-transform" appear>
      <div class="panel">
        <!-- <transition enter-active-class="animated slideInLeft" mode="out-in"> -->
        <transition name="fade-right" mode="out-in">
          <el-form
            v-if="!isRegister"
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            auto-complete="on"
            label-position="left"
          >
            <h3 class="title"><svg-icon icon-class="logo"/><span>作业管理系统</span></h3>
            <div style="margin-top: 20px">
              <el-radio-group v-model="loginForm.role">
                <el-radio-button v-waves label="student">学生</el-radio-button>
                <el-radio-button v-waves label="teacher">教师</el-radio-button>
              </el-radio-group>
            </div>
            <el-form-item v-if="loginForm.role === 'student'" prop="studentId">
              <span class="svg-container">
                <svg-icon icon-class="user"/>
              </span>
              <el-input
                clearable
                auto-complete="on"
                v-model.trim="loginForm.studentId"
                name="studentId"
                type="text"
                placeholder="学号"
              />
            </el-form-item>
            <el-form-item v-else prop="email">
              <span class="svg-container">
                <svg-icon icon-class="email"/>
              </span>
              <el-input
                clearable
                auto-complete="on"
                v-model.trim="loginForm.email"
                name="email"
                type="text"
                placeholder="邮箱账号"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password"/>
              </span>
              <el-input
                :type="pwdType"
                auto-complete="on"
                v-model="loginForm.password"
                name="password"
                placeholder="密码"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @mousedown="pwdType=''" @mouseup="pwdType='password'">
                <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin"
              >登&nbsp;&nbsp;录</el-button>
            </el-form-item>

            <div class="tips">
              <transition enter-active-class="animated zoomIn" appear>
                <router-link
                  v-if="loginForm.role === 'teacher'"
                  to="/register"
                  class="link"
                >无账号？前往注册</router-link>
              </transition>
            </div>
          </el-form>
          <RegisterForm v-else></RegisterForm>
        </transition>
      </div>
    </transition>
    <br>
    <Copyright></Copyright>
  </div>
</template>

<script>
import { isvalidStudentID, isvalidEmail } from "@/utils/validate";
import RegisterForm from "./RegisterForm.vue";
import Copyright from "@/components/Copyright";
import particles from "@/utils/particles";
import waves from "@/directive/waves/index.js"; // 水波纹指令
export default {
  name: "Login",
  components: {
    RegisterForm,
    Copyright
  },
  directives: {
    waves
  },
  data() {
    const validateStudentId = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("学号不能为空"));
      } else if (!isvalidStudentID(value)) {
        callback(new Error("请输入10位学号"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("账号不能为空"));
      } else if (!isvalidEmail(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      isRegister: false,
      loginForm: {
        studentId: "",
        email: "",
        password: "",
        role: ""
      },
      loginRules: {
        studentId: [
          { required: true, trigger: "blur", validator: validateStudentId }
        ],
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
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
        this.loginForm.email = route.query.email || "";
        if (route.path == "/register") {
          this.isRegister = true;
          this.loginForm.role = "teacher";
        } else {
          this.isRegister = false;
        }
      },
      immediate: true
    },
    "loginForm.role": function(val, old) {
      this.resetForm();
      if (val === "teacher") {
        localStorage.setItem("user", "teacher");
      } else {
        localStorage.setItem("user", "student");
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
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
    this.loginForm.role = localStorage.getItem("user") || "student";
    this.$nextTick(() => {
      particles();
    });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$light_gray: #eee;
$dark_gray: #889aa4;
.box-container {
  /* reset element-ui css */
  .el-radio-group {
    width: 100%;
    margin-bottom: 22px;
    .el-radio-button {
      width: 50%;
      .el-radio-button__inner {
        width: 100%;
      }
    }
  }
  .el-radio-button__inner {
    background: rgb(236, 236, 236);
  }
  .el-input {
    vertical-align: middle;
    display: inline-block;
    width: calc(100% - 35px);
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      &:-webkit-autofill {
        -webkit-text-fill-color: #fff !important;
        transition-delay: 99999s;
        transition: color 99999s ease-out,
        background-color 99999s ease-out;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(200, 200, 200, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    .el-form-item__error {
      color: #ff4343;
    }
  }
  .panel {
    /*public css(login and register), no scoped*/
    .tips {
      font-size: 14px;
      color: #409eff;
      text-align: center;
      .link:hover {
        // cursor: pointer;
        color: $light_gray;
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
      font-size: 24px;
      font-weight: normal;
      color: $light_gray;
      margin: 0px auto 28px;
      text-align: center;
      .svg-icon{
        margin-right: 10px;
      }
      span{
      font-size: 22px;

      }
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
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$light_gray: #eee;
@keyframes bgcolor-change {
  0% {
    background: #292e49;
  }
  25% {
    background: #0f5867;
  }
  50% {
    background: #174266;
  }
  75% {
    background: #444f5a;
  }
  100% {
    background: #292e49;
  }
}
.box-container {
  min-height: 100%;
  width: 100%;
  animation: bgcolor-change 15s linear infinite;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  #bg-particles {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .panel {
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 20px;
    width: 420px;
    max-width: 100%;
    .el-radio-group {
      label {
        overflow: hidden;
      }
    }
  }
}
</style>
