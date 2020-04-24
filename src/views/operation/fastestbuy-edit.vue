<template>
  <div class="content-container addnew">
    <!-- 运营管理 - 秒杀 - 编辑 -->
    <div class="fastedittop">
      <h5>商品信息</h5>
      <div class="goodmsg">
        <div class="gmsg">商品名称：</div>
        <el-button
          :disabled="activityStatus === 2"
          type="primary"
          plain
          class="choosegoods"
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
                <el-input
                  :loading="loading"
                  v-model="formSearch.name"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="商品名称"
                  style="width:200px;"
                ></el-input>
              </el-form-item>
              <el-form-item class="magin-left">
                <el-button icon="el-icon-search" @click.native="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 弹窗表格部分 -->
          <el-table :data="getDialogData" border class="kildialog" size="small">
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
          <div class="block">
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
          <span :class="activityStatus === 2 ? '' : 'el-icon-close tik'" @click="clearMsg"></span>
        </div>
      </div>
      <div class="usestore">
        <span class="price">商品原价：</span>
        <span class="yuan">{{ goodsMsg.price }}</span>
        <span v-if="goodsMsg.price !== ''">元</span>
      </div>
      <div class="usestore">
        <span class="price">可用库存：</span>
        <span class="yuan">{{ goodsMsg.usestore }}</span>
      </div>
    </div>

    <div>
      <h5>活动信息</h5>
      <div class="goodmsg">
        <div class="gmsg">秒杀时间：</div>
        <div class="block">
          <el-date-picker
            :disabled="activityStatus === 2"
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
      <div class="killprice">
        <span class="kp">秒杀价:</span>
        <el-input
          :disabled="activityStatus === 2"
          v-model="goodsMsg.killPrice"
          placeholder="输入价格"
          class="money"
        ></el-input>
        <span v-if="goodsMsg.killPrice !== ''">元</span>
        <span class="tip2">秒杀价不得高于商品原价</span>
      </div>
      <div class="killprice">
        <span class="kp allactive">活动总库存:</span>
        <el-input v-model="goodsMsg.repertory" placeholder="输入数量" class="money" @blur="getUsestore"></el-input>
        <span class="yan">件</span>
        <span class="tip2">注意：活动库存不输入时表示不限量，活动总库存不得高于商品可用库存</span>
      </div>
    </div>
    <div class="end">
      <el-button @click.native="cancelSubmit">&nbsp;&nbsp;取 消&nbsp;&nbsp;</el-button>
      <el-button type="primary" class="sendcheck" @click.native="submitMsg">提交审核</el-button>
    </div>
  </div>
</template>

<script>
import {
  getDialogGoodsList,
  fastestSingleCheck,
  fastestEdit
} from "@/api/operation";
import GoodsApi from "@/api/goods";

