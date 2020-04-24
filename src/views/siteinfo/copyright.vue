<template>
  <div class="content-container">
    <!-- 网站信息管理 - 版权说明修改列表 -->
    <div class="changeProtocol">
      <el-button v-permission = "['website:copyright:update']" type="primary" @click="changePro">修改版权说明</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="序号" width="80"></el-table-column>
      <el-table-column prop="creatorName" label="修改账号" width="180"></el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">{{ timeFormat(scope.row.createTime) }}</template>
      </el-table-column>
    </el-table>
    <router-view></router-view>
  </div>
</template>

<script>
import { getServicelist } from "@/api/siteinfo.js";
import { formatDate } from "@/utils/index";

export default {
  name: "SiteinfoCopyright",
  components: {},
  data() {
    return {
      tableData: []
    };
  },
  watch: {
    $route: 'onRouteChange'
  },
  created() {
    this.getServicelist();
  },
  methods: {
    getServicelist() {
      getServicelist().then(response => {
        this.tableData = response.result;
        console.log(response);
      });
    },
    onRouteChange(to) {
      if (to.name === 'SiteinfoCopyright') {
        this.getServicelist();
      }
    },
    timeFormat: formatDate, // 时间戳转化
    changePro() {
      this.$router.push({ name: "SiteinfoCopyrightEdit", params: { id: 123 } });
    }
  }
};
</script>

<style lang="less" scoped>
.changeProtocol {
  margin-bottom: 20px;
}
</style>
