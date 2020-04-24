<!--
 * @Description: In User Settings Edit
 * @Author: linsihua
 * @Date: 2019-08-09 18:03:18
 * @LastEditTime: 2019-08-12 11:48:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="settlement-details">
    <!-- 财务结算 -- 已结算详情 -->
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
              <span style="width:360px">{{ tableHeadData.settlementNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机构："
              label-width="110px"
            >
              <span style="width:300px">{{ tableHeadData.orgName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="结算账期："
              label-width="90px"
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
              label="当前已结算金额："
              label-width="180px"
              class="curr-price"
            >
              <span style="width:300px">￥{{ Number(tableHeadData.amount || 0).toFixed(2) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="10px">
              <el-button
                type="danger"
                @click.native="settlementDialogBtn"
              >结算回单</el-button>
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
        label="商品内容"
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
        prop="lendPrice"
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
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 结算弹窗 -->
    <el-dialog
      title="结算回单"
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
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="银行账单："
              label-width="100px"
            >
              <span
                class="bill"
                @click="downloadBill"
              >{{ fileName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="操作人员："
              label-width="93px"
            >
              <span>{{ tableHeadData.auditorName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-form-item
            label="备注："
            label-width="100px"
          >
            <span>{{ tableHeadData.remark }}</span>
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
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNoSettlementList, getSettlementDetail } from '@/api/order';
import { downloadFile2 } from '@/utils';
import uploadSingle from '@/components/Upload/single';

export default {
  name: 'AlreadySettlementDetails',
  components: {
    uploadSingle,
  },
  data() {
    return {
      settlementDialog: false,
      id: '',
      fileName: '',
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
    };
  },
  created() {
    this.orderParmas.settlementNo = this.$route.params.settlementNo;
    this.id = this.$route.params.id;
    this.getTableHeadData();
    this.getBillData();
  },
  methods: {
    realSettle(date) {
      return date.slice(0, 10).replace(/-/g, '.');
    },

    // 获取表头数据
    getTableHeadData() {
      this.id = Number(this.$route.params.id);
      getSettlementDetail(this.id).then(res => {
        this.tableHeadData = res.result;
        const fileName = res.result.bankBillUrl;

        const arr = fileName.split('/');
        const picFile = arr[arr.length - 1]; // 截取含有文件名部分
        const fileSplit = picFile.indexOf('-'); // 查找文件名位置
        const splitFile = picFile.slice(0, fileSplit); // 截取文件名

        const fileFoot = picFile.lastIndexOf('.');
        const fileType = picFile.slice(fileFoot); // 截取文件后缀
        this.fileName = splitFile + fileType; // 拼接文件名和后缀
      });
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
      this.settlementDialog = false;
    },

    // 下载图片
    downloadBill() {
      const url = this.tableHeadData.bankBillUrl;
      if (url) {
        downloadFile2(url);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.settlement-details {
  padding: 30px;
  .billMsg {
    margin-top: 30px;
    .curr-price {
      color: red;
    }
  }
  .price {
    color: red;
  }
}
.bill {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
</style>
