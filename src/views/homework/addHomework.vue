<template>
  <div class="add-question">
    <sticky :z-index="3">
      <div class="title-bar">
        <el-row>
          <el-col :xs="24" :sm="12">
            <!-- <router-link :to="{ name: 'Homework', params: { courseId,courseName }}" tag="span"> -->
            <el-button size="small" icon="el-icon-back" @click.prevent="beforeBack">返回</el-button>
            <!-- </router-link> -->
            <!-- <span class="classname">给课程：{{$route.params.courseName}} 添加作业习题</span> -->
            <span class="classname">添加作业 - {{suggestName?suggestName:"请返回重试！"}}</span>
          </el-col>
          <el-col :xs="24" :sm="12">
            习题总数：{{quesCount}}
            &nbsp;&nbsp;&nbsp;
            <el-button
              :disabled="courseName==''"
              size="medium"
              icon="el-icon-circle-check-outline"
              @click="handleAdd()"
            >添加完成</el-button>
          </el-col>
        </el-row>
      </div>
    </sticky>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label">
          单选题
          <transition name="badge-fade" leave-active-class="animated rollOut">
            <span
              v-if="dynamicFormOne.questions.length"
              class="little-badge"
            >{{dynamicFormOne.questions.length}}</span>
          </transition>
        </span>
        <div
          class="question-box box-type-one"
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
      <el-tab-pane name="second">
        <span slot="label">
          多选题
          <transition name="badge-fade" leave-active-class="animated rollOut">
            <span
              v-if="dynamicFormTwo.questions.length"
              class="little-badge"
            >{{dynamicFormTwo.questions.length}}</span>
          </transition>
        </span>
        <div
          class="question-box box-type-two"
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
        <el-button
          :disabled="courseName==''"
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="addOneQ('b')"
        >添加题目</el-button>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label">
          判断题
          <transition name="badge-fade" leave-active-class="animated rollOut">
            <span
              v-if="dynamicFormThree.questions.length"
              class="little-badge"
            >{{dynamicFormThree.questions.length}}</span>
          </transition>
        </span>
        <div
          class="question-box box-type-three"
          v-for="(question, index) in dynamicFormThree.questions"
          :key="question.key"
        >
          <span class="left-name">{{'判断题 ' + (index+1)}}</span>
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
              @click.prevent="removeOne('c',question)"
            >删除</el-button>
          </div>
          <el-input
            type="textarea"
            maxlength="300"
            :autosize="{ minRows: 1, maxRows: 4}"
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
          <div class="radio-group">
            <el-radio v-model="question.options[0].isRight" :label="true">正确</el-radio>
            <el-radio v-model="question.options[0].isRight" :label="false">错误</el-radio>
          </div>
        </div>
        <el-button
          :disabled="courseName==''"
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="addOneQ('c')"
        >添加题目</el-button>
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label">
          填空题
          <transition name="badge-fade" leave-active-class="animated rollOut">
            <span
              v-if="dynamicFormFour.questions.length"
              class="little-badge last-badge"
            >{{dynamicFormFour.questions.length}}</span>
          </transition>
        </span>
        <div
          class="question-box box-type-four"
          v-for="(question, index) in dynamicFormFour.questions"
          :key="question.key"
        >
          <span class="left-name">{{'填空题 ' + (index+1)}}</span>
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
              @click.prevent="removeOne('d',question)"
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
          <div
            v-for="(item,index) in question.options"
            :key="question.key+index"
            class="answer-box"
          >
            答案：
            <el-input
              size="medium"
              clearable
              maxlength="300"
              v-model="question.options[index].content"
              placeholder="请输入空位答案，多个空位的答案请使用空格分隔"
            ></el-input>
          </div>
        </div>
        <el-button
          :disabled="courseName==''"
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="addOneQ('d')"
        >添加题目</el-button>
      </el-tab-pane>
    </el-tabs>
    <homework-dialog
      @closeDialog="dialogVisible=false"
      @back="returnBack"
      :courseId="courseId"
      :suggestName="suggestName"
      :quesCount="quesCount"
      :dialogVisible.sync="dialogVisible"
      :typeOne="dynamicFormOne"
      :typeTwo="dynamicFormTwo"
      :typeThree="dynamicFormThree"
      :typeFour="dynamicFormFour"
    ></homework-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky";
