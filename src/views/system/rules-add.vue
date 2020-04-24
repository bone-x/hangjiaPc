<template>
  <div class="content-container">
    <!-- 系统管理 - 添加角色 -->
    <div>
      <h3>添加角色</h3>
    </div>
    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称" required>
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remake"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
        <el-form-item label="菜单权限" required>
          <el-tree ref="tree" :data="data" :props="defaultProps" node-key="menuId" show-checkbox style="float:left;padding-top:10px;" @check-change="getCheckedNodes"></el-tree>
          <div class="useRole">
            <span class="roleway">使用角色 :</span>
            <el-tree ref="roletree" :data="roledata" :props="roleProps" node-key="roleId" show-checkbox style="float:left;" @check-change="getCheckedKeys"></el-tree>
          </div>
        </el-form-item>
        <div style="margin-top:100px;">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { createdRoleList, getmenuRole, getRole } from "@/api/system.js";

export default {
  name: 'SystemRulesAdd',
  components: {
  },
  data() {
    return {
      data: [],
      roledata: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      roleProps: {
        children: 'children',
        label: 'roleName'
      },
      form: {
        roleNmae: "",
        remake: "",
        status: true
      },
      usableIdList: [],
      menuList: []
    };
  },
  created() {
    this.getRole();
    this.getMenu();
    console.log(this.form.status);
  },
  methods: {
    getCheckedNodes() {
      // 菜单权限node
      console.log(this.$refs.tree.getCheckedNodes());
      this.menuList = this.$refs.tree.getCheckedNodes().map(item => {
        return {
          menuId: item.menuId,
          type: item.type
        };
      });
      console.log(this.menuList);
    },
    getCheckedKeys() {
      // 可用角色keys
      this.usableIdList = this.$refs.roletree.getCheckedKeys();
    },
    getRole() {
      getRole().then(response => {
        console.log(response, "可用角色");
        this.roledata = response.result;
      });
    },
    getMenu() {
      getmenuRole().then(response => {
        console.log(response, "菜单权限");
        this.data = response.result.tree;
      });
    },
    onSubmit() {
      // 新增保存
      if (!this.form.roleName) {
        this.$message({
          type: "warning",
          message: "请输入角色名称"
        });
      } else if (!this.form.remake) {
        this.$message({
          type: "warning",
          message: "请输入备注"
        });
      } else if (this.menuList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择菜单权限"
        });
      } else {
        this.status = this.status === true ? 1 : 0;
        const data = {
          memo: this.form.remake,
          menuList: this.menuList,
          roleName: this.form.roleName,
          status: this.status,
          usableIdList: this.usableIdList
        };
        createdRoleList(data).then(response => {
          console.log(response, "新增接口");
          this.$message({
            type: "success",
            message: "新增角色成功"
          });
          this.$router.go(-1);
          this.$store.dispatch("delView", this.$route);
        });
      }
    },
    cancel() {
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    },
    handleRoleClick(roleData) {
      console.log(roleData, "回调角色,支持多选");
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
.roleway {
  float: left;
  width:80px;
  color: #606266;
  font-size:14px;
  line-height: 36px;
  display: inline-block;
  margin-left: 10%;
}
.useRole {
  width:200px;
  position: absolute;
  left:250px;
  top:0;
}
</style>
