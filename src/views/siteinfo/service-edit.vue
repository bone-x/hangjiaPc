<template>
  <div class="content-container">
    <!-- 网站信息管理 - 服务协议 - 修改 -->
    <Tinymce :value="tinymceContent" @input="getContent"/>
    <el-row class="content">
      <el-col :span="12">
        <el-button type="info" class="aglin" @click="goback">取消</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" class="aglin" @click="onSubmit">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { submitServiceagreement, getServiceagreementdata } from "@/api/siteinfo.js";

export default {
  name: "SiteinfoServiceEdit",
  components: {
    Tinymce
  },
  data() {
    return {
      tinymceContent: ""
    };
  },
  created() {
    getServiceagreementdata().then(response => {
      console.log(response, "回显内容");
      this.tinymceContent = response.result.content;
    });
  },
  methods: {
    goback() {
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    },
    onSubmit() {
      const data = {
        content: this.content,
      };
      submitServiceagreement(data).then(response => {
        this.$router.go(-1);
        this.$message({
          message: "服务协议修改成功",
          type: "success"
        });
        console.log(response);
        this.$store.dispatch("delView", this.$route);
      });
    },
    getContent(data) {
      console.log(data, 11111111111111);
      this.content = data;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding-top: 20px;
  .aglin {
    display: block;
    margin: auto;
  }
}
</style>
