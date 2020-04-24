<template>
  <div class="content-container">
    <!-- 系统管理 - IP黑名单 -->
    <div class="content-head">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="date"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="年/月/"
            end-placeholder="年/月/"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="iprotocal"
            placeholder="请输入IP"
          ></el-input>
        </el-col>
        <el-col :span="1">
          <el-button
            v-permission="['sys:ip:select']"
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

    <div style="margin-bottom:20px;">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button
            v-permission="['sys:ip:delete']"
            type="danger"
            @click="multiDelete"
          >删除</el-button>
        </el-col>
        <el-col
          :span="2"
          :offset="20"
        >
          <el-button
            v-permission="['sys:ip:save']"
            type="primary"
            @click="goBlackmenu"
          >新建IP黑名单</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        @sort-change="getOrder"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="No."
          prop="id"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="IP地址"
          prop="ipAddr"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="屏蔽次数"
          prop="shieldCount"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="操作人"
          prop="operator"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300"
          prop="url"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >详情</el-button>
            <el-button
              v-permission="['sys:ip:delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:20px;">
      <el-button
        v-permission="['sys:ip:delete']"
        type="danger"
        @click="multiDelete"
      >删除</el-button>
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
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="查看爬取结果"
      width="800px"
    >
      <span>请选择范围：</span>
      <el-date-picker
        v-model="checkdate"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="daterange"
        range-separator="-"
        start-placeholder="年/月/"
        end-placeholder="年/月/"
      ></el-date-picker>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="queryResult"
      >搜索</el-button>
      <el-button
        v-permission="['sys:ip:export']"
        style="float:right;"
        @click="outData"
      >导出全部数据</el-button>
      <div style="margin-bottom:20px;"></div>
      <div>
        <el-table
          :data="table"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            prop="id"
            label="序号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="ipAddr"
            label="IP地址"
          ></el-table-column>
          <el-table-column
            align="center"
            label="屏蔽时间"
          >
            <template slot-scope="scope">
              {{ timeFormat(scope.row.createTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row
        :gutter="20"
        style="padding-top:20px;"
      >
        <el-col
          :span="12"
          :offset="6"
        >
          <div class="block">
            <el-pagination
              :current-page.sync="currentPagedialog"
              :page-size="pageSizedialog"
              :total="totaldialog"
              layout="prev, pager, next, jumper"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row
          :gutter="20"
          style="padding-top:20px;"
        >
          <el-col
            :span="12"
            :offset="3"
          >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="dialogVisible = false"
            >确 定</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlackList,
  getclearListexcel,
  delBlackList,
  delmulblackList,
  getclearBlackList,
} from '@/api/system.js';
import { formatDate } from '@/utils/index';

export default {
  name: 'SystemBlacklist',
  components: {},
  data() {
    return {
      row: '', // 详情获取数据
      optionDialog: [],
      multipleSelection: [],
      tableData: [],
      dialogVisible: false,
      currentPage: 1,
      pageSize: 20,
      total: 28,
      // pickerOptions: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.pickerMinDate = minDate.getTime();
      //     if (maxDate) {
      //       this.pickerMinDate = "";
      //       // console.log(maxDate);
      //     }
      //   },
      //   disabledDate: time => {
      //     return time.getTime() > Date.now();
      //   }
      // },
      date: '',
      iprotocal: '',
      valueDialog: '',
      checkdate: '',
      table: [],
      currentPagedialog: 1,
      pageSizedialog: 10,
      totaldialog: 10,
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    this.getList();
  },
  methods: {
    timeFormat: formatDate, // 时间戳转化
    onRouteChange(to) {
      // 监听路由的变化
      if (to.name === 'SystemBlacklist') {
        this.getList();
      }
    },
    getList() {
      // 列表数据
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sidx: 'createTime',
        sort: 'desc', // 倒序
      };
      getBlackList(params).then(response => {
        console.log(response);
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    getListAsc() {
      // 列表数据
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sidx: 'createTime',
        sort: 'asc', // 正序
      };
      getBlackList(params).then(response => {
        console.log(response);
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    queryList() {
      // 查询
      const params = {
        ipAddr: this.iprotocal || null,
        startTime: this.date === null ? '' : this.date[0],
        endTime: this.date === null ? '' : this.date[1],
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      getBlackList(params).then(response => {
        console.log(response, 909090);
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        console.log(this.date, 123456);
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
      this.iprotocal = '';
    },
    handleEdit(index, row) {
      this.row = row;
      this.dialogVisible = true;
      const params = {
        ipBlacklistId: row.id,
        pageNum: this.currentPagedialog,
        pageSize: this.pageSizedialog,
      };
      getclearBlackList(params).then(response => {
        // 弹窗列表数据
        console.log(response, 11111111);
        this.table = response.result.list;
        this.totaldialog = response.result.totalCount;
      });
      console.log(index, row);
    },
    handleDelete(index, row) {
      // 单个删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            ipList: row.id,
          };
          delBlackList(data).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            console.log(response);
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
      console.log(index, row);
    },
    multiDelete() {
      // 多个删除
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要删除的IP黑名单',
          type: 'warning',
        });
      } else {
        this.$confirm('确定要删除已选中的IP黑名单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const newArray = [];
            this.multipleSelection.forEach(val => {
              newArray.push(val.id);
            });
            const newStr = newArray.join(',');
            console.log('多个删除的数据', newStr);
            const params = {
              newStr,
            };
            delmulblackList(params).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功',
              });
              console.log(response);
              this.getList();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    handleSelectionChange(val) {
      // 批量处理
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    goBlackmenu() {
      this.$router.push({ name: 'IPBlacklistAdd' });
    },
    async outData() {
      // 导出数据
      const data = {
        ipBlacklistId: this.row.id,
      };
      const res = await getclearListexcel(data);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
      console.log('导出的列表excel', res);
    },
    handleSizeChange(val) {
      this.pageSizedialog = val;
      this.queryResult();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPagedialog = val;
      this.queryResult();
      console.log(`当前页: ${val}`);
    },
    queryResult() {
      const params = {
        endTime: this.checkdate[1] || null,
        startTime: this.checkdate[0] || null,
        ipBlacklistId: this.row.id || null,
        pageNum: this.currentPagedialog,
        pageSize: this.pageSizedialog,
      };
      getclearBlackList(params).then(response => {
        // 弹窗列表数据
        console.log(response, 11111111);
        this.table = response.result.list;
      });
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
</style>
