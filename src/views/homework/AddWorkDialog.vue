<template>
  <!-- <div> -->
  <!-- 类my-dialog宽度做了响应式,所以加上此类名 -->
  <el-dialog
    custom-class="my-dialog"
    width="40%"
    top="8vh"
    title="添加作业 - 设置信息"
    :visible.sync="dialogShow"
    @closed="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="addWorkForm" size="medium" label-width="100px">
      <el-form-item label="作业名称：" prop="name">
        <el-input clearable maxlength="20" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="开放时间：" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions0"
          :default-value="new Date()"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关闭时间：" prop="closeTime">
        <el-date-picker
          v-model="form.closeTime"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions0"
          default-time="23:59:59"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label-width="156px" label="作业允许提交次数：" prop="maxSubmit">
        <el-input-number v-model="form.maxSubmit" :min="1" :max="9"></el-input-number>
      </el-form-item>
      <el-form-item label-width="170px" label="作业关闭后答案可见：">
        <el-switch v-model="form.showAnswer"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
  <!-- </div> -->
</template>
<script>
import { addWork, addQuestion, addWQ, addAnswer } from "@/api/homework";
export default {
  name: "AddWorkDialog",
  props: {
    courseId: Number,
    suggestName: String,
    quesCount: Number,
    dialogVisible: {
      type: Boolean,
      default: false
    },
    typeOne: Object,
    typeTwo: Object,
    typeThree: Object,
    typeFour: Object
  },
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择开放时间"));
      } else if (this.form.closeTime && value >= this.form.closeTime) {
        callback(new Error("开放时间必须早于关闭时间"));
      } else {
        callback();
      }
    };
    const validateCloseTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择关闭时间"));
      } else if (value <= this.form.startTime) {
        callback(new Error("关闭时间必须晚于开放时间"));
      } else if (value <= new Date()) {
        callback(new Error("关闭时间必须晚于当前时间"));
      } else {
        callback();
      }
    };
    return {
      questions: [],
      answers: [],
      newWorkId: "", //新添加的作业的id
      w_q: [],
      form: {
        name: this.suggestName + "(无习题)",
        startTime: "",
        closeTime: "",
        showAnswer: true,
        maxSubmit: 1
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天
        },
        selectableRange: '2019-04-10 12:00:00-2019-04-14 22:00:00'
        

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
        startTime: [
          { required: true, trigger: "change", validator: validateStartTime }
        ],
        closeTime: [
          { required: true, trigger: "change", validator: validateCloseTime }
        ],
        maxSubmit: [
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
        //对话框显示
        this.form.startTime = new Date(); //设置默认开放时间

        this.questions.splice(0, this.questions.length); //清空原数组
        this.answers.splice(0, this.answers.length); //清空原数组
        this.forEachQuestion(this.typeOne, "a");
        this.forEachQuestion(this.typeTwo, "b");
        this.forEachQuestion(this.typeThree, "c");
        this.forEachQuestion(this.typeFour, "d");

        console.log("遍历完了");
      }
    },
    quesCount(val) {
      this.form.name = this.suggestName + "(共" + val + "题)";
    }
  },
  methods: {
    /**
     * @param obj 要遍历的问题对象
     * @param type a:单选，b:多选，c:判断，d:填空
     */
    forEachQuestion(obj, type) {
      const tid = this.$store.getters.id.substring(0, 3).padStart(3, "0"); //将教师id变为3位字符串（暂时考虑3位）

      obj.questions.forEach(item => {
        let number = tid + item.key; //3+13=16位字符串作为唯一问题编号（目前暂时采用）
        this.questions.push({
          number,
          type,
          title: item.title,
          desc: item.desc
        });
        item.options.forEach(i => {
          this.answers.push({
            number,
            content: i.content,
            correct: i.isRight ? "yes" : "no"
          });
        });
      });
    },
    handleClose() {
      //移除校验结果并重置表单为初始值
      this.$refs.addWorkForm.resetFields();
    },
    handleAdd() {
      this.$refs.addWorkForm.validate(valid => {
        if (valid) {
          this.dialogShow = false;
          const loading = this.$loading({
            lock: true,
            text: "正在添加...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.6)"
          });
          addWork(
            this.courseId,
            this.form.name,
            this.form.startTime,
            this.form.closeTime,
            this.form.showAnswer,
            this.form.maxSubmit
          )
            .then(res => {
              loading.text = "1/4 作业信息添加成功";
              if (res.data.wid) {
                this.newWorkId = res.data.wid;
              } else {
                throw "作业ID获取失败";
              }
              return addQuestion(this.questions);
            })
            .then(res => {
              loading.text = "2/4 习题题目添加成功";
              this.questions.forEach(i => {
                this.w_q.push({ wid: this.newWorkId, qnumber: i.number });
              });
              return addAnswer(this.answers);
            })
            .then(res => {
              loading.text = "3/4 习题答案添加成功";
              return addWQ(this.w_q);
            })
            .then(res => {
              loading.text = "4/4 作业习题添加成功";
              loading.close();
              this.$message.success("作业添加成功!");
              this.$emit("back");
            })
            .catch(error => {
              loading.close();
              this.$message.error(error + " 添加失败");
              this.$emit("back");
            });
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

</style>

<style lang="scss" scoped>
</style>


