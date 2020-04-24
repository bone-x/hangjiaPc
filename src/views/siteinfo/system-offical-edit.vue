<template>
  <div class="content-container">
    <!-- 修改文案 -->
    <el-row style="margin-bottom: 20px;">
      <el-col :span="24">
        <h3>修改{{title}}</h3>
      </el-col>
    </el-row>
    <Tinymce
      :value="tinymceContent"
      @input="getContent"
    />
    <el-row class="content">
      <el-col :span="12">
        <el-button
          type="info"
          class="aglin"
          @click="goback"
        >取消</el-button>
      </el-col>
      <el-col
        v-permission="['web:copywriting:update']"
        :span="12"
      >
        <el-button
          type="primary"
          class="aglin"
          @click="onSubmit"
        >保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { systemDocumentCheck, systemDocumentUpdate } from '@/api/siteinfo.js';
import Tinymce from '@/components/Tinymce';

export default {
  name: 'SystemOfficalEdit',
  components: {
    Tinymce,
  },
  data() {
    return {
      tinymceContent: '',
      title: '',
      contentMsg: {
        id: '',
        type: '',
        content: '',
      },
    };
  },
  created() {
    this.title = this.$route.query.name;
    this.getSystemDetails();
  },
  methods: {
    // 获取协议详情
    getSystemDetails() {
      const params = {
        id: this.$route.params.id,
      };
      systemDocumentCheck(params).then(res => {
        this.tinymceContent = res.result.content;
        this.contentMsg.id = res.result.id;
        this.contentMsg.type = res.result.type;
        this.contentMsg.content = res.result.content;
      });
    },

    // 返回
    goback() {
      this.$router.go(-1);
      this.$store.dispatch('delView', this.$route);
    },

    // 保存
    onSubmit() {
      let newContent = this.content ? this.content : this.tinymceContent;
      const data = {
        id: this.contentMsg.id,
        type: this.contentMsg.type,
        content: newContent,
        operateType: 2,
      };
      systemDocumentUpdate(data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
        });
      });
    },
    getContent(data) {
      this.content = data;
    },
  },
};
</script>
<style lang="less" scoped>
.content-container {
  .content {
    padding-top: 20px;
    .aglin {
      display: block;
      margin: auto;
    }
  }
}
</style>