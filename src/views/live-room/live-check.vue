<!--
 * @Description: dont Edit
 * @Author: lujunan
 * @Date: 2019-07-31 09:22:34
 * @LastEditTime: 2019-08-05 16:50:02
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="content-container">
    <!-- 直播间管理 - 审核直播间 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="3">
        <el-input v-model="orgName" placeholder="请输入机构名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="courseName" placeholder="请输入课程名称"></el-input>
      </el-col>
      <el-col :span="1.1">
        <span class="status">审核状态:</span>
      </el-col>
      <el-col :span="3">
        <el-select v-model="value">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 信息按钮 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="2">
        <el-button type="info" @click="clearbtn">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getList" v-permission='["live:room:apply:select"]'>查询</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="50px" align="center" :index="indexMethod"></el-table-column>
      <el-table-column prop="orgName" label="申请机构" align="center"></el-table-column>
      <el-table-column prop="name" label="直播间名称" align="center"></el-table-column>
      <el-table-column  label="使用时间" align="center">
        <template slot-scope="scope">
            <p>{{scope.row.startTime}} - {{scope.row.endTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="purpose" label="直播用途" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
      <el-table-column prop="status" label="审核状态" align="center">
        <template slot-scope="scope">
            <p>{{scope.row.status === "PASSD" ? "通过" : (scope.row.status === "REJECT" ? "不通过": "审核中")}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请次数" align="center"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="getLookData(scope.row)" type="text" size="small" v-permission='["live:room:apply:edit"]'>查看</el-button>
          <el-button @click="checkData(scope.row)" type="text" size="small" :disabled="!Boolean(scope.row.status==='PROCESSING')">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24" style="text-align: center;">
        <el-pagination
          :current-page.sync="currPage"
          :page-size="pageSize"
          :total="totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="oncurrPageChange"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 查看弹窗 -->
    <el-dialog
      title="查看申请"
      :visible.sync="dialogLook"
      width="600px"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="申请机构" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入机构的名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="直播间的名称" prop="liveName">
          <el-input v-model="ruleForm.liveName" placeholder="请输入直播间的名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
               value-format="HH:mm:ss"
                type="fixed-time"
                placeholder="选择时间"
                v-model="ruleForm.date2"
                style="width: 100%;"
                disabled
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-form-item prop="date3">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date3"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date4">
              <el-time-picker
              value-format="HH:mm:ss"
                type="fixed-time"
                placeholder="选择时间"
                v-model="ruleForm.date4"
                style="width: 100%;"
                disabled
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="直播用途" prop="desc">
          <el-input type="textarea" placeholder="这里是直播用途的说明" v-model="ruleForm.desc" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请时间" >
          <p>{{ruleForm.applicateTime}}</p>
        </el-form-item>
        <el-form-item label="审核状态" prop="resource">
          <el-radio-group v-model="ruleForm.resource" disabled>
            <el-radio label="PASSD">通过</el-radio>
            <el-radio label="REJECT">不通过</el-radio>
            <el-radio label="PROCESSING">审核中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请次数" >
          <p>{{ruleForm.count}}</p>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="delivery" v-if="ruleForm.rejectReason.length">
          <p v-for="(item,index) in ruleForm.rejectReason" :key="index">
           {{item.rejectReason}}
          </p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogLook = false">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-radio v-model="radio" label="PASSD">通过</el-radio>
      <el-radio v-model="radio" label="REJECT">拒绝</el-radio>
      <el-input
        v-show="radio == 'REJECT'"
        type="textarea"
        v-model="rejectReason"
        placeholder="请输入拒绝的原因"
        style="margin-top:20px;"
        maxlength="100"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="checkSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckList, lookAbility, checkAbility } from "@/api/live-room.js";

export default {
  name: "LiveRoomCheck",
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        liveName: "",
        date1: "2018-10-02",
        date2: "12:45:44",
        date3: "",
        date4: "",
        resource: "1",
        desc: "",
        applicateTime: "",
        rejectReason: [],
        count: "",
      },
      // rules: {
      //   name: [{ required: true, message: "请输入机构的名称", trigger: "blur" }],
      //   liveName: [{ required: true, message: "请输入直播间的名称", trigger: "blur" }],
      //   date1: [
      //     {
      //       type: "date",
      //       required: true,
      //       message: "请选择日期",
      //       trigger: "change"
      //     }
      //   ],
      //   date2: [
      //     {
      //       type: "date",
      //       required: true,
      //       message: "请选择时间",
      //       trigger: "change"
      //     }
      //   ],
      //    date3: [
      //     {
      //       type: "date",
      //       required: true,
      //       message: "请选择日期",
      //       trigger: "change"
      //     }
      //   ],
      //   date4: [
      //     {
      //       type: "date",
      //       required: true,
      //       message: "请选择时间",
      //       trigger: "change"
      //     }
      //   ],
      //   resource: [
      //     { required: true, message: "请选择活动资源", trigger: "change" }
      //   ],
      //   desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      // },
      orgName: "",
      courseName: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        { value: "PASSD",
          label: "通过"
        },
        {
          label: "审核中",
          value: "PROCESSING"
        },
        {
          label: "不通过",
          value: "REJECT"
        }
      ],
      value: "",
      tableData: [{}],
      radio: "PASSD",
      rejectReason: "",
      dialogVisible: false,
      dialogLook: false,
      currPage: 1,
      pageSize: 10,
      totalCount: 10,
      applicateId: "", // 申请id
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 序号
    indexMethod(index) {
        return index + 1 + (this.currPage*this.pageSize - 10);
    },

    // 获取审核的列表数据
    getList() {
      const option = {
        orgName: this.orgName,
        name: this.courseName,
        status: this.value, // 注意状态后端的要求
        pageNum: this.currPage,
        pageSize: this.pageSize,
      }
      getCheckList(option).then(res =>{
        this.tableData = res.result.list;
        this.totalCount = res.result.totalCount;
      })
    },

    // 查看弹窗的数据
    getLookData(row) {
      this.dialogLook = true;
      lookAbility({id:row.id}).then(res =>{
        let result = res.result;
        this.ruleForm.name = result.orgLiveRoomApply.orgName;
        this.ruleForm.liveName = result.orgLiveRoomApply.name;
        this.ruleForm.date1 = result.orgLiveRoomApply.startTime.split(" ")[0];
        this.ruleForm.date2 = result.orgLiveRoomApply.startTime.split(" ")[1];
        this.ruleForm.date3 = result.orgLiveRoomApply.endTime.split(" ")[0];  
        this.ruleForm.date4 = result.orgLiveRoomApply.endTime.split(" ")[1];
        this.ruleForm.desc = result.orgLiveRoomApply.purpose;
        this.ruleForm.applicateTime = result.orgLiveRoomApply.createTime;
        this.ruleForm.resource = result.orgLiveRoomApply.status;
        this.ruleForm.count = result.orgLiveRoomApply.applyNum;
        this.ruleForm.rejectReason = result.refuseList;
      })
    },

    // 点击审核
    checkData(row) {
      this.dialogVisible = true;
      this.applicateId = row;
    },

    // 审核弹窗的确定
    checkSubmit() {
      const option = {
        createId: this.applicateId.createId,
        id: this.applicateId.id,
        rejectReason: this.rejectReason,
        status: this.radio,
      }
      checkAbility(option).then(res =>{
        console.log(res, '审核')
        this.$message({
          type: 'success',
          message: '审核成功',
        })
        this.dialogVisible = false;
        this.getList();
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogLook = false;
    },

    clearbtn() {
      this.orgName = "";
      this.courseName = "";
      this.value = "";
    },
    // 审核回调
    handleClose() {
      this.radio = "PASSD";
      this.dialogVisible = false;
    },
    // 分页
    oncurrPageChange(val) {
      this.currPage = val;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.status {
  -webkit-appearance: none;
  // background-color: #fff;
  background-image: none;
  border-radius: 4px;
  // border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  -o-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: center;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
