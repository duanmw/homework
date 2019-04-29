<template>
  <div class="profile-container" v-loading="loading">
    <el-row>
      <div class="info-text">基本信息</div>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="4">
        <div class="left-wrapper">
          <img @dblclick="handleClick" :src="avatar" class="user-avatar">
          <div class="info-text">
            <div
              v-if="roles.includes('admin')"
              class="profile-role"
              style="color: #FEDB25;border: 2px solid #FEDB25;"
            >管理员</div>
            <div
              @click="handleUpgradeAdmin"
              v-else-if="roles.includes('teacher')"
              class="profile-role"
              style="color: #00cff7;border: 2px solid #00cff7;"
            >教师</div>
            <div
              v-else-if="roles.includes('student')"
              class="profile-role"
              style="color: #6AB4FF;border: 2px solid #6AB4FF;"
            >学生</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="20">
        <div class="info-text">账号：{{ email?email:number }}</div>
        <div class="info-text">
          用户名：
          <template v-if="edit">
            <el-input
              v-model.trim="form.name"
              minlength="2"
              maxlength="10"
              class="edit-input"
              size="small"
            />
          </template>
          <template v-else>
            <span class="null-name" v-if="name=='null'">null</span>
            <span v-else>{{ name }}</span>
          </template>
          <el-button
            v-if="roles.includes('teacher') && !edit"
            size="small"
            @click="edit = true;form.name=name"
            style="margin-left:12px"
          >{{name==""||name=="null"?'设置': '修改'}}</el-button>
          <el-button
            v-if="edit"
            type="success"
            size="small"
            icon="el-icon-circle-check"
            @click="confirmEdit()"
          >确定</el-button>
          <el-button
            v-if="edit"
            class="cancel-btn"
            size="small"
            icon="el-icon-circle-close"
            type="warning"
            @click="cancelEdit()"
          >取消</el-button>
        </div>
        <div v-if="number" class="info-text">班级：{{ classname }}</div>
        <el-button size="medium" @click="dialogFormVisible = true" plain type="primary">修改密码</el-button>
      </el-col>
    </el-row>

    <el-dialog
      custom-class="my-dialog"
      title="修改密码"
      :visible.sync="dialogFormVisible"
      @closed="handleClose"
    >
      <el-form size="medium" :model="form" :rules="rules" ref="updatePwdForm" label-width="94px">
        <el-form-item label="旧密码：" prop="oldPwd">
          <el-input type="password" clearable v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPwd">
          <el-input type="password" clearable v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="newPwd2">
          <el-input type="password" clearable v-model="form.newPwd2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updatePwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  updateName,
  rightOldPwd,
  updatePwd,
  upgradeAdmin
} from "@/api/teacher";
import {
  rightOldPwd as rightOldPwd2,
  updatePwd as updatePwd2
} from "@/api/student";
import { getOneStudent } from "@/api/student";

