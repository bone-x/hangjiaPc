<template>
  <div class="content-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="180px"
      style="margin-top: 30px;"
    >
      <el-form-item label="活动名称：" prop="activityName">
        <el-row :gutter="20" type="flex" align="middle">
          <el-col :span="8">
            <el-input
              v-model="ruleForm.activityName"
              style="width: 100%;"
              size="medium"
              max="20"
              clearable
              placeholder="请输入活动名称"
            ></el-input>
          </el-col>
          <el-col :span="8" style="color: #999;">不超过20个中文</el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="活动时间：" prop="activityDate" style="margin-top: 30px;">
        <el-row :gutter="20" type="flex" align="middle">
          <el-col :span="4">
            <el-date-picker
              v-model="ruleForm.activityDate[0]"
              type="datetime"
              placeholder="请输入活动开始时间"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <span>-</span>
          <el-col :span="4">
            <el-date-picker
              v-model="ruleForm.activityDate[1]"
              type="datetime"
              placeholder="请输入活动结束时间"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="web端活动图片：" prop="webImgUrl" style="margin-top: 30px;">
        <el-row :gutter="20" type="flex" align="middle">
          <div class="goods-cover-container">
            <img
              v-show="ruleForm.webImgUrl"
              :src="ruleForm.webImgUrl"
              style="width: 100%; height: 100%;"
              preview="1"
              preview-text="web端活动图片"
            >
            <img v-show="!ruleForm.webImgUrl" :src="NullImgFile" style="width: 100%; height: 100%;">
          </div>

          <upload-single :max-file-size="2" @successCBK="url => onSingleUploadSuccess(url, 'web')">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传图片</el-button>
          </upload-single>
        </el-row>
      </el-form-item>

      <el-form-item label="h5端活动图片：" prop="h5ImgUrl" style="margin-top: 30px;">
        <el-row :gutter="20" type="flex" align="middle">
          <div class="goods-cover-container">
            <img
              v-show="ruleForm.h5ImgUrl"
              :src="ruleForm.h5ImgUrl"
              style="width: 100%; height: 100%;"
              preview="2"
              preview-text="h5端活动图片"
            >
            <img v-show="!ruleForm.h5ImgUrl" :src="NullImgFile" style="width: 100%; height: 100%;">
          </div>

          <upload-single :max-file-size="2" @successCBK="url => onSingleUploadSuccess(url, 'h5')">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传图片</el-button>
          </upload-single>
        </el-row>
      </el-form-item>

      <el-form-item label="web端按钮跳转的链接：" prop="webBtnLink">
        <el-row :gutter="20" type="flex" align="middle">
          <el-col :span="8">
            <el-input
              v-model="ruleForm.webBtnLink"
              style="width: 100%;"
              size="medium"
              max="20"
              clearable
              placeholder="按钮跳转链接"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="h5端按钮跳转的链接：" prop="h5BtnLink">
        <el-row :gutter="20" type="flex" align="middle">
          <el-col :span="8">
            <el-input
              v-model="ruleForm.h5BtnLink"
              style="width: 100%;"
              size="medium"
              max="20"
              clearable
              placeholder="按钮跳转链接"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="弹窗状态：" prop="isActive">
        <el-row :gutter="20" type="flex" align="middle">
          <el-col :span="8">
            <el-switch
              v-model="ruleForm.isActive"
              :title="ruleForm.isActive ? '启用' : '关闭'"
              active-color="#13ce66"
            ></el-switch>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item style="margin-top: 50px;">
        <el-button
          size="medium"
          style="margin-left: 100px;"
          type="primary"
          @click.native="submitForm('ruleForm')"
        >确定</el-button>
        <el-button size="medium" style="margin-left: 100px;" @click.native="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadSingle from "@/components/Upload/single";
import NullImgFile from "@/assets/null.png";
import { editActivity, getActivityById } from "@/api/operation";
import { formatDate } from "@/utils";

