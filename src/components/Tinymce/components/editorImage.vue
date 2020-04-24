<template>
  <div class="upload-container">
    <el-button
      :style="{background:color,borderColor:color}"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click=" dialogVisible=true"
    >上传图片</el-button>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <el-upload
        :action="action"
        :headers="headers"
        :data="data"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import getUploadSign from '@/api';
import generateId from 'nanoid/generate';

export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff"
    },
    accept: {
      type: Array,
      default: () => ['image/jpeg', 'image/jpg', 'image/png'],
    },
    maxFileSize: {
      type: Number,
      default: 0.3,
    },
  },
  data() {
    return {
      action: '',
      headers: {},
      data: {},
      dialogVisible: false,
      listObj: {},
      fileList: []
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        item => this.listObj[item].hasSuccess
      );
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message(
          "请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！"
        );
        return;
      }
      this.$emit("successCBK", arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },

    handleSuccess(response, file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          // this.listObj[objKeyArr[i]].url = response.files.file;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },

    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    async beforeUpload(file) {
      const { size, type, name, uid } = file;
      const oldName = name;
      const nameArr = oldName.split('.');
      const fileName = nameArr[0] + '-' + generateId('0123456789qwertyuiopasdfghjklzxcvbnm', 15) + '.' + nameArr[1];
      // 判断文件类型
      const isFileType = this.accept.some(accept => accept === type);
      if (!isFileType) {
        this.$message.warning(`该文件（${oldName}）类型（${type}）不支持`);
        return Promise.reject();
      }

      // 判断文件大小
      const KB = size / 1024;
      const MB = KB / 1000;
      if (MB > this.maxFileSize) {
        let unit = `${this.maxFileSize}m`;
        if (this.maxFileSize < 1) {
          unit = `${Math.floor(this.maxFileSize * 1000)}kb`;
        }
        this.$message.warning(`该文件（${oldName}）大小已超过限制（${unit}）`);
        return Promise.reject();
      }

      // 请求签名
      const sign = await getUploadSign({ dir: 'images', key: fileName });
      
      // 填充签名参数
      this.action = sign.host;
      this.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST"
      };
      this.data = {
        key: `${sign.dir}${fileName}`,
        policy: sign.policy,
        OSSAccessKeyId: sign.accessid,
        success_action_status: 200,
        signature: sign.signature,
        callback: sign.callback,
      };

      this.listObj[uid] = {
        type,
        size,
        uid,
        oldName,
        name: fileName,
        url: `${sign.host}/${sign.dir}${fileName}`,
        hasSuccess: false,
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