import HomeworkDialog from "./HomeworkDialog";
export default {
  name: "AddQuestion",
  components: {
    Sticky,
    HomeworkDialog
  },
  data() {
    return {
      activeName: "first",
      courseId: "",
      courseName: "",
      suggestName: "",
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
      },
      dialogVisible: false
    };
  },
  computed: {
    quesCount() {
      return (
        this.dynamicFormOne.questions.length +
        this.dynamicFormTwo.questions.length +
        this.dynamicFormThree.questions.length +
        this.dynamicFormFour.questions.length
      );
    }
  },
  methods: {
    beforeBack() {
      if (this.quesCount > 0) {
        this.$confirm("返回将不会保存已添加习题，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.returnBack();
          })
          .catch(() => {
            return false;
          });
      }else{
        this.returnBack();
      }
    },
    returnBack() {
      this.$router.push({
        name: "Homework",
        params: { courseId: this.courseId, courseName: this.courseName }
      });
    },
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
    validateFormThree() {
      return this.dynamicFormThree.questions.every(item => {
        if (item.title != "") {
          return true;
        } else {
          this.$message.warning("存在判断题题目为空情况！请检查");
          return false;
        }
      });
    },
    validateFormFour() {
      return this.dynamicFormFour.questions.every(item => {
        if (item.title != "") {
          for (let i = 0; i < item.options.length; i++) {
            if (item.options[i].content == "") {
              this.$message.warning("存在填空题答案为空情况！请检查");
              return false;
            }
          }
          return true;
        } else {
          this.$message.warning("存在填空题题目为空情况！请检查");
          return false;
        }
      });
    },
    handleAdd() {
      if (this.validateFormOne()) {
        if (this.validateFormTwo()) {
          if (this.validateFormThree()) {
            if (this.validateFormFour()) {
              this.dialogVisible = true;
            } else {
              this.activeName = "fourth";
            }
          } else {
            this.activeName = "third";
          }
        } else {
          this.activeName = "second";
        }
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
          if (this.validateFormThree()) {
            let newObj = {
              showDesc: false,
              title: "",
              desc: "",
              options: [{ content: "正确", isRight: true }],
              key: "" + Date.now()
            };
            this.dynamicFormThree.questions.push(newObj);
          }
          break;
        case "d":
          if (this.validateFormFour()) {
            let newObj = {
              showDesc: false,
              title: "",
              desc: "",
              options: [{ content: "", isRight: true }],
              key: "" + Date.now()
            };
            this.dynamicFormFour.questions.push(newObj);
          }
          break;
        default:
          break;
      }
    },
    removeOne(type, item) {
      let index;
      switch (type) {
        case "a":
          index = this.dynamicFormOne.questions.indexOf(item);
          if (index !== -1) {
            this.dynamicFormOne.questions.splice(index, 1);
          }
          break;
        case "b":
          index = this.dynamicFormTwo.questions.indexOf(item);
          if (index !== -1) {
            this.dynamicFormTwo.questions.splice(index, 1);
          }
          break;
        case "c":
          index = this.dynamicFormThree.questions.indexOf(item);
          if (index !== -1) {
            this.dynamicFormThree.questions.splice(index, 1);
          }
          break;
        case "d":
          index = this.dynamicFormFour.questions.indexOf(item);
          if (index !== -1) {
            this.dynamicFormFour.questions.splice(index, 1);
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
      this.suggestName = this.$route.params.suggestName;
    }
  }
};
</script>
<style lang="scss">
.add-question {
  .box-type-one,
  .box-type-two {
    .el-input {
      width: calc(100% - 90px);
    }
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
    .little-badge {
      position: absolute;
      top: 12px;
      right: 18px;
      transform: translateY(-50%) translateX(100%);
      background-color: rgba(64, 158, 255, 0.7);
      border-radius: 10px;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      padding: 0 6px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid #fff;
      &.last-badge {
        right: -1px;
      }
    }
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
    .box-type-three {
      .el-textarea {
        margin-bottom: 10px;
      }
      .radio-group {
        padding-left: 1px;
        padding-bottom: 4px;
      }
    }
    .box-type-four {
      .answer-box {
        color: #7a7a7a;
        .el-input {
          width: calc(100% - 53px);
        }
      }
    }
  }
}
</style>


