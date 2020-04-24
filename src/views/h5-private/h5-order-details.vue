<template>
  <div class="content-container">
    <!-- 私域H5管理 - 订单详情 -->
    <el-form
      ref="form"
      :model="orderDetails"
      label-position="left"
      label-width="200px"
      style="margin-left: 80px"
      size="large"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="学员信息"
            label-width="150px"
            class="titleMsg"
          ></el-form-item>
          <div class="line"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="学员ID："
            prop="studentId"
            label-width="150px"
          >
            <span>{{orderDetails.studentId}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="微信昵称："
            prop="wxNickname"
            label-width="150px"
          >
            <span>{{orderDetails.wxNickname}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="学员姓名："
            prop="studentName"
            label-width="150px"
          >
            <span>{{orderDetails.studentName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="手机号："
            prop="mobile"
            label-width="150px"
          >
            <span>{{orderDetails.mobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="订单信息"
            label-width="150px"
            class="titleMsg"
          ></el-form-item>
          <div class="line"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="订单编号："
            prop="code"
            label-width="150px"
          >
            <span>{{orderDetails.code}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="交易流水号："
            prop="tradeNo"
            label-width="150px"
          >
            <span>{{orderDetails.tradeNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="下单时间："
            prop="createTime"
            label-width="150px"
          >
            <span>{{orderDetails.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="商品信息："
            label-width="150px"
            class="titleMsg"
          ></el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="goodsInfos"
            border
            style="width: 95%;margin:10px 0px 20px 0px"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              prop="goodsName"
              label="商品名称"
              width="300"
              align="center"
            >
              <template slot-scope="scope">
                <span class="goodsName">{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="goodsOrginalPrice"
              label="商品原价"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <span>￥{{ Number(scope.row.goodsOrginalPrice || 0).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsPrice"
              label="商品售价"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <span>￥{{ Number(scope.row.goodsPrice || 0).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="paidAmount"
              label="实付金额"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span>￥{{ Number(scope.row.paidAmount || 0).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsLink"
              label="售价链接"
              align="center"
              fixed="right"
              style=":hover:text-decoration: underline"
            >
              <template slot-scope="scope">
                <span class="saleUrl">{{scope.row.goodsLink}}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="支付方式："
            prop="paymentType"
            label-width="150px"
          >
            <span v-if="orderDetails.paymentType === 0">支付宝</span>
            <span v-else="orderDetails.paymentType === 1">微信</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="订单来源："
            prop="source"
            label-width="150px"
          >
            <!-- 4 PC端  5 APP 6 微信小程序  7  H5  8 私域H5 -->
            <span v-if="orderDetails.source === 4">PC端</span>
            <span v-if="orderDetails.source === 5">APP</span>
            <span v-if="orderDetails.source === 6">微信小程序</span>
            <span v-if="orderDetails.source === 7">H5</span>
            <span v-if="orderDetails.source === 8">私域H5</span>
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
              v-if="orderDetails.status === 3"
              type="primary"
              size="medium"
              style="cursor: text"
            >交易完成</el-button>
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
          <el-button @click.native="goBack">返 回</el-button>
        </el-col>
        <el-col
          :span="6"
          center
        >
          <el-button
            v-permission="['trade:ordersiyu:export']"
            type="primary"
            @click.native="onExportDetails"
          >导 出</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getOrderDetail, exportByOrderIds } from '@/api/h5-private';

export default {
  name: 'H5OrderDetails',
  data() {
    return {
      orderDetails: {},
      goodsInfos: [
        {
          goodsName: '',
          goodsOrginalPrice: '',
          goodsPrice: '',
          paidAmount: '',
          goodsLink: '',
        },
      ],
    };
  },
  created() {
    this.getH5OrderDetails();
  },
  methods: {
    // 获取详情
    getH5OrderDetails() {
      const options = {
        id: this.$route.params.id,
      };
      getOrderDetail(options).then(res => {
        this.orderDetails = res.result;
        this.goodsInfos[0].goodsName = res.result.goodsName;
        this.goodsInfos[0].goodsOrginalPrice = res.result.goodsOrginalPrice;
        this.goodsInfos[0].goodsPrice = res.result.goodsPrice;
        this.goodsInfos[0].paidAmount = res.result.paidAmount;
        this.goodsInfos[0].goodsLink = res.result.goodsLink;
      });
    },

    // 返回
    goBack() {
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },

    // 导出
    onExportDetails() {
      const options = {
        orderIds: this.$route.params.id,
      };
      exportByOrderIds(options)
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
.content-container {
  /deep/ .titleMsg .el-form-item__label {
    font-size: 18px;
    font-weight: bold;
  }
  .goodsName:hover {
    color: #0aabc7;
    text-decoration: underline;
    cursor: pointer;
  }
  .saleUrl {
    color: blue;
    text-decoration: underline;
  }
  .line {
    width: 95%;
    height: 1px;
    background: #000000;
    margin-bottom: 20px;
  }
}
</style>