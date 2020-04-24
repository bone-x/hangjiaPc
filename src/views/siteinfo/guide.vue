<template>
  <div class="content-container">
    <!-- 网站信息管理 - 新手指南 -->
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="search" placeholder="请输入问题关键字"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button v-permission = "['website:guide:select']" type="primary" @click="queryList">查询</el-button>
        </el-col>
        <el-col :span="2" :offset="14">
          <el-button v-permission = "['website:guide:save']" type="primary" class="newQuestion" @click="dialogVisible = true">新建问题</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格  -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="问题" width="220">
        <template slot-scope="scope">
          <p class="introduce">{{ scope.row.question }}</p>
        </template>
      </el-table-column>
      <el-table-column label="回答" width="300">
        <template slot-scope="scope">
          <p class="title">{{ scope.row.answer }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="问题分类">
        <template
          slot-scope="scope"
        >{{ scope.row.type =='1' ? ("注册登录") :(scope.row.type == '2'?"选购课程":(scope.row.type == '3'?"课程学习":"其他问题")) }}</template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ timeFormat(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">{{ timeFormat(scope.row.updateTime) }}</template>
      </el-table-column>
      <el-table-column  prop="updateUserName" label="修改人"  align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-permission = "['website:guide:update']" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button v-permission = "['website:guide:delete']" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20" class="rows">
      <el-col :span="12" :offset="6">
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 新建问题 -->
    <el-dialog :visible.sync="dialogVisible" title="新建问题" width="30%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="问题分类" prop="questype">
          <el-select v-model="ruleForm.questype" placeholder="请选择问题分类">
            <el-option label="注册登陆" value="1"></el-option>
            <el-option label="选购课程" value="2"></el-option>
            <el-option label="课程学习" value="3"></el-option>
            <el-option label="其他问题" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="question">
          <el-input v-model="ruleForm.question" placeholder="请输入问题，20字以内" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="回答" prop="type">
          <el-input
            v-model="ruleForm.type"
            type="textarea"
            placeholder="请输入问题，200字以内"
            maxlength="200"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="ruleForm.rank" placeholder="请输入排序" type="number" @keyup.native="handleInput" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20" class="rows">
            <el-col :span="12" :offset="6">
              <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改问题 -->
    <el-dialog :visible.sync="dialogChange" title="修改问题" width="30%">
      <el-form ref="changeForm" :model="changeForm" :rules="ruleschange" label-width="100px">
        <el-form-item label="问题分类" prop="questype">
          <el-select v-model="changeForm.questype" placeholder="请选择问题分类">
            <el-option label="注册登陆" value="1"></el-option>
            <el-option label="选购课程" value="2"></el-option>
            <el-option label="课程学习" value="3"></el-option>
            <el-option label="其他问题" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="question">
          <el-input v-model="changeForm.question" placeholder="请输入问题，20字以内" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="回答" prop="type">
          <el-input
            v-model="changeForm.type"
            type="textarea"
            placeholder="请输入问题，200字以内"
            maxlength="200"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="changeForm.rank" placeholder="请输入排序" type="number" @keyup.native="handleEditInput"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20" class="rows">
            <el-col :span="12" :offset="6">
              <el-button type="primary" @click="submitFormchange('changeForm')">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  createdList,
  changeList,
  deleteList
} from "@/api/siteinfo.js";
import { formatDate } from "@/utils/index";

export default {
  name: "SiteinfoGuide",
  components: {},
  data() {
    return {
      options: [
        {
          value: "1",
          label: "注册登录"
        },
        {
          value: "2",
          label: "选购课程"
        },
        {
          value: "3",
          label: "课程学习"
        },
        {
          value: "4",
          label: "其他问题"
        }
      ],
      Newvalue: "1",
      value: "",
      search: "",
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 10,
      dialogVisible: false,
      dialogChange: false,
      ruleForm: {
        questype: "",
        question: "",
        type: "",
        rank: ""
      },
      changeForm: {
        questype: "",
        question: "",
        type: "",
        rank: ""
      },
      rules: {
        questype: [
          { required: true, message: "请选择问题分类", trigger: "change" }
        ],
        question: [
          { required: true, message: "请输入问题，20字以内", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入回答，200字以内", trigger: "blur" }
        ],
        rank: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      ruleschange: {
        questype: [
          { required: true, message: "请选择问题分类", trigger: "change" }
        ],
        question: [
          { required: true, message: "请输入问题，20字以内", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入回答，200字以内", trigger: "blur" }
        ],
        rank: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      row: ""
    };
  },
  created() {
    this.getListdata();
  },
  methods: {
    timeFormat: formatDate, // 时间戳转化
    getListdata() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      getList(params).then(response => {
        // 列表数据
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        console.log(response);
      });
    },
    queryList() {
      // 查询操作
      const params = {
        type: this.value,
        question: this.search,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      getList(params).then(response => {
        // 重新拉取数据
        this.tableData = response.result.list;
        console.log(response);
      });
    },
    handleEdit(index, row) {
      this.row = row;
      console.log(row, 11111111);
      this.dialogChange = true;
      this.changeForm.questype = row.type + "";
      this.changeForm.question = row.question;
      this.changeForm.type = row.answer;
      this.changeForm.rank = row.sort;
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            id: row.id
          };
          deleteList(params).then(response => {
            console.log(response, "删除操作");
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getListdata();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListdata();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListdata();
      console.log(`当前页: ${val}`);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            answer: this.ruleForm.type,
            question: this.ruleForm.question,
            sort: this.ruleForm.rank,
            type: this.ruleForm.questype
          };
          createdList(data).then(response => {
            this.dialogVisible = false;
            this.$message({
              message: "新建成功",
              type: "success"
            });
            this.$refs[formName].resetFields();
            console.log(response);
            this.getListdata();
          });
        }
      });
    },
    submitFormchange(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            id: this.row.id,
            answer: this.changeForm.type,
            question: this.changeForm.question,
            sort: this.changeForm.rank,
            type: this.changeForm.questype + ''
          };
          changeList(data).then(response => {
            this.dialogChange = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
            console.log(response);
            this.getListdata();
          });
        }
      });
    },
    handleInput() {
      // 只能输入正整数正则
      this.ruleForm.rank = this.ruleForm.rank.replace(/[^\.\d]/g, '');
      this.ruleForm.rank = this.ruleForm.rank.replace('.', '');
    },
    handleEditInput() {
      this.changeForm.rank = this.changeForm.rank.replace(/[^\.\d]/g, '');
      this.changeForm.rank = this.changeForm.rank.replace('.', '');
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  margin-bottom: 20px;
}
.introduce {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 42px;
}
.rows {
  padding-top: 20px;
}
</style>
