<template>
  <div class="content-container">
    <!-- 运营管理 - 首页轮播图列表 - 新建大家在学 -->
    <div class="addslide">
      <div class="singlegroup">
        <span class="slidetitle">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</span>
        <el-button type="primary" plain class="el-icon-circle-plus" @click.native="clearSelected"> 选择商品</el-button>
        <!-- 点击选择商品出现的弹窗 -->
        <el-dialog :visible.sync="centerDialogVisible" title="选择商品" width="1000px" left>
          <div>
            <el-form ref="validate" :inline="true" :model="formInline" class="flex-center">
              <!-- select选框部分 -->
              <el-form-item label style="width:150px;">
                <el-select
                  v-model="selectedCategoryMenu"
                  placeholder="商品一级类目"
                  @change="(val) => { onSelectedCategory(val, 1) }"
                >
                  <el-option
                    v-for="(item, index) in categoryMenuData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label style="width:150px;">
                <el-select
                  v-model="selectedCategoryMenu2"
                  placeholder="商品二级类目"
                  @change="(val) => { onSelectedCategory(val, 2) }"
                >
                  <el-option
                    v-for="(item, index) in categoryMenuData2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label style="width:150px;">
                <el-select
                  v-model="selectedCategoryMenu3"
                  placeholder="商品三级类目"
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
              <!-- 以上是select选框 -->
              <el-form-item class="magin-left">
                <el-input
                  :loading="loading"
                  v-model="categoryName"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="商品名称"
                ></el-input>
              </el-form-item>
              <el-form-item class="magin-left">
                <el-button icon="el-icon-search" @click.native="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 表格部分 -->
          <div class="centertable">
            <el-table :data="getDialogData" border size="small">
              <el-table-column label width="50">
                <template slot-scope="scope">
                  <el-radio
                    :label="scope.$index"
                    v-model="subtypesOf"
                    @change.native="getCurrentRow(scope.row)"
                  >&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称"></el-table-column>
              <el-table-column prop="teacherNames" label="教师名称"></el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
            </el-table>
          </div>

          <!-- 分页选择 -->
          <div class="pageblock">
            <el-pagination
              :page-size="pageSize"
              :total="total"
              :current-page.sync="currentPage"
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
              @click.native="() => { centerDialogVisible = false, sendMessage() }"
            >确 定</el-button>
          </span>
        </el-dialog>
        <!-- 以上为点击选择商品出现的弹窗 -->
      </div>

      <!-- 商品名称、跳转链接、图片路径、生效时间 -->
      <div v-if="boolean">
        <div class="singlegroup">
          <span class="slidetitle">展示标题：</span>
          <el-input
            v-model="singleData.title"
            data-options="required:true"
            placeholder="商品名称"
            class="entertitle"
            maxlength="20"
            disabled
            @keyup="checkLen2(value)"
          ></el-input>
        </div>
        <div class="singlegroup">
          <span class="slidetitle">跳转链接：</span>
          <el-input v-model="singleData.jumpUrl" disabled placeholder="商品详情页链接" class="entertitle"></el-input>
        </div>
        <div class="singlegroup pushpicture">
          <span class="slidetitle">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</span>
          <!-- 引用上传单张图片组件 -->
          <div
            style="position:relative;margin-left:10px;width:288px;height:160px;border:1px solid #ccc"
          >
            <img
              v-if="singleData.imgUrl"
              :src="singleData.imgUrl"
              style="width:100%;height:100%;display:inline-block"
            >
            <img v-else :src="NullImgFile" style="width: 100%; height: 100%;">
          </div>
          <!-- on-progress -->
          <upload-single @successCBK="onSingleUploadSuccess">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传商品动态图片</el-button>
          </upload-single>
        </div>
      </div>
      <div class="singlegroup settime">
        <span class="slidetitle">生效时间：</span>
        <el-radio v-model="syncTime" label="1" class="time" @click.native="closeTime">立即生效</el-radio>
        <el-radio v-model="syncTime" label="2" class="time two" @click.native="showTime">设置生效时间</el-radio>
        <!-- 点击生效时间出现选择日期 -->
        <div v-show="show" class="block">
          <el-date-picker
            v-model="singleData.syncTime"
            :picker-options="pickerOptions0"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            @change="dateTimeChange"
          ></el-date-picker>
          <span class="demonstration timerule">轮播设置到了生效时间才会正式生效</span>
        </div>
      </div>

      <!-- 以上商品名称、跳转链接、图片路径、生效时间 -->
      <div class="clbtn">
        <el-button @click.native="cancelSubmit">&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;</el-button>
        <el-button
          type="primary"
          class="sured"
          @click.native="changeSlide"
        >&nbsp;&nbsp;确&nbsp;&nbsp;&nbsp;定&nbsp;&nbsp;</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDialogGoodsList, checkAllStudyId, allStudyUpdate } from "@/api/operation";
