<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 18:03:19
 * @LastEditTime: 2019-08-12 17:02:33
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-container">
    <!-- 入驻审核 - 入驻列表 -->
    <div class="header">
      <el-header>筛选查询</el-header>
      <el-footer>
        <el-row :gutter="20">
          <el-col :span="2" class="status">处理状态：</el-col>
          <el-col :span="4">
            <el-select v-model="value" placeholder="请选择状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="2" class="status">机构名称:</el-col>
          <el-col :span="3">
            <el-input v-model="orgaName" placeholder="请输入机构名称"></el-input>
          </el-col>

          <el-col :span="2" class="status">联系人:</el-col>
          <el-col :span="3">
            <el-input v-model="contactName" placeholder="请输入联系人"></el-input>
          </el-col>

          <el-col :span="2" class="status">手机号码:</el-col>
          <el-col :span="4">
            <el-input v-model="phoneNumber" placeholder="请输入手机号码"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="getOrgList">搜索</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </div>

    <div class="content">
      <el-header>机构入驻信息</el-header>
      <!-- 列表 -->
      <el-table ref="list" :data="tableData" border max-height="700">
        <el-table-column prop="id" label="序号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="name" label="机构名称" align="center" min-width="180"></el-table-column>
        <el-table-column prop="$businessCategory" label="主营类目" align="center" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="提交时间" align="center" min-width="130"></el-table-column>
        <el-table-column prop="contactName" label="联系人" align="center" min-width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" align="center" min-width="150"></el-table-column>
        <el-table-column prop="status" label="处理状态" align="center" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'REJECTED'">已拒绝</span>
            <span v-if="scope.row.status === 'UNPROCESSED'">未处理</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button
              v-permission="['organization:audit:audit']"
              size="mini"
              @click.native="checkData(scope.row.id)"
            >审核</el-button>
            <el-button
              v-permission="['organization:audit:delete']"
              size="mini"
              type="danger"
              @click.native="deleteData(scope.row.id)"
              :disabled="(scope.row.status === 'UNPROCESSED')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div>
      <el-row style="margin-top: 20px;">
        <el-col :span="24" center>
          <el-pagination
            :current-page.sync="filter.currPage"
            :page-size="filter.pageSize"
            :total="filter.totalCount"
            background
            layout="prev, pager, next, jumper"
            @current-change="oncurrPageChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getOrganizationList, delOrganization } from "@/api/settled";
export default {
  name: "SettledManageList",
  components: {},
  data() {
    return {
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "UNPROCESSED",
          label: "未处理"
        },
        {
          value: "REJECTED",
          label: "已拒绝"
        }
      ],
      value: "",
      orgaName: "",
      contactName: "",
      phoneNumber: "",
      tableData: [],
      filter: {
        currPage: 1,
        pageSize: 10,
        totalCount: 100
      }
    };
  },
  mounted() {
    this.getOrgList();
  },
  watch: {
    $route: "onRouteChange"
  },
  methods: {
    onRouteChange(to) {
      if (to.name === "SettledManageList") {
        this.getOrgList();
      }
    },
    // 获取列表
    getOrgList() {
      getOrganizationList({
        status: this.value,
        name: this.orgaName,
        contactName: this.contactName,
        mobile: this.phoneNumber,
        pageNum: this.filter.currPage,
        pageSize: 10
      }).then(res => {
        console.log(res);
        this.tableData = res.result.list.map(val => {
          val.$businessCategory = val.businessCategory
            .replace(/\"/g, "")
            .replace("[", "")
            .replace("]", "");
          return val;
        });
        console.log(this.tableData);
        this.filter.totalCount = res.result.totalCount;
      });
    },

    oncurrPageChange(val) {
      // 分页
      this.filter.currPage = val;
      this.getOrgList();
    },

    checkData(id) {
      this.$router.push({ name: "SettledManageDetails", params: { id: id } });
    },

    // 删除
    deleteData(orgId) {
      delOrganization({
        orgId
      }).then(res => {
        console.log(res);
        this.$message({
          type: "success",
          message: "删除成功"
        });
      });
    }
  }
};
</script>

<style scoped lang='less'>
.content-container {
  .header {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    .el-header {
      border-bottom: 1px solid #ccc;
      line-height: 60px;
      font-weight: bolder;
    }
    .el-footer {
      line-height: 60px;
    }
    .status {
      height: 60px;
      text-align: center;
      line-height: 60px;
    }
   @media screen and (max-width: 1445px) {
    .status {
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 12px;
    }
   }
  }
  .content {
    border: 1px solid #ccc;
    height: auto;
    width: 100%;
    .el-header {
      line-height: 60px;
      font-weight: bolder;
    }
  }
}
</style>
