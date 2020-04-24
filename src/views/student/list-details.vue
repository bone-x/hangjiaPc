<template>
  <div class="content-container">
    <!-- 学员列表 - 详情 -->
    <el-row :gutter="20">
        <el-col :span="2"><span class="title"> 学员昵称:</span></el-col>
        <el-col :span="2"><span class="title">{{nickName}}</span></el-col>
        <el-col :span="2" :offset="18"><el-button  v-permission="['stu:contacts:export']" plain type="primary" @click="exportExcel">导出</el-button></el-col>   
    </el-row>

    <!-- table -->
    <el-table  :data="tableData" border style="margin:30px 0px;" max-height="700">
      <el-table-column prop="id" label="序号" min-width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="学员好友" min-width="150" align="center"></el-table-column>
      <el-table-column prop="nickName" label="昵称" min-width="150" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="150" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="180" align="center"></el-table-column>
    </el-table>

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
import { getAddressList, getAddressListExportExcel} from "@/api/student";

export default {
  name: 'StudentListDetails',
  components: {
  },
  data() {
      return {
        nickName:'消息',
          tableData: [{
              id:124,
              studentFriend: '123',
              nickName:123,
              phoneNumber:23232342342342342342,
              cratetime:345345534535
          }],
          filter: {
              currPage: 1,
              pageSize: 20,
              totalCount: 20,
          }
      };
  },
  created() {
    this.getList();
  },
  methods: {
     async getList() {
      const params = {
        userId: this.$route.params.id,
        number: this.filter.currPage,
        size: this.filter.pageSize,
      }
      const res = await getAddressList(params);
      if (res.code !== 200) return Promise.reject();
      console.log(res, '列表的数据')
      this.nickName = res.result.nickName;
      this.tableData = res.result.page.content;
      this.filter.totalCount = res.result.page.totalElements;
    },

      // 当前页改变
    oncurrPageChange(val) {
      this.filter.currPage = val;
      this.getList();
    },

    // 导出数据
    async exportExcel() {
      const options = {
        userId: this.$route.params.id,
      };
      const res = await getAddressListExportExcel(options);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, "_self");
      }
    },

  }
};
</script>

<style lang="less">
    .title {
       font-size:18px;
       font-weight:600;
       height: 36px;
       line-height: 36px;
    }
</style>
