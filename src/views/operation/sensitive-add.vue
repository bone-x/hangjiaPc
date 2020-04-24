<template>
  <div class="content-container">
    <!-- 运营管理 - 敏感词过滤 - 新建 -->
    <div class="addnew">
      <h4>敏感词信息</h4>
      <div class="tips">
        <el-alert :closable="false" title="Tips: 敏感词最多十个字!" type="warning" style="width:200px;border:1px solid #f5b34f"></el-alert>
      </div>
      <div class="sensitivemsg">
        <div class="sensitiveword">屏蔽敏感词：</div>
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          :disable-transitions="false"
          closable
          style="height:36px;line-height:36px;margin-right:20px;background-color:#fff;border-color:#409eff"
          @close="handleClose(tag)"
        >{{ tag }}</el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          maxlength="10"
          class="input-new-tag"
          size="small"
          style="width:70px"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag btnbg" size="small" @click.native="showInput">+添加敏感词</el-button>
      </div>
      <!-- 屏蔽敏感词存放区 -->
      <div class="sensitive-area"></div>

      <div class="sensitivemsg">
        <div class="sensitiveword">禁用敏感词：</div>
        <el-tag
          v-for="tag in stopDynamicTags"
          :key="tag"
          :disable-transitions="false"
          closable
          style="height:36px;line-height:36px;margin-right:20px;background-color:#fff;border-color:#409eff"
          @close="stopHandleClose(tag)"
        >{{ tag }}</el-tag>
        <el-input
          v-if="stopInputVisible"
          ref="stopSaveTagInput"
          v-model="stopInputValue"
          maxlength="10"
          class="input-new-tag"
          size="small"
          style="width:70px"
          @keyup.enter.native="stopHandleInputConfirm"
          @blur="stopHandleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click.native="stopShowInput">+添加敏感词</el-button>
      </div>

      <div class="end">
        <el-button @click.native="clearSensitive">&nbsp;&nbsp;取 消&nbsp;&nbsp;</el-button>
        <el-button
          v-permission="['operate:sensitive:save']"
          type="primary"
          class="sendcheck"
          @click.native="pushSensitive"
        >&nbsp;&nbsp;确 定&nbsp;&nbsp;</el-button>
      </div>
    </div>
    <!-- 屏蔽敏感词弹窗 -->
    <!-- 禁用敏感词弹窗 -->
  </div>
</template>

<script>
import { sensitiveAddMore } from "@/api/operation";

export default {
  name: "OperationManageSensitiveAdd",
  components: {},
  data() {
    return {
      // 屏蔽敏感词存放
      dynamicTags: [],
      inputVisible: false,
      // 输入的屏蔽敏感词
      inputValue: "",
      // 禁用敏感词存放
      stopDynamicTags: [],
      stopInputVisible: false,
      // 输入的禁用敏感词
      stopInputValue: "",
      ruleForm: {
        textarea3: ""
      },
      centerDialogVisible: false,
      stopCenterDialogVisible: false,
      textarea3: "",
      textarea4: "",
      senData: [],
    };
  },
  computed: {},
  mounted() {
  },
  methods: {
    // 屏蔽敏感词方法
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 点击添加屏蔽敏感词出现input框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 点击空白处确定编辑完敏感词
    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // 禁用敏感词方法
    stopHandleClose(tag) {
      this.stopDynamicTags.splice(this.stopDynamicTags.indexOf(tag), 1);
    },
    // 点击添加禁用敏感词出现input框
    stopShowInput() {
      this.stopInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.stopSaveTagInput.$refs.input.focus();
      });
    },
    // 点击空白处确定编辑完敏感词
    stopHandleInputConfirm() {
      const stopInputValue = this.stopInputValue;
      if (stopInputValue) {
        this.stopDynamicTags.push(stopInputValue);
      }
      this.stopInputVisible = false;
      this.stopInputValue = "";
    },

    // 添加敏感词后点击确定新增
    pushSensitive() {
      const data = {
        // 禁用敏感词
        forbiddenWords: this.stopDynamicTags,
        // 屏蔽敏感词
        invisibleWords: this.dynamicTags
      };
      sensitiveAddMore(data)
        .then(res => {
          this.$message.success("敏感词添加成功！");
          this.$store.dispatch("delView", this.$route);
          this.$router.go(-1);
          this.clearMsg();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 提交后清空
    clearMsg() {
      this.dynamicTags = '';
      this.stopDynamicTags = '';
    },

    // 点击取消清空敏感词
    clearSensitive() {
      this.dynamicTags = '';
      this.stopDynamicTags = '';
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },
  }
};
</script>

<style scoped lang="scss">
.addnew {
  padding: 20px;
  padding-left: 40px;
  .tips {
    margin: 30px 0;
  }
  .sensitivemsg {
    font-size: 13px;
    display: flex;
    line-height: 36px;
    margin-bottom: 20px;
    .sensitiveword {
      font-weight: bold;
      margin-right: 20px;
    }
    .writesensitive {
      margin-left: 20px;
    }
  }
  .sensitive-area {
    padding-left: 95px;
    display: flex;
    margin-bottom: 20px;
    width: 80%;
    // 实现换行
    flex-wrap: wrap;
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 50px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
  .end {
    margin: 45px 0px;
    display: flex;
    justify-content: center;
    .sendcheck {
      margin-left: 10%;
    }
  }
}
.sensitive-dialog {
  padding: 0 10px;
  display: flex;
  .sensitive-title {
    line-height: 30px;
    margin-bottom: 10px;
    width: 20%;
  }
  .el-dialog__body {
    padding: 0px 20px !important;
  }
  .inputword {
    width: 50%;
  }
}
.attention {
  text-align: left;
  padding-left: 20%;
  li {
    line-height: 30px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
