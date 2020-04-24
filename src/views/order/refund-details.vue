<template>
  <div class="content-container">
    <!-- 订单管理 - 退款管理 - 退款详情 -->
    <el-form
      ref="form"
      :model="ruleForm"
      label-position="left"
      label-width="200px"
      style="margin-left: 30px"
      size="large"
    >
      <div class="refund-detail">
        <h3 class="studentTitle">学员信息</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="学员ID："
              prop="id"
              label-width="150px"
            >
              <span>{{ruleForm.studentId}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="学员姓名："
              prop="name"
              label-width="150px"
            >
              <span>{{ruleForm.name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="手机号："
              prop="mobile"
              label-width="150px"
            >
              <span>{{ruleForm.mobile}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <h3 class="studentTitle">退款信息</h3>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="订单编号："
              prop="orderCode"
              label-width="150px"
            >
              <span>{{ruleForm.orderCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="退款编号："
              prop="code"
              label-width="150px"
            >
              <span>{{ruleForm.code}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="OA编号："
              prop="code"
              label-width="150px"
            >
              <span
                v-if="ruleForm.status === 2"
                v-show="ruleForm.oaNo === '无'?true:false"
                class="student"
                style="color:blue;cursor:pointer;"
                @click="ruleForm.dialogVisible = true"
              >点击填写</span>
              <span
                v-if="ruleForm.status === 2"
                v-show="ruleForm.oaNo != '无'?true:false"
                class="student"
              >{{ruleForm.oaNo}}</span>
              <span
                v-else
                class="student"
              >无</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="创建时间："
              prop="createTime"
              label-width="150px"
            >
              <span>{{ruleForm.createTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="商品名称："
              prop="goodsName"
              label-width="150px"
            >
              <span>{{ruleForm.goodsName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.totalFee">
          <el-col :span="8">
            <el-form-item
              label="订单金额："
              prop="totalFee"
              label-width="150px"
            >
              <span>￥{{ ruleForm.totalFee.toFixed(2) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="商品类型："
              prop="goodsType"
              label-width="150px"
            >
              <span>{{ ruleForm.goodsType === 0 ? "其他": ruleForm.goodsType === 1 ? "直播":"录播" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="实付金额/行家币："
              prop="price"
              label-width="150px"
            >
              <span class="student">￥{{ Number(ruleForm.price || 0).toFixed(2) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="退款金额/行家币："
              prop="refundFee"
              label-width="150px"
            >
              <span class="student">￥{{ Number(ruleForm.refundFee || 0).toFixed(2) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="支付方式："
              prop="paymentType"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.paymentType === 0?"支付宝":ruleForm.paymentType === 1?"微信":"行家币" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="有效期："
              prop="validityDate"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.validityDate === -1?"永久有效": ruleForm.validityDate }}（月）</span>
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
              <span class="student">{{ ruleForm.source === 4 ? "PC端":ruleForm.source === 5?"APP":ruleForm.source === 6?"微信小程序" :ruleForm.source === 7 ? "H5" : '私域H5'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="参与活动："
              prop="activityType"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.activityType === 0 ?"无":ruleForm.activityType === 1?"积分":ruleForm.activityType === 2?"限时秒杀":ruleForm.activityType === 3?"限时抢购":"拼团" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="订单状态："
              prop="orderStatus"
              label-width="150px"
            >
              <el-button :type="ruleForm.orderStatus === 0?'primary':''">待支付</el-button>
              <el-button :type="ruleForm.orderStatus === 2?'primary':''">已支付</el-button>
              <el-button :type="ruleForm.orderStatus === 3?'primary':''">交易完成</el-button>
              <el-button :type="ruleForm.orderStatus === 4?'primary':''">交易关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="退款原因："
              prop="reason"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.reason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="开票状态："
              prop="invoiceStatus"
              label-width="150px"
            >
              <el-button :type="ruleForm.invoiceStatus === 0?'primary':''">无</el-button>
              <el-button :type="ruleForm.invoiceStatus === 1?'primary':''">审核中</el-button>
              <el-button :type="ruleForm.invoiceStatus === 2?'primary':''">已开票</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="退款状态："
              prop="status"
              label-width="150px"
            >
              <el-button :type="ruleForm.status === 0?'primary':''">无</el-button>
              <el-button :type="ruleForm.status === 1?'primary':''">审核中</el-button>
              <el-button :type="ruleForm.status === 2?'primary':''">已退款</el-button>
              <el-button :type="ruleForm.status === 3?'primary':''">退款失败</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.failReason">
          <el-col :span="24">
            <el-form-item
              label="退款失败原因："
              prop="failReason"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.failReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <h3 class="studentTitle">账号信息</h3>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="户名："
              prop="cardName"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.cardName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="银行卡账号："
              prop="cardNo"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.cardNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="所在银行："
              prop="bankName"
              label-width="150px"
            >
              <span class="student">{{ ruleForm.bankName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <h3 class="studentTitle">日志</h3>
        <el-table
          :data="ruleForm.logInfo"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="logShow"
            label="日志说明"
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
              v-permission="['trade:refund:export']"
              type="primary"
              @click.native="exportData"
            >导 出</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-dialog
      :visible.sync="ruleForm.dialogVisible"
      :before-close="handleClose"
      title="提示"
      width="30%"
    >
      <el-input
        v-model="ruleForm.oaNumber"
        placeholder="请输入OA单号"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="ruleForm.dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="oaDialog"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { refundDetail, exportRefundOrder, submitOaForm } from '@/api/order';

export default {
  name: 'OrderRefundDetails',
  components: {},
  data() {
    return {
      ruleForm: {
        oaOrderGood: true, //oa点击填写弹窗
        dialogVisible: false,
        oaNumber: '', // oa单号
        studentData: [],
        // 日志表格数据
        logInfo: [],
        studentId: '', // 学员信息
        name: '',
        mobile: '',
        orderCode: '',
        code: '',
        oaNo: '',
        createTime: '',
        goodsName: '',
        goodsType: '',
        price: '',
        validityDate: '',
        status: '',
        activityType: '',
        source: '',
        refundFee: '',
        paymentType: '',
        reason: '',
        orderStatus: '',
        totalFee: '', // 订单金额
        failReason: '', // 退款失败原因
        invoiceStatus: '', // 开票状态
        cardName: '',
        cardNo: '',
        bankName: '',
      },
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    const params = {
      refundId: this.$route.params.id,
    };
    refundDetail(params).then(res => {
      console.log(res);
      this.ruleForm.studentId = res.result.pmRefundDetailVo.studentId;
      this.ruleForm.name = res.result.pmRefundDetailVo.name;
      this.ruleForm.mobile = res.result.pmRefundDetailVo.mobile;
      // 学员信息
      this.ruleForm.orderCode = res.result.pmRefundDetailVo.orderCode;
      this.ruleForm.code = res.result.pmRefundDetailVo.code;
      this.ruleForm.oaNo = res.result.pmRefundDetailVo.oaNo;
      this.ruleForm.createTime = res.result.pmRefundDetailVo.createTime;
      this.ruleForm.goodsName = res.result.pmRefundDetailVo.goodsName;
      this.ruleForm.goodsType = res.result.pmRefundDetailVo.goodsType;
      this.ruleForm.price = res.result.pmRefundDetailVo.price;
      this.ruleForm.validityDate = res.result.pmRefundDetailVo.validityDate;
      this.ruleForm.status = res.result.pmRefundDetailVo.status;
      this.ruleForm.activityType = res.result.pmRefundDetailVo.activityType;
      this.ruleForm.source = res.result.pmRefundDetailVo.source;
      this.ruleForm.refundFee = res.result.pmRefundDetailVo.refundFee;
      this.ruleForm.paymentType = res.result.pmRefundDetailVo.paymentType;
      this.ruleForm.reason = res.result.pmRefundDetailVo.reason;
      this.ruleForm.invoiceStatus = res.result.pmRefundDetailVo.invoiceStatus;
      this.ruleForm.totalFee = res.result.pmRefundDetailVo.totalFee;
      this.ruleForm.failReason = res.result.pmRefundDetailVo.failReason;
      // 退款信息
      this.ruleForm.cardName = res.result.pmRefundDetailVo.cardName;
      this.ruleForm.cardNo = res.result.pmRefundDetailVo.cardNo;
      this.ruleForm.bankName = res.result.pmRefundDetailVo.bankName;
      this.ruleForm.orderStatus = res.result.pmRefundDetailVo.orderStatus; // 支付状态
      // 账号信息
      this.ruleForm.logInfo = res.result.logList; // 日志
    });
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'OrderRefundDetails') {
        // this.getServicelist(); 此处不需要刷新
      }
    },
    goBack() {
      this.$router.go(-1);
      this.$store.dispatch('delView', this.$route);
    },
    async exportData() {
      const params = {
        refundIds: this.$route.params.id,
      };
      // exportRefundOrder(params).then(res => {
      //   console.log(res, "单个导出数据");
      // });
      const response = await exportRefundOrder(params);
      if (response.code !== 200) return Promise.reject();
      const { url } = response.result;
      if (url) {
        window.open(url, '_self');
      }
      console.log('导出的列表excel', response);
    },
    oaDialog() {
      // oa确认
      const params = {
        refundId: this.$route.params.id,
        oaNo: this.ruleForm.oaNumber,
      };
      submitOaForm(params).then(res => {
        // oa弹窗提交
        console.log(res);
        this.ruleForm.dialogVisible = false;
        this.ruleForm.oaOrderGood = false;
      });
    },
    handleClose() {
      this.ruleForm.oaNumber = '';
      this.ruleForm.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.refund-detail {
  padding: 20px;
  .studentTitle {
    height: 45px;
    line-height: 36px;
    border-bottom: 2px solid #ccc;
  }
  .studentInfo {
    display: flex;
    font-size: 13px;
    .studentInfo-left {
      width: 15%;
      .student {
        height: 35px;
        line-height: 30px;
      }
      .strong {
        font-weight: bold;
      }
    }
    .studentInfo-right {
      // margin-left: 10%;
      .student {
        height: 35px;
        line-height: 30px;
      }
      .strong {
        font-weight: bold;
      }
    }
  }
  .infoTitle {
    height: 35px;
    line-height: 30px;
    font-size: 13px;
    font-weight: bold;
  }
  .goods-name:hover {
    text-decoration: underline;
    color: skyblue;
  }
  .confirmbtn {
    display: flex;
    justify-content: center;
    margin: 30px;
    .export {
      margin-left: 10%;
    }
  }
  .accuntInfo {
    display: flex;
    .accuntInfo-left {
      width: 15%;
    }
  }
}
</style>
