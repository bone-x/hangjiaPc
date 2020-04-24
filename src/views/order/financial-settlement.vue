<template>
  <div class="financial-settlement">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <!-- 财务结算 -->
      <el-tab-pane
        label="待结算"
        name="first"
      >
        <el-row>
          <el-col :span="24">
            <h4>筛选查询</h4>
          </el-col>
        </el-row>
        <el-form>
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="结算单号："
                label-width="90px"
              >
                <el-input
                  v-model="preFinancialData.settlementNo"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="机构名称："
                label-width="100px"
              >
                <el-input
                  v-model="preFinancialData.orgName"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="机构ID："
                label-width="100px"
              >
                <el-input
                  v-model="preFinancialData.orgId"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button
                  type="primary"
                  @click.native="searchFinancial"
                >搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24">
            <h4>商家结算</h4>
          </el-col>
        </el-row>
        <el-table
          :data="preTableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="settlementNo"
            label="结算单号"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orgName"
            label="机构名称"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span class="name">{{ scope.row.orgName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orgId"
            label="机构ID"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="startDate"
            label="结算账期"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ getDate(scope.row.startDate) }} 至 {{ getDate(scope.row.endDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="expectedSettlementTime"
            label="预期结算时间"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ getDate(scope.row.expectedSettlementTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="待结算金额"
            align="center"
          >
            <template slot-scope="scope">
              <span class="price">￥{{ Number(scope.row.amount || 0).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="realSettlementTime"
            label="结算时间"
            align="center"
          >
            <template slot-scope="scope">
              <span>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                plain
                v-permission="['trade:settlementBill:update']"
                @click.native="settlement(scope.row.id)"
              >结算</el-button>
              <router-link :to="{ name: 'SettlementDetails', params: { id: scope.row.id, settlementNo: scope.row.settlementNo } }">
                <el-button type="primary">详情</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 30px">
          <el-col
            :span="24"
            style="text-align: center"
          >
            <el-pagination
              :current-page.sync="preFinancialData.pageNum"
              :page-size="preFinancialData.pageSize"
              :total="totalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @size-change="preSetSizeChange"
              @current-change="preSetCurrentChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 已结算 -->
      <el-tab-pane
        label="已结算"
        name="second"
      >
        <el-row>
          <el-col :span="10">
            <h4>筛选查询</h4>
          </el-col>
        </el-row>
        <el-form>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item
                label="结算单号："
                label-width="90px"
              >
                <el-input
                  v-model="alFinancialData.settlementNo"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="机构名称："
                label-width="120px"
              >
                <el-input
                  v-model="alFinancialData.orgName"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="商家ID："
                label-width="130px"
              >
                <el-input
                  v-model="alFinancialData.orgId"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="结算时间："
                label-width="160px"
              >
                <el-date-picker
                  v-model="realSettlementTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  class="times"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item></el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button
                  type="primary"
                  @click.native="searchSettlement"
                >搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24">
            <h4>机构结算</h4>
          </el-col>
        </el-row>
        <el-table
          :data="alTableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="settlementNo"
            label="结算单号"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orgName"
            label="机构名称"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span class="name">{{ scope.row.orgName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orgId"
            label="机构ID"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="startDate"
            label="结算账期"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ getDate(scope.row.startDate) }} 至 {{ getDate(scope.row.endDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="expectedSettlementTime"
            label="预期结算时间"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ getDate(scope.row.expectedSettlementTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="账单结算金额"
            align="center"
          >
            <template slot-scope="scope">
              <span class="price">￥{{ Number(scope.row.amount || 0).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="realSettlementTime"
            label="结算时间"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ changeTimeStyle(scope.row.realSettlementTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                plain
                @click.native="alreadySettlementBtn(scope.row.id)"
              >结算回单</el-button>
              <router-link :to="{ name: 'AlreadySettlementDetails', params: { id: scope.row.id, settlementNo: scope.row.settlementNo } }">
                <el-button type="primary">详情</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 30px">
          <el-col
            :span="24"
            style="text-align: center"
          >
            <el-pagination
              :current-page.sync="alFinancialData.pageNum"
              :page-size="alFinancialData.pageSize"
              :total="alTotalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @size-change="alSetSizeChange"
              @current-change="alSetCurrentChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 待结算部分弹窗 -->
    <el-dialog
      title="结算"
      :visible.sync="preSettlementDialog"
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
              <span>{{ sureSettlement.orgName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结算单号："
              label-width="90px"
            >
              <span>{{ sureSettlement.settlementNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-form-item
            label="银行账单："
            label-width="100px"
          >
            <upload-single @successCBK="onSingleUploadSuccess">
              <span class="imgName">{{ fileName }}</span>
              <el-button
                icon="el-icon-upload"
                size="medium"
                :class="confirmPreSettlement.bankBillUrl ? 'uploadPic' : ''"
              >
                <span v-if="!confirmPreSettlement.bankBillUrl">上传图片</span>
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
              v-model="confirmPreSettlement.remark"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="preSettlementDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="confirmSettlement"
        >确认结算</el-button>
      </span>
    </el-dialog>

    <!-- 已结算弹窗 -->
    <el-dialog
      title="结算回单"
      :visible.sync="alreadySettlementDialog"
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
              <span>{{ alreadySettlement.orgName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结算单号："
              label-width="90px"
            >
              <span>{{ alreadySettlement.settlementNo }}</span>
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
              >{{ alFileName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="操作人员："
              label-width="93px"
            >
              <span>{{ alreadySettlement.auditorName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-form-item
            label="备注："
            label-width="100px"
          >
            <span>{{ alreadySettlement.remark }}</span>
          </el-form-item>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="alreadySettlementDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="submitSettlement"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSettlementList,
  getSettlementDetail,
  settlementUpdate,
} from '@/api/order';
import { downloadFile2 } from '@/utils';
import uploadSingle from '@/components/Upload/single';

export default {
  name: 'FinancialSettlement',
  components: {
    uploadSingle,
  },
  data() {
    return {
      preSettlementDialog: false,
      activeName: 'first',
      // 待结算
      preFinancialData: {
        status: 0,
        settlementNo: '',
        orgName: '',
        orgId: '',
        pageNum: 1,
        pageSize: 15,
      },
      totalCount: 15,
      totalPage: 15,
      preTableData: [],
      sureSettlement: {},
      confirmPreSettlement: {
        bankBillUrl: '',
        remark: '',
        id: '',
      },
      imgUrl: '',
      fileName: '',
      // 已结算
      alTotalCount: 15,
      alTotalPage: 15,
      alreadySettlementDialog: false,
      // 已结算请求参数
      realSettlementTime: [],
      alFinancialData: {
        status: 1,
        settlementNo: '',
        orgName: '',
        orgId: '',
        startDate: '',
        endDate: '',
        pageNum: 1,
        pageSize: 15,
      },
      alTableData: [],
      alreadySettlement: {},
      alFileName: '',
    };
  },
  created() {
    this.getPreSettleData();
    this.getAlreadySettleData();
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      this.getAlreadySettleData();
    },

    // 时间截取
    getDate(date) {
      return date.slice(0, 10).replace(/-/g, '.');
    },

    // 时间格式转换
    changeTimeStyle(time) {
      return time.replace(/-/g, '.');
    },

    // ------------待结算部分------------
    // 获取待结算列表
    getPreSettleData() {
      getSettlementList(this.preFinancialData).then(res => {
        this.preTableData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 搜索
    searchFinancial() {
      this.getPreSettleData();
    },

    // 结算按钮
    settlement(item) {
      this.resetSettlement();
      getSettlementDetail(item).then(res => {
        this.sureSettlement = res.result;
        this.confirmPreSettlement.id = res.result.id;
      });
      this.preSettlementDialog = true;
    },

    // 待结算点击结算按钮重置
    resetSettlement() {
      this.confirmPreSettlement.remark = '';
      this.fileName = '';
      this.confirmPreSettlement.bankBillUrl = '';
    },

    // 上传图片
    onSingleUploadSuccess(url, items) {
      this.fileName = items.oldName;
      this.confirmPreSettlement.bankBillUrl = url;
    },

    // 确认结算
    confirmSettlement() {
      if (!this.confirmPreSettlement.bankBillUrl) {
        this.$message.error('请上传银行账单!');
        return false;
      } else if (!this.confirmPreSettlement.remark) {
        this.$message.error('请填写备注!');
        return false;
      } else {
        settlementUpdate(this.confirmPreSettlement).then(res => {
          this.$message.success('结算成功!');
          this.getPreSettleData();
        });
        this.preSettlementDialog = false;
      }
    },

    // 分页
    preSetSizeChange(val) {
      this.preFinancialData.pageSize = val;
    },

    preSetCurrentChange(val) {
      this.preFinancialData.pageNum = val;
      this.getPreSettleData();
    },

    // -----------已结算部分-------------
    // 获取已结算列表
    getAlreadySettleData() {
      if (this.realSettlementTime) {
        this.alFinancialData.startDate = this.realSettlementTime[0];
        this.alFinancialData.endDate = this.realSettlementTime[1];
      } else {
        this.alFinancialData.startDate = '';
        this.alFinancialData.endDate = '';
      }
      getSettlementList(this.alFinancialData).then(res => {
        this.alTableData = res.result.list;
        this.alTotalCount = res.result.totalCount;
        this.alTotalPage = res.result.totalPage;
      });
    },

    // 搜索
    searchSettlement() {
      this.getAlreadySettleData();
    },

    // 分页
    alSetSizeChange(val) {
      this.preFinancialData.pageSize = val;
    },

    alSetCurrentChange(val) {
      this.preFinancialData.pageNum = val;
      this.getAlreadySettleData();
    },

    // 结算回单按钮 -> 回显数据
    alreadySettlementBtn(items) {
      this.alreadySettlementDialog = true;
      getSettlementDetail(items).then(res => {
        this.alreadySettlement = res.result;
        const fileName = res.result.bankBillUrl;
        const arr = fileName.split('/');

        const picFile = arr[arr.length - 1]; // 截取含有文件名部分
        const fileSplit = picFile.indexOf('-'); // 查找文件名位置
        const splitFile = picFile.slice(0, fileSplit); // 截取文件名

        const fileFoot = picFile.lastIndexOf('.');
        const fileType = picFile.slice(fileFoot); // 截取文件后缀
        this.alFileName = splitFile + fileType; // 拼接文件名和后缀
      });
    },

    // 弹窗确定
    submitSettlement() {
      this.alreadySettlementDialog = false;
    },

    // 点击下载银行订单图片
    downloadBill() {
      const url = this.alreadySettlement.bankBillUrl;
      if (url) {
        downloadFile2(url);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.financial-settlement {
  padding: 30px;
  .price {
    color: red;
  }
  .imgName {
    color: blue;
    text-decoration: underline;
  }
  .bill {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  .times {
    width: 380px;
  }
  .uploadPic {
    margin-left: 40px;
  }
}
</style>
