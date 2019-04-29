<template>
  <div class="student-container">
    <el-table
      ref="filterTable"
      size="medium"
      v-loading="loading"
      :data="homeworks"
      border
      highlight-current-row
      style="width: 100%"
      @current-change="CurrentRowChange"
      @row-dblclick="handleDblClick"
    >
      <div slot="empty" class="nodata-tip">
        <svg-icon icon-class="nodata"/>
      </div>
      <el-table-column type="expand" width="40">
        <template slot-scope="{row}">
          <el-row>
            <el-col :xs="24" :sm="12">
              <span class="label-text">开始时间：</span>
              {{row.starttime}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">关闭时间：</span>
              {{row.closetime}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">关闭后是否显示答案：</span>
              {{row.showanswer}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">最大提交次数：</span>
              {{row.maxsubmit}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">习题数量：</span>
              {{row.quescount}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <router-link
                :to="{ name: 'Question', params: { wid:row.id,wname:row.name,routerName:'homeworkManage'}}"
                tag="span"
              >
                <el-button size="mini" icon="el-icon-tickets">查看习题</el-button>
              </router-link>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="40"></el-table-column>

      <el-table-column align="center" label="作业名" min-width="120">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.name" maxlength="20" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="所属课程"
        prop="course"
        :filters="filterData"
        :filter-method="filterCourse"
      >
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <div>由教师：{{ row.course.teacher.name }} 创建</div>
            <div class="split-line"></div>
            <div>创建于：{{ row.course.createtime }}</div>
            <div class="split-line"></div>
            <div>教师邮箱：{{ row.course.teacher.email }}</div>
            <div slot="reference">{{ row.course.name}}</div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="已提交/学生数" prop="stucount">
        <template slot-scope="{row}">{{row.submitcount}} / {{row.stucount}}</template>
      </el-table-column>

      <el-table-column
        align="center"
        label="作业状态"
        prop="state"
        :filters="[{ text: '未开放', value: 1 }, { text: '开放中', value: 2}, { text: '已关闭', value: 0}]"
        :filter-method="filterState"
      >
        <template slot="header" slot-scope="scope">
          <el-tooltip content="提示：作业状态不会自动刷新" placement="top">
            <span>作业状态</span>
          </el-tooltip>
        </template>
        <template slot-scope="{row}">
          <el-tag v-if="row.state==1" type="warning" size="medium">未开放</el-tag>
          <el-tag v-else-if="row.state==2" type="success" size="medium">开放中</el-tag>
          <el-tag v-else type="info" size="medium">已关闭</el-tag>
        </template>
      </el-table-column>

      <el-table-column sortable align="center" label="创建时间" prop="createtime"></el-table-column>

      <el-table-column align="center" label="操作" width="190">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check"
            @click="confirmEdit(row)"
          >确定</el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >编辑</el-button>
          <el-button
            v-if="row.edit"
            class="cancel-btn"
            size="small"
            icon="el-icon-circle-close"
            type="warning"
            @click="cancelEdit(row)"
          >取消</el-button>
          <el-button
            v-else
            size="small"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="deleteOne(row)"
          >删除</el-button>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
import { allByPage, updateWork, deleteWork } from "@/api/homework";

export default {
  name: "HomeworkManage",
  data() {
    return {
      loading: false,
      homeworks: [],
      cnameArr: [],//课程名
      filterData: [],//要筛选的课程名
      total: 0, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8, //每页条数
    };
  },
  methods: {
    filterCourse(value, row, column) {
      return row.course.name === value;
    },
    filterState(value, row) {
      return row.state === value;
    },
    handleSizeChange(val) {
      //改变每页条数
      this.$refs.filterTable.clearFilter(); //清除过滤器
      this.limit = val;
      this.getHomework();
    },
    handleCurrentChange(val) {
      //改变当前页
      this.$refs.filterTable.clearFilter(); //清除过滤器
      this.page = val;
      this.getHomework();
    },
    handleDblClick(row, column, event) {
      row.edit = true;
    },

    /**
     * 第几页page对应后台第几页要减1
     */
    getHomework(page = this.page - 1, size = this.limit) {
      this.loading = true;
      allByPage(page, size)
        .then(res => {
          this.loading = false;
          this.homeworks = res.data.works;
          this.total = res.data.totalElements; //总条数

          this.cnameArr.splice(0, this.cnameArr.length); //清空数组
          this.filterData.splice(0, this.filterData.length); //清空数组
          let now = new Date(); //现在时间
          this.homeworks.forEach((h, index) => {
            let start = new Date(h.starttime);
            let end = new Date(h.closetime);
            if (now < start) {
              this.$set(h, "state", 1); //1：未开始
            } else if (now >= start && now < end) {
              this.$set(h, "state", 2); //2：开放中
            } else {
              this.$set(h, "state", 0); //0：已关闭
            }
            this.$set(h, "edit", false); //设置edit属性
            h.originalName = h.name; //  作业名  //暂时只支持改作业名

            //设置筛选数据
            if (!this.cnameArr.includes(h.course.name)) {
              this.cnameArr.push(h.course.name);
            }
          });

          this.cnameArr.forEach(item => {
            this.filterData.push({ text: item, value: item });
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    CurrentRowChange(row, oldRow) {
      if (oldRow && oldRow.edit) {
        this.cancelEdit(oldRow);
      }
    },
    cancelEdit(row) {
      row.name = row.originalName;
      // row.info = row.originalInfo;
      row.edit = false;
    },
    confirmEdit(row) {
      //先判断作业名是否存在，暂时不做
      if (row.name.trim() === "") {
        this.$message.warning("作业名不能为空！");
      } else if (row.name.trim().length < 2) {
        this.$message.warning("作业名不少于2个字符！");
      } else {
        updateWork(row)
          .then(res => {
            this.$message.success("作业名更新成功！");
            row.edit = false;
            row.originalName = row.name;
          })
          .catch(error => {
            this.cancelEdit(row); //出现错误就取消编辑
            this.$message.error(error + " 更新失败！");
          });
      }
    },
    deleteOne(row) {
      this.$confirm(
        "确定要删除作业：" + row.name + "，不可撤销，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return deleteWork(row);
        })
        .then(res => {
          this.$message.success("删除成功！"); //不用设置loading，接下来获取数据有设置loading
          this.getHomework(); //删除后重新获取数据
        })
        .catch(err => {
          this.loading = false;
          if (err == "cancel") {
            this.$message({
              type: "info",
              duration: 2000,
              message: "已取消删除"
            });
          } else {
            this.$message.error(err + " 删除失败！");
          }
        });
    }
  },
  created() {
    this.getHomework();
  }
};
</script>
<style lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.student-container {
  margin: 30px;

  .el-table__expanded-cell {
    .el-col {
      margin: 8px 0;
      color: #606266;
      .label-text {
        color: #909399;
      }
    }
  }
  .el-pagination {
    padding: 30px 0;
  }
}
</style>
