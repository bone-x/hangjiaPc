<template>
  <div class="content-container">
    <!-- 私域H5管理 - 商品列表 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input
          v-model="filterParams.goodsName"
          placeholder="请输入商品名称"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="filterParams.id"
          placeholder="请输入商品ID"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          style="margin-left: 35px"
          @click.native="onSearchFilterParams"
        >查询</el-button>
      </el-col>
      <el-col :span="3">
        <el-button
          type="danger"
          @click.native="clearFilterParams"
        >清空</el-button>
      </el-col>
      <el-col :span="2">
        <router-link
          v-permission="['activity:goods:add']"
          :to="{ name: 'H5GoodsAdd' }"
        >
          <el-button type="primary">新增商品</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="goodslist"
      :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
      tooltip-effect="dark"
      style="width: 100%;margin-top:40px"
      class="billtable"
      border
    >
      <el-table-column
        prop="id"
        label="商品ID"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="商品原价"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span>￥{{ Number(scope.row.originalPrice || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品售价"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span>￥{{ Number(scope.row.price || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="优惠价格"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span>￥{{ Number(scope.row.discount || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateName"
        label="最后修改人"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="修改时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.updateTime">{{ timeFormat(scope.row.updateTime) }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="link"
        label="售价链接"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.link">{{scope.row.link}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        width="180"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            v-permission="['activity:goods:update']"
            :to="{ name: 'H5GoodsEdit', params: { id: scope.row.id } }"
          >
            <el-button
              type="primary"
              plain
              size="mini"
            >编辑</el-button>
          </router-link>
          <el-button
            v-permission="['activity:goods:delete']"
            type="danger"
            size="mini"
            @click.native="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row
      type="flex"
      justify="center"
      style="margin-top: 30px"
    >
      <el-pagination
        :current-page.sync="filterParams.pageNum"
        :page-size="filterParams.pageSize"
        :total="filterParams.totalCount"
        layout="prev, pager, next, jumper"
        background
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
import { formatDate } from '@/utils/index';
import { getGoodsList, deleteGoods } from '@/api/h5-private';

export default {
  name: 'H5GoodsList',
  data() {
    return {
      filterParams: {
        goodsName: '',
        id: '',
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
      },
      goodslist: [],
      multipleSelection: [],
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  mounted() {
    this.getGoodsListData();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'H5GoodsList') {
        this.getGoodsListData(this.filterParams.pageNum);
      }
    },
    timeFormat: formatDate, // 时间戳转化
    // 查询
    onSearchFilterParams() {
      this.getGoodsListData();
    },

    // 清空
    clearFilterParams() {
      this.filterParams.goodsName = '';
      this.filterParams.id = '';
      this.getGoodsListData();
    },

    // 删除
    handleDelete(item) {
      if (!item.id) return false;
      deleteGoods(item.id).then(() => this.getGoodsListData());
    },

    handleCurrentChange(pageNum = 1) {
      this.getGoodsListData(pageNum);
    },

    // 获取分页数据
    async getGoodsListData(pageNum = 1) {
      const res = await getGoodsList({
        id: this.filterParams.id,
        name: this.filterParams.goodsName,
        pageNum,
        pageSize: this.filterParams.pageSize,
      });
      if (res.code !== 200) return Promise.reject();
      this.filterParams.pageNum = res.result.currPage;
      this.filterParams.pageSize = res.result.pageSize;
      this.filterParams.totalCount = res.result.totalCount;
      this.goodslist = res.result.list;
    },
  },
};
</script>
<style lang="less" scoped>
</style>