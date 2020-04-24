<template>
  <div class="content-container">
    <!-- 查看文案 -->
    <el-row>
      <el-col :span="24">
        <h3>查看{{title}}</h3>
      </el-col>
    </el-row>
    <div style="position: relative;margin-top: 20px;">
      <div class="systemContent">
        <p
          v-html="content"
          class="contentDetails"
        ></p>
      </div>
    </div>
    <el-row class="content">
      <el-col :span="24">
        <el-button
          type="info"
          class="aglin"
          @click="goback"
        >返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { systemDocumentCheck } from '@/api/siteinfo.js';
import Tinymce from '@/components/Tinymce';

export default {
  name: 'SystemOfficalCheck',
  components: {
    Tinymce,
  },
  data() {
    return {
      tinymceContent: '',
      title: '',
      content: '',
    };
  },
  created() {
    this.title = this.$route.query.name;
    this.getSystemDetails();
  },
  methods: {
    getSystemDetails() {
      const params = {
        id: this.$route.params.id,
      };
      systemDocumentCheck(params).then(res => {
        this.content = res.result.content;
      });
    },

    // 返回
    goback() {
      this.$router.go(-1);
      this.$store.dispatch('delView', this.$route);
    },
  },
};
</script>
<style lang="less" scoped>
.content-container {
  .systemContent {
    width: 100%;
    height: 500px;
    padding: 20px;
    border: 1px solid #333333;
    overflow-y: auto;
    .contentDetails {
      font-size: 14px;
    }
  }
  .content {
    padding-top: 20px;
    .aglin {
      display: block;
      margin: auto;
    }
  }
}
</style>