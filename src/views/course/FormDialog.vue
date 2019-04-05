<!-- no use -->
<template>
  <div>
    <el-dialog custom-class="add-course" width="40%" title="添加课程" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="课程名称：">
          <el-input clearable maxlength="20" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="课程简介：">
          <el-input maxlength="50" type="textarea" v-model="form.info"></el-input>
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
export default {
  name: "FormDialog",
  props: {
    data: Array, //传入的数据需为数组,
    index: Number,
    dialogFormVisible: false,
  },
  data() {
    return {
      // dialogFormVisible: false,
      form: {
        name: "",
        info: ""
      }
    };
  },
  methods: {
    handleAdd() {
      this.dialogFormVisible = false;
      addCourse(this.$store.getters.id, this.form.name, this.form.info)
        .then(res => {
          const data = res.data;
          console.log(data);
          this.$message.success("添加成功!");

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    }
  }
};
</script>

