<template>
  <div class="content-container">
    <!-- 系统管理 - 角色管理 - 编辑角色 -->
    <div>
      <h3>修改用户</h3>
    </div>
    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户ID" >
          <el-input v-model="ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.passWord"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
          </el-select>
          <el-button type="info" @click="roleControl">角色管理</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.delivery" active-value="0" inactive-value="1" ></el-switch>
        </el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { changeAccountList, getUserdata, getChangerolelist } from "@/api/system.js";

export default {
  name: "SystemUserEdit",
  components: {},
  data() {
    return {
      ID: this.$route.params.id,
      form: {
        name: "",
        passWord: "",
        phoneNumber: "",
        delivery: "0" // 状态
      },
      options: [],
      roleId: ""
    };
  },
  created() {
    this.getListuser();
    this.getChangerolelist(); // 获取角色下拉列表
  },
  methods: {
    onSubmit() {
      // 修改用户
      if (this.form.name === '') {
        this.$message({
          message: '请输入名称',
          type: 'warning'
        });
      } else if (this.form.phoneNumber === '') {
        this.$message({
          message: '请输入手机号码',
          type: 'warning'
        });
      } else if (this.roleId === 0) {
        this.$message({
          message: '请选择角色',
          type: 'warning'
        });
      } else {
        const data = {
        password: this.form.passWord,
        userId: this.$route.params.id,
        userName: this.form.name,
        phone: this.form.phoneNumber,
        status: Number(this.form.delivery),
        roleIdList: [this.roleId]
      };
      changeAccountList(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.$router.go(-1);
        this.$store.dispatch("delView", this.$route);
        console.log(response, "修改接口");
      });
      }
      
    },
    getChangerolelist() {
      getChangerolelist().then(response => {
        this.options = response.result.map(item => {
          return {
            roleId: item.roleId,
            roleName: item.roleName
          };
        });
        console.log(response, "下拉数据");
      });
    },
    getListuser() {
      // 根据id获取数据
      const data = {
        userId: this.$route.params.id
      };
      getUserdata(data).then(response => {
        this.form.name = response.result.userName;
        this.form.passWord = response.result.password;
        this.form.phoneNumber = response.result.phone;
        [this.roleId] = response.result.roleIdList;
        this.form.delivery = response.result.status + '';
        console.log(response, "数据", response.result.roleIdList, this.roleId);
      });
    },
    cancel() {
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    },
    roleControl() {
      this.$router.push({ name: "SystemRules" });
    }
  }
};
</script>

<style lang="less" scoped>
h3 {
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid rgb(221, 208, 208);
  margin-bottom: 80px;
  display: block;
}
.el-input {
  width: 30%;
}
.el-select {
  width: 30%;
}
</style>
