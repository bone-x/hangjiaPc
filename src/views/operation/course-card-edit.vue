<template>
  <div class="content-container">
    <!-- 运营管理 - 听课卡列表 - 编辑-->
    <h4>基本信息</h4>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="听课卡名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入听课卡名称" maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="使用范围" prop="shopLow">
        <el-col :span="11">
          <el-form-item>
            <el-input v-model="ruleForm.shopLow" placeholder="输入免费课程最低价"  maxlength="5"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="shopTop">
            <el-input v-model="ruleForm.shopTop" placeholder="输入免费课程最高价"  maxlength="5"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="发放数量">
         <span style="hight:36px;">默认不限量发放</span>
      </el-form-item>
      <el-form-item label="每人限领">
         <span style="hight:36px;">默认不限量领取</span>
      </el-form-item>
      <el-form-item label="有效时间" prop="dateRange">
         <el-date-picker
          v-model="ruleForm.dateRange"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          size="large"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="~"
          start-placeholder="听课卡开始日期"
          end-placeholder="听课卡结束日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="可用时长" prop="day" >
         <el-input v-model="ruleForm.day" placeholder="听课卡激活后的可用时长" maxlength="4">
           <template slot="append">天</template>
         </el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="ruleForm.remark" placeholder="输入听课卡备注信息" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button  @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
import {editDataDetails, getCourseCardId} from "@/api/operation";
import { formatDate } from "@/utils/index";


export default {
  name: "OperationCourseCardEdit",
  components: {},
  data() {
    var validateShopLow = (rule, value, callback) => {
        if (value === "") {
            callback(new Error('请输入免费课程最低价'));
          } else {
            if(value<0.01) {
               callback(new Error('请输入大于0.01价格'));
            } else {
              callback();
            }
          }
    };
    var validateShopTop = (rule, value, callback) => {
        if (value === "") {
            callback(new Error('请输入免费课程最高价'));
          } else {
            if (parseInt(value)<parseInt(this.ruleForm.shopLow)) {
              callback(new Error("免费课程最高价太低"));
            } else {
              callback();
            }
          }
    };
     var validateDay = (rule, value, callback) => {
        if (value === "") {
            callback(new Error('请输入听课卡激活后的可用天数'));
          } else {
            if(value<0.01) {
               callback(new Error('请输入大于0.01价格'));
            } else {
              callback();
              }
          }
    };
    return {
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }, 
      ruleForm: {
        name: "",
        shopLow: "",
        shopTop: "",
        dateRange: "",
        day: "",
        remark: ""
      },
      rules: {
          name: [
            { required: true, message: '请输入听课卡名称', trigger: 'blur' },
          ],
          shopLow: [
            { required: true, validator: validateShopLow, trigger: 'blur' },
          ],
          shopTop: [
            { required: true,validator: validateShopTop, trigger: 'blur' },
          ],
          dateRange: [
            { required: true, message: '请输入有效时间范围', trigger: 'blur' },
          ],
          day: [
            { required: true, validator: validateDay, trigger: 'blur' },
          ]
      },
      row: {},
    };
  },
  created() {
    this.getCourseCardIdSingle()
    console.log(this.$route.params.id)
    this.row = this.$route.params.id;
    
  },
  methods: {
    submitForm(formName) {
      console.log(2)
      this.$refs[formName].validate((valid) => {
        console.log(valid)
         if (valid) {
            const option = {
              cardName: this.ruleForm.name,
              priceRangeLow: Number(this.ruleForm.shopLow),
              priceRangeHigh: Number(this.ruleForm.shopTop),
              effectiveTimeStart: this.ruleForm.dateRange[0],
              effectiveTimeEnd: this.ruleForm.dateRange[1],
              avaibilePeriod: Number(this.ruleForm.day),
              cardRemark: this.ruleForm.remark || "",
              status: this.row.status,
              id: this.row.id,
              isCountUnlimited: this.row.isCountUnlimited,
              isDelete: this.row.isDelete,
              isPerUnlimited: this.row.isPerUnlimited,
            }
        editDataDetails(option).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.cancelEdit()
          }
        })
         }
      });
    },
    getCourseCardIdSingle() {
      const params = {
        courseCardId:this.$route.params.id,
      }
      getCourseCardId(params).then(res => {
        console.log(res, '实体数据')
        this.row = res.result;
        this.ruleForm.name =  this.row.cardName; 
    this.ruleForm.shopLow =  this.row.priceRangeLow ;
    this.ruleForm.shopTop =  this.row.priceRangeHigh ;
    this.ruleForm.dateRange =  [this.row.effectiveTimeStart,this.row.effectiveTimeEnd];
    this.ruleForm.day =  this.row.avaibilePeriod;  
    this.ruleForm.remark =  this.row.cardRemark ;  
      })
    },

    cancelEdit() {
      this.$router.go(-1);
      this.$store.dispatch("delView", this.$route);
    }
  }
};
</script>

<style scoped lang="scss">
</style>