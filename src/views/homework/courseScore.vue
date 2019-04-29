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
          <span class="workname">{{courseName?courseName:"无数据，请返回重试！"}}&nbsp;&nbsp;学生作业成绩</span>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-button
            :disabled="this.students.length==0"
            size="small"
            icon="el-icon-download"
            :loading="downloadLoading"
            @click="dialogFormVisible=true"
          >导出Excel</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <div v-if="courseId" class="filter-container">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选(筛选列)</el-checkbox>
        <el-checkbox-group v-model="checkboxVal" @change="handleCheckedChange">
          <el-checkbox v-for="i in works" :label="i.name" :key="'wname'+i.shortName">{{i.shortName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-table
        :key="key"
        border
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
            <div v-if="checkboxVal.length==0" class="no-score" style="text-align:center;">未选作业，暂无信息</div>
            <el-row v-for="(wname,index) in checkboxVal" :key="'row'+wname">
              <el-col :xs="12" :sm="8">
                <span class="label-text">{{wname}}</span>
              </el-col>
              <el-col :xs="12" :sm="6">
                <span class="label-text">总分：</span>
                {{row[wname].quescount*2}}
                <span class="label-text">，提交了</span>
                {{row[wname].scores.length}}次
              </el-col>
              <el-col :xs="12" :sm="5">
                <span class="label-text">平均成绩：</span>
                {{row[wname].avgscore}}分
              </el-col>
              <el-col :xs="12" :sm="5">
                <span class="label-text">最高成绩：</span>
                {{row[wname].maxscore}}分
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>

        <el-table-column align="center" sortable label="学号" prop="number"></el-table-column>

        <el-table-column align="center" label="班级" prop="classname"></el-table-column>

        <el-table-column align="center" label="姓名" prop="name"></el-table-column>

        <el-table-column align="center" v-for="wname in checkboxVal" :key="wname" :label="wname">
          <template slot-scope="{row}">
            <el-popover trigger="hover" placement="top">
              <div v-for="(sc,index) in row[wname].scores" :key="sc.submittime">
                {{sc.submittime}}提交，耗时：{{Math.floor(sc.spendtime/60)}}min{{sc.spendtime%60}}s，成绩：{{ sc.score}}分
                <div class="split-line"></div>
              </div>
              <div v-if="row[wname].scores&&row[wname].scores.length==0">无提交信息</div>

              <span slot="reference">{{ row[wname].maxscore?row[wname].maxscore:0 }}</span>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          v-if="checkboxVal.length>0&&checkboxVal.length<works.length"
          label="选中项总成绩"
          prop="checkedScore"
        ></el-table-column>

        <el-table-column align="center" sortable label="成绩" prop="totalScore">
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="'全部作业总分为：'+totalQCount*2" placement="top">
              <span>课程总成绩</span>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span v-if="row.totalScore" class="have-score">{{row.totalScore}}</span>
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
import { stuScoreInCourse } from "@/api/student";
import md5 from "blueimp-md5";
export default {
  name: "courseScore",
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
        (this.$route.params.courseName ? this.$route.params.courseName : "") +
        " 学生作业成绩", //导出文件名
      autoWidth: false,
      fileType: "xlsx",
      checkboxVal: [], //可选的作业名
      checkAll: false,
      isIndeterminate: false,
      key: 1, // table key
      totalQCount: 0, //全部作业总习题数量
      works: []
    };
  },
  watch: {
    checkboxVal(valArr) {
      this.key = this.key + 1; // 为了保证table 每次都会重新渲染
      this.students = this.students.map(s => {
        let checkedScore = 0;
        let checkedTotalScore = 0;
        valArr.forEach(element => {
          if (s.hasOwnProperty(element)) {
            checkedScore += s[element].maxscore; //选中项的总成绩
            checkedTotalScore += s[element].quescount * 2; //选中项的作业总分
          }
        });
        s.checkedScore = checkedScore;
        s.checkedTotalScore = checkedTotalScore;
        return s;
      });
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkboxVal = val
        ? this.works.map(item => {
            return item.name;
          })
        : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.works.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.works.length;
    },
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

      stuScoreInCourse(this.courseId, page, size)
        .then(res => {
          this.loading = false;
          this.total = res.data.totalElements;
          this.totalQCount = res.data.totalQCount;
          this.works = res.data.works;
          this.students = res.data.students;

          this.works = this.works.map(w => {
            w.shortName = w.name; //设置短名，方便checkbox的展示
            if (this.courseName) {
              if (w.shortName.indexOf(this.courseName) === 0) {
                w.shortName = w.shortName.substring(this.courseName.length);
              }
            }
            return w;
          });
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error + " 数据获取失败");
        });
    },
    handleClose() {},
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel")
        .then(excel => {
          let checkedItem = { header: [], name: [] };
          if (
            this.checkboxVal.length > 0 &&
            this.checkboxVal.length < this.works.length
          ) {
            checkedItem.header.splice(0, checkedItem.header.length);
            checkedItem.name.splice(0, checkedItem.name.length);
            checkedItem.header.push("选中项总成绩");
            checkedItem.name.push("checkedScore");
          }
          const tHeader = ["学号", "班级", "姓名", "课程总成绩"]
            .concat(this.checkboxVal)
            .concat(checkedItem.header);
          const filterVal = ["number", "classname", "name", "totalScore"]
            .concat(this.checkboxVal)
            .concat(checkedItem.name);

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
          console.error(err);
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        //筛选指定属性的值
        filterVal.map(j => {
          if (
            j != "number" &&
            j != "classname" &&
            j != "name" &&
            j != "totalScore" &&
            j != "checkedScore"
          ) {
            return v[j].maxscore; //单次作业成绩
          } else {
            return v[j];
          }
        })
      );
    }
  },
  created() {
    this.courseId = this.$route.params.courseId;
    this.courseName = this.$route.params.courseName;
    if (this.courseId && this.courseName) {
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
    padding: 0 0 12px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    .workname {
      vertical-align: middle;
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
    .filter-container {
      margin-bottom: 12px;
      .el-checkbox {
        margin-bottom: 8px;
      }
    }
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
