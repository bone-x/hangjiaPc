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
        <el-button size="medium" @click.native="onPreview">保存/预览</el-button>
        <el-button
          size="medium"
          style="margin-left: 100px;"
          type="primary"
          @click.native="submitForm('ruleForm')"
        >提交</el-button>
        <el-button size="medium" style="margin-left: 100px;" @click.native="goBack">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 预览 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="state.isShowPreviewWindow"
      title="预览"
      width="800px"
      custom-class="dialog-window"
    >
      <el-row :gutter="20">
        <el-col :span="10">
          <section class="simulator">
            <div class="title">预览区</div>
            <simulator :title="ruleForm.activityName" :popup-img="ruleForm.h5ImgUrl"/>
          </section>
        </el-col>
        <el-col :span="14">
          <h2 style="padding-left: 25px; margin-top: 120px;">请扫码预览</h2>
          <qrcode :options="{ width: 200 }" :value="h5PreviewUrl"/>
          <h2 class="web-preview-href">
            落地页地址：
            <a
              :href="webPreviewUrl"
              :title="webPreviewUrl"
              class="web-preview-href-a"
              target="_blank"
            >{{ webPreviewUrl }}</a>
          </h2>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import uploadSingle from "@/components/Upload/single";
import NullImgFile from "@/assets/null.png";
import simulator from "@/components/simulator-activity";
import qrcode from "@chenfengyuan/vue-qrcode";
import { createActivity } from "@/api/operation";

export default {
  name: "OperationActivityManageAdd",
  components: {
    uploadSingle,
    simulator,
    qrcode
  },
  data() {
    return {
      NullImgFile,
      webPreviewUrl: "",
      h5PreviewUrl: "",
      state: {
        isShowPreviewWindow: false
      },
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
        isActive: [{ required: true }]
      }
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "onRouteChange"
  },
  mounted() {
    this.initData();
    console.log(process.env.ENV_CONFIG);
  },
  methods: {
    onRouteChange(to) {},

    // 页面初始化
    async initData() {},

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

    // 预览
    onPreview() {
      if (process.env.ENV_CONFIG === "prod") {
        this.h5PreviewUrl = `http://hengqihj.com/landing_page?scene=1132&source=pc&img=${encodeURIComponent(
          this.ruleForm.h5ImgUrl
        )}&link=${encodeURIComponent(this.ruleForm.h5BtnLink)}`;

        this.webPreviewUrl = `http://hengqihj.com/landing_page?scene=1132&source=pc&img=${encodeURIComponent(
          this.ruleForm.webImgUrl
        )}&link=${encodeURIComponent(this.ruleForm.webBtnLink)}`;
      } else {
        this.h5PreviewUrl = `http://hengqihj.beta.hqjy.com/landing_page?scene=1132&source=pc&img=${encodeURIComponent(
          this.ruleForm.h5ImgUrl
        )}&link=${encodeURIComponent(this.ruleForm.h5BtnLink)}`;

        this.webPreviewUrl = `http://hengqihj.beta.hqjy.com/landing_page?scene=1132&source=pc&img=${encodeURIComponent(
          this.ruleForm.webImgUrl
        )}&link=${encodeURIComponent(this.ruleForm.webBtnLink)}`;
      }
      this.state.isShowPreviewWindow = true;
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const options = {
            activityName: this.ruleForm.activityName,
            actiityBeginTime: this.ruleForm.activityDate[0],
            actiityEndTime: this.ruleForm.activityDate[1],
            webImageUrl: this.ruleForm.webImgUrl,
            appImageUrl: this.ruleForm.h5ImgUrl,
            webJumpUrl: this.ruleForm.webBtnLink,
            appJumpUrl: this.ruleForm.h5BtnLink,
            popWindowStatus: this.ruleForm.isActive
          };
          createActivity(options).then(res => {
            if (res.code === 200) {
              this.$message.success("添加成功");
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
.simulator {
  position: relative;
  height: 500px;
  width: 100%;
  overflow: hidden;
  .title {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 18px;
  }
}

.simulator /deep/ #simulator-container {
  top: -55px;
  left: -30px;
  right: auto;
  bottom: auto;
  overflow: visible;
  transform: scale(0.5, 0.5) translateY(-20px);
}

.web-preview-href {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding-left: 25px;
  &-a {
    display: inline-block;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: red;
  }
}
</style>
