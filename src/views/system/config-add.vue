<template>
  <div class="content-container">
    <!-- 系统管理 - 配置 - 新建 -->
    <div class="config-add-container">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="ruleForm.name" class="setting"></el-input>
        </el-form-item>
        <el-form-item label="配置编码" prop="code">
          <el-input v-model="ruleForm.code" class="setting"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="ruleForm.type" class="setting">
            <el-option
              v-for="(item, index) in dataType"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置值" prop="value">
          <el-input v-model="ruleForm.value" class="setting" disabled placeholder="请在保存后进行配置操作"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            :active-value="0"
            :inactive-value="1"
            v-model="ruleForm.status"
            class="demo"
            active-color="#00A854"
            active-text=""
            inactive-color="#cccccc"
            inactive-text=""
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click.native="cancelSetting">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  systemConfigType,
  addSystemConfig
} from "@/api/system.js";

export default {
  name: "SystemConfigAdd",
  components: {},
  data() {
    return {
      // 获取数据类型
      dataType: "",
      ruleForm: {
        name: "",
        code: "",
        type: "",
        status: 0,
        infoId: 0
      },
      rules: {
        name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入配置编码", trigger: "blur" }],
        type: [
          { required: true, message: "请选择数据类型", trigger: "change" }
        ],
        setValue: [{ trigger: "blur" }]
      }
    };
  },
  // watch: {
  //   $route: "onRouteChange"
  // },
  created() {
    this.configDataType();
  },
  methods: {
    // 获取数据类型
    configDataType() {
      systemConfigType().then(res => {
        this.dataType = res.result;
      });
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          console.log("提交数据", this.ruleForm);
          // 提交添加配置请求
          addSystemConfig(this.ruleForm).then(res => {
            console.log('提交添加配置', res);
            if (res.code === 200) {
              this.$message.success("添加成功！");
            } else {
              this.$message.error("添加失败！");
            }
          });
        } else {
          this.$message.error("请填写完整再提交！");
          return false;
        }
      });
    },
    cancelSetting() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.config-add-container {
  padding: 20px;
  .setting {
    width: 500px;
  }
}

</style>
