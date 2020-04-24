<template>
  <div class="content-container">
    <!-- 系统管理 - 角色管理 -->
    <div style="margin-bottom:20px;">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input v-model="roleName" placeholder="请输入角色名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button v-permission="['sys:role:select']" type="primary" @click="queryList">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" @click="clearAll">清空</el-button>
        </el-col>
        <el-col :span="2" :offset="12">
          <el-button
            v-permission="['sys:role:save']"
            type="primary"
            style="float:right"
            @click="addUser"
          >添加角色</el-button>
        </el-col>
      </el-row>
    </div>

    <div>
      <!-- 表格 -->
      <div class="table">
        <el-table :data="tableData" :default-sort = "{prop: 'createTime', order: 'descending'}" style="width: 100%" border >
          <el-table-column label="角色ID" width="80" prop="roleId" align="center"></el-table-column>
          <el-table-column label="角色名称" align="center" width="150" prop="roleName"></el-table-column>
          <el-table-column label="可使用" prop="infCategoryName" min-width="400">
            <template slot-scope="scope">
              <el-button v-for="(item,index) in scope.row.usableList" :key="index" size="mini" type="primary">{{ item.roleName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="memo" width="150" align="center"></el-table-column>
          <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status" >禁用</span>
              <span v-else >正常</span>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="createTime" align="center" width="180"></el-table-column>
          <el-table-column label="修改人" align="center" prop="updateName" min-width="120"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                v-permission="['sys:role:update']"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button>
              <el-button
                v-permission="['sys:role:delete']"
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20">
          <div class="block">
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next, jumper"
              background
              @size-change="handleSize"
              @current-change="handleCurrent"
            ></el-pagination>
          </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getRoleList, delRoleList } from "@/api/system.js";

export default {
  name: "SystemRules",
  components: {},
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 10,
      roleName: "",
      options: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "禁用"
        }
      ],
      value: ""
    };
  },
  watch: {
    $route: 'onRouteChange'
  },
  created() {
    this.getList();
  },
  methods: {
    onRouteChange(to) { // 监听路由的变化
      if (to.name === 'SystemRules') {
        this.getList();
      }
    },
    getList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        sidx: 'createTime',
        sort: 'desc' // 倒序
      };
      getRoleList(params).then(response => {
        console.log(response, "获取列表信息");
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    queryList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        status: this.value,
        roleName: this.roleName,
        sidx: 'createTime',
        sort: 'desc' // 倒序
      };
      getRoleList(params).then(response => {
        console.log(response);
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "SystemRulesEdit",
        params: { id: row.roleId }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            userId: row.roleId
          };
          delRoleList(data).then(response => {
            console.log(response, "删除");
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSize(val) {
      this.pageSize = val;
      this.getList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrent(val) {
      this.currentPage = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    clearAll() {
      this.roleName = "";
      this.value = "";
    },
    addUser() {
      this.$router.push({ name: "SystemRulesAdd" });
    }
  }
};
</script>

<style lang="less" scoped>
.block {
  display: flex;
  justify-content: center;
}
</style>
