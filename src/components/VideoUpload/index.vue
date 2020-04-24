<template>
  <el-form :model="videoForm" label-width="100px" class="form">
    <el-form-item prop="Video">
      <el-upload
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleVideoSuccess"
        :before-upload="beforeUploadVideo"
        :on-progress="uploadVideoProcess"
        class="avatar-uploader el-upload--text"
      >
        <video
          v-if="videoForm.Video !='' && videoFlag == false"
          id="videoPlayer"
          :src="videoForm.Video"
          class="avatar"
          width="200px"
          height="150px"
          controls="controls"
        >您的浏览器不支持视频播放</video>
        <i
          v-else-if="videoForm.Video =='' && videoFlag == false"
          class="el-icon-plus avatar-uploader-icon"
        ></i>
        <el-progress v-if="videoFlag == true" :percentage="videoUploadPercent" type="circle"></el-progress>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CourseManageCourseDatabase",
  components: {},
  data() {
    return {
      uploadUrl: "https://jsonplaceholder.typicode.com/posts/",
      videoForm: {
        Video: "http://www.runoob.com/try/demo_source/movie.mp4"
      },
      videoFlag: false,
      videoUploadPercent: 0,
      Duration: 0,
    };
  },
  methods: {
    beforeUploadVideo(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传视频大小不能超过5MB哦!");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
    },
    handleVideoSuccess(res, file) {
      // 获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res.status === 200) {
        this.videoForm.videoUploadId = res.data.uploadId;
        this.videoForm.Video = res.data.uploadUrl;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    }
  }
};
</script>

<style scoped>
.form {
  display: inline;
  float: left;
}
</style>