import GoodsApi from "@/api/goods";
import uploadSingle from "@/components/Upload/single";
import NullImgFile from "@/assets/null.png";
import { setTimeout } from "timers";

export default {
  name: "OperationManageSlideshowAllEdit",
  components: {
    uploadSingle
  },
  data() {
    return {
      // 弹窗里面单条数据存放
      validateRule: [
        { required: true, message: "域名不能为空", trigger: "blur" }
      ],
      singleGoods: '',
      onlyId: null, // 存放需提交的id
      // 存放弹窗里面点击选择后的数据
      checkedMsg: {
        goodsCategoryName: "", // 商品名称（标题）
        id: "" // 商品id
      },
      // 点击其他或商品的单选
      typesOf: "",
      subtypesOf: "",
      // 点击生效时间或设置时间的单选
      syncTime: "1",
      // 设置生效时间
      setTime: "",
      // 日期选择内容
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      // 默认图片
      NullImgFile,
      // 生效时间状态
      status: [1, 2],
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

      // 获取所有的商品列表的数据
      allGoodsData: [],
      getDialogData: [],
      categoryName: "",
      // 获取页码
      // 当前页
      currentDialogPage: null,
      // 每页长度
      dialogPageSize: null,
      // 共几页
      total: 10,
      currentPage: 1,
      pageNum: 1,
      pageSize: 6,
      dialogTotal: 10,
      totalPage: 10,
      showpage: false,
      // 接收来自首页轮播的单条数据
      getdatas: {},
      goodsInfo: {
        title: "",
        imgUrl: "",
        syncTime: "",
        status: ""
      },
      singleData: {
        title: "",
        imgUrl: "",
        syncTime: "",
        status: ""
      },
      radio: "1",
      radio2: "5",
      input1: "",
      input2: "",
      imageUrl: "",
      value1: "",
      show: false,
      boolean: true,
      // 点击商品出现弹窗
      centerDialogVisible: false,
      // 文字输入框的字数限制
      txtlength: 20,
      // 这里放的是表单提交的数据
      formInline: {
        status: "课程一级类目",
        push: "课程二级类目",
        second: "课程三级类目",
        search: "" // 搜索框输入的内容
      },

      options4: [],
      list: [],
      loading: false,
      currentPage3: 5,
      states: [
        // 这里的数据是从后端拿到的
        "Alabama",
        "Alaska",
        "Arizona",
        "Connecticut",
        "Delaware",
        "Florida",
        "Wyoming"
      ]
    };
  },
  watch: {
    checkLen2(obj) {
      const maxChars = 20; // 最多字符数
      if (obj.value.length > maxChars) {
        alert("最多输入0个字符，现已超出限制，自动截取前20个字符！");
        obj.value = obj.value.substring(0, maxChars);
      }
    }
  },
  created() {
    this.getSingleData();
    // 商品列表请求
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
      res.result.forEach(item => {
      });
    });
    this.getDialogGoods();
  },
  mounted() {
    this.showpage = true;
  },
  destroyed() {
    this.showpage = false;
  },

  methods: {
    // 新建展示点击上传图片
    onSingleUploadSuccess(url) {
      this.singleData.imgUrl = url;
    },

    // 选择类目
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

    // 弹窗的商品列表
    getDialogGoods() {
      const gategoods =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      const params = {
        pageNum: this.pageNum, // 页码
        pageSize: this.pageSize, // 每页条数
        goodsCategoryId: gategoods, // 商品id
        name: this.categoryName, // 商品名称
        projectType: 1
      };
      getDialogGoodsList(params).then(res => {
        // 获取弹窗页面
        // 当前页面
        this.currentPage = res.result.currPage;
        this.pageSize = res.result.pageSize || 6;
        this.total = res.result.totalCount;
        this.totalPage = res.result.totalPage;
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
      });
    },

    // 接收大家在学的路由传参
    getSingleData() {
      // 获取当前页面接收到的id
      const getGoodsId = this.$route.params.id;
      if (getGoodsId) {
        checkAllStudyId(getGoodsId).then(res => {
          this.singleData = res.result;
          this.typesOf = res.result.typesOf.toString();
        });
      }
    },

    dateTimeChange(date) {
      this.singleData.syncTime = date;
    },

    // 弹窗里面的搜索
    onSubmit() {
      this.getDialogGoods();
    },

    // 弹窗表格里面的单选
    getCurrentRow(item) {
      this.singleGoods = item;
    },

    // 再次点击商品清空选择
    clearSelected() {
      this.selectedCategoryMenu = "";
      this.selectedCategoryMenu2 = "";
      this.selectedCategoryMenu3 = "";
      this.getDialogData.goodsCategoryName = "";
      this.singleGoods = "";
      this.subtypesOf = "";
      this.centerDialogVisible = true;
    },

    // 点击弹窗的确定清空其他里面的数据
    sendMessage() {
      if (!this.singleGoods.id) {
        return false;
      }
      // 先清空标题再填充
      this.singleData.title = "";
      // 商品名称/标题
      this.singleData.title = this.singleGoods.name;
      // 跳转链接
      this.singleData.jumpUrl = this.singleGoods.carouselUrl;
    },

    // 弹窗里面的设置时间显示与隐藏
    showTime(item) {
      this.show = true;
    },
    closeTime() {
      this.show = false;
    },

    // 点击新建展示里面的其他
    showDetail() {
      this.boolean = true;
    },

    hideDetail() {
      this.boolean = false;
    },

    // 编辑完点击确定请求
    async changeSlide() {
      // debugger
      let res = null;
      if (!this.singleData.title.trim()) {
        this.$message.error("展示标题不能为空!");
        res = false;
      } else if (!this.singleData.jumpUrl.trim()) {
        this.$message.error("跳转链接不能为空!");
        res = false;
      } else if (!this.singleData.imgUrl.trim()) {
        this.$message.error("请选择上传的图片!");
        res = false;
      } else {
        // 编辑没有选择商品选择原来数据的goodsId,选择了商品选择当条数据的id
        if (this.singleGoods === '') {
          this.onlyId = this.singleData.goodsId;
        } else {
          this.onlyId = this.singleGoods.id;
        }
        const data = {
          id: Number(this.$route.params.id),
          imgUrl: this.singleData.imgUrl,
          jumpUrl: this.singleData.jumpUrl,
          title: this.singleData.title,
          syncTime: this.singleData.syncTime,
          typesOf: 2,
          goodsId: this.onlyId,
        };

        if (Number(this.syncTime) === 2) {
          // data.syncTime = this.setTime;
          data.effectiveType = 2;
        } else if (Number(this.syncTime) === 1) {
          data.effectiveType = 1;
        }

        res = allStudyUpdate(data).then(res => {
          this.$router.go(-1);
        });
      }
      return res;
    },

    // 取消提交返回主页面
    cancelSubmit() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },


    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 弹窗里面分页
    handleSizeChange(val) {
      this.dialogPageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.subtypesOf = "";
      this.getDialogGoods();
    },
  }
};
</script>

