<template>
  <div class="content-container">
    <!-- 入驻管理 - 入驻机构详情 -->
    <el-row :gutter="20">
      <el-col :span="2.5">
        <div class="picture">
          <el-row :gutter="20" type="flex" align="middle" style="margin-top: 20px;margin-left:20px;">
            
            <upload-single @successCBK="onSingleUploadSuccess">
            <div class="goods-cover-container">
                <img
                  v-if="orgBasicInfo.logoUrl"
                  :src="orgBasicInfo.logoUrl"
                  style="width: 100px; height: 100px;"
                >
              <img v-else :src="NullImgFile" style="width: 100px; height: 100px;">
            </div>
            </upload-single>
          </el-row>
          <p class="orgname">
            <el-input v-model="orgBasicInfo.name" suffix-icon="el-icon-edit" maxlength="14"></el-input>
          </p>
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
            <div class="content">
              <el-input v-model="orgBasicInfo.businessCategory" suffix-icon="el-icon-edit"></el-input>
            </div>
            <div class="content">{{this.orgBasicInfo.email}}</div>
            <div class="content">{{this.orgBasicInfo.contactName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="content header">企业名称</div>
            <div class="content header">咨询QQ</div>
            <div class="content header">开通时间</div>
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

    <el-row :gutter="20" style="margin-top:20px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>企业资质</el-header>
      <el-col :span="8" :offset="1" style="margin-top:30px;">
          <el-form ref="form" :model="orgBasicInfo" label-width="100px">
            <el-form-item label="企业名称：">
              <el-input v-model="orgBasicInfo.companyName"></el-input>
            </el-form-item>
             <el-form-item label="机构名称：">
              <el-input v-model="orgBasicInfo.name"></el-input>
            </el-form-item>
             <el-form-item label="营业执照号：">
              <el-input v-model="orgBasicInfo.licenseNo"></el-input>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="14" :offset="1" style="margin-top:20px;">
        <el-row>
          <el-col :span="6">
            <p>法人身份证：</p>
             <img :src="orgBasicInfo.corFrontIdcardUrl" class="pictureImage">
             <p>(正面)</p>
          </el-col>
          <el-col :span="6">
             <p>&nbsp;</p>
             <img :src="orgBasicInfo.corBackIdcardUrl" class="pictureImage">
             <p>(反面)</p>
          </el-col>
          <el-col :span="6">
             <p>营业执照：</p>
             <img :src="orgBasicInfo.licenseScanUrl" class="pictureImage">
             <p>&nbsp;</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>结算信息</el-header>
      <el-col :span="6" :offset="2" style="margin-top:30px;">
          <el-form  label-width="100px">
            <el-form-item label="开户银行：">
              <el-input v-model="orgBankInfo.bankName"></el-input>
            </el-form-item>
             <el-form-item label="开户网点：">
              <el-input v-model="orgBankInfo.barchName"></el-input>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="6" style="margin-top:20px;">
          <el-form  label-width="100px">
            <el-form-item label="账号户名:">
              <el-input v-model="orgBankInfo.accountName"></el-input>
            </el-form-item>
             <el-form-item label="银行卡号：">
              <el-input v-model="orgBankInfo.bankCardNo"></el-input>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="6" style="margin-top:20px;">
          <el-form  label-width="100px">
            <el-form-item label="结算管理费:">
              <el-input v-model="manageFree" type="number">
                 <i slot="suffix">%</i>
              </el-input>
            </el-form-item>
             <p class="free">我们会从机构结算单中扣除这部分管理费</p>
          </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>数据概况</el-header>
      <el-col :span="6">
        <div class="profileData">
         <span class="shop">在售商品数:</span><span class="number">{{this.orgDataOverview.soldGoodsNum}}</span>
      </div>
       <div class="profileData">
         <span class="shop">累计销售总额:</span><span class="number">￥{{this.orgDataOverview.totalSalesAmount}}</span>
      </div>
       </el-col>
       <el-col :span="6">
        <div class="profileData">
         <span class="shop">已完成订单数:</span><span class="number">{{this.orgDataOverview.orderNum}}</span>
      </div>
       <div class="profileData">
         <span class="shop">累计结算金额:</span><span class="number">￥{{this.orgDataOverview.totalSettlementAmount}} </span>
      </div>
       </el-col>
        <el-col :span="6">
        <div class="profileData">
         <span class="shop">&nbsp;</span><span class="number">&nbsp;</span>
      </div>
       <div class="profileData">
         <span class="shop">待结算金额:</span><span class="number">￥{{this.orgDataOverview.pendingSettlementAmount}}</span>
      </div>
       </el-col>
        <el-col :span="6">
        <div class="profileData">
         <span class="shop">&nbsp;</span><span class="number">&nbsp;</span>
      </div>
       <div class="profileData">
         <span class="shop">&nbsp;</span><span class="number">&nbsp;</span>
      </div>
       </el-col>
    </el-row>

    <!-- 管理日志 -->
    <el-row  :gutter="20" style="margin-top:30px;width:81%;border:1px solid #999;border-top:none;">
      <el-header>更新信息</el-header>
      <el-col :span="3"  style="margin-top:30px;">
          <p>审核人： {{this.orgBasicInfo.auditorName}}</p>
      </el-col>
      <el-col :span="5" style="margin-top:30px;">
          <p>审核时间： {{this.orgBasicInfo.auditTime}}</p>
      </el-col>
      <el-col :span="3"  style="margin-top:30px;">
          <p>更新人： {{this.orgBasicInfo.updateName}}</p>
      </el-col>
      <el-col :span="5" style="margin-top:30px;">
          <p>更新时间： {{this.orgBasicInfo.updateTime}}</p>
      </el-col>
    </el-row>

    <div class="footer">
      <el-button @click="goBack">返回</el-button><el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>

import { changePassOrg, getOrgDetails} from "@/api/settled";
import uploadSingle from "@/components/Upload/single";

export default {
  name: "SettledOrganizationManageDetails",
  components: {uploadSingle},
  data() {
    return {
      NullImgFile: "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/dWKm3xFGgQph4vXSVabqIrnQ68wF.jpg",
      orgBasicInfo: {
        logoUrl: "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
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
        corFrontIdcardUrl:  "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        corBackIdcardUrl: "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        licenseScanUrl: "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/image/wByoT9dxmBAR61kzJwVQXgXCZW58.jpg",
        refuseReason: "",
        auditorName: "",
        auditTime: "",
        updateName: "",
        updateTime: "",
      },
      orgBankInfo: {
        orgId: "",
        bankName: "",
        barchName: "",
        accountName: "",
        bankCardNo: "",
      },
      orgDataOverview: {
        soldGoodsNum: '',
        totalSalesAmount: '',
        orderNum: '',
        totalSettlementAmount: '',
        pendingSettlementAmount: '',
      },
      manageFree: '',
    };
  },

  mounted() {
    this.getDataList();
  },

  methods: {
    getDataList() {
      getOrgDetails({
        orgId:this.$route.params.id,
      }).then(res=> {
        console.log(res)
        this.orgBasicInfo = res.result.orgBasicInfo;
        // 主营类目回显  
        this.orgBasicInfo.businessCategory = res.result.orgBasicInfo.businessCategory.replace(/\"/g, "").replace('[','').replace(']','');
        this.orgBankInfo = res.result.orgBankInfo;
        this.manageFree = res.result.feeRate;
        this.orgDataOverview = res.result.orgDataOverview;
      })
    },
    // 上传logo成功
    onSingleUploadSuccess(url) {
      console.log('上传到oss的图片回调',url)
      this.orgBasicInfo.logoUrl = url;
    },

      // 保存数据
      submit() {
        if (!this.orgBasicInfo.name) {
          this.$message({type:'warning',message:'请输入机构名称'})
        } else if (!this.orgBasicInfo.businessCategory) {
          this.$message({type:'warning',message:'请输入主营类目'})
        } else if (!this.orgBasicInfo.companyName) {
          this.$message({type:'warning',message:'请输入企业名称'})
        } else if (!this.orgBasicInfo.name) {
          this.$message({type:'warning',message:'请输入机构名称'})
        } else if (!this.orgBasicInfo.licenseNo) {
          this.$message({type:'warning',message:'请输入营业执照号'})
        } else if (!this.orgBankInfo.bankName) {
          this.$message({type:'warning',message:'请输入开户银行'})
        } else if (!this.orgBankInfo.accountName) {
          this.$message({type:'warning',message:'请输入账号户名'})
        } else if (!this.orgBankInfo.barchName) {
          this.$message({type:'warning',message:'请输入开户网点'})
        } else if (!this.orgBankInfo.bankCardNo) {
          this.$message({type:'warning',message:'请输入银行卡号'})
        } else {
          changePassOrg({
            logoUrl:this.orgBasicInfo.logoUrl,
            name: this.orgBasicInfo.name,
            businessCategory: this.orgBasicInfo.businessCategory,
            companyName: this.orgBasicInfo.companyName,
            licenseNo: this.orgBasicInfo.licenseNo,
            account_name: this.orgBankInfo.accountName,
            bank_name: this.orgBankInfo.bankName,
            barchName: this.orgBankInfo.barchName,
            bank_card_no: this.orgBankInfo.bankCardNo,
            fee_rate: this.manageFree,
            id: this.$route.params.id,
          }).then(res=> {
            console.log(res);
            this.$router.go(-1);
            this.$store.dispatch("delView", this.$route);
          })
        }
        
      },

      goBack() {
        this.$router.go(-1);
        this.$store.dispatch("delView", this.$route);
      }
  }
};
</script>

<style lang='less'>
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
      .el-input--medium .el-input__inner {
       border:none;
       height: 25px;
      text-align: center;
    }
    }
  }
  .content {
    height: 43px;
    line-height: 43px;
    text-align: center;
    border: 1px solid #ccc;
    .el-input--medium .el-input__inner {
       border:none;
      text-align: center;
    }
  }
  .header {
    font-weight: bolder;
  }

  .el-header {
    border: 1px solid #999;
    line-height: 60px;
    background: #eee;
     border-left:none;
    border-right:none;
  }
  .company {
    height: 50px;
    line-height: 50px;
  }
  .pictureImage {
    width: 150px;
    height: 100px;
  }
  .profileData {
    text-align: center;
    height: 50px;
    line-height: 50px;
    .shop {
      color: #999;
    }
    .number {
      color: red;
    }
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
  .free {
    color:#999;
    padding-top: 10px;
    padding-left: 20px;
  }
}
</style>
