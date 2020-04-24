<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-26 18:00:10
 * @LastEditTime: 2019-09-02 15:53:51
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="upload-container">
    <div style="display: inline-block;" @click="dialogVisible=true">
      <slot></slot>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="900px"
      title="文件上传"
    >
      <draggable v-model="draggableArr" :move="onDraggableMove" class="draggable-container">
        <div v-for="(element, index) in draggableArr" :key="index" class="item">
          <div class="img-box">
            <img :src="element.url">
          </div>
          <div class="mask">
            <i class="el-icon-error clear" @click="onDeleteDraggableArrItem(index)"></i>
          </div>
          <div v-if="element.progress < 100" class="progress">{{ element.progress }}%</div>
          <div v-else-if="element.isUpload" class="progress100"></div>
        </div>
        <el-upload
          ref="upload"
          :action="uploadConf.action"
          :limit="limit"
          :headers="uploadConf.headers"
          :data="uploadConf.data"
          :on-exceed="handleExceed"
          :before-upload="onBeforeUpload"
          :on-progress="onProgress"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="true"
          :file-list="fileList"
          :class="{ hide: draggableArr.length >= limit }"
          multiple
          class="item item-add"
        >+</el-upload>
      </draggable>
      <el-row slot="footer">
        <el-button @click.native="onCancelUpload">取 消</el-button>
        <el-button type="primary" @click.native="handleSubmit">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import getUploadSign from "@/api";
import nanoid from 'nanoid';
import generateId from 'nanoid/generate';

