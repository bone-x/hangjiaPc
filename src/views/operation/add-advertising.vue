<template>
  <div class="content-container">
    <!-- 新建广告 -->
    <el-row style="margin-left:30px;">
      <el-col :span="8">
        <h3>新建广告</h3>
      </el-col>
    </el-row>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="130px"
    >
      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="广告位置："
            prop="position"
          >
            <el-select
              v-model="ruleForm.position"
              placeholder="请选择广告位置"
              style="width:500px"
            >
              <el-option
                v-for="item in positionList"
                :label="item.label"
                :key="item.index"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="跳转类型："
            prop="skipType"
          >
            <el-radio
              v-model="ruleForm.skipType"
              :label="1"
              @click.native="openGoodsList"
            >APP内商品</el-radio>
            <el-radio
              v-model="ruleForm.skipType"
              :label="2"
              @click.native="appOtherPagesLeft"
            >APP内其他页面</el-radio>
            <el-radio
              v-model="ruleForm.skipType"
              :label="3"
              @click.native="clearLeftOption"
            >H5页面</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="广告名称："
            prop="name"
          >
            <el-input
              v-if="ruleForm.skipType !== 2"
              v-model.trim="ruleForm.name"
              :placeholder="ruleForm.skipType === 1 ? '选择商品后自动带出' : ruleForm.skipType === 3 ? '自由输入' : '请输入广告名称'"
              maxlength="20"
              style="width: 500px"
            ></el-input>
            <el-select
              v-if="ruleForm.skipType === 2"
              v-model="ruleForm.name"
              placeholder="请选择"
              style="width: 500px"
              @change="getAppLeftLink"
            >
              <el-option
                v-for="item in adverNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span
              v-if="ruleForm.skipType === 1 || ruleForm.skipType === 3"
              style="margin-left: 10px; font-size: 12px; color: #949292"
            >最多不超过20个字</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="跳转链接："
            prop="skipLink"
          >
            <el-input
              v-model.trim="ruleForm.skipLink"
              :placeholder="ruleForm.leftLinkTitle"
              style="width: 500px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        align="left"
        v-if="ruleForm.position === 1"
      >
        <el-col :span="24">
          <el-form-item
            label="素材图片："
            prop="image"
          >
            <div class="slideImg">
              <div>
                <div>
                  <img
                    v-if="ruleForm.image"
                    :src="ruleForm.image"
                    style="width:96px;height:119px;display:inline-block"
                  />
                  <img
                    v-else
                    :src="DefaultImgFile"
                    style="width: 96px; height: 119px;"
                  />
                </div>
              </div>
              <div class="atention">
                <upload-single
                  :max-file-size="2"
                  :size="[750, 1080]"
                  @successCBK="onSingleUploadSuccess"
                >
                  <div class="chooseBtn">
                    <el-button
                      icon="el-icon-upload"
                      size="medium"
                    >上传图片</el-button>
                  </div>
                </upload-single>
                <p style="color: red; margin: 0px; line-height: 20px; font-size: 12px">图片大小：300k内</p>
                <p style="color: red; margin: 0px; font-size: 12px">图片尺寸： 750*1080 px</p>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        align="left"
        v-if="ruleForm.position === 0"
      >
        <el-col :span="24">
          <el-form-item
            label="素材图片："
            prop="image"
          >
            <div class="slideImg">
              <div>
                <div>
                  <img
                    v-if="ruleForm.image"
                    :src="ruleForm.image"
                    style="width:113px;height:119px;display:inline-block"
                  />
                  <img
                    v-else
                    :src="DefaultImgFile2"
                    style="width: 113px; height: 119px;"
                  />
                </div>
              </div>
              <div class="atention">
                <upload-single
                  :max-file-size="2"
                  :size="[596, 596]"
                  @successCBK="onSingleUploadSuccess"
                >
                  <div class="chooseBtn">
                    <el-button
                      icon="el-icon-upload"
                      size="medium"
                    >上传图片</el-button>
                  </div>
                </upload-single>
                <p style="color: red; margin: 0px; line-height: 20px; font-size: 12px">格式：png</p>
                <p style="color: red; margin: 0px; line-height: 20px; font-size: 12px">图片大小：250k内</p>
                <p style="color: red; margin: 0px; font-size: 12px">图片尺寸： 596*596 px</p>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="投放时间："
            prop="timeLimit"
          >
            <el-date-picker
              v-model="ruleForm.timeLimit"
              :default-time="['00:00:00', '23:59:59']"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 500px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        align="left"
        v-if="ruleForm.position === 1"
      >
        <el-col :span="24">
          <el-form-item
            label="显示时间："
            prop="displayOnceTime"
          >
            <span>默认显示{{ruleForm.displayOnceTime}}秒，无法编辑</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="每天显示次数："
            prop="displayDayTimes"
          >
            <el-input
              v-model.trim="ruleForm.displayDayTimes"
              style="width: 100px"
            ></el-input>
            <span style="margin-left: 10px">次</span>
            <span style="margin-left: 10px; color: red; font-size: 12px">（每天显示次数指：每一个自然日内，用户多次打开APP，只有前n次会出现广告，n次后不在显示广告；以自然日为分界；范围：1-99）</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="left">
        <el-col :span="24">
          <el-form-item
            label="状态："
            prop="status"
          >
            <el-radio
              v-model="ruleForm.status"
              :label="1"
            >上架</el-radio>
            <el-radio
              v-model="ruleForm.status"
              :label="0"
            >下架</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-top: 20px;">
        <el-button
          type="primary"
          @click.native="submitForm('ruleForm')"
        >确认</el-button>
        <el-button
          style="margin-left: 100px;"
          @click.native="goBack"
        >取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 商品弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="选择商品"
      width="900px"
      left
    >
      <el-form
        :inline="true"
        :model="dialogMsg"
        class="flex-center"
      >
        <!-- select选框部分 -->
        <el-form-item
          label
          style="width:150px;"
        >
          <el-select
            v-model="dialogMsg.selectedCategoryMenu"
            placeholder="商品一级类目"
            @change="(val) => { onSelectedCategory(val, 1) }"
          >
            <el-option
              v-for="(item, index) in dialogMsg.categoryMenuData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label
          style="width:150px;"
        >
          <el-select
            v-model="dialogMsg.selectedCategoryMenu2"
            placeholder="商品二级类目"
            @change="(val) => { onSelectedCategory(val, 2) }"
          >
            <el-option
              v-for="(item,index) in dialogMsg.categoryMenuData2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label
          style="width:150px;"
        >
          <el-select
            v-model="dialogMsg.selectedCategoryMenu3"
            placeholder="商品三级类目"
            @change="(val) => { onSelectedCategory(val, 3) }"
          >
            <el-option
              v-for="(item,index) in dialogMsg.categoryMenuData3"
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
            v-model="dialogMsg.goodsName"
            placeholder="商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item class="magin-left">
          <el-button
            icon="el-icon-search"
            @click.native="onSearchGoods"
          >搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格部分 -->
      <div class="centertable">
        <el-table
          :data="dialogMsg.goodsList"
          border
          size="small"
        >
          <el-table-column
            label
            width="50"
          >
            <template slot-scope="scope">
              <el-radio
                :label="scope.$index"
                v-model="dialogMsg.subtypesOf"
                @change.native="getCurrentRow(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品名称"
          ></el-table-column>
          <el-table-column
            prop="teacherNames"
            label="教师名称"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
          ></el-table-column>
        </el-table>
      </div>

      <!-- 分页选择 -->
      <el-row style="margin-top: 20px;">
        <el-col
          :span="24"
          center
        >
          <el-pagination
            :current-page.sync="dialogMsg.pageNum"
            :page-size="dialogMsg.pageSize"
            :total="dialogMsg.totalCount"
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-col>
      </el-row>

      <el-row
        :gutter="20"
        type="flex"
        align="middle"
        justify="center"
        style="margin-top: 30px;"
      >
        <el-col
          :span="6"
          center
        >
          <el-button @click="centerDialogVisible = false">取消</el-button>
        </el-col>
        <el-col
          :span="6"
          center
        >
          <el-button
            type="primary"
            @click.native="onGoodsWindowConfirm"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { goodsCategoryAll } from '@/api/goods';
