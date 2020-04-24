<template>
  <div style="width:440px;height:340px;">
    <draggable v-model="colors" @update="datadragEnd" :options="{animation:500}">
      <transition-group>
        <div
          v-for="(item, index) in colors"
          :key="index"
          style="display:inline-block;padding-right:5px;background:#ccc;"
        >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar">
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </transition-group>
    </draggable>
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :limit="8"
      :on-exceed="handleExceed"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      colors: [],
      startArr: [],
      endArr: [],
      count: 0,
      imageUrl: ""
    };
  },
  components: {
    draggable
  },
  methods: {
    getdata(evt) {
      console.log(evt.draggedContext.element.text);
    },
    datadragEnd(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.colors);
    },
    handleAvatarSuccess(res, file) {
      const imageUrl = URL.createObjectURL(file.raw);
      this.colors.push({
        imageUrl
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传8张图片哦`);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "png";
      const isLt2M = file.size / 1024 / 1024 < 1000;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG / PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {
    // 为了防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