// 随机文件名
export default {
  name: "CMultiUploadImage",
  components: {
    draggable
  },
  props: {
    color: {
      type: String,
      default: "#1890ff"
    },
    accept: {
      type: Array,
      default: () => ["image/jpeg", "image/jpg", "image/png"]
    },
    maxFileSize: {
      type: Number,
      default: 0.3
    },
    limit: {
      type: Number,
      default: 8
    },
    files: {
      type: Array,
      default: () => []
    },
    size: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      uploadConf: {
        action: "",
        headers: {},
        data: {},
        fileList: []
      },
      draggableArr: []
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        this.cancelAllUpload();
        this.draggableArr = [];
      } else {
        this.initData();
      }
    }
  },
  methods: {
    onCancelUpload() {
      if (this.$refs.upload && this.$refs.upload.clearFiles) {
        this.$refs.upload.clearFiles();
      }
      this.dialogVisible = false;
    },
    // 如果传入files 图片url数组，则进行初始化
    initData() {
      /**
        draggableArr item:
          {
            type,
            size,
            uid,
            oldName,
            name: fileName,
            url: (window.URL || window.webkitURL).createObjectURL(file),
            ossUrl: `${sign.host}/${sign.dir}${fileName}`,
            progress: 0,
            isUpload: false
          }
       */
      if (this.files.length > 0) {
        const newFiles = [];
        this.draggableArr = this.files.map((imgUrl = String) => {
          const urlSplit = String(imgUrl).split("/");
          const fileName = urlSplit[urlSplit.length - 1];
          newFiles.push({ name: fileName, url: imgUrl });
          return {
            uid: nanoid(16),
            oldName: fileName,
            name: fileName,
            url: imgUrl,
            ossUrl: imgUrl,
            progress: 100,
            isUpload: true
          };
        });
        this.fileList = newFiles;
      }
    },
    // 拖拽如果是添加框，则取消拖拽
    onDraggableMove(evt) {
      const { element } = evt.draggedContext;
      if (!element) return false;
    },

    // 删除一个图片项
    onDeleteDraggableArrItem(index) {
      this.draggableArr.splice(index, 1);
      document.querySelectorAll('.draggable-container .el-upload-list__item')[index].querySelector('.el-icon-close').click();
    },

    // dialog - 确定
    handleSubmit() {
      // 检查文件是否全部上传成功
      const noUploadAll = this.draggableArr.some(fileObj => !fileObj.isUpload);
      if (noUploadAll) {
        this.$message.warning(`请等待所有图片上传成功`);
      } else {
        this.$emit(
          "successCBK",
          this.draggableArr.map(fileObj => fileObj.ossUrl)
        );
        this.dialogVisible = false;
      }
    },

    // 当上传的张数超过指定数量时，发出提醒
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    // 上传前拦截
    async onBeforeUpload(file) {
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

      // 判断规格
      if (this.size.length > 0) {
        const sizeW = this.size[0];
        const sizeH = this.size[1];

        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = rfile => {
            const img = new Image();
            img.src = rfile.target.result;
            img.onload = () => {
              // 宽度判断
              if (sizeW && img.width !== sizeW) {
                this.$message.warning(`该文件（${oldName}）分辨率（宽）不合格`);
                reject();
                return;
              }
              // 高度判断
              if (sizeH && img.height !== sizeH) {
                this.$message.warning(`该文件（${oldName}）分辨率（宽）不合格`);
                reject();
                return;
              }
              resolve();
            };
            img.onerror = () => {
              this.$message.error('当前浏览器无法使用该功能，请升级浏览器（推荐Chrome浏览器）');
            };
            resolve();
          };
          reader.onerror = () => {
            this.$message.error('当前浏览器无法使用该功能，请升级浏览器（推荐Chrome浏览器）');
            reject();
          };
        });
      }

      // 判断文件大小
      const KB = size / 1024;
      const MB = KB / 1000;
      if (MB > this.maxFileSize) {
        let unit = `${this.maxFileSize}M`;
        if (this.maxFileSize < 1) {
          unit = `${Math.floor(this.maxFileSize * 1000)}kb`;
        }
        this.$message.warning(`该文件（${oldName}）大小已超过限制（${unit}）`);
        return Promise.reject();
      }

      // 请求签名
      const sign = await getUploadSign({
        dir: type.split("/")[0],
        key: fileName
      });
      // 显示上传对象
      const fileObj = {
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
      this.draggableArr.push(fileObj);

      // 填充签名参数
      this.uploadConf.data = {
        key: `${sign.dir}${fileName}`,
        policy: sign.policy,
        OSSAccessKeyId: sign.accessid,
        success_action_status: 200,
        signature: sign.signature
      };
      this.uploadConf.action = sign.host;
      this.uploadConf.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST"
      };
      // return Promise.reject();
    },

    // 更新文件上传进度
    onProgress(event, file) {
      const { uid } = file;
      const { percent } = event;
      this.draggableArr.some(fileObj => {
        if (fileObj.uid === uid) {
          fileObj.progress = Math.floor(percent);
          return true;
        }
        return false;
      });
    },

    // 更新文件上传成功状态
    onSuccess(response, file) {
      const { uid } = file;
      this.draggableArr.some(fileObj => {
        if (fileObj.uid === uid) {
          fileObj.isUpload = true;
          return true;
        }
        return false;
      });
    },

    // 移除文件
    onError(err, file) {
      const { uid } = file;
      const newDraggableArr = [];
      this.draggableArr.forEach(fileObj => {
        if (fileObj.uid !== uid) {
          newDraggableArr.push(fileObj);
        } else {
          this.$message.warning(`该文件（${fileObj.oldName}）上传失败，请重试`);
        }
      });
      this.draggableArr = newDraggableArr;
    },

    // 取消上传任务()
    cancelAllUpload() {
      const newDraggableArr = [];
      this.draggableArr.forEach(fileObj => {
        if (fileObj.isUpload) {
          newDraggableArr.push(fileObj);
        } else {
          const file = this.fileList.filter(i => i.uid === fileObj.uid)[0];
          if (file) {
            this.$refs.upload.abort(file);
          }
        }
      });
      this.draggableArr = newDraggableArr;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
.draggable-container {
  .item {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    width: 100px;
    height: 100px;
    border: 1px solid #999;
    line-height: 1;
    box-sizing: border-box;
    font-size: 60px;
    line-height: 100px;
    text-align: center;
    &:hover {
      .mask {
        display: inline-block;
      }
    }
    &-add {
      border-style: dashed;
      vertical-align: top;
      overflow: hidden;

      &.hide {
        padding: 0;
        margin: 0;
        height: 0;
        width: 0;
        border: 0;
        overflow: hidden;
      }
    }
    .img-box {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .mask {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 20;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      .clear {
        display: inline-block;
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 22;
        width: 20px;
        height: 20px;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
      }
    }
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 15;
      width: 100%;
      height: 100%;
      font-size: 16px;
      color: #fff;
    }
    .progress100 {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 15;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 10px #67c23a;
    }
  }
}
</style>
