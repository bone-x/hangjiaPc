<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="filter.activityName" placeholder="请输入活动名称"></el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" icon="el-icon-search" @click.native="getActivityList(1)">查询</el-button>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button @click.native="clearFormFilter">清除</el-button>
      </el-col>

      <el-col :offset="14" :span="2">
        <router-link v-permission="['operate:landingPage:save']" :to="{ name: 'OperationActivityManageAdd' }">
          <el-button type="primary">添加活动</el-button>
        </router-link>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="table"
      :data="tableData"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column min-width="50" prop="id" label="ID" align="center"></el-table-column>
      <el-table-column min-width="150" prop="activityName" label="活动名称"></el-table-column>
      <el-table-column width="180" label="活动时间">
        <template slot-scope="scope">
          <div v-if="scope.row.$actiityBeginTime">起：{{ scope.row.$actiityBeginTime }}</div>
          <div v-if="scope.row.$actiityEndTime">止：{{ scope.row.$actiityEndTime }}</div>
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="web端活动图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.webImageUrl" class="table-goods-cover" alt="web端活动图片">
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="App端活动图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.appImageUrl" class="table-goods-cover" alt="App端活动图片">
        </template>
      </el-table-column>
      <el-table-column width="180" prop="webJumpUrl" label="web端按钮跳转的链接" show-overflow-tooltip></el-table-column>
      <el-table-column width="180" prop="appJumpUrl" label="App端按钮跳转的链接" show-overflow-tooltip></el-table-column>
      <el-table-column width="150" prop="$publishStatus" align="center" label="活动状态"></el-table-column>
      <el-table-column width="150" prop="updateUserName" align="center" label="修改用户"></el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template slot-scope="scope">
          <router-link
            v-permission="['operate:landingPage:update']"
            v-if="scope.row.$showBtnEdit"
            :to="{ name: 'OperationActivityManageEdit', params: { id: scope.row.id } }"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>
          <el-button
            v-permission="['operate:landingPage:ud']"
            v-if="scope.row.$showBtnUp"
            size="mini"
            @click.native="onPutaway([scope.row])"
          >上架</el-button>
          <el-button
            v-permission="['operate:landingPage:ud']"
            v-if="scope.row.$showBtnDown"
            size="mini"
            @click.native="onSoldOut([scope.row])"
          >下架</el-button>
          <el-button
            v-permission="['operate:landingPage:delete']"
            v-if="scope.row.$showBtnDelete"
            size="mini"
            type="danger"
            @click.native="onDelete([scope.row])"
          >删除</el-button>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
import MultiCascader from "@/components/MultiCascader";
import {
  getActivityList,
  deleteActivity,
  setActivityUp,
  setActivityDown
} from "@/api/operation";
import { formatDate } from "@/utils";

export default {
  name: "OperationActivityManage",
  components: {
    MultiCascader
  },
  data() {
    return {
      filter: {
        activityName: "",
        currPage: 1,
        pageSize: 10,
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
    this.getActivityList();
  },

  methods: {
    onRouteChange(to) {
      if (to.name === "OperationActivityManage") {
        this.getActivityList(this.filter.currPage);
      }
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.activityName = "";
    },

    // 适配商品列表数据到UI
    adapterGoodsToUI(result = {}) {
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
        // 活动时间 - 起始
        if (item.actiityBeginTime) {
          item.$actiityBeginTime = formatDate(item.actiityBeginTime, 8);
        }

        // 活动时间 - 截止
        if (item.actiityEndTime) {
          item.$actiityEndTime = formatDate(item.actiityEndTime, 8);
        }

        // 创建时间
        if (item.createTime) {
          item.$createTime = formatDate(item.createTime, 8);
        }

        // 更新时间
        if (item.updateTime) {
          item.$updateTime = formatDate(item.updateTime, 8);
        }

        // 上架状态
        if (item.publishStatus === 1) item.$publishStatus = "待审核";
        else if (item.publishStatus === 2) item.$publishStatus = "进行中";
        else if (item.publishStatus === 3) item.$publishStatus = "已结束";
        else item.$publishStatus = "--";

        // 按钮 - 上架
        if (item.publishStatus === 1) item.$showBtnUp = true;

        // 按钮 - 下架
        if (item.publishStatus === 2) item.$showBtnDown = true;

        // 按钮 - 编辑
        if (item.publishStatus === 1) item.$showBtnEdit = true;

        // 按钮 - 删除
        if (item.publishStatus === 1) item.$showBtnDelete = true;

        return item;
      });
    },

    // 根据参数获取商品列表
    async getActivityList(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        activityName: this.filter.activityName
      };

      // 发起请求
      const res = await getActivityList(options);
      if (res.code !== 200) return Promise.reject();
      this.adapterGoodsToUI(res.result);

      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      });
    },

    // 判断单项是否满足条件 - 上架
    // 返回Boolean
    usableUp(item) {
      let temp = false;
      if (+new Date() <= +new Date(item.actiityEndTime)) {
        temp = true;
      }
      return temp;
    },

    // 判断单项是否满足条件 - 下架
    // 返回Boolean
    checkSoldOut(item) {
      let temp = false;
      if (item.issueStatus === 1) temp = true;
      return temp;
    },

    // 判断单项是否满足条件 - 删除
    // 返回Boolean
    usableDelete(item) {
      let temp = false;
      if (+new Date() > +new Date(item.actiityEndTime)) {
        temp = true;
      }
      return temp;
    },

    // 如果没有选择，则提醒
    // 返回Boolean
    checkSelectIsNull(items = []) {
      if (items.length <= 0) {
        this.$confirm("请至少勾选一条数据！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        });
        return true;
      }
      return false;
    },

    // 操作 - [删除 or 批量删除]
    async onDelete(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 已选择
      const pass = items.some(i => this.usableDelete(i));
      if (!pass) {
        this.$confirm("活动在审核中，不能删除该活动！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        });
      } else {
        const confimRes = await this.$confirm("是否确定删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confimRes) {
          // 确认删除的回调
          const ids = items.map(i => i.id);
          const { code } = await deleteActivity(ids[0]);
          if (code === 200) {
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            // 重新获取列表
            this.getActivityList(this.filter.currPage);
          }
        }
      }
    },

    // 操作 - [上架 or 批量上架]
    async onPutaway(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 已选择
      const pass = items.some(i => this.usableUp(i));
      if (!pass) {
        this.$confirm("无法上架，该活动已过期", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        });
      } else {
        const confimRes = await this.$confirm("是否确定上架？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confimRes) {
          // 确认删除的回调
          const ids = items.map(i => i.id);
          const { code } = await setActivityUp(ids[0]);
          if (code === 200) {
            this.$message({
              message: "上架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getActivityList(this.filter.currPage);
          }
        }
      }
    },

    // 操作 - [下架 or 批量下架]
    async onSoldOut(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 已选择
      const confimRes = await this.$confirm(
        "是否确定下架，下架后无法再次上架该活动",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      if (confimRes) {
        // 确认删除的回调
        const ids = items.map(i => i.id);
        const { code } = await setActivityDown(ids[0]);
        if (code === 200) {
          this.$message({
            message: "下架成功！",
            type: "success"
          });
          // 重新获取列表
          this.getActivityList(this.filter.currPage);
        }
      }
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getActivityList(pageNum);
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
