<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select v-model="filter.activityStatus" placeholder="活动状态">
          <el-option :value="0" label="全部活动状态"></el-option>
          <el-option :value="1" label="待审核"></el-option>
          <el-option :value="2" label="进行中"></el-option>
          <el-option :value="3" label="已结束"></el-option>
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-input v-model="filter.groupName" placeholder="输入团名"></el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" icon="el-icon-search" @click.native="getFightGroupsList(1)">搜索</el-button>
      </el-col>

      <!-- <el-col :offset="10" :span="2">
        <router-link :to="{ name: 'OperationFightGroupsAdd' }">
          <el-button type="primary">新建拼团</el-button>
        </router-link>
      </el-col>-->
    </el-row>

    <!-- 操作栏 -->
    <el-row :gutter="40" style="margin-top: 30px;">
      <el-col v-permission="['operate:group:save']" :span="2">
        <router-link :to="{ name: 'OperationFightGroupsAdd' }">
          <el-button type="primary">新建拼团</el-button>
        </router-link>
      </el-col>

      <el-col v-permission="['operate:group:ud']" :span="2">
        <el-button type="warning" plain @click.native="onPutaway(selectedItems)">批量上架</el-button>
      </el-col>

      <!-- <el-col v-permission="['goods:list:ud']" :span="2">
        <el-button type="info" @click.native="onSoldOut(selectedItems)">批量下架</el-button>
      </el-col>

      <el-col v-permission="['goods:list:commend']" :span="3">
        <el-button type="primary" @click.native="onRecommend(selectedItems)">批量设置商品推荐</el-button>
      </el-col>

      <el-col v-permission="['goods:list:commend']" :span="3">
        <el-button type="info" @click.native="onUnRecommend(selectedItems)">批量取消商品推荐</el-button>
      </el-col>

      <el-col v-permission="['goods:list:delete']" :span="3">
        <el-button type="danger" @click.native="onDelete(selectedItems)">批量删除</el-button>
      </el-col>-->
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="table"
      :data="tableData"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
      @select="onSelectCheckBox"
      @select-all="onSelectCheckBox"
    >
      <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
      <el-table-column width="55" type="selection" align="center"></el-table-column>
      <el-table-column min-width="150" prop="groupName" label="团名" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="150" prop="$rangeStrList" label="生效范围" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="180" label="拼团时间">
        <template slot-scope="scope">
          <div v-if="scope.row.$groupStartTime">起：{{ scope.row.$groupStartTime }}</div>
          <div v-if="scope.row.$groupStopTime">止：{{ scope.row.$groupStopTime }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="updateName" label="修改人" min-width="80"></el-table-column>
      <el-table-column min-width="150" prop="$discount" align="center" label="拼团优惠"></el-table-column>
      <el-table-column width="150" prop="$activityStatus" align="center" label="活动状态"></el-table-column>
      <el-table-column label="操作" min-width="110" fixed="right">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.$showBtnDetails"
            :to="{ name: 'OperationFightGroupsDetails', params: { id: scope.row.id } }"
          >
            <el-button size="mini" type="primary" plain>详情</el-button>
          </router-link>

          <router-link
            v-if="scope.row.$showBtnEdit"
            :to="{ name: 'OperationFightGroupsEdit', params: { id: scope.row.id } }"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>

          <el-button
            v-permission="['operate:group:ud']"
            v-if="scope.row.$showBtnUp"
            size="mini"
            type="warning"
            plain
            @click.native="onPutaway([scope.row])"
          >上架</el-button>
          <el-button
            v-permission="['operate:group:ud']"
            v-if="scope.row.$showBtnDown"
            size="mini"
            type="info"
            plain
            @click.native="onSoldOut([scope.row])"
          >下架</el-button>
          <el-button
            v-permission="['operate:group:delete']"
            v-if="scope.row.$showBtnDelete"
            size="mini"
            type="danger"
            plain
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
  getFightGroupsList,
  deleteFightGroups,
  changeFightGroupsUpAndDown
} from "@/api/operation";
import { formatDate } from "@/utils";