export default {
  name: "OperationManageFastestbuyEdit",
  components: {},
  data() {
    return {
      // 活动发布状态
      activityStatus: "",
      // 活动id
      goodsActivityId: null,
      // 存放商品信息
      goodName: "",
      // 存放教师名称
      teacher: "",
      // 存放活动库存
      goodStore: "",
      // 秒杀价格存放
      // killPrice: "",
      // 存放所有数据
      singleData: [],
      // 存放商品数据
      goodsAllData: [],
      // 商品名称、教师名称、原价、库存&需提交审核的内容
      goodsMsg: {
        goodsname: "",
        teacher: "",
        price: "",
        usestore: "", // 可用库存
        repertory: "", // 活动库存
        timeLimit: "",
        killPrice: "",
        totalGoods: "",
        startTime: "",
        endTime: "",
        id: "",
        goodsId: ""
      },
      repertoryMax: "", // 可用库存+活动库存
      // 存放教师名称
      teachers: [],
      // 商品信息替换存放
      newGoodsMsg: {
        goodsname: "",
        teacher: "",
        price: "",
        usestore: "",
        id: ""
      },
      // 存放
      // 日期选择内容
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      // 获取弹窗里面单条数据
      oneDataDetail: {},
      // 弹窗表格内容
      getDialogData: [],
      // 弹窗输入框的值
      categoryName: "",
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
      // 获取select选框的值
      formSearch: {
        projectType: 1,
        selectType: 1,
        pageNum: 1,
        pageSize: 10,
        name: "", // 商品名称
        goodsCategoryId: "" // 商品的ID
      },
      totalCount: 10,
      totalPage: 10,
      // 时间存放
      timeState: "",
      // 获取弹窗里面的分页数据
      show: false,
      centerDialogVisible: false,
      value6: "",
      value7: "",
      input: "",
      radio: "",
      options4: [],
      list: [],
      loading: false
    };
  },
  created() {
    this.getSingleData();
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
    });
    this.dialogAllData();
  },
  methods: {
    // 时间限制
    timeRange(timeArr) {
      const date = new Date(); // 获取当前时间
      const time = new Date(timeArr[0]); // 第一个已选中的日期
      const h =
        new Date(time).getHours() < 9
          ? "0" + new Date(time).getHours()
          : new Date(time).getHours(); // 所选择的日期的时分秒
      const m =
        new Date(time).getMinutes() < 9
          ? "0" + new Date(time).getMinutes()
          : new Date(time).getMinutes();
      const s =
        new Date(time).getSeconds() < 9
          ? "0" + new Date(time).getSeconds()
          : new Date(time).getSeconds();
      const chosenTime = h + ":" + m + ":" + s; // 所选择的日期的时分秒
      const isPass = !!["10:00:00", "14:00:00", "20:00:00"].includes(
        chosenTime
      );
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
      // 判断是拿到的是哪个商品类目和拿到输入的商品名称
      this.formSearch.goodsCategoryId =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      getDialogGoodsList(this.formSearch).then(res => {
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
        // 总条数
        this.totalCount = res.result.totalCount;
        // 总页数
        this.totalPage = res.result.totalPage;
        // 每页总条数
        this.formSearch.pageSize = res.result.pageSize || 10;
      });
    },

    // 接收首页轮播的路由传参
    getSingleData() {
      // 获取当前页面接收到的id
      this.goodsActivityId = Number(this.$route.params.id);
      // 存放时间
      const timeList = [];
      fastestSingleCheck(this.goodsActivityId).then(res => {
        this.singleData = res.result;
        this.activityStatus = res.result.publishStatus;
        this.goodsAllData = res.result.goods;
        this.goodsMsg.goodsname = this.goodsAllData.name;
        this.goodsMsg.teacher = this.goodsAllData.teacherNames;
        // 商品原价
        this.goodsMsg.price = this.goodsAllData.price;
        // 商品库存
        this.goodsMsg.usestore = this.goodsAllData.stockCount;
        // 活动价格
        this.goodsMsg.killPrice = this.singleData.price;
        // 活动总库存
        this.goodsMsg.repertory = this.singleData.totalRepertory;
        // 加入开始和结束时间
        timeList.push(this.singleData.startTime);
        timeList.push(this.singleData.endTime);
        this.goodsMsg.timeLimit = timeList;
        // 活动id
        this.goodsMsg.id = this.singleData.id;
        // 商品id
        this.goodsMsg.goodsId = this.singleData.goodsId;

        // 最大可编辑库存
        if (this.activityStatus === 2) {
          this.repertoryMax =
            Number(res.result.repertory || 0) +
            Number(res.result.goods.stockCount || 0);
        } else {
          this.repertoryMax = this.goodsMsg.usestore;
        }

        if (this.repertoryMax > 999999999) {
          this.repertoryMax = 999999999;
        }
      });
    },

    // 获取弹窗里面单条数据
    getCurrentRow(item) {
      this.oneDataDetail = item;
    },

    // 弹窗数据点击确定替换原来信息
    sendGoodsMsg() {
      if (!this.oneDataDetail.id) {
        return false;
      }
      // 获取商品名称
      this.goodsMsg.goodsname = "";
      // 获取老师名称
      this.goodsMsg.teacher = "";
      // 获取商品原价
      this.goodsMsg.price = "";
      // 获取商品可用库存
      this.goodsMsg.usestore = "";
      // 获取商品可用库存
      this.goodsMsg.id = this.oneDataDetail.id;
      // 清空后赋值
      this.goodsMsg.goodsname = this.oneDataDetail.name;
      this.goodsMsg.teacher = this.oneDataDetail.teacherNames;
      this.goodsMsg.price = this.oneDataDetail.price;
      this.goodsMsg.usestore = this.oneDataDetail.stockCount;
    },

    // 清空数据
    clearMsg() {
      this.goodsMsg.goodsname = "";
      this.goodsMsg.teacher = "";
      this.goodsMsg.price = "";
      this.goodsMsg.usestore = "";
    },

    // 清空活动库存失去焦点后赋值
    getUsestore() {
      if (this.goodsMsg.repertory === "") {
        this.goodsMsg.repertory = this.goodsMsg.usestore;
      }
    },

    // 提交审核
    submitMsg() {
      this.timeState = this.goodsMsg.timeLimit;
      this.goodsMsg.startTime = this.timeState[0];
      this.goodsMsg.endTime = this.timeState[1];
      const date = new Date();
      const time = new Date(this.timeState[0]); // 第一个选中的时间
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
      } else if (this.activityStatus === 1 && time <= date) {
        this.$message.error("活动开始时间点必须大于当前时间");
      } else if (this.goodsMsg.timeLimit === "") {
        this.$message.error("秒杀时间不能为空!");
        res = false;
      } else if (this.goodsMsg.timeLimit[1] <= this.goodsMsg.timeLimit[0]) {
        this.$message.error("结束时间必须大于开始时间！");
        res = false;
      } else if (this.goodsMsg.killPrice === "") {
        this.$message.error("秒杀价格不能为空!");
        res = false;
      } else if (this.goodsMsg.killPrice < 0) {
        this.$message.error("秒杀价格不能为负数!");
        res = false;
      } else if (
        Number(this.goodsMsg.killPrice) > Number(this.goodsMsg.price)
      ) {
        this.$message.error("秒杀价格不能大于商品原价!");
        res = false;
      } else if (this.goodsMsg.repertory < 0) {
        this.$message.error("活动总库存不能为负数!");
        res = false;
      } else if (
        this.goodsMsg.usestore < 999999999 &&
        this.goodsMsg.repertory === ""
      ) {
        this.$message.error("请输入活动库存!");
        res = false;
      } else if (this.goodsMsg.repertory > this.repertoryMax) {
        this.$message.error("活动总库存超过最大限制：" + this.repertoryMax);
        return false;
      } else {
        // 请求所带参数
        const data = {
          goodsName: this.goodsMsg.name,
          startTime: this.goodsMsg.startTime,
          endTime: this.goodsMsg.endTime,
          goodsId: this.goodsMsg.goodsId, // 商品id
          price: Number(this.goodsMsg.killPrice), // 活动价格
          totalRepertory: Number(this.goodsMsg.repertory), // 活动总库存
          type: 2,
          id: Number(this.goodsMsg.id)
        };
        res = fastestEdit(data).then(res => {
          this.$message.success("提交成功");
          this.$store.dispatch("delView", this.$route);
          this.$router.go(-1);
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
      this.goodsMsg.killPrice = "";
      this.goodsMsg.repertory = "";
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
      this.centerDialogVisible = true;
      this.selectedCategoryMenu = "";
      this.selectedCategoryMenu2 = "";
      this.selectedCategoryMenu3 = "";
      this.getDialogData.goodsCategoryName = "";
      this.oneDataDetail = "";
      this.radio = "";
      this.dialogAllData();
    },

    // 点击弹窗的搜索
    onSubmit() {
      this.formSearch.pageNum = 1;
      // 判断是拿到的是哪个商品类目和拿到输入的商品名称
      this.formSearch.goodsCategoryId =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      getDialogGoodsList(this.formSearch).then(res => {
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
        this.formSearch.pageSize = res.result.pageSize;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 弹窗分页
    handleSizeChange(val) {
      this.formSearch.pageSize = val;
    },

    handleCurrentChange(val) {
      this.formSearch.pageNum = val;
      this.dialogAllData();
    }
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
      display: inline-block;
      height: 36px;
      line-height: 36px;
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
    .kildialog {
      margin-bottom: 20px;
    }
    .block {
      display: flex;
      justify-content: center;
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
