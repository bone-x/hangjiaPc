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
        label="发送模板："
        prop="sendPosition"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-radio-group
              :disabled="!!form.templateName"
              v-model="form.sendPosition"
              @change="watchTemplateId"
            >
              <el-radio label="10">平台消息</el-radio>
              <el-radio label="20">课程消息</el-radio>
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
                    v-for="item in pushType"
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
            v-if="form.pushEventType === 20"
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
            <el-input
              v-model="form.title"
              placeholder="标题30个字"
              maxlength="30"
            ></el-input>
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
        prop="sendObjType"
      >
        <el-row
          :gutter="20"
          style="padding-top: 10px;"
        >
          <el-col :span="20">
            <el-radio-group v-model="form.sendObjType">
              <el-row style="margin-bottom: 20px">
                <el-radio label="10">所有成员</el-radio>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <el-radio label="20">指定学员</el-radio>
              </el-row>
            </el-radio-group>
            <el-row v-if="form.sendObjType == 20">
              <el-col :span="10">
                <el-input
                  v-model="form.sendObjList"
                  type="textarea"
                  placeholder="输入手机号，多个用英文逗号隔开"
                ></el-input>
              </el-col>
            </el-row>
            <el-row v-if="form.sendObjType == 20">
              <el-col :span="6">
                <div class="studentData">
                  <a
                    href="javascript:;"
                    class="file"
                  >
                    批量导入学员
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
              <el-radio label="40">
                活动期间发送&nbsp;&nbsp;
                <el-date-picker
                  v-if="form.sendTimeType == 40"
                  v-model="form.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>

                <el-time-picker
                  v-model="form.dateRangeTime"
                  v-if="form.sendTimeType == 40"
                  placeholder="任意时间点"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                ></el-time-picker>
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
  queryAll,
  createdMessageContent,
  downloadImportTemp,
  importSendTemp,
} from '@/api/message';
import { dateTimeRange, formatDate } from '@/utils';

let tinymceId;

export default {
  name: 'StudentMessagesAdd',
  components: {
    Tinymce,
  },

  data() {
    return {
      msg: {},
      value2: true,
      pushType: [
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
        sendObjList: '',
        templateType: '0',
        templateName: '',
        title: '',
        sendObjType: '',
        content: '',
        sendPosition: '10',
        sendTimeType: '',
        sendTimeValue: '',
        pushFlag: 0,
        pushPosition: [],
        pushEventType: '',
        dateRange: [],
        dateRangeTime: [],
        pushEventUrl: '',
      },
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
        sendObjType: [
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
        appNotice: [
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
            message: '请选择应用内容',
          },
        ],
        sendTimeType: [
          {
            required: true,
            message: '请选择推送时间',
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
    changeTime(arr) {
      //console.log(arr);
      console.log(this.form.dateRange);
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

    //app推送点击
    appClick() {
      console.log(this.form.pushFlag);
    },

    // 编辑器初始化完成
    onTinymceInit(id) {
      tinymceId = id;
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
      // window.tinymce.get(tinymceId).setContent(content);
      this.form.content = content;
    },
    // 提交表单
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const options = {
            templateId: this.form.templateId, // 非？
            pushFlag: Number(this.form.pushFlag), // app推送
            sendPosition: this.form.sendPosition, // 应用类型 非
            title: this.form.title,
            content: this.form.content,
            sendObjType: this.form.sendObjType,
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
          if (this.form.sendObjType == 20) {
            options.sendObjList = this.form.sendObjList;
          }
          if (this.form.sendTimeType == 30) {
            options.sendTimeValue = this.form.sendTimeValue;
          } else if (this.form.sendTimeType == 40) {
            options.activityStartDate = this.form.dateRange[0];
            options.activityEndDate = this.form.dateRange[1];
            options.activitySendTime = this.form.dateRangeTime;
          }
          createdMessageContent(options).then(res => {
            if (res.code === 200) {
              this.$message.success('添加成功');
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
        // console.log(this.form.templateType, item.tempType);
        if (this.form.templateType === item.tempType.toString()) {
          this.templateName.push(item);
        }
        // console.log(this.templateName);
      });
    },
    // 3級联动
    changeName() {
      this.form.sendPosition = '';
      this.form.templateId = '';
      this.resMsg.forEach(item => {
        if (this.form.templateType === item.tempType.toString()) {
          if (this.form.templateName === item.name) {
            window.tinymce.get(tinymceId).setContent(item.content);
            this.form.sendPosition = item.tempType.toString();
            this.form.templateId = item.id.toString();
          }
        }
      });
    },

    // 监听是否选择选用模板
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
    font-size: 12px;
    color: #f56c6c;
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
