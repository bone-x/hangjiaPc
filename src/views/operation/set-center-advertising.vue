<template>
  <div class="content-container">
    <el-row>
      <el-col :span="8">
        <h3>设置首页中部广告位</h3>
      </el-col>
    </el-row>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="118px"
      style="margin-top: 20px;"
    >
      <div class="box-border">
        <div class="top-advertising">
          <h4 class="leftAdvertising">左广告位设置</h4>
          <el-row align="left">
            <el-col :span="24">
              <el-form-item
                label="跳转类型："
                prop="leftType"
              >
                <el-radio
                  v-model="ruleForm.leftType"
                  :label="1"
                  @click.native="openGoodsList(1)"
                >APP内商品</el-radio>
                <el-radio
                  v-model="ruleForm.leftType"
                  :label="2"
                  @click.native="appOtherPagesLeft"
                >APP内其他页面</el-radio>
                <el-radio
                  v-model="ruleForm.leftType"
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
                prop="leftTitle"
              >
                <el-input
                  v-if="ruleForm.leftType !== 2"
                  v-model="ruleForm.leftTitle"
                  :placeholder="ruleForm.leftType === 1 ? '选择商品后自动带出' : '自由输入'"
                  maxlength="20"
                  style="width: 500px"
                ></el-input>
                <el-select
                  v-if="ruleForm.leftType === 2"
                  v-model="ruleForm.leftTitle"
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
                  v-if="ruleForm.leftType === 1 || ruleForm.leftType === 3"
                  style="margin-left: 10px; font-size: 12px; color: #949292"
                >最多不超过20个字</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row align="left">
            <el-col :span="24">
              <el-form-item
                label="跳转链接："
                prop="leftLink"
              >
                <el-input
                  v-model="ruleForm.leftLink"
                  :placeholder="ruleForm.leftLinkTitle"
                  style="width: 500px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row align="left">
            <el-col :span="24">
              <el-form-item
                label="图片素材："
                prop="leftImg"
              >
                <div class="slideImg">
                  <div>

                    <div>
                      <img
                        v-if="ruleForm.leftImg"
                        :src="ruleForm.leftImg"
                        style="width:150px;height:90px;display:inline-block"
                      />
                      <img
                        v-else
                        :src="NullImgFile"
                        style="width: 150px; height: 90px;"
                      />
                    </div>
                  </div>
                  <div class="atention">
                    <upload-single
                      :max-file-size="2"
                      :size="[330, 186]"
                      @successCBK="onSingleUploadSuccessLeft"
                    >
                      <div class="chooseBtn">
                        <el-button
                          icon="el-icon-upload"
                          size="medium"
                        >上传图片</el-button>
                      </div>
                    </upload-single>
                    <p style="margin: 0px">图片尺寸： 330*186 px</p>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="center-border"></div>
        </div>
        <div class="bottom-advertising">
          <el-row align="left">
            <el-col :span="24">
              <h4 class="leftAdvertising">右广告位设置</h4>
              <el-row align="left">
                <el-col :span="24">
                  <el-form-item
                    label="跳转类型："
                    prop="rightType"
                  >
                    <el-radio
                      v-model="ruleForm.rightType"
                      :label="1"
                      @click.native="openGoodsList(2)"
                    >APP内商品</el-radio>
                    <el-radio
                      v-model="ruleForm.rightType"
                      :label="2"
                      @click.native="appOtherPagesRight"
                    >APP内其他页面</el-radio>
                    <el-radio
                      v-model="ruleForm.rightType"
                      :label="3"
                      @click.native="clearRightOption"
                    >H5页面</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row align="left">
                <el-col :span="24">
                  <el-form-item
                    label="广告名称："
                    prop="rightTitle"
                  >
                    <el-input
                      v-if="ruleForm.rightType !== 2"
                      v-model="ruleForm.rightTitle"
                      :placeholder="ruleForm.rightType === 1 ? '选择商品后自动带出' : '自由输入'"
                      maxlength="20"
                      style="width: 500px"
                    ></el-input>
                    <el-select
                      v-if="ruleForm.rightType === 2"
                      v-model="ruleForm.rightTitle"
                      placeholder="请选择"
                      style="width: 500px"
                      @change="getAppRightLink"
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
                      v-if="ruleForm.rightType === 1 || ruleForm.rightType === 3"
                      style="margin-left: 10px; font-size: 12px; color: #949292"
                    >最多不超过20个字</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row align="left">
                <el-col :span="24">
                  <el-form-item
                    label="跳转链接："
                    prop="rightLink"
                  >
                    <el-input
                      v-model="ruleForm.rightLink"
                      :placeholder="ruleForm.rightLinkTitle"
                      style="width: 500px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row align="left">
                <el-col :span="24">
                  <el-form-item
                    label="图片素材："
                    prop="rightImg"
                  >
                    <div class="slideImg">
                      <div>
                        <div>
                          <img
                            v-if="ruleForm.rightImg"
                            :src="ruleForm.rightImg"
                            style="width:150px;height:90px;display:inline-block"
                          />
                          <img
                            v-else
                            :src="NullImgFile"
                            style="width: 150px; height: 90px;"
                          />
                        </div>
                      </div>
                      <div class="atention">
                        <upload-single
                          :max-file-size="2"
                          :size="[330, 186]"
                          @successCBK="onSingleUploadSuccessRight"
                        >
                          <div class="chooseBtn">
                            <el-button
                              icon="el-icon-upload"
                              size="medium"
                            >上传图片</el-button>
                          </div>
                        </upload-single>
                        <p style="margin: 0px">图片尺寸： 330*186 px</p>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-form-item style="margin-top: 30px;">
        <el-button
          type="primary"
          @click.native="submitForm('ruleForm')"
        >保存</el-button>
        <el-button
          type="primary"
          plain
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
  setHomePageAdvertisment,
  appAdvertismentTemplate,
  getAppJumpLink,
} from '@/api/operation';
import uploadSingle from '@/components/Upload/single';
import NullImgFile from '@/assets/null.png';

