<template>
  <div class="content-container">
    <!-- 运营管理 - 首页轮播图列表 - 新建 -->
    <div class="addslide">
      <div class="singlegroup">
        <div style="margin-bottom:20px;">
          <span class="slidetitle">终&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;端：</span>
          <el-select
            v-model="service"
            placeholder="请选择"
            style="width: 350px;"
            @change="clearFilledOption"
          >
            <el-option
              v-for="item in serviceOptions"
              :key="item.service"
              :label="item.lable"
              :value="item.service"
            ></el-option>
          </el-select>
        </div>
        <div v-if="service === 1 || service === 2">
          <span class="slidetitle">跳转类型：</span>
          <el-radio v-model="typesOf" :label="1" @click.native="showDetail">其他</el-radio>
          <el-radio v-model="typesOf" :label="2" @click.native="clearSelected">商品</el-radio>
        </div>

        <!-- 2.5新增 -->
        <div v-if="service === 3">
          <span class="slidetitle">跳转类型：</span>
          <el-radio v-model="jumpType" :label="1" value=1 @click.native="openAppGoodsList">APP内商品</el-radio>
          <el-radio v-model="jumpType" :label="2" value=2 @click.native="appOtherOption($event)">APP内其他页面</el-radio>
          <el-radio v-model="jumpType" :label="3" value=3 @click.native="h5OtherOption">H5页面</el-radio>
        </div>
      </div>
      <div v-if="boolean">
        <div class="singlegroup" v-if='newAdv==="2"'>
            <span class="slidetitle">广告名称：</span>
            <el-select v-model="goodsName" placeholder="选择商品后自动带出" @change="getLink">
                <el-option :label="item.label" :value="item.value" v-for='(item,index) in typeListOptions' :key='index'>
                </el-option>
            </el-select>
             <span class="limit">最多不超过20个字</span>
        </div>
        <div class="singlegroup" v-else>
          <span class="slidetitle">广告名称：</span>
          <el-input
            v-model.trim="goodsName"
            data-options="required:true"
            placeholder="请输入商品名称"
            class="entertitle"
            maxlength="20"
            style="width: 350px;"
            @keyup="checkLen2(value)"
          ></el-input>
          <span class="limit">最多不超过20个字</span>
        </div>
        
        <div class="singlegroup">
          <span class="slidetitle">跳转链接：</span>
          <el-input
            v-model.trim="goodsLink"
            placeholder="请输入链接"
            class="entertitle"
            style="width: 350px;"
          ></el-input>
          <span class="slidetitle">H5端示例格式：http://h5.test.hengqihj.com</span>
        </div>
        <div class="singlegroup pushpicture" v-show="service===1">
          <span class="slidetitle">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</span>
          <!-- 引用上传单张图片组件 -->
          <div class="slideImg">
            <img
              v-if="pictureStore.imgUrl"
              :src="pictureStore.imgUrl"
              style="width:100%;height:100%;display:inline-block"
            />
            <img v-else :src="NullImgFile" style="width: 100%; height: 100%;" />
          </div>
          <!-- on-progress -->
          <upload-single @successCBK="onSingleUploadSuccess">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传banner图片</el-button>
            <div style="color:red;margin-left:40px;padding-top:20px;">*图片最大尺寸：1920px X 500px</div>
          </upload-single>
        </div>

        <div class="singlegroup pushpicture" v-show="service===3">
          <span class="slidetitle">移动端图片：</span>
          <!-- 引用上传单张图片组件 -->
          <div class="slideImg">
            <img
              v-if="pictureStore.mobileUrl"
              :src="pictureStore.mobileUrl"
              style="width:100%;height:100%;display:inline-block"
            />
            <img v-else :src="NullImgFile" style="width: 100%; height: 100%;" />
          </div>
          <!-- on-progress -->
          <upload-single @successCBK="onSingleUploadSuccess2">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传banner图片</el-button>
            <br />
            <div style="color:red;margin-left:40px;padding-top:20px;">*图片最大尺寸：750px X 422px</div>
          </upload-single>
        </div>

        <div class="singlegroup pushpicture" v-show="service===2">
          <span class="slidetitle">h5端图片：</span>
          <!-- 引用上传单张图片组件 -->
          <div class="slideImg">
            <img
              v-if="pictureStore.h5Url"
              :src="pictureStore.h5Url"
              style="width:100%;height:100%;display:inline-block"
            />
            <img v-else :src="NullImgFile" style="width: 100%; height: 100%;" />
          </div>
          <!-- on-progress -->
          <upload-single @successCBK="onSingleUploadSuccess3">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传banner图片</el-button>
            <div style="color:red;margin-left:40px;padding-top:20px;">*图片最大尺寸：892px X 1156px</div>
          </upload-single>
        </div>
      </div>
      <div class="singlegroup settime">
        <span class="slidetitle">生效时间：</span>
        <span>
          <el-radio v-model="syncTime" label="1" class="time" @click.native="closeTime">立即生效</el-radio>
          <el-radio v-model="syncTime" label="2" class="time two" @click.native="showTime">设置生效时间</el-radio>
        </span>
        <!-- 点击生效时间出现选择日期 -->
        <div v-show="show" class="block">
          <el-date-picker
            v-model="setTime"
            :picker-options="pickerOptions0"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
          <span class="demonstration timerule">轮播设置到了生效时间才会正式生效</span>
        </div>
      </div>
      <div class="clbtn">
        <el-button @click.native="cancelSubmit">&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;</el-button>
        <el-button
          type="primary"
          class="sured"
          @click.native="addNewSlide"
        >&nbsp;&nbsp;确&nbsp;&nbsp;&nbsp;定&nbsp;&nbsp;</el-button>
      </div>
    </div>
    <!-- 点击选择商品出现的弹窗 -->
    <el-dialog :visible.sync="centerDialogVisible" title="选择商品" width="900px" left>
      <el-form :inline="true" :model="formInline" class="flex-center">
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
            placeholder="商品三级类目"
            @change="(val) => { onSelectedCategory(val, 3) }"
          >
            <el-option
              v-for="(item,index) in categoryMenuData3"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 以上是select选框 -->
        <el-form-item class="magin-left">
          <el-input
            :clearable="false"
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
      <el-row style="margin-top: 30px;">
        <el-col :span="24" center>
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="currentPage"
            :total="total"
            layout="prev, pager, next, jumper"
            class="simplepage"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-col :span="24" center>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            class="yes"
            @click="centerDialogVisible = false"
            @click.native="sendMessage"
          >确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 以上为点击选择商品出现的弹窗 -->
  </div>
