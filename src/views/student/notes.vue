<template>
  <div class="student_notes">
    <!-- 学员管理 - 学员笔记 -->
    <div class="notesList">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            v-model="studentList.goodsName"
            name="courseName"
            placeholder="请输入商品名称"
            type="text"
          ></el-input>
        </el-col>

        <el-col
          :span="2"
          style="text-align: center;"
        >
          <el-button
            type="primary"
            @click.native="checkStudent"
          >查询</el-button>
        </el-col>

        <el-col
          :span="2"
          style="text-align: center;"
        >
          <el-button
            type="danger"
            @click.native="clearSearch"
          >清空</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="studentData"
        border
        style="width: 100%; margin-top: 35px"
        :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
      >
        <el-table-column
          type="index"
          label="序号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="350"
        ></el-table-column>
        <el-table-column
          prop="noteUserNum"
          label="笔记人数"
        ></el-table-column>
        <el-table-column
          prop="noteNum"
          label="笔记数量"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="最近记录时间"
          width="250"
        >
          <template slot-scope="scope">
            <span>{{ timeFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <router-link :to="{ name: 'NotesDetails', params: { id: scope.row.courseId } }">
              <el-button
                v-permission="['stu:note:select']"
                type="primary"
              >查看</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page.sync="studentList.pageNum"
          :page-size="studentList.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotesList } from '@/api/student';
import { formatDate } from '@/utils/index';

export default {
  name: 'NotesList',
  components: {},
  data() {
    return {
      studentList: {
        goodsName: '',
        pageNum: 1,
        pageSize: 10,
      },
      totalCount: 10,
      totalPage: 10,
      studentData: [],
    };
  },
  created() {
    this.getNotesData();
  },
  methods: {
    timeFormat: formatDate, // 时间戳转化

    // 获取列表数据
    getNotesData() {
      getNotesList(this.studentList).then(res => {
        this.studentData = res.result.list;
        this.totalCount = Number(res.result.totalCount);
        this.totalPage = res.result.totalPage;
      });
    },

    // 查询
    checkStudent() {
      this.getNotesData();
    },

    // 清空
    clearSearch() {
      this.studentList.goodsName = '';
      this.getNotesData();
    },

    // 分页
    handleSizeChange(val) {
      this.studentList.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.studentList.pageNum = val;
      this.getNotesData();
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style lang="less">
.notesList {
  padding: 30px;
  .goodsName {
    width: 200px;
  }
  .block {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
