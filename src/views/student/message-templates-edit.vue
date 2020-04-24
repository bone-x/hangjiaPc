<template>
  <div class="content-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
      <el-form-item label="模板类型" prop="templateType">
        <el-select v-model="form.templateType" disabled placeholder="请选择活动区域">
          <el-option label="模板消息" value="0"></el-option>
          <el-option label="课程通知" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" style="width: 285px" prop="templateName">
        <el-input v-model="form.templateName"></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="form.messageType" :disabled="true" placeholder="请选择活动区域">
          <el-option label="系统消息" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息内容" prop="desc">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="2">
            <el-button type="primary" @click.native="addStudentName">添加学员姓名</el-button>
          </el-col>
          <el-col :span="2">
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
          <el-radio label="上架" value="1"></el-radio>
          <el-radio label="下架" value="0"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-row :gutter="20" style="margin-bottom: auto">
          <el-col :span="3">
            <el-button type="primary" @click.native="submitForm('form')">确定</el-button>
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
import { queryById, editMsgByid } from "@/api/message";

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
  name: "StudentMessageTemplatesEdit",
  components: {
    Tinymce
  },
  // 定义字段
  data() {
    return {
      form: {
        templateName: "",
        templateType: "0",
        messageType: "0",
        desc: "",
        state: ""
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

  watch: {
    // 如果路由有变化，会再次执行该方法
    // $route: "onRouteChange"
  },

  mounted() {
  },

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
      // 获取表单的数据再组件加载的时候
      this.getMsgByid();
    },

    // 监听编辑器输入事件
    onTinymceInput(content) {
      this.form.desc = content;
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 提交表单
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const options = {
            id: this.$route.params.id,
            templateName: this.form.templateName,
            msgContent: this.form.desc,
            status: 0
          };
          if (this.form.state === "上架") {
            options.status = 1;
          }
          if (this.form.state === "下架") {
            options.status = 0;
          }
          editMsgByid(options).then(res => {
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
    // 组件加载的时候渲染数据
    async getMsgByid() {
      const res = await queryById(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();
      this.form.templateName = res.template.name;
      if (res.template.tempType === 10) {
        this.form.templateType = "课程消息";
      } else if (res.template.tempType === 20) {
        this.form.templateType = "平台消息";
      }
      if (res.template.msgType === 20) {
        this.form.noticeType = "系统消息";
      }
      window.tinymce.get(tinymceId).setContent(res.template.content);

      if (res.template.status === 1) {
        this.form.state = "上架";
      }
      if (res.template.status === 0) {
        this.form.state = "下架";
      }
    }
  }
};
</script>

<style lang="less">
</style>
