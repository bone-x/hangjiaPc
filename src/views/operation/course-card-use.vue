<template>
  <div class="content-container">
    <!-- 运营管理 - 听课卡列表 - 发放-->
    <h4>听课卡信息</h4>
    <div class="courseCard">
      <el-row :gutter="20" class="elRow">
        <el-col :span="6" :offset="1"><span class="lable">听课卡名称:</span> {{courseResult.cardName}}</el-col>
        <el-col :span="6"><span class="lable">每人限领:</span> {{courseResult.isPerUnlimited===0?"限领":"不限领"}}</el-col>
      </el-row>
      <el-row :gutter="20" class="elRow">
        <el-col :span="6" :offset="1"><span class="lable">适用范围:</span> {{courseResult.priceRangeLow}}~{{courseResult.priceRangeHigh}}元</el-col>
        <el-col :span="6"><span class="lable">有效时间:</span> {{courseResult.effectiveTimeStart}}～{{courseResult.effectiveTimeEnd}}</el-col>
      </el-row>
      <el-row :gutter="20" class="elRow">
        <el-col :span="6" :offset="1"><span class="lable">发放数量:</span> {{courseResult.isCountUnlimited===0?"限量":"不限量"}}</el-col>
        <el-col :span="6"><span class="lable">可用时长:</span> {{courseResult.avaibilePeriod}}天</el-col>
      </el-row>
      <el-row :gutter="20" class="elRow">
        <el-col :span="6" :offset="1"><span class="lable">备注:</span> {{courseResult.cardRemark}}</el-col>
      </el-row>
    </div>
  <h4>听课卡发放</h4>
  <el-row :gutter="20">
     <el-col :span="1.5" :offset="1"><span class="remark">发放对象：</span></el-col>
    <el-radio-group v-model="radio">
    <el-col :span="20"  class="radio">
       <el-radio :label="1">所有指定用户</el-radio>
    </el-col>
    <el-col :span="20"  class="radio">
       <el-radio :label="2">指定用户 
         <span class="spanUser" @click="onOpenSelectLecturerWindow">选择发送对象</span> 
         <div
            v-show="radio == 2"
            :class="{ active: ruleForm.goodsLecturer.length > 0 }"
            class="input-box"
            ><el-tag
            style="margin:0 5px;"
            v-for="(tag,index) in ruleForm.goodsLecturerName"
            :key="index"
            :type="tag.type">
            {{tag }}
          </el-tag></div>
          </el-radio>
    </el-col>
    <el-col :span="20"  class="radio">
       <el-radio :label="3">批量导入用户 
         <div style="margin-bottom:10px"></div>
         <div v-show="radio == 3"><a href="javascript:;" class="file">{{msg.name}}</a>
         <div style="margin-bottom:10px"></div>
          <input type="file"  name="file1" accept=".xlsx, .xls" @change="onchangeSuccess"/>
          <button type="submit" class="button" @click="loadExcelTable">下载表格模板</button>
          <!-- <form enctype="multipart/form-data" method="post"></form> -->
          </div>
       </el-radio>  
    </el-col>
    </el-radio-group>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="1.5" :offset="1"><span class="remark">发放备注：</span></el-col>
    <el-col :span="6">
      <el-input type="textarea" v-model="remark" placeholder="输入听课卡备注信息" maxlength="100"></el-input>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="padding-top:30px">
    <el-col :span="1.5" :offset="2"><el-button type="primary" @click="provideCourseData">发放</el-button></el-col>
  </el-row>
  <!-- 指定用户弹窗 -->
   <el-dialog
        :visible.sync="state.isShowLecturerWindow"
        title="选择发送对象"
        width="700px"
        custom-class="dialog-window"
        @close="onLectureWindowClose"
        @open="onLectureWindowOpen"
      >
        <el-form ref="select-course-form" :model="selectLecturerForm">
          <!-- filter -->
          <el-row :gutter="20">
            <el-col :span="16">

              <el-row type="flex" align="middle">
                <el-col :span="4">
                  <label style="display: inline-block;" for="dialog-lecturerName">用户名：</label>
                </el-col>
                <el-col :span="7">
                  <el-input
                    id="dialog-lecturerName"
                    v-model="selectLecturerForm.lecturerName"
                    placeholder="请输入用户名"
                  ></el-input>
                </el-col>

                <el-col :span="4">
                  <label style="display: inline-block;margin-left:10px;" for="dialog-lecturerName">手机号：</label>
                </el-col>
                <el-col :span="9">
                  <el-input
                    id="dialog-lecturerName"
                    v-model="selectLecturerForm.lecturerPhone"
                    placeholder="请输入手机号"
                  ></el-input>
                </el-col>
              </el-row>

            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12" center>
                  <el-button type="primary" @click.native="getQueryDataList">查询</el-button>
                </el-col>
                <el-col :span="12" center>
                  <el-button @click.native="clearData">清空</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- table -->
          <el-table
            ref="lecturer-table"
            :data="selectLecturerForm.list"
            current-row-key="userId"
            row-key="userId"
            max-height="400"
            border
            size="small"
            style="margin-top: 30px;"
          >
            <el-table-column width="50" align="center">
              <template slot="header" slot-scope="scope">
                <el-checkbox
                  v-model="selectLecturerForm.isSelectAll"
                  @change="val => { onSelectLecturerCheckBox(selectLecturerForm.list, val, true) }"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked"
                  @change="val => { onSelectLecturerCheckBox([scope.row], val) }"
                ></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column width="50" type="selection" align="center"></el-table-column> -->
            <el-table-column prop="nickName" width="200" label="用户名"></el-table-column>
            <el-table-column prop="mobile" min-width="150" label="手机号"></el-table-column>
          </el-table>
          <!-- pagination -->
          <el-row style="margin-top: 20px;">
            <el-col :span="24" center>
              <el-pagination
                :current-page.sync="selectLecturerForm.currPage"
                :page-size="selectLecturerForm.pageSize"
                :total="selectLecturerForm.totalCount"
                background
                layout="prev, pager, next, jumper"
                @current-change="getLecturerList(selectLecturerForm.currPage)"
              ></el-pagination>
            </el-col>
          </el-row>

          <!-- selected list -->
          <div class="lecturer-window-selected">
            <el-row :gutter="20" type="flex" align="top">
              <el-col :span="4">已选中：</el-col>
              <el-col :span="20">
                <el-tag
                  v-for="tag in selectLecturerForm.selectedItemsBackups"
                  :key="tag.$key"
                  closable
                  type="info"
                  @close="onRemoveSelectedLecturerItem(tag)"
                >{{ tag.nickName+tag.mobile }}</el-tag>
              </el-col>
            </el-row>
          </div>

          <!-- foolter -->
          <el-row
            :gutter="20"
            type="flex"
            align="middle"
            justify="center"
            style="margin-top: 30px;"
          >
            <el-col :span="6" center>
              <el-button @click.native="state.isShowLecturerWindow = false">取消</el-button>
            </el-col>
            <el-col :span="6" center>
              <el-button type="primary" @click.native="onLecturerWindowConfirm">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import {getCourseCardId, provideCourseCardList, provideCourseCardObj, provideCourseCardImport, provideImportExcel} from "@/api/operation";
