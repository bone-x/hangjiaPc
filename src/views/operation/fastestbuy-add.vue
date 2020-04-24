<template>
  <div class="content-container addnew">
    <!-- 这是秒杀页面的新建活动按钮跳转页面 -->
    <div class="fastestbuy-add">
      <div>
        <h5>商品信息</h5>
        <div class="goodmsg">
          <div class="gmsg">商品名称：</div>
          <el-button
            type="primary"
            class="choosegoods"
            plain
            @click="centerDialogVisible = true"
            @click.native="newShow"
          >+ 选择商品</el-button>

          <!-- 点击选择商品出现的弹窗 -->
          <el-dialog :visible.sync="centerDialogVisible" title="选择商品" width="900px" left>
            <div>
              <el-form :inline="true" :model="formSearch" class="flex-center">
                <el-form-item label style="width:150px;">
                  <el-select
                    v-model="selectedCategoryMenu"
                    placeholder="课程一级类目"
                    @change="(val) => { onSelectedCategory(val, 1) }"
                  >
                    <el-option
                      v-for="(item,index) in categoryMenuData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label style="width:150px;">
                  <el-select
                    v-model="selectedCategoryMenu2"
                    placeholder="课程二级类目"
                    @change="(val) => { onSelectedCategory(val, 2) }"
                  >
                    <el-option
                      v-for="(item,index) in categoryMenuData2"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label style="width:150px;">
                  <el-select
                    v-model="selectedCategoryMenu3"
                    placeholder="课程三级类目"
                    @change="(val) => { onSelectedCategory(val, 3) }"
                  >
                    <el-option
                      v-for="(item, index) in categoryMenuData3"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="magin-left">
                  <el-input v-model="formSearch.name" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item class="magin-left">
                  <el-button icon="el-icon-search" @click.native="onSubmit">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 弹窗表格部分 -->
            <el-table :data="getDialogData" size="small" border>
              <el-table-column label width="50">
                <template slot-scope="scope">
                  <el-radio
                    :label="scope.$index"
                    v-model="radio"
                    @change.native="getCurrentRow(scope.row)"
                  >&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column prop="teacherNames" label="教师名称"></el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
            </el-table>

            <!-- 弹窗分页选择 -->
            <div class="block" style="margin-top:20px">
              <el-pagination
                :page-size="formSearch.pageSize"
                :current-page.sync="formSearch.pageNum"
                :total="totalCount"
                layout="prev, pager, next, jumper"
                class="simplepage"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>

            <span slot="footer" class="dialog-footer sure">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button
                type="primary"
                class="yes"
                @click="centerDialogVisible = false"
                @click.native="sendGoodsMsg"
              >确 定</el-button>
            </span>
          </el-dialog>
          <!-- 以上为点击选择商品出现的弹窗 -->
          <div v-show="true" class="gt">
            <span>{{ goodsMsg.goodsname }} / {{ goodsMsg.teacher }}</span>
            <span class="el-icon-close tik" @click="clearMsg"></span>
          </div>
        </div>
        <div class="usestore">
          <span class="price">商品原价：</span>
          <span class="yuan">
            {{ goodsMsg.price }}
            <span v-if="goodsMsg.price !== ''">元</span>
          </span>
        </div>
        <div class="usestore">
          <span class="price">可用库存：</span>
          <span class="yuan">{{ goodsMsg.usestore }}</span>
        </div>
      </div>

      <div>
        <h5>活动信息</h5>
        <div class="goodmsg">
          <div class="block" style="height:36px;line-height:36px">
            <div class="gmsg">秒杀时间：</div>
            <el-date-picker
              v-model="goodsMsg.timeLimit"
              :default-time="['10:00:00']"
              :picker-options="pickerOptions0"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              @change="timeRange"
            ></el-date-picker>
            <span class="timetip">秒杀开始时间点必须为：10:00,14:00,20:00</span>
          </div>
        </div>

        <el-form ref="form" :model="goodsMsg" class="kill-price">
          <el-form-item prop="killprice" label="秒杀价">
            <el-col :span="4" style="margin-left:37px">
              <el-input v-model.trim="goodsMsg.killprice" placeholder="输入价格" class="money"></el-input>
            </el-col>
            <el-col :span="1" style="margin-left:15px;">元</el-col>
            <el-col :span="6">秒杀价不得高于商品原价</el-col>
          </el-form-item>
        </el-form>

        <div class="killprice">
          <span class="kp allactive">活动总库存:</span>
          <el-input v-model="goodsMsg.totalGoods" placeholder="输入数量" class="money" @blur="getUsestore"></el-input>
          <span class="yan">件</span>
          <span class="tip2">注意：活动库存不输入时表示不限量，活动总库存不得高于商品可用库存</span>
        </div>
      </div>
      <div class="end">
        <el-button @click.native="cancelSubmit">&nbsp;&nbsp;取 消&nbsp;&nbsp;</el-button>
        <el-button type="primary" class="sendcheck" @click.native="submitMsg">提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDialogGoodsList, fastestSave, } from "@/api/operation";
