<template>
  <div class="student_msg">
    <!-- 学员管理 - 笔记详情 -->
    <div class="notesDetails">
      <el-row>
        <el-col :span="7">
          <el-date-picker
            v-model="selectTimes"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="timer"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchData.userName"
            placeholder="输入学员昵称"
            type="text"
            class="nickName"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchData.mobile"
            placeholder="输入学员手机号"
            type="phone"
            class="nickName"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="chapterName"
            clearable
            placeholder="选择章节/课次"
            type="text"
            class="nickName"
            @focus="selectChapter"
            style="width:300px"
          ></el-input>
        </el-col>
      </el-row>

      <!-- 操作栏 -->
      <el-row
        :gutter="20"
        style="margin-top: 30px;"
      >
        <el-col :span="2">
          <el-button
            type="primary"
            @click.native="searchNotes"
          >查询</el-button>
        </el-col>

        <el-col :span="2">
          <el-button
            type="danger"
            @click.native="clearSearch"
          >清空</el-button>
        </el-col>

        <el-col :span="2">
          <el-button
            v-permission="['stu:note:export']"
            type="primary"
            plain
            @click.native="onExport"
          >导出</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="notesData"
        style="width: 100%;margin-top: 40px"
        border
        :header-cell-style="{background: '#eef1f6',color: '#606266', width: '100%'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="chapterSectionName"
          label="目录/章节"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="userName"
          label="学员昵称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="笔记内容"
          width="450"
        ></el-table-column>
        <el-table-column
          prop="url"
          label="图片"
          width="150"
        >
          <template slot-scope="scope">
            <img
              v-if="scope.row.url"
              :src="scope.row.url"
              preview="1"
              alt
              class="images"
            />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="提交时间"
          fixed="right"
        >
          <template slot-scope="scope">
            <span>{{ timeFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="blockPage">
        <el-pagination
          :current-page.sync="searchData.pageNum"
          :page-size="searchData.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 选择章节弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="选择章节/课次"
      width="900px"
      left
    >
      <el-form
        :inline="true"
        :model="formData"
        class="flex-center"
      >
        <el-form-item class="magin-left">
          <el-input
            v-model="formData.name"
            placeholder="章节/课次名称"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item class="magin-left">
          <el-button
            icon="el-icon-search"
            @click.native="onSubmit"
          >搜索</el-button>
        </el-form-item>
      </el-form>
      <!-- 弹窗表格部分 -->
      <el-table
        :data="sessionList"
        size="small"
        border
      >
        <el-table-column
          label
          width="50"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.$index"
              v-model="radio"
              @change.native="getCurrentRow(scope.row)"
            >&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="courseId"
          label="课程ID"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="章节/课次名称"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="id"
          width="120"
        ></el-table-column>
      </el-table>

      <!-- 弹窗分页选择 -->
      <div
        class="block"
        style="margin-top:20px;display:flex;justify-content:center"
      >
        <el-pagination
          :page-size="formData.pageSize"
          :current-page.sync="formData.pageNum"
          :total="chapterDatas.totalCount"
          layout="prev, pager, next, jumper"
          class="simplepage"
          background
          @size-change="handleSizeChangeChapter"
          @current-change="handleCurrentChangeChapter"
        ></el-pagination>
      </div>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          class="yes"
          @click="centerDialogVisible = false"
          @click.native="sendGoodsMsg"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNotesDetailsList,
  getAllChapters,
  exportNotesDetails,
} from '@/api/student';
import { formatDate } from '@/utils/index';

export default {
  name: 'NotesDetails',
  components: {},
  data() {
    return {
      centerDialogVisible: false,
      formData: {
        courseId: '',
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
      chapterName: '',
      // 弹窗表格单选
      radio: '',
      oneDataDetail: '',
      chapterDatas: {
        totalCount: 10,
        totalPage: 10,
      },
      selectTimes: '',
      searchData: {
        courseId: '',
        startTime: '',
        endTime: '',
        userName: '',
        mobile: '',
        topicType: 20,
        chapterId: '',
        pageNum: 1,
        pageSize: 10,
      },
      totalCount: 10,
      totalPage: 10,
      sessionList: [],
      notesData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.getNotesDetailsData();
  },
  methods: {
    timeFormat: formatDate, // 时间戳转化
    // 点击章节框弹窗开关
    selectChapter() {
      this.oneDataDetail = '';
      this.radio = '';
      this.formData.name = '';
      //   this.chapterName = "";
      //   this.searchData.chapterId = "";
      this.centerDialogVisible = true;
      this.getWholeChapters();
    },

    // 获取全部章节
    getWholeChapters() {
      this.formData.courseId = this.$route.params.id;
      getAllChapters(this.formData).then(res => {
        this.sessionList = res.result.list;
        this.chapterDatas.totalCount = res.result.totalCount;
        this.chapterDatas.totalPage = res.result.totalPage;
      });
    },

    // 弹窗搜索
    onSubmit() {
      this.getWholeChapters();
    },

    // 弹窗单选操作的方法
    getCurrentRow(item) {
      this.oneDataDetail = item;
    },

    // 弹窗确定
    sendGoodsMsg() {
      this.chapterName = this.oneDataDetail.name;
      this.searchData.chapterId = this.oneDataDetail.id;
    },

    // 下拉列分页
    handleSizeChangeChapter(val) {
      this.formData.pageSize = val;
    },
    handleCurrentChangeChapter(val) {
      this.formData.pageNum = val;
      this.radio = '';
      this.getWholeChapters();
    },

    // 获取笔记列表
    getNotesDetailsData() {
      this.searchData.courseId = this.$route.params.id;
      getNotesDetailsList(this.searchData).then(res => {
        this.notesData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 查询
    searchNotes() {
      const timeArr = [];
      if (this.selectTimes !== '') {
        this.selectTimes.map(i => {
          timeArr.push(i);
          return timeArr;
        });
        this.searchData.startTime = timeArr[0];
        this.searchData.endTime = timeArr[1];
      }

      this.getNotesDetailsData();
    },

    // 清空
    clearSearch() {
      this.searchData.userName = '';
      this.searchData.mobile = '';
      this.searchData.chapterId = '';
      this.selectTimes = '';
      this.searchData.startTime = '';
      this.searchData.endTime = '';
      this.chapterName = '';
      this.searchData.chapterId = '';
      this.getNotesDetailsData();
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 导出
    async onExport() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少勾选一条数据！');
      } else {
        const ids = [];
        this.multipleSelection.map(i => {
          ids.push(i.id);
          return ids;
        });
        const res = await exportNotesDetails(ids);
        if (res.code !== 200) return Promise.reject();
        const url = res.msg;
        if (url) {
          window.open(url, '_self');
          this.getNotesDetailsData();
        }
      }
    },

    // 分页
    handleSizeChange(val) {
      this.searchData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getNotesDetailsData();
    },
  },
};
</script>

<style lang="less">
.notesDetails {
  padding: 30px;
  .timer {
    width: 450px;
  }
  .nickName {
    width: 200px;
  }
  .images {
    width: 80px;
    height: 80px;
  }
  .blockPage {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