<style lang="less" scoped>
.addslide {
  padding: 10px 20px;
  font-size: 13px;
  .singlegroup {
    margin-bottom: 25px;
    .slidetitle {
      margin-right: 20px;
    }
    // 上传图片的样式
    .avatar-uploader .el-upload {
      // border: 1px dashed #d9d9d9;
      border: 1px dashed #ccc;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 3px;
      margin-left: 5px;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .pushbanner {
      line-height: 30px;
      color: #949292;
      margin-left: 20px;
    }
    // 以上是上传图片的样式
    .entertitle {
      width: 150px;
      margin-right: 20px;
    }
    .limit {
      color: #949292;
    }
  }
  .pushpicture,
  .settime {
    display: flex;
  }
  .settime {
    line-height: 36px;
    .time {
      display: inline-block;
      line-height: 36px;
    }
    .two {
      margin-right: 20px;
    }
    .timerule {
      color: #949292;
      margin-left: 20px;
    }
  }
  .clbtn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding-right: 200px;
    .sured {
      margin-left: 100px;
    }
  }
  .el-dialog__body {
    padding: 30px 30px 0px 30px;
  }
  .singleselect {
    width: 100px;
  }
  .pageblock {
    display: flex;
    justify-content: center;
    padding: 30px 0 0 0;
  }
  .block {
    display: flex;
    justify-content: center;
    // padding: 30px 0 0 0;
  }
  .expries {
    padding: 0;
  }
  .sure {
    display: flex;
    justify-content: center;
    .yes {
      margin-left: 100px;
    }
  }
}
</style>

