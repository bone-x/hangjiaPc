<template>
  <div class="content-container">
    <!-- 课程管理 - 课程列表 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="3">
        <el-input v-model="inputNum" placeholder="请输入课程编号"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="inputName" placeholder="请输入课程名称"></el-input>
      </el-col>
      <!-- <el-col :span="3">
        <el-select v-model="value" placeholder="课程类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
      <el-col :span="3">
        <el-input v-model="inputHuman" placeholder="请输入创建人"></el-input>
      </el-col>
    </el-row>
    <!-- 信息按钮 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="2">
        <el-button type="info" @click="clearbtn">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getListData">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          @click="addCourseList"
          v-permission="['course:record:save']"
        >新增课程</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <template>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" :index="indexMethod" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" min-width="70" align="center"></el-table-column>
        <el-table-column prop="courseNo" label="课程编号" min-width="100" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" min-width="180" align="center"></el-table-column>
        <el-table-column prop="courseCatalog" label="课程目录" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createId" label="创建人" min-width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="120" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="120" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="180">
          <template slot-scope="scope">
            <div style="width:100%;height:30px;">
              <el-button
                size="mini"
                @click="handleChapter(scope.$index, scope.row)"
                v-permission="['course:record:input']"
              >目录</el-button>
              <el-button size="mini" @click="handledata(scope.$index, scope.row)">资料</el-button>
            </div>
            <div style="width:100%;height:30px;">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                v-permission="['course:record:update']"
              >修改</el-button>
              <el-button
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
                v-permission="['course:record:delete']"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px"></div>
    </template>
    <!-- 分页 -->
    <el-row :gutter="20">
      <el-col :span="20" style="display:flex;justify-content: center;">
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="10"
            :total="total"
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
    <!-- 新增课程弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增课程"
      width="30%"
      :before-close="addHandleClose"
    >
      <el-form ref="form" :model="form" label-width="80px" class="courseFrom">
        <el-form-item label="课程编号" required>
          <el-input v-model="form.num" placeholder="请输入课程编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名称" required>
          <el-input v-model="form.name" placeholder="请输入课程名称" maxlength="30"></el-input>
        </el-form-item>
        <!-- <el-form-item label="课程类型" required>
          <el-radio v-model="radio" label="0">录播</el-radio>
          <el-radio v-model="radio" label="1">直播</el-radio>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addCourseData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改课程弹窗 -->
    <el-dialog :visible.sync="dialogChange" title="修改课程" width="30%">
      <el-form ref="newform" :model="newform" label-width="80px" class="courseFrom">
        <el-form-item label="课程编号" required>
          <el-input v-model="newform.newnum" placeholder="请输入课程编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名称" required>
          <el-input v-model="newform.newname" placeholder="请输入课程名称" maxlength="30"></el-input>
        </el-form-item>
        <!-- <el-form-item label="课程类型" required>
          <el-radio v-model="newradio" label="1">录播</el-radio>
          <el-radio v-model="newradio" label="2">直播</el-radio>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChange = false">取 消</el-button>
        <el-button type="primary" @click="changeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCourseList,
  addCourse,
  deleteCourse,
  changeCourse,
  detailsCourse,
  autoCourseNum,
} from "@/api/course";

export default {
  name: "CourseManageRecord",
  components: {},
  data() {
    return {
      inputNum: "",
      inputName: "",
      inputHuman: "",
      options: [
        {
          value: "0",
          label: "录播"
        },
        {
          value: "1",
          label: "直播"
        }
      ],
      value: "",
      valueSelect: "",
      tableData: [
        {
          date: "1",
          name: "王小虎",
          address: "上海"
        },
        {
          date: "2",
          name: "王小虎",
          address: "上海"
        }
      ],
      multipleSelection: [],
      delarr: [], // 存放删除的数据
      currentPage: 1,
      total: 7,
      dialogVisible: false,
      dialogChange: false,
      form: {
        name: "",
        num: ""
      },
      // radio: "1",
      newform: {
        newname: "",
        newnum: ""
      },
      newradio: "1",
      changeIds: "" // 修改ID
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    // 获取列表的数据--查询
    getListData() {
      const params = {
        courseNo: this.inputNum,
        courseName: this.inputName,
        courseType: 2, // 暂时只有录播所以写死啦
        creator: this.inputHuman,
        pageNum: this.currentPage,
        pageSize: 10
      };
      getCourseList(params).then(res => {
        this.tableData = res.result.list;
        this.total = Number(res.result.totalCount);
      });
    },

    // 序号
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * 10;
    },
    // 支持多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getListData();
    },
    clearbtn() {
      this.inputNum = "";
      this.inputName = "";
      this.inputHuman = "";
      this.value = "";
      this.valueSelect = "";
      this.getListData();
    },
    // 录入目录
    handleChapter(index, row) {
      this.$router.push({
        name: "CourseManageLecturers",
        params: { id: row.id }
      });
    },
    // 查看资料
    handledata(index, row) {
      this.$router.push({
        name: "CourseManageComments",
        params: { id: row.id }
      });
    },
    // 修改获取数据
    handleEdit(index, row) {
      this.changeIds = row.id;
      this.dialogChange = true;
      detailsCourse({ id: row.id }).then(res => {
        console.log(res, "修改获取数据");
        this.newform.newnum = res.result.courseNo;
        this.newform.newname = res.result.courseName;
      });
    },

    // 确认修改
    changeSubmit() {
      if (!this.newform.newnum) {
        this.$message({
          type: "warning",
          message: "请输入课程编号"
        });
      } else if (!this.newform.newname) {
        this.$message({
          type: "warning",
          message: "请输入课程名称"
        });
      } else {
        const option = {
          courseNo: this.newform.newnum,
          courseName: this.newform.newname,
          courseType: 2,
          id: this.changeIds
        };
        changeCourse(option).then(res => {
          console.log(res, "确认修改");
          this.dialogChange = false;
          this.getListData();
        });
      }
    },

    // 删除
    handleDelete(index, row) {
      // 禁止删除操作-- 后端处理
      this.$confirm('此操作将删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           const option = {
        id: row.id
      };
      deleteCourse(option).then(res => {
        this.getListData();
        this.$message({
            type: 'success',
            message: '删除成功!'
          });
      });
        }).catch((error) => {
            console.log(error)     
        });
    },

    // 新增课程弹窗
    addCourseData() {
      if (!this.form.num) {
        this.$message({
          type: "warning",
          message: "请输入课程编号"
        });
      } else if (!this.form.name) {
        this.$message({
          type: "warning",
          message: "请输入课程名称"
        });
      } else {
        const option = {
          courseName: this.form.name,
          courseNo: this.form.num,
          courseType: 2,
        };
        addCourse(option).then(res => {
          console.log(res);
          this.dialogVisible = false;
          this.getListData();
          this.from.num = "";
          this.form.name = "";
        });
      }
    },
    // 取消弹窗
    addHandleClose() {
      this.form.num = "";
      this.form.name = "";
      this.dialogVisible = false;
    },
    // 新增章
    addCourseList() {
      this.dialogVisible = true;
      autoCourseNum().then(res=> {
        this.form.num = res.result;
      })
    }
  }
};
</script>

<style scoped lang='less'>
.content-container {
  .block {
    margin: auto;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
