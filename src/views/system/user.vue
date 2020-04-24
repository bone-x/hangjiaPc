<template>
  <div class="content-container">
    <!-- 系统管理 - 账户管理 -->
    <div class="content_head">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input v-model="name" placeholder="请输入真实的姓名"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="phoneNumber" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="status" placeholder="请选择状态">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button v-permission = "['sys:account:select']" type="primary" @click="queryData">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" @click="clearAll">清空</el-button>
        </el-col>
        <el-col :span="2" :offset="9">
          <el-button v-permission = "['sys:account:save']" type="primary" style="float:right" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div>
      <el-table :data="tableData"  @sort-change="getOrder"  style="width: 100%" border>
        <el-table-column label="用户ID" width="100" prop="userId" align="center" sortable="custom"></el-table-column>
        <el-table-column label="用户名称" align="center" prop="userName" width="250" sortable="custom"></el-table-column>
        <el-table-column label="添加时间" prop="createTime" align="center" width="250" sortable="custom"></el-table-column>
        <el-table-column label="最近登录时间" align="center" sortable="custom">
          <template slot-scope="scope">
            <p>时间： {{ scope.row.loginTime }}</p>
            <p>IP: {{ scope.row.loginIp }}</p>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center" prop="roleList[0].roleName" width="250" sortable="custom">
        </el-table-column>
        <el-table-column label="状态" width="150" prop="status" align="center" sortable="custom">
          <template slot-scope="scope">
            <span v-if="scope.row.status" size="small">禁用</span>
            <span v-else  size="small">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="updateName" min-width="120"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <el-button v-permission = "['sys:account:update']" size="medium" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              v-permission = "['sys:account:delete']"
              size="medium"
              type="danger"
              @click="deleteListdata(scope.$index, scope.row)"
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
</template>

<script>
import {
  getAccountList,
  queryAccountList,
  deleteAccountList
} from "@/api/system.js";

export default {
  name: "SystemUser",
  components: {},
  data() {
    return {
      name: "",
      phoneNumber: "",
      status: "",
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 40
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
      if (to.name === 'SystemUser') {
        this.getList();
      }
    },
    getList() {
      // 获取列表
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sidx: 'createTime',
        sort: 'desc' // 倒序
      };
      getAccountList(params).then(response => {
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        console.log(response);
      });
    },
    getListAsc() {
       const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sidx: 'createTime',
        sort: 'asc' // 正序
      };
      getAccountList(params).then(response => {
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        console.log(response);
      });
    },
    handleEdit(index, row) {
      console.log(row, "编辑");
      this.$router.push({ name: 'SystemUserEdit', params: { id: row.userId } });
    },
    deleteListdata(index, row) {
      // 删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            userId: row.userId
          };
          deleteAccountList(params).then(response => {
            console.log(response);
            this.getList();
            if (response.code === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
            }
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
      this.name = "";
      this.phoneNumber = "";
      this.status = "";
    },
    addUser() {
      this.$router.push({ name: "SystemUserAdd" });
    },
    queryData() {
      const params = {
        phone: this.phoneNumber || null,
        status: this.status || null,
        userName: this.name || null,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      queryAccountList(params).then(response => {
        console.log(response, "查询成功");
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    getOrder(param) {
      console.log(param, '回掉table');
      if (param.order === "descending") {
        this.getList();
      } else {
        this.getListAsc();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content_head {
  margin-bottom: 20px;
}
.block {
  display: flex;
  justify-content: center;
}
</style>
