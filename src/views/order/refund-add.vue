<template>
  <div class="order_refund_add">
    <!-- 交易管理 - 退款管理 - 新建 -->
    <div class="refund-add">
      <div class="refund-select">
        <span class="refund-keyword">关键词：</span>
        <el-select v-model="value" placeholder="订单号" class="input-style">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="inputBillNum" placeholder="请输入订单号" class="input-style"></el-input>
        <el-input v-model="inputCourse" placeholder="请输入商品名称" class="input-style"></el-input>
        <el-button class="refund-search" type="danger" @click="onClearSelected">清空</el-button>
        <el-button class="refund-search" type="primary" @click="onSubmit">搜索</el-button>
      </div>
      <div class="tableContent">
        <h4>订单信息</h4>
        <el-table
          :data="orderData"
          tooltip-effect="dark"
          style="width: 100%"
          class="billtable"
          border
        >
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="goodsType" label="商品类型" width="120">
            <template slot-scope="props">
              <span v-if="props.row.goodsType === 0">其他</span>
              <span v-if="props.row.goodsType === 1">直播</span>
              <span v-if="props.row.goodsType === 2">录播</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalFee" label="订单金额" show-overflow-tooltip>
            <template slot-scope="props">
              <span>￥{{ (props.row.totalFee).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="实付金额/行家币" width="150">
            <template slot-scope="props">
              <span>￥{{ (props.row.price).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="activityType" label="参与活动" width="120">
            <template slot-scope="props">
              <span v-if="props.row.activityType === 0">无</span>
              <span v-if="props.row.activityType === 1">积分</span>
              <span v-if="props.row.activityType === 2">限时秒杀</span>
              <span v-if="props.row.activityType === 3">限时抢购</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" width="100">
            <template slot-scope="props">
              <span v-if="props.row.status === 0">待支付</span>
              <span v-if="props.row.status === 2">已支付</span>
              <span v-if="props.row.status === 3">交易完成</span>
              <span v-if="props.row.status === 4">交易关闭</span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentType" label="支付方式" show-overflow-tooltip>
            <template slot-scope="props">
              <span v-if="props.row.paymentType === 0">支付宝</span>
              <span v-if="props.row.paymentType === 1">微信</span>
              <span v-if="props.row.paymentType === 2">行家币</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="距下单时间" width="100">
            <template slot-scope="props">
              <span>{{props.row.time}}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceStatus" label="开票状态" width="100">
            <template slot-scope="props">
              <span v-if="props.row.invoiceStatus === 0">无</span>
              <span v-if="props.row.invoiceStatus === 1">等待开票</span>
              <span v-if="props.row.invoiceStatus === 2">已开票</span>
            </template>
          </el-table-column>
          <el-table-column prop="refundStatus" label="退款状态" width="100">
            <template slot-scope="props">
              <span v-if="props.row.refundStatus === 0">无</span>
              <span v-if="props.row.refundStatus === 1">审核中</span>
              <span v-if="props.row.refundStatus === 2">已退款</span>
              <span v-if="props.row.refundStatus === 3">退款失败</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350" fixed="right">
            <template slot-scope="props">
              <el-button type="primary" @click="goDetail(props.$index, props.row)">详情</el-button>
              <el-button
                v-if="props.row.paymentType === 2 && props.row.operateStatus === 0"
                type="primary"
                @click.native="startRequestRefund(props.row)"
              >申请退款</el-button>
              <el-button
                v-else-if="props.row.paymentType === 2 && props.row.operateStatus === 1"
                type="primary"
                @click.native="startRequestRefund(props.row)"
              >重新申请</el-button>
              <el-button
                v-else-if="props.row.operateStatus === 0"
                type="primary"
                @click="goMoney(props.$index, props.row)"
              >申请退款</el-button>
              <el-button
                v-else-if="props.row.operateStatus === 1"
                type="primary"
                @click="resetMoney(props.$index, props.row)"
              >重新申请</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 点击申请退款出现的弹窗 - 行家币 -->
    <el-dialog :visible.sync="isShowRefundWindow" title="退款申请" width="40%" center>
      <el-form
        ref="refundFrom2"
        :model="requestRefundFrom"
        :rules="requestRefundFromRules"
        label-width="100px"
        style="margin:0px 20px"
      >
        <el-form-item label="退还行家币">
          <span>{{ requestRefundFrom.price }}行家币</span>
        </el-form-item>
        <el-form-item label="退款原因" prop="reason" required>
          <el-input
            v-model="requestRefundFrom.reason"
            type="textarea"
            placeholder="请输入学员退款原因，最多50个字"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作员">
          <span>{{ requestRefundFrom.operator }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <span>{{ requestRefundFrom.datetime }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="sendRequestRefund">确认申请</el-button>
      </div>
    </el-dialog>

    <!-- 点击申请退款出现的弹窗 -->
    <el-dialog :visible.sync="centerDialogVisible" title="退款申请" width="40%" center>
      <el-form ref="form" :model="resetform" label-width="100px" style="margin:0px 20px">
        <el-form-item label="户名">
          <el-input v-model="resetform.name" placeholder="请输入收款人户名"></el-input>
        </el-form-item>
        <el-form-item label="银行卡账号">
          <el-input v-model="resetform.getMoneyName" placeholder="请输入收款人账号"></el-input>
        </el-form-item>
        <el-form-item label="所在银行">
          <el-input v-model="resetform.bankName" placeholder="请输入银行名称"></el-input>
        </el-form-item>
        <el-form-item label="退款金额">
          <span>{{resetform.refundPrice}}</span>
        </el-form-item>
        <el-form-item label="退款原因">
          <el-input
            v-model="resetform.refundReason"
            type="textarea"
            placeholder="请输入学员退款原因，最多50个字"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作员">
          <span>{{resetform.controler}}</span>
        </el-form-item>
        <el-form-item label="申请时间"
          <span>{{resetform.applyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="refundMoneny">确认申请</el-button>
      </div>
    </el-dialog>
    <!-- 点击重新申请出现的弹窗 -->
    <el-dialog :visible.sync="centerDialogVisibleRepeat" title="重新申请" width="40%" center>
      <el-form ref="form" :model="form" label-width="100px" style="margin:0px 20px">
        <el-form-item label="户名">
          <el-input v-model="form.name" placeholder="请输入收款人户名"></el-input>
        </el-form-item>
        <el-form-item label="银行卡账号">
          <el-input v-model="form.getMoneyName" placeholder="请输入收款人账号"></el-input>
        </el-form-item>
        <el-form-item label="所在银行">
          <el-input v-model="form.bankName" placeholder="请输入银行名称"></el-input>
        </el-form-item>
        <el-form-item label="退款金额">
          <!-- <el-input v-model="form.refundPrice" :disabled="true">></el-input> -->
          <span>{{form.refundPrice}}</span>
        </el-form-item>
        <el-form-item label="退款原因">
          <el-input
            v-model="form.refundReason"
            type="textarea"
            hide-required-asterisk="true"
            placeholder="请输入学员退款原因，最多50个字"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作员">
          <!-- <el-input v-model="form.controler" :disabled="true">></el-input> -->
          <span>{{form.controler}}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <!-- <el-input v-model="form.applyTime" :disabled="true"></el-input> -->
          <span>{{form.applyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetApplication">确认申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRefund, renewApplyRefund, renewApplyRefund2 } from "@/api/order";
import { formatDate } from "@/utils/index";

export default {
  name: "OrderRefundAdd",
  components: {},
  data() {
    return {
      centerDialogVisible: false,
      centerDialogVisibleRepeat: false,
      isShowRefundWindow: false,
      inputBillNum: "",
      inputCourse: "",
      options: [
        {
          value: "0",
          label: "订单号"
        },
        {
          value: "1",
          label: "购买者编号"
        }
      ],
      orderData: [],
      // 弹窗数据
      form: {
        name: "",
        getMoneyName: "",
        bankName: "",
        refundPrice: "",
        refundReason: "",
        controler: "",
        applyTime: "",
        delivery: false
      },
      resetform: {
        name: "",
        getMoneyName: "",
        bankName: "",
        refundPrice: "",
        refundReason: "",
        controler: "",
        applyTime: "",
        delivery: false
      },
      value: "0",
      row: "",
      requestRefundFrom: {
        price: 0,
        datetime: "",
        operator: "",
        reason: "",
        pmOrderDetailId: ""
      },
      requestRefundFromRules: {
        reason: [{ required: true, message: "请输入学员退款原因，最多50个字" }]
      }
    };
  },
  created() {},
  methods: {
    timeFormat: formatDate, // 时间戳转化
    // 重置条件项
    reset() {
      this.value = '';
      this.inputBillNum = '';
      this.inputCourse = '';
    },

    // 点击清空
    onClearSelected() {
      this.reset();
      this.onSubmit();
    },
    onSubmit() {
      // 查询接口
      const params = {
        num: this.value, // 关键词
        value: this.inputBillNum || 20190322124972000000, // 订单号
        goodsName: this.inputCourse
      };
      addRefund(params).then(res => {
        console.log(res, "查询哦");
        this.orderData = res.result.list;
      });
    },
    // 跳转详情
    goDetail(index, row) {
      console.log(index, row);
      this.$router.push({
        name: "OrderListDetails",
        params: { id: row.orderId }
      });
    },
    refundMoneny() {
      // 退款申请
      const params = {
        cardName: this.resetform.name,
        cardNo: this.resetform.getMoneyName,
        bankName: this.resetform.bankName,
        refundFee: this.resetform.refundPrice,
        reason: this.resetform.refundReason,
        pmOrderDetailId: this.row.pmOrderDetailId
      };
      renewApplyRefund(params).then(res => {
        console.log(res);
        this.centerDialogVisible = false;
      });
    },

    // 发起【申请退款 or 重新申请退款】
    startRequestRefund(item = {}) {
      this.requestRefundFrom = {
        price: item.price,
        datetime: formatDate(new Date(), 8),
        operator: this.$store.getters.name,
        reason: "",
        pmOrderDetailId: item.pmOrderDetailId
      };
      this.isShowRefundWindow = true;
    },

    // 请求退款
    sendRequestRefund() {
      this.$refs.refundFrom2.validate(valid => {
        if (valid) {
          const options = {
            reason: this.requestRefundFrom.reason,
            pmOrderDetailId: this.requestRefundFrom.pmOrderDetailId
          };
          renewApplyRefund2(options).then(res => {
            if (res.code !== 200) return Promise.reject();
            this.isShowRefundWindow = false;
            this.$message.success("操作成功");
          });
        } else {
          return false;
        }
      });
    },

    goMoney(index, row) {
      // 申请退款
      this.centerDialogVisible = true;
      this.row = row;
      this.resetform.refundPrice = this.row.price;
      this.resetform.controler = this.$store.getters.name;
      this.resetform.applyTime = this.timeFormat(new Date().getTime());
      console.log(row);
    },
    resetMoney(index, row) {
      // 重新申请
      this.row = row;
      this.centerDialogVisibleRepeat = true;
      this.form.refundPrice = this.row.totalFee;
      this.form.controler = this.$store.getters.name;
      this.form.applyTime = this.timeFormat(new Date().getTime());
    },
    resetApplication() {
      // 重新申请
      const params = {
        cardName: this.form.name,
        cardNo: this.form.getMoneyName,
        bankName: this.form.bankName,
        refundFee: this.form.refundPrice,
        reason: this.form.refundReason,
        pmOrderDetailId: this.row.pmOrderDetailId
      };
      renewApplyRefund(params).then(res => {
        console.log(res);
        this.centerDialogVisibleRepeat = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.refund-add {
  padding: 30px;
  .refund-select {
    height: 45px;
    line-height: 45px;
    display: flex;
    .input-style {
      width: 200px;
      margin-left: 20px;
    }
    .refund-search {
      height: 40px;
      margin-left: 20px;
    }
  }
  .dialog-footer {
    margin-bottom: 20px;
  }
}
</style>
