<template>
  <section class="content-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="medium"
    >
      <el-form-item label="选用模板：">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-select
              v-model="form.templateType"
              placeholder="请选择通知类型"
              @change="changeHandler"
            >
              <el-option
                v-for="item in templateType"
                :key="item.id"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select
              v-model="form.templateName"
              placeholder="请选择模板名称"
              @change="changeName"
            >
              <el-option
                v-for="item in templateName"
                :key="item.id"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="发送模块："
        prop="sendPosition"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-radio-group
              :disabled="!!form.templateName"
              v-model="form.sendPosition"
              @change="watchTemplateId"
            >
              <el-radio :label="10">平台消息</el-radio>
              <el-radio :label="20">课程消息</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="app推送通知:"
        prop="pushFlag"
      >
        <el-switch
          v-model="form.pushFlag"
          active-value="1"
          inactive-value="0"
          @click.native="appClick()"
        >></el-switch>
      </el-form-item>

      <el-form-item
        label="应用类型："
        prop="pushPosition"
        v-if="form.pushFlag==1"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-checkbox-group v-model="form.pushPosition">
              <el-checkbox :label="20">安卓应用</el-checkbox>
              <el-checkbox :label="10">苹果应用</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- <el-form-item label="推送类型：" prop="pushEventType" v-if="form.pushFlag==1">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="form.pushEventType">
              <el-option
                v-for="item in pushEventType"
                :key="item.id"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item> -->

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="推送类型："
            prop="pushEventType"
            v-if="form.pushFlag==1"
          >
            <el-row :gutter="20">
              <el-col :span="4">
                <el-select
                  v-model="form.pushEventType"
                  style="width: 380px"
                >
                  <el-option
                    v-for="item in pushEventType"
                    :key="item.id"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="URL地址："
            prop="pushEventUrl"
            v-if="form.pushEventType == 20"
          >
            <el-row :gutter="20">
              <el-col :span="4">
                <el-input
                  v-model="form.pushEventUrl"
                  placeholder="请输入链接地址"
                  style="width: 380px"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="通知标题："
        prop="title"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.title"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="消息内容："
        prop="content"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <div style="position: relative;">
              <tinymce
                :height="300"
                v-model="form.content"
                @on-init="onTinymceInit"
                @input="onTinymceInput"
              />
              <!-- <div v-if="form.templateName" class="disabled-mask"></div> -->
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="发送对象："
        prop="sendObj"
      >
        <el-row
          :gutter="20"
          style="padding-top: 10px;"
        >
          <el-col :span="20">
            <el-radio-group v-model="form.sendObj">
              <el-row style="margin-bottom: 20px">
                <el-radio label="10">所有成员</el-radio>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <el-radio label="20">指定学员</el-radio>
              </el-row>
            </el-radio-group>
            <el-row v-if="form.sendObj == 20">
              <el-col :span="10">
                <el-input
                  v-model="form.sendObjList"
                  type="textarea"
                  placeholder="输入手机号，多个用英文逗号隔开"
                ></el-input>
              </el-col>
            </el-row>
            <el-row v-if="form.sendObj == 20">
              <el-col :span="10">
                <div class="studentData">
                  <a
                    href="javascript:;"
                    class="file"
                  >
                    批量导入用户
                    <input
                      type="file"
                      name="file1"
                      accept=".xlsx, .xls"
                      @change="onchangeSuccess"
                      :readonly="msg.name"
                    />
                  </a>
                  <a
                    href="javascript:;"
                    class="fileName"
                  >{{msg.name}}</a>
                  <el-button
                    type="primary"
                    size="mini"
                    class="button"
                    @click.native="loadExcelTable"
                  >下载表格模板</el-button>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="发送时间："
        prop="sendTimeType"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <el-radio-group v-model="form.sendTimeType">
              <el-radio label="10">暂不发送</el-radio>
              <el-radio label="20">立即发送</el-radio>
              <el-radio label="30">
                定时发送&nbsp;&nbsp;
                <el-date-picker
                  v-if="form.sendTimeType == 30"
                  v-model="form.sendTimeValue"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-row
          :gutter="20"
          style="padding-left: 10px; padding-top: 20px;"
        >
          <el-col :span="5">
            <el-button
              type="primary"
              @click.native="submitForm('form')"
            >确定</el-button>
          </el-col>
          <el-col :span="5">
            <el-button @click.native="goBack">返回</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import {
  getContentByid,
  updateMessageContent,
  queryAll,
  importSendTemp,
  downloadImportTemp,
} from '@/api/message';
import { formatDate } from '@/utils';
let tinymceId;

