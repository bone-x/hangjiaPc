<template>
  <div class="order_list">
    <!-- 交易管理 - 订单管理 - 订单详情 -->
    <div class="order-detail">
      <el-form
        ref="form"
        :model="studentInfo"
        label-position="left"
        label-width="200px"
        style="margin-left: 30px"
        size="large"
      >
        <h3 class="studentTitle">学员信息</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="学员ID："
              prop="id"
              label-width="150px"
            >
              <span>{{studentInfo.id}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="学员姓名："
              prop="realName"
              label-width="150px"
            >
              <span>{{studentInfo.realName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="手机号："
              prop="tel"
              label-width="150px"
            >
              <span>{{studentInfo.tel}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        ref="form"
        :model="orderInfo"
        label-position="left"
        label-width="200px"
        style="margin-left: 30px"
        size="large"
      >
        <h3 class="studentTitle">订单信息</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="订单编号："
              prop="code"
              label-width="150px"
            >
              <span>{{orderInfo.code}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="交易流水号："
              prop="serialNumber"
              label-width="150px"
            >
              <span>{{orderInfo.serialNumber}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="下单时间："
              prop="createTime"
              label-width="150px"
            >
              <span>{{orderInfo.createTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="orderInfo.status === 4">
          <el-col :span="8">
            <el-form-item
              label="交易关闭原因："
              prop="tradeClosedReason"
              label-width="150px"
            >
              <span>{{ orderInfo.tradeClosedReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="商品信息："
              prop="infoTitle"
              label-width="150px"
            >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label=""
              prop="infoTitle"
              label-width="0px"
            >
              <el-table
                :data="goodsInfos"
                border
                style="width: 100%;margin:10px 0px 20px 0px"
              >
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="goodsName"
                  label="商品名称"
                  width="200px"
                >
                  <template slot-scope="scope">
                    <router-link
                      v-if="scope.row.invoiceStatus === 0 && scope.row.refundStatus === 0"
                      :to="{ name: 'OrderListDetails' }"
                    >
                      <span class="goods-name">{{ scope.row.goodsName }}</span>
                    </router-link>
                    <router-link
                      v-else-if="scope.row.invoiceStatus === 0"
                      :to="{ name: 'OrderRefundDetails', params: { id: scope.row.refundId } }"
                    >
                      <span class="goods-name">{{ scope.row.goodsName }}</span>
                    </router-link>
                    <router-link
                      v-else
                      :to="{ name: 'OrderInvoiceDetails', params: { id: scope.row.invoiceId } }"
                    >
                      <span class="goods-name">{{ scope.row.goodsName }}</span>
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="totalFee"
                  label="商品原价"
                  width="100"
                  style=":hover:text-decoration: underline"
                >
                  <template slot-scope="scope">
                    <span>￥{{ Number(scope.row.totalFee || 0).toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="商品类型"
                  width="150px"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 0">其它</span>
                    <span v-if="scope.row.type === 1">直播课</span>
                    <span v-if="scope.row.type === 2">录播课</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="orgName"
                  label="所属机构"
                  width="150px"
                ></el-table-column>
                <el-table-column
                  prop="price"
                  label="实付金额/行家币"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.paymentType === 2">{{ Number(scope.row.price || 0).toFixed(2) }}行家币</span>
                    <span v-else-if="scope.row.paymentType === 3">{{ Number(scope.row.point || 0).toFixed(2) }}积分</span>
                    <span v-else-if="scope.row.activityType === 1">{{ Number(scope.row.point || 0).toFixed(2) }}积分</span>
                    <span v-else>￥{{ Number(scope.row.price || 0).toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validityDate"
                  label="有效期"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.validityDate === -1">永久有效</span>
                    <span v-else-if="scope.row.validityDate === scope.row.validityDate">自购买起{{ scope.row.validityDate }}个月有效</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="activityType"
                  label="参与活动"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.activityType === 0">无</span>
                    <span v-if="scope.row.activityType === 1">积分</span>
                    <span v-if="scope.row.activityType === 2">限时秒杀</span>
                    <span v-if="scope.row.activityType === 3">限时抢购</span>
                    <span v-if="scope.row.activityType === 4">拼团</span>
                    <span v-if="scope.row.activityType === 5">听课卡</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="invoiceStatus"
                  label="开票状态"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.invoiceStatus === 0">无</span>
                    <span v-if="scope.row.invoiceStatus === 1">等待开票</span>
                    <span v-if="scope.row.invoiceStatus === 2">已开票</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="refundStatus"
                  label="退款状态"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.refundStatus === 0">无</span>
                    <span v-if="scope.row.refundStatus === 1">审核中</span>
                    <span v-if="scope.row.refundStatus === 2">已退款</span>
                    <span v-if="scope.row.refundStatus === 3">退款失败</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form
        ref="form"
        :model="orderInfo"
        label-position="left"
        label-width="200px"
        style="margin-left: 30px"
        size="large"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="支付方式："
              prop="paymentType"
              label-width="150px"
            >
              <span v-if="orderInfo.paymentType === 0">支付宝</span>
              <span v-if="orderInfo.paymentType === 1">微信</span>
              <span v-if="orderInfo.paymentType === 2">行家币</span>
              <span v-if="orderInfo.paymentType === 3">积分支付</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="订单来源："
              prop="source"
              label-width="150px"
            >
              <span v-if="orderInfo.source === 4">PC</span>
              <span v-if="orderInfo.source === 5">APP</span>
              <span v-if="orderInfo.source === 6">微信小程序</span>
              <span v-if="orderInfo.source === 7">H5</span>
              <span v-if="orderInfo.source === 8">私域H5</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="订单状态："
              prop="status"
              label-width="150px"
            >
              <el-button
                :type="orderInfo.status === 0?'primary':''"
                class="orderStatus"
              >待支付</el-button>
              <el-button
                :type="orderInfo.status === 2?'primary':''"
                class="orderStatus"
              >已支付</el-button>
              <el-button
                :type="orderInfo.status === 3?'primary':''"
                class="orderStatus"
              >交易完成</el-button>
              <el-button
                :type="orderInfo.status === 4?'primary':''"
                class="orderStatus"
              >交易关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form
        ref="form"
        :model="orderInfo"
        label-position="left"
        label-width="200px"
        style="margin-left: 30px"
        size="large"
      >
        <h3 class="studentTitle">日志</h3>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label=""
              prop="studentTitle"
              label-width="0px"
            >
              <el-table
                :data="logInfos"
                border
                style="width: 100%"
              >
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="logShow"
                  label="日志说明"
                  width="180"
                ></el-table-column>
                <el-table-column
                  v-if="orderInfo.status !== 4"
                  prop="goodsName"
                  label="商品名称"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                ></el-table-column>
                <el-table-column
                  prop="loginIp"
                  label="IP"
                ></el-table-column>
                <el-table-column
                  prop="userName"
                  label="操作员"
                ></el-table-column>
                <el-table-column
                  prop="logStatus"
                  label="状态"
                ></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          type="flex"
          align="middle"
          justify="center"
          style="margin-top: 30px;"
        >
          <el-col
            :span="6"
            center
          >
            <el-button
              type="primary"
              plain
              @click.native="goBack"
            >返 回</el-button>
          </el-col>
          <el-col
            :span="6"
            center
          >
            <el-button
              v-permission="['trade:order:export']"
              type="primary"
              @click.native="exportSingleData"
            >导 出</el-button>
          </el-col>
        </el-row>
      </el-form>

    </div>
  </div>
</template>
<script>
import { getOrderDetail, exportSingleOrder } from '@/api/order';

export default {
  name: 'OrderListDetails',
  data() {
    return {
      orderDetails: '',
      // 学生信息
      studentInfo: {
        realName: '',
        id: '',
        tel: '',
      },
      // 订单信息
      orderInfo: {
        code: '',
        serialNumber: '',
        createTime: '',
        paymentType: '',
        source: '',
        status: '',
        tradeClosedReason: '',
      },
      // 商品信息
      goodsInfos: [],
      logInfos: [],
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      // 获取当前页面接收到的id
      const params = {
        id: this.$route.params.id,
      };
      getOrderDetail(params).then(res => {
        // 学员信息
        if (res.result.student) {
          this.studentInfo.id = res.result.student.userId;
          this.studentInfo.realName = res.result.student.realName;
          this.studentInfo.tel = res.result.student.mobile;
        }

        // 订单信息
        this.orderInfo.code = res.result.order.code;
        this.orderInfo.serialNumber = res.result.order.serialNumber;
        this.orderInfo.createTime = res.result.order.createTime;
        this.orderInfo.paymentType = res.result.order.paymentType;
        this.orderInfo.source = res.result.order.source;
        this.orderInfo.status = res.result.order.status;
        this.orderInfo.tradeClosedReason = res.result.order.tradeClosedReason;
        // 日志
        this.logInfos = res.result.logList;
        // 商品信息
        this.goodsInfos = res.result.list;
      });
    },

    // 返回
    goBack() {
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },

    // 导出
    exportSingleData() {
      const params = {
        orderIds: this.$route.params.id,
      };
      exportSingleOrder(params)
        .then(res => {
          if (res.code !== 200) return false;
          const { url } = res.result;
          if (url) {
            window.open(url);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.order-detail {
  padding: 20px;
  .studentTitle {
    height: 45px;
    line-height: 36px;
    border-bottom: 2px solid #ccc;
  }
  .goods-name:hover {
    text-decoration: underline;
    color: skyblue;
  }
}
</style>
