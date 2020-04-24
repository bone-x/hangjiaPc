<template>
  <div class="crawling-maven-container">
    <div>
      <el-form
        :model="queryData"
        ref="form"
        label-width="80px"
        size="large"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              class="maketime"
              label="查询时间"
            >
              <el-date-picker
                v-model="timeLimit"
                :default-time="['10:00:00']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                @change="dateTimeChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="large">
              <el-button
                type="primary"
                @click.native="onSearch"
              >查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="large">
              <el-button
                v-permission="['maven:data:export']"
                type="primary"
                @click.native="exportData"
              >导出报表</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btnList">
          <el-row :gutter="20">
            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="lastTime()"
                >上一次</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="today(2)"
                >本日</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="thisWeek(3)"
                >本周</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="lastSevenDay(4)"
                >前7天</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="thisMonth(5)"
                >本月</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="lastTwentyDay(6)"
                >前30天</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="lastThreeMonth(7)"
                >前3个月</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="HalfYear(8)"
                >半年</el-button>
              </el-form-item>
            </el-col>

            <el-col
              :span="2"
              style="text-align: center;"
            >
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="thisYear(9)"
                >本年</el-button>
              </el-form-item>
            </el-col>

            <el-col
              :span="2"
              style="text-align: center;"
            >
              <el-form-item size="large">
                <el-button
                  type="primary"
                  plain
                  @click.native="oneYear(10)"
                >近一年</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="tableData">
      <el-table
        :data="mavenDataList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
        :row-class-name="tableRowClassName"
        :default-sort="defaultSort"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        @sort-change="onTableSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="120"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="projectname"
          label="项目名"
          width="200"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="desc"
          label="描述"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="last_update_time"
          label="更新时间"
          width="120"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="group_id"
          label="groupId"
          width="150"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="artifact_id"
          label="artifactId"
          width="150"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="version"
          label="版本"
          width="120"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="crawl_time"
          label="爬取时间"
          width="200"
          align="center"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">新增</span>
            <span v-else="scope.row.status === 2">更新</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="操作"
          width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <span v-permission="['maven:data:ignore']">
              <el-button
                v-if="scope.row.ignore === 0"
                type="danger"
                size="mini"
                plain
                @click.native="ignoreOne(scope.row.id)"
              >忽略</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row style="margin-top: 20px;">
      <el-col
        :span="24"
        style="text-align: right;"
      >
        <el-button
          v-permission="['maven:data:ignore']"
          type="danger"
          class="ignore"
          @click.native="ignoreSelected"
        >忽略</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col
        :span="24"
        style="text-align: center;"
      >
        <el-pagination
          :current-page.sync="queryData.startPage"
          :page-size="queryData.numberPerPage"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  toTimeByMsec,
  getNowTime,
  getToday,
  getThisMonday,
  getThisMonth,
  getThisYear,
  getFullYmd,
} from '@/utils/index';
import {
  getTheLastTime,
  getListById,
  getListBySet,
  exportFormList,
  changeIgnore,
} from '@/api/crawling';

