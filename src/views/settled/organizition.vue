<template>
  <div class="content-container">
    <!-- 入驻管理 - 入驻机构 -->
    <div class="header">
      <el-header>筛选机构</el-header>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2"  class="status">机构ID:</el-col>
        <el-col :span="3">
           <el-input v-model="orgaId" placeholder="请输入机构ID"></el-input>
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
          <el-button type="primary" @click="getList">搜索</el-button>
        </el-col>
      </el-row>
    </el-footer>
    </div>

     <div style="border:1px solid #ccc;line-height:60px;">
      <el-header>机构账户管理</el-header>
      <!-- 列表 -->
      <el-table ref="list" :data="tableData" border >
        <el-table-column prop="id" label="机构ID" align="center" min-width="100"></el-table-column>
        <el-table-column prop="name" label="机构名称" align="center" min-width="180"></el-table-column>
        <el-table-column prop="$businessCategory" label="主营类目" align="center" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="开通时间" align="center" min-width="120"></el-table-column>
        <el-table-column prop="soldGoodsNum" label="商品数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="totalSalesAmount" label="累计销售额" align="center" min-width="100">
            <template slot-scope="scope">
              <span class="money">{{scope.row.totalSalesAmount}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="totalSettlementAmount" label="累计结算金额" align="center" min-width="80">
            <template slot-scope="scope">
              <span class="money">{{scope.row.totalSettlementAmount}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="contactName" label="联系人" align="center" min-width="80"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" align="center" min-width="120"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="120">
            <template slot-scope="scope">
              <el-button
                v-permission="['organization:enterList:update']"
                size="mini"
                type="info"
                @click.native="organazitionDetails(scope.row.id)"
              >详情</el-button>
            </template>
          </el-table-column>
    </el-table>
    </div>

    <!-- 分页组件 -->
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
</template>

<script>

import { getPassOrganization } from "@/api/settled";
export default {
  name: "SettledManageOrganizition",
  components: {},
  data() {
    return {
     orgaId: "",
      orgaName: "",
      contactName: "",
      phoneNumber: "",
      tableData: [],
      filter: {
        currPage: 1,
        pageSize: 10,
        totalCount: 100,
      }
    };
  },
  mounted () {
    this.getList();
  },
  watch: {
    $route: "onRouteChange"
  },
  methods: {
    onRouteChange(to) {
      if (to.name === "SettledManageOrganizition") {
        this.getList();
      }
    },
    getList() {
      getPassOrganization({
        id: this.orgaId,
        name: this.orgaName,
        contactName: this.contactName,
        mobile: this.phoneNumber,
        pageNum: this.filter.currPage,
        pageSize: this.filter.pageSize,
      }).then(res=> {
        console.log(res)
        this.tableData  = res.result.list;
         this.tableData = res.result.list.map(val => {
          val.$businessCategory = val.businessCategory.replace(/\"/g, "").replace('[','').replace(']','');
          return val;
         })
        this.filter.totalCount = res.result.totalCount;
        console.log(this.filter.totalCount, '分页的数目')
      })
    },
    organazitionDetails (id) {
      this.$router.push({ name:'SettledOrganizationManageDetails', params:{id:id}})
    },
    oncurrPageChange (val) {
      // 分页
      this.filter.currPage = val;
      this.getList();
    }
  }
};
</script>

<style scoped lang='less'>
.content-container {
  .header {
    margin-bottom: 20px;
    border:1px solid #ccc;
    .el-header {
      border-bottom:1px solid #ccc;
      line-height:60px;
      font-weight: bolder;
    }
    .el-footer {
      line-height:60px;
    }
    .status {
    height:60px;
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
    .el-header {
      line-height:60px;
      font-weight: bolder;
    }
    .money {
      color: red;
    }
}
  
}
</style>
