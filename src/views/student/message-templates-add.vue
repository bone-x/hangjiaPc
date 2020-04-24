<template>
  <div class="content-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="medium">
      <el-form-item label="模板类型" prop="templateType">
        <el-select v-model="form.templateType" placeholder="请选择活动区域">
          <el-option label="平台通知" value="10"></el-option>
          <el-option label="课程通知" value="20"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" style="width: 285px" prop="templateName">
        <el-input v-model="form.templateName"></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="form.messageType" placeholder="请选择活动区域">
          <el-option label="系统消息" value="20"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息内容" prop="desc">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="4">
            <el-button type="primary" @click.native="addStudentName">添加学员姓名</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click.native="addStudentAccount">添加学员账号</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <tinymce
              :height="300"
              v-model="form.desc"
              @on-init="onTinymceInit"
              @input="onTinymceInput"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="上架状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio :label="1" >上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-row :gutter="20" style="margin-bottom: auto">
          <el-col :span="3">
            <el-button type="primary" @click.native="submitForm('form')">立即创建</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="danger" @click.native="goBack">返回</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { insertMsg } from "@/api/message";

let tinymceId;

/**
 * 为富文本内容区行内插值
 * @params { String }  str   待插值的字符串
 * @params { String }  text  插值的字符串
 * @returns { String }       返回处理后的字符串
 */
const appendToTinymceContent = function (str, text) {
  if (String(str).trim().length === 0) return `<p>${text}</p>`;
  const reg = new RegExp(/(<\/.?>$)/);
  return String(str)
    .trim()
    .replace(reg, text + RegExp.$1);
};

export default {
  name: "StudentMessageTemplatesAdd",
  components: {
    Tinymce
  },
  data() {
    return {
      form: {
        templateName: "",
        templateType: "10",
        messageType: "20",
        desc: "",
        state: 1
      },
      // 表单校验
      rules: {
        templateType: [
          { required: true, message: "请选择模本类型", trigger: "change" }
        ],
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度不超过30个字符", trigger: "blur" }
        ],
        messageType: [
          { required: true, message: "请选择消息类型", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写消息内容", trigger: "blur" }],
        state: [
          { required: true, message: "请选择上架状态", trigger: "change" }
        ]
      }
    };
  },

  mounted() {
  },

  // 方法
  methods: {
    // 在富文本里面添加姓名
    addStudentName() {
      const res = appendToTinymceContent(this.form.desc, "{name}");
      window.tinymce.get(tinymceId).setContent(res);
    },

    // 在富文本里面添加学员账号
    addStudentAccount() {
      const res = appendToTinymceContent(this.form.desc, "{account}");
      window.tinymce.get(tinymceId).setContent(res);
    },

    // 编辑器初始化完成
    onTinymceInit(id) {
      tinymceId = id;
    },

    // 监听编辑器输入事件
    onTinymceInput(content) {
      this.form.desc = content;
    },
    // 提交表单
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const options = {
            templateName: this.form.templateName,
            templateType: this.form.templateType,
            msgType: this.form.messageType,
            msgContent: this.form.desc,
            status: this.form.state,
          };
          if (this.form.state === "上架") {
            options.status = 1;
          }

          if (this.form.state === "下架") {
            options.status = 0;
          }
          insertMsg(options).then(res => {
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
    // 提交返回主页面
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less">
</style>
