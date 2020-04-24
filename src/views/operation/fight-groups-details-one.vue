<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select v-model="filter.status" placeholder="拼团状态">
          <el-option :value="0" label="全部状态"></el-option>
          <el-option :value="1" label="拼团成功"></el-option>
          <el-option :value="2" label="拼团失败"></el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model="filter.text"
          placeholder="输入用户昵称/手机号"
          type="text"
        ></el-input>
      </el-col>

      <el-col :span="2" center>
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>

      <el-col :span="2" center>
        <el-button type="primary" icon="el-icon-search" @click.native="getFightGroupGoodDetails(1)">搜索</el-button>
      </el-col>

      <el-col :offset="11" :span="2" center>
        <el-button @click.native="exportData">导出数据</el-button></el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="table"
      :data="tableData"
      max-height="600"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
      <el-table-column min-width="150" prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column min-width="150" prop="mobile" label="用户手机号"></el-table-column>
      <el-table-column
        width="200"
        prop="$joinTime"
        label="参团时间"
      ></el-table-column>
      <el-table-column min-width="150" prop="$status" label="拼团状态"></el-table-column>

    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;" type="flex" justify="center" align="middle">
      <el-pagination
        :current-page.sync="filter.currPage"
        :page-size="filter.pageSize"
        :total="filter.totalCount"
        background
        layout="prev, pager, next, jumper"
        style="display: inline-block;"
        @current-change="oncurrPageChange"
      ></el-pagination>
      <el-button size="mini" style="margin-left: 20px;">跳转</el-button>
    </el-row>

    <!-- 全局操作按钮 -->
    <el-row :gutter="30" type="flex" justify="center" align="middle" style="margin-top: 50px;">
      <el-col :span="5" center>
        <el-button size="medium" @click.native="goBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getFightGroupGoodDetails,
  exportFightGroupGoodsDetails,
} from "@/api/operation";
import { formatDate } from "@/utils";

export default {
  name: "OperationFightGroupsDetailsOne",
  components: {},
  data() {
    return {
      groupId: '',
      goodsTemplateId: '',
      filter: {
        status: 0,
        text: '',
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      tableData: [],
    };
  },
  created() {
    this.groupId = String(this.$route.params.id).split(',')[0];
    this.goodsTemplateId = String(this.$route.params.id).split(',')[1];
    
    // 获取默认列表数据
    this.getFightGroupGoodDetails();
  },

  methods: {
    // 清空筛选栏
    clearFormFilter() {
      this.filter.status = 0;
      this.filter.text = "";
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 适配商品列表数据到UI
    adapterTableDataToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0
      } = result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;

      this.tableData = list.map(item => {
        // 参团时间
        item.$joinTime = formatDate(item.joinTime, 8);

        // 拼团状态
        if (item.status === 0) {
          item.$status = '待支付';
        } else if (item.status === 1) {
          item.$status = '拼团成功';
        } else if (item.status === 2) {
          item.$status = '拼团失败';
        } else {
          item.$status = '--';
        }

        return item;
      });
      this.selectedItems = [];
    },

    // 根据参数获取商品列表
    async getFightGroupGoodDetails(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        groupId: this.groupId,
        goodsTemplateId: this.goodsTemplateId,
        status: this.filter.status,
        text: this.filter.text,
      };

      // 发起请求
      const res = await getFightGroupGoodDetails(options);
      if (res.code !== 200) return Promise.reject();
      this.adapterTableDataToUI(res.result);

      this.$nextTick(() => {
        // 清空选择的项
        this.$refs.table.clearSelection();

        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getFightGroupGoodDetails(pageNum);
    },

    // 导出数据
    async exportData() {
      const res = await exportFightGroupGoodsDetails(this.groupId, this.goodsTemplateId);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, "_self");
      }
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
.color-block-primary {
  display: inline-block;
  width: 5px;
  height: 20px;
  margin-right: 2px;
  background-color: #409eff;
  vertical-align: bottom;
}
</style>