import { formatDate } from "@/utils/index";
// import {
//   getLecturerList,
// } from "@/api/goods";

export default {
  name: "OperationCourseCardUse",
  components: {
  },
  data() {
    return {
       msg: {},
       radio: 1,
       remark: '',
       ruleForm: {
         goodsLecturer: [],
         goodsLecturerName: ""
       },
        selectLecturerForm: {
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
        paramsStr: "",
        lecturerName: "",
        lecturerPhone: "",
        list: [{
          userId:'123123',
          lecturerName: 'asda'
        },
        {
          userId:'6666',
          lecturerName: '7777' 
        }],
        isSelectAll: false,
        selectedVal: "",
        selectedItems: [],
        selectedItemsBackups: [],
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 10
      },
      state: {
        isShowLecturerWindow: false,
        onCloseLectureWindowType: null
      },
      courseResult:{},
      fileId: "", // 导入文件ID
    };
  },
  created() {
    this.getCourseData();
    this.getLecturerList();
  },
  methods: {
    // 获取听课卡的数据
    getCourseData() {
      const params = {
        courseCardId: this.$route.params.id,
      }
      getCourseCardId(params).then(res => {
        console.log(res, '获取听课卡的数据');
        this.courseResult = res.result;
      })
    },

    // 获取弹窗数据
    async getLecturerList() {
      const options = {
        pageNum: this.selectLecturerForm.currPage,
        pageSize:5,
        mobile: this.selectLecturerForm.lecturerPhone,
        nickName: this.selectLecturerForm.lecturerName
      };
      const jsonParams = JSON.stringify(options);
      if (this.selectLecturerForm.paramsStr === jsonParams) {
        return Promise.resolve();
      }
      this.selectLecturerForm.paramsStr = jsonParams;

      // 发起请求
      const res = await provideCourseCardObj(options);
      if (res.code !== 200) return Promise.reject();

      // 数据填充
      this.selectLecturerForm.list = res.result.list.map(i => {
        i.$key = i.userId;
        i.checked = false;

        this.selectLecturerForm.selectedItemsBackups.forEach(j => {
          if (i.userId === j.userId) {
            i.checked = true;
          }
        });

        return i;
      });

      // 是否显示全选
      this.selectLecturerForm.isSelectAll = !this.selectLecturerForm.list.some(
        i => !i.checked
      );

      // this.selectLecturerForm.currPage = res.result.currPage;
      // this.selectLecturerForm.pageSize = res.result.pageSize;
      this.selectLecturerForm.totalPage = res.result.totalPage;
      this.selectLecturerForm.totalCount = res.result.totalCount;

      this.$nextTick(() => {
        if (this.$refs["lecturer-table"]) {
          this.$refs["lecturer-table"].bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 监听打开讲师弹窗事件
    onOpenSelectLecturerWindow() {
      this.state.isShowLecturerWindow = true;
    },

    // 选择讲师弹窗 - 【单选 or 全选】
    onSelectLecturerCheckBox(selection, isSelect, isAll) {
      if (isAll) {
        console.log('全选状态')
        selection.forEach(i => {
          i.checked = isSelect;
        });
      }

      if (isSelect) {
        console.log('单选')
        this.selectLecturerForm.selectedItemsBackups = _.uniqBy(
          [...this.selectLecturerForm.selectedItemsBackups, ...selection],
          "userId"
        );
      } else {
        this.selectLecturerForm.selectedItemsBackups = _.differenceBy(
          this.selectLecturerForm.selectedItemsBackups,
          selection,
          "userId"
        );
      }
      const isSelectAll = this.selectLecturerForm.list.every(i => !!i.checked);
      this.selectLecturerForm.isSelectAll = isSelectAll;
    },

    // 选择讲师弹窗 - 确定
    onLecturerWindowConfirm() {
      const newSelectedItems = [
        ...this.selectLecturerForm.selectedItemsBackups
      ];
      this.ruleForm.goodsLecturer = newSelectedItems;
      this.selectLecturerForm.selectedItems = newSelectedItems;
      console.log(this.selectLecturerForm.selectedItems, '选择的数据按时大大')
      this.ruleForm.goodsLecturerName = newSelectedItems
        .map(i => i.nickName.trim()+i.mobile.trim())
        
        console.log(this.ruleForm.goodsLecturerName, '输出的数据')
      this.state.isShowLecturerWindow = false;
      this.state.onCloseLectureWindowType = 200;
    },

    // 选择讲师弹窗 - 删除一个已选中项
    onRemoveSelectedLecturerItem(item) {
      this.selectLecturerForm.list.some(i => {
        if (i.userId === item.userId) {
          i.checked = false;
          return true;
        }
        return false;
      });
      this.selectLecturerForm.selectedItemsBackups = _.differenceBy(
        this.selectLecturerForm.selectedItemsBackups,
        [item],
        "userId"
      );
    },

    // 选择讲师弹窗 - 打开
    onLectureWindowOpen() {
      this.state.onCloseLectureWindowType = null;
      this.selectLecturerForm.selectedItemsBackups = [
        ...this.selectLecturerForm.selectedItems
      ];
      let isSelectAll = false;

      this.selectLecturerForm.list.forEach(i => {
        i.checked = false;
        isSelectAll = false;
        this.selectLecturerForm.selectedItemsBackups.forEach(j => {
          if (i.userId === j.userId) {
            i.checked = true;
            isSelectAll = true;
          }
        });
      });

      // 是否显示全选
      this.selectLecturerForm.isSelectAll = isSelectAll;
      console.log(isSelectAll, '是否全选')
    },

     // 选择讲师弹窗 - 关闭
    onLectureWindowClose() {
      if (!this.state.onCloseLectureWindowType) {
        this.selectLecturerForm.selectedItemsBackups = [...this.selectLecturerForm.selectedItems];
      }
    },

    // 导入Excel
    onchangeSuccess(event) {
      const file = event.target.files[0];
      console.log(file)
      const formData = new FormData();
      formData.append("file", file);
      const params = formData

      provideCourseCardImport(params,this.fileId).then( res =>{
        console.log(res, '导入Excel')
        this.$message({
          type:'success',
          message:'导入成功'
        })
        this.fileId = res.fileId;
      })   
    },

    // 导出模板
    async loadExcelTable() {
      const res = await provideImportExcel();
      if (res.code != 200) return Promise.reject();
      if (res.url) {
        window.open(res.url, '_self');
      }
    },

    // 发放听课卡
  provideCourseData() {
    const option = {
      cardId: this.$route.params.id,
      sendType: this.radio,
      remark:  this.remark || "",
      studentList: this.selectLecturerForm.selectedItems,
      fileId: this.fileId
    }
    provideCourseCardList(option).then(res => {
       if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '发放成功!'
            });
        this.$router.go(-1);
        this.$store.dispatch("delView", this.$route);
       }
    })
  },

  clearData() {
    this.selectLecturerForm.lecturerName = "";
    this.selectLecturerForm.lecturerPhone = "";
  },

// 查询-弹窗
  getQueryDataList() {
  this.selectLecturerForm.currPage = 1;
   this.getLecturerList(); 
  }
  }
};
</script>

<style scoped lang="scss">
.courseCard {
  margin-bottom: 30px;
  .lable {
    font-size: 16px;
    color: #606266;
    font-weight: 700;
    margin-right: 20px;
  }
  .elRow {
    margin-bottom: 20px;
  }
}
.remark {
  font-size: 16px;
    color: #606266;
    font-weight: 700;
    margin-right: 20px;
    float: left;
}
  .input-box {
    width: 600px;
    height: 50px;
    line-height: 100%;
    padding: 5px 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    color: #ccc;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    background-color: #fff;
    cursor: pointer;
    user-select: none;
    &.active {
      color: #333;
      border-color: #67c23a;
    }
  }
  .radio {
    margin-bottom: 30px;
  }
  .button {
    padding: 5px 10px;
    margin: 0 10px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .spanUser {
    color: #409EFF;
    text-decoration: underline;
    display: inline-block;
    margin-bottom: 20px;
    margin-left: 20px;
  }
</style>