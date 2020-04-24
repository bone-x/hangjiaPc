<template>
  <el-upload
    ref="single-upload"
    :action="uploadConf.action"
    :multiple="false"
    :headers="uploadConf.headers"
    :data="uploadConf.data"
    :before-upload="onBeforeUpload"
    :on-progress="onProgress"
    :on-success="onSuccess"
    :limit="5"
    :show-file-list="false"
  >
  <slot></slot>
  </el-upload>
</template>

<script>
import getUploadSign from "@/api";
import nanoid from "nanoid";

// 随机文件名
export default {
  name: "CSingleUpload",
  components: {},
  props: {
    accept: {
      type: Array,
      default: () => []
    },
    maxFileSize: {
      type: Number,
      default: 20
    },
    files: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      uploadConf: {
        action: "",
        headers: {},
        data: {},
        fileList: []
      },
      fileObj: null,
    };
  },
  methods: {
    // 上传前拦截
    async onBeforeUpload(file) {
      const { size, type, name, uid } = file;
      const oldName = name;
      const nameArr = oldName.split('.');
      const fileName = nameArr[0] + '-' + nanoid(28) + '.' + nameArr[1];

      // 判断文件类型
      // const isFileType = this.accept.some(accept => accept === type);
      // if (!isFileType) {
      //   this.$message.warning(`该文件（${oldName}）类型（${type}）不支持`);
      //   return Promise.reject();
      // }

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
      const sign = await getUploadSign({ dir: type.split('/')[0], key: fileName });
      
      // 显示上传对象
      this.fileObj = {
        type,
        size,
        uid,
        oldName,
        name: fileName,
        url: (window.URL || window.webkitURL).createObjectURL(file),
        ossUrl: `${sign.host}/${sign.dir}${fileName}`,
        progress: 0,
        isUpload: false
      };

      // 填充签名参数
      this.uploadConf.data = {
        key: `${sign.dir}${fileName}`,
        policy: sign.policy,
        OSSAccessKeyId: sign.accessid,
        success_action_status: 200,
        signature: sign.signature,
        callback: sign.callback,
      };
      this.uploadConf.action = sign.host;
      this.uploadConf.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST"
      };
      // return Promise.reject();
    },

    // 更新文件上传进度
    onProgress(event) {
      const { percent } = event;
      this.$emit("on-progress", percent);
    },

    // 更新文件上传成功状态
    onSuccess(response, file) {
      this.$emit('successCBK', this.fileObj.ossUrl, this.fileObj);
    },
  }
};
</script>

<style lang="less" scoped>
</style>
