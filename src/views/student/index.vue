<template>
  <div class="student-container">
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12">
          课程：&nbsp;
          <el-select @change="courseChange" v-model="courseId" placeholder="请选择课程" size="medium">
            <el-option
              v-for="course in courses"
              :key="'optc'+course.id"
              :label="course.name"
              :value="course.id"
            >
              <span style="float: left">{{ course.name }}</span>
              <span
                style="margin-left: 10px; line-height: 36px; float: right; color: #c0c4cc; font-size: 13px"
              >{{ '学生:'+course.stucount }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-button
            :disabled="!courseId"
            size="medium"
            @click="dialogFormVisible = true"
            icon="el-icon-circle-plus-outline"
          >添加学生</el-button>
          <router-link
            v-if="courseId"
            :to="{ name: 'addStudent', params: { courseId,courseName}}"
            tag="span"
          >
            <el-button size="medium" icon="el-icon-upload2">导入学生</el-button>
          </router-link>
          <el-button v-else disabled size="medium" icon="el-icon-upload2">导入学生</el-button>

          <!-- <el-button :disabled="!courseId" size="medium" icon="el-icon-printer">统计成绩</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <!-- <div class="table-title">{{courseName?courseName:"??课程"}} 学生表</div> -->
      <el-table
        size="medium"
        v-loading="loading"
        :data="students"
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
        <el-table-column align="center" label="学号">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model.trim="row.number" maxlength="10" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ row.number }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="班级">
          <!-- <el-table-column width="120px" align="center" label="班级"> -->
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.classname" maxlength="20" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ row.classname }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column min-width="300px" label="姓名"> -->
        <el-table-column align="center" label="姓名">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.name" maxlength="10" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
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
              icon="el-icon-circle-close-outline"
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
      <transition enter-active-class="animated zoomInUp" :duration="{ leave: 0 }" appear>
        <el-alert
          v-if="courses.length!=0&&!courseId"
          title="请先选择一个课程"
          type="warning"
          center
          show-icon
        ></el-alert>
      </transition>
    </div>
    <el-dialog
      custom-class="my-dialog"
      width="40%"
      title="添加学生"
      :visible.sync="dialogFormVisible"
      @closed="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="addStuForm" label-width="70px">
        <el-form-item label-width="10px" label>添加学生到课程：{{courseName}}</el-form-item>

        <el-form-item label="学号：" prop="number">
          <el-input maxlength="10" clearable v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="班级：" prop="classname">
          <el-input maxlength="20" clearable v-model="form.classname"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input maxlength="10" clearable v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";