export default {
  name: 'SetCenterAdvertising',
  components: {
    uploadSingle,
  },
  data() {
    return {
      NullImgFile,
      ruleForm: {
        leftLinkTitle: '请输入跳转链接',
        leftId: null,
        leftPosition: '',
        leftType: '',
        leftTitle: '',
        leftLink: '',
        leftImg: '',
        leftGoodsId: null,
        rightLinkTitle: '请输入跳转链接',
        rightId: null,
        rightPosition: '',
        rightType: '',
        rightTitle: '',
        rightLink: '',
        rightImg: '',
        rightGoodsId: null,
        selectedDerection: '',
      },
      rules: {
        leftType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' },
        ],
        leftTitle: [{ required: true, message: '请输入展示标题' }],
        leftLink: [{ required: true, message: '请输入跳转链接' }],
        leftImg: [{ required: true, message: '请上传图片' }],
        rightType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' },
        ],
        rightTitle: [{ required: true, message: '请输入展示标题' }],
        rightLink: [{ required: true, message: '请输入跳转链接' }],
        rightImg: [{ required: true, message: '请上传图片' }],
      },
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
        selectedLeftGoods: {},
        selectedRightGoods: {},
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
  created() {
    this.getAdvertimentDetails();
    this.getGoodsAllCategory();
    this.getGoodsList();
  },
  methods: {
    // 获取广告详情
    async getAdvertimentDetails() {
      const res = await appAdvertismentTemplate();
      if (res.code !== 200) return Promise.error();
      const leftMsg = res.result[0];
      const rightMsg = res.result[1];
      this.ruleForm.leftId = leftMsg.id;
      this.ruleForm.leftPosition = leftMsg.position;
      this.ruleForm.leftType = leftMsg.skipType;
      if (leftMsg.skipType === 2) {
        this.adverNameList.map(item => {
          if (Number(leftMsg.title) === item.value) {
            this.ruleForm.leftTitle = item.label;
          }
          return this.ruleForm.leftTitle;
        });
      } else {
        this.ruleForm.leftTitle = leftMsg.title;
      }
      this.ruleForm.leftLink = leftMsg.skipLink;
      this.ruleForm.leftImg = decodeURIComponent(leftMsg.image);
      this.ruleForm.leftGoodsId = leftMsg.bandGoodsId;

      this.ruleForm.rightId = rightMsg.id;
      this.ruleForm.rightPosition = rightMsg.position;
      this.ruleForm.rightType = rightMsg.skipType;
      if (rightMsg.skipType === 2) {
        this.adverNameList.map(item => {
          if (Number(rightMsg.title) === item.value) {
            this.ruleForm.rightTitle = item.label;
          }
          return this.ruleForm.rightTitle;
        });
      } else {
        this.ruleForm.rightTitle = rightMsg.title;
      }
      this.ruleForm.rightLink = rightMsg.skipLink;
      this.ruleForm.rightImg = decodeURIComponent(rightMsg.image);
      this.ruleForm.rightGoodsId = rightMsg.bandGoodsId;
    },

    // left -> APP内其他页面获取链接
    getAppLeftLink() {
      const params = {
        skipType: 2,
        name: this.ruleForm.leftTitle,
      };
      getAppJumpLink(params).then(res => {
        this.ruleForm.leftLink = res.result.skipLink;
      });
    },

    // left -> APP内其他页面获取链接
    getAppRightLink() {
      const params = {
        skipType: 2,
        name: this.ruleForm.rightTitle,
      };
      getAppJumpLink(params).then(res => {
        this.ruleForm.rightLink = res.result.skipLink;
      });
    },

    // 上传图片 -> 左
    onSingleUploadSuccessLeft(url) {
      this.ruleForm.leftImg = url;
    },

    // 上传图片 -> 右
    onSingleUploadSuccessRight(url) {
      this.ruleForm.rightImg = url;
    },

    appOtherPagesLeft() {
      this.ruleForm.leftLinkTitle = '选择广告名称后自动带出';
      this.ruleForm.leftTitle = '';
      this.ruleForm.leftLink = '';
      this.ruleForm.leftGoodsId = null;
    },

    // right -> APP内其他页面
    appOtherPagesRight() {
      this.ruleForm.rightLinkTitle = '选择广告名称后自动带出';
      this.ruleForm.rightTitle = '';
      this.ruleForm.rightLink = '';
      this.ruleForm.rightGoodsId = null;
    },

    // left -> 类型 - 其他
    clearLeftOption() {
      this.ruleForm.leftLinkTitle = '自由输入';
      this.ruleForm.leftTitle = '';
      this.ruleForm.leftLink = '';
      this.ruleForm.leftGoodsId = null;
    },

    // right -> 类型 -> 其他
    clearRightOption() {
      this.ruleForm.rightLinkTitle = '自由输入';
      this.ruleForm.rightTitle = '';
      this.ruleForm.rightLink = '';
      this.ruleForm.rightGoodsId = null;
    },

    // left -> 类型 - 商品
    openGoodsList(item) {
      console.log(item);
      this.selectedDerection = item;
      if (item === 1) {
        if (this.ruleForm.leftGoodsId) {
          this.ruleForm.leftLinkTitle =
            '选择商品后自动带出商品id，并自动拼好跳转链接';
          this.getGoodsList();
          this.dialogMsg.selectedCategoryMenu = '';
          this.dialogMsg.selectedCategoryMenu2 = '';
          this.dialogMsg.selectedCategoryMenu3 = '';
          this.dialogMsg.goodsName = '';
          this.dialogMsg.subtypesOf = '';
          this.centerDialogVisible = true;
        } else {
          this.ruleForm.leftLinkTitle =
            '选择商品后自动带出商品id，并自动拼好跳转链接';
          this.getGoodsList();
          this.ruleForm.leftTitle = '';
          this.ruleForm.leftLink = '';
          this.dialogMsg.subtypesOf = '';
          this.centerDialogVisible = true;
          this.dialogMsg.selectedCategoryMenu = '';
          this.dialogMsg.selectedCategoryMenu2 = '';
          this.dialogMsg.selectedCategoryMenu3 = '';
          this.dialogMsg.goodsName = '';
        }
      } else {
        if (this.ruleForm.rightGoodsId) {
          this.ruleForm.rightLinkTitle =
            '选择商品后自动带出商品id，并自动拼好跳转链接';
          this.getGoodsList();
          this.dialogMsg.selectedCategoryMenu = '';
          this.dialogMsg.selectedCategoryMenu2 = '';
          this.dialogMsg.selectedCategoryMenu3 = '';
          this.dialogMsg.goodsName = '';
          this.dialogMsg.subtypesOf = '';
          this.centerDialogVisible = true;
        } else {
          this.ruleForm.rightLinkTitle =
            '选择商品后自动带出商品id，并自动拼好跳转链接';
          this.getGoodsList();
          this.ruleForm.rightTitle = '';
          this.ruleForm.rightLink = '';
          this.dialogMsg.subtypesOf = '';
          this.centerDialogVisible = true;
          this.dialogMsg.selectedCategoryMenu = '';
          this.dialogMsg.selectedCategoryMenu2 = '';
          this.dialogMsg.selectedCategoryMenu3 = '';
          this.dialogMsg.goodsName = '';
        }
      }
    },

    // 弹窗搜索
    onSearchGoods() {
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
      // console.log('pa', params);
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
      // console.log(row);
      if (this.selectedDerection === 1) {
        this.dialogMsg.selectedLeftGoods = row;
      } else {
        this.dialogMsg.selectedRightGoods = row;
      }
    },

    // 确定选择商品
    onGoodsWindowConfirm() {
      // 1 -> 左边APP商品 2 -> 右边APP商品
      if (this.selectedDerection === 1) {
        if (!this.dialogMsg.selectedLeftGoods) {
          this.$message.error('请选择商品！');
        } else {
          this.ruleForm.leftGoodsId = this.dialogMsg.selectedLeftGoods.id;
          this.ruleForm.leftTitle = this.dialogMsg.selectedLeftGoods.name;
          // this.ruleForm.leftTitle = this.dialogMsg.selectedLeftGoods.name;
          this.ruleForm.leftLink = this.dialogMsg.selectedLeftGoods.id;
          this.centerDialogVisible = false;
        }
      } else {
        if (!this.dialogMsg.selectedRightGoods) {
          this.$message.error('请选择商品！');
        } else {
          this.ruleForm.rightGoodsId = this.dialogMsg.selectedRightGoods.id;
          this.ruleForm.rightTitle = this.dialogMsg.selectedRightGoods.name;
          this.ruleForm.rightLink = this.dialogMsg.selectedRightGoods.id;
          this.centerDialogVisible = false;
        }
      }
    },

    // 保存
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // alert('submit!');
          const options = [
            {
              position: 0,
              bandGoodsId: this.ruleForm.leftGoodsId,
              skipLink: this.ruleForm.leftLink,
              image: encodeURIComponent(this.ruleForm.leftImg),
              skipType: this.ruleForm.leftType,
              title: this.ruleForm.leftTitle,
              id: this.ruleForm.leftId,
            },
            {
              position: 1,
              bandGoodsId: this.ruleForm.rightGoodsId,
              skipLink: this.ruleForm.rightLink,
              image: encodeURIComponent(this.ruleForm.rightImg),
              skipType: this.ruleForm.rightType,
              title: this.ruleForm.rightTitle,
              id: this.ruleForm.rightId,
            },
          ];
          setHomePageAdvertisment(options).then(res => {
            this.$message.success('修改成功！');
            this.goBack();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 重置
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
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
  .box-border {
    background: #ffffff;
    border: 1px solid #cccccc;
    .top-advertising {
      padding: 20px;
      // border-bottom: 1px solid #333333;
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
    .center-border {
      width: 100%;
      height: 1px;
      background: #7d7d7d;
    }
    .bottom-advertising {
      padding: 20px;
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
  }
}
</style>