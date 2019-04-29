<template>
  <el-form
    v-else
    ref="registerForm"
    :model="registerForm"
    :rules="registerRules"
    label-position="left"
  >
    <h3 class="title"><svg-icon icon-class="logo"/>注册</h3>

    <el-form-item prop="email">
      <span class="svg-container">
        <svg-icon icon-class="email"/>
      </span>
      <el-input
        auto-complete="on"
        clearable
        v-model.trim="registerForm.email"
        name="email"
        type="text"
        placeholder="邮箱"
      />
    </el-form-item>
    <el-form-item prop="verifyCode" class="code">
      <span class="svg-container">
        <svg-icon icon-class="verify"/>
      </span>
      <el-input
        clearable
        v-model.trim="registerForm.verifyCode"
        name="verifyCode"
        type="text"
        placeholder="验证码"
      />
      <el-button :disabled="!(isEmail&&btnControll)" @click="getVCode" class="get-btn">{{getBtn}}</el-button>
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
      <span class="show-pwd" @mousedown="pwdType='text'" @mouseup="pwdType='password'">
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
import { register, isExist, sendVCode } from "@/api/register";
// import Cookies from "js-cookie";
import md5 from "blueimp-md5";

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
      getBtn: "获取",
      btnControll: true, // 控制“获取”按钮禁用状态
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  computed: {
    isEmail() {
      // 根据email值的变化返回bool值
      return isvalidEmail(this.registerForm.email);
    }
  },
  methods: {
    sendEmail() {
      sendVCode(this.registerForm.email)
        .then(res => {
          this.$message.success(res.message);
          // const data = res.data
          // console.log("res:", res);
          localStorage.setItem("code", res.data.vcode + res.data.email);
          localStorage.setItem("time", res.data.lasttime);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    getVCode() {
      isExist(this.registerForm.email).then(res => {
        if (res.message == "true") {
          this.$message.warning("此邮箱已被注册啦！请更换邮箱");
        } else {
          this.$message.info(
            "验证码将发送至您的邮箱：" + this.registerForm.email
          );
          this.sendEmail(); //调用发邮件

          this.btnControll = false; // 禁用按钮

          let num = 60; //num 60s秒倒计时
          const timeId = setInterval(() => {
            //使用箭头函数避免this问题
            this.getBtn = `${--num}s`;
            if (num == 0) {
              clearInterval(timeId);
              this.getBtn = "重新获取";
              this.btnControll = true; // 恢复按钮可用
            }
          }, 1000);
        }
      });
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    judgeVCode() {
      let time = localStorage.getItem("time");
      if (!time) {
        this.$message.error("验证码不正确");
        return false;
      }
      if (
        md5(this.registerForm.verifyCode) + this.registerForm.email ===
        localStorage.getItem("code")
      ) {
        if (new Date().getTime() < time) {
          // this.$message.success("验证码正确");
          return true;
        } else {
          this.$message.error("验证码失效啦！请重新获取");
          return false;
        }
      } else {
        this.$message.error("验证码不正确！");
        return false;
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          //判断邮箱是否存在
          isExist(this.registerForm.email).then(res => {
            if (res.message == "true") {
              this.$message.warning("此邮箱已被注册啦！请更换邮箱");
              return;
              //邮箱不存在，再判断验证码
            } else if (this.judgeVCode()) {
              // } else if (true) {
              //test 验证通过
              //所有验证完成，进行注册
              this.loading = true;
              register(this.registerForm.email, this.registerForm.password)
                .then(res => {
                  this.loading = false;
                  // console.log("res:", res);
                  if (res.code == 20000) {
                    //只有注册成功才跳转
                    this.$message.success(res.message);
                    //自动跳转到登录
                    const tid = setTimeout(() => {
                      this.$router.push({
                        path: "/login",
                        query: { email: this.registerForm.email }
                      });
                      clearTimeout(tid);
                    }, 1600);
                  }
                })
                .catch(error => {
                  this.loading = false;
                  this.$message.error(error + " 注册失败");
                });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$light: #c0c4cc;
$gray: rgba(175, 175, 175, 0.6);
$blue: #409eff;
.code {
  width: calc(100% - 110px);
}
.get-btn {
  position: absolute;
  width: 98px;
  top: 3px;
  right: -110px;
  background: transparent;
  border-color: $light;
  color: $light;
  &:hover {
    color: #b3d8ff;
    border-color: #b3d8ff;
  }
}
.el-button:active {
  color: $blue;
  border-color: $blue;
  outline: 0;
}
.el-button.is-disabled {
  color: $gray;
  background-color: transparent;
  border-color: $gray;
}
.el-button.is-disabled:hover {
  color: $gray;
  background-color: transparent;
  border-color: $gray;
}
</style>