import md5 from "blueimp-md5";
import store from "@/store";
export default {
  name: "Profile",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("密码不小于6位"));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请再次输入新密码"));
      } else if (value != this.form.newPwd) {
        callback(new Error("与上次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      edit: false,
      dialogFormVisible: false,
      classname: "", //若为学生，则有班级名
      form: {
        name: this.name,
        oldPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      rules: {
        oldPwd: [{ required: true, trigger: "blur", validator: validatePass }],
        newPwd: [{ required: true, trigger: "blur", validator: validatePass }],
        newPwd2: [{ required: true, trigger: "blur", validator: validatePass2 }]
      },
      clickNum: 0
    };
  },
  computed: {
    ...mapGetters(["id", "avatar", "name", "roles", "email", "number"])
  },
  methods: {
    handleClick() {
      if (this.roles.includes("teacher")) {
        this.$store.dispatch("ToggleTheme");
      }
    },
    confirmEdit() {
      if (this.form.name.length <= 0) {
        this.$message.warning("用户名不能为空！");
      } else if (this.form.name == "null") {
        this.$message.warning("用户名不能设为null！");
      } else {
        this.loading = true;
        updateName(this.form.name, this.id)
          .then(res => {
            this.edit = false;
            this.loading = false;
            this.$message.success("更新成功！");
            const tid =
              this.id +
              "|" +
              this.email +
              "|" +
              this.form.name +
              "|" +
              this.roles;
            sessionStorage.setItem("hmw", md5("hmw" + tid)); //更新sessionStorage里的值
            sessionStorage.setItem("hmwid", tid); //更新后页面刷新，值也不会变
            store.commit("SET_NAME", this.form.name); //设置vuex里name
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err + " 更新失败！");
          });
      }
    },
    cancelEdit() {
      this.form.name = this.name;
      this.edit = false;
    },
    handleClose() {
      //移除校验结果并重置表单为初始值
      this.$refs.updatePwdForm.resetFields();
    },
    updatePwd() {
      this.$refs.updatePwdForm.validate(valid => {
        if (valid) {
          let valFunc = "";
          let updateFunc = "";
          if (this.roles.includes("teacher")) {
            valFunc = rightOldPwd;
            updateFunc = updatePwd;
          } else {
            valFunc = rightOldPwd2;
            updateFunc = updatePwd2;
          }
          valFunc(md5(this.form.oldPwd), this.id)
            .then(res => {
              if (res.message == "true") {
                //旧密码正确
                this.dialogFormVisible = false;
                this.loading = true;
                return updateFunc(md5(this.form.newPwd2), this.id);
              } else {
                throw "旧密码输入错误";
              }
            })
            .then(res => {
              this.loading = false;
              this.$message.success("密码修改成功！");
              // this.$store.dispatch("FedLogOut").then(() => {
              store
                .dispatch("FedLogOut")
                .then(() => {
                  //前端登出（sessionStorage被清除）
                  setTimeout(() => {
                    location.reload(); // 刷新发现sessionStorage无数据，重定向到登录页
                  }, 2000);
                })
                .then(() => {
                  this.$notify({
                    type: "success",
                    title: "密码修改成功",
                    // duration: 5000,
                    message: "请使用新密码重新登录"
                  });
                });
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err + " 密码修改失败！");
            });
        }
      });
    },
    handleUpgradeAdmin() {
      if (this.clickNum <= 0) {
        setTimeout(() => {
          if (this.clickNum >= 4) {
            //1s内点击4次即可
            this.$prompt("若要升级管理员，请输入升级码", "提示", {
              closeOnClickModal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPattern: /^i don't know$/, //升级码
              inputErrorMessage: "升级码不正确"
            })
              .then(({ value }) => {
                return upgradeAdmin(this.id);
              })
              .then(res => {
                this.$message.success("升级成功，重新登录即可");
              })
              .catch(() => {});
          }
        }, 1000);
      }
      this.clickNum++;
    }
  },
  created() {
    if (this.number) {
      getOneStudent(this.id)
        .then(res => {
          this.classname = res.data.student.classname;
        })
        .catch(err => {
          this.$message.error(err + " 数据获取失败");
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.profile-container {
  margin: 40px;
  // text-align: center;
  .null-name {
    color: #c0c4cc;
  }
  .left-wrapper {
    display: inline-block;
    text-align: center;
  }
  .profile-role {
    display: inline-block;
    font-size: 16px;
    color: #8cc4ff;
    border: 2px solid #8cc4ff;
    line-height: 22px;
    text-align: center;
    padding: 0px 14px;
    border-radius: 6px;
    margin-top: 4px;
  }
  h3 {
    color: #333333;
    font-size: 22px;
    font-weight: 400;
  }
  .user-avatar {
    display: inline-block;
    height: 80px;
    width: 80px;
    border-radius: 50px;
    margin-bottom: 8px;
  }

  .info-text {
    color: #333333;
    padding-bottom: 24px;
    font-size: 18px;
    .edit-input {
      width: 140px;
      margin-right: 8px;
    }
  }
}
</style>
