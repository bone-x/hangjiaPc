<template>
  <div class="content-container">
    <!-- 入驻管理 - 入驻列表详情页 -->
    <el-row :gutter="20">
      <el-col :span="2.5">
        <div class="picture">
          <img :src="orgBasicInfo.logoUrl" class="avatar" />
          <p class="orgname">{{this.orgBasicInfo.name}}</p>
        </div>
      </el-col>
      <el-col :span="17" style="height:175px;">
        <el-row>
          <el-col :span="6">
            <div class="content header">机构ID</div>
            <div class="content header">主营类目</div>
            <div class="content header">邮箱</div>
            <div class="content header">联系人</div>
          </el-col>
          <el-col :span="6">
            <div class="content">{{this.orgBankInfo.orgId}}</div>
            <div
              class="content"
            >{{this.orgBasicInfo.businessCategory.replace(/\"/g, "").replace('[','').replace(']','')}}</div>
            <div class="content">{{this.orgBasicInfo.email}}</div>
            <div class="content">{{this.orgBasicInfo.contactName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="content header">企业名称</div>
            <div class="content header">咨询QQ</div>
            <div class="content header">提交时间</div>
            <div class="content header">手机号码</div>
          </el-col>
          <el-col :span="6">
            <div class="content">{{this.orgBasicInfo.companyName}}</div>
            <div class="content">{{this.orgBasicInfo.qq}}</div>
            <div class="content">{{this.orgBasicInfo.createTime}}</div>
            <div class="content">{{this.orgBasicInfo.mobile}}</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:30px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>企业资质</el-header>
      <el-col :span="8" :offset="2" style="margin-top:30px;">
        <div class="company">
          <span>企业名称：</span>
          {{this.orgBasicInfo.companyName}}
        </div>
        <div class="company">
          <span>机构名称：</span>
          {{this.orgBasicInfo.name}}
        </div>
        <div class="company">
          <span>营业执照号：</span>
          {{this.orgBasicInfo.licenseNo}}
        </div>
      </el-col>
      <el-col :span="14" style="margin-top:20px;">
        <el-row>
          <el-col :span="6">
            <p>法人身份证：</p>
            <img :src="orgBasicInfo.corFrontIdcardUrl" class="pictureImage" v-popover:popover1 />
            <p>(正面)</p>
          </el-col>
          <el-col :span="6">
            <p>&nbsp;</p>
            <img :src="orgBasicInfo.corBackIdcardUrl" class="pictureImage" v-popover:popover2 />
            <p>(反面)</p>
          </el-col>
          <el-col :span="6">
            <p>营业执照：</p>
            <img :src="orgBasicInfo.licenseScanUrl" class="pictureImage" v-popover:popover3 />
            <p>&nbsp;</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:30px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>结算信息</el-header>
      <el-col :span="8" :offset="2" style="margin-top:30px;">
        <div class="company">
          <span>开户银行：</span>
          {{this.orgBankInfo.bankName}}
        </div>
        <div class="company">
          <span>开户网点：</span>
          {{this.orgBankInfo.barchName}}
        </div>
      </el-col>
      <el-col :span="12" style="margin-top:20px;">
        <div class="company">
          <span>账号户名：</span>
          {{this.orgBankInfo.accountName}}
        </div>
        <div class="company">
          <span>银行卡号：</span>
          {{this.orgBankInfo.bankCardNo}}
        </div>
      </el-col>
    </el-row>

    <!-- 拒绝原因 -->
    <el-row
      v-if="orgBasicInfo.refuseReason"
      :gutter="20"
      style="margin-top:30px;width:81%;border:1px solid #999;border-top:none;"
    >
      <el-header>拒绝原因</el-header>
      <el-col :span="20" :offset="2" style="margin-top:30px;">
        <p>{{this.orgBasicInfo.refuseReason}}</p>
      </el-col>
    </el-row>

    <!-- 管理日志 -->
    <el-row :gutter="20" style="margin-top:30px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>审核信息</el-header>
      <el-col :span="3" :offset="2" style="margin-top:30px;">
        <p>审核人： {{this.orgBasicInfo.auditorName}}</p>
      </el-col>
      <el-col :span="5" :offset="1" style="margin-top:30px;">
        <p>审核时间： {{this.orgBasicInfo.auditTime}}</p>
      </el-col>
    </el-row>

    <div class="footer" v-if="this.orgBasicInfo.status === 'UNPROCESSED'">
      <el-button @click="centerDialogVisible = true">拒绝</el-button>
      <el-button type="primary" @click="agreenSubmit">同意</el-button>
    </div>

    <el-dialog
      title="拒绝原因"
      :visible.sync="centerDialogVisible"
      width="30%"
      :before-close="handleClose"
      center
    >
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请填写拒绝的原因,限100字以内"
        v-model="textreaVal"
        maxlength="100"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="refuseSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片放大 -->
    <el-popover ref="popover1" placement="right" width="400" trigger="click">
      <img :src="orgBasicInfo.corFrontIdcardUrl" width="100%" height="100%" />
    </el-popover>

    <el-popover ref="popover2" placement="right" width="400" trigger="click">
      <img :src="orgBasicInfo.corBackIdcardUrl" width="100%" height="100%" />
    </el-popover>

    <el-popover ref="popover3" placement="right" width="400" trigger="click">
      <img :src="orgBasicInfo.licenseScanUrl" width="100%" height="100%" />
    </el-popover>
  </div>
</template>

<script>
import { getOrgDetails, getCheckoutOrg } from "@/api/settled";

export default {
  name: "SettledManageDetails",
  data() {
    return {
      orgBasicInfo: {
        logoUrl:
          "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        name: "",
        businessCategory: "",
        email: "",
        contactName: "",
        companyName: "",
        qq: "",
        status: "",
        createTime: "",
        mobile: "",
        name: "",
        licenseNo: "",
        corFrontIdcardUrl:
          "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        corBackIdcardUrl:
          "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        licenseScanUrl:
          "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        refuseReason: "",
        auditorName: "",
        auditTime: ""
      },
      orgBankInfo: {
        orgId: "",
        bankName: "",
        barchName: "",
        accountName: "",
        bankCardNo: ""
      },
      centerDialogVisible: false,
      textreaVal: ""
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取机构的信息
    getDataList() {
      getOrgDetails({
        orgId: this.$route.params.id
      }).then(res => {
        this.orgBasicInfo = res.result.orgBasicInfo;
        this.orgBankInfo = res.result.orgBankInfo;
      });
    },
    handleClose() {
      this.centerDialogVisible = false;
      this.textreaVal = "";
    },
    // 同意
    agreenSubmit() {
      getCheckoutOrg({
        orgId: this.$route.params.id,
        orgBasicInfoStatus: "APPROVAL"
        // refuseReason: "",
      }).then(res => {
        console.log(res);
        this.$router.go(-1);
        this.$store.dispatch("delView", this.$route);
      });
    },
    // 拒绝
    refuseSubmit() {
      getCheckoutOrg({
        orgId: this.$route.params.id,
        orgBasicInfoStatus: "REJECTED",
        refuseReason: this.textreaVal
      }).then(res => {
        console.log(res);
        this.$router.go(-1);
        this.centerDialogVisible = false;
        this.$store.dispatch("delView", this.$route);
      });
    }
  }
};
</script>

<style scoped lang='less'>
.content-container {
  .picture {
    display: inline-block;
    width: 150px;
    height: 175px;
    border: 1px solid #999;

    .avatar {
      width: 100px;
      height: 100px;
      margin: 25px 25px 0 25px;
      display: inline-block;
      background: saddlebrown;
    }
    .orgname {
      font-size: 14px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-weight: bolder;
    }
  }
  .content {
    height: 43px;
    line-height: 43px;
    text-align: center;
    border: 1px solid #ccc;
  }
  .header {
    font-weight: bolder;
  }

  .el-header {
    border: 1px solid #999;
    line-height: 60px;
    background: #eee;
    border-left: none;
    border-right: none;
  }
  .company {
    height: 60px;
    line-height: 60px;
  }
  .pictureImage {
    width: 150px;
    height: 100px;
  }
  .footer {
    margin-top: 30px;
    width: 81%;
    display: flex;
    justify-content: center;
    .el-button {
      margin-left: 50px;
    }
  }
}
</style>
