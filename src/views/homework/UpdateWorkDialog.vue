<template>
  <!-- 类my-dialog宽度做了响应式,所以加上此类名 -->
  <el-dialog
    custom-class="my-dialog"
    width="40%"
    top="8vh"
    title="修改作业信息"
    :visible.sync="dialogShow"
    @closed="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="updateWorkForm" size="medium" label-width="100px">
      <el-form-item label="作业名称：" prop="name">
        <el-input clearable maxlength="20" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="开放时间：" prop="starttime">
        <el-date-picker
          v-model="form.starttime"
          :readonly="form.opening"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions0"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关闭时间：" prop="closetime">
        <el-date-picker
          v-model="form.closetime"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions0"
          default-time="23:59:59"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label-width="156px" label="作业允许提交次数：" prop="maxsubmit">
        <el-input-number v-model="form.maxsubmit" :min="homework.maxsubmit" :max="9"></el-input-number>
      </el-form-item>
      <el-form-item label-width="170px" label="作业关闭后答案可见：">
        <el-switch v-model="form.showanswer"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleUpdate">确定修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addWork, addQuestion, addWQ, addAnswer } from "@/api/homework";
export default {
  name: "UpdateWorkDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    homework: Object
  },
  data() {
    const valiStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择开放时间"));
      } else if (this.form.closetime && value >= this.form.closetime) {
        callback(new Error("开放时间必须早于关闭时间"));
      } else {
        callback();
      }
    };
    const valiCloseTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择关闭时间"));
      } else if (value <= this.form.starttime) {
        // } else if (value <= new Date(this.form.starttime)) {
        callback(new Error("关闭时间必须晚于开放时间"));
      } else if (value <= new Date()) {
        callback(new Error("关闭时间必须晚于当前时间"));
      } else if (value < new Date(this.homework.closetime)) {
        //和原本的关闭时间作比较
        callback(new Error("关闭时间只能往后修改"));
      } else {
        console.log("验证通过-----");
        callback();
      }
    };
    return {
      form: {},
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天
        }
      },
      rules: {
        name: [
          { required: true, message: "作业名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "作业名长度在 2 到 20 个字符",
            trigger: "blur"
          }
        ],
        starttime: [
          { required: true, trigger: "change", validator: valiStartTime }
        ],
        closetime: [
          { required: true, trigger: "change", validator: valiCloseTime }
        ],
        maxsubmit: [
          {
            required: true,
            message: "提交次数不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit("closeDialog", newVal);
      }
    }
  },
  watch: {
    dialogShow(val) {
      if (val) {
        //对话框显示,重新设置表单值
        this.form = Object.assign({}, this.homework, {
          starttime: new Date(this.homework.starttime),
          closetime: new Date(this.homework.closetime)
        });
        if (this.homework.showanswer == "yes") {
          this.form.showanswer = true;
        } else if (this.homework.showanswer == "no") {
          this.form.showanswer = false;
        }

        // this.form.starttime=new Date(this.form.starttime)
        // this.form.closetime=new Date(this.form.closetime)

        if (new Date() < new Date(this.homework.starttime)) {
          //作业还未开放
          this.form.opening = false;
        } else {
          //作业开放中（已关闭情况不用考虑，因为禁用了按钮）
          this.form.opening = true;
        }
      }
    },
    homework(val) {
      // this.form=Object.assign({},val)
      // if (val.showanswer=='yes') {
      //   this.form.showanswer=true
      // }else if(val.showanswer=='no'){
      //   this.form.showanswer=false
      // }
    }
  },
  methods: {
    handleClose() {
      //移除校验结果并重置表单为初始值
      // this.$refs.updateWorkForm.resetFields();//使用这个导致change验证‘不及时’bug
      // 移除表单项的校验结果
      this.$refs.updateWorkForm.clearValidate();
    },
    handleUpdate() {
      this.$refs.updateWorkForm.validate(valid => {
        if (valid) {
          this.dialogShow = false;
          const loading = this.$loading({
            lock: true,
            text: "Loading...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.6)"
          });
          //   addWork(
          //     this.courseId,
          //     this.form.name,
          //     this.form.startTime,
          //     this.form.closeTime,
          //     this.form.showAnswer,
          //     this.form.maxSubmit
          //   )
          //     .then(res => {
          //       loading.text = "1/4 作业信息添加成功";
          //       if (res.data.wid) {
          //         this.newWorkId = res.data.wid;
          //       } else {
          //         throw "作业ID获取失败";
          //       }
          //       return addQuestion(this.questions);
          //     })
          //     .then(res => {
          //       loading.text = "4/4 作业习题添加成功";
          //       loading.close();
          //       this.$message.success("作业添加成功!");
          //       this.$emit("back");
          //     })
          //     .catch(error => {
          //       loading.close();
          //       this.$message.error(error + " 添加失败");
          //       this.$emit("back");
          //     });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.my-dialog {
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-input-number--medium {
    width: 100%;
  }
}
.el-loading-spinner .el-icon-loading {
  font-size: 26px;
}
</style>

<style lang="scss" scoped>
</style>