export default {
  name: 'StudentMessagesEdit',
  components: {
    Tinymce,
  },

  data() {
    return {
      msg: {},
      value2: true,
      pushEventType: [
        {
          text: '接收通知跳转到行家app消息通知列表页面',
          value: 10,
          id: 1,
        },
        {
          text: '接收通知打开URL',
          value: 20,
          id: 2,
        },
      ],
      resMsg: [],
      templateName: [],
      templateType: [
        {
          text: '请选择通知类型',
          value: '0',
          id: 3,
        },
        {
          text: '平台通知',
          value: '10',
          id: 1,
        },
        {
          text: '课程通知',
          value: '20',
          id: 2,
        },
      ],
      form: {
        templateId: null,
        templateType: '0',
        templateName: '',
        title: '',
        sendObjList: '',
        sendObj: '',
        content: '',
        sendPosition: '',
        sendTimeType: '',
        dateTime: '',
        pushFlag: 0,
        pushPosition: [],
        pushEventType: '',
        sendTimeValue: '',
        pushEventUrl: '',
      },
      fileList: [],
      // 表单校验
      rules: {
        title: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur',
          },

          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '长度不超过30个字符',
            trigger: 'blur',
          },
        ],
        content: [
          {
            required: true,
            message: '请填写消息内容',
            trigger: 'blur',
          },
        ],
        sendObj: [
          {
            required: true,
            message: '请选择发送对象',
          },
        ],
        sendPosition: [
          {
            required: true,
            message: '请选择发送模板',
          },
        ],
        pushFlag: [
          {
            required: true,
            message: '请选择app推送通知',
          },
        ],
        pushEventType: [
          {
            required: true,
            message: '请选择推送类型',
          },
        ],

        pushPosition: [
          {
            required: true,
            message: '请填写应用内容',
          },
        ],
        sendTimeType: [
          {
            required: true,
            message: '请选择发送时间',
          },
        ],
        pushEventUrl: [
          {
            required: true,
            message: '请输入链接地址',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  mounted() {
    this.initData();
  },

  // 方法
  methods: {
    // 编辑器初始化完成
    onTinymceInit(id) {
      tinymceId = id;
      // 初始化渲染数据
      this.getInitMsg();
    },

    async getInitMsg() {
      const res = await getContentByid(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();
      this.form.id = res.data.message.id;
      if (
        res.data.message.teachMsgTempId === undefined ||
        res.data.message.teachMsgTempId === 0
      ) {
        this.form.templateId = null;
      } else {
        this.form.templateId = String(res.data.message.teachMsgTempId);
      }
      this.resMsg.forEach(item => {
        if (this.form.templateId === item.id) {
          this.form.templateType = String(item.tempType);
          this.form.templateName = item.name;
        }
      });
      this.form.sendObj = String(res.data.message.sendObj);
      this.form.sendPosition = res.data.message.sendPosition;
      this.form.sendTimeType = String(res.data.message.sendTimeType);
      this.form.content = res.data.message.content;
      this.form.title = res.data.message.title;
      this.form.pushFlag = String(res.data.message.pushFlag);
      if (res.data.message.pushFlag === 1) {
        this.form.pushPosition = res.data.message.pushPosition
          .split(',')
          .map(Number);
        this.form.pushEventType = res.data.message.pushEventType;
      }
      if (res.data.message.pushEventType === 20) {
        this.form.pushEventUrl = res.data.message.pushEventUrl;
      }
      if (res.data.message.sendObj === 20) {
        this.form.sendObjList = res.data.message.objValue;
        this.msg = res.data.fileList;
      }
      if (res.data.message.sendTimeType === 30) {
        this.form.sendTimeValue = res.data.message.sendTimeValue;
      }
    },

    // 页面初始化
    async initData() {
      // 调用查看所有上架的模板的方法
      const res = await queryAll(1);
      if (res.code !== 200) return Promise.reject();
      // 渲染数据
      // this.templateType = [];
      // res.result.forEach(item=>{
      //   this.templateType.push(item.tempType);
      // })
      this.resMsg = res.result;
    },

    // 监听编辑器输入事件
    onTinymceInput(content) {
      this.form.content = content;
    },
    // 提交表单
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const options = {
            id: this.form.id,
            templateId: this.form.templateId, // 非
            pushFlag: Number(this.form.pushFlag), // app推送
            sendPosition: String(this.form.sendPosition), // 发送模板
            title: this.form.title,
            content: this.form.content,
            sendObjType: this.form.sendObj,
            sendTimeType: Number(this.form.sendTimeType), // 推送时间
          };
          if (this.form.pushFlag == 1) {
            options.pushPosition = this.form.pushPosition;
            options.pushEventType = this.form.pushEventType;
          }
          if (this.form.pushFlag == 1 && this.form.pushEventType == 20) {
            options.pushEventType = this.form.pushEventType;
            options.pushEventUrl = this.form.pushEventUrl;
          }
          if (this.form.sendObj == 20) {
            options.sendObjList = this.form.sendObjList;
          }
          if (this.form.sendTimeType == 30) {
            options.sendTimeValue = this.form.sendTimeValue;
            const date = new Date();
            const sendTime = new Date(this.form.sendTimeValue);
            if (sendTime <= date) {
              this.$confirm(
                '你设置的推送时间不可以等于当前时间，请重新设置！',
                '提示',
                {
                  confirmButtonText: '确定',
                  type: 'warning',
                }
              ).then(() => {
                this.form.sendTimeValue = '';
              });
            }
          }
          updateMessageContent(options).then(res => {
            if (res.code === 200) {
              this.$message.success('编辑成功');
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
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },

    // 2级联动
    changeHandler() {
      this.form.templateName = '';
      this.templateName = [];
      window.tinymce.get(tinymceId).setContent('');
      this.form.sendPosition = '';
      if (this.form.templateType === '0') return false;

      this.resMsg.forEach(item => {
        if (this.form.templateType === String(item.tempType)) {
          this.templateName.push(item);
        }
      });
    },
    // 3級联动
    changeName() {
      this.form.sendPosition = '';
      this.form.templateId = '';
      this.resMsg.forEach(item => {
        if (this.form.templateType === String(item.tempType)) {
          if (this.form.templateName === item.name) {
            window.tinymce.get(tinymceId).setContent(item.content);
            this.form.sendPosition = item.tempType;
            this.form.templateId = String(item.id);
          }
        }
      });
    },

    onchangeFile() {},

    //app推送点击
    appClick() {
      console.log(this.form.pushFlag);
    },

    changeTime(arr) {
      //console.log(arr);
      console.log(this.form.sendTimeValue);
    },

    // 导出模板
    async loadExcelTable() {
      const res = await downloadImportTemp();
      if (res.code != 200) return Promise.reject();
      if (res.url) {
        window.open(res.url, '_self');
      }
    },

    // 导入Excel
    onchangeSuccess(event) {
      const file = event.target.files[0];
      this.msg = file;
      const formData = new FormData();
      formData.append('file', file);
      const option = formData;
      importSendTemp(option).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '导入成功',
          });
          this.form.sendObjList = res.sendObjList;
        }
      });
    },

    // 监听是否选用模板
    watchTemplateId() {
      this.form.templateId = null;
    },
  },
};
</script>

<style lang="less" scoped>
.disabled-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 99%;
  height: 100%;
  z-index: 1000;
  cursor: url('/static/disabled.ico'), auto;
}
.studentData {
  margin-top: 15px;
  min-width: 900px;
  .file {
    position: relative;
    display: inline-block;
    border: 1px solid #fbc4c4;
    padding: 4px 10px;
    overflow: hidden;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    border-radius: 5px;
    color: #f56c6c;
    font-size: 12px;
    border-color: 1px solid #fbc4c4;
    background: #fef0f0; /* 一些不支持背景渐变的浏览器 */
    background: -moz-linear-gradient(top, #fff, #fef0f0);
    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#fff), to#fef0f0);
    background: -o-linear-gradient(top, #fff, #fef0f0);
    margin-right: 10px;
    vertical-align: middle;
  }
  .file:hover {
    background: #f56c6c;
    color: #ffffff;
  }
  .file input {
    cursor: pointer;
    position: absolute;
    font-size: 50px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0);
  }
  .fileName {
    margin-right: 10px;
  }
  .button {
    margin-left: 0px;
  }
}
</style>
