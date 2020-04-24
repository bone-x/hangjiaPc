<template>
  <div class="content-container">
    <!-- 学员管理 - 学员列表 -->
    <el-row
      :gutter="20"
      type="flex"
      align="middle"
    >
      <el-col :span="2">
        <span style="word-break: keep-all;">注册时间：</span>
      </el-col>
      <!-- <el-col :span="6">
        <el-date-picker
          v-model="filter.dateRange"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          size="large"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-col> -->
      <el-col :span="6">
        <el-date-picker
          v-model="filter.dateRange"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model.trim="filter.userId"
          name="userId"
          placeholder="输入学员ID"
          title="输入学员ID"
          type="text"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model.trim="filter.nickName"
          name="nickName"
          placeholder="输入学员昵称"
          title="输入学员昵称"
          type="text"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model.trim="filter.mobile"
          name="mobile"
          placeholder="输入手机号"
          title="输入手机号"
          type="number"
        ></el-input>
      </el-col>
      <el-col
        :span="4"
        center
      >
        <el-button
          type="primary"
          @click.native="getStudentList(1)"
        >查询</el-button>
        <el-button
          style="margin-left: 30px;"
          @click.native="clearFormFilter"
        >清空</el-button>
      </el-col>
      <el-col
        v-permission="['stu:list:export']"
        :span="3"
        center
      >
        <el-button
          type="primary"
          plain
          @click.native="exportData"
        >导出</el-button>
      </el-col>
      <el-col
        v-permission="['stu:contacts:export']"
        :span="3"
        center
      >
        <el-button
          type="primary"
          @click.native="exportAddressList"
        >导出通讯录</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table
      ref="student-list"
      :data="tableData"
      border
      style="margin:30px 0px;"
      max-height="700"
    >
      <el-table-column
        prop="userId"
        label="学员ID"
        min-width="180"
      ></el-table-column>
      <el-table-column
        prop="nickName"
        label="学员昵称"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="mail"
        label="邮箱"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名"
        min-width="100"
      ></el-table-column>
      <el-table-column
        prop="idCardNo"
        label="身份证"
        min-width="180"
      ></el-table-column>
      <el-table-column
        prop="sexLabel"
        label="性别"
        min-width="80"
      ></el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        min-width="50"
      ></el-table-column>
      <el-table-column
        label="状态"
        min-width="50"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">禁用</div>
          <div v-else>正常</div>
        </template>
      </el-table-column>
      <el-table-column
        label="注册信息"
        min-width="200"
      >
        <template slot-scope="scope">
          <div>时间：{{ scope.row.$registerTime }}</div>
          <!-- <div>&nbsp;&nbsp;&nbsp;&nbsp;IP：{{ scope.row.registerIp }}</div> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="sourceLabel"
        label="来源渠道"
        min-width="100"
      ></el-table-column>
      <el-table-column
        label="最近登录时间"
        min-width="200"
      >
        <template slot-scope="scope">
          <div>时间：{{ scope.row.$lastLoginTime }}</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;IP：{{ scope.row.lastLoginIp }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="interest"
        label="兴趣标签"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="商品详情"
        min-width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="!scope.row.havingGoods"
            type="primary"
            plain
            @click.native="onLookGoods(scope.row.userId)"
          >查看商品</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="听课卡详情"
        min-width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            @click.native="onCourseCard(scope.row.userId)"
            :disabled="!scope.row.havingCard"
          >查看听课卡</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="通讯录"
        min-width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-permission="['stu:contacts:select']"
            plain
            @click.native="onAddressDetails(scope.row.userId)"
            :disabled="scope.row.contactsStatus === 1?true:false"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col
        :span="24"
        center
      >
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="oncurrPageChange"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 点击详情出现的弹窗 -->
    <el-dialog
      :visible.sync="state.isShowDetailsWindow"
      width="800px"
    >
      <el-table
        :data="detailsData"
        border
        max-height="500"
      >
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="$createTime"
          label="加入时间"
          width="200"
        ></el-table-column>
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click.native="state.isShowDetailsWindow = false"
        >关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 点击查看听课卡的弹窗 -->
    <el-dialog
      :visible.sync="state.isShowCourseCard"
      width="1200px"
    >
      <el-table
        :data="CourseCardList"
        border
        max-height="500"
      >
        <el-table-column
          prop="courseCardId"
          label="听课卡ID"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="cardName"
          label="听课卡名称"
          min-width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          label="有效时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span style="display:block;">{{ scope.row.effectiveTimeStart }}</span>
            <span style="display:block;">{{ scope.row.effectiveTimeEnd }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activeStatus"
          label="状态"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.activeStatus === 1">可使用</span>
            <span v-if="scope.row.activeStatus === 2">已激活</span>
            <span v-if="scope.row.activeStatus === 3">已过期</span>
            <span v-if="scope.row.activeStatus === 4">已使用</span>
            <span v-if="scope.row.activeStatus === 5">已失效</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activeTime"
          label="激活时间"
          width="200"
          align="center"
        ></el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <div style="width:100%;display:flex;justify-content:center;">
        <el-pagination
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="state.isShowCourseCard = false"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  studentList,
  exportStudent,
  studentDetail,
  getStudentCourseCardDetailsList,
  exportStudentAddress,
} from '@/api/student';
import { formatDate, dateTimeRange } from '@/utils';

export default {
  name: 'StudentList',
  components: {},
  data() {
    return {
      state: {
        isShowDetailsWindow: false,
        isShowCourseCard: false,
      },
      filter: {
        dateRange: [],
        userId: '',
        nickName: '',
        mobile: '',
        currPage: 1,
        pageSize: 20,
        totalPage: 1,
        totalCount: 0,
      },
      tableData: [],
      detailsData: [],
      CourseCardList: [],
      pageNum: 1,
      pageSize: 10,
      total: 10,
      studentId: '',
    };
  },
  created() {
    this.getStudentList();
  },
  methods: {
    // 导出通讯录
    async exportAddressList() {
      const options = {
        userId: this.filter.userId,
        nickName: this.filter.nickName,
        mobile: this.filter.mobile,
        startTime: this.filter.dateRange[0] || '',
        endTime: this.filter.dateRange[1] || '',
      };
      const res = await exportStudentAddress(options);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },

    // 清空筛选条件
    clearFormFilter() {
      this.filter.dateRange = [];
      this.filter.userId = '';
      this.filter.nickName = '';
      this.filter.mobile = '';
      this.getStudentList();
    },

    // 获取学员列表
    async getStudentList(pageNum = 1) {
      // if (!this.filter.dateRange) this.filter.dateRange = ['', ''];
      const options = {
        pageNum,
        userId: this.filter.userId,
        nickName: this.filter.nickName,
        mobile: this.filter.mobile,
        startTime: this.filter.dateRange[0] || '',
        endTime: this.filter.dateRange[1] || '',
        pageSize: this.filter.pageSize,
      };
      const res = await studentList(options);
      if (res.code !== 200) return Promise.reject();
      const {
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0,
        list = [],
      } = res.result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;
      this.tableData = list.map(i => {
        if (i.registerTime) {
          i.$registerTime = formatDate(i.registerTime, 8);
        }
        if (i.lastLoginTime) {
          i.$lastLoginTime = formatDate(i.lastLoginTime, 8);
        }
        return i;
      });

      this.$nextTick(() => {
        if (this.$refs['student-list']) {
          this.$refs['student-list'].bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 查看商品
    async onLookGoods(userId) {
      const res = await studentDetail(userId);
      if (res.code !== 200) return Promise.reject();
      this.state.isShowDetailsWindow = true;
      this.detailsData = res.result.map(i => {
        i.$createTime = formatDate(i.createTime);
        return i;
      });
    },

    // 查看听课卡
    async onCourseCard(id) {
      this.studentId = id;
      const params = {
        studentId: this.studentId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await getStudentCourseCardDetailsList(params);
      if (res.code !== 200) return Promise.reject();
      this.state.isShowCourseCard = true;
      this.CourseCardList = res.result.list;
      this.total = res.result.totalCount;
    },

    // 听课卡弹窗当前页改变
    handleCurrentChange(pageNumber) {
      this.pageNum = pageNumber;
      this.onCourseCard(this.studentId);
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getStudentList(pageNum);
    },

    // 导出数据
    async exportData() {
      const options = {
        userId: this.filter.userId,
        nickName: this.filter.nickName,
        mobile: this.filter.mobile,
        startTime: this.filter.dateRange[0] || '',
        endTime: this.filter.dateRange[1] || '',
      };
      const res = await exportStudent(options);
      if (res.code !== 200) return Promise.reject();
      const { url } = res.result;
      if (url) {
        window.open(url, '_self');
      }
    },

    // 跳转到通讯录详情
    onAddressDetails(id) {
      this.$router.push({ name: 'StudentListDetails', params: { id } });
      //this.$router.push({ name: "NewsType" });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-date-editor .el-range-separator {
  min-width: 30px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
