<template>
  <div class="content-container">
    <!-- 运营管理 - 听课卡列表 - 详情 -->
    <h4>听课卡信息</h4>
    <el-row :gutter="20">
      <el-col :span="6" :offset="2">
        已发放数量：<span class="title">{{row.sendSum}}</span>
      </el-col>
      <el-col :span="6">
        持有人数: <span class="title2" @click="dialogVisible = true">{{row.holdSum}}</span>
      </el-col>
      <el-col :span="6">
        激活数量: <span class="title">{{row.activeSum}}</span>
      </el-col>
  </el-row>
  <h4>发放记录</h4>
   <el-row :gutter="20" style="margin-bottom:30px;">
        <el-col :span="5">
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="~"
            start-placeholder="年/月/"
            end-placeholder="年/月/"
          ></el-date-picker>
        </el-col>
         <el-col :span="1" :offset="9">
          <el-button type="danger"  @click="clearAllData">清空</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" style="margin-left:30px" @click="queryDataList" icon="el-icon-search">搜索</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData" border style="width:70%;">
      <el-table-column prop="createTime" label="发放时间" ></el-table-column>
      <el-table-column prop="sendTotalPerson" label="发放数量"></el-table-column>
      <el-table-column prop="sendTotalCount" label="发放人数">
        <template slot-scope="scope">
          <span class="title2" @click="dialogVisibleOpen(scope.row.id)">{{scope.row.sendTotalCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="sendType" label="发放类型">
        <template slot-scope="scope">
          <span v-if="scope.row.sendType === 1">所有用户</span>
          <span v-if="scope.row.sendType === 2">指定用户</span>
          <span v-if="scope.row.sendType === 3">批量导入用户</span>
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="14" center>
        <el-pagination
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="onpageNumChange"
        ></el-pagination>
      </el-col>
    </el-row>

     <!-- 查看持有人数的弹窗 -->
    <el-dialog :visible.sync="dialogVisible" :before-close='holdVisible' title="持有人数" width="800px">
      <el-row>
        <el-col :span="2"><span style="hight:36px;line-height:36px;">用户名:</span></el-col>
        <el-col :span="4"> <el-input v-model="userName" placeholder="请输入用户名"></el-input></el-col>
        <el-col :span="2"><span style="hight:36px;line-height:36px;margin-left:10px;">手机号:</span></el-col>
        <el-col :span="4"><el-input v-model="phoneNumber" placeholder="请输入手机号"></el-input></el-col>
        <el-col :span="8" :offset="4"> <el-button type="primary" @click="searchList">搜索</el-button><el-button @click="exportHoldSum" v-permission="['operate:course:export']">导出全部数据</el-button></el-col>
      </el-row>
      <div style="margin-bottom:20px;"></div>
      <div>
        <el-table :data="getmanList" border style="width: 100%">
          <el-table-column align="center" prop="nickName" label="用户名" ></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机"></el-table-column>
          <el-table-column align="center" prop="holdSum" label="持有数量"></el-table-column>
          <el-table-column align="center" prop="usableSum" label="可用数量"></el-table-column>
          <el-table-column align="center" prop="activeSum" label="激活数量"></el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20" style="padding-top:20px;">
        <el-col :span="20" center>
          <div class="block">
            <el-pagination
              :current-page.sync="currentPagedialog"
              :page-size="pageSizedialog"
              :total="totaldialog"
              layout="prev, pager, next, jumper"
              background
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="20" style="padding-top:20px;">
          <el-col :span="12" :offset="3">
            <el-button @click="holdVisible">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <!-- 查看发放人数弹窗 -->
    <el-dialog :visible.sync="dialogVisibleOut" :before-close='holdVisibleOut' title="发放人数" width="800px">
      <el-row>
        <el-col :span="2"><span style="hight:36px;line-height:36px;">用户名:</span></el-col>
        <el-col :span="4"> <el-input v-model="userNameOut" placeholder="请输入用户名"></el-input></el-col>
        <el-col :span="2"><span style="hight:36px;line-height:36px;margin-left:10px;">手机号:</span></el-col>
        <el-col :span="4"><el-input v-model="phoneNumberOut" placeholder="请输入手机号"></el-input></el-col>
        <el-col :span="8" :offset="4"> <el-button type="primary" @click="searchData">搜索</el-button><el-button @click="exportSum" v-permission="['operate:course:export']">导出全部数据</el-button></el-col>
      </el-row>
      <div style="margin-bottom:20px;"></div>
      <div>
        <el-table :data="giveOutList" border style="width: 100%">
          <el-table-column align="center" prop="nickName" label="用户名" ></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机"></el-table-column>
          <el-table-column align="center" prop="holdSum" label="持有数量"></el-table-column>
          <el-table-column align="center" prop="usableSum" label="可用数量"></el-table-column>
          <el-table-column align="center" prop="activeSum" label="激活数量"></el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20" style="padding-top:20px;">
        <el-col :span="20" center>
          <div class="block">
            <el-pagination
              :current-page.sync="currentOutdialog"
              :page-size="pageSizeOutdialog"
              :total="totalOutdialog"
              layout="prev, pager, next, jumper"
              background
              @current-change="CurrentOutChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="20" style="padding-top:20px;">
          <el-col :span="12" :offset="3">
            <el-button @click="holdVisibleOut">取 消</el-button>
            <el-button type="primary" @click="dialogVisibleOut = false">确 定</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getDataDetailsList, getHoldOutSumList, getExcelExport} from "@/api/operation";
import { formatDate } from "@/utils/index";
import { Promise } from 'q';

export default {
  name: "OperationCourseCardDetails",
  components: {},
  data() {
    return {
      date: '',
      tableData:[{
        time:'1',
        number:'1',
        people:'1',
        remark: '1',
        type: '1'
      }],
      pageNum:1,
      pageSize:20,
      totalCount:20,
      dialogVisible:false,
      dialogVisibleOut:false,
      userName: '',
      phoneNumber: '',
      userNameOut: '',
      phoneNumberOut:'',
      getmanList:[],
      giveOutList:[],
      currentPagedialog:1,
      pageSizedialog:5,
      totaldialog:10,
      currentOutdialog:1,
      pageSizeOutdialog:5,
      totalOutdialog:10,
      row:{},
      OutId:1, // senId
    };
  },
  created() {
    this.row = JSON.parse(sessionStorage.getItem('DetailsRow'))
    this.getList()
    this.getHoldSumList()
    this.getOutSumList()
  },
  methods: {
    // 列表
    getList(pageNum) {
      const params = {
        cardId:this.row.id,
        startDate: this.date[0] || "",
        endDate: this.date[1] || "",
        pageNum,
        pageSize: this.pageSize
      }
      getDataDetailsList(params).then(res => {
        console.log(res, '发放记录的列表')
        this.tableData = res.result.list;
        this.totalCount = res.result.totalCount;
      })
    },

    // 持有人数弹窗
    getHoldSumList() {
      const params = {
        cardId: this.row.id,
        nickName: this.userName || "",
        mobile: this.phoneNumber || "",
        pageNum:this.currentPagedialog,
        pageSize: this.pageSizedialog
      }
      getHoldOutSumList(params).then(res => {
        console.log(res, '持有人数弹窗')
        this.getmanList = res.result.list;
        this.totaldialog = res.result.totalCount;
      })
    },

    // 发放弹窗事件
    dialogVisibleOpen(id) {
      console.log(id, '我的ID',this.$route.query.id)
      this.OutId = id;
      this.dialogVisibleOut = true;
      this.getOutSumList()
    },

    // 发放人数弹窗
    getOutSumList() {
      console.log(this.OutId);
      const params = {
        cardId: this.row.id,
        sentId: this.OutId,
        nickName: this.userNameOut || "",
        mobile: this.phoneNumberOut || "",
        pageNum:this.currentOutdialog,
        pageSize: this.pageSizeOutdialog
      }
      getHoldOutSumList(params).then(res => {
        console.log(res, '发放人数弹窗')
        this.giveOutList = res.result.list;
        this.totalOutdialog = res.result.totalCount;
      })
    },

    // 持有人数搜索
    searchList () {
      this.currentPagedialog = 1;
      this.getHoldSumList();
    },

    // 搜索发放人数数据
    searchData() {
      this.currentOutdialog = 1
      this.getOutSumList()
    },

    // 导出持有人数弹窗数据
    async exportHoldSum() {
      const params = {
        cardId: this.row.id,
        nickName: this.userName || "",
        mobile: this.phoneNumber || "",
      }
      const res = await getExcelExport(params);
      if (res.code != 200) return Promise.reject();
      if (res.url) {
        window.open(res.url, '_self');
      }
    },

    // 导出发放人数弹窗数据
    async exportSum() {
      const params = {
        sentId: this.OutId,
        nickName: this.userNameOut,
        mobile: this.phoneNumberOut
      }
      const res = await getExcelExport(params);
      if (res.code != 200) return Promise.reject();
      if (res.url) {
        window.open(res.url, '_self');
      }
    },

    clearAllData() {
      this.date = '';
    },
    queryDataList() {
      this.getList(1)
    },
    onpageNumChange(val) {
      this.pageNum = val;
      this.getList(this.pageNum);
      console.log(`当前页: ${val}`);
    },
    // 持有人数的弹窗当前页码
    handleCurrentChange(val) {
      this.currentPagedialog = val;
      this.getHoldSumList();
    },
    // 发放人数的弹窗当前页码
    CurrentOutChange(val) {
      this.currentOutdialog = val;
      this.getOutSumList();
    },

    holdVisible() {
      this.dialogVisible = false;
      this.userName = '';
      this.phoneNumber = '';
    },

    holdVisibleOut() {
      this.dialogVisibleOut = false;
      this.userNameOut = '';
      this.phoneNumberOut = '';
    }

  },
};
</script>

<style scoped lang="scss">
.title {
  display: inline-block;
  width: 100px;
  text-align: center;
}
.title2 {
  text-decoration:underline;
  color: blue;
  display: inline-block;
  width: 100px;
  text-align: center;
}
</style>