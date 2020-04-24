<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select v-model="filter.clientType" placeholder="请选择版本类型">
          <el-option label="ios" value="ios"></el-option>
          <el-option label="android" value="android"></el-option>
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-button type="primary" @click.native="getSysVersionList(1)">查询</el-button>
      </el-col>

      <el-col :span="2">
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>

      <el-col :span="2">
        <router-link :to="{ name: 'SystemVersionVersionManageAdd' }">
          <el-button type="primary">新增</el-button>
        </router-link>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="version-manage-table"
      :data="tableData"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column width="100" prop="id" label="ID"></el-table-column>
      <el-table-column width="100" prop="clientType" label="版本类型"></el-table-column>
      <el-table-column width="100" prop="minVersionCode" label="最小版本号"></el-table-column>
      <el-table-column width="100" prop="versionCode" label="版本编码"></el-table-column>
      <el-table-column width="100" prop="versionName" label="版本名称"></el-table-column>
      <el-table-column width="100" prop="$updateStrategy" label="更新意愿"></el-table-column>
      <el-table-column width="100" show-overflow-tooltip prop="downloadUrl" label="下载地址"></el-table-column>
      <el-table-column min-width="300" label="更新详情">
        <template slot-scope="scope">
          <div class="limit-line-3">{{ scope.row.updateDetail }}</div>
        </template>
      </el-table-column>
      <el-table-column width="100" show-overflow-tooltip prop="md5" label="MD5值"></el-table-column>
      <el-table-column width="100" prop="$isActive" label="状态"></el-table-column>
      <el-table-column width="150" show-overflow-tooltip prop="updateUserList" label="灰度用户列表"></el-table-column>
      <el-table-column width="100" show-overflow-tooltip prop="createPerson" label="记录创建者"></el-table-column>
      <el-table-column width="100" show-overflow-tooltip prop="modifyPerson" label="记录修改者"></el-table-column>
      <el-table-column width="100" prop="$createTime" label="创建时间"></el-table-column>
      <el-table-column width="100" prop="$modifyTime" label="修改时间"></el-table-column>

      <el-table-column label="操作" min-width="90" fixed="right">
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'SystemVersionVersionManageEdit', params: { id: scope.row.id } }"
          >
            <el-button>修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;" type="flex" align="middle" justify="center">
      <el-col :span="8" center>
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="oncurrPageChange"
        ></el-pagination>
      </el-col>

      <el-col :span="2">
        <el-button size="mini" plain>跳转</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSysVersionList } from "@/api/system-version";
import { formatDate } from "@/utils";

export default {
  name: "SystemVersionVersionManage",
  components: {},
  data() {
    return {
      filter: {
        clientType: "",
        currPage: 1,
        pageSize: 20,
        totalPage: 1,
        totalCount: 0
      },
      tableData: []
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    // 获取默认列表数据
    this.getSysVersionList();
  },

  methods: {
    onRouteChange(to) {
      if (to.name === "SystemVersionVersionManage") {
        this.getSysVersionList();
      }
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.clientType = "";
    },

    // 根据参数获取商品列表
    async getSysVersionList(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        pageSize: this.filter.pageSize,
        clientType: this.filter.clientType
      };

      // 发起请求
      const res = await getSysVersionList(options);
      if (res.code !== 200) return Promise.reject();
      const {
        list = [],
        currPage = 1,
        pageSize = 20,
        totalPage = 1,
        totalCount = 0
      } = res.result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 20;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;
      this.tableData = list.map(li => {
        li.$createTime = formatDate(li.createTime, 10);
        li.$modifyTime = formatDate(li.modifyTime, 10);
        
        if (li.isActive === 1) li.$isActive = '上线';
        else if (li.isActive === 0) li.$isActive = '下线';
        else li.$isActive = '--';
        
        if (li.updateStrategy === 1) li.$updateStrategy = '强制升级';
        else if (li.updateStrategy === 0) li.$updateStrategy = '推荐升级';
        else li.$updateStrategy = '--';

        return li;
      });

      this.$nextTick(() => {
        if (this.$refs["version-manage-table"]) {
          this.$refs["version-manage-table"].bodyWrapper.scrollTop = 0;
          window.scrollTo(0, 0);
        }
      });
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getSysVersionList(pageNum);
    }
  }
};
</script>

<style lang="less" scoped>
.table-goods-cover {
  display: inline-block;
  width: 100px;
  height: 60px;
}
</style>
