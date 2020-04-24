<template>
  <div class="content-container">
    <!-- 课程管理 - 查看资料 -->
    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="3">
        <el-input v-model="chapterId" placeholder="请输入章节ID"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="courseName" placeholder="请输入节名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="value" placeholder="是否有课件资料">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="2">
        <el-button type="info" @click="clearbtn">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getVideoList">查询</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <template>
      <el-table :data="tableData" style="margin-bottom:20px" border>
        <el-table-column label="章节ID" min-width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.chapterId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="节名称" min-width="315" align="center">
          <template slot-scope="scope">
            <p class="introduce">{{scope.row.sectionName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="课件资料" min-width="170" align="center">
          <template slot-scope="scope">
            <p v-for="value in scope.row.fileName" :key="value" class="introduce">{{value.split('-')[0]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150" align="center" prop="createTime">
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="downLoadFiles(scope.$index, scope.row)">下载</el-button>
            <el-button type="primary" @click.prevent="editMember(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 下载资料的弹窗 -->
    <el-dialog title="下载资料" :visible.sync="dialogVisible" width="30%">
      <el-checkbox-group v-model="checkedFiles">
        <el-checkbox v-for="(item,index) in filesList" :label="item" :key="index" class="center" style="display:block;margin-left:80px;">{{(item.name.split('-')[0])}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="loadSthFile">下 载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {downloadFile2} from "@/utils/index";
import { parseTime } from "@/utils";
import {videoFilesList, filesDownload} from '@/api/course'

export default {
  name: "CourseManageComments",
  components: {},
  data() {
    return {
      dialogVisible: false,
      // 文件列表
      filesList: [],
      // 选中文件
      checkedFiles: [],
      options: [
        {
          value: "2",
          label: "全部"
        },
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }
      ],
      value: "",
      selectedOptions: [],
      courseName: "",
      chapterId: "",
      tableData: [],
    };
  },
  mounted() {
    this.getVideoList();
  },
   watch: {
    $route: 'onRouteChange'
  },
  methods: {
    onRouteChange(to) { // 监听路由的变化
      if (to.name === 'CourseManageComments') {
        this.getVideoList();
      }
    },
    // 录播列表
    getVideoList () {
      videoFilesList({
        courseId: this.$route.params.id,
        chapterId: this.chapterId,
        sectionName: this.courseName,
        isHaveFile: this.value,
      }).then(res=>{
        console.log(res)
        this.tableData = res.result;
      });
    },

    clearbtn() {
      this.chapterId = "";
      this.courseName = "";
      this.value = "";
      this.getVideoList();
    },
    //查看
    editMember(val) {
      console.log(val)
      this.$router.push({
        name: "CourseManageCommentsDetails",
        query: { chapterId:val.chapterId,courseId:this.$route.params.id }
      });
    },
    // 弹窗的数据渲染
    downLoadFiles(index, row) {
      console.log(index, row);
      this.dialogVisible = true;
      filesDownload({
        chapterId:row.chapterId,
      }).then(res=> {
        console.log(res.result, '弹窗数据');
        this.filesList = res.result;
        console.log(this.filesList, '数据的列表数据');
      })
      
    },
    // 下载数据的接口
    loadSthFile() {
      console.log(this.checkedFiles);
      this.checkedFiles.forEach(item=> {
        downloadFile2(item.url,item.name);
      })
      this.checkedFiles = [];
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.content-container {
  .introduce {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
