<template>
  <div class="content-container">
    <!-- 运营管理 - 敏感词过滤 - 编辑 -->
    <div class="addnew">
      <h4>敏感词信息</h4>
      <div class="sensitivemsg">
        <div class="sensitiveword">屏蔽敏感词：</div>
        <el-button
          type="primary"
          plain
          class="writesensitive"
          @click="centerDialogVisible = true"
        >+ 添加敏感词</el-button>
      </div>
      <!-- 屏蔽敏感词存放区 -->
      <div class="sensitive-area">
        <el-alert
          v-model="senData"
          title="sensitive1"
          type="info"
          style="width:200px;margin-right:20px;margin-bottom:20px"
        ></el-alert>
      </div>

      <div class="sensitivemsg">
        <div class="sensitiveword">禁用敏感词：</div>
        <el-button
          type="primary"
          plain
          class="writesensitive"
          @click="stopCenterDialogVisible = true"
        >+ 添加敏感词</el-button>
      </div>
      <!-- 禁用敏感词存放区 -->
      <div :sensitiveData="sensitiveData" class="sensitive-area">
        <el-alert
          v-for="item in sensitiveData"
          :key="item.id"
          title="sensitive1"
          type="info"
          style="width:200px;margin-right:20px;margin-bottom:20px"
        ></el-alert>
      </div>

      <div class="end">
        <el-button>&nbsp;&nbsp;取 消&nbsp;&nbsp;</el-button>
        <el-button type="primary" class="sendcheck">&nbsp;&nbsp;确 定&nbsp;&nbsp;</el-button>
      </div>
    </div>
    <!-- 屏蔽敏感词弹窗 -->
    <el-dialog :visible.sync="centerDialogVisible" title="添加敏感词" width="60%" left>
      <el-form :model="ruleForm">
        <el-form-item label="屏蔽敏感词">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10}"
            v-model="ruleForm.textarea3"
            type="textarea"
            placeholder="请输入内容"
            size="medium"
          ></el-input>
        </el-form-item>
      </el-form>
      <ul class="attention">
        <li>敏感词文本最多十个字</li>
        <li>换行可一次添加多个敏感词</li>
        <li>指定敏感词将被替换为*</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          style="margin-left:10%"
          @click="centerDialogVisible = false"
          @click.native="enterdata"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 禁用敏感词弹窗 -->
    <el-dialog :visible.sync="stopCenterDialogVisible" title="添加敏感词" width="60%" left>
      <div class="sensitive-dialog">
        <div class="sensitive-title" style="height:36px;line-height:36px">禁用敏感词</div>
        <el-input
          :autosize="{ minRows: 2, maxRows: 10}"
          v-model="textarea4"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <ul class="attention">
        
        <li>敏感词文本最多十个字</li>
        <li>换行可一次添加多个敏感词</li>
        <li>指定敏感词将无法保存</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          style="margin-left:10%"
          @click="stopCenterDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

const textarearuler = function (rule, value, callback) {
  if (!value) {
    return callback(new Error("请输入屏蔽内容！"));
  }
  if (!/^[\u4e00-\u9fa5]{1,20}$/.test(value)) {
    return callback(new Error("每行只能输入10个字！"));
  }
  // debugger
  if (value > this.price) {
    return callback(new Error("秒杀价不得高于商品原价,请重新输入"));
  }
  callback();
};
export default {
  name: "OperationManageSensitiveEdit",
  components: {},
  data() {
    return {
      ruleForm: {
        textarea3: "dfgfdgdfgdfgfdghfg"
      },
      centerDialogVisible: false,
      stopCenterDialogVisible: false,
      textarea3: "",
      textarea4: "",
      senData: [],
      sensitiveData: [
        {
          id: 1,
          sensitive1: "xxxxx"
        },
        {
          id: 2,
          sensitive1: "xxxxxxx"
        },
        {
          id: 3,
          sensitive1: "xxxxxxxxxx"
        },
        {
          id: 4,
          sensitive1: "xxxxxxxxxx"
        },
        {
          id: 5,
          sensitive1: "xxxxxxxxxx"
        },
        {
          id: 6,
          sensitive1: "xxxxxxxxxx"
        }
      ]
    };
  },
  mounted() {
    // console.log(this.ruleForm.senData);
  },
  methods: {
    enterdata() {
      alert(this.ruleForm.textarea3)
    }
  }
};
</script>

<style scoped lang="scss">
.addnew {
  padding: 20px;
  padding-left: 40px;
  .sensitivemsg {
    font-size: 13px;
    display: flex;
    line-height: 36px;
    margin-bottom: 20px;
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