export default {
  name: "OperationActivityManageEdit",
  components: {
    uploadSingle
  },
  data() {
    return {
      NullImgFile,
      state: {},
      config: {},
      ruleForm: {
        activityName: "",
        activityDate: [],
        webImgUrl: "",
        h5ImgUrl: "",
        webBtnLink: "",
        h5BtnLink: "",
        isActive: false
      },
      rules: {
        activityName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (String(value).length > 20) {
                callback(new Error("不能超过20个字"));
              } else if (String(value) === "") {
                callback(new Error("请输入活动名称"));
              } else {
                callback();
              }
            }
          }
        ],
        activityDate: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.ruleForm.activityDate[0]) {
                callback(new Error("请输入活动开始时间"));
              } else if (!this.ruleForm.activityDate[1]) {
                callback(new Error("请输入活动结束时间"));
              } else {
                callback();
              }
            }
          }
        ],
        webImgUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.ruleForm.webImgUrl) {
                callback(new Error("请选择web端活动图片"));
              } else {
                callback();
              }
            }
          }
        ],
        h5ImgUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.ruleForm.webImgUrl) {
                callback(new Error("请选择web端活动图片"));
              } else {
                callback();
              }
            }
          }
        ],
        webBtnLink: [
          {
            required: true,
            message: "请输入web端按钮跳转的链接",
            trigger: "blur"
          }
        ],
        h5BtnLink: [
          {
            required: true,
            message: "请输入web端按钮跳转的链接",
            trigger: "blur"
          }
        ],
        isActive: [
          {
            required: true,
            validator: (rule, value, callback) => {
              callback();
            }
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "onRouteChange"
  },
  mounted() {
    this.getDetailsById();
  },
  methods: {
    onRouteChange(to) {},

    // 获取信息
    async getDetailsById() {
      const res = await getActivityById(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();

      // 活动名称
      this.ruleForm.activityName = res.result.activityName;
      // 活动时间 - 开始
      if (res.result.actiityBeginTime)
        this.ruleForm.activityDate[0] = formatDate(
          res.result.actiityBeginTime,
          8
        );
      // 活动时间 - 结束
      if (res.result.actiityEndTime)
        this.ruleForm.activityDate[1] = formatDate(
          res.result.actiityEndTime,
          8
        );
      this.ruleForm.activityDate = this.ruleForm.activityDate.concat([]);
      // web图片
      this.ruleForm.webImgUrl = res.result.webImageUrl;
      // h5图片
      this.ruleForm.h5ImgUrl = res.result.appImageUrl;
      // web 跳转链接
      this.ruleForm.webBtnLink = res.result.webJumpUrl;
      // h5 跳转链接
      this.ruleForm.h5BtnLink = res.result.appJumpUrl;
      // 是否显示
      this.ruleForm.isActive = res.result.popWindowStatus;
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 上传图片
    onSingleUploadSuccess(url, type) {
      if (type === "web") {
        this.ruleForm.webImgUrl = url;
      } else if (type === "h5") {
        this.ruleForm.h5ImgUrl = url;
      }
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const options = {
            id: this.$route.params.id,
            activityName: this.ruleForm.activityName,
            actiityBeginTime: this.ruleForm.activityDate[0],
            actiityEndTime: this.ruleForm.activityDate[1],
            webImageUrl: this.ruleForm.webImgUrl,
            appImageUrl: this.ruleForm.h5ImgUrl,
            webJumpUrl: this.ruleForm.webBtnLink,
            appJumpUrl: this.ruleForm.h5BtnLink,
            popWindowStatus: this.ruleForm.isActive
          };
          editActivity(options).then(res => {
            if (res.code === 200) {
              this.$message.success("编辑成功");
              this.goBack();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.ruleForm = {};

      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.goods-cover-container {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  width: 200px;
  height: 120px;
  border: 1px solid #ebeef5;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
</style>
