<template>
  <div class="student-container">
    <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight" appear>
      <el-input
        v-if="activeName==='student'&&users.length>0||isSearchStu"
        class="search-student"
        clearable
        size="small"
        placeholder="输入内容 回车搜索学生"
        prefix-icon="el-icon-search"
        v-model.trim="searchStr"
        @keyup.enter.native="searchStu"
        @clear="clearSearch"
      ></el-input>
    </transition>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="教师管理" name="teacher"></el-tab-pane>
      <el-tab-pane label="学生管理" name="student"></el-tab-pane>
    </el-tabs>
    <el-table
      ref="filterTable"
      size="medium"
      v-loading="loading"
      :data="users"
      border
      style="width: 100%"
    >
      <div slot="empty" class="nodata-tip" style="color:#8CC5FF;">
        <svg-icon icon-class="nodata"/>
      </div>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column
        align="center"
        :label="activeName==='student' ? '学生名':'用户名'"
        min-width="100"
        prop="name"
      >
        <template slot-scope="{row}">
          <span v-if="row.name">{{row.name}}</span>
          <span v-else class="null-tip">暂无</span>
        </template>
      </el-table-column>
      <template v-if="activeName==='teacher'">
        <el-table-column key="col-email" align="center" label="邮箱账号" min-width="180" prop="email"></el-table-column>
        <el-table-column key="col-course" align="center" label="拥有课程" min-width="260">
          <template slot-scope="{row}">
            <el-popover
              v-for="(c,index) in row.courses"
              :key="c.id"
              trigger="hover"
              placement="top"
            >
              <div>{{ c.name }}</div>
              <div class="split-line"></div>
              <div>作业数：{{ c.workcount }}</div>
              <div class="split-line"></div>
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
        <el-table-column
          key="col1"
          sortable
          align="center"
          label="学号"
          min-width="100"
          prop="number"
        ></el-table-column>
        <el-table-column
          key="col2"
          align="center"
          :filters="filterData"
          :filter-method="filterClass"
          label="班级"
          min-width="100"
          prop="classname"
        ></el-table-column>
        <el-table-column key="col3" align="center" label="所属课程" min-width="260" prop="courses">
          <template slot-scope="{row}">
            <!-- <el-popover v-for="c in row.courses" :key="c.id" trigger="hover" placement="top">
              <div>邮箱：{{ }}</div>
              <div class="split-line"></div>
              <div>教师：{{ }}</div>
              <div slot="reference">
                <el-tag size="medium">{{ c.name}}</el-tag>
              </div>
            </el-popover>-->
            <el-tag v-for="c in row.courses" :key="c.id" size="medium">{{ c.name}}</el-tag>
            <span v-if="row.courses.length==0" class="null-tip">暂无</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="操作" :width="activeName==='student'?230:140">
        <template slot-scope="{row}">
          <el-button
            v-if="activeName==='student'"
            size="small"
            type="warning"
            plain
            icon="el-icon-refresh"
            @click="resetPwd(row)"
          >重置密码</el-button>
          <el-button
            :disabled="row.admin && row.admin=='true'"
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
      :page-sizes="[8, 20, 40, 60]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { allByPage as allTeacher, deleteTeacher } from "@/api/teacher";
import {
  allByPage as allStudent,
  allBySearch,
  deleteStudent,
  updatePwd
} from "@/api/student";
import md5 from "blueimp-md5";

export default {
  name: "UserManage",
  data() {
    return {
      searchStr: "", //输入搜索学生
      isSearchStu: false, //是否为搜索学生模式
      activeName: "teacher", //默认 教师
      loading: false,
      users: [],
      total: 0, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8, //每页条数
      filterData: [], //要筛选的班级名(对象数组)
      classnameArr: [] //班级名(字符串数组)
    };
  },
  methods: {
    handleClick(tab, event) {
      this.page = 1; //tab改变，恢复为第一页
      this.searchStr = ""; //清空搜索字符串
      this.isSearchStu = false; //取消搜索学生模式
      this.getUser();
    },
    handleSizeChange(val) {
      //改变每页条数
      this.$refs.filterTable.clearFilter(); //清除过滤器
      this.limit = val;
      if (this.isSearchStu) {
        this.searchStu();
      } else {
        this.getUser();
      }
    },
    handleCurrentChange(val) {
      //改变当前页
      this.$refs.filterTable.clearFilter(); //清除过滤器
      this.page = val;
      if (this.isSearchStu) {
        this.searchStu();
      } else {
        this.getUser();
      }
    },
    filterClass(value, row, column) {
      return row.classname === value;
    },
    /**
     * 第几页page对应后台第几页要减1
     */
    getUser(page = this.page - 1, size = this.limit) {
      this.loading = true;
      this.users.splice(0, this.users.length);
      if (this.activeName === "teacher") {
        allTeacher(page, size)
          .then(res => {
            this.loading = false;
            this.users.push(...res.data.teachers);
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
            this.users.push(...res.data.students);
            this.total = res.data.totalElements; //总条数

            this.classnameArr.splice(0, this.classnameArr.length); //清空数组
            this.filterData.splice(0, this.filterData.length); //清空数组
            this.users.forEach((u, index) => {
              //设置筛选数据
              if (!this.classnameArr.includes(u.classname)) {
                this.classnameArr.push(u.classname);
              }
            });
            this.classnameArr.forEach(item => {
              this.filterData.push({ text: item, value: item });
            });
          })
          .catch(error => {
            this.loading = false;
            this.$message.error(error + " 数据获取失败");
          });
      }
    },
    deleteOne(row) {
      let message = null;
      if (this.activeName === "teacher") {
        message =
          "确定要删除教师（" +
          (row.name ? row.name : row.email) +
          "），其拥有的课程均会被删除，不可撤销，是否继续？";
      } else if (this.activeName === "student") {
        message =
          "确定要删除学生（" +
          row.name +
          "），删除后此学生将无法登录进系统，删除不可撤销，是否继续？";
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          if (this.activeName === "teacher") {
            return deleteTeacher(row);
          } else if (this.activeName === "student") {
            return deleteStudent(row);
          } else {
            throw "unknown user role";
          }
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
    },
    resetPwd(row) {
      this.$confirm(
        "确定要重置学生（" + row.name + "）的登录密码为初始密码？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return updatePwd(md5("123456"), row.id); //重置密码
        })
        .then(res => {
          this.loading = false;
          this.$message.success(row.name + " 的密码重置成功！");
        })
        .catch(err => {
          this.loading = false;
          if (err != "cancel") {
            this.$message.error(err + " 密码重置失败！");
          }
        });
    },
    searchStu() {
      if (this.searchStr.length > 0) {
        this.loading = true;
        this.isSearchStu = true;
        allBySearch(this.page - 1, this.limit, this.searchStr)
          .then(res => {
            this.users.splice(0, this.users.length);
            this.loading = false;
            this.users.push(...res.data.students);
            this.total = res.data.totalElements; //总条数

            this.classnameArr.splice(0, this.classnameArr.length); //清空数组
            this.filterData.splice(0, this.filterData.length); //清空数组
            this.users.forEach((u, index) => {
              //设置筛选数据
              if (!this.classnameArr.includes(u.classname)) {
                this.classnameArr.push(u.classname);
              }
            });
            this.classnameArr.forEach(item => {
              this.filterData.push({ text: item, value: item });
            });
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
      if (this.isSearchStu) {
        this.isSearchStu = false;
        this.getUser();
      }
    }
  },
  created() {
    this.getUser();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
//后面将margin: 30px 单独提出到一个公用类
.student-container {
  margin: 16px 30px 30px;
  .search-student {
    position: absolute;
    width: 230px;
    right: 30px;
    z-index: 1;
  }
  .el-popover__reference {
    display: inline-block;
  }
  .el-tag {
    margin: 2px 3px;
  }
  // .el-tag--info {
  //   color: #877bd7;
  //   border-color: rgba(135, 123, 215, 0.2);
  //   background-color: rgba(135, 123, 215, 0.1);
  // }
  .el-pagination {
    padding: 30px 0;
  }
}
</style>
