<template>
  <div class="copyright">2019.3 - {{date}} &copy; duanmingwang</div>
</template>

<script>
import { createDate } from "@/utils/date";
export default {
  name: "Copyright",
  data() {
    return {
      date: ""
    };
  },
  created() {
    this.date = createDate("yyyy.mm");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.copyright{
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  color: #9ea7b4;
}
</style>
