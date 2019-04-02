<template>
  <div class="add-question">
    <sticky :z-index="3">
      <div class="title-bar">
        <el-row>
          <el-col :xs="24" :sm="12">
            <router-link :to="{ name: 'Homework', params: { courseId,courseName }}" tag="span">
              <el-button size="small" icon="el-icon-back">返回</el-button>
            </router-link>
            <span class="classname">给课程：{{$route.params.courseName}} 添加作业习题</span>
          </el-col>
          <el-col :xs="24" :sm="12">
            单选:{{dynamicFormOne.questions.length}}&nbsp;
            多选:{{dynamicFormTwo.questions.length}}&nbsp;
            判断:{{dynamicFormTwo.questions.length}}&nbsp;
            填空:{{dynamicFormTwo.questions.length}}&nbsp;
            &nbsp;&nbsp;
            <el-button
              :disabled="courseName==''"
              size="medium"
              icon="el-icon-circle-check-outline"
              @click="handleAdd()"
            >完成添加</el-button>
          </el-col>
        </el-row>
      </div>
    </sticky>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="单选题" name="first">
        <div
          class="question-box"
          v-for="(question, index) in dynamicFormOne.questions"
          :key="question.key"
        >
          <span class="left-name">{{'单选题 ' + (index+1)}}</span>
          <div class="right-btn">
            <el-button
              size="small"
              type="primary"
              plain
              icon="el-icon-edit"
              @click.once="question.showDesc=true"
            >添加解析</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              icon="el-icon-delete"
              @click.prevent="removeOne('a',question)"
            >删除</el-button>
          </div>
          <el-input
            type="textarea"
            maxlength="300"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入题目"
            v-model="question.title"
          ></el-input>
          <el-input
            v-if="question.showDesc"
            type="textarea"
            maxlength="300"
            :autosize="{ minRows: 1, maxRows: 4}"
            placeholder="请输入答案解析（选填）"
            v-model="question.desc"
          ></el-input>
          <el-row :gutter="12">
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[0].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,0)"
                label="正确选项"
                v-model="question.options[0].isRight"
              ></el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[1].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,1)"
                label="正确选项"
                v-model="question.options[1].isRight"
              ></el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[2].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,2)"
                label="正确选项"
                v-model="question.options[2].isRight"
              ></el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[3].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,3)"
                label="正确选项"
                v-model="question.options[3].isRight"
              ></el-checkbox>
            </el-col>
          </el-row>
        </div>
        <el-button
          :disabled="courseName==''"
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="addOneQ('a')"
        >添加题目</el-button>
      </el-tab-pane>
      <el-tab-pane label="多选题" name="second">
        <div
          class="question-box"
          v-for="(question, index) in dynamicFormTwo.questions"
          :key="question.key"
        >
          <span class="left-name">{{'多选题 ' + (index+1)}}</span>
          <div class="right-btn">
            <el-button
              size="small"
              type="primary"
              plain
              icon="el-icon-edit"
              @click.once="question.showDesc=true"
            >添加解析</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              icon="el-icon-delete"
              @click.prevent="removeOne('b',question)"
            >删除</el-button>
          </div>
          <el-input
            type="textarea"
            maxlength="300"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入题目"
            v-model="question.title"
          ></el-input>
          <el-input
            v-if="question.showDesc"
            type="textarea"
            maxlength="300"
            :autosize="{ minRows: 1, maxRows: 4}"
            placeholder="请输入答案解析（选填）"
            v-model="question.desc"
          ></el-input>
          <el-row :gutter="12">
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[0].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,0,false)"
                label="正确选项"
                v-model="question.options[0].isRight"
              ></el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[1].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,1,false)"
                label="正确选项"
                v-model="question.options[1].isRight"
              ></el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[2].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,2,false)"
                label="正确选项"
                v-model="question.options[2].isRight"
              ></el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-input
                size="medium"
                clearable
                maxlength="300"
                v-model="question.options[3].content"
                placeholder="选项内容"
              ></el-input>
              <el-checkbox
                @click.prevent.native="setOnlyOneCheckbox(question,3,false)"
                label="正确选项"
                v-model="question.options[3].isRight"
              ></el-checkbox>
            </el-col>
          </el-row>
        </div>
        <el-button size="medium" type="primary" icon="el-icon-plus" @click="addOneQ('b')">添加题目</el-button>
      </el-tab-pane>
      <el-tab-pane label="判断题" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="填空题" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky";