import GoodsApi from "@/api/goods";
import { formatDate } from "@/utils/index";

const init = () => {
  return {
    // 弹窗商品列表点击选中后存放的数据
    multipleTable: [],
    // 商品类目 - 1级
    categoryMenuData: [],
    // 商品类目 - 2级
    categoryMenuData2: [],
    // 商品类目 - 3级
    categoryMenuData3: [],
    // 商品类目 - 选择值
    selectedCategoryMenu: null,
    selectedCategoryMenu2: null,
    selectedCategoryMenu3: null,
    // 好课推荐获取的数据
    goodCourseData: [],
    // 获取select选框的值
    formSearch: {
      selectType: 1,
      pageNum: 1,
      pageSize: 10,
      name: "", // 商品名称
      goodsCategoryId: "", // 商品类目ID
      projectType: 1, // 项目类型1.行家 2.子墨学员
    },
    totalCount: 10,
    totalPage: 10,
    // 搜索框的值
    goodsCategoryName: "",
    allGoodsData: [],
    getDialogData: [],
    categoryName: "",
    // 获取select选框的值
    // 弹窗页码
    pageNum: 1,
    pageSize: 10,
    currentPage: 1,
    show: false,
    // 弹窗开关
    centerDialogVisible: false,
    // 商品名称、教师名称、原价、库存&需提交审核的内容
    goodsMsg: {
      goodsname: "",
      teacher: "",
      price: "",
      usestore: "",
      timeLimit: "",
      killprice: "",
      totalGoods: "",
      startTime: "",
      endTime: "",
      id: ""
    },
    timeState: "",
    // 存放弹窗里面单条数据
    oneDataDetail: {},
    // 日期选择内容
    pickerOptions0: {
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
      }
    },
    // 弹窗表格单选
    radio: "",
    formInline: {
      status: "课程一级类目",
      push: "课程二级类目",
      search: "" // 搜索框输入的内容
    },
    loading: false
  };
};
export default {
  name: "OperationManageFastestbuyAdd",
  components: {
    formatDate
  },
  data: init,
  activated() {
    this.$forceUpdate();
    this.$set(this, "goodsMsg", {
      goodsname: "",
      teacher: "",
      price: "",
      usestore: "",
      timeLimit: "",
      killprice: "",
      totalGoods: "",
      startTime: "",
      endTime: "",
      id: ""
    });
  },
  created() {
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
      // console.log('res', this.categoryMenuData);
      res.result.forEach(item => {});
    });
    this.dialogAllData();
  },

  methods: {
    timeRange(timeArr) {
      const date = new Date();
      const time = new Date(timeArr[0]); // 第一个选中的时间
      const h = new Date(time).getHours() < 9 ? '0' + new Date(time).getHours() : new Date(time).getHours(); // 所选择的日期的时分秒
      const m = new Date(time).getMinutes() < 9 ? '0' + new Date(time).getMinutes() : new Date(time).getMinutes();
      const s = new Date(time).getSeconds() < 9 ? '0' + new Date(time).getSeconds() : new Date(time).getSeconds();
      const chosenTime = h + ':' + m + ':' + s; // 所选择的日期的时分秒
      const isPass = !!['10:00:00', '14:00:00', '20:00:00'].includes(chosenTime);
      if (!isPass) {
        this.goodsMsg.timeLimit = [];
        this.$message.error("秒杀开始时间点必须为：10:00,14:00,20:00");
      } else if (time <= date) {
        this.goodsMsg.timeLimit = [];
        this.$message.error("秒杀开始时间点必须大于当前时间");
      } else {
        return !isPass;
      }
    },

    // 弹窗表格商品内容
    dialogAllData() {
      this.formSearch.goodsCategoryId =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      getDialogGoodsList(this.formSearch).then(res => {
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.formSearch.pageSize = res.result.pageSize || 10;
        this.totalPage = res.result.totalPage;
      });
    },

    // 点击弹窗的搜索
    onSubmit() {
      this.formSearch.pageNum = 1;
      this.dialogAllData();
    },

    // 弹窗单选操作的方法
    getCurrentRow(item) {
      this.oneDataDetail = item;
      console.log('shuju', item);
    },

    // 获取弹窗里面的值渲染出来
    sendGoodsMsg() {
      this.goodsMsg.goodsname = this.oneDataDetail.name;
      this.goodsMsg.teacher = this.oneDataDetail.teacherNames;
      this.goodsMsg.price = this.oneDataDetail.price;
      this.goodsMsg.usestore = this.oneDataDetail.stockCount;
      this.goodsMsg.totalGoods = this.goodsMsg.usestore;
      // 获取商品可用库存
      this.goodsMsg.id = this.oneDataDetail.id;
    },

    // 点击x清空数据
    clearMsg() {
      this.goodsMsg.goodsname = "";
      this.goodsMsg.teacher = "";
      this.goodsMsg.price = "";
      this.goodsMsg.usestore = "";
    },

    // 清空活动库存失去焦点后赋值
    getUsestore() {
      if (this.goodsMsg.totalGoods === '') {
        this.goodsMsg.totalGoods = this.goodsMsg.usestore;
      }
    },

    // 提交审核
    async submitMsg() {
      // 获取时间
      this.timeState = this.goodsMsg.timeLimit;
      // 开始时间
      this.goodsMsg.startTime = this.timeState[0];
      // 结束时间
      this.goodsMsg.endTime = this.timeState[1];
      // 价格格式转化
      let res = null;
      if (
        !this.goodsMsg.goodsname.trim() &&
        !this.goodsMsg.teacher.trim() &&
        !this.goodsMsg.price.trim() &&
        !this.goodsMsg.usestore.trim()
      ) {
        this.$message.error("商品信息不能为空!");
        res = false;
      } else if (this.goodsMsg.timeLimit === "") {
        this.$message.error("秒杀时间不能为空!");
        res = false;
      } else if (this.goodsMsg.endTime <= this.goodsMsg.startTime) {
        this.$message.error("结束时间必须大于开始时间");
        res = false;
      } else if (!this.goodsMsg.killprice.trim()) {
        this.$message.error("秒杀价格不能为空!");
        res = false;
      } else if (this.goodsMsg.killprice < 0) {
        this.$message.error("秒杀价格不能为负数!");
        res = false;
      } else if (
        Number(this.goodsMsg.killprice) > Number(this.goodsMsg.price)
      ) {
        this.$message.error("秒杀价格不能大于商品原价!");
        res = false;
      } else if (this.goodsMsg.totalGoods < 0) {
        this.$message.error("活动总库存不能为负数!");
        res = false;
      } else if (this.goodsMsg.usestore < 999999999 && this.goodsMsg.totalGoods === '') {
        this.$message.error("请输入活动库存!");
        res = false;
      } else if (this.goodsMsg.usestore < 999999999 && this.goodsMsg.totalGoods > this.goodsMsg.usestore) {
        this.$message.error("活动总库存不能大于可用库存!");
        res = false;
      } else {
        // 请求所带参数
        const data = {
          goodsName: this.oneDataDetail.name,
          startTime: this.goodsMsg.startTime,
          endTime: this.goodsMsg.endTime,
          goodsId: this.oneDataDetail.id,
          price: Number(this.goodsMsg.killprice),
          totalRepertory: Number(this.goodsMsg.totalGoods),
          type: 2
        };
        res = fastestSave(data).then(res => {
          if (res.code === 200) {
            this.$message.success("提交成功");
            this.resetForm();
            this.$store.dispatch("delView", this.$route);
            this.$router.go(-1);
          }
        });
      }
      return res;
    },

    // 重置页面
    resetForm() {
      this.goodsMsg.goodsname = "";
      this.goodsMsg.teacher = "";
      this.goodsMsg.price = "";
      this.goodsMsg.usestore = "";
      this.goodsMsg.timeLimit = "";
      this.goodsMsg.killprice = "";
      this.goodsMsg.totalGoods = "";
    },

    // 取消提交返回主页面
    cancelSubmit() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 弹窗 => 选择类目
    onSelectedCategory(id, level) {
      if (level === 1) {
        this.selectedCategoryMenu = id;
        // 第一个select框数据有子级则附到一级后面
        this.categoryMenuData.some(item => {
          // 从一级里面拿到二级
          if (item.id === id) {
            this.categoryMenuData2 = item.childList;
            this.selectedCategoryMenu2 = "";
            this.selectedCategoryMenu3 = "";
            return true;
          }
          return false;
        });
        // 清空三级
        this.categoryMenuData3 = [];
      } else if (level === 2) {
        this.selectedCategoryMenu2 = id;
        this.categoryMenuData2.some(item => {
          // 从二级里面拿到三级
          if (item.id === id) {
            this.categoryMenuData3 = item.childList;
            this.selectedCategoryMenu3 = "";
            return true;
          }
          return false;
        });
      } else if (level === 3) {
        this.selectedCategoryMenu3 = id;
      }
    },

    // 点击添加商品
    newShow() {
      this.selectedCategoryMenu = "";
      this.selectedCategoryMenu2 = "";
      this.selectedCategoryMenu3 = "";
      this.getDialogData.goodsCategoryName = "";
      this.oneDataDetail = "";
      this.radio = "";
      this.dialogAllData();
    },


    // 弹窗分页
    handleSizeChange(val) {
      this.formSearch.pageSize = val;
    },
    handleCurrentChange(val) {
      this.formSearch.pageNum = val;
      this.radio = '';
      this.dialogAllData();
    },
  }
};
</script>

