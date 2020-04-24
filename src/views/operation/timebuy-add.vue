<template>
  <div class="content-container addnew">
    <!-- 运营管理 - 限时抢购 - 新建 -->
    <div class="timebuy-add">
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
            <div class="gmsg">抢购时间：</div>
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
          </div>
          <span class="timeTips">活动时间必须大于当前时间</span>
        </div>

        <el-form ref="form" :model="goodsMsg" class="kill-price">
          <el-form-item prop="killprice" label="抢购价">
            <el-col :span="4" style="margin-left:37px">
              <el-input v-model.trim="goodsMsg.killprice" placeholder="输入价格" class="money"></el-input>
            </el-col>
            <el-col :span="1" style="margin-left:15px;">元</el-col>
            <el-col :span="6">抢购价不得高于商品原价</el-col>
          </el-form-item>
        </el-form>

        <div class="killprice">
          <span class="kp allactive">活动总库存:</span>
          <el-input v-model="goodsMsg.totalGoods" placeholder="输入数量" class="money" @blur="getUsestore"></el-input>
          <span class="yan">件</span>
          <span class="tip2">注意：活动库存不输入时表示不限量，抢购库存建议不限量</span>
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

export default {
  name: "OperationManageTimebuyAdd",
  components: {},
  data() {
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
        goodsCategoryId: "" // 商品类目ID
      },
      totalPage: 10,
      totalCount: 10,
      // 搜索框的值
      goodsCategoryName: "",
      // 获取所有的商品列表的数据
      allGoodsData: [],
      // 获取弹窗列表的数据
      getDialogData: [],
      categoryName: "", 
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
      // 时间存放
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
      total: "",
      // 这里放的是表单提交的数据
      formInline: {
        status: "课程一级类目",
        push: "课程二级类目",
        search: "" // 搜索框输入的内容
      },
      loading: false
    };
  },
  created() {
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
    });
    this.dialogAllData();
  },

  methods: {
    // 时间限制
    timeRange(timeArr) {
      const date = new Date();
      const time = new Date(timeArr[0]); // 第一个选中的时间
      if (time <= date) {
        this.goodsMsg.timeLimit = [];
        this.$message.error("活动开始时间点必须大于当前时间");
      } else {
        return time;
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
        this.totalPage = res.result.totalPage;
        this.formSearch.pageSize = res.result.pageSize || 10;
        this.totalCount = res.result.totalCount;
      });
    },

    // 点击弹窗的搜索
    onSubmit() {
      this.dialogAllData();
    },

    // 弹窗单选操作的方法
    getCurrentRow(item) {
      // 拿到单条数据
      this.oneDataDetail = item;
    },

    // 获取弹窗里面的值渲染出来
    sendGoodsMsg() {
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
      // 获取商品名称
      this.goodsMsg.goodsname = this.oneDataDetail.name;
      // 获取老师名称
      this.goodsMsg.teacher = this.oneDataDetail.teacherNames;
      // 获取商品原价
      this.goodsMsg.price = this.oneDataDetail.price;
      // 获取商品可用库存
      this.goodsMsg.usestore = this.oneDataDetail.stockCount;
      // 商品可用库存赋值活动库存
      this.goodsMsg.totalGoods = this.goodsMsg.usestore;
      // 获取商品id
      this.goodsMsg.id = this.oneDataDetail.id;
    },

    // 点击x清空数据
    clearMsg() {
      // 清空商品名称
      this.goodsMsg.goodsname = "";
      // 清空老师名称
      this.goodsMsg.teacher = "";
      // 清空商品原价
      this.goodsMsg.price = "";
      // 清空商品可用库存
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
        this.$message.error("抢购时间不能为空!");
        res = false;
      } else if (!this.goodsMsg.killprice.trim()) {
        this.$message.error("抢购价格不能为空!");
        res = false;
      } else if (this.goodsMsg.killprice < 0) {
        this.$message.error("抢购价格不能为负数!");
        res = false;
      } else if (
        Number(this.goodsMsg.killprice) > Number(this.goodsMsg.price)
      ) {
        this.$message.error("抢购价格不能大于商品原价!");
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
          goodsName: this.goodsMsg.name,
          startTime: this.goodsMsg.startTime,
          endTime: this.goodsMsg.endTime,
          goodsId: this.oneDataDetail.id, // 商品id
          price: Number(this.goodsMsg.killprice), // 活动价格
          // repertory: Number(this.goodsMsg.totalGoods) || "", // 活动库存
          totalRepertory: Number(this.goodsMsg.totalGoods), // 活动总库存
          type: 3
        };
        res = fastestSave(data).then(res => {
          if (res.code === 200) {
            this.$message.success("提交成功");
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
        console.log("类目一", this.selectedCategoryMenu);
        // 第一个select框数据有子级则附到一级后面
        this.categoryMenuData.some(item => {
          // 从一级里面拿到二级
          if (item.id === id) {
            this.categoryMenuData2 = item.childList;
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
    .timeTips {
      display: inline-block;
      height: 18px;
      width: 300px;
      line-height: 18px;
      vertical-align: bottom;
      margin-left: 10px;
      margin-top: 10px;
    }
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
