<!--
 * @Description: In User Settings Edit
 * @Author: linshihua
 * @Date: 2019-08-09 18:03:19
 * @LastEditTime: 2019-08-12 11:48:49
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="settlement-details">
    <!-- 财务结算 -- 待结算详情 -->
    <el-row>
      <el-col :span="24">
        <h4>筛选查询</h4>
      </el-col>
    </el-row>
    <el-form>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="输入搜索："
            label-width="90px"
          >
            <el-input
              v-model="orderParmas.orderCode"
              placeholder="订单编号"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button
              type="primary"
              @click.native="searchBill"
            >搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="billMsg">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="结算单号："
              label-width="90px"
            >
              <span style="width:300px;">{{ tableHeadData.settlementNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机构："
              label-width="60px"
            >
              <span style="width:300px">{{ tableHeadData.orgName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="结算账期："
              label-width="150px"
            >
              <span
                v-if="tableHeadData.startDate && tableHeadData.endDate"
                style="width:300px"
              >{{ realSettle(tableHeadData.startDate) }} 至 {{ realSettle(tableHeadData.endDate) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="结算管理费："
              label-width="100px"
            >
              <span
                v-if="tableHeadData.orgFeeRate"
                style="width:300px"
              >{{ tableHeadData.orgFeeRate*100 }}%</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="当前待结算金额："
              label-width="130px"
            >
              <span style="width:300px;color:red">￥{{ Number(tableHeadData.amount || 0).toFixed(2) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="65px">
              <el-button
                type="danger"
                v-permission="['trade:settlementBill:update']"
                @click.native="settlementDialogBtn"
              >结算</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-table
      :data="settlementData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="orderCode"
        label="订单编号"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="goodsName"
        label="商品名称"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="paymentTime"
        label="订单支付时间"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="studentName"
        label="买家昵称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="订单实付金额"
        align="center"
      >
        <template slot-scope="scope">
          <span class="price">￥{{ Number(scope.row.price || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentType"
        label="支付方式"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.paymentType === 0">支付宝支付</span>
          <span v-if="scope.row.paymentType === 1">微信支付</span>
          <span v-if="scope.row.paymentType === 2">行家币支付</span>
          <span v-if="scope.row.paymentType === 3">积分支付</span>
          <span v-if="scope.row.paymentType === 4">听课卡支付</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orgFee"
        label="应结算货款金额"
        align="center"
      >
        <template slot-scope="scope">
          <span class="price">￥{{ Number(scope.row.orgFee || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 30px">
      <el-col
        :span="24"
        style="text-align: center;"
      >
        <el-pagination
          :current-page.sync="orderParmas.pageNum"
          :page-size="orderParmas.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          class="simplepage"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 结算弹窗 -->
    <el-dialog
      title="结算"
      :visible.sync="settlementDialog"
      width="900px"
      center
    >
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="机构名称："
              label-width="100px"
            >
              <span>{{ tableHeadData.orgName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结算单号："
              label-width="90px"
            >
              <span>{{ tableHeadData.settlementNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-form-item
            label="银行账单："
            label-width="100px"
          >
            <upload-single @successCBK="onSingleUploadSuccess">
              <span class="imgName">{{ settlementMsg.imgName }}</span>
              <el-button
                :class="settlementMsg.bankBillUrl ? 'uploadPic' : ''"
                icon="el-icon-upload"
                size="medium"
              >
                <span v-if="!settlementMsg.bankBillUrl">上传图片</span>
                <span v-else>重新上传</span>
              </el-button>
            </upload-single>
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item
            label="备注："
            label-width="100px"
          >
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="settlementMsg.remark"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="settlementDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="confirmSettlement"
        >确认结算</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNoSettlementList,
  getSettlementDetail,
  settlementUpdate,
} from '@/api/order';
import uploadSingle from '@/components/Upload/single';

export default {
  name: 'SettlementDetails',
  components: {
    uploadSingle,
  },
  data() {
    return {
      id: '',
      settlementDialog: false,
      searchOrderNum: {
        settlementNo: '',
        pageNum: 1,
        pageSize: 15,
      },
      orderParmas: {
        orderCode: '',
        settlementNo: '',
        pageNum: 1,
        pageSize: 15,
      },
      totalCount: 15,
      totalPage: 15,
      tableHeadData: {},
      settlementData: [],
      settlementMsg: {
        imgName: '',
        remark: '',
        bankBillUrl: '',
      },
    };
  },
  created() {
    this.getTableHeadData();
    this.orderParmas.settlementNo = this.$route.params.settlementNo;
    this.id = this.$route.params.id;
    this.getBillData();
  },
  methods: {
    // 处理时间格式
    realSettle(date) {
      return date.slice(0, 10).replace(/-/g, '.');
    },

    // 上传图片
    onSingleUploadSuccess(url, items) {
      this.settlementMsg.imgName = items.oldName;
      this.settlementMsg.bankBillUrl = url;
    },

    // 获取表头数据
    async getTableHeadData() {
      this.id = Number(this.$route.params.id);
      const res = await getSettlementDetail(this.id);
      if (res.code !== 200) return Promise.reject();
      this.tableHeadData = res.result;
    },

    // 获取列表
    getBillData() {
      getNoSettlementList(this.orderParmas).then(res => {
        this.settlementData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 搜索
    searchBill() {
      this.getBillData();
    },

    // 结算按钮
    settlementDialogBtn() {
      this.resetDialog();
      this.settlementDialog = true;
    },

    // 分页
    handleSizeChange(val) {
      this.orderParmas.pageSize = val;
    },

    handleCurrentChange(val) {
      this.orderParmas.pageNum = val;
      this.getBillData();
    },

    // 弹窗-> 确认结算
    confirmSettlement() {
      if (!this.settlementMsg.bankBillUrl) {
        this.$message.error('请选择上传的图片!');
        return false;
      } else if (!this.settlementMsg.remark) {
        this.$message.error('请填写备注!');
        return false;
      } else {
        const data = {
          bankBillUrl: this.settlementMsg.bankBillUrl,
          remark: this.settlementMsg.remark,
          id: this.id,
        };
        settlementUpdate(data).then(res => {
          this.$message.success('结算成功!');
          this.getBillData();
        });
        this.settlementDialog = false;
      }
    },

    // 清空弹窗内容
    resetDialog() {
      this.settlementMsg.bankBillUrl = '';
      this.settlementMsg.remark = '';
      this.settlementMsg.imgName = '';
    },
  },
};
</script>

<style lang="less" scoped>
.settlement-details {
  padding: 30px;
  .billMsg {
    margin-top: 30px;
  }
  .uploadPic {
    margin-left: 40px;
  }
}
</style>
