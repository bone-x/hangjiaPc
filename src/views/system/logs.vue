<template>
  <div class="content-container">
    <!-- 系统管理 - 系统日志 -->
    <div class="content-head">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="date"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="年/月/"
            end-placeholder="年/月/"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="userName"
            placeholder="请输入用户名"
            maxlength="6"
            @keyup.enter.native="queryList"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="ways"
            placeholder="请输入执行方法"
            maxlength="20"
            @keyup.enter.native="queryList"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="argument"
            placeholder="请输入传入参数"
            maxlength="20"
            @keyup.enter.native="queryList"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="iprotocal"
            placeholder="请输入IP"
            @keyup.enter.native="queryList"
          ></el-input>
        </el-col>
        <el-col :span="1">
          <el-button
            v-permission="['sys:log:select']"
            type="primary"
            @click="queryList"
          >查询</el-button>
        </el-col>
        <el-col
          :span="2"
          style="margin-left:20px;"
        >
          <el-button
            type="info"
            @click="clearAll"
          >清空</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div>
      <el-table
        :data="tableData"
        @sort-change="getOrder"
        style="width: 100%"
        border
      >
        <el-table-column
          label="日志ID"
          prop="id"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="用户名称"
          prop="username"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="操作"
          prop="operation"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="执行方法"
          prop="method"
          align="center"
          sortable="custom"
        >
          <template slot-scope="scope">
            <p class="tag">{{ scope.row.method }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="传入参数"
          prop="params"
          align="center"
          sortable="custom"
        >
          <template slot-scope="scope">
            <p class="tag">{{ scope.row.params }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="IP"
          width="300"
          prop="ip"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="创建日期"
          width="180"
          prop="createTime"
          align="center"
          sortable="custom"
        ></el-table-column>
      </el-table>
    </div>
    <el-row
      :gutter="20"
      class="Pagination"
    >
      <el-col
        :span="12"
        :offset="6"
      >
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSize"
            @current-change="handleCurrent"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getlogList, querylogList } from '@/api/system.js';

export default {
  name: 'SystemLogs',
  components: {},
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 10,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = '';
            // console.log(maxDate);
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate !== '') {
            const day30 = (30 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day30;
            // if (maxTime > new Date()) {
            //   maxTime = new Date();
            // }
            // console.log(new Date(), maxTime, Date.now());
            return time.getTime() > maxTime;
          }
        },
      },
      date: '',
      userName: '',
      ways: '',
      argument: '',
      iprotocal: '',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // 列表
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        ip: this.iprotocal,
        method: this.ways,
        username: this.userName,
        staertTime: this.date[0],
        endTime: this.date[1],
        params: this.argument,
        sidx: 'createTime',
        sort: 'desc', // 倒序
      };
      getlogList(params).then(response => {
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        console.log(response);
      });
    },
    getListAsc() {
      // 列表
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        ip: this.iprotocal,
        method: this.ways,
        username: this.userName,
        staertTime: this.date[0],
        endTime: this.date[1],
        params: this.argument,
        sidx: 'createTime',
        sort: 'asc', // 正序
      };
      getlogList(params).then(response => {
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        console.log(response);
      });
    },
    queryList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        ip: this.iprotocal,
        method: this.ways,
        username: this.userName,
        staertTime: this.date[0],
        endTime: this.date[1],
        params: this.argument,
      };
      querylogList(params).then(response => {
        console.log(response);
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    handleSize(val) {
      this.pageSize = val;
      this.getList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrent(val) {
      this.currentPage = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    clearAll() {
      this.date = '';
      this.userName = '';
      this.ways = '';
      this.iprotocal = '';
      this.argument = '';
    },
    getOrder(param) {
      console.log(param, '回掉table');
      if (param.order === 'descending') {
        this.getList();
      } else {
        this.getListAsc();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content-head {
  margin-bottom: 20px;
}
.Pagination {
  margin-top: 20px;
}
.tag {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 42px;
}
</style>
