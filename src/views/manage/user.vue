<template>
  <div class="student-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="教师管理" name="teacher"></el-tab-pane>
      <el-tab-pane label="学生管理" name="student"></el-tab-pane>
    </el-tabs>
    <el-table size="medium" v-loading="loading" :data="users" border style="width: 100%">
      <div slot="empty" class="nodata-tip">
        <svg-icon icon-class="nodata"/>
      </div>
      <el-table-column type="index" width="50"></el-table-column>
      <!-- <el-table-column align="center" label="学号" width="80"> -->
      <el-table-column align="center" label="用户名" prop="name">
        <template slot-scope="{row}">
          <span v-if="row.name">{{row.name}}</span>
          <span v-else class="null-tip">暂无</span>
        </template>
      </el-table-column>
      <template v-if="activeName==='teacher'">
        <el-table-column align="center" label="邮箱账号" prop="email"></el-table-column>
        <el-table-column align="center" label="拥有课程">
          <template slot-scope="{row}">
            <!-- <el-tag v-for="(c,index) in row.courses" :key="c.id" :color="color[index%4]" size="medium">{{c.name}}</el-tag> -->
            <!-- <el-tag v-for="(c,index) in row.courses" :key="c.id" size="medium">{{c.name}}</el-tag> -->
            <el-popover
              v-for="(c,index) in row.courses"
              :key="c.id"
              trigger="hover"
              placement="top"
            >
              <div>作业数：{{ c.workcount }}</div>
              <div>学生数：{{ c.stucount }}</div>
              <div slot="reference">
                <el-tag size="medium">{{c.name}}</el-tag>
              </div>
            </el-popover>
            <span v-if="row.courses.length==0" class="null-tip">暂无</span>
          </template>
        </el-table-column>
      </template>

      <template v-else-if="activeName==='student'">
        <el-table-column sortable align="center" label="学号" prop="stucount"></el-table-column>
        <el-table-column align="center" label="班级" prop="workcount"></el-table-column>
        <el-table-column align="center" label="所属课程" prop="tid">
          <template slot-scope="{row}">
            <el-popover trigger="hover" placement="top">
              <div style="margin-bottom:4px;">邮箱：{{ row.teacher.email }}</div>
              <div>教师：{{ row.teacher.name }}</div>
              <div slot="reference">
                <el-tag size="medium">{{ row.teacher.name?row.teacher.name:row.teacher.email}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="操作" width="140">
        <template slot-scope="{row}">
          <el-button
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
import { allByPage as allTeacher, deleteTeacher } from "@/api/teacher";
import { allByPage as allStudent, deleteStudent } from "@/api/student";

export default {
  name: "UserManage",
  data() {
    return {
      activeName: "teacher", //默认 教师
      loading: false,
      users: [],
      total: 0, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8, //每页条数
      color: ["#30BA78", "#30DECE", "YellowGreen", "SlateBlue"]
    };
  },
  watch: {
    courseId() {}
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.name);
    },
    handleSizeChange(val) {
      //改变每页条数
      this.limit = val;
      this.getUser();
    },
    handleCurrentChange(val) {
      //改变当前页
      this.page = val;
      this.getUser();
    },
    handleDblClick(row, column, event) {
      row.edit = true;
    },

    /**
     * 第几页page对应后台第几页要减1
     */
    getUser(page = this.page - 1, size = this.limit) {
      this.loading = true;
      if (this.activeName === "teacher") {
        allTeacher(page, size)
          .then(res => {
            this.loading = false;
            this.users = res.data.teachers;
            this.total = res.data.totalElements; //总条数
          })
          .catch(error => {
            this.loading = false;
            this.$message.error(error + " 数据获取失败");
          });
      } else if (this.activeName === "student") {
        allStudent(page, size)
          .then(res => {
            this.loading = false;
            this.users = res.data.students;
            this.total = res.data.totalElements; //总条数
          })
          .catch(error => {
            this.loading = false;
            this.$message.error(error + " 数据获取失败");
          });
      }
    },
    // CurrentRowChange(row, oldRow) {
    //   if (oldRow && oldRow.edit) {
    //     this.cancelEdit(oldRow);
    //   }
    // },
    // cancelEdit(row) {
    //   row.name = row.originalName;
    //   row.info = row.originalInfo;
    //   row.edit = false;
    // },
    // confirmEdit(row) {
    //   //先判断课程名是否存在，暂时不做
    //   if (row.name.trim() === "") {
    //     this.$message.warning("课程名不能为空！");
    //   } else if (row.name.trim().length < 2) {
    //     this.$message.warning("课程名不少于2个字符！");
    //   } else {
    //     updateCourse({
    //       id: row.id,
    //       tid: row.tid,
    //       name: row.name,
    //       info: row.info,
    //       createtime: row.createtime
    //     })
    //       .then(res => {
    //         this.$message.success("更新成功！");
    //         row.edit = false;
    //         row.originalName = row.name;
    //         row.originalInfo = row.info;
    //       })
    //       .catch(error => {
    //         this.cancelEdit(row); //出现错误就取消编辑
    //         this.$message.error(error + " 更新失败！");
    //       });
    //   }
    // },
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
          this.getUser(); //删除后重新获取数据
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
    this.getUser();
  }
};
</script>
<style lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
//后面将margin: 30px 单独提出到一个公用类
.student-container {
  margin: 18px 30px 30px;

  .null-tip {
    color: #c0c4cc;
  }
  .el-popover__reference{
    float: left;
  }
  .el-tag {
    margin: 1px 2px;
  }

  .el-pagination {
    padding: 30px 0;
  }
}
</style>