</template>

<script>
import { getDialogGoodsList, slideAdd,getAppCategoryByName } from '@/api/operation';
import GoodsApi from '@/api/goods';
import uploadSingle from '@/components/Upload/single';
import NullImgFile from '@/assets/null.png';

export default {
  name: 'OperationManageSlideshowAdd',
  components: {
    uploadSingle,
  },
  data() {
    return {
      // 存放设置时间
      createTime: '',
      // 日期选择内容
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      // 其他
      typeOne: 1,
      // 商品
      typeTwo: 2,
      // 存放状态
      status: 1,
      // 立即生效
      status1: 1,
      // 设置时间
      status2: 2,
      loading: false,
      // 默认图片
      NullImgFile,
      // 图片存放的地方
      pictureStore: {
        imgUrl: '',
        mobileUrl: '',
        h5Url: '',
        jumpUrl: '',
        title: '',
      },
      jumpType:'',
      // 存放选中的单选框
      collectRadio: [],
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
      // 存放弹窗里面点击选择后的数据
      checkedMsg: {
        goodsCategoryName: '', // 商品名称（标题）
        id: '', // 商品id
      },
      // 获取所有的商品列表的数据
      allGoodsData: [],
      // 获取弹窗列表的数据
      getDialogData: [],
      categoryName: '',
      // 获取页码
      // 当前页
      currentPage: 1,
      // 每页长度
      pageSize: 6,
      // 共几页
      total: 10,
      totalPage: 10,
      dialogTotal: 10,
      pageNum: 1,
      typesOf:1,
      subtypesOf: '',
      syncTime: '1',
      imageUrl: '',
      // 商品名称/标题
      goodsName: '',
      // 跳转链接
      goodsLink: '',
      // 生效时间
      setTime: '',
      show: false,
      boolean: true,
      // 点击商品出现弹窗
      centerDialogVisible: false,
      // 文字输入框的字数限制
      txtlength: 20,
      // 这里放的是表单提交的数据
      formInline: {
        status: '课程一级类目',
        push: '课程二级类目',
        second: '课程三级类目',
        search: '', // 搜索框输入的内容
      },
      service: 3,
      newAdv:'',
      typeListOptions:[
          {
              label:'限时秒杀',
              value:1,
          },
           {
              label:'积分兑换',
              value:2,
          },
           {
              label:'爆款拼团',
              value:3,
          },
           {
              label:'发现',
              value:4,
          },
           {
              label:'学堂-推荐',
              value:5,
          },

      ],
      serviceOptions: [
        {
          service: 1,
          lable: 'PC',
        },
        {
          service: 2,
          lable: 'H5',
        },
        {
          service: 3,
          lable: 'App',
        },
      ],
    };
  },
  watch: {
    checkLen2(obj) {
      const maxChars = 20; // 最多字符数
      if (obj.value.length > maxChars) {
        alert('最多输入30个字符，现已超出限制，自动截取前20个字符！');
        obj.value = obj.value.substring(0, maxChars);
      }
    },
  },
  created() {
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
    });
    this.dialogAllData();
  },
  methods: {
    //获取链接----2.5-----
    getLink(){
        console.log(this.goodsName)
        getAppCategoryByName({name:this.goodsName}).then(res=>{
            this.goodsLink=res.result.skipLink;
        })
    },
    // 选择终端清空已填写项
    clearFilledOption() {
        // if(this.newAdv!==2){
      this.newAdv='';
      
      this.goodsName = '';
      this.goodsLink = '';
      this.pictureStore.imgUrl = '';
      this.pictureStore.mobileUrl = '';
      this.pictureStore.h5Url = '';
    },

    // 获取app商品列表
    openAppGoodsList() {
      this.newAdv='';
      this.selectedCategoryMenu = '';
      this.selectedCategoryMenu2 = '';
      this.selectedCategoryMenu3 = '';
      this.getDialogData.goodsCategoryName = '';
      this.checkedMsg = '';
      this.subtypesOf = '';
      this.centerDialogVisible = true;
    },

    // APP内其他商品
    appOtherOption(e) {
      this.goodsName='';
      this.newAdv=e.target.value;
      this.goodsName = '';
      this.goodsLink = '';
      this.pictureStore.imgUrl = '';
      this.pictureStore.mobileUrl = '';
      this.pictureStore.h5Url = '';

    },

    // H5页面
    h5OtherOption() {
      
      this.newAdv='';
      this.goodsName = '';
      this.goodsLink = '';
      this.pictureStore.imgUrl = '';
      this.pictureStore.mobileUrl = '';
      this.pictureStore.h5Url = '';
    },

    // 新建展示点击上传图片
    onSingleUploadSuccess(url) {
      this.pictureStore.imgUrl = url;
    },
    // 新建展示点击上传图片 - 移动端
    onSingleUploadSuccess2(url) {
      this.pictureStore.mobileUrl = url;
    },

    // 新建展示点击上传图片 - h5端
    onSingleUploadSuccess3(url) {
      this.pictureStore.h5Url = url;
    },

    // 获取弹窗数据
    dialogAllData() {
      const gategoods =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      const params = {
        pageNum: this.pageNum, // 页码
        pageSize: this.pageSize, // 每页条数
        name: this.categoryName, // 商品名称,
        goodsCategoryId: gategoods, // 商品id
        projectType: 1,
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

    // 选择类目和输入商品名称后搜索请求
    onSubmit() {
      const gategoods =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      const params = {
        pageNum: this.pageNum, // 页码
        pageSize: this.pageSize, // 每页条数
        goodsCategoryId: gategoods, // 商品id
        name: this.categoryName, // 商品名称
        projectType: 1,
      };
      getDialogGoodsList(params).then(res => {
        // 获取弹窗页面
        // 当前页面
        this.currentPage = res.result.currPage;
        this.pageSize = res.result.pageSize;
        this.total = res.result.totalCount;
        this.totalPage = res.result.totalPage;
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
      });
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
            this.selectedCategoryMenu2 = '';
            this.selectedCategoryMenu3 = '';
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
            this.selectedCategoryMenu3 = '';
            return true;
          }
          return false;
        });
      } else if (level === 3) {
        this.selectedCategoryMenu3 = id;
      }
    },

    // 弹窗里面的表格单选
    getCurrentRow(item) {
      this.checkedMsg = item;
    },

    // 选择好数据后点击确定发起请求
    sendMessage() {
      this.goodsName = '';
      this.goodsName = this.checkedMsg.name;
      this.goodsLink = this.checkedMsg.id || '';
    },

    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    // 点击设置时间
    showTime() {
      this.show = true;
    },

    // 点击立即生效
    closeTime() {
      this.show = false;
    },

    // 点击新建展示里面的checkbox其他清空商品信息
    showDetail() {
      this.boolean = true;
      this.goodsName = '';
      this.goodsLink = '';
      this.pictureStore.imgUrl = '';
      this.pictureStore.mobileUrl = '';
      this.pictureStore.h5Url = '';
    },

    // 再次点击商品清空选择
    clearSelected() {
      this.selectedCategoryMenu = '';
      this.selectedCategoryMenu2 = '';
      this.selectedCategoryMenu3 = '';
      this.getDialogData.goodsCategoryName = '';
      this.checkedMsg = '';
      this.subtypesOf = '';
      this.centerDialogVisible = true;
    },

    hideDetail() {
      this.boolean = false;
    },

    // 新建轮播写好参数后发请求
    async addNewSlide() {
      let res = null;
      if ((this.service!==3)&&(this.typesOf === '')) {
        this.$message.error('类型不能为空!');
        res = false;
      } else if (this.goodsName.length===0) {
        this.$message.error('展示标题不能为空!');
        res = false;
      } else if (!this.goodsLink.length===0) {
        this.$message.error('跳转链接不能为空!');
        res = false;
      } else if (!this.service) {
        this.$message.error('终端不能为空!');
      }
      // else if (!this.pictureStore.imgUrl.trim()) {
      //   this.$message.error("请选择上传的图片!");
      //   res = false;
      // } else if (!this.pictureStore.mobileUrl.trim()) {
      //   this.$message.error("请选择上传的移动端图片!");
      //   res = false;
      // } else if (!this.pictureStore.h5Url.trim()) {
      //   this.$message.error("请选择上传的h5端图片!");
      //   res = false;
      // }
      else {
        if (this.service === 1) {
          if (!this.pictureStore.imgUrl.trim()) {
            this.$message.error('请选择上传的图片!');
            res = false;
          } else {
            console.log('请求的数据');
            this.request();
          }
        } else if (this.service === 3) {
          if (!this.pictureStore.mobileUrl.trim()) {
            this.$message.error('请选择上传的移动端图片!');
            res = false;
          } else {
            console.log('请求的数据');
            this.request();
          }
        } else if (this.service === 2) {
          if (!this.pictureStore.h5Url.trim()) {
            this.$message.error('请选择上传的h5端图片!');
            res = false;
          } else {
            console.log('请求的数据');
            this.request();
          }
        }
      }
      // return res;
    },

    request() {
      // 请求需携带的参数
      const data = {
        imgUrl:
          this.pictureStore.imgUrl ||
          this.pictureStore.mobileUrl ||
          this.pictureStore.h5Url,
        jumpUrl: this.goodsLink,
        title: this.goodsName,
        typesOf: this.typesOf,
        type: Number(this.service),
      };
      
      if(this.service === 3){
          data.jumpType=this.jumpType;
        //   data.typesOf='';
      }else{
          data.jumpType='';
      }
      if (data.typesOf === 1) {
        data.goodsId = '';
      } else {
        data.goodsId = this.checkedMsg.id;
      }

      // 判断选择立即生效或设置生效时间
      if (Number(this.syncTime) === 2) {
        data.syncTime = this.setTime;
        data.effectiveType = 2;
      } else if (Number(this.syncTime) === 1) {
        data.effectiveType = 1;
      }
      // console.log('checkMsg', this.checkedMsg);
      // console.log('data', data);
      // return false;
      // debugger
      slideAdd(data).then(res => {
        this.$message.success('提交成功');
        this.resetForm();
        this.$store.dispatch('delView', this.$route);
        this.$router.go(-1);
      });
    },

    // 重置页面
    resetForm() {
      this.pictureStore.imgUrl = '';
      this.pictureStore.mobileUrl = '';
      this.goodsLink = '';
      this.goodsName = '';
      this.setTime = '';
      this.syncTime = '';
      this.subtypesOf = '';
      this.typesOf = '';
      this.showTime = false;
    },

    // 取消提交返回主页面
    cancelSubmit() {
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },

    // 弹窗页码
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页码
    handleCurrentChange(val) {
      this.pageNum = val;
      this.subtypesOf = '';
      this.dialogAllData();
    },
  },
};
</script>

<style lang="scss" scoped>
.addslide {
  padding: 10px 20px;
  font-size: 13px;
  .service {
    display: flex;
  }
  .slidetitle {
    width: 80px;
  }
  .singlegroup {
    margin-bottom: 25px;
    .slidetitle {
      margin-right: 20px;
    }
    .slideImg {
      position: relative;
      width: 288px;
      height: 160px;
      border: 1px solid #ccc;
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
