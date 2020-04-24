<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 16:40:10
 * @LastEditTime: 2019-08-28 14:22:17
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-container">
    <!-- 机构商品详情 -->
    <section class="goods-list-edit">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        size="small"
        label-position="right"
        label-width="200px"
        style="margin-top: 30px;"
      >
        <el-form-item label="所属项目：" prop="projectType">
          <el-col :span="8">
            <el-select
              v-model="ruleForm.projectType"
              placeholder="请选择所属项目"
              disabled
              @change="getProjectType"
            >
              <el-option
                v-for="(item, index) in projectOption"
                :key="index"
                :value="item.value"
                :label="item.text"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="课程名称：" prop="courseName">
          <el-col :span="8">
            <!-- <div
              v-if="state.disabledCourseName"
              :class="{ active: ruleForm.courseName }"
              class="input-box"
              @click="onOpenSelectCourseWindow"
            >{{ ruleForm.courseName || '请选择课程' }}</div>-->
            <el-input :value="ruleForm.courseName" disabled style="width: 100%;" size="medium"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="商品类别：" prop="goodsType">
          <span>{{ ruleForm.goodsType || '--' }}</span>
        </el-form-item>

        <el-form-item label="商品名称：" prop="goodsName">
          <el-col :span="8">
            <el-input
              v-model="ruleForm.goodsName"
              disabled
              style="width: 100%;"
              size="medium"
              placeholder="请输入商品名称"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="商品类目：" prop="goodsCategory">
          <el-col :span="8">
            <el-cascader
              :options="config.catagoryOptions"
              v-model="ruleForm.goodsCategory"
              disabled
              style="display: block;"
              size="medium"
              separator=" -> "
              @change="onCategoryChange"
            ></el-cascader>
          </el-col>
        </el-form-item>

        <el-form-item label="商品封面：">
          <el-row :gutter="20" type="flex" align="middle" style="margin-top: 20px;">
            <div class="goods-cover-container">
              <img
                v-if="ruleForm.goodsCover"
                :src="ruleForm.goodsCover"
                style="width: 100%; height: 100%;"
              />
              <img v-else :src="NullImgFile" style="width: 100%; height: 100%;" />
            </div>

            <upload-single v-if="!state.disableGoodsCover" @successCBK="onSingleUploadSuccess">
              <el-button
                disabled
                icon="el-icon-upload"
                size="medium"
                style="margin-left: 40px;"
              >上传商品动态图片</el-button>
            </upload-single>
            <el-button
              v-else
              disabled
              icon="el-icon-upload"
              size="medium"
              style="margin-left: 40px;"
            >上传商品动态图片</el-button>
          </el-row>
        </el-form-item>

        <el-form-item label="商品动态封面：">
          <el-row>
            <el-col :span="12">
              <el-radio-group v-model="ruleForm.featureType">
                <el-radio
                  :disabled="state.disableGoodsPriceType"
                  :label="0"
                  style="width: 70px;"
                >不设置</el-radio>
                <el-radio disabled :label="1" style="width: 70px;">图片</el-radio>
                <el-radio disabled :label="2" style="width: 70px;">视频</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>

          <!-- 图片集 -->
          <el-row
            v-if="ruleForm.featureType == 1"
            type="flex"
            align="middle"
            style="margin-top: 20px;"
          >
            <div style="position: relative; width: 288px; height: 180px; margin-left: 0;">
              <figure-keyframes :cover="ruleForm.featureImgs[0]" :keyframes="ruleForm.featureImgs"></figure-keyframes>
            </div>
            <multi-upload-image :files="ruleForm.featureImgs" @successCBK="onMultiUploadSuccess">
              <el-button
                disabled
                icon="el-icon-upload"
                size="medium"
                style="margin-left: 40px;"
              >上传商品动态图片</el-button>
            </multi-upload-image>
          </el-row>

          <!-- 视频 -->
          <el-row
            v-if="ruleForm.featureType == 2"
            :gutter="20"
            type="flex"
            align="middle"
            style="margin-top: 20px;"
          >
            <video
              :src="ruleForm.featureVideo"
              autoplay
              controls
              width="288px"
              style="margin-left: 0;"
            ></video>
            <div style="margin-left: 40px;">
              <upload-single
                :accept="['video/mp4']"
                :max-file-size="5"
                @successCBK="onSingleUploadVideoSuccess"
              >
                <el-button
                  disabled
                  icon="el-icon-upload"
                  size="medium"
                  style="margin-left: 10px;"
                >上传商品动态视频</el-button>
              </upload-single>
              <div style="color: #777; font-size: 12px;">（ 视频时长不超过15秒，文件格式为mp4，文件大小不超过5M ）</div>
            </div>
          </el-row>
        </el-form-item>

        <el-form-item class="cell-height-40" label="商品价格：" prop="goodsPriceType">
          <el-row type="flex" align="middle">
            <el-radio v-model="ruleForm.goodsPriceType" disabled :label="0" style="width: 70px;">免费</el-radio>
            <el-radio v-model="ruleForm.goodsPriceType" disabled :label="1" style="width: 70px;">付费</el-radio>

            <el-col :offset="1" :span="18" class="cell-height-40">
              <el-row v-show="ruleForm.goodsPriceType == 1" type="flex" align="middle">
                <el-col :span="7">
                  <el-input
                    v-model="ruleForm.goodsPrice"
                    disabled
                    clearable
                    size="medium"
                    type="number"
                    placeholder="请输入价格"
                    style="display: inline-block;"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <span style="margin-left: 10px;">元</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item class="cell-height-40" label="商品库存：" prop="goodsStockType">
          <el-row type="flex" align="middle">
            <el-radio v-model="ruleForm.goodsStockType" disabled :label="0" style="width: 70px;">不限</el-radio>
            <el-radio
              v-model="ruleForm.goodsStockType"
              disabled
              :label="1"
              style="width: 70px;"
            >设置库存</el-radio>

            <el-col :offset="1" :span="18" class="cell-height-40">
              <el-row v-show="ruleForm.goodsStockType === 1" type="flex" align="middle">
                <el-col :span="7">
                  <el-input
                    v-model="ruleForm.goodsStock"
                    disabled
                    clearable
                    size="medium"
                    type="number"
                    min="0"
                    max="999999999"
                    step="1"
                    placeholder="请输入库存数"
                    style="display: inline-block;"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <span style="margin-left: 10px;">个</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item class="cell-height-40" label="商品有效期：" prop="goodsValidityType">
          <el-row type="flex" align="middle">
            <el-radio
              v-model="ruleForm.goodsValidityType"
              disabled
              :label="0"
              style="width: 70px;"
            >不限</el-radio>
            <el-radio
              v-model="ruleForm.goodsValidityType"
              disabled
              :label="1"
              style="width: 70px;"
            >设置期限</el-radio>

            <el-col :offset="1" :span="18" class="cell-height-40">
              <el-row v-show="ruleForm.goodsValidityType == 1" type="flex" align="middle">
                <el-col :span="7">
                  <el-input
                    v-model="ruleForm.goodsValidity"
                    disabled
                    clearable
                    size="medium"
                    type="number"
                    min="0"
                    max="24"
                    step="1"
                    placeholder="请输入数字"
                    style="display: inline-block;"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <span style="margin-left: 10px;">
                    个月
                    <span style="color: #777; font-size: 12px;">（ 不超过24个月 ）)</span>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="商品购买基数：" prop="goodsBaseNum">
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <el-input
                v-model="ruleForm.goodsBaseNum"
                disabled
                clearable
                min="1"
                max="24"
                size="medium"
                type="number"
                placeholder="请输入基数"
                style="display: inline-block;"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <span style="margin-left: 10px; color: #777; font-size: 12px;">（ 商品初始的虚拟购买人数 ）</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="是否商品推荐：" prop="isRecomment">
          <el-radio-group v-model="ruleForm.isRecomment">
            <el-radio :label="true" disabled style="width: 70px;">是</el-radio>
            <el-radio :label="false" disabled style="width: 70px;">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品讲师：">
          <el-col :span="8">
            <!-- <div
              v-if="!state.disabledGoodsLecturer"
              :class="{ active: ruleForm.goodsLecturer.length > 0 }"
              class="input-box"
              @click="onOpenSelectLecturerWindow"
            >{{ ruleForm.goodsLecturerName || '请选择商品讲师' }}</div>-->
            <el-input
              :value="ruleForm.goodsLecturerName"
              disabled
              style="width: 100%;"
              size="medium"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="商品简介：" prop="goodsIntroduction">
          <el-col :span="20">
            <div style="position: relative;">
              <tinymce
                :height="300"
                v-model="ruleForm.goodsIntroduction"
                @on-init="onTinymceInit"
                @input="onTinymceInput"
              />
              <div state.disabledGoodsIntroduction="true" class="disabled-mask"></div>
            </div>
          </el-col>
        </el-form-item>

        <el-form-item
          v-if="issueStatus === 0&& saleoutReason !='' "
          label="下架人："
          prop="saleoutName"
        >
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <span>{{ saleoutName }}</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          v-if="issueStatus === 0&& saleoutReason !=''"
          label="下架时间："
          prop="saleoutTime"
        >
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <span>{{saleoutTime}}</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          v-if="issueStatus === 0 && saleoutReason !=''"
          label="下架原因："
          prop="saleoutReason"
        >
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <span>{{saleoutReason}}</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item style="margin-top: 50px;">
          <el-button style="margin-left: 100px;" @click.native="goBack">返回</el-button>
          <el-button
            v-if="issueStatus === 1"
            v-permission="['goods:org:off']"
            type="primary"
            @click.native="offSaleBtn"
          >强制下架</el-button>
          <!-- submitForm('ruleForm') -->
        </el-form-item>
      </el-form>

      <!-- 选择课程弹窗 -->
      <el-dialog
        :visible.sync="state.isShowCourseWindow"
        title="选择课程"
        width="800px"
        custom-class="dialog-window"
        @close="onCourseWindowClose"
        @open="onCourseWindowOpen"
      >
        <el-form ref="select-course-form" :model="selectCourseForm">
          <!-- filter -->
          <el-row :gutter="20">
            <el-col :span="9">
              <el-row type="flex" align="middle">
                <el-col :span="7">
                  <label style="display: inline-block;" for="dialog-courseNo">课程编号：</label>
                </el-col>
                <el-col :span="17">
                  <el-input
                    id="dialog-courseNo"
                    v-model="selectCourseForm.courseNo"
                    placeholder="请输入课程编号"
                  ></el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="9">
              <el-row type="flex" align="middle">
                <el-col :span="7">
                  <label style="display: inline-block;" for="dialog-courseName">课程名称：</label>
                </el-col>
                <el-col :span="17">
                  <el-input
                    id="dialog-courseName"
                    v-model="selectCourseForm.courseName"
                    placeholder="请输入课程名称"
                  ></el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="12" center>
                  <el-button
                    type="primary"
                    @click.native="getCourseList(selectCourseForm.currPage)"
                  >查询</el-button>
                </el-col>
                <el-col :span="12" center>
                  <el-button
                    @click.native="selectCourseForm.courseNo = '', selectCourseForm.courseName = ''"
                  >清空</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- table -->
          <el-table
            ref="course-table"
            :data="selectCourseForm.list"
            :row-class-name="setCourseDisabled"
            border
            size="small"
            style="margin-top: 30px;"
            height="400px"
          >
            <el-table-column label width="50px">
              <template slot-scope="scope">
                <el-col :span="24" center>
                  <el-radio
                    v-model="selectCourseForm.selectedValBackups"
                    :label="scope.row.courseId"
                    :disabled="!!scope.row.isUsed"
                    @change.native="onSelectedCourse(scope.row)"
                  ></el-radio>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column prop="courseId" label="ID"></el-table-column>
            <el-table-column prop="courseNo" label="课程编号"></el-table-column>
            <el-table-column prop="courseName" label="课程名称"></el-table-column>
            <el-table-column prop="courseType" label="课程类型"></el-table-column>
          </el-table>
          <!-- pagination -->
          <el-row style="margin-top: 20px;">
            <el-col :span="24" center>
              <el-pagination
                :current-page.sync="selectCourseForm.currPage"
                :page-size="selectCourseForm.pageSize"
                :total="selectCourseForm.totalCount"
                background
                layout="prev, pager, next, jumper"
                @current-change="onCourseWindowCurrentPageChange"
              ></el-pagination>
            </el-col>
          </el-row>
          <!-- foolter -->
          <el-row
            :gutter="20"
            type="flex"
            align="middle"
            justify="center"
            style="margin-top: 30px;"
          >
            <el-col :span="6" center>
              <el-button @click.native="state.isShowCourseWindow = false">取消</el-button>
            </el-col>
            <el-col :span="6" center>
              <el-button type="primary" @click.native="onCourseWindowConfirm">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>

      <!-- 选择讲师 -->
      <el-dialog
        :visible.sync="state.isShowLecturerWindow"
        title="选择讲师"
        width="600px"
        custom-class="dialog-window"
        @close="onLectureWindowClose"
        @open="onLectureWindowOpen"
      >
        <el-form ref="select-course-form" :model="selectLecturerForm">
          <!-- filter -->
          <el-row :gutter="20">
            <el-col :span="16">
              <el-row type="flex" align="middle">
                <el-col :span="5">
                  <label style="display: inline-block;" for="dialog-lecturerName">讲师名称：</label>
                </el-col>
                <el-col :span="17">
                  <el-input
                    id="dialog-lecturerName"
                    v-model="selectLecturerForm.lecturerName"
                    placeholder="请输入讲师名称"
                  ></el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12" center>
                  <el-button type="primary" @click.native="getLecturerList()">查询</el-button>
                </el-col>
                <el-col :span="12" center>
                  <el-button @click.native="selectLecturerForm.lecturerName = ''">清空</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- table -->
          <el-table
            ref="lecturer-table"
            :data="selectLecturerForm.list"
            current-row-key="lecturerId"
            row-key="lecturerId"
            max-height="400"
            border
            size="small"
            style="margin-top: 30px;"
          >
            <el-table-column width="50" align="center">
              <template slot="header" slot-scope="scope">
                <el-checkbox
                  v-model="selectLecturerForm.isSelectAll"
                  @change="val => { onSelectLecturerCheckBox(selectLecturerForm.list, val, true) }"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked"
                  @change="val => { onSelectLecturerCheckBox([scope.row], val) }"
                ></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column width="50" type="selection" align="center"></el-table-column> -->
            <el-table-column prop="lecturerId" width="200" label="讲师ID"></el-table-column>
            <el-table-column prop="lecturerName" min-width="150" label="讲师名称"></el-table-column>
          </el-table>
          <!-- pagination -->
          <el-row style="margin-top: 20px;">
            <el-col :span="24" center>
              <el-pagination
                :current-page.sync="selectLecturerForm.currPage"
                :page-size="selectLecturerForm.pageSize"
                :total="selectLecturerForm.totalCount"
                background
                layout="prev, pager, next, jumper"
                @current-change="getLecturerList(selectLecturerForm.currPage)"
              ></el-pagination>
            </el-col>
          </el-row>
          <!-- selected list -->
          <div class="lecturer-window-selected">
            <el-row :gutter="20" type="flex" align="top">
              <el-col :span="4">已选中：</el-col>
              <el-col :span="20">
                <el-tag
                  v-for="tag in selectLecturerForm.selectedItemsBackups"
                  :key="tag.$key"
                  closable
                  type="info"
                  @close="onRemoveSelectedLecturerItem(tag)"
                >{{ tag.lecturerName }}</el-tag>
              </el-col>
            </el-row>
          </div>

          <!-- foolter -->
          <el-row
            :gutter="20"
            type="flex"
            align="middle"
            justify="center"
            style="margin-top: 30px;"
          >
            <el-col :span="6" center>
              <el-button @click.native="state.isShowLecturerWindow = false">取消</el-button>
            </el-col>
            <el-col :span="6" center>
              <el-button type="primary" @click.native="onLecturerWindowConfirm">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <!-- 点击强制下架弹窗 -->
      <el-dialog
        title="下架原因"
        :visible.sync="state.offSaleVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-input
          type="textarea"
          maxlength="100"
          placeholder="请填写强制下架原因，限100字内"
          v-model="offSaleReason.reasonText"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="state.offSaleVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitOffSaleReason">确 定</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import _ from "lodash";
import NullImgFile from "@/assets/null.png";
import figureKeyframes from "@/components/figure-keyframes";
import Tinymce from "@/components/Tinymce";
import multiUploadImage from "@/components/Upload/multiImage";
import uploadSingle from "@/components/Upload/single";
import {
  getLecturerListOrg,
  getCourseList,
  goodsCategoryAll,
  goodsEdit,
  getGoodsDetailsById,
  saleoutOrgGoods
} from "@/api/goods";

const AdapterCategoryMenuData = function(data = []) {
  const temp = data.map(i => {
    const item = {
      id: i.id,
      value: i.id,
      level: i.level,
      label: i.name,
      checked: false
    };
    if (i.childList && i.childList.length > 0) {
      item.children = AdapterCategoryMenuData(i.childList);
    }

    return item;
  });
  return temp;
};

let tinymceId;

export default {
  name: "OrganizationGoodsDetails",
  components: {
    figureKeyframes,
    Tinymce,
    multiUploadImage,
    uploadSingle
  },
  data() {
    return {
      saleoutName: "",
      saleoutTime: "",
      saleoutReason: "",
      categoryOptions_hangjia: [],
      categoryOptions_zimo: [],
      id: "",
      issueStatus: "",
      NullImgFile,
      state: {
        isShowCourseWindow: false,
        isShowLecturerWindow: false,
        onCloseLectureWindowType: null,
        disabledCourseName: false,
        disabledGoodsName: false,
        disabledGoodsCategory: false,
        disableGoodsCover: false,
        disableGoodsPriceType: false,
        disabledGoodsPrice: false,
        disabledGoodsStock: false,
        disabledGoodsValidity: false,
        disabledGoodsBaseNum: false,
        disabledGoodsIsRecomment: false,
        disabledGoodsLecturer: false,
        disabledGoodsIntroduction: false,
        disabledProjectType: false,
        offSaleVisible: false
      },
      config: {
        catagoryOptions: []
      },
      projectOption: [
        {
          text: "行家",
          value: 1
        },
        {
          text: "子墨学院",
          value: 2
        }
      ],
      ruleForm: {
        projectType: "",
        courseName: "",
        goodsType: "",
        goodsName: "",
        goodsCategory: [],
        goodsCover: "",
        featureType: 0,
        featureImgs: [],
        featureVideo: "",
        goodsPriceType: 0,
        goodsPrice: "",
        goodsStockType: 0,
        goodsStock: "",
        goodsValidityType: 0,
        goodsValidity: "",
        goodsBaseNum: "",
        isRecomment: true,
        goodsLecturer: [],
        goodsLecturerName: "",
        goodsIntroduction: ""
      },
      rules: {
        projectType: [{ required: true, message: "请选择所属项目" }],
        courseName: [{ required: true, message: "请选择课程" }],
        goodsType: [{ required: true, message: "请选择课程" }],
        goodsName: [{ required: true, message: "请输入商品名称" }],
        goodsCategory: [{ required: true, message: "请选择商品类目" }],
        goodsPriceType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const price = Number(this.ruleForm.goodsPrice);
              if (value === 1 && !price) {
                callback(new Error("请正确设置商品价格"));
              } else {
                callback();
              }
            }
          }
        ],
        goodsStockType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                value === 1 &&
                (this.ruleForm.goodsStock < 0 ||
                  this.ruleForm.goodsStock > 999999999)
              ) {
                callback(new Error("请正确设置商品库存(0 ~ 999999999)"));
              } else {
                if (this.ruleForm.goodsStock) {
                  this.ruleForm.goodsStock = Math.floor(
                    this.ruleForm.goodsStock
                  );
                }

                callback();
              }
            }
          }
        ],
        goodsValidityType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const goodsValidity = Number(this.ruleForm.goodsValidity);
              if (value === 1 && (goodsValidity < 0 || goodsValidity > 24)) {
                callback(new Error("请正确设置商品有效期"));
              } else {
                if (this.ruleForm.goodsValidity) {
                  this.ruleForm.goodsValidity = Math.floor(
                    this.ruleForm.goodsValidity
                  );
                }

                callback();
              }
            }
          }
        ],
        goodsBaseNum: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                this.ruleForm.goodsBaseNum !== "" &&
                this.ruleForm.goodsBaseNum >= 0
              ) {
                callback();
              } else {
                callback(new Error("请正确设置商品虚拟购买人数"));
              }
            }
          }
        ],
        goodsLecturer: [{ required: true, message: "请设置商品讲师" }],
        goodsIntroduction: [{ required: true, message: "请设置商品简介" }],
        isRecomment: [{ required: true }]
      },
      selectCourseForm: {
        courseNo: "",
        courseName: "",
        list: [],
        selectedVal: "",
        selectedValBackups: "",
        selectedItem: null,
        selectedItemBackups: null,
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      selectLecturerForm: {
        paramsStr: "",
        lecturerName: "",
        list: [],
        isSelectAll: false,
        selectedVal: "",
        selectedItems: [],
        selectedItemsBackups: [],
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      offSaleReason: {
        reasonText: ""
      }
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // $route: 'onRouteChange'
  },
  mounted() {
    this.id = this.$route.params.id;
    this.initData();
    // 获取商品类目菜单列表 - 所有
    goodsCategoryAll(0).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.config.categoryOptions = menuData;
      //   this.categoryOptions_hangjia = menuData;
    });
    // 获取商品类目菜单列表 - 行家
    goodsCategoryAll(1).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      //   this.config.categoryOptions = menuData;
      this.categoryOptions_hangjia = menuData;
    });

    // 获取商品类目菜单列表 - 子墨
    goodsCategoryAll(2).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.categoryOptions_zimo = menuData;
    });
  },
  methods: {
    // 页面初始化
    async initData() {
      if (!this.id) return false;

      // 获取课程列表
      this.getCourseList();

      // 获取讲师列表
      //this.getLecturerList();

      // 获取商品类目菜单列表
      const projectParams = this.ruleForm.projectType;
      const categoryRes = await goodsCategoryAll(projectParams);
      if (categoryRes.code !== 200) return Promise.reject();
      this.config.catagoryOptions = AdapterCategoryMenuData(
        categoryRes.result || []
      );

      // 获取详情
      getGoodsDetailsById(this.id).then(res => {
        this.issueStatus = res.result.issueStatus;
        if (res.code !== 200) return false;
        this.goodsDetailsResult = res.result;

        // 禁用
        let disabledObj = {
          disabledProjectType: false,
          disabledCourseName: false,
          disabledGoodsName: false,
          disabledGoodsCategory: false,
          disableGoodsCover: false,
          disableGoodsPriceType: false,
          disabledGoodsPrice: false,
          disabledGoodsStock: false,
          disabledGoodsValidity: false,
          disabledGoodsBaseNum: false,
          disabledGoodsIsRecomment: false,
          disabledGoodsLecturer: false,
          disabledGoodsIntroduction: false
        };

        if (res.result.issueStatus === 1) {
          disabledObj = {
            disabledProjectType: true,
            disabledCourseName: true,
            disabledGoodsName: true,
            disabledGoodsCategory: true,
            disableGoodsCover: true,
            disableGoodsPriceType: true,
            disabledGoodsPrice: true,
            disabledGoodsStock: true,
            disabledGoodsValidity: true,
            disabledGoodsBaseNum: true,
            disabledGoodsIsRecomment: false,
            disabledGoodsLecturer: true,
            disabledGoodsIntroduction: false
          };
        }
        this.state = Object.assign({}, this.state, disabledObj);

        this.ruleForm.courseName = res.result.courseName;
        this.ruleForm.projectType = res.result.projectType;
        this.ruleForm.goodsName = res.result.name;
        this.ruleForm.goodsCover = res.result.coverPicture;
        this.ruleForm.featureType = res.result.dynamicCoverType;
        this.ruleForm.featureImgs = res.result.dynamicCover.split(",").map(i => decodeURIComponent(i));
        this.ruleForm.featureVideo = res.result.dynamicCover;
        this.ruleForm.goodsPrice = res.result.price;
        this.ruleForm.goodsPriceType = res.result.price > 0 ? 1 : 0;
        this.ruleForm.goodsStock = res.result.stockCount;
        this.ruleForm.goodsStockType =
          Number(res.result.stockCount) >= 999999999 ? 0 : 1;
        this.ruleForm.goodsValidity = res.result.validityDate;
        this.ruleForm.goodsValidityType = res.result.validityDate <= -1 ? 0 : 1;
        this.ruleForm.goodsBaseNum = res.result.basicBuyCount;
        this.ruleForm.isRecomment = res.result.isRecommend;
        this.ruleForm.goodsIntroduction = res.result.introduction;
        this.saleoutName = res.result.modifierName;
        this.saleoutTime = res.result.updateTime;
        this.saleoutReason = res.result.lowerShelfReason;

        if (res.result.type === 0) {
          this.ruleForm.goodsType = "其他";
        }
        if (res.result.type === 1) {
          this.ruleForm.goodsType = "直播";
        }
        if (res.result.type === 2) {
          this.ruleForm.goodsType = "录播";
        }

        if (res.result.projectType === 1) {
          // 设置备选商品类目数据 - 行家
          this.config.catagoryOptions = this.categoryOptions_hangjia.concat([]);
          this.ruleForm.projectType = "行家";
        } else if (res.result.projectType === 2) {
          // 设置备选商品类目数据 - 子墨
          this.ruleForm.projectType = "子墨";
          this.config.catagoryOptions = this.categoryOptions_zimo.concat([]);
        } else {
          this.ruleForm.projectType = "第三方机构";
        }

        // 回显课程信息
        // this.getCourseListById(res.result.courseId).then(courseList => {
        //   const firstItem = courseList[0];
        //   this.selectCourseForm.selectedItem = firstItem;
        //   this.selectCourseForm.selectedVal = firstItem.courseId;
        //   //   this.ruleForm.courseName = firstItem.courseName;
        //   this.ruleForm.goodsType = firstItem.courseType;
        // });

        // 回显商品类目
        const categorys = [...categoryRes.result];
        let selectedItem;
        const generateParentTree = (arr = [], parent) => {
          arr.some(i => {
            i.parent = parent;
            if (i.id === res.result.goodsCategoryId) {
              selectedItem = i;
            } else if (i.childList && i.childList.length > 0) {
              generateParentTree(i.childList, i);
            }
            if (selectedItem) return true;
            return false;
          });
        };
        generateParentTree(categorys);
        const ids = [];
        const findIds = (obj = {}) => {
          if (obj.id) ids.push(obj.id);
          if (obj.parent) findIds(obj.parent);
        };
        findIds(selectedItem);

        this.ruleForm.goodsCategory = ids.reverse();

        // 回显商品讲师
        // this.getLecturerListByIds(res.result.teacherIds).then(list => {
        //   this.ruleForm.goodsLecturer = list;
        //   this.selectLecturerForm.selectedItems = list;
        //   this.ruleForm.goodsLecturerName = list
        //     .map(i => i.lecturerName.trim())
        //     .join("；");
        //   console.log(list);
        // });

        this.echoTeacherName(Number(res.result.courseId));
      });
    },

    //回显课程
    echoTeacherName(courseId) {
      const options = {
        courseId
      };
      getLecturerListOrg(options).then(res => {
        console.log("course", res);
        this.ruleForm.goodsLecturerName = res.result
          .map(i => i.nickName)
          .join("；");
        console.log(this.ruleForm.goodsLecturerName);
      });
    },

    // 获取商品类目菜单列表 - 行家
    getHjGoodsCategory() {
      goodsCategoryAll(1).then(res => {
        const menuData = AdapterCategoryMenuData(res.result);
        this.filterConfig.categoryOptions = menuData;
        this.categoryOptions_hangjia = menuData;
      });
    },

    // 获取商品类目菜单列表 - 子墨
    getZimoGoodsCategory() {
      goodsCategoryAll(2).then(res => {
        const menuData = AdapterCategoryMenuData(res.result);
        this.categoryOptions_zimo = menuData;
      });
    },

    async getGoodsCategoryAll(projectType = 0) {
      // 获取商品类目菜单列表
      const categoryRes = await goodsCategoryAll(projectType);
      if (categoryRes.code !== 200) return Promise.reject();
      this.config.catagoryOptions = AdapterCategoryMenuData(
        categoryRes.result || []
      );
      this.ruleForm.goodsCategory = [];
    },

    // 点击所属项目刷新等级类目
    getProjectType(item) {
      console.log(item);
      this.getGoodsCategoryAll(item);
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 编辑器初始化完成
    onTinymceInit(id) {
      tinymceId = id;
    },

    // 监听编辑器输入事件
    onTinymceInput(content) {
      this.ruleForm.goodsIntroduction = content;
      if (content.length > 0) {
        this.$refs.ruleForm.clearValidate(["goodsIntroduction"]);
      }
    },
    // 监听商品动态封面上传成功
    onMultiUploadSuccess(arr) {
      this.ruleForm.featureImgs = arr;
    },

    // 上传封面成功
    onSingleUploadSuccess(url) {
      this.ruleForm.goodsCover = url;
    },

    // 上传视频成功
    onSingleUploadVideoSuccess(url) {
      this.ruleForm.featureVideo = url;
    },

    // 选择商品类目
    onCategoryChange(arr) {
      if (arr.length < 3) {
        this.$message.error("不能选择低于3级的商品类目");
        this.ruleForm.goodsCategory = [];
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    // 强制下架按钮
    offSaleBtn() {
      console.log("op");
      this.offSaleReason.reasonText = "";
      this.state.offSaleVisible = true;
    },

    // 提交强制下架原因
    submitOffSaleReason() {
      if (!this.offSaleReason.reasonText) {
        this.$message.error("请输入强制下架原因!");
        return false;
      } else {
        const options = {
          // 页码
          goodsId: this.id,
          lowerShelfReason: this.offSaleReason.reasonText
        };
        const res = saleoutOrgGoods(options);
        console.log("获得的结果" + res);
        //if (res.code !== 200) return Promise.reject();
        this.state.offSaleVisible = false;
        this.$message.success("编辑成功");
        this.$store.dispatch("delView", this.$route);
        this.$router.go(-1);
        console.log("下架成功");
      }
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let options = {
            id: this.id,
            courseId: this.selectCourseForm.selectedItem.courseId,
            projectType: this.ruleForm.projectType,
            name: this.ruleForm.goodsName,
            type: 0,
            goodsCategoryId: this.ruleForm.goodsCategory[
              this.ruleForm.goodsCategory.length - 1
            ],
            coverPicture: this.ruleForm.goodsCover,
            dynamicCover: "",
            dynamicCoverType: "",
            price: 0,
            stockCount: 999999999,
            validityDate: -1,
            isRecommend: !!this.ruleForm.isRecomment,
            teacherIds: this.selectLecturerForm.selectedItems
              .map(i => i.lecturerId)
              .join(","),
            introduction: this.ruleForm.goodsIntroduction,
            isAudition: !!this.selectCourseForm.selectedItem.isListen,
            basicBuyCount: Number(this.ruleForm.goodsBaseNum),
            courseChapterNum: this.selectCourseForm.selectedItem.chapterNum,
            courseSectionNum: this.selectCourseForm.selectedItem.sectionNum
          };

          options = Object.assign({}, this.goodsDetailsResult, options);

          if (this.selectCourseForm.selectedItem.courseType === "直播")
            options.type = 1;
          else if (this.selectCourseForm.selectedItem.courseType === "录播")
            options.type = 2;

          if (this.ruleForm.featureType === 1) {
            options.dynamicCoverType = 1;
            options.dynamicCover = this.ruleForm.featureImgs.map(i => encodeURIComponent(i)).join(",");
          } else if (this.ruleForm.featureType === 2) {
            options.dynamicCoverType = 2;
            options.dynamicCover = this.ruleForm.featureVideo;
          }

          if (this.ruleForm.goodsPriceType === 1 && this.ruleForm.goodsPrice) {
            options.price = this.ruleForm.goodsPrice;
          }
          if (
            this.ruleForm.goodsStockType === 1 &&
            this.ruleForm.goodsStock >= 0
          ) {
            options.stockCount = this.ruleForm.goodsStock;
          }

          if (
            this.ruleForm.goodsValidityType === 1 &&
            this.ruleForm.goodsValidity
          ) {
            options.validityDate = this.ruleForm.goodsValidity;
          }

          goodsEdit(options).then(res => {
            if (res.code === 200) {
              this.$message.success("编辑成功");
              this.$store.dispatch("delView", this.$route);
              this.$router.go(-1);
              // this.resetForm();
            }
          });
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.ruleForm = {
        projectType: "",
        courseName: "",
        goodsType: "",
        goodsName: "",
        goodsCategory: [],
        goodsCover: "",
        featureType: 0,
        featureImgs: [],
        featureVideo: "",
        goodsPriceType: 0,
        goodsPrice: "",
        goodsStockType: 0,
        goodsStock: "",
        goodsValidityType: 0,
        goodsValidity: "",
        goodsBaseNum: "",
        isRecomment: 0,
        goodsLecturer: [],
        goodsLecturerName: "",
        goodsIntroduction: ""
      };
      this.selectCourseForm = {
        courseNo: "",
        courseName: "",
        list: [],
        selectedVal: "",
        selectedValBackups: "",
        selectedItem: null,
        selectedItemBackups: null,
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      };
      this.selectLecturerForm = {
        paramsStr: "",
        lecturerName: "",
        list: [],
        isSelectAll: false,
        selectedVal: "",
        selectedItems: [],
        selectedItemsBackups: [],
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      };

      // 获取课程列表
      this.getCourseList();

      // 获取讲师列表
      // this.getLecturerList();

      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
        window.tinymce.get(tinymceId).setContent("");
      });
    },

    // 监听打开课程弹窗事件
    onOpenSelectCourseWindow() {
      this.state.isShowCourseWindow = true;
    },

    // 选择课程弹窗 - 设置禁用
    setCourseDisabled({ row }) {
      if (row.isUsed === 1) return "course-table-row-disabled";
      return "";
    },

    // 选择课程弹窗 - 选择课程
    onSelectedCourse(item) {
      this.selectCourseForm.selectedValBackups = item.courseId;
      this.selectCourseForm.selectedItemBackups = item;
    },

    // 获取课程列表
    async getCourseListById(id) {
      const options = {
        courseId: id,
        page: 1,
        limit: 10
      };
      const res = await getCourseList(options);
      if (res.code !== 200) return Promise.reject();

      return Promise.resolve(res.result.records);
    },

    // 获取课程列表
    async getCourseList(pageNum = 1) {
      const options = {
        courseNo: this.selectCourseForm.courseNo,
        courseName: this.selectCourseForm.courseName,
        page: pageNum,
        limit: 10
      };
      const res = await getCourseList(options);
      if (res.code !== 200) return Promise.reject();

      this.selectCourseForm.list = res.result.records || [];
      this.selectCourseForm.currPage = res.result.current || 1;
      this.selectCourseForm.totalPage = res.result.pages || 1;
      this.selectCourseForm.pageSize = res.result.size || 10;
      this.selectCourseForm.totalCount = res.result.total || 0;

      this.$nextTick(() => {
        if (this.$refs["course-table"]) {
          this.$refs["course-table"].bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 选择课程弹窗 - 当前页改变
    onCourseWindowCurrentPageChange(val) {
      this.getCourseList(val);
    },

    // 选择课程弹窗 - 确定
    onCourseWindowConfirm() {
      this.selectCourseForm.selectedItem = {
        ...this.selectCourseForm.selectedItemBackups
      };
      this.selectCourseForm.selectedVal = this.selectCourseForm.selectedItemBackups.courseId;
      this.ruleForm.courseName = this.selectCourseForm.selectedItem.courseName;
      this.ruleForm.goodsType = this.selectCourseForm.selectedItem.courseType;
      this.state.isShowCourseWindow = false;
      this.$refs.ruleForm.validateField(["goodsType"]);
    },

    // 监听课程弹窗 - 关闭
    onCourseWindowClose() {
      this.$refs.ruleForm.validateField(["courseName"]);
    },

    // 监听课程弹窗 - 打开
    onCourseWindowOpen() {
      this.selectCourseForm.selectedValBackups = this.selectCourseForm.selectedVal;
    },

    // 监听打开讲师弹窗事件
    onOpenSelectLecturerWindow() {
      this.state.isShowLecturerWindow = true;
    },

    // // 获取讲师列表
    // async getLecturerListByIds(ids = String) {
    //   const options = {
    //     lecturerIdList: ids,
    //     page: 1,
    //     limit: 50
    //   };
    //   const jsonParams = JSON.stringify(options);
    //   if (this.selectLecturerForm.paramsStr === jsonParams) {
    //     return Promise.resolve();
    //   }
    //   this.selectLecturerForm.paramsStr = jsonParams;
    //
    //   // 发起请求
    //   const res = await getLecturerList(options);
    //   if (res.code !== 200) return Promise.reject();
    //   return Promise.resolve(res.result.list);
    // },
    //
    // // 获取讲师列表
    // async getLecturerList(pageNum = 1) {
    //   const options = {
    //     lecturerName: this.selectLecturerForm.lecturerName.trim(),
    //     page: pageNum,
    //     limit: 10
    //   };
    //   const jsonParams = JSON.stringify(options);
    //   if (this.selectLecturerForm.paramsStr === jsonParams) {
    //     return Promise.resolve();
    //   }
    //   this.selectLecturerForm.paramsStr = jsonParams;
    //
    //   // 发起请求
    //   const res = await getLecturerList(options);
    //   if (res.code !== 200) return Promise.reject();
    //   // 数据填充
    //   this.selectLecturerForm.list = res.result.list.map(i => {
    //     i.$key = i.lecturerId;
    //     i.checked = false;
    //
    //     this.selectLecturerForm.selectedItemsBackups.forEach(j => {
    //       if (i.lecturerId === j.lecturerId) {
    //         i.checked = true;
    //       }
    //     });
    //
    //     return i;
    //   });
    //
    //   // 是否显示全选
    //   this.selectLecturerForm.isSelectAll = !this.selectLecturerForm.list.some(
    //     i => !i.checked
    //   );
    //
    //   this.selectLecturerForm.currPage = res.result.currPage;
    //   this.selectLecturerForm.pageSize = res.result.pageSize || 10;
    //   this.selectLecturerForm.totalPage = res.result.totalPage;
    //   this.selectLecturerForm.totalCount = res.result.totalCount;
    //
    //   this.$nextTick(() => {
    //     if (this.$refs["lecturer-table"]) {
    //       this.$refs["lecturer-table"].bodyWrapper.scrollTop = 0;
    //     }
    //   });
    // },

    // 选择讲师弹窗 - 【单选 or 全选】
    onSelectLecturerCheckBox(selection, isSelect, isAll) {
      if (isAll) {
        selection.forEach(i => {
          i.checked = isSelect;
        });
      }

      if (isSelect) {
        this.selectLecturerForm.selectedItemsBackups = _.uniqBy(
          [...this.selectLecturerForm.selectedItemsBackups, ...selection],
          "lecturerId"
        );
      } else {
        this.selectLecturerForm.selectedItemsBackups = _.differenceBy(
          this.selectLecturerForm.selectedItemsBackups,
          selection,
          "lecturerId"
        );
      }
      const isSelectAll = this.selectLecturerForm.list.every(i => !!i.checked);
      this.selectLecturerForm.isSelectAll = isSelectAll;
    },

    // 选择讲师弹窗 - 确定
    onLecturerWindowConfirm() {
      const newSelectedItems = [
        ...this.selectLecturerForm.selectedItemsBackups
      ];
      this.ruleForm.goodsLecturer = newSelectedItems;
      this.selectLecturerForm.selectedItems = newSelectedItems;
      this.ruleForm.goodsLecturerName = newSelectedItems
        .map(i => i.lecturerName.trim())
        .join("；");
      this.state.isShowLecturerWindow = false;
      this.state.onCloseLectureWindowType = 200;
    },

    // 选择讲师弹窗 - 删除一个已选中项
    onRemoveSelectedLecturerItem(item) {
      this.selectLecturerForm.list.some(i => {
        if (i.lecturerId === item.lecturerId) {
          i.checked = false;
          return true;
        }
        return false;
      });
      this.selectLecturerForm.selectedItemsBackups = _.differenceBy(
        this.selectLecturerForm.selectedItemsBackups,
        [item],
        "lecturerId"
      );
    },

    // 选择讲师弹窗 - 打开
    onLectureWindowOpen() {
      this.state.onCloseLectureWindowType = null;
      this.selectLecturerForm.selectedItemsBackups = [
        ...this.selectLecturerForm.selectedItems
      ];
      this.selectLecturerForm.list.forEach(i => {
        i.checked = false;
        this.selectLecturerForm.selectedItemsBackups.forEach(j => {
          if (i.lecturerId === j.lecturerId) {
            i.checked = true;
          }
        });
      });

      // 是否显示全选
      this.selectLecturerForm.isSelectAll = !this.selectLecturerForm.list.some(
        i => !i.checked
      );
    },

    // 选择讲师弹窗 - 关闭
    onLectureWindowClose() {
      if (!this.state.onCloseLectureWindowType) {
        this.selectLecturerForm.selectedItemsBackups = [
          ...this.selectLecturerForm.selectedItems
        ];
      }
      this.$refs.ruleForm.validateField(["goodsLecturer"]);
    }
  }
};
</script>

<style lang="less">
.goods-list-edit {
  .input-box {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    color: #ccc;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    &.active {
      color: #333;
      border-color: #67c23a;
    }
  }
  .cell-height-40 {
    height: 40px;
    line-height: 40px;
  }

  .cell-height-40 .el-form-item__label {
    height: 40px;
    line-height: 40px;
  }

  .dialog-window .el-radio__label {
    display: none;
  }

  .goods-cover-container {
    position: relative;
    margin-left: 10px;
    width: 288px;
    height: 160px;
    border: 1px solid #ebeef5;
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }

  .lecturer-window-selected {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    .el-tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .course-table-row-disabled {
    position: relative;
    background-color: #f5f7fa;
  }

  .disabled-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    cursor: url("/static/disabled.ico"), auto;
  }
}
</style>

