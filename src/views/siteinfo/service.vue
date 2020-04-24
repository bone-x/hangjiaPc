<template>
  <div class="content-container">
    <!-- 网站信息管理 - 服务协议 -->
    <div class="changeProtocol">
      <el-button
        v-permission="['website:protocal:update']"
        type="primary"
        @click="changePro"
      >修改服务协议</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="序号"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="creatorName"
        label="修改账号"
        width="180"
      ></el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{ timeFormat(scope.row.createTime) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import { getServiceagreement } from '@/api/siteinfo.js';
import { formatDate } from '@/utils/index';

export default {
  name: 'SiteinfoService',
  components: {},
  data() {
    return {
      tableData: [],
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    this.getlist();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'SiteinfoService') {
        this.getlist();
      }
    },
    timeFormat: formatDate, // 时间戳转化
    getlist() {
      getServiceagreement().then(response => {
        this.tableData = response.result;
        console.log(response, '列表数据');
      });
    },
    changePro() {
      this.$router.push({ name: 'SiteinfoServiceEdit', params: { id: 123 } });
    },
  },
};
</script>

<style lang="less" scoped>
.changeProtocol {
  margin-bottom: 20px;
}
</style>