<style scoped lang="scss">
.addnew {
  padding: 20px;
  padding-left: 40px;
  .goodmsg {
    display: flex;
    justify-content: flex-start;
    font-size: 13px;
    .gmsg {
      margin-right: 26px;
      line-height: 36px;
    }
    .timetip {
      color: #949292;
      margin-left: 20px;
    }
    .gt {
      line-height: 35px;
      margin-left: 25px;
      min-width: 380px;
      height: 36px;
      background: #ecf5ff;
      color: #409eff;
      border: 1px solid #afd4fa;
      border-radius: 3px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      .tik {
        line-height: 36px;
        cursor: pointer;
      }
    }
    .choosegoods {
      vertical-align: bottom;
    }
    .block {
      display: flex;
      justify-content: center;
      // margin: 20px 0;
    }
    .sure {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
      .yes {
        margin-left: 100px;
      }
    }
  }
  .kill-price {
    margin: 30px 0;
  }
  .usestore {
    margin-top: 10px;
    .price {
      font-size: 13px;
      line-height: 35px;
    }
    .yuan {
      margin-left: 18px;
      line-height: 35px;
    }
  }
  .killprice {
    font-size: 13px;
    line-height: 36px;
    margin-top: 25px;
    .kp {
      margin-right: 45px;
    }
    .allactive {
      margin-right: 20px;
    }
    .money {
      width: 150px;
    }
    .yan {
      margin: 0 10px;
    }
    .tip2 {
      color: #949292;
    }
  }
  .end {
    margin: 45px 0px;
    display: flex;
    justify-content: center;
    .sendcheck {
      margin-left: 100px;
    }
  }
}
</style>
