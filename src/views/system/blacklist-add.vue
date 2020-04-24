<template>
  <div class="content-container">
    <!-- 系统管理 - IP黑名单 - 新建 -->
    <div>
      <h3>添加IP黑名单</h3>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="IP黑名单">
        <el-input v-model="form.ipBlack"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submit">保存</el-button>
    <el-button type="info" @click="cancel">取消</el-button>
  </div>
</template>

<script>
import { addBlackList } from "@/api/system";

export default {
  name: "IPBlacklistAdd",
  components: {},
  data() {
    return {
      form: {
        ipBlack: ""
      }
    };
  },
  methods: {
    submit() {
      if (this.form.ipBlack === '') {
        this.$message({
          type: "warning",
          message: "请输入IP地址"
        });
      } else {
        const data = {
          blackIp: this.form.ipBlack
        };
        addBlackList(data).then(response => {
          this.$message({
            type: "success",
            message: "添加IP黑名单成功"
          });
          console.log(response);
          this.$router.go(-1);
          this.form.ipBlack = "";
        });
      }
    },
    cancel() {
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    }
  }
};
</script>

<style lang="less">
h3 {
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid rgb(221, 208, 208);
  margin-bottom: 80px;
  display: block;
}
.el-input {
  width: 15%;
}
</style>
