<template>
  <div class="student-container">
    <el-table
      size="medium"
      v-loading="loading"
      :data="courses"
      border
      highlight-current-row
      style="width: 100%"
      @current-change="CurrentRowChange"
      @row-dblclick="handleDblClick"
    >
      <div slot="empty" class="nodata-tip">
        <svg-icon icon-class="nodata"/>
      </div>
      <el-table-column type="index" width="50"></el-table-column>
      <!-- <el-table-column align="center" label="学号" width="80"> -->
      <el-table-column align="center" label="课程名" min-width="120">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model.trim="row.name" maxlength="20" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="课程简介" min-width="120" show-overflow-tooltip>
        <!-- <el-table-column width="120px" align="center" label="班级"> -->
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.info" maxlength="50" class="edit-input" size="small"/>
          </template>
          <span v-else>
            {{ row.info}}
            <span v-if="!row.info" class="null-tip">暂无简介</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建者" prop="tid">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <div>邮箱：{{ row.teacher.email }}</div>
            <div class="split-line"></div>
            <div>教师：{{ row.teacher.name }}</div>
            <div slot="reference">
              <el-tag size="medium">{{ row.teacher.name?row.teacher.name:row.teacher.email}}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学生数" prop="stucount" width="70"></el-table-column>
      <el-table-column align="center" label="作业数" prop="workcount" width="70"></el-table-column>
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
import { allByPage, updateCourse, deleteCourse, isExist } from "@/api/course";

export default {
  name: "CourseManage",
  data() {
    return {
      loading: false,
      courses: [],
      total: 0, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8 //每页条数
    };
  },
  methods: {
    handleSizeChange(val) {
      //改变每页条数
      this.limit = val;
      this.getCourse();
    },
    handleCurrentChange(val) {
      //改变当前页
      this.page = val;
      this.getCourse();
    },
    handleDblClick(row, column, event) {
      row.edit = true;
    },

    /**
     * 第几页page对应后台第几页要减1
     */
    getCourse(page = this.page - 1, size = this.limit) {
      this.loading = true;
      allByPage(page, size)
        .then(res => {
          this.loading = false;
          this.courses = res.data.courses;
          this.total = res.data.totalElements; //总条数
          this.courses = this.courses.map(c => {
            this.$set(c, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
            c.originalName = c.name; //  取消编辑后就使用original值还原
            c.originalInfo = c.info;
            return c;
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
      row.info = row.originalInfo;
      row.edit = false;
    },
    confirmEdit(row) {
      if (row.name === "") {
        this.$message.warning("课程名不能为空！");
      } else if (row.name.length < 2) {
        this.$message.warning("课程名不少于2个字符！");
      } else {
        isExist(row.tid, row.name) //先判断课程名是否存在
          .then(res => {
            if (res.message == "true" && row.name != row.originalName) {
              //如果存在课程名且不跟修改前不一样，说明重复
              this.$message.warning("此教师已存在此课程名！请更换");
              return Promise.reject("exist");
            } else {
              return updateCourse({
                id: row.id,
                tid: row.tid,
                name: row.name,
                info: row.info,
                createtime: row.createtime
              });
            }
          })
          .then(res => {
            this.$message.success("更新成功！");
            row.edit = false;
            row.originalName = row.name;
            row.originalInfo = row.info;
          })
          .catch(error => {
            if (error != "exist") {
              this.cancelEdit(row); //出现错误就取消编辑
              this.$message.error(error + " 更新失败！");
            }
          });
      }
    },
    deleteOne(row) {
      this.$confirm(
        "确定要删除由教师（" +
          (row.teacher.name ? row.teacher.name : row.teacher.email) +
          "）创建的课程（" +
          row.name +
          "），课程内作业也会被删除，不可撤销，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return deleteCourse({
            id: row.id,
            tid: row.tid,
            name: row.name,
            info: row.info,
            createtime: row.createtime
          });
        })
        .then(res => {
          this.$message.success("删除成功！"); //不用设置loading，接下来获取数据有设置loading
          this.getCourse(); //删除后重新获取数据
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
    this.getCourse();
  }
};
</script>
<style lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.student-container {
  //后面将margin: 30px 单独提出到一个公用类
  margin: 30px;

  .el-pagination {
    padding: 30px 0;
  }
}
</style>
