<template>
  <div class="add-question">
    <sticky :zIndex="3">
      <div class="title-bar">
        <el-row>
          <el-col :xs="24" :sm="12">
            <router-link :to="{ name: 'Homework', params: { courseId,courseName }}" tag="span">
              <el-button size="small" icon="el-icon-back">返回</el-button>
            </router-link>
            <span class="classname">给课程：{{$route.params.courseName}} 添加作业</span>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-button size="medium" icon="el-icon-circle-plus-outline">添加习题</el-button>
            <!-- <el-button size="medium" icon="el-icon-view">查看成绩</el-button> -->
            <el-button size="medium" icon="el-icon-printer">统计成绩</el-button>
          </el-col>
        </el-row>
      </div>
    </sticky>
    <!-- <el-button>aaa</el-button> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="单选题" name="first">
        <el-form size="small" :model="dynamicFormOne" ref="dynamicFormOne">
          <el-form-item v-for="(question, index) in dynamicFormOne.questions" :key="question.key">
            {{'单选题 ' + (index+1)}}
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
                @click.prevent="removeTypeOne(question)"
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
              placeholder="请输入答案解析"
              v-model="question.desc"
            ></el-input>
            <el-row :gutter="12">
              <el-col :xs="24" :sm="12">
                <el-input
                  clearable
                  maxlength="300"
                  v-model="question.options[0].content"
                  placeholder="选项内容"
                ></el-input>
                <el-checkbox
                  @change="question.options[1].isRight=false;question.options[2].isRight=false;question.options[3].isRight=false"
                  label="正确选项"
                  v-model="question.options[0].isRight"
                ></el-checkbox>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-input
                  clearable
                  maxlength="300"
                  v-model="question.options[1].content"
                  placeholder="选项内容"
                ></el-input>
                <el-checkbox
                  @change="question.options[0].isRight=false;question.options[2].isRight=false;question.options[3].isRight=false"
                  label="正确选项"
                  v-model="question.options[1].isRight"
                ></el-checkbox>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-input
                  clearable
                  maxlength="300"
                  v-model="question.options[2].content"
                  placeholder="选项内容"
                ></el-input>
                <el-checkbox
                  @change="question.options[0].isRight=false;question.options[1].isRight=false;question.options[3].isRight=false"
                  label="正确选项"
                  v-model="question.options[2].isRight"
                ></el-checkbox>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-input
                  clearable
                  maxlength="300"
                  v-model="question.options[3].content"
                  placeholder="选项内容"
                ></el-input>
                <el-checkbox
                  @change="question.options[0].isRight=false;question.options[1].isRight=false;question.options[2].isRight=false"
                  label="正确选项"
                  v-model="question.options[3].isRight"
                ></el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addOneQ('a')">添加题目</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="多选题" name="second">
        <!-- <el-form size="medium" :model="dynamicFormTwo" ref="dynamicFormTwo">
          <el-form-item v-for="(question, index) in dynamicFormTwo.questions" :key="question.key">
            {{'多选题 ' + (index+1)}}
            <div class="right-btn">
              <el-button size="small" type="primary" plain icon="el-icon-edit">添加解析</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                icon="el-icon-delete"
                @click.prevent="removeTypeOne(question)"
              >删除</el-button>
            </div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入题目"
              v-model="question.title"
            ></el-input>
            <el-row :gutter="12">
              <el-col :xs="24" :sm="12">
                <el-input v-model="question.options[0].content" placeholder="选项内容"></el-input>
                <el-checkbox label="正确选项" v-model="question.options[0].isRight"></el-checkbox>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-input v-model="question.options[1].content" placeholder="选项内容"></el-input>
                <el-checkbox label="正确选项" v-model="question.options[1].isRight"></el-checkbox>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-input v-model="question.options[2].content" placeholder="选项内容"></el-input>
                <el-checkbox label="正确选项" v-model="question.options[2].isRight"></el-checkbox>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-input v-model="question.options[3].content" placeholder="选项内容"></el-input>
                <el-checkbox label="正确选项" v-model="question.options[3].isRight"></el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addOneQ('b')">添加题目</el-button>
        </el-form>-->
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
        questions: [
          {
            key: "firstQ",
            showDesc: false,
            title: "",
            desc: "",
            options: [
              { content: "", isRight: false },
              { content: "", isRight: false },
              { content: "", isRight: false },
              { content: "", isRight: false }
            ]
          }
        ]
      },
      dynamicFormTwo: {
        questions: [this.qObj]
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    addOneQ(type) {
      switch (type) {
        case "a":
          let obj = Object.assign({}, JSON.parse(JSON.stringify(this.qObj)), {
            key: "q" + Date.now()
          }); //利用JSON.parse深拷贝,再向新对象{}里合并
          this.dynamicFormOne.questions.push(obj);
          break;
        case "b":
          this.qObj.key = Date.now();
          this.dynamicFormTwo.questions.push(this.qObj);
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
    removeTypeOne(item) {
      var index = this.dynamicFormOne.questions.indexOf(item);
      if (index !== -1) {
        this.dynamicFormOne.questions.splice(index, 1);
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
  // .el-col {
  //   margin-top: 6px;
  // }
}
</style>

<style lang="scss" scoped>
.add-question {
  margin: 20px 0 30px;
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
    .left-label {
      display: inline-block;
      width: 100px;
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
</style>