import {
  allStudentByCid,
  isExist,
  addStudent,
  updateStudent,
  addSC,
  deleteSC,
  haveOne
} from "@/api/student";
import { isvalidStudentID } from "@/utils/validate";
import md5 from "blueimp-md5";
export default {
  name: "Student",
  data() {
    const validateStudentId = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("学号不能为空"));
      } else if (!isvalidStudentID(value)) {
        callback(new Error("请输入10位学号"));
      } else {
        callback();
      }
    };
    return {
      courseId: "",
      courseName: "",
      loading: false,
      courses: [],
      total: 0, //数据总条数
      page: 1, //当前第几页（前端从1算起，后端从0算起）
      limit: 8, //每页条数
      students: [],
      dialogFormVisible: false,
      form: {
        number: "",
        classname: "",
        name: "",
        password: md5("123456") //学生登录默认密码123456
      },
      rules: {
        number: [
          { required: true, trigger: "blur", validator: validateStudentId }
        ],
        classname: [
          { required: true, message: "班级不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "班级名长度在 2 到 20 个字符",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "姓名长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    courseId() {}
  },
  methods: {
    handleSizeChange(val) {
      //改变每页条数
      this.limit = val;
      this.getStudent(this.courseId);
    },
    handleCurrentChange(val) {
      //改变当前页
      this.page = val;
      this.getStudent(this.courseId);
    },
    handleDblClick(row, column, event) {
      row.edit = true;
    },
    // 因为下拉框的@change事件，因此参数为cid
    courseChange(cid) {
      //下拉框选择课程一改变，就重置页数page到第一页
      this.page = 1;
      this.getStudent(cid);
    },
    /**
     * 第几页page对应后台第几页要减1
     */
    getStudent(cid, page = this.page - 1, size = this.limit) {
      this.loading = true;
      let obj = {};
      obj = this.courses.find(item => {
        return item.id === cid; //每次cid改变，筛选出匹配课程id的课程
      });
      this.courseName = obj.name; //设置对应课程名

      allStudentByCid(cid, page, size)
        .then(res => {
          this.loading = false;
          this.total = res.data.students.totalElements;
          this.students = res.data.students.content;
          this.students = this.students.map(stu => {
            this.$set(stu, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
            stu.originalNumber = stu.number; //  取消编辑后使用original值
            stu.originalClassname = stu.classname;
            stu.originalName = stu.name;
            return stu;
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    CurrentRowChange(row, oldRow) {
      // console.log("row",row);
      console.log("oldRow", oldRow);
      if (oldRow && oldRow.edit) {
        this.cancelEdit(oldRow);
      }
    },
    cancelEdit(row) {
      row.number = row.originalNumber;
      row.classname = row.originalClassname;
      row.name = row.originalName;
      row.edit = false;
    },
    confirmEdit(row) {
      // console.log("row", row);
      //先判断学号是否存在，确保唯一性
      if (!isvalidStudentID(row.number)) {
        this.$message.warning("请输入10位学号！");
        return false;
      }
      isExist(row.number)
        .then(res => {
          if (res.message == "true") {
            //存在此学号，还和此输入框原始值不一样，说明学号会重复，不能添加
            if (row.number != row.originalNumber) {
              this.$message.warning("输入的学号已存在，请更改！");
              throw "学号已存在";
            }
          }
          return updateStudent(row.number, row.classname, row.name, row.id);
        })
        .then(res => {
          this.$message.success("更新成功！");
          row.edit = false;
          row.originalNumber = row.number;
          row.originalClassname = row.classname;
          row.originalName = row.name;
        })
        .catch(error => {
          this.cancelEdit(row); //出现错误就取消编辑
          this.$message.error(error + " 更新失败！");
        });
    },
    deleteOne(row) {
      this.$confirm(
        "确定要将学生（" +
          row.name +
          "）从课程（" +
          this.courseName +
          "）内删除，不可撤销，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return deleteSC(row.id, this.courseId);
        })
        .then(res => {
          this.$message.success("删除成功！"); //不用设置loading，接下来获取数据有设置loading
          this.getStudent(this.courseId); //删除后重新获取数据
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
    handleClose() {
      //移除校验结果并重置表单为初始值
      this.$refs.addStuForm.resetFields();
    },
    handleAdd() {
      this.$refs.addStuForm.validate(valid => {
        if (valid) {
          haveOne(this.form.number)
            .then(res => {
              if (res.data) {
                let stu = res.data.student;
                return this.$confirm(
                  "系统中已存在学号为" +
                    stu.number +
                    "的学生（班级：" +
                    stu.classname +
                    "，姓名：" +
                    stu.name +
                    "），是否添加此学生？",
                  "提示",
                  {
                    confirmButtonText: "添加",
                    cancelButtonText: "取消",
                    type: "warning"
                  }
                )
                  .then(res => {
                    this.dialogFormVisible = false;
                    this.loading = true;
                    return stu.id; //此学生已存在，直接返回此学生id
                  })
                  .catch(res => {
                    return ""; //点击取消，返回空
                  });
              } else {
                //学生不存在，则执行添加学生
                return addStudent([this.form]);
              }
            })
            .then(res => {
              console.log("res--res:", res);
              if (res.data && res.data.sid) {
                //若为添加完学生再返回的数据data，sid为res.sid[0]
                return addSC([{ sid: res.sid[0], cid: this.courseId }]);
              } else if (typeof res === "number") {
                //已存在学生的情况，直接返回了sid, res为sid
                return addSC([{ sid: res, cid: this.courseId }]);
              } else {
                return "";
              }
            })
            .then(res => {
              if (res) {
                //以上return为空的将不执行
                this.$message.success("添加成功！");
                this.getStudent(this.courseId); //添加后重新获取数据
              }
            })
            .catch(err => {
              this.dialogFormVisible = false;
              this.loading = false;
              this.$message.error(err + " 添加失败！");
            });
        }
      });
    }
  },
  created() {
    if (this.$route.params.courseId && this.$route.params.courseName) {
      this.courseId = this.$route.params.courseId;
      this.courseName = this.$route.params.courseName;
      this.courses.push({
        id: this.courseId,
        name: this.courseName
      });
      this.getStudent(this.courseId);
    }

    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
      })
      .catch(error => {
        // this.loading = false;
        this.$message.error(error + " 数据获取失败");
      });
  }
};
</script>
<style lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.student-container {
  margin: 30px;
  .title-bar {
    color: #444;
    padding: 0 0 20px;
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
  }
  .content-area {
    .table-title {
      color: #909399;
      padding: 12px 0;
    }
    .edit-input {
      margin-top: 1px;
      width: 90%;
    }
    .el-pagination {
      padding: 30px 0;
    }
  }
}
</style>
