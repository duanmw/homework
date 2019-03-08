<template>
  <el-form
    v-else
    ref="registerForm"
    :model="registerForm"
    :rules="registerRules"
    label-position="left"
  >
    <h3 class="title">vue-Rigister</h3>

    <el-form-item prop="email">
      <span class="svg-container">
        <svg-icon icon-class="email"/>
      </span>
      <el-input clearable v-model="registerForm.email" name="email" type="text" placeholder="邮箱"/>
    </el-form-item>
    <el-form-item prop="verifyCode" class="code">
      <span class="svg-container">
        <svg-icon icon-class="verify"/>
      </span>
      <el-input
        clearable
        v-model="registerForm.verifyCode"
        name="verifyCode"
        type="text"
        placeholder="验证码"
      />
      <el-button plain class="get-btn">获取</el-button>
    </el-form-item>
    <el-form-item prop="password">
      <span class="svg-container">
        <svg-icon icon-class="password"/>
      </span>
      <el-input
        :type="pwdType"
        v-model="registerForm.password"
        name="password"
        placeholder="密码"
        @keyup.enter.native="handleRegister"
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
        @click.native.prevent="handleRegister"
      >注 册</el-button>
    </el-form-item>
    <div class="tips">
      <router-link to="/login" class="link">已有账号？前往登录</router-link>
    </div>
  </el-form>
</template>
<script>
import { isvalidEmail, isvalidVerifyCode } from "@/utils/validate";
export default {
  name: "RegisterForm",
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("邮箱不能为空"));
      } else if (!isvalidEmail(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    const validateVCode = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("验证码不能为空"));
      } else if (!isvalidVerifyCode(value)) {
        callback(new Error("请输入6位数字验证码"));
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
    return {
      registerForm: {
        email: "",
        verifyCode: "",
        password: ""
      },
      registerRules: {
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        verifyCode: [
          { required: true, trigger: "blur", validator: validateVCode }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
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
  }
};
</script>
<style lang="scss" scoped>
$light: rgba(236, 236, 236, 0.9);
$blue: rgba(64, 158, 255, 0.9);
.code {
  width: calc(100% - 80px);
}
.get-btn {
  position: absolute;
  top: 3px;
  right: -80px;
  background: transparent;
  border-color: $light;
  color: $light;
}
.el-button.is-plain:focus {
  background: transparent;
  border-color: $light;
  color: $light;
}
.el-button.is-plain:hover {
  background: transparent;
  border-color: $blue;
  color: $blue;
}
</style>
