<template>
  <div class="content-container">
    <!-- 课程管理 - 课程档案 - 新增节 -->
    <div style="width:30%;">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="节名称" required>
          <el-input v-model="ruleForm.soptName" placeholder="请输入节名称" maxlength="30"></el-input>
        </el-form-item>
        <!-- hover -->
        <el-popover
          ref="popover1"
          placement="top-start"
          title="视频标题:"
          width="200"
          trigger="hover"
          :content="this.videoListData.title">
        </el-popover>
        <el-form-item label="视频" required>
          <el-button v-show="this.videoListData.title" size="medium" class="text-p" v-popover:popover1>{{this.videoListData.title}}</el-button>
          <el-button
            icon="el-icon-upload"
            size="medium"
            style="margin-left: 10px;"
            @click="dialogVisible = true"
          >点击选择视频</el-button>
        </el-form-item>
        <el-form-item label="课件资料">
          <div>
            <upload-file @successCBK="UploadSuccess">
              <el-button v-if="fileList.length===0" size="medium" type="primary">上传资料</el-button>
              <el-button v-else size="medium" type="primary">继续上传</el-button>
            </upload-file>
          </div>
          <div v-for="(item,index) in fileList" :key="index">
            <el-button class="files-name">{{(item.name.split("-")[0])}}</el-button>
            <el-button type="danger" size="mini" @click="removeData(index)">删除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="是否试听">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="ruleForm.rank" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="视频列表" :visible.sync="dialogVisible" width="80%" >
      <el-row :gutter="20">
        <!-- 视频列表 -->
        <el-col :span="8" style="height:500px;overflow:auto;">
          <el-tree :data="videoTree" :props="defaultProps"  default-expand-all @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="16">
          <el-table :data="tableData" style="width: 100%;" border  highlight-current-row @current-change="tableCurrentChange">
            <el-table-column type="index" :index="indexMethod" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="title" label="视频名称" min-width="180"></el-table-column>
            <el-table-column prop="duration" label="时长" min-width="100"></el-table-column>
            <el-table-column prop="mp4" label="视频链接" min-width="180"></el-table-column>
            <el-table-column prop="ptime" label="上传时间" min-width="180"></el-table-column>
            <el-table-column prop="first_image" label="封面" min-width="180"></el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-row :gutter="20">
            <el-col :span="20" style="display:flex;justify-content: center;margin-top: 20px;">
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
           <div class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import uploadSingle from "@/components/Upload/single";
import uploadFile from "@/components/UploadPicture/uploadFile";
import { addSectionData, videoOptionType, videoOptionList } from "@/api/course";

export default {
  name: "CoursesRecordDir",
  components: {
    uploadSingle,
    uploadFile
  },
  data() {
    return {
      videoTree: [],
      defaultProps: {
        children: "nodes",
        label: "text"
      },
      tableData: [],
      ruleForm: {
        spotName: "",
        resource: "0",
        rank: ""
      },
      newfeatureVideo: "",
      fileList: [],
      dialogVisible: false,
      currentPage: 1,
      total: 1,
      // 传视频的数据
      data: {},
      // 视频选中数据
      videoListData: {},
    };
  },
  created() {
    this.getVideoList();
    // 回显视频列表
    console.log(JSON.parse(sessionStorage.getItem('data')))
    if (JSON.parse(sessionStorage.getItem('data')) != undefined) {
      console.log(1);
        videoOptionList({
        catatree: JSON.parse(sessionStorage.getItem('data')).catatree,
        page: this.currentPage,
        limit: 10,
        total: Number(JSON.parse(sessionStorage.getItem('data')).videos),
      }).then(res=> {
        console.log(res);
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
        this.data = JSON.parse(sessionStorage.getItem('data'));
      })
    }
  },
  methods: {

    // 获取保利威视的视频
   getVideoList () { 
        // 列表数据
      const loop = list => {
        list.map(val => {
          val.text = val.text.replace(/<[^>]+>|&[^>]+;/g,"").trim();
          if (val.nodes) {
            loop(val.nodes);
          }
          return val;
        });
      };
      console.log(loop, 'loop')
       videoOptionType().then(res => {
         console.log(res.result[0].nodes, '视频的列表数据');
        loop(res.result[0].nodes);
        
        this.videoTree = res.result[0].nodes;
      });
    },
    // 提交
    submitForm() {
      console.log(this.data, '提交时候的data')
       if (!this.ruleForm.soptName) {
        this.$message({
          type: 'warning',
          message: '请输入节名称'
        })
      } else if (this.data.catatree===undefined) {
        this.$message({
          type: 'warning',
          message: '请选择视频'
        })
      } else if (!this.ruleForm.rank) {
         this.$message({
          type: 'warning',
          message: '请输入排序'
        })
      } else {
      const option = {
        courseId: this.$route.query.courseId,
        courseRecord: {
          duration: this.videoListData.duration,
          firstImage: this.videoListData.first_image,
          ptime: this.videoListData.ptime,
          vid: this.videoListData.vid,
          videoName: this.videoListData.title,
          cataTree: this.data.catatree,
          total: this.data.videos,
        },
        fileList:this.fileList,
        isListen: this.ruleForm.resource,
        name: this.ruleForm.soptName,
        orderNum: this.ruleForm.rank,
        parentId: this.$route.query.chapterId
      };
      addSectionData(option).then(res => {
        console.log(res);
        this.$router.go(-1);
        this.$store.dispatch("delView", this.$route);
      });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    },

    // 上传视频回调
    handleNodeClick(data) {
      this.data = data;
      // 放到缓存中
      sessionStorage.setItem('data', JSON.stringify(data));
      console.log(this.data ,'回调数据里面的catatree')
      videoOptionList({
        catatree: this.data.catatree,
        page: this.currentPage,
        limit: 10,
        total: Number(this.data.videos),
      }).then(res=> {
        console.log(res);
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      })
    },

    // 序号
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * 10;
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.handleNodeClick(this.data);
    },

    // 列表的单选回调
    tableCurrentChange(val) {
      console.log(val)
      this.videoListData = val;
      console.log(this.videoListData, '单选后的数据')
      this.$message({
        type: 'success',
        message: '选中数据成功'
      })
    },

    // 删除
    removeData(index) {
      this.fileList.splice(index, 1);
    },
    // 成功上传到oss
    UploadSuccess(res, file) {
      console.log(res, file, "回掉成功拉");
      if (this.fileList.length < 5) {
        this.fileList.push(file);
        this.fileList = this.fileList.map(o=>{
          return{
          url:o.ossUrl || o.url,
          suffix:o.name.substr(o.name.indexOf(".")+1),
          size:o.size,
          name:o.name,
          }});
        console.log(this.fileList, "资料的数据");
      } else {
        this.$message({
          type: "warning",
          message: "上传的资料最多只能上传5个"
        });
      }
    }
  }
};
</script>

<style <style lang="less" scoped>
.files-name {
  width: 130px;
  background: #f7f7f7;
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.text-p {
  width: 200px;
  white-space: nowrap;   //强制一行显示
  text-overflow: ellipsis;   //溢出文本时显示省略标记
  overflow: hidden;
}
</style>



 
