<template>
  <div class="content-container">
    <!-- 系统管理 - 配置 - 配置值 -->
    <div class="setValue">
      <el-form ref="formDom" :rules="formData.rules" :model="formData" class="demo-ruleForm">
        <el-table :data="allValueData" style="width: 100%" border>
          <el-table-column prop="value" label="值" width="350">
            <template slot-scope="scope">
              <el-input
                :rules="formData.rules.value"
                :disabled="!scope.row.isEdit"
                v-model="scope.row.value"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="memo" label="说明" maxlength="200" min-width="180">
            <template slot-scope="scope">
              <el-input
                :rules="formData.rules.memo"
                :disabled="!scope.row.isEdit"
                v-model="scope.row.memo"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="updateName" label="修改人" width="180"></el-table-column>
          <el-table-column prop="address" label="操作" fixed="right" width="300">
            <template slot-scope="scope">
              <el-button
                v-permission="['sys:config:update']"
                v-if="!scope.row.isEdit"
                type="primary"
                @click.native="handleUpdate(scope.$index, scope.row)"
              >更新</el-button>
              <el-button
                v-permission="['sys:config:update']"
                v-else
                type="primary"
                plain
                @click.native="handleSave(scope.$index, scope.row)"
              >保存</el-button>
              <el-button
                v-permission="['sys:config:delete']"
                v-if="addValue = true"
                type="danger"
                @click.native="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="setBtn">
        <el-button v-permission="['sys:config:save']" type="primary" plain size="medium" class="addbtn" @click.native="addSetting">添加</el-button>
        <el-button v-permission="['sys:config:save']" type="primary" size="medium" @click.native="commitSetting">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  systemValue,
  updateSystemConfigValue,
  addSystemConfigValue,
  deleteConfigValue
} from "@/api/system.js";

// 生成id
const GUID = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

export default {
  name: "SystemConfigValue",
  components: {},
  data() {
    return {
      formData: {
        // 表单验证
        rules: {
          value: {
            type: "string",
            required: true,
            message: "必填字段",
            trigger: "blur"
          },
          memo: {
            type: "string",
            required: true,
            message: "必填字段",
            trigger: "blur"
          }
        }
      },
      // 唯一id
      $id: "",
      // 存放数据
      allValueData: [],
      // 获取路由传来的code
      configCode: "",
      // 加入新行的数据
      newValueData: []
    };
  },
  // watch: {
  //   $route: "onRouteChange"
  // },
  created() {
    this.configCode = this.$route.query.code;
    this.getConfigCode();
  },
  methods: {
    // 根据路由传来的code请求配置值列表
    getConfigCode() {
      systemValue(this.configCode).then(res => {
        this.allValueData = res.result;
        this.allValueData.forEach(item => {
          this.$set(item, "isEdit", false);
          this.$set(item, "$id", GUID);
        });
      });
    },

    // 点击添加按钮
    addSetting() {
      this.allValueData.push({
        value: "",
        memo: "",
        $id: GUID(),
        isEdit: true
      });
      console.log(this.allValueData);
    },

    // 点击更新按钮（请求后更新列表）
    handleUpdate(idx, item) {
      this.allValueData[idx].isEdit = true;
      this.allValueData = this.allValueData.concat([]);
    },

    // 点击保存按钮（请求后更新列表）
    handleSave(idx, item) {
      console.log('rows', item);
      // const noPass = this.allValueData.every(i => i.value && i.memo);
      if (!item.value || !item.memo) {
        this.$message.error("请编辑完成后再保存！");
      } else if (item.infoId !== undefined) {
        const data = {
          code: this.configCode,
          infoId: item.infoId,
          memo: item.memo,
          value: item.value,
        };
        // 对已存在的数据编辑请求更新
        updateSystemConfigValue(data).then(res => {
          console.log("旧数据更新", res);
          if (res.code === 200) {
            this.allValueData[idx].isEdit = false;
            this.allValueData = this.allValueData.concat([]);
            // this.getConfigCode();
            this.$message.success("修改成功！");
          } else {
            this.$message.error("修改失败！");
          }
        });
        // this.getConfigCode();
      } else {
        const data = {
          code: this.configCode,
          memo: item.memo,
          value: item.value,
          infoId: item.infoId,
        };
        // 新添加的数据请求保存
        addSystemConfigValue(data).then(res => {
          console.log("添加更新", res);
          if (res.code === 200) {
            this.allValueData[idx].isEdit = false;
            this.allValueData = this.allValueData.concat([]);
            // this.getConfigCode();
            this.$message.success("修改成功！");
          } else {
            this.$message.error("修改失败！");
          }
        });
      }
    },

    // 点击删除按钮（请求后更新列表）
    handleDelete(index, rows) {
      console.log('删除', rows.infoId);
      if (rows.infoId !== undefined) {
        deleteConfigValue(rows.infoId).then(res => {
          if (res.code === 200) {
            // 删除成功刷新数据
            this.getConfigCode();
            this.$message.success("修改成功！");
            // this.allValueData.splice(index, 1);
          } else {
            this.$message.error("修改失败！");
          }
        });
      } else {
        this.allValueData.splice(index, 1);
      }
    },

    // 点击确定提交验证
    commitSetting() {
      const checkRes = this.allValueData.some(i => {
        console.log("you", i);
        if (!i.value && !i.memo) {
          this.$message.error("请填写完整再提交！");
          return true;
        }
        if (i.isEdit) {
          this.$message.error("请保存数据后再提交！");
          return true;
        }
        return false;
      });
      if (checkRes) return false;

      this.$message.success("提交成功！");
      this.getConfigCode();
      console.log("提交所有数据", this.allValueData);
    }
  }
};
</script>

<style lang="less" scoped>
.setValue {
  padding: 20px;
  .setBtn {
    margin-top: 30px;
    .addbtn {
      margin-right: 30px;
    }
  }
}
</style>
