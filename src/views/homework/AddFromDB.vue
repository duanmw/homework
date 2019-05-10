<template>
  <el-dialog
    custom-class="all-question"
    fullscreen
    :show-close="false"
    :visible.sync="dialogShow"
    @opened="afterOpened"
    @closed="handleClose"
  >
    <div slot="title" class="dialog-title">
      {{courseName}} 全部习题
      <el-input
        v-if="1>0"
        class="search-input"
        clearable
        size="medium"
        maxlength="30"
        :placeholder="'输入内容，回车搜索 '+courseName+' 内的习题'"
        prefix-icon="el-icon-search"
        v-model.trim="searchStr"
        @keyup.enter.native="searchQuestion"
        @clear="clearSearch"
      ></el-input>
      <span class="title-btn">
        <span v-if="1">已选 {{multipleSelection.length}} 题</span>
        <el-button size="medium" icon="el-icon-finished" type="primary" @click="handleAdd">确定添加</el-button>
        <el-button size="medium" icon="el-icon-close" @click="dialogShow=false">取消添加</el-button>
      </span>
    </div>
    <div class="split-line" style="width:100%"></div>

    <el-table
      ref="multipleTable"
      v-loading="loading"
      size="medium"
      height="410"
      :data="questions"
      tooltip-effect="dark"
      style="width: 100%"
      empty-text="暂无习题数据"
      @selection-change="handleSelectionChange"
      @row-click="setSelect"
    >
      <div slot="empty" class="nodata-tip">
        <svg-icon icon-class="nodata"/>
      </div>
      <el-table-column type="index" width="50"></el-table-column>

      <el-table-column
        label="题目类型"
        :filters="[{ text: '单选', value: 'a' }, { text: '多选', value: 'b'}, { text: '判断', value: 'c'}, { text: '填空', value: 'd'}]"
        :filter-method="filterState"
        prop="type"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.type | showType }}</template>
      </el-table-column>
      <el-table-column prop="title" label="题目" show-overflow-tooltip></el-table-column>
      <el-table-column label="答案">
        <template slot-scope="{row}">
          <div v-if="row.type!='c'" class="text-overflow">
            <span
              v-for="(ans,index)  in row.answer"
              :key="'ans-span'+ans.id"
              :class="{ 'right-item': ans.correct=='yes' }"
              class="option"
            >{{String.fromCharCode(index+65)}}. {{ans.content}}</span>
          </div>
          <div v-else class="text-overflow">
            <span :class="{ 'right-item': row.answer[0].correct=='yes' }" class="option">✔ 正确</span>
            <span :class="{ 'right-item': row.answer[0].correct=='no' }" class="option">✘ 错误</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" width="66"></el-table-column>
    </el-table>
    <el-pagination
      v-if="total>0"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[8, 20, 30, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-dialog>
</template>
<script>
import { allQuesByCid, allQuesBySearch } from "@/api/homework";
export default {
  name: "AddFromDBDialog",
  components: {},
  props: {
    courseId: Number,
    courseName: String,
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      questions: [], //全部习题
      multipleSelection: [], //勾选的习题
      searchStr: "",
      total: 10, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8 //每页条数
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
      if (val && this.$refs.multipleTable) {
        //对话框显示
        this.$refs.multipleTable.clearSelection();
      }
    }
  },
  methods: {
    afterOpened() {
      // this.getAllQuestion();
    },
    handleClose() {
      //dialog关闭后
      this.searchStr = "";
      this.$refs.multipleTable.clearFilter(); //清除过滤器
      this.page = 1; //重回第一页
      this.getAllQuestion();
    },
    filterState(value, row) {
      console.log(value, row.type);

      return row.type == value;
    },
    handleSizeChange(val) {
      //改变每页条数
      this.$refs.multipleTable.clearFilter(); //清除过滤器
      this.limit = val;
      this.getAllQuestion();
    },
    handleCurrentChange(val) {
      //改变当前页
      this.$refs.multipleTable.clearFilter(); //清除过滤器
      this.page = val;
      this.getAllQuestion();
    },
    handleAdd() {
      if (this.multipleSelection.length > 0) {
        this.$emit("addExistQ", this.multipleSelection);
        this.dialogShow = false;
      } else {
        this.$message.warning("您未选任何题目！");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setSelect(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    searchQuestion() {
      if (this.searchStr.length > 0) {
        this.loading = true;
        allQuesBySearch(
          this.page - 1,
          this.limit,
          this.courseId,
          this.searchStr
        )
          .then(res => {
            this.questions.splice(0, this.questions.length);
            this.loading = false;
            this.questions.push(...res.data.questions);
            this.total = res.data.totalElements; //总条数
          })
          .catch(error => {
            this.loading = false;
            this.$message.error(error + " 数据获取失败");
          });
      } else {
        this.$message.warning("搜索内容不能为空");
      }
    },
    clearSearch() {
      this.$refs.multipleTable.clearFilter(); //清除过滤器
      this.getAllQuestion();
    },
    getAllQuestion(page = this.page - 1, size = this.limit) {
      this.loading = true;

      allQuesByCid(page, size, this.courseId)
        .then(res => {
          this.loading = false;
          this.total = res.data.totalElements;
          this.questions = res.data.questions;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    }
  },
  created() {},
  mounted() {
    if (this.courseId) {
      this.getAllQuestion();
    }
  }
};
</script>
<style lang="scss">
.is-fullscreen {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>

<style lang="scss" scoped>
.all-question {
  .dialog-title {
    font-size: 18px;
    color: #303133;
    .search-input {
      margin-left: 40px;
      min-width: 220px;
      width: calc(100% - 700px);
    }
    .title-btn {
      float: right;
      span {
        color: #606266;
        font-size: 16px;
        margin-right: 20px;
      }
    }
  }
  .option {
    color: #606266;
    font-size: 13px;
    & + .option {
      margin-left: 16px;
    }
  }
  .right-item {
    color: #88bf6d;
  }
  .answer-desc {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed #ebeef5;
    color: #606266;
    font-size: 12px;
  }
}

.el-pagination {
  padding: 30px 0;
}
</style>


