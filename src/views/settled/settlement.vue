<template>
  <div class="content-container">
    <!-- 入驻管理 - 结算设置 -->
    计算管理费:<div class="div"><el-input v-model="moneny"></el-input></div>% <span class="span">设置第三方机构的结算管理费，我们会从机构结算单中扣除这部分管理费。</span>
    <div class="footer">
      <el-button>取消</el-button><el-button type="primary">保存</el-button>
    </div>
    
   </div>
</template>

<script>
export default {
  name: "SettledManageSettlement",
  components: {},
  data() {
    return {
      moneny: "5",
    };
      
  },
  methods: {
   
  }
};
</script>

<style scoped lang='less'>
.content-container {
 .div {
   display: inline-block;
   width: 100px;
 }
 .span{
   margin-left: 30px;
 }
 .footer {
   margin-top: 30px;
   display: flex;
   justify-content: center;
   .el-button {
     margin-left: 50px;
   }
 }
}
</style>
