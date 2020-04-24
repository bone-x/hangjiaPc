<template>
  <div class="content-container">
    <!-- 课程管理 - 录入目录 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
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
       <el-col :span="3">
        <el-input v-model="chapterId" placeholder="请输入章节ID"></el-input>
      </el-col>
       <el-col :span="3">
        <el-input v-model="chapterName" placeholder="请输入章节名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="valueSelect" placeholder="是否支持试听">
          <el-option
            v-for="item in optionselect"
            :key="item.valueSelect"
            :label="item.label"
            :value="item.valueSelect"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="2"><el-button type="primary" @click="getCourseList">查询</el-button></el-col>
      <el-col :span="2"><el-button type="primary" @click="dialogVisible = true">新增章</el-button></el-col>
    </el-row>

    <!-- 列表 -->
    <ltreeTable
      :expandAll = "true"
      :data="tableData"
      :columns="columns"
      border
    ><el-table-column label="操作" fixed="right" width="300" align="left">
      <template slot-scope="scope">
         <el-button v-permission = "['course:record:save']" v-show="scope.row._level === 1" size="mini" type="info" @click.native="secondType(scope.$index, scope.row)">新增节</el-button>
        <el-button v-permission = "['course:record:update']" size="mini" @click="changesth(scope.$index, scope.row)">修改</el-button>
        <el-button v-permission = "['course:record:delete']" size="mini" type="danger" @click="delectData(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column></ltreeTable>

    <!-- 新增章弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="新增章" width="30%" :before-close="addHandleClose">
      <el-form ref="form" :model="form" label-width="80px" class="courseFrom">
         <el-form-item label="章名称:">
          <el-input v-model="form.charpterName" placeholder="请输入章名称" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="form.rank" placeholder="请输入排序" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" style="display:flex;justify-content:center;">
        <el-button @click.native="addHandleClose">取 消</el-button>
        <el-button type="primary" @click.native="chapterSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改章节弹窗 -->
    <el-dialog :visible.sync="dialogVisibleChange" title="修改章" width="30%" >
      <el-form ref="formChange" :model="formChange" label-width="80px" class="courseFrom">
         <el-form-item label="章名称:">
          <el-input v-model="formChange.charpterNameChange" placeholder="请输入章名称" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="formChange.rankChange" placeholder="请输入排序" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" disabled></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" style="display:flex;justify-content:center;">
        <el-button @click="dialogVisibleChange = false">取 消</el-button>
        <el-button type="primary" @click="changeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import ltreeTable from "@/components/treeLjtable/treetable.vue";
import { getCourseChapter, addChapterData, changeChapter, deleteChapter, addSectionData, changeSection } from "@/api/course";

export default {
  name: "CourseManageLecturers",
  components: {
    ltreeTable
  },
  data() {
    return {
      chapterIds: "",
      options: [
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }, 
      ],
      value: "",
      chapterId: "",
      chapterName: "",
      teachName: "",
      optionselect: [
        {
          valueSelect: "1",
          label: "是"
        },
        {
          valueSelect: "0",
          label: "否"
        }
      ],
      valueSelect: "",
      columns: [
        {
          text: "名称",
          value: "name"
        },
        {
          text: "时长",
          value: "duration"
        },
         {
          text: "是否支持试听",
          value: "$isListen"
        },
        {
          text: "章节",
          value: "$status"
        },
        {
          text: "排序",
          value: "orderNum"
        },
        {
          text: "视频名",
          value: "videoName",
          width: "300",
        },
        // {
        //   text: "文件名",
        //   value: "fileName",
        //   width: "200",
        // }
      ],
      tableData: [],
      currentPage: '1',
      total: '5',
      dialogVisible: false,
      dialogVisibleChange:false,
      form: {
        charpterName: "",
        rank: ""
      },
      formChange: {
        charpterNameChange: "",
        rankChange: "",
      },
    };
  },
  watch: {
    $route: 'onRouteChange'
  },
  mounted() {
    this.getCourseList();
  },
  methods: {
    onRouteChange(to) { // 监听路由的变化
      if (to.name === 'CourseManageLecturers') {
        this.getCourseList();
      }
    },
    // 新增章
    chapterSubmit() {
      if (!this.form.charpterName) {
        this.$message({
          type: 'warning',
          message: '请输入章名称'
        })
      } else if (!this.form.rank) {
        this.$message({
          type: 'warning',
          message: '请输入章排序'
        })
      } else {
      addChapterData({
        courseId: this.$route.params.id,
        name: this.form.charpterName,
        orderNum: this.form.rank,
      }).then(res=> {
        console.log(res, 'add');
        this.addHandleClose();
        this.getCourseList();
      })
      }
    },

    // 新增章的弹窗消失回调
    addHandleClose() {
      this.form.charpterName = "";
      this.form.rank = "";
      this.dialogVisible = false;
    },
    
    // 新增节
    secondType (index, row) {
      this.$router.push({ name: "CoursesRecordDir",query:{courseId:this.$route.params.id, chapterId:row.id}});
    },
    // 修改章或者节
    changesth (index, row) {
      this.chapterIds = row.id;
      // 修改章
      if (row._level == 1) {
        this.dialogVisibleChange = true;
        this.formChange.charpterNameChange = row.name;
        this.formChange.rankChange = row.orderNum;
      } else if(row._level == 2) {
      // 修改节
        this.$router.push({name: 'CourseManageCommentsDetails', query:{courseId:this.$route.params.id, chapterId:row.id}})
      }
    },

    // 确定修改章
    changeSubmit() {
       if (!this.formChange.charpterNameChange) {
        this.$message({
          type: 'warning',
          message: '请输入章名称'
        })
      } else if (!this.formChange.rankChange) {
        this.$message({
          type: 'warning',
          message: '请输入章排序'
        })
      } else {
      changeChapter({
        id: this.chapterIds,
        name: this.formChange.charpterNameChange,
      }).then(res=>{
        this.dialogVisibleChange = false;
        this.getCourseList();
      })
      }
    },

    // 删除章或者节
    delectData (index, row) {
       this.$confirm('此操作将删除该课程章/节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           const option = {
        id: row.id
      };
       deleteChapter({
        chapterId: row.id,
        courseId: this.$route.params.id, 
      }).then(res=>{
        this.getCourseList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
      }); 
        }).catch((error) => {
            console.log(error)     
        });
    },

    // 查询
    getCourseList () {
      const option = {
        courseId: this.$route.params.id,
        hasFile: this.value || null,
        chapterId: this.chapterId || null, 
        chapterName: this.chapterName || null,
        isListen: this.valueSelect || null,
      }
    getCourseChapter(option).then(res=> {
       const loop = list => {
        list.map(val => {
          if (val.type === 0) {
            val.$status = "章";
          } else if (val.type === 1) {
            val.$status = "节";
          }

        list.map(val=> {
          if (val.isListen === 0) {
            val.$isListen = '否';
          } else if (val.isListen === 1) {
            val.$isListen = '是';
          }
        })

          if (val.sectionList) {
            loop(val.sectionList);
          }
          return val;
        });
      };
        console.log(res,'获取列表的数据666');
        loop(res.result); 
        this.tableData = res.result;
      })
    },
  }
};
</script>

<style lang="less" scoped>
</style>
