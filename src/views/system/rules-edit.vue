<template>
  <div class="content-container">
    <!-- 系统管理 - 编辑角色 -->
    <div>
      <h3>修改角色</h3>
    </div>
    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色ID" >
          <el-input v-model="ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" required>
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remake"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-value="0" inactive-value="1"></el-switch>
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

import { changeRoleList, getmenuRole, getRole, getChangeroledata } from "@/api/system.js";

export default {
  name: 'SystemRulesEdit',
  components: {
  },
  data() {
    return {
      ID: this.$route.params.id,
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
        status: "0"
      },
      usableIdList: [],
      menuList: []
    };
  },
  watch: {
    $route: 'onRouteChange'
  },
  async created() {
    this.getRole(); // 可用角色的展示
    // 可用菜单的展示
    await this.getMenu()
    this.getchangedata();
  },
  methods: {
    async onRouteChange(to) { // 刷新页面
      if (to.name === 'SystemRulesEdit') {
        this.getRole(); // 可用角色的展示
        await this.getMenu(); // 可用菜单的展示
        this.getchangedata();
      }
    },
    getchangedata() {
      // 根据id获取数据
      const params = {
        roleId: this.$route.params.id,
      };
      console.log(this.$route.params.id, 11111111111111111);
      getChangeroledata(params).then(response => {
        // 获取数据
        console.log(response, "根据id获取角色shuju ", response.result.menuIdList);
        this.form.roleName = response.result.roleName;
        this.form.remake = response.result.memo;
        this.form.status = response.result.status + '';
        this.usableIdList = response.result.usableIdList;
        this.$refs.roletree.setCheckedKeys(response.result.usableIdList);
        const tree = response.result.menuIdList.map(i => {
          const item = {
            menuId: i,
          };
                  console.log(item);
          return item;
        });
        this.$refs.tree.setCheckedNodes(tree);
      });
    },
    getCheckedNodes() {
      // 菜单权限node
      console.log(this.$refs.tree.getCheckedNodes(), this.$refs.tree.getHalfCheckedNodes());
      this.menuList = this.$refs.tree.getCheckedNodes().map(item => {
        return {
          menuId: item.menuId,
          type: item.type
        };
      });
      console.log(this.menuList, "判断menuList有没有数据");
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
      return new Promise((resolve, reject) => {
        getmenuRole().then(response => {
          console.log(response, "菜单权限");
          this.data = response.result.tree;
          resolve();
        }).catch(() => {
          resolve();
        })
      });
    },
    onSubmit() {
      // 修改保存
      if (this.menuList.length === 0) {
        this.$message({
          type: "warning",
          message: "请输入菜单权限"
        });
      } else if (this.form.roleName === "") {
        this.$message({
          type: "warning",
          message: "请输入角色姓名"
        });
      } else {
        this.getCheckedNodes();
        const data = {
          roleId: this.$route.params.id,
          memo: this.form.remake,
          menuList: this.menuList,
          roleName: this.form.roleName,
          status: Number(this.form.status),
          usableIdList: this.usableIdList
        };
        changeRoleList(data).then(response => {
          console.log(response);
          this.$message({
            type: "success",
            message: "修改角色成功"
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