export default {
  name: "AddQuestion",
  components: {
    Sticky
  },
  data() {
    return {
      activeName: "first",
      courseId: "",
      courseName: "",
      showDot: [false, false, false, false],
      qObj: {
        showDesc: false,
        title: "",
        desc: "",
        options: [
          { content: "", isRight: false },
          { content: "", isRight: false },
          { content: "", isRight: false },
          { content: "", isRight: false }
        ]
      },
      dynamicFormOne: {
        questions: []
      },
      dynamicFormTwo: {
        questions: []
      },
      dynamicFormThree: {
        questions: []
      },
      dynamicFormFour: {
        questions: []
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    setOnlyOneCheckbox(ques, index, onlyOne = true) {
      if (ques.options[index].content == "") {
        this.$message.warning("请先输入选项内容再设置！");
      } else {
        ques.options[index].isRight = !ques.options[index].isRight; //设置点击项选中或取消
        if (onlyOne) {
          //只选一项
          let arr = [0, 1, 2, 3];
          arr.splice(arr.indexOf(index), 1);
          arr.forEach(i => {
            ques.options[i].isRight = false; //其他项均不选中
          });
        }
      }
    },
    validateFormOne() {
      return this.dynamicFormOne.questions.every(item => {
        if (item.title != "") {
          let rightCount = 0;
          for (let i = 0; i < item.options.length; i++) {
            if (item.options[i].content != "") {
              if (item.options[i].isRight) {
                rightCount++;
              }
            } else {
              this.$message.warning("存在单选题选项内容为空情况！");
              return false;
            }
          }
          if (rightCount == 0) {
            this.$message.warning("存在单选题未设置正确选项！请检查");
            return false;
          } else {
            return true;
          }
        } else {
          this.$message.warning("存在单选题题目为空情况！请检查");
          return false;
        }
      });
    },
    validateFormTwo() {
      return this.dynamicFormTwo.questions.every(item => {
        if (item.title != "") {
          let rightCount = 0;
          for (let i = 0; i < item.options.length; i++) {
            if (item.options[i].content != "") {
              if (item.options[i].isRight) {
                rightCount++;
              }
            } else {
              this.$message.warning("存在多选题选项内容为空情况！");
              return false;
            }
          }
          if (rightCount == 0) {
            this.$message.warning("存在多选题未设置正确选项！请检查");
            return false;
          } else if (rightCount <= 1) {
            this.$message.warning("多选题至少设置2个正确选项！请检查");
            return false;
          } else {
            return true;
          }
        } else {
          this.$message.warning("存在多选题题目为空情况！请检查");
          return false;
        }
      });
    },
    handleAdd() {
      if (this.validateFormOne()) {
        this.validateFormTwo();
      } else {
        this.activeName = "first";
      }
    },
    addOneQ(type) {
      switch (type) {
        case "a":
          if (this.validateFormOne()) {
            let obj = Object.assign({}, JSON.parse(JSON.stringify(this.qObj)), {
              key: "" + Date.now()
            }); //利用JSON.parse深拷贝,再向新对象{}里合并
            this.dynamicFormOne.questions.push(obj);
          }
          break;
        case "b":
          if (this.validateFormTwo()) {
            let obj = Object.assign({}, JSON.parse(JSON.stringify(this.qObj)), {
              key: "" + Date.now()
            }); //利用JSON.parse深拷贝,再向新对象{}里合并
            this.dynamicFormTwo.questions.push(obj);
          }
          break;
        case "c":
          // this.dynamicFormThree.questions.push(this.qObj);
          break;
        case "d":
          // this.dynamicFormFour.questions.push(this.qObj);
          break;
        default:
          break;
      }
    },
    removeOne(type, item) {
      switch (type) {
        case "a":
          var index = this.dynamicFormOne.questions.indexOf(item);
          if (index !== -1) {
            this.dynamicFormOne.questions.splice(index, 1);
          }
          break;
        case "b":
          var index = this.dynamicFormTwo.questions.indexOf(item);
          if (index !== -1) {
            this.dynamicFormTwo.questions.splice(index, 1);
          }
          break;

        default:
          break;
      }
    }
  },
  created() {
    if (this.$route.params.courseId && this.$route.params.courseName) {
      this.courseId = this.$route.params.courseId;
      this.courseName = this.$route.params.courseName;
    }
  }
};
</script>
<style lang="scss">
.add-question {
  .el-input {
    width: calc(100% - 90px);
  }
}
</style>

<style lang="scss" scoped>
.add-question {
  margin: 14px 0 30px;
  .title-bar {
    color: #444;
    padding: 10px 30px;
    background-color: #ffffff;
    border-bottom: 1px solid #ebeef5;
    .classname {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
    }
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .el-tabs {
    margin: 20px 30px;
    .question-box {
      padding: 12px 0;
      // border-bottom: 1px dashed #d1d6e2;
      .left-name {
        display: inline-block;
        padding-top: 10px;
      }

      .right-btn {
        display: inline-block;
        margin-bottom: 4px;
        float: right;
      }
      .el-textarea,
      .el-input {
        margin-bottom: 6px;
      }
    }
  }
}
</style>


