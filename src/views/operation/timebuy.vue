<template>
  <div class="content-container">
    <!-- 运营管理 - 限时抢购 -->
    <div class="timebuy">
      <!-- select选框部分 -->
      <div class="pageheard">
        <el-form :inline="true" :model="formInline" class="flex-center">
          <el-form-item label class="selectbox magin-left">
            <el-select v-model="formInline.status" placeholder="全部活动状态">
              <el-option label="全部活动状态" value></el-option>
              <el-option label="未开始" value="1"></el-option>
              <el-option label="进行中" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label class="selectbox magin-left">
            <el-select v-model="formInline.publishStatus" placeholder="全部发布状态">
              <el-option label="全部发布状态" value></el-option>
              <el-option label="待审核" value="1"></el-option>
              <el-option label="已上架" value="2"></el-option>
              <el-option label="已下架" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-input
              :loading="loading"
              v-model="formInline.goodsName"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-button icon="el-icon-search" type="primary" @click.native="onSubmit">搜索</el-button>
          </el-form-item>
          <el-button
            v-permission="['operate:buy:save']"
            type="primary"
            class="addnew"
            @click.native="goNew"
          >新建活动</el-button>
        </el-form>
      </div>

      <!-- 表格部分 -->
      <div class="tables">
        <el-table :data="fastData" border style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" prop="goods.name" label="抢购商品" width="180"></el-table-column>
          <el-table-column prop="totalRepertory" label="活动总库存" min-width="120"></el-table-column>
          <el-table-column prop="repertory" label="活动可用库存" min-width="120"></el-table-column>
          <el-table-column prop="goods.buyCount" label="成交数量" min-width="120"></el-table-column>
          <el-table-column prop="price" label="抢购价（元）" min-width="120"></el-table-column>
          <el-table-column prop="goods.price" label="商品原价（元）" min-width="120"></el-table-column>
          <el-table-column prop="updateName" label="修改人" min-width="120"></el-table-column>
          <el-table-column prop="overtime" label="抢购时间" min-width="220">
            <template slot-scope="scope">
              <span style="display:block;">起：{{ timeFormat(scope.row.startTime) }}</span>
              <span style="display:block;">止：{{ timeFormat(scope.row.endTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="活动状态" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.status | activityState }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="publishStatus" label="发布状态" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.publishStatus | issueState }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="250">
            <template slot-scope="scope">
              <router-link
                v-permission="['operate:buy:update']"
                v-if="scope.row.$showBtnEdit"
                :to="{ name: 'OperationManageTimebuyEdit', params: { id: scope.row.id } }"
              >
                <el-button type="primary" plain>编辑</el-button>
              </router-link>

              <el-button
                v-permission="['operate:buy:select']"
                v-if="scope.row.$showBtnDetail"
                type="primary"
                plain
                @click="centerDialogVisible = true"
                @click.native="checkDetail(scope.row.id)"
              >详情</el-button>

              <el-button
                v-permission="['operate:buy:delete']"
                v-if="scope.row.$showBtnDelete"
                type="danger"
                @click.native="killDetele(scope.row.id)"
              >删除</el-button>

              <el-button
                v-permission="['operate:buy:ud']"
                v-if="scope.row.$showBtnUp"
                type="primary"
                plain
                @click.native="onSale(scope.row)"
              >上架</el-button>

              <el-button
                v-permission="['operate:buy:ud']"
                v-if="scope.row.$showBtnDown"
                type="danger"
                plain
                @click.native="saleOut(scope.row.id)"
              >下架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 主表格分页 -->
      <div class="block" style="display:flex;justify-content:center;margin:20px 0px">
        <el-pagination
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          class="simplepage"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>

      <!-- 点击详情出现的弹窗 -->
      <el-dialog :visible.sync="centerDialogVisible" title="查看详情" width="900px" left>
        <el-form :inline="true" :model="goodDetail" class="flex-center">
          <el-form-item label style="width:150px;">
            <el-select v-model="goodDetail.status2" placeholder="全部状态">
              <el-option
                v-for="(item, index) in goodDetailStatus"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-input
              :loading="loading"
              v-model="goodDetail.nickName"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="用户昵称"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click.native="searchData">搜索</el-button>
          <el-button
            v-permission="['operate:buy:export']"
            class="alldata"
            @click.native="exportDatas"
          >导出全部数据</el-button>
        </el-form>
        <el-table :data="gridData" class="fastdialogtable" border>
          <el-table-column property="nickName" label="用户昵称" width="150"></el-table-column>
          <el-table-column property="order.createTime" label="下单时间" width="200"></el-table-column>
          <el-table-column property="order.code" label="订单编号"></el-table-column>
          <el-table-column property="status2" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status2 == '1'">抢购成功</span>
              <span v-if="scope.row.status2 == '0'">抢购失败</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer fastdialogbtn">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="fastdialogyes" @click="centerDialogVisible = false">确 定</el-button>
        </span>
        <!-- 弹窗分页 -->
        <div class="block" style="display:flex;justify-content:center;margin-top:10px">
          <el-pagination
            :current-page.sync="goodDetail.pageNum"
            :page-size="goodDetail.pageSize"
            :total="dialogTotal"
            layout="prev, pager, next, jumper"
            class="simplepage"
            background
            @size-change="dialogHandleSizeChange"
            @current-change="dialogHandleCurrentChange"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  fastestBuyPage,
  goodOnsale,
  goodLowerSale,
  fastestDelete,
  checkDetailActivity,
  exportActivityData
} from "@/api/operation";
import { formatDate } from "@/utils/index";

