<template>
  <div class="content-container">
    <!-- 系统管理 - 配置 -->
    <div class="config-container">
      <div class="search">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="leftInput">
              <el-input v-model="configParams.name" class="inputName" placeholder="请输入配置名称"></el-input>
              <el-input v-model="configParams.code" class="inputName" placeholder="请输入配置编码"></el-input>
              <el-button type="primary" @click.native="checkData">查询</el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rightInput">
              <el-button
                v-permission="['sys:config:save']"
                type="primary"
                @click.native="goAddSetting"
              >添加配置</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table :data="configData" border style="width: 100%; margin-top:30px">
        <el-table-column prop="configId" label="配置ID" width="100"></el-table-column>
        <el-table-column prop="name" label="配置名称" width="180"></el-table-column>
        <el-table-column prop="code" label="配置编码" width="180"></el-table-column>
        <el-table-column prop="memo" label="配置说明" width="180"></el-table-column>
        <el-table-column prop="value" label="配置值" width="180"></el-table-column>
        <el-table-column prop="type" label="数据类型" width="180">
          <template slot-scope="scope">
            <span v-for="(item, index) in dataType" :key="index">
              <span v-if="scope.row.type === item.value">{{ item.label }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">启用</span>
            <span v-if="scope.row.status === 1">停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateName" label="修改人" width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="300" prop="operating" label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="['sys:config:update']"
              type="primary"
              icon="el-icon-edit"
              @click.native="goEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['sys:config:delete']"
              type="danger"
              icon="el-icon-delete"
              @click.native="goDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page.sync="configParams.pageNum"
          :page-size="configParams.pageSize"
          :total="totalCount"
          background
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <el-button size="mini" type="primary" class="sureBtn" @click.native="handleCurrentChange">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { systemSetting, deleteSystemConfig, systemConfigType } from "@/api/system.js";

export default {
  name: "SystemConfig",
  components: {},
  data() {
    return {
      configParams: {
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 10
      },
      totalPage: 10,
      totalCount: 10,
      configData: [], // 获取的数据列表
      dataType: "",
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    this.getconfigurationData();
    this.configDataType();
  },
  methods: {
    onRouteChange(to) { // 监听路由的变化
      if (to.name === 'SystemConfig') {
        this.getconfigurationData();
      }
    },

    // 时间格式转化
    dateFormat(time) {
      return time.replace(/-/g, ".");
    },

    // 获取数据
    getconfigurationData() {
      systemSetting(this.configParams).then(res => {
        this.configData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 获取数据类型
    configDataType() {
      systemConfigType().then(res => {
        this.dataType = res.result;
        console.log("dataType", this.dataType);
      });
    },

    // 点击查询
    checkData() {
      console.log(this.configParams);
      systemSetting(this.configParams).then(res => {
        console.log("配置数据", res);
        this.configData = res.result.list;
        this.totalPage = res.result.totalPage;
        this.totalCount = res.result.totalCount;
      });
    },

    // 分页
    handleSizeChange(val) {
      this.configParams.pageSize = val;
      console.log(`每页 ${val} 条`);
    },

    // 改变当前页
    handleCurrentChange(val) {
      this.configParams.pageNum = val;
      this.getconfigurationData();
      console.log(`当前页: ${val}`);
    },

    // 跳转增加配置
    goAddSetting() {
      this.$router.push({
        name: "SystemConfigAdd"
      });
    },

    // 点击删除按钮
    goDelete(items) {
      console.log("items", items);
      // 启用状态的时候不可删除
      if (items.status === 0) {
        this.$confirm("配置启用中，暂不可删除", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "退出删除!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        // 停用的时候可删除
        this.$confirm("确定删除该配置?", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 调用删除接口
            deleteSystemConfig(items.configId).then(res => {
              console.log("删除", res);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getconfigurationData();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },

    // 点击编辑
    goEdit(items) {
      console.log("edit", items);
      this.$router.push({
        name: "SystemConfigEdit",
        params: {
          id: items.configId
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.config-container {
  padding: 20px;
  .search {
    width: 100%;
    .leftInput {
      width: 800px;
      .inputName {
        display: inline-block;
        width: 200px;
        margin-right: 20px;
      }
    }
    .rightInput {
      /* width: 30%; */
      text-align: right;
    }
  }
  .pagination {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
  .sureBtn {
    margin-left: 20px;
  }
}
</style>
