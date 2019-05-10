<template>
  <div class="stuscore-container">
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12">
          <router-link
            :to="{ name: 'Homework', params: { courseId,courseName,activeName:this.$route.params.activeName }}"
            tag="span"
          >
            <el-button size="small" icon="el-icon-back">返回</el-button>
          </router-link>
          <span
            class="workname"
          >{{$route.params.work?$route.params.work.name:"无数据，请返回重试！"}}&nbsp;&nbsp;学生成绩</span>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-button
            :disabled="this.students.length==0"
            size="small"
            icon="el-icon-download"
            :loading="downloadLoading"
            @click="dialogFormVisible=true"
          >导出Excel</el-button>
          <!-- <el-button size="medium" icon="el-icon-printer">统计成绩</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <el-table
        ref="stuScoreTable"
        size="medium"
        v-loading="loading"
        :data="students"
        style="width: 100%"
      >
        <div slot="empty" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>
        <el-table-column type="expand" width="50">
          <template slot-scope="{row}">
            <div
              v-if="row.scores&&row.scores.length==0"
              class="no-score"
              style="text-align:center;"
            >无提交信息</div>
            <el-row v-for="(sc,index) in row.scores" :key="sc.submittime">
              <el-col :xs="24" :sm="{span:10,offset:1}">
                <span class="label-text">{{index+1}}. 提交时间：</span>
                {{sc.submittime}}
              </el-col>
              <el-col :xs="12" :sm="7">
                <span class="label-text">花费时间：</span>
                {{Math.floor(sc.spendtime/60)}}min {{sc.spendtime%60}}s
              </el-col>
              <el-col :xs="12" :sm="4" :class="{'have-score':sc.score==row.maxscore}">
                <span class="label-text">成绩：</span>
                {{ sc.score}}分
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>

        <el-table-column align="center" sortable label="学号" prop="number">
          <!-- <template slot-scope="{row}">{{ row.number }}</template> -->
        </el-table-column>

        <el-table-column align="center" label="班级" prop="classname">
          <!-- <template slot-scope="{row}">{{ row.classname }}</template> -->
        </el-table-column>

        <el-table-column align="center" label="姓名" prop="name">
          <!-- <template slot-scope="{row}">{{ row.name }}</template> -->
        </el-table-column>

        <el-table-column align="center" sortable label="成绩" prop="maxscore">
          <template slot="header" slot-scope="scope">
            <el-tooltip
              :content="'作业总分为：'+($route.params.work?($route.params.work.quescount*2):0)"
              placement="top"
            >
              <span>作业成绩</span>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span v-if="row.maxscore" class="have-score">{{row.maxscore}}</span>
            <span v-else class="no-score">0</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="total>0"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[8, 30, 60, 100]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      custom-class="my-dialog export-dialog"
      title="导出成绩到 Excel"
      :visible.sync="dialogFormVisible"
      @closed="handleClose"
    >
      <el-form size="medium" ref="exportExcelForm" label-position="left">
        <el-form-item label-width="70px" label="文件名：">
          <el-input clearable v-model="filename"></el-input>
        </el-form-item>
        <el-form-item label-width="90px" label="导出类型：">
          <el-select v-model="fileType">
            <el-option label="xlsx" value="xlsx"/>
            <el-option label="csv" value="csv"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="自动调整列宽：">
          <el-switch v-model="autoWidth"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleDownload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { stuScoreInWork } from "@/api/student";
import md5 from "blueimp-md5";
export default {
  name: "StuScore",
  data() {
    return {
      courseId: "",
      courseName: "",
      loading: false,
      total: 0, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8, //每页条数
      students: [],
      dialogFormVisible: false,
      downloadLoading: false,
      filename:
        (this.$route.params.work ? this.$route.params.work.name : "") +
        " 学生成绩", //导出文件名
      autoWidth: true,
      fileType: "xlsx"
    };
  },
  watch: {
    courseId() {}
  },
  methods: {
    handleSizeChange(val) {
      //改变每页条数
      this.limit = val;
      this.getStudent();
    },
    handleCurrentChange(val) {
      //改变当前页
      this.page = val;
      this.getStudent();
    },

    /**
     * 第几页page对应后台第几页要减1
     */
    getStudent(page = this.page - 1, size = this.limit) {
      this.loading = true;

      stuScoreInWork(this.$route.params.work.id, this.courseId, page, size)
        .then(res => {
          this.loading = false;
          this.total = res.data.totalElements;
          this.students = res.data.students;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    handleClose() {
      //移除校验结果并重置表单为初始值
      // this.$refs.exportExcelForm.resetFields();
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel")
        .then(excel => {
          const tHeader = ["学号", "班级", "姓名", "成绩"];
          const filterVal = ["number", "classname", "name", "maxscore"];
          const data = this.formatJson(filterVal, this.students);
          excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.fileType
          });
          this.dialogFormVisible = false;
          this.downloadLoading = false;
        })
        .catch(err => {
          this.$message.warning(err);
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        //筛选指定属性的值
        filterVal.map(j => {
          // if (j === "timestamp") {
          //   return parseTime(v[j]);
          // } else {
          return v[j];
          // }
        })
      );
    }
  },
  created() {
    this.courseId = this.$route.params.courseId;
    this.courseName = this.$route.params.courseName;
    if (this.$route.params.work) {
      this.getStudent();
    }
  }
};
</script>
<style lang="scss">
.stuscore-container .export-dialog {
  max-width: 420px !important;
  .el-dialog__body {
    padding-bottom: 0px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.stuscore-container {
  margin: 30px;
  .title-bar {
    color: #444;
    padding: 0 0 20px;
    border-bottom: 1px solid #ebeef5;
    .workname {
      // vertical-align: middle;
      margin-left: 20px;
    }
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .el-table__expanded-cell {
    .el-row {
      border-bottom: 1px dashed #e4e7ed;
      .el-col {
        padding: 10px 0 6px;
        color: #606266;
        .label-text {
          color: #909399;
        }
      }
    }
  }
  .content-area {
    .have-score {
      color: #1f8eff !important;
    }
    .no-score {
      color: #909399;
    }
    .el-pagination {
      padding: 30px 0;
    }
  }
}
</style>