import {
  getDialogGoodsList,
  createAppAdvertisment,
  getAppJumpLink,
} from '@/api/operation';
import uploadSingle from '@/components/Upload/single';
import DefaultImgFile from '@/assets/default.png';
import DefaultImgFile2 from '@/assets/default2.png';

export default {
  name: 'AddAdvertising',
  components: {
    uploadSingle,
  },
  data() {
    const validatorCountType = (
      value,
      callback,
      errTips = '请输入1-99的正整数'
    ) => {
      var reg = /^[1-9][0-9]?$/;
      if (!reg.test(value)) {
        callback(new Error(errTips));
      } else {
        callback();
      }
    };
    return {
      DefaultImgFile,
      DefaultImgFile2,
      ruleForm: {
        leftLinkTitle: '请输入跳转链接',
        position: 1,
        name: '',
        skipType: '',
        skipLink: '',
        image: '',
        timeLimit: [],
        showStartTime: '',
        showEndTime: '',
        displayOnceTime: 4,
        displayDayTimes: '',
        status: '',
        bandGoodsId: null,
      },
      rules: {
        position: [{ required: true, message: '请选择广告位置' }],
        name: [{ required: true, message: '请选择输入广告名称' }],
        skipLink: [{ required: true, message: '请选择输入跳转链接' }],
        image: [{ required: true, message: '请上传图片', trigger: 'change' }],
        timeLimit: [{ required: true, message: '请选择投放时间' }],
        displayDayTimes: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatorCountType(value, callback, '请正确输入显示次数');
            },
            trigger: 'change',
          },
        ],
        skipType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      positionList: [
        {
          label: 'APP启动大图',
          value: 1,
        },
        {
          label: 'APP弹窗广告',
          value: 0,
        },
      ],
      dialogMsg: {
        pageNum: 1,
        pageSize: 6,
        totalCount: 10,
        categoryMenuData: [],
        categoryMenuData2: [],
        categoryMenuData3: [],
        selectedCategoryMenu: '',
        selectedCategoryMenu2: '',
        selectedCategoryMenu3: '',
        goodsName: '',
        subtypesOf: '',
        goodsList: [],
        selectedGoods: {},
      },
      adverNameList: [
        {
          label: '限时秒杀',
          value: 1,
        },
        {
          label: '积分兑换',
          value: 2,
        },
        {
          label: '爆款拼团',
          value: 3,
        },
        {
          label: '发现',
          value: 4,
        },
        {
          label: '学堂-推荐',
          value: 5,
        },
      ],
      centerDialogVisible: false,
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'onRouteChange',
  },
  created() {
    this.getGoodsAllCategory();
    this.getGoodsList();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'AppAdvertisingManage') {
        this.getGoodsAllCategory();
        this.getGoodsList();
      }
    },

    // APP内其他页面下拉数据选择
    getAppLeftLink() {
      const params = {
        skipType: 2,
        name: this.ruleForm.name,
      };
      getAppJumpLink(params).then(res => {
        this.ruleForm.skipLink = res.result.skipLink;
      });
    },

    // APP内其他页面
    appOtherPagesLeft() {
      this.ruleForm.leftLinkTitle = '选择广告名称后自动带出';
      this.ruleForm.name = '';
      this.ruleForm.skipLink = '';
      this.ruleForm.bandGoodsId = null;
    },

    // 点击APP商品类型
    openGoodsList() {
      this.ruleForm.leftLinkTitle =
        '选择商品后自动带出商品id，并自动拼好跳转链接';
      this.ruleForm.name = '';
      this.ruleForm.skipLink = '';
      this.dialogMsg.subtypesOf = '';
      this.centerDialogVisible = true;
      this.dialogMsg.selectedCategoryMenu = '';
      this.dialogMsg.selectedCategoryMenu2 = '';
      this.dialogMsg.selectedCategoryMenu3 = '';
      this.dialogMsg.goodsName = '';
      this.getGoodsList();
    },

    // 获取所有类目
    getGoodsAllCategory() {
      goodsCategoryAll().then(res => {
        this.dialogMsg.categoryMenuData = [...res.result];
      });
    },

    // 选择类目
    onSelectedCategory(id, level) {
      if (level === 1) {
        this.dialogMsg.selectedCategoryMenu = id;
        // 第一个select框数据有子级则附到一级后面
        this.dialogMsg.categoryMenuData.some(item => {
          // 从一级里面拿到二级
          if (item.id === id) {
            this.dialogMsg.categoryMenuData2 = item.childList;
            this.dialogMsg.selectedCategoryMenu2 = '';
            this.dialogMsg.selectedCategoryMenu3 = '';
            return true;
          }
          return false;
        });
        // 清空三级
        this.dialogMsg.categoryMenuData3 = [];
      } else if (level === 2) {
        this.dialogMsg.selectedCategoryMenu2 = id;
        this.dialogMsg.categoryMenuData2.some(item => {
          // 从二级里面拿到三级
          if (item.id === id) {
            this.dialogMsg.categoryMenuData3 = item.childList;
            this.dialogMsg.selectedCategoryMenu3 = '';
            return true;
          }
          return false;
        });
      } else if (level === 3) {
        this.dialogMsg.selectedCategoryMenu3 = id;
      }
    },

    // 获取商品列表
    async getGoodsList(pageNum = 1) {
      const gategoods =
        this.dialogMsg.selectedCategoryMenu3 ||
        this.dialogMsg.selectedCategoryMenu2 ||
        this.dialogMsg.selectedCategoryMenu;
      const params = {
        pageNum, // 页码
        pageSize: this.dialogMsg.pageSize, // 每页条数
        name: this.dialogMsg.categoryName, // 商品名称,
        goodsCategoryId: gategoods, // 商品id
        projectType: 1,
      };
      const res = await getDialogGoodsList(params);
      if (res.code !== 200) return Promise.reject();
      this.dialogMsg.goodsList = res.result.list;
      this.dialogMsg.pageNum = res.result.currPage;
      this.dialogMsg.totalCount = res.result.totalCount;
    },

    // 弹窗分页
    handleCurrentChange(pageNum = 1) {
      this.getGoodsList(pageNum);
      this.dialogMsg.subtypesOf = '';
    },

    // 选中当前行
    getCurrentRow(row) {
      this.dialogMsg.selectedGoods = row;
    },

    // 确定选中商品
    onGoodsWindowConfirm() {
      if (this.dialogMsg.selectedGoods) {
        this.ruleForm.name = this.dialogMsg.selectedGoods.name;
        this.ruleForm.skipLink = this.dialogMsg.selectedGoods.id;
        this.ruleForm.bandGoodsId = this.dialogMsg.selectedGoods.id;
        this.centerDialogVisible = false;
      } else {
        this.$message.error('请选择商品！');
        return false;
      }
    },

    // 类型 - 其他
    clearLeftOption() {
      this.ruleForm.leftLinkTitle = '自由输入';
      this.ruleForm.name = '';
      this.ruleForm.skipLink = '';
      this.ruleForm.bandGoodsId = null;
    },

    // 上传图片
    onSingleUploadSuccess(url) {
      this.ruleForm.image = url;
    },

    // 保存
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          const options = {
            position: this.ruleForm.position,
            name: this.ruleForm.name,
            skipType: this.ruleForm.skipType,
            skipLink: this.ruleForm.skipLink,
            image: encodeURIComponent(this.ruleForm.image),
            showStartTime: this.ruleForm.timeLimit[0],
            showEndTime: this.ruleForm.timeLimit[1],
            displayOnceTime: this.ruleForm.displayOnceTime,
            displayDayTimes: Number(this.ruleForm.displayDayTimes),
            status: this.ruleForm.status,
            bandGoodsId: this.ruleForm.bandGoodsId,
          };
          createAppAdvertisment(options).then(res => {
            this.$message.success('新建成功！');
            this.goBack();
            this.resetForm();
          });
        } else {
          return false;
        }
      });
    },

    // 重置
    resetForm() {
      this.ruleForm.position = 1;
      this.ruleForm.name = null;
      this.ruleForm.skipType = null;
      this.ruleForm.skipLink = null;
      this.ruleForm.image = null;
      this.ruleForm.timeLimit = [];
      this.ruleForm.showStartTime = null;
      this.ruleForm.showEndTime = null;
      this.ruleForm.displayOnceTime = 4;
      this.ruleForm.displayDayTimes = null;
      this.ruleForm.status = null;
      this.ruleForm.bandGoodsId = null;
    },

    // 取消
    goBack() {
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.content-container {
  .slideImg {
    display: flex;
    margin-bottom: 20px;
    .atention {
      width: 55%;
      margin-left: 40px;
    }
    .chooseBtn {
      margin-bottom: 15px;
    }
  }
}
</style>