<template>
  <div class="content-container">
    <section class="system-version-edit">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="formRules"
        size="small"
        label-position="right"
        label-width="200px"
        style="margin-top: 30px;"
      >
        <el-form-item label="版本类型：" prop="clientType">
          <el-col :span="8">
            <el-select v-model="form.clientType" placeholder="请选择版本类型">
              <el-option value="ios" label="ios"></el-option>
              <el-option value="android" label="android"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="最小版本号：" prop="minVersionCode">
          <el-col :span="8">
            <el-input
              v-model="form.minVersionCode"
              style="width: 100%;"
              size="medium"
              min="1"
              step="1"
              type="number"
              placeholder="请输入最小版本号"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="版本编码：" prop="versionCode">
          <el-col :span="8">
            <el-input
              v-model="form.versionCode"
              style="width: 100%;"
              size="medium"
              min="1"
              step="1"
              type="number"
              placeholder="请输入版本编码"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="版本名称：" prop="versionName">
          <el-col :span="8">
            <el-input
              v-model="form.versionName"
              style="width: 100%;"
              size="medium"
              placeholder="请输入版本名称"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="更新意愿：" prop="updateStrategy">
          <el-col :span="8">
            <el-select v-model="form.updateStrategy" placeholder="请选择更新意愿">
              <el-option :value="0" label="推荐升级"></el-option>
              <el-option :value="1" label="强制升级"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="下载地址：" prop="downloadUrl">
          <el-col :span="8">
            <el-input
              v-model="form.downloadUrl"
              style="width: 100%;"
              size="medium"
              placeholder="请输入下载地址"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="更新内容细节：" prop="updateDetail">
          <el-col :span="8">
            <el-input
              v-model="form.updateDetail"
              style="width: 100%;"
              size="medium"
              type="textarea"
              placeholder="请输入更新内容细节"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item
          ref="form-item-md5"
          :required="form.clientType === 'android'"
          label="MD5值："
          prop="md5"
        >
          <el-col :span="8">
            <el-input v-model="form.md5" style="width: 100%;" size="medium" placeholder="请输入MD5值"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-col :span="8">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option :value="1" label="上线"></el-option>
              <el-option :value="2" label="下线"></el-option>
              <el-option :value="3" label="灰度升级"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="灰度用户列表：" prop="updateUserList">
          <el-col :span="8">
            <el-input
              v-model="form.updateUserList"
              style="width: 100%;"
              size="medium"
              placeholder="请输入灰度用户列表（英文逗号分隔）"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item style="margin-top: 50px;">
          <el-button type="primary" @click.native="submitForm('ruleForm')">确定</el-button>
          <el-button style="margin-left: 100px;" @click.native="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { editVersion, getSysVersionDetail } from "@/api/system-version";
import { formatDate } from "@/utils";

export default {
  name: "SystemVersionVersionManageEdit",
  components: {},
  data() {
    return {
      form: {
        clientType: "",
        minVersionCode: 1,
        versionCode: "",
        versionName: "",
        updateStrategy: "",
        downloadUrl: "",
        updateDetail: "",
        md5: "",
        status: "",
        updateUserList: ""
      },
      formRules: {
        clientType: [
          {
            required: true,
            message: "请选择版本类型",
            validator: (rule, value, callback) => {
              if (value !== "android") {
                this.$refs["form-item-md5"].clearValidate();
              }
              callback();
            }
          }
        ],
        minVersionCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value < 1) {
                callback(new Error("请输入最小版本号（最小值为1）"));
              } else {
                if (value)
                  this.form.minVersionCode = Math.floor(
                    this.form.minVersionCode
                  );
                callback();
              }
            }
          }
        ],
        versionCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value < 1) {
                callback(new Error("请输入版本编码（最小值为1）"));
              } else {
                if (value) {
                  this.form.versionCode = Math.floor(this.form.versionCode);
                }
                callback();
              }
            }
          }
        ],
        versionName: [{ required: true, message: "请输入版本名称" }],
        updateStrategy: [{ required: true, message: "请选择更新意愿" }],
        downloadUrl: [{ required: true, message: "请输入下载地址" }],
        updateDetail: [{ required: true, message: "请输入更新内容细节" }],
        md5: [
          {
            validator: (rule, value, callback) => {
              if (this.form.clientType === "android" && !value) {
                callback(new Error("请输入MD5值"));
              } else {
                callback();
              }
            }
          }
        ],
        status: [{ required: true, message: "请选择状态" }]
      }
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const options = {
        id: this.$route.params.id
      };
      const res = await getSysVersionDetail(options);
      if (res.code !== 200) return Promise.reject();
      this.form.clientType = res.result.clientType;
      this.form.minVersionCode = res.result.minVersionCode;
      this.form.versionCode = res.result.versionCode;
      this.form.versionName = res.result.versionName;
      this.form.updateStrategy = res.result.updateStrategy;
      this.form.downloadUrl = res.result.downloadUrl;
      this.form.updateDetail = res.result.updateDetail;
      this.form.md5 = res.result.md5;
      this.form.updateUserList = res.result.updateUserList;
      if (res.result.isGreyUpdate === 1) {
        this.form.status = 3;
      } else if (res.result.isActive === 1) {
        this.form.status = 1;
      } else if (res.result.isActive === 0) {
        this.form.status = 2;
      }
    },
    // 返回上一页
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const options = {
            id: this.$route.params.id,
            clientType: this.form.clientType,
            downloadUrl: this.form.downloadUrl,
            md5: this.form.md5,
            minVersionCode: this.form.minVersionCode,
            updateDetail: this.form.updateDetail,
            updateStrategy: this.form.updateStrategy,
            updateUserList: this.form.updateUserList,
            versionCode: this.form.versionCode,
            versionName: this.form.versionName
          };

          if (this.form.status === 1) options.isActive = 1;
          else if (this.form.status === 2) options.isActive = 0;
          else if (this.form.status === 3) options.isGreyUpdate = 1;

          editVersion(options).then(res => {
            if (res.code === 200) {
              this.$message.success("编辑成功");
              this.$store.dispatch("delView", this.$route);
              this.$router.go(-1);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.system-version-edit {
  .input-box {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    color: #ccc;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: #fff;
    cursor: pointer;
    user-select: none;
    &.active {
      color: #333;
      border-color: #67c23a;
    }
  }
  .cell-height-40 {
    height: 40px;
    line-height: 40px;
  }

  .cell-height-40 .el-form-item__label {
    height: 40px;
    line-height: 40px;
  }

  .dialog-window .el-radio__label {
    display: none;
  }
}
</style>
