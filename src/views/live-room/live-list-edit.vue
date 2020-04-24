<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-19 09:27:44
 * @LastEditTime: 2019-08-19 10:54:15
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-container">
    <!-- 直播间管理 - 修改直播间 -->
    <div style="width:500px;">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="直播间名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入直播间名称"></el-input>
        </el-form-item>
        <el-form-item label="展视互动直播ID" prop="id">
          <el-input v-model="ruleForm.id" placeholder="请输入展视互动直播ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="展视互动直播房间号" prop="number">
          <el-input v-model="ruleForm.number" placeholder="请输入展视互动直播间房间号" disabled></el-input>
        </el-form-item>
        <el-form-item label="可用机构" prop="org">
          <el-radio-group v-model="ruleForm.org">
            <el-radio label="true">全部机构</el-radio>
            <el-radio label="false">指定机构</el-radio>
          </el-radio-group>
          <span @click="dialogVisible =true" v-show="ruleForm.org == 'false'" class="spot">点击选择机构</span>
        </el-form-item>
        <el-form-item label="是否禁用" prop="disabled">
          <el-radio-group v-model="ruleForm.disabled">
            <el-radio label="true">否</el-radio>
            <el-radio label="false">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="直播间描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" maxlength="50" placeholder="直播间描述，最多不超过50字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 机构选择 - 弹窗 -->
    <el-dialog title="选择机构" :visible.sync="dialogVisible" width="30%" >
      <el-transfer v-model="value" :data="data" :titles="['可选择的机构', '已选择的成员']" :props="{
      key: 'orgId',
      label: 'name'
    }"></el-transfer>
      <p style="margion-top:20px;">只有已入驻机构才可使用直播间</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editLiveRoom, orgArrayData, liveRoomDetails } from "@/api/live-room.js";

export default {
  name: "LiveRoomListEdit",
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        id: "",
        number: "",
        org: "true",
        disabled: "false",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入直播间名称", trigger: "blur" }
        ],
        id: [
          { required: true, message: "请输入展视互动直播ID", trigger: "blur" }
        ],
        number: [
          {
            required: true,
            message: "请输入展视互动直播房间号",
            trigger: "blur"
          }
        ],
        data: [
          {
            type: "date",
            required: true,
            message: "请选择站点信息",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请填写直播间描述", trigger: "blur" }]
      },
      dialogVisible: false,
      data: [],
      value: [],
      tableData: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 10,
    };
  },
  created() {
    this.editDeatails();
  },
  methods: {
    // 编辑 - 详情
    editDeatails() {
      // 机构列表
       orgArrayData().then(res =>{
      console.log(res.result)
      this.data = res.result;
    })
    // 数据详情
      liveRoomDetails({id: this.$route.params.id}).then(res =>{
        this.ruleForm.name = res.result.name;
        this.ruleForm.id = res.result.liveId;
        this.ruleForm.number = res.result.liveNumber;
        this.ruleForm.org = String(res.result.forAllOrg);
        this.ruleForm.disabled = String(res.result.enable);
        this.ruleForm.desc = res.result.description;
        const orgData = res.result.orgIds.split(",");
        console.log(orgData, '后台返回的机构数据')
        this.value = orgData.map(item =>{
          return Number(item);
        })
        this.resetDialogData = this.value;
      })
    },

    // 提交修改
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const option = {
            id: this.$route.params.id,
            enable: this.ruleForm.disabled,
            forAllOrg: this.ruleForm.org,
            liveId: this.ruleForm.id,
            liveNumber: this.ruleForm.number,
            name: this.ruleForm.name,
            orgIds: this.value.join(","),
            description: this.ruleForm.desc,
          }
           if (this.ruleForm.org === 'true') {
            option.orgIds = null; 
          } 
          if (this.ruleForm.id) {
            option.liveId = String(this.ruleForm.id).replace(/\s+/g,"");
          }
          if (this.ruleForm.org === 'false' && this.value.join(",") === "0") {
            this.$message({
              type: 'warning',
              message: '请选择指定机构'
            })
          } else {
            editLiveRoom(option).then(res =>{
            this.$message({
              type: "success",
              message: "修改成功"
            })
            this.$router.go(-1);
            this.$store.dispatch("delView", this.$route);
          })
          }
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    },
    // 弹窗取消 - 复原数据
    resetData() {
      this.dialogVisible = false;
      this.value = this.resetDialogData;
    }
  }
};
</script>

<style lang="less" scoped>
.singleData {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
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
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.spot {
  margin-left: 20px;
  cursor: pointer;
}
</style>
