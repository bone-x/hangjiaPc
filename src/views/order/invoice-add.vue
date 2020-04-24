<template>
  <div class="content-container">
    <!-- 交易管理 - 开票管理 - 新建 -->
    <!-- 筛选栏 -->
    <el-row :gutter="20" type="flex" align="middle" style="margin-top: 10px;">
      <el-col :span="2">
        <span>关键词：</span>
      </el-col>
      <el-col :span="3">
        <el-select v-model="filter.num" placeholder="订单号" class="input-style">
          <el-option :value="0" label="订单号"></el-option>
          <el-option :value="1" label="购买者ID"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="filter.value" placeholder="请输入订单号" class="input-style"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="filter.goodsName" placeholder="请输入商品名称" class="input-style"></el-input>
      </el-col>
      <el-col :span="3" center>
        <el-button class="refund-search" type="danger" @click.native="onClearSelected">清空</el-button>
      </el-col>
      <el-col :span="3" center>
        <el-button class="refund-search" type="primary" @click.native="getBillingSearch(1)">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%" class="billtable" border>
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" min-width="150"></el-table-column>
          <el-table-column prop="$goodsType" label="商品类型" width="150"></el-table-column>
          <el-table-column prop="$totalFee" label="订单金额" width="150"></el-table-column>
          <el-table-column prop="$price" label="实付金额 / 行家币" width="150"></el-table-column>
          <el-table-column prop="$activityType" label="参与活动" width="150"></el-table-column>
          <el-table-column prop="paymentType" label="支付方式" width="120">
            <template slot-scope="props">
              <span v-if="props.row.paymentType === 0">支付宝</span>
              <span v-if="props.row.paymentType === 1">微信</span>
              <span v-if="props.row.paymentType === 2">行家币</span>
            </template>
          </el-table-column>
          <el-table-column prop="$status" label="订单状态" width="150"></el-table-column>
          <el-table-column prop="$invoiceStatus" label="开票状态" width="150"></el-table-column>
          <el-table-column prop="$refundStatus" label="退款状态" width="150"></el-table-column>

          <el-table-column prop="remark" label="操作" min-width="350" fixed="right">
            <template slot-scope="scope">
              <!-- 退款详情（有退款） -->
              <router-link
                v-if="scope.row.refundStatus > 0"
                :to="{ name: 'OrderRefundDetails', params: { id: scope.row.refundId } }"
                style="margin-right: 10px;"
              >
                <el-button plain type="primary">详情</el-button>
              </router-link>
              <!-- 开票详情（有开票） -->
              <router-link
                v-else-if="scope.row.invoiceStatus > 0"
                :to="{ name: 'OrderInvoiceDetails', params: { id: scope.row.invoiceId } }"
                style="margin-right: 10px;"
              >
                <el-button plain type="primary">详情</el-button>
              </router-link>
              <!-- 订单详情（无退款，无开票） -->
              <router-link
                v-else
                :to="{ name: 'OrderListDetails', params: { id: scope.row.orderId } }"
                style="margin-right: 10px;"
              >
                <el-button plain type="primary">详情</el-button>
              </router-link>

              <el-button
                :disabled="!scope.row.$operateStatus"
                type="primary"
                plain
                @click.native="onCreateInvoice(scope.row)"
              >申请开票</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24" center>
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="getBillingSearch(filter.currPage)"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 点击申请退款出现的弹窗 -->
    <el-dialog :visible.sync="state.showDialog" title="开票申请" width="600px" center>
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="dialogFormRules"
        label-width="100px"
        style="margin:0px 20px"
      >
        <el-row>
          <el-col :span="24">
            <div class="dialog-body-title">票据信息</div>
          </el-col>
        </el-row>
        <el-form-item label="发票类型">
          <span>增值税普通电子发票</span>
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <el-input v-model="dialogForm.invoiceTitle" placeholder="请输入发票抬头"></el-input>
        </el-form-item>
        <el-form-item label="税号" prop="invoiceNum">
          <el-input v-model="dialogForm.invoiceNum" placeholder="请输入发票税号"></el-input>
        </el-form-item>
        <el-form-item label="发票内容" prop="invoiceBody">
          <el-input v-model="dialogForm.invoiceBody" placeholder="请输入发票内容，不超过50字" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="学员姓名" prop="realName">
          <el-input v-model="dialogForm.realName" placeholder="请输入学员姓名"></el-input>
        </el-form-item>
        <el-form-item label="学员手机号" prop="mobile">
          <el-input v-model="dialogForm.mobile" type="number" placeholder="请输入学员手机号"></el-input>
        </el-form-item>
        <el-form-item label="学员邮箱" prop="email">
          <el-input v-model="dialogForm.email" placeholder="请输入学员邮箱"></el-input>
        </el-form-item>
        <el-form-item label="开票金额">
          <span>￥{{ dialogForm.price }}</span>
        </el-form-item>
        <el-form-item label="操作员">
          <span>{{ dialogForm.operator }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <span>{{ dialogForm.createTime }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="onDialogConfrim">确认申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BillingSearch, BillingConfirm } from "@/api/order";
import { validEmail } from "@/utils/validate";
import { formatDate } from "@/utils";

export default {
  name: "OrderInvoiceAdd",
  components: {},
  data() {
    return {
      state: {
        showDialog: false
      },
      filter: {
        num: "",
        value: "",
        goodsName: "",
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      tableData: [],
      dialogForm: {
        pmOrderDetailId: "",
        invoiceTitle: "",
        invoiceNum: "",
        invoiceBody: "",
        realName: "",
        mobile: "",
        email: "",
        price: "",
        operator: "",
        createTime: ""
      },
      dialogFormRules: {
        invoiceTitle: [{ required: true, message: "请输入发票抬头" }],
        invoiceNum: [{ required: true, message: "请输入发票税号" }],
        invoiceBody: [
          { required: true, message: "请输入发票内容，不超过50字" }
        ],
        realName: [{ required: true, message: "请输入学员姓名" }],
        mobile: [{ required: true, message: "请输入学员手机号" }],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!validEmail(value)) {
                callback(new Error("请正确设置学员邮箱"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  mounted() {
    this.getBillingSearch();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === "OrderInvoiceAdd") {
        this.getBillingSearch(this.filter.currPage);
      }
    },
    async getBillingSearch(pageNum = 1) {
      const options = {
        pageNum,
        num: this.filter.num,
        value: this.filter.value,
        goodsName: this.filter.goodsName,
        pageSize: this.filter.pageSize
      };
      const res = await BillingSearch(options);
      if (res.code !== 200) return Promise.reject();

      this.filter.currPage = res.result.currPage;
      this.filter.pageSize = res.result.pageSize || 10;
      this.filter.totalPage = res.result.totalPage;
      this.filter.totalCount = res.result.totalCount;
      this.tableData = res.result.list.map(i => {
        if (i.goodsType === 1) i.$goodsType = "直播";
        else if (i.goodsType === 2) i.$goodsType = "录播";
        else i.$goodsType = "其他";

        i.$totalFee = `￥ ${Number(i.totalFee || 0).toFixed(2)}`;
        i.$price = `￥ ${Number(i.price || 0).toFixed(2)}`;

        if (i.activityType === 1) i.$activityType = "积分";
        else if (i.activityType === 2) i.$activityType = "限时秒杀";
        else if (i.activityType === 3) i.$activityType = "限时抢购";
        else i.$activityType = "无";

        if (i.status === 0) i.$status = "待支付";
        else if (i.status === 1) i.$status = "发起支付";
        else if (i.status === 2) i.$status = "已支付";
        else if (i.status === 3) i.$status = "交易完成";
        else if (i.status === 4) i.$status = "交易关闭";
        else i.$status = "--";

        if (i.invoiceStatus === 1) i.$invoiceStatus = "等待开票";
        else if (i.invoiceStatus === 2) i.$invoiceStatus = "已开票";
        else i.$invoiceStatus = "无";

        if (i.refundStatus === 1) i.$refundStatus = "审核中";
        else if (i.refundStatus === 2) i.$refundStatus = "已退款";
        else if (i.refundStatus === 3) i.$refundStatus = "退款失败";
        else i.$refundStatus = "无";

        i.$operateStatus = !!i.operateStatus;
        return i;
      });
      window.scrollTo(0, 0);
    },

    // 重置条件项
    reset() {
      this.filter.num = "";
      this.filter.value = "";
      this.filter.goodsName = "";
      this.filter.pageSize = 10;
    },

    // 点击清空
    onClearSelected() {
      this.reset();
      this.getBillingSearch();
    },

    // 申请开票
    onCreateInvoice(item = {}) {
      const { pmOrderDetailId, price } = item;
      this.dialogForm = {
        pmOrderDetailId: "",
        invoiceTitle: "",
        invoiceNum: "",
        invoiceBody: "",
        realName: "",
        mobile: "",
        email: "",
        price: "",
        operator: "",
        createTime: ""
      };

      this.dialogForm.pmOrderDetailId = pmOrderDetailId;
      this.dialogForm.price = price;
      this.dialogForm.operator = this.$store.getters.name;
      this.dialogForm.createTime = formatDate(new Date(), 8);
      this.state.showDialog = true;
    },

    // 申请开票 - 确认
    onDialogConfrim() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          const options = {
            pmOrderDetailId: this.dialogForm.pmOrderDetailId,
            invoiceTitle: this.dialogForm.invoiceTitle,
            invoiceNum: this.dialogForm.invoiceNum,
            invoiceBody: this.dialogForm.invoiceBody,
            realName: this.dialogForm.realName,
            mobile: this.dialogForm.mobile,
            email: this.dialogForm.email
          };
          BillingConfirm(options).then(res => {
            if (res.code === 200) {
              this.state.showDialog = false;
              this.getBillingSearch();
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-body-title {
  padding: 10px 0;
  border-bottom: 1px solid #dcdfe6;
}
</style>


