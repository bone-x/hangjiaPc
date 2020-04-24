<template>
  <div class="content-container">
    <!-- 网站信息管理 - 版权说明修改列表 - 编辑 -->
    <Tinymce :value="tinymceContent" @input="getContent" />
    <el-row class="content">
      <el-col :span="12">
        <el-button type="info" class="aglin" @click="goback">取消</el-button>
      </el-col>
      <el-col :span="12">
        <el-button   v-permission = "['organization:update:update']" type="primary" class="aglin" @click="onSubmit" >保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Tinymce from "@/components/Tinymce";
  import { getAgreement, updateAgreement } from "@/api/settled.js";

  export default {
    name: "SettledManageAgreement",
    components: {
      Tinymce
    },
    data() {
      return {
        tinymceContent: ""
      };
    },
    created() {
      getAgreement().then(response => {
        console.log(response, "版权说明的接口返回");
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
        updateAgreement(data).then(response => {
          this.$router.go(-1);
          this.$message({
            message: "入驻协议修改成功",
            type: "success"
          });
          console.log(response);
          this.$store.dispatch("delView", this.$route);
        });
      },
      getContent(data) {
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
