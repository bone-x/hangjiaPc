<template>
  <div class="crawling-read-me-container">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      size="small"
      label-width="200px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="ID："
            prop="id"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.id}}</span>
            </el-col>
          </el-form-item>
          <el-form-item
            label="项  目  名："
            prop="projectname"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.projectname}}</span>
            </el-col>
          </el-form-item>
          <el-form-item
            label="项目来源："
            prop="project_from"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.project_from}}</span>
            </el-col>
          </el-form-item>

          <el-form-item
            label="状 态："
            prop="status"
            class="title"
          >
            <el-col :span="8">
              <span
                v-if="ruleForm.status === 1"
                class="content"
              >新增</span>
              <span
                v-if="ruleForm.status === 2"
                class="content"
              >更新</span>
            </el-col>
          </el-form-item>
          <el-form-item
            label="创建时间："
            prop="crawl_time"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.crawl_time}}</span>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="star 数："
            prop="star"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.star}}</span>
            </el-col>
          </el-form-item>
          <el-form-item
            label="fork 数："
            prop="fork"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.fork}}</span>
            </el-col>
          </el-form-item>
          <el-form-item
            label="watch 数："
            prop="watch"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.watch}}</span>
            </el-col>
          </el-form-item>
          <el-form-item
            label="版  本："
            prop="version"
            class="title"
          >
            <el-col :span="8">
              <span class="content">{{ruleForm.version}}</span>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="readMe："
          prop="readme"
          class="title"
        >
          <el-col :span="8">
            <span
              v-html="ruleForm.readme"
              class="content"
            ></span>
          </el-col>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getReadMeDetails } from '@/api/crawling';

export default {
  name: 'ReadMe',
  data() {
    return {
      ruleForm: {},
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    getDetails() {
      const data = {
        type: 'github',
        id: this.$route.params.id,
      };
      getReadMeDetails(data)
        .then(res => {
          this.ruleForm = res.result.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.crawling-read-me-container {
  padding: 40px;
  /deep/ .title .el-form-item__label {
    font-size: 16px;
    .content {
      font-size: 16px;
    }
  }
}
</style>