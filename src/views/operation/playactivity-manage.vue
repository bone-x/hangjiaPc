<template>
    <!-- 运营管理 - 头部玩家活动管理 -->
   <div class="content-container">
       <h3>获奖结果上传</h3>
        <input type="file"  name="file" accept=".xlsx, .xls" @change="onchangeSuccess"/><button class="button" @click="uploadExcelResult">确认上传</button>
        <button type="submit" class="button" @click="loadExcelTable">点击下载表格模板</button>
        <h3>反馈管理</h3>
        <el-row :gutter="20" style="margin-bottom:50px;">
            <el-col :span="1.5" style="line-height:36px;height:36px;display:inline-block;">审核状态:</el-col>
            <el-col :span="4">
                <el-select v-model="value" placeholder="请选择" @change="getPlayList">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
       
    <el-table :data="tableData" border >
      <el-table-column prop="id" label="序号" width="100" align="center"></el-table-column>
      <el-table-column prop="content" label="反馈内容" align="center" min-width="200"></el-table-column>
      <el-table-column prop="userName" label="用户昵称" align="center">
      </el-table-column>
      <el-table-column prop="phoneNum" label="手机号" align="center"></el-table-column>
      <el-table-column prop="createTime" label="反馈时间" align="center" min-width="120"></el-table-column>
      <el-table-column prop="checkStatus" label="状态" align="center">
        <template slot-scope="scope">
              <span v-if="scope.row.checkStatus === 1">待审核</span>
              <span v-if="scope.row.checkStatus === 3">反馈成功</span>
              <span v-if="scope.row.checkStatus === 2">反馈失败</span>
            </template>
      </el-table-column>
      <el-table-column prop="number" label="操作" align="center">
          <template slot-scope="scope">
          <el-button
              v-if="scope.row.checkStatus===1"
              type="primary"
              plain
              @click="checkList(scope.row.id)"
            >审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20" style="font-size:14px;margin-top:10px;">
        <el-col :offset="20" :span="6"><span class="page">共{{(totalCount%10>=1)?(parseInt(totalCount/10)+1):(totalCount/10)}}页</span><span class="page">{{totalCount}}条记录</span></el-col>
    </el-row>

     <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col style="display:flex;justify-content:center">
        <el-pagination
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="onpageNumChange"
        ></el-pagination>
      </el-col>
    </el-row>

<!--点击审核出现的弹窗部分-->
      <el-dialog
        :visible.sync="centerDialogVisible"
        title="提示"
        width="30%"
        center
        @close="closeDialog"
      >
        <el-form>
          <el-form-item>
            <template>
              <el-radio v-model="radio" label="0" >通过</el-radio>
              <el-radio v-model="radio" label="1" >驳回</el-radio>
            </template>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center;">
             <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="promiseChioce">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

   </div>
</template>

<script>
import { headPlayGetUpload, headPlayImportExcel, getHeadPlayListData, checkSure, uploadExcelData} from "@/api/operation";
// import { formatDate } from "@/utils/index";



export default {
  name: "OperationPlayActivityManage",
  components: {},
  data() {
   return {
    tableData:[],
    radio:'0',
    centerDialogVisible:false,
    closeDialog:false,
      options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '待审核'
        }, {
          value: '3',
          label: '反馈成功'
        }, {
          value: '2',
          label: '反馈失败'
        }],
        value: '0',
        pageNum:1,
        pageSize:10,
        totalCount:10,
        fileId: '',
        Id:'', // 用户ID
   };
  },
  created() {
    this.getPlayList();
  },
  methods: {
      // 获取列表的数据
      getPlayList() {
        const params = {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          checkStatus:this.value==='0'?'':this.value,
        }
        getHeadPlayListData(params).then(res =>{
          console.log('投完列表破数据', res)
          this.tableData = res.result.list;
          this.totalCount = res.result.totalCount;
        })
      },

      // 分页
      onpageNumChange(val) {
          this.pageNum = val;
          this.getPlayList();
      },

      // 弹窗点击事件
      checkList(id) {
          this.centerDialogVisible = true;
          this.Id = id;
      },

      // 弹窗确认通过
      promiseChioce() {
        const options = {
          id: this.Id,
          pass: this.radio==='0'?true:false,
        }
        checkSure(options).then(res =>{
          console.log(res)
          if (res.code = 200) {
            this.centerDialogVisible = false;
            this.getPlayList();
          }
        })
      },

      // 导入Excel
    onchangeSuccess(event) {
      const file = event.target.files[0];
      console.log(file)
      const formData = new FormData();
      formData.append("file", file);
      const option = formData;
      headPlayGetUpload(option, this.fileId).then( res =>{
        console.log(res, '导入Excel')
        if (res.code == 200) {
           this.$message({
          type:'success',
          message:'导入成功'
        })
        this.fileId = res.result.fileId;
        }
      })   
    },

    // 导出列表的结果
    uploadExcelResult() {
      this.fileId&&uploadExcelData({fileId:this.fileId}).then(res=>{
         if (res.code == 200) {
           this.$message({
            type:'success',
            message:'上传Excel成功'
          })
         }
      })
    },
    
    // 导出模板
    async loadExcelTable() {
      const res = await headPlayImportExcel();
      if (res.code != 200) return Promise.reject();
      if (res.msg) {
        window.open(res.msg, '_self');
      }
    },

 }
}
</script>

<style scoped lang="scss">
    .button {
    padding: 5px 10px;
    margin: 0 10px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .page {
      width: 100px;
      text-align: center;
      display: inline-block;
  }
</style>