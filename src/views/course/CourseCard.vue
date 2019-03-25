<template>
  <div class="card">
    <el-card shadow="hover">
      <div slot="header">
        <span class="text-overflow course-name">
          <span class="title-icon" :style="colorStyle[index%4]">
            <svg-icon icon-class="course-title"/>
          </span>
          课程名称课程名称课程名称{{index}}
        </span>
        <el-dropdown @command="handleCommand" :show-timeout="150" @visible-change="changeIcon">
          <el-button :icon="operateIcon" style="padding: 0" type="text">操作</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="update">修改课程</el-dropdown-item>
            <el-dropdown-item command="delete">删除课程</el-dropdown-item>
            <el-dropdown-item command="a">
              <router-link :to="'/homework?can='+index" tag="span">管理作业</router-link>
            </el-dropdown-item>
            <el-dropdown-item command="b">
              <router-link :to="'/student?can='+index" tag="span">管理学生</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button
        icon="el-icon-circle-plus-outline"
        style="float: right; padding: 0px 0"
        type="text"
        >操作</el-button>-->
      </div>
      <div class="body clearfix">
        <div class="left-body">介暂介暂无课程简介暂无课程简介123课程简介暂无课程简介123课程简介123456789</div>
        <!-- <div
        class="left-body"
        >暂无课程简介123</div>-->
        <div class="right-body">
          <router-link :to="'/homework?can='+index" tag="a">
            <span class="inner-icon" :style="colorStyle[index%4]">
              <svg-icon icon-class="homework"/>
            </span> 作业：2/3
          </router-link>
          <router-link :to="'/student?can='+index" tag="a">
            <span class="inner-icon" :style="colorStyle[index%4]">
              <svg-icon icon-class="student"/>
            </span> 学生：30
          </router-link>
          <!-- <div class="textitem">
          <span :style="colorStyle[index%4]"><svg-icon icon-class="student"/></span> 学生：30
          </div>-->
        </div>
      </div>
    </el-card>
    <el-dialog title="添加课程" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="课程描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CourseCard",
  props: {
    data: Array, //传入的数据需为数组,
    index: Number
  },
  data() {
    return {
      operateIcon: "el-icon-circle-plus-outline",
      dialogFormVisible: false,
      form: {
        name: "",
        desc: ""
      },
      formLabelWidth: "120px",
      colorStyle: [
        {
          color: "#30BA78"
        },
        {
          color: "#30DECE"
          // color: "#4BA2FC"
        },
        {
          color: "YellowGreen"
        },
        {
          color: "SlateBlue"
        }
      ]
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "update":
          this.dialogFormVisible = true;
          break;
        case "delete":
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$message.success("删除成功!");
              // this.$message({
              //   type: "success",
              //   message: "删除成功!"
              // });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          break;

        default:
          break;
      }
      // this.$message("click on item " + command);
    },
    changeIcon(bool) {
      if (bool) {
        //下拉菜单显示
        this.operateIcon = "el-icon-remove-outline";
      } else {
        //下拉菜单隐藏
        this.operateIcon = "el-icon-circle-plus-outline";
      }
    },
    handleAdd() {
      this.dialogFormVisible = false;
      this.$message.success("删除成功!");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  .el-card {
    border: 1px solid #dbdfe6;
    background-color: #fcfeff;
  }
  .course-name {
    margin-bottom: -4px;
    width: calc(100% - 60px);
    display: inline-block;
    .title-icon {
      margin-left: -1px;
      margin-right: 8px;
      color: #409eff;
    }
  }
  .body {
    height: 72px;
    position: relative;
    .left-body {
      display: inline-block;
      max-width: 60%;
      max-height: 72px;
      overflow: hidden;
      color: #666666;
      font-size: 12px;
      line-height: 18px;
      text-align: center;
      position: absolute;
      top: 50%;
      // right: 0;
      transform: translateY(-50%);
    }
    .right-body {
      display: inline-block;
      font-size: 14px;
      color: #444444;
      min-width: 102px;
      width: 39%;
      line-height: 28px;
      padding-left: 10%;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      a {
        display: block;
        &:hover {
          color: #409eff;
        }
        .inner-icon {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
