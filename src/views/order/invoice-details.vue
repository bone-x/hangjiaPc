<template>
  <div class="content-container">
    <!-- 交易管理 - 开票管理 - 开票详情 -->
    <h3>开票信息</h3>
    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >开票编号：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.code }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >发票类型：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >增值税普通电子发票</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >发票抬头：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.invoiceTitle }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >税号：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.invoicePrice }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >发票内容：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.invoiceBody }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >开票金额：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.invoicePrice }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >学员姓名：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.realName }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >学员手机号：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ pmInvoice.mobile }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
      type="flex"
      align="middle"
    >
      <el-col
        :span="4"
        class="cell-title"
      >开票状态：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >
        <el-tag
          :type="pmInvoice.status === 0 ? '' : 'info'"
          style="margin-right: 10px;"
        >无</el-tag>
        <el-tag
          :type="pmInvoice.status === 1 ? '' : 'info'"
          style="margin-right: 10px;"
        >等待开票</el-tag>
        <el-tag
          :type="pmInvoice.status === 2 ? '' : 'info'"
          style="margin-right: 10px;"
        >已开票</el-tag>
      </el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
      type="flex"
      align="middle"
    >
      <el-col
        :span="4"
        class="cell-title"
      >学员邮箱：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >
        <span style="margin-right: 20px;">{{ pmInvoice.email }}</span>
        <el-button
          v-if="!state.isSendEmail && pmInvoice.status !== 2"
          type="primary"
          @click.native="onSendEmail"
        >点击发送邮件</el-button>
        <el-button
          v-else
          disabled
          style="margin-left: 20px;"
        >已发送</el-button>
      </el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
      type="flex"
      align="middle"
    >
      <el-col
        :span="4"
        class="cell-title"
      >上传发票：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >
        <a
          v-if="state.invoiceUrl"
          :href="state.invoiceUrl"
          target="blank"
        >{{ state.invoiceFilename }}</a>

        <upload-single
          v-else
          :accept="['application/pdf']"
          :max-file-size="20"
          @successCBK="onUploadSuccess"
        >
          <el-button
            icon="el-icon-upload"
            type="primary"
            size="medium"
          >点击选择上传pdf文件</el-button>
        </upload-single>
      </el-col>
    </el-row>

    <h3>订单信息</h3>
    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >订单编号：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.orderCode }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >交易流水号：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.serialNumber }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >下单时间：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.$createTime }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
      type="flex"
      align="middle"
    >
      <el-col
        :span="4"
        class="cell-title"
      >订单状态：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >
        <el-tag
          :type="orderDetails.orderStatus === 0 ? '' : 'info'"
          style="margin-right: 10px;"
        >待支付</el-tag>
        <el-tag
          :type="orderDetails.orderStatus === 2 ? '' : 'info'"
          style="margin-right: 10px;"
        >已支付</el-tag>
        <el-tag
          :type="orderDetails.orderStatus === 3 ? '' : 'info'"
          style="margin-right: 10px;"
        >交易完成</el-tag>
        <el-tag
          :type="orderDetails.orderStatus === 4 ? '' : 'info'"
          style="margin-right: 10px;"
        >交易关闭</el-tag>
      </el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >商品名称：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.goodsName }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >商品类型：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.$goodsType }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >商品原价：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >￥{{ Number(orderDetails.totalFee || 0).toFixed(2) }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >实付金额/行家币：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >￥{{ Number(orderDetails.price || 0).toFixed(2) }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >支付方式：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.$paymentType }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >有效期：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.$validityDate }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >订单来源：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.$source }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
    >
      <el-col
        :span="4"
        class="cell-title"
      >参与活动：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >{{ orderDetails.$activityType }}</el-col>
    </el-row>

    <el-row
      :gutter="30"
      class="cell"
      type="flex"
      align="middle"
    >
      <el-col
        :span="4"
        class="cell-title"
      >退款状态：</el-col>
      <el-col
        :span="20"
        class="cell-value"
      >
        <el-tag
          :type="orderDetails.refundStatus === 0 ? '' : 'info'"
          style="margin-right: 10px;"
        >无</el-tag>
        <el-tag
          :type="orderDetails.refundStatus === 1 ? '' : 'info'"
          style="margin-right: 10px;"
        >审核中</el-tag>
        <el-tag
          :type="orderDetails.refundStatus === 2 ? '' : 'info'"
          style="margin-right: 10px;"
        >已退款</el-tag>
        <el-tag
          :type="orderDetails.refundStatus === 3 ? '' : 'info'"
          style="margin-right: 10px;"
        >退款失败</el-tag>
      </el-col>
    </el-row>

    <h3>日志</h3>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="logShow"
        label="日志说明"
        min-width="150px"
      ></el-table-column>
      <el-table-column
        prop="$createTime"
        label="创建时间"
        width="300px"
      ></el-table-column>
      <el-table-column
        prop="loginIp"
        label="IP"
        width="300px"
      ></el-table-column>
      <el-table-column
        prop="userName"
        label="操作员"
        width="300px"
      ></el-table-column>
      <el-table-column
        prop="logStatus"
        label="结果"
        min-width="300px"
      ></el-table-column>
    </el-table>

    <el-row
      :gutter="50"
      type="flex"
      justify="center"
      align="middle"
      style="margin: 30px 0;"
    >
      <el-col
        :span="4"
        center
      >
        <el-button
          size="medium"
          @click.native="goBack"
        >返回</el-button>
      </el-col>
      <el-col
        v-if="pmInvoice.status === 1"
        :span="4"
        center
      >
        <el-button
          v-permission="['trade:invoice:export']"
          size="medium"
          @click.native="exportData"
        >导出</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import uploadSingle from '@/components/Upload/single';
import {
  getOrderInvoiceDetails,
  BillingSendEmail,
  BillingUpload,
  BillingExportBySelected,
} from '@/api/order';
import { formatDate } from '@/utils';

export default {
  name: 'OrderInvoiceDetails',
  components: {
    uploadSingle,
  },
  data() {
    return {
      state: {
        invoiceUrl: '',
        invoiceFilename: '',
        isSendEmail: false,
      },
      pmInvoice: {},
      orderDetails: {},
      tableData: [],
    };
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      const res = await getOrderInvoiceDetails(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();
      const {
        logList = [],
        order = {},
        orderDetail = {},
        pmInvoice = {},
      } = res.result;

      this.pmInvoice = pmInvoice;
      this.orderDetails = { ...order, ...orderDetail };
      this.orderDetails.$createTime = formatDate(
        this.orderDetails.createTime,
        8
      );
      switch (this.orderDetails.goodsType) {
        case 1:
          this.orderDetails.$goodsType = '直播';
          break;
        case 2:
          this.orderDetails.$goodsType = '录播';
          break;
        default:
          this.orderDetails.$goodsType = '其他';
          break;
      }

      switch (this.orderDetails.source) {
        case 4:
          this.orderDetails.$source = 'PC端';
          break;
        case 5:
          this.orderDetails.$source = 'APP';
          break;
        case 6:
          this.orderDetails.$source = '微信小程序';
          break;
        case 7:
          this.orderDetails.$source = 'H5';
          break;
        case 8:
          this.orderDetails.$source = '私域H5';
          break;
        default:
          break;
      }

      if (this.orderDetails.validityDate === -1)
        this.orderDetails.$validityDate = '永久有效';
      else
        this.orderDetails.$validityDate = `${this.orderDetails.validityDate} 月`;

      if (this.orderDetails.paymentType === 0)
        this.orderDetails.$paymentType = '支付宝';
      else if (this.orderDetails.paymentType === 1)
        this.orderDetails.$paymentType = '微信';
      else if (this.orderDetails.paymentType === 2)
        this.orderDetails.$paymentType = '行家币支付';
      else if (this.orderDetails.paymentType === 3)
        this.orderDetails.$paymentType = '积分支付';
      else this.orderDetails.$paymentType = '未知';

      switch (this.orderDetails.activityType) {
        case 1:
          this.orderDetails.$activityType = '积分';
          break;
        case 2:
          this.orderDetails.$activityType = '限时秒杀';
          break;
        case 3:
          this.orderDetails.$activityType = '限时抢购';
          break;
        case 4:
          this.orderDetails.$activityType = '拼团';
          break;
        case 5:
          this.orderDetails.$activityType = '听课卡';
          break;
        default:
          this.orderDetails.$activityType = '无';
          break;
      }

      if (pmInvoice.invoiceUrl) this.state.invoiceUrl = pmInvoice.invoiceUrl;
      this.tableData = logList.map(i => {
        i.$createTime = formatDate(i.createTime, 8);
        return i;
      });
    },

    async onSendEmail() {
      if (!this.state.invoiceUrl) {
        this.$message.error('请先上传电子发票文件');
        return Promise.reject();
      }
      const res = await BillingSendEmail(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();
      this.state.isSendEmail = true;
    },

    // 上传发票成功
    async onUploadSuccess(url, file = {}) {
      const options = {
        id: this.pmInvoice.id,
        invoiceUrl: url,
      };
      const res = await BillingUpload(options);
      if (res.code !== 200) return Promise.reject();
      this.state.invoiceUrl = url;
      this.state.invoiceFilename = file.oldName;
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },

    async exportData() {
      const res = await BillingExportBySelected([this.$route.params.id]);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },
  },
};
</script>
<style lang="less" scoped>
h3 {
  padding: 10px 0;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
}
.cell {
  margin-bottom: 20px;
  &-title {
    width: 170px;
    font-size: 14px;
    color: #000;
    text-align: right;
    font-weight: 550;
  }
  &-value {
    font-size: 14px;
    color: #000;
  }
}
</style>