export default {
  name: "OperationFightGroups",
  components: {
    MultiCascader
  },
  data() {
    return {
      state: {
      },
      filter: {
        activityStatus: 0,
        groupName: '',
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      tableData: [],
      selectedItems: []
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    // 获取默认列表数据
    this.getFightGroupsList();
  },

  methods: {
    onRouteChange(to) {
      if (to.name === "OperationFightGroups") {
        this.getFightGroupsList(this.filter.currPage);
      }
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.activityStatus = 0;
      this.filter.groupName = '';
    },

    // 适配列表数据到UI
    adapterToUI(result = {}) {
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
        // 活动状态
        if (item.activityStatus === 1) {
          item.$activityStatus = "待审核";
        } else if (item.activityStatus === 2) {
          item.$activityStatus = "进行中";
        } else if (item.activityStatus === 3) {
          item.$activityStatus = "已结束";
        } else {
          item.$activityStatus = "--";
        }

        // 生效范围
        item.$rangeStrList = item.rangeStrList.join('、');
        
        // 拼团时间 - start
        if (item.groupStartTime) item.$groupStartTime = formatDate(item.groupStartTime, 8);

        // 拼团时间 - stop
        if (item.groupStopTime) item.$groupStopTime = formatDate(item.groupStopTime, 8);

        // 拼团优惠
        item.$discount = "";
        if (item.discountType === 1) {
          item.$discount = `现金优惠${item.discountAmount}元`;
        } else if (item.discountType === 2) {
          item.$discount = `折扣优惠${item.discountRate}折`;
        }

        // 操作按钮 - 上架
        item.$showBtnUp = false;
        if (item.activityStatus === 1) {
          item.$showBtnUp = true;
        }

        // 操作按钮 - 下架
        item.$showBtnDown = false;
        if (item.activityStatus === 2) {
          item.$showBtnDown = true;
        }

        // 操作按钮 - 编辑
        item.$showBtnEdit = false;
        if (item.activityStatus === 1) {
          item.$showBtnEdit = true;
        }

        // 操作按钮 - 删除
        item.$showBtnDelete = false;
        if (item.activityStatus === 3) {
          item.$showBtnDelete = true;
        }

        // 操作按钮 - 详情
        if (item.activityStatus != 1) {
          item.$showBtnDetails = true;
        }

        return item;
      });
      this.selectedItems = [];
    },

    // 根据参数获取商品列表
    async getFightGroupsList(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        // 活动状态
        activityStatus: this.filter.activityStatus,
        // 团名称
        groupName: this.filter.groupName
      };

      // 发起请求
      const res = await getFightGroupsList(options);
      if (res.code !== 200) return Promise.reject();
      this.adapterToUI(res.result);

      this.$nextTick(() => {
        // 清空选择的项
        this.$refs.table.clearSelection();

        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 判断单项是否满足条件 - 上架
    // 返回Boolean
    checkPutaway(item) {
      let temp = false;
      if (item.issueStatus === 0 || item.issueStatus === 2) temp = true;
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
    checkDelete(item) {
      let temp = false;
      if (
        item.issueStatus === 0 ||
        item.issueStatus === 2 ||
        item.issueStatus === 4
      ) {
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
      // const noPass = items.some(i => !this.checkDelete(i));
      const noPass = false;
      if (noPass) {
        this.$confirm(
          "只能删除未发布、下架、停售状态的商品，请排查是否勾选了其他状态的商品！",
          "删除商品",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "warning"
          }
        );
      } else {
        const confimRes = await this.$confirm(
          "是否确认删除",
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
          const { code } = await deleteFightGroups(ids);
          if (code === 200) {
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            // 重新获取列表
            this.getFightGroupsList(this.filter.currPage);
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
      const pass = items.every(i => i.activityStatus === 1);
      if (!pass) {
        this.$confirm(
          "无法操作，选中的数据中包含非待审核状态的数据",
          "提示",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "warning"
          }
        );
      } else {
        const confimRes = await this.$confirm(
          "是否确认上架？",
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
          const { code } = await changeFightGroupsUpAndDown(ids);
          if (code === 200) {
            this.$message({
              message: "上架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getFightGroupsList(this.filter.currPage);
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
      // const pass = items.every(i => i.activityStatus === 1);
      const pass = true;
      if (!pass) {
        this.$confirm(
          "无法操作，选中的数据中包含非待审核状态的数据",
          "提示",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "warning"
          }
        );
      } else {
        const confimRes = await this.$confirm(
          "是否确认下架，下架后用户将无法再参与该团？",
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
          const { code } = await changeFightGroupsUpAndDown(ids, 3);
          if (code === 200) {
            this.$message({
              message: "下架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getFightGroupsList(this.filter.currPage);
          }
        }
      }
    },

    // 单选 or 全选
    onSelectCheckBox(selection) {
      this.selectedItems = selection;
    },
    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getFightGroupsList(pageNum);
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