export default {
  name: "OperationManageTimebuy",
  components: {},
  filters: {
    activityState(value) {
      if (value) {
        const data = value === 1 ? "未开始" : value === 2 ? "进行中" : "已结束";
        return data;
      }
    },
    issueState(value) {
      if (value) {
        const data = value === 1 ? "待审核" : value === 2 ? "已上架" : "已下架";
        return data;
      }
    }
  },
  data() {
    return {
      // 点击详情存放对应数据id
      oneDataId: null,
      input: "",
      value: "",
      // 存放主表格数据
      fastData: [],
      // 主表格当前页
      currentPage: 1,
      // 单页条数
      pageSize: 10,
      // 总条数
      total: 10,
      totalPage: 10,
      pageNum: 1,
      // select选框内容
      // 这里放的是表单提交的数据
      formInline: {
        status: "", // 全部活动状态
        goodsName: "", // 搜索框输入的内容
        publishStatus: "",
        type: 3,
        pageNum: 1,
        pageSize: 10
      },
      // 活动状态
      goodsStatus: [
        {
          id: 2134346,
          label: "全部活动状态",
          value: "1"
        },
        {
          id: 32453534,
          label: "进行中",
          value: "2"
        },
        {
          id: 897856,
          label: "已结束",
          value: "3"
        }
      ],
      // 发布状态
      releaseStatus: [
        {
          id: 34534564,
          label: "待审核",
          value: "1"
        },
        {
          id: 678967896,
          label: "已上架",
          value: "2"
        },
        {
          id: 4534543567,
          label: "已下架",
          value: "3"
        }
      ],
      loading: false,
      // 弹窗事件开关
      centerDialogVisible: false,
      // 弹窗select选框部分
      goodDetail: {
        // 状态
        status2: "",
        nickName: "",
        pageSize: 10,
        pageNum: 1,
        activityId: ""
      },
      dialogTotal: 10,
      dialogTotalPage: 10,
      goodDetailStatus: [
        {
          label: "全部状态",
          value: ""
        },
        {
          label: "抢购成功",
          value: 1
        },
        {
          label: "抢购失败",
          value: 0
        }
      ],
      // 存放弹窗表格数据
      gridData: [],
      dialogCurrPage: 1,
      dialogPageNum: 1,
      dialogPageSize: 10
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    this.getFastestBuyPageData();
    this.getActivityData();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === "OperationManageTimebuy") {
        this.getFastestBuyPageData();
      }
    },
    timeFormat: formatDate, // 时间戳转化
    // 获取抢购列表数据
    getFastestBuyPageData() {
      fastestBuyPage(this.formInline).then(res => {
        this.fastData = res.result.list.map(i => {
          const date = new Date();
          const endTime = new Date(i.endTime);
          // 上架按钮
          i.$showBtnUp = true;
          // 已下架的商品不能重新上架,发布状态已上架不能显示上架
          if (i.publishStatus === 3 || i.publishStatus === 2) {
            i.$showBtnUp = false;
          }

          // 下架按钮
          i.$showBtnDown = true;
          // 发布状态为已下架和待审核不能下架
          if (i.publishStatus === 3 || i.publishStatus === 1) {
            i.$showBtnDown = false;
          }

          // 编辑按钮
          i.$showBtnEdit = true;
          // 活动状态为已结束不能显示编辑
          if (i.status === 3) {
            i.$showBtnEdit = false;
          }

          // 详情按钮
          i.$showBtnDetail = true;
          // 活动状态为未开始不能显示详情
          if (i.status === 1) {
            i.$showBtnDetail = false;
          }

          // 删除按钮
          i.$showBtnDelete = true;
          // 活动状态为未开始和进行中不能显示删除
          if (i.status === 1 || i.status === 2) {
            i.$showBtnDelete = false;
          }
          return i;
        });
        this.fastData = res.result.list;
        this.pageSize = res.result.pageSize || 10;
        this.total = res.result.totalCount;
      });
    },

    // 主页面点击搜索
    onSubmit() {
      this.getFastestBuyPageData();
    },

    // 上架
    onSale(items) {
      // 获取当前时间
      const date = new Date();
      const startTime = new Date(items.startTime);
      if (startTime < date) {
        this.$confirm(
          "无法上架，请检查商品总库存和活动时间是否符合要求",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$message({
              type: "info",
              message: "已退出上架"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消上架"
            });
          });
      } else {
        this.$confirm("是否确认上架", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            goodOnsale(items.id).then(res => {
              this.getFastestBuyPageData();
            });
            this.$message({
              type: "success",
              message: "上架成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消上架"
            });
          });
      }
    },

    // 下架
    saleOut(id) {
      this.$confirm("是否确认下架，下架后，该商品无法参与活动", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          goodLowerSale(id).then(res => {
            this.getFastestBuyPageData();
          });
          this.$message({
            type: "success",
            message: "下架成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架"
          });
        });
    },

    // 删除
    killDetele(id) {
      fastestDelete(id).then(res => {
        this.getFastestBuyPageData();
      });
    },

    // 点击详情
    checkDetail(item) {
      // 存放活动id
      this.oneDataId = item;
      this.getActivityData(item);
    },

    // 获取弹窗数据
    getActivityData() {
      this.goodDetail.activityId = this.oneDataId;
      checkDetailActivity(this.goodDetail).then(res => {
        this.gridData = res.result.list;
      });
    },


    // 弹窗里面的搜索
    searchData() {
      this.goodDetail.activityId = this.oneDataId;
      checkDetailActivity(this.goodDetail).then(res => {
        // 刷新弹窗表格数据
        this.gridData = res.result.list;
        this.dialogTotal = res.result.totalCount;
        this.dialogTotalPage = res.result.totalPage;
      });
    },

    // 弹窗里面的导出
    exportDatas() {
      this.goodDetail.activityId = this.oneDataId;
      exportActivityData(this.goodDetail.activityId).then(res => {
        if (res.code !== 200) return false;
        const { url } = res.result;
        if (url) {
          window.open(url);
        }
      });
    },


    // 跳转新建页面
    goNew() {
      this.$router.push("time-buy/add");
    },

    // 主表格分页
    handleSizeChange(val) {
      this.formInline.pageSize = val;
    },

    handleCurrentChange(val) {
      this.formInline.pageNum = val;
      this.getFastestBuyPageData();
    },

    dialogHandleSizeChange(val) {
      this.searchData.pageSize = val;
    },

    dialogHandleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getActivityData();
    },

  }
};
</script>

<style scoped lang="scss">
.content-container {
  .fastestbuy {
    padding: 20px;
    padding-top: 0px;
    .kill-top {
      display: flex;
      justify-content: flex-end;
      .ss {
        margin-right: 20px;
      }
      .goodname {
        width: 200px !important;
        margin-right: 20px;
      }
    }
    .tables {
      margin: 20px 0px;
    }
    .block {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  // select选框部分样式
  .pageheard {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    // background-color: #eee;
    flex-direction: row-reverse;
    .selectbox {
      width: 180px;
    }
    .flex-center {
      display: flex;
      margin-right: 12px;
      align-items: center;
    }
    .magin-left {
      margin: 0;
      margin-left: 20px;
    }
    .addnew {
      margin-left: 80px;
    }
    .alldata {
      float: left;
    }
  }
  .fastdialogtable {
    margin-bottom: 30px;
  }
  .fastdialogbtn {
    display: flex;
    justify-content: center;
    .fastdialogyes {
      margin-left: 100px;
    }
  }
}
</style>