export default {
  name: 'MavenList',
  data() {
    return {
      formData: {
        pageNum: 1,
        pageSize: 10,
        beginDate: '',
        endDate: '',
      },
      queryData: {
        type: 'maven',
        startTime: '',
        endTime: '',
        startPage: 1,
        numberPerPage: 10,
        orderBy: 'id',
        order: 'asc',
      },
      defaultTime: '',
      timeLimit: [],
      totalCount: 10,
      totalPage: 10,
      mavenDataList: [],
      multipleSelection: [],
      ids: '',
      defaultSort: {
        prop: '',
        order: '',
      },
    };
  },
  created() {
    this.getCrawlingTime();
  },
  methods: {
    // 获取时间
    dateTimeChange(date) {
      if (date !== null) {
        [this.queryData.startTime, this.queryData.endTime] = date;
        this.queryData.startTime = date[0];
        this.queryData.endTime = date[1];
      } else {
        this.queryData.startTime = '';
        this.queryData.endTime = '';
      }
    },

    // 获取爬取时间范围
    async getCrawlingTime() {
      const params = {
        type: 'maven',
      };
      const res = await getTheLastTime(params);
      if (res.code !== 200) return Promise.reject();
      this.queryData.startTime = '2018-01-01 00:00:00';
      this.queryData.endTime = res.result.list[1];
      this.defaultTime = res.result.list[1];
      this.getMavenList();
    },

    // 获取列表 queryData
    getMavenList() {
      getListBySet(this.queryData)
        .then(res => {
          this.mavenDataList = res.result.list;
          this.totalCount = res.result.totalCount;
          this.totalPage = res.result.totalPage;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 查询
    onSearch() {
      if (this.timeLimit.length === 0) {
        this.queryData.startTime = '2018-01-01 00:00:00';
        this.queryData.endTime = this.defaultTime;
      } else {
        this.queryData.startTime = this.timeLimit[0];
        this.queryData.endTime = this.timeLimit[1];
      }
      this.getMavenList();
    },

    // 监听表格排序事件
    onTableSort({ prop, order }) {
      if (prop) this.queryData.orderBy = String(prop).replace('$', '');
      else this.queryData.orderBy = '';

      if (order === 'descending') this.queryData.order = 'desc';
      else if (order === 'ascending') this.queryData.order = 'asc';
      else this.queryData.order = '';
      this.getMavenList();
    },

    // 导出指数
    async exportData() {
      const params = {
        type: 'maven',
        startTime: this.queryData.startTime,
        endTime: this.queryData.endTime,
        orderBy: this.queryData.orderBy,
        order: this.queryData.order,
      };
      const res = await exportFormList(params);
      if (res.code !== 200) return Promise.reject();
      const { list } = res.result;
      if (list) {
        window.open(list, '_self');
        this.getMavenList();
      }
    },

    // 时间点击事件
    // 获取当前年月日 时分秒
    getYmd(newDay) {
      const getTd = getToday(0); // 获取当前年月日
      const getHms = getNowTime(newDay);
      const today = getTd + ' ' + getHms;
      return today;
    },

    // 时间点击事件
    lastTime() {
      const params = {
        type: 'maven',
      };
      getTheLastTime(params)
        .then(res => {
          this.timeLimit = res.result.list;
          this.queryData.startTime = res.result.list[0];
          this.queryData.endTime = res.result.list[1];
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 本日
    today() {
      const today = getToday(0);
      const todayBegin = today + ' ' + '00' + ':' + '00' + ':' + '00';
      const thisTime = new Date();
      const thisMoment = getNowTime(thisTime);
      const todayNow = today + ' ' + thisMoment;
      this.formData.beginDate = todayBegin;
      this.formData.endDate = todayNow;
      this.timeLimit = [todayBegin, todayNow];
    },

    // 本周
    thisWeek(three) {
      const news = new Date();
      const monday =
        getThisMonday('s', 0) + ' ' + '00' + ':' + '00' + ':' + '00'; // 本周一
      const today = this.getYmd(news); // 当前年月日时分秒
      this.timeLimit = [monday, today];
      console.log('thisWeek', this.timeLimit);
    },

    // 前7天
    lastSevenDay(four) {
      const end = new Date();
      const start = new Date();
      const last = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      const lastSeven = getFullYmd(last) + ' ' + '00' + ':' + '00' + ':' + '00'; // 前7天的第一日
      const today = this.getYmd(end); // 当前年月日时分秒
      this.timeLimit = [lastSeven, today];
    },

    // 本月
    thisMonth(five) {
      const news = new Date();
      const first = getThisMonth('s', 0) + ' ' + '00' + ':' + '00' + ':' + '00';
      const today = this.getYmd(news); // 当前年月日时分秒
      this.timeLimit = [first, today];
    },

    // 前30天
    lastTwentyDay(six) {
      const start = new Date();
      const last = start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const lastThirty =
        getFullYmd(last) + ' ' + '00' + ':' + '00' + ':' + '00'; // 前30天的第一日
      const today = this.getYmd(start); // 当前年月日时分秒
      this.timeLimit = [lastThirty, today];
    },

    // 前3个月
    lastThreeMonth(seven) {
      const start = new Date();
      const last = start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      const lastThreeMonth =
        getFullYmd(last) + ' ' + '00' + ':' + '00' + ':' + '00'; // 前30天的第一日
      const today = this.getYmd(start); // 当前年月日时分秒
      this.timeLimit = [lastThreeMonth, today];
    },

    // 半年
    HalfYear(eight) {
      const start = new Date();
      const last = start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
      const halfPassYear =
        getFullYmd(last) + ' ' + '00' + ':' + '00' + ':' + '00'; // 前30天的第一日
      const today = this.getYmd(start); // 当前年月日时分秒
      this.timeLimit = [halfPassYear, today];
    },

    // 本年
    thisYear(nine) {
      const news = new Date();
      const yuan = getThisYear('s', 0) + ' ' + '00' + ':' + '00' + ':' + '00';
      const today = this.getYmd(news); // 当前年月日时分秒
      this.timeLimit = [yuan, today];
    },

    // 最近一年
    oneYear(ten) {
      const start = new Date();
      const last = start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
      const thisYear = getFullYmd(last) + ' ' + '00' + ':' + '00' + ':' + '00'; // 前30天的第一日
      const today = this.getYmd(start); // 当前年月日时分秒
      this.timeLimit = [thisYear, today];
    },

    // 单选获取每个商品数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 单个忽略
    ignoreOne(id) {
      const params = {
        type: 'maven',
        id: id,
      };
      changeIgnore(params)
        .then(res => {
          // console.log(res);
          this.$message.success('操作成功！');
          this.getMavenList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 忽略选中
    ignoreSelected() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据',
        });
      } else {
        this.ids = this.multipleSelection.map(item => {
          return item.id;
        });
        const params = {
          type: 'maven',
          id: this.ids.join(','),
        };
        changeIgnore(params)
          .then(res => {
            console.log(res);
            this.$message.success('操作成功！');
            this.getMavenList();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    // 分页
    handleSizeChange(val) {
      this.queryData.numberPerPage = val;
    },
    handleCurrentChange(val) {
      this.queryData.startPage = val;
      this.getMavenList();
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
  },
};
</script>

<style lang="less" scoped>
.crawling-maven-container {
  padding: 40px;
  .btnList {
    margin-top: 20px;
  }
  .tableData {
    margin: 30px 0px 30px 0px;
  }
  /deep/ .el-table .warning-row {
    background: #ffffff;
  }

  /deep/ .el-table .success-row {
    background: #f0f9eb;
  }
}
</style>