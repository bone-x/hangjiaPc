<template>
  <div class="content-container">
    <!-- 私域H5管理 - 新建商品 -->
    <section class="goods-list-add">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        size="small"
        label-position="right"
        label-width="150px"
        style="margin-top: 30px;"
      >
        <el-form-item
          label="绑定商品："
          prop="bindingGoods"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-tooltip
                :disabled="ruleForm.bindingGoods !== '' ? disappear : !disappear"
                class="item"
                effect="dark"
                :content="ruleForm.bindingGoods"
                placement="top-start"
              >
                <el-input
                  v-model="ruleForm.bindingGoods"
                  :disabled="!allowSave"
                  style="width: 100%;"
                  size="medium"
                  placeholder="请绑定机构商品"
                  @focus="bindingOrgGoods"
                ></el-input>
              </el-tooltip>

            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="商品名称："
          prop="goodsName"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="ruleForm.goodsName"
                style="width: 100%;"
                size="medium"
                placeholder="请输入商品名称"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="商品原价："
          prop="price"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="ruleForm.price"
                size="medium"
                type="number"
                placeholder="请输入商品原价"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="商品售价："
          prop="salePrice"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="ruleForm.salePrice"
                style="width: 100%;"
                size="medium"
                type="number"
                placeholder="请输入商品售价"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          :required="Number(ruleForm.price) > 0"
          label="优惠价格："
          prop="activityPrice"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="ruleForm.activityPrice"
                style="width: 100%;"
                size="medium"
                type="number"
                placeholder="请输入优惠价格"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="商品宣传："
          prop="propagandaUrl"
        >
          <el-row :gutter="20">
            <el-col :span="22">
              <el-row :gutter="20">
                <el-col :span="24">
                  <multi-upload-image
                    :files="ruleForm.propagandaUrl"
                    :max-file-size="2"
                    :limit="10"
                    @successCBK="handleSelectedCover"
                  >
                    <el-button
                      icon="el-icon-upload"
                      size="medium"
                    >上传课程宣传图</el-button>
                  </multi-upload-image>
                </el-col>
              </el-row>

              <el-row
                :gutter="20"
                style="margin-top: 20px;"
              >
                <el-col :span="24">
                  <img
                    v-if="!ruleForm.propagandaUrl.length"
                    :src="NullImgFile"
                    class="cover-img"
                  />
                  <img
                    v-for="(url, index) in ruleForm.propagandaUrl"
                    :key="index"
                    :src="url"
                    class="cover-img"
                    alt="封面图"
                  />
                  <div class="cover-tips">最多支持上传十张图片</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="客服二维码："
          prop="codeUrl"
        >
          <el-row :gutter="20">
            <el-col :span="22">
              <el-row :gutter="20">
                <el-col :span="24">
                  <multi-upload-image
                    :files="ruleForm.codeUrl"
                    :max-file-size="2"
                    :limit="10"
                    @successCBK="handleSelectedCodeCover"
                  >
                    <el-button
                      icon="el-icon-upload"
                      size="medium"
                    >上传客服二维码</el-button>
                  </multi-upload-image>
                </el-col>
              </el-row>

              <el-row
                :gutter="20"
                style="margin-top: 20px;"
              >
                <el-col :span="24">
                  <img
                    v-if="!ruleForm.codeUrl.length"
                    :src="NullImgFile"
                    class="cover-img"
                  />
                  <img
                    v-for="(url, index) in ruleForm.codeUrl"
                    :key="index"
                    :src="url"
                    class="cover-img"
                    alt="封面图"
                  />
                  <div class="cover-tips">最多支持上传十张图片</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-row style="margin: 30px 0px;">
            <el-col :span="24">
              <el-button
                v-permission="['activity:goods:links']"
                :disabled="!allowSave"
                type="primary"
                plain
                @click.native="submitForm('ruleForm')"
              >保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="绑定运营："
          prop="binding"
        >
          <el-row :gutter="20">
            <el-col :span="16">
              <div
                :class="{ active: ruleForm.operatorList.length > 0 }"
                class="input-box"
                style="max-width: 500px"
                @click="onOpenSelectOperatorWindow"
              >
                <el-tag
                  v-for="item in ruleForm.operatorList"
                  :key="item.index"
                  style="margin-right: 8px"
                >{{ item.userName }}</el-tag>

                <span v-if="!ruleForm.operatorList.length">请选择运营人员</span>
                <span
                  v-if="allowSave"
                  class="disabled-mask"
                ></span>
              </div>

              <div class="tips">请保存后再绑定运营并生成链接</div>
              <el-table
                :data="ruleForm.operators"
                current-row-key="operatorId"
                row-key="operatorId"
                max-height="400"
                border
                size="small"
                style="width: 100%;margin-top: 30px;"
              >
                <el-table-column
                  min-width="100"
                  prop="operatorName"
                  label="绑定运营"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="300"
                  prop="discountLink"
                  label="优惠链接"
                  align="center"
                ></el-table-column>
                <el-table-column
                  width="150"
                  prop="operation"
                  label="操作"
                  align="center"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      plain
                      @click.native="copyDiscountsUrl(scope.row.discountLink)"
                    >复制</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="price">
                售价链接：
                <span class="priceUrl">{{ ruleForm.salePriceUrl }}</span>
                <span
                  v-if="ruleForm.salePriceUrl"
                  class="copy"
                  @click="copyDiscountsUrl(ruleForm.salePriceUrl)"
                >复制</span>
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item style="margin-top: 50px;">
          <el-button @click.native="goBack">返回</el-button>
          <el-button
            :disabled="!allowCreateLinks"
            type="primary"
            style="margin-left: 100px;"
            @click.native="handleCreateUrl"
          >生成链接</el-button>
        </el-form-item>
      </el-form>

      <!-- 绑定运营 -->
      <el-dialog
        :visible.sync="state.isShowOperatorWindow"
        title="绑定运营"
        width="900px"
        custom-class="dialog-window"
        @close="onOperatorWindowClose"
        @open="onOperatorWindowOpen"
      >
        <el-form
          ref="select-course-form"
          :model="selectOperatorForm"
        >
          <!-- filter -->
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="用户昵称："
                prop="operatorName"
                label-width="120px"
              >
                <el-input
                  id="dialog-operatorName"
                  v-model.trim="selectOperatorForm.operatorName"
                  placeholder="请输入用户昵称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="用户ID："
                prop="id"
                label-width="120px"
              >
                <el-input
                  id="dialog-id"
                  v-model.trim="selectOperatorForm.id"
                  clearable
                  placeholder="请输入用户ID"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div style="margin-left: 30px">
                <el-button
                  type="primary"
                  @click.native="getOperatorList()"
                >搜索</el-button>
              </div>
            </el-col>
          </el-row>

          <!-- table -->
          <el-table
            :data="selectOperatorForm.list"
            current-row-key="id"
            row-key="id"
            max-height="400"
            border
            size="small"
            style="margin-top: 30px;"
          >
            <el-table-column
              width="50"
              align="center"
            >
              <template
                slot="header"
                slot-scope="scope"
              >
                <el-checkbox
                  v-model="selectOperatorForm.isSelectAll"
                  @change="val => { onSelectOperatorCheckBox(selectOperatorForm.list, val, true) }"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked"
                  @change="val => { onSelectOperatorCheckBox([scope.row], val) }"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="userId"
              width="300"
              label="用户ID"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="userName"
              min-width="300"
              label="用户昵称"
              align="center"
            ></el-table-column>
          </el-table>
          <!-- pagination -->
          <el-row style="margin-top: 20px;">
            <el-col
              :span="24"
              center
            >
              <el-pagination
                :current-page.sync="selectOperatorForm.pageNum"
                :page-size="selectOperatorForm.pageSize"
                :total="selectOperatorForm.totalCount"
                background
                layout="prev, pager, next"
                @current-change="getOperatorList(selectOperatorForm.pageNum)"
              ></el-pagination>
            </el-col>
          </el-row>

          <!-- selected list -->
          <div class="lecturer-window-selected">
            <el-row
              :gutter="20"
              type="flex"
              align="top"
            >
              <!-- <el-col :span="4">已选中：</el-col> -->
              <el-col :span="20">
                <el-tag
                  v-for="tag in selectOperatorForm.selectedItemsBackups"
                  :key="tag.$key"
                  closable
                  type="info"
                  @close="onRemoveSelectedOperatorItem(tag)"
                >{{ tag.userName }}</el-tag>
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
            <el-col
              :span="6"
              center
            >
              <el-button @click.native="state.isShowOperatorWindow = false">取消</el-button>
            </el-col>
            <el-col
              :span="6"
              center
            >
              <el-button
                type="primary"
                @click.native="onOperatorWindowConfirm"
              >确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>

      <!-- 绑定机构商品 -->
      <!-- <el-dialog
        :visible.sync="state.centerDialogVisible"
        title="选择商品"
        width="1000px"
        left
      >
        <el-form
          :inline="true"
          :model="selectOrgGoodsForm"
          class="flex-center"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="商品名称"
                label-width="80px"
              >
                <el-input
                  v-model.trim="selectOrgGoodsForm.goodsName"
                  clearable
                  placeholder="请填写"
                  style="width:220px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="商品ID"
                label-width="80px"
              >
                <el-input
                  v-model.trim="selectOrgGoodsForm.searchGoodsId"
                  clearable
                  placeholder="请填写"
                  style="width:220px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="所属机构"
                label-width="80px"
              >
                <el-select
                  v-model="selectOrgGoodsForm.orgId"
                  placeholder="请选择"
                  style="width:220px"
                >
                  <el-option
                    v-for="item in selectOrgGoodsForm.orgList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="商品类目"
                label-width="80px"
              >
                <el-cascader
                  :options="selectOrgGoodsForm.catagoryOptions"
                  v-model="selectOrgGoodsForm.goodsCategory"
                  style="display: block; width: 320px"
                  size="medium"
                  separator=" -> "
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              right
              style="width: 49.1%;"
            >
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click.native="handleSearchGoods(selectOrgGoodsForm.pageNum)"
                >搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form> -->
      <!-- 表格部分 -->
      <!-- <el-row style="margin-top: 20px;">
          <el-col
            :span="24"
            center
          >
            <el-table
              :data="selectOrgGoodsForm.goodsList"
              :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
              size="small"
              border
            >
              <el-table-column
                label
                width="50"
                align="center"
              >
                <template slot-scope="scope">
                  <el-radio
                    :label="scope.row.id"
                    v-model="selectOrgGoodsForm.goodsId"
                    @change.native="getCurrentRow(scope.row)"
                  >&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="商品ID"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="商品名称"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="goodsCategoryNames"
                label="商品类目"
                min-width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="orgName"
                label="所属机构"
                width="200"
                fixed="right"
                align="center"
              ></el-table-column>
            </el-table>
          </el-col>
        </el-row> -->

      <!-- 弹窗分页选择 -->
      <!-- <el-row style="margin-top: 30px;">
          <el-col
            :span="24"
            center
          >
            <el-pagination
              :page-size="selectOrgGoodsForm.pageSize"
              :current-page.sync="selectOrgGoodsForm.pageNum"
              :total="selectOrgGoodsForm.totalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @current-change="handleSearchGoods(selectOrgGoodsForm.pageNum)"
            ></el-pagination>
          </el-col>
        </el-row>

        <el-row style="margin-top: 30px;">
          <el-col
            :span="24"
            center
          >
            <el-button @click="state.centerDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click.native="submitBindingGoods"
            >确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog> -->

      <!-- 2.4.1多选绑定商品 -->
      <el-dialog
        :visible.sync="state.centerDialogVisible"
        title="选择商品"
        width="1000px"
        left
      >
        <el-form
          :inline="true"
          :model="selectOrgGoodsForm"
          class="flex-center"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="商品名称"
                label-width="80px"
              >
                <el-input
                  v-model.trim="selectOrgGoodsForm.goodsName"
                  clearable
                  placeholder="请填写"
                  style="width:220px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="商品ID"
                label-width="80px"
              >
                <el-input
                  v-model.trim="selectOrgGoodsForm.searchGoodsId"
                  clearable
                  placeholder="请填写"
                  style="width:220px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="所属机构"
                label-width="80px"
              >
                <el-select
                  v-model="selectOrgGoodsForm.orgId"
                  placeholder="请选择"
                  style="width:220px"
                >
                  <el-option
                    v-for="item in selectOrgGoodsForm.orgList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="商品类目"
                label-width="80px"
              >
                <el-cascader
                  :options="selectOrgGoodsForm.catagoryOptions"
                  v-model="selectOrgGoodsForm.goodsCategory"
                  style="display: block; width: 320px"
                  size="medium"
                  separator=" -> "
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              right
              style="width: 49.1%;"
            >
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click.native="handleSearchGoods(selectOrgGoodsForm.pageNum)"
                >搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <!-- 表格部分 -->
        <el-row style="margin-top: 20px;">
          <el-col
            :span="24"
            center
          >
            <el-table
              ref="multipleTable"
              :data="selectOrgGoodsForm.goodsList"
              :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
              row-key="id"
              tooltip-effect="dark"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                :reserve-selection="true"
                type="selection"
                width="55"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="id"
                label="商品ID"
                width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称"
                width="200"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="goodsCategoryNames"
                label="商品类目"
                min-width="200"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="orgName"
                label="所属机构"
                width="200"
                fixed="right"
                align="center"
              ></el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row style="margin-top: 30px;">
          <el-col
            :span="24"
            center
          >
            <el-pagination
              :page-size="selectOrgGoodsForm.pageSize"
              :current-page.sync="selectOrgGoodsForm.pageNum"
              :total="selectOrgGoodsForm.totalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @current-change="handleSearchGoods(selectOrgGoodsForm.pageNum)"
            ></el-pagination>
          </el-col>
        </el-row>

        <el-row style="margin-top: 30px;">
          <el-col
            :span="24"
            center
          >
            <el-button @click="state.centerDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click.native="submitBindingGoods"
            >确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </section>
  </div>
</template>
<script>
import _ from 'lodash';
import NullImgFile from '@/assets/null.png';
import multiUploadImage from '@/components/Upload/multiImage';
import {
  getGoodsDetails,
  addGoods,
  getLinks,
  getOperationalStaff,
  getAllOrgList,
  getAllOrgGoods,
} from '@/api/h5-private';
import { goodsCategoryAll } from '@/api/goods';
import { copyText } from '@/utils';

const AdapterCategoryMenuData = function(data = []) {
  const temp = data.map(i => {
    const item = {
      id: i.id,
      value: i.id,
      level: i.level,
      label: i.name,
      checked: false,
    };
    if (i.childList && i.childList.length > 0) {
      item.children = AdapterCategoryMenuData(i.childList);
    }

    return item;
  });
  return temp;
};

export default {
  name: 'H5GoodsAdd',
  components: {
    multiUploadImage,
  },
  data() {
    const validatorPriceType = (value, callback, errTips = '输入错误') => {
      const valueSplit = String(value).split('.');
      const decimal = valueSplit[1];
      const integer = valueSplit[0];
      if (
        value === '' ||
        (decimal && decimal.length > 2) ||
        (integer.length > 1 && String(integer).indexOf('0') === 0)
      ) {
        callback(new Error(errTips));
      } else {
        callback();
      }
    };

    return {
      disappear: false,
      allowSave: true,
      allowCreateLinks: false,
      goodsId: null,
      NullImgFile,
      ruleForm: {
        goodsName: '',
        price: '',
        salePrice: '',
        activityPrice: '',
        propagandaUrl: [],
        codeUrl: [],
        binding: '',
        operatorList: [],
        operators: [],
        operatorName: '',
        nameList: [],
        salePriceUrl: '',
        bindingGoods: '', // 绑定课程名称
        goodsId: '',
        hjGoodsId: '', // 绑定课程id
      },
      state: {
        isShowOperatorWindow: false,
        onCloseOperatorWindowType: null,
        centerDialogVisible: false,
      },
      rules: {
        price: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatorPriceType(
                value,
                callback,
                '请正确输入商品原价（十进制，最多2位小数）'
              );
            },
            trigger: 'change',
          },
        ],
        salePrice: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatorPriceType(
                value,
                callback,
                '请正确输入商品售价（十进制，最多2位小数）'
              );
            },
            trigger: 'change',
          },
        ],
        activityPrice: [
          {
            validator: (rule, value, callback) => {
              if (Number(this.ruleForm.price) > 0) {
                validatorPriceType(
                  value,
                  callback,
                  '请正确输入优惠价格（十进制，最多2位小数）'
                );
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        goodsName: [{ required: true, message: '请输入商品名称' }],
        bindingGoods: [{ required: true, message: '请绑定机构商品' }],
        propagandaUrl: [{ required: true, message: '请上传课程宣传图' }],
        codeUrl: [{ required: true, message: '请上传客服二维码' }],
      },
      selectOperatorForm: {
        operatorName: '',
        id: '',
        list: [],
        pageNum: 1,
        pageSize: 5,
        totalCount: 10,
        isSelectAll: false,
        selectedItemsBackups: [],
        selectedItems: [],
      },
      selectOrgGoodsForm: {
        searchGoodsId: '',
        goodsName: '',
        goodsId: '',
        orgId: '',
        goodsCategory: [],
        goodsList: [],
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
        orgList: [
          {
            id: 0,
            name: '恒企教育',
          },
          {
            id: 1,
            name: '行家',
          },
        ],
        selectedGoods: '',
        catagoryOptions: [],
        multipleSelection: [],
      },
    };
  },
  mounted() {
    this.getOperationalStaffData();
    this.getGoodsCategoryAll();
    this.orgGoodsList();
    this.getOrgName();
  },
  methods: {
    // 弹窗绑定商品多选
    handleSelectionChange(val) {
      this.selectOrgGoodsForm.multipleSelection = val;
    },

    // 所属机构列表
    async getOrgName() {
      const orgRes = await getAllOrgList();
      if (orgRes.code !== 200) return Promise.reject();
      this.selectOrgGoodsForm.orgList = orgRes.result;
    },

    // 获取商品类目
    async getGoodsCategoryAll(projectType = 1) {
      // 获取商品类目菜单列表
      const categoryRes = await goodsCategoryAll(projectType);
      if (categoryRes.code !== 200) return Promise.reject();
      this.selectOrgGoodsForm.catagoryOptions = AdapterCategoryMenuData(
        categoryRes.result || []
      );

      this.selectOrgGoodsForm.goodsCategory = [];
    },

    // 绑定机构商品
    bindingOrgGoods(pageNum = 1) {
      this.state.centerDialogVisible = true;
      this.handleReset();
      this.orgGoodsList();
      if (this.ruleForm.hjGoodsId === '') {
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection();
        });
      }
    },

    // 清除输入内容
    handleReset() {
      this.selectOrgGoodsForm.searchGoodsId = '';
      this.selectOrgGoodsForm.goodsName = '';
      this.selectOrgGoodsForm.orgId = '';
      this.selectOrgGoodsForm.orgName = '';
      this.selectOrgGoodsForm.goodsCategory = [];
      this.selectOrgGoodsForm.goodsId = '';
    },

    // 获取机构商品列表
    async orgGoodsList(pageNum = 1) {
      const res = await getAllOrgGoods({
        pageNum,
        pageSize: this.selectOrgGoodsForm.pageSize,
        goodsName: this.selectOrgGoodsForm.goodsName,
        goodsId: this.selectOrgGoodsForm.searchGoodsId,
        orgId: this.selectOrgGoodsForm.orgId,
        goodsCategoryId: this.selectOrgGoodsForm.goodsCategory[
          this.selectOrgGoodsForm.goodsCategory.length - 1
        ],
        issueStatus: 1,
      });
      if (res.code !== 200) return Promise.reject();
      this.selectOrgGoodsForm.goodsList = res.result.list.map(item => {
        item.goodsCategoryNames = item.goodsCategoryNames.join(' -> ');
        return item;
      });
      this.selectOrgGoodsForm.pageNum = res.result.currPage;
      this.selectOrgGoodsForm.pageSize = res.result.pageSize;
      this.selectOrgGoodsForm.totalCount = res.result.totalCount;
    },

    // 搜索机构商品
    handleSearchGoods(pageNum = 1) {
      this.orgGoodsList(pageNum);
    },

    // 机构商品单选
    getCurrentRow(item) {
      this.selectOrgGoodsForm.selectedGoods = item;
    },

    // // 确定绑定机构商品
    // submitBindingGoods() {
    //   if (this.selectOrgGoodsForm.selectedGoods) {
    //     this.selectOrgGoodsForm.goodsId = this.selectOrgGoodsForm.selectedGoods.id;
    //     this.ruleForm.bindingGoods = this.selectOrgGoodsForm.selectedGoods.name;
    //     this.ruleForm.goodsName = this.selectOrgGoodsForm.selectedGoods.name;
    //     this.ruleForm.hjGoodsId = this.selectOrgGoodsForm.selectedGoods.id;
    //     this.state.centerDialogVisible = false;
    //   } else {
    //     this.$message.error('请选择商品');
    //     this.state.centerDialogVisible = true;
    //     return false;
    //   }
    // },

    // 确定绑定机构商品
    submitBindingGoods() {
      let hjGoodsIdList = [];
      let nameList = [];
      if (this.selectOrgGoodsForm.multipleSelection.length > 0) {
        this.selectOrgGoodsForm.multipleSelection.map(item => {
          hjGoodsIdList.push(item.id);
          nameList.push(item.name);
          return;
        });
        this.ruleForm.hjGoodsId = hjGoodsIdList.join(',');
        this.ruleForm.bindingGoods = nameList.join(', ');
        this.state.centerDialogVisible = false;
      } else {
        this.$message.error('请选择商品');
        this.state.centerDialogVisible = true;
        return false;
      }
    },

    renderDetailsData(res) {
      let nameList = [];
      nameList = res.result.hjGoodsNames.split(',');
      this.ruleForm.bindingGoods = nameList.join(', ');
      this.ruleForm.goodsName = res.result.name;
      this.ruleForm.price = res.result.originalPrice;
      this.ruleForm.salePrice = res.result.price;
      this.ruleForm.activityPrice = res.result.discount;
      this.ruleForm.salePriceUrl = res.result.link;
      this.ruleForm.operators = res.result.operators;
      this.ruleForm.operatorList = res.result.operators.map(i => {
        return {
          $key: i.operatorId,
          checked: true,
          _id: i.operatorId,
          userId: i.operatorId,
          userName: i.operatorName,
        };
      });
      this.selectOperatorForm.selectedItems = this.ruleForm.operatorList.concat(
        []
      );

      if (res.result.goodsCoverImages.length) {
        this.ruleForm.propagandaUrl = res.result.goodsCoverImages.map(i =>
          decodeURIComponent(i)
        );
      }
      if (res.result.customerServiceImages.length) {
        this.ruleForm.codeUrl = res.result.customerServiceImages.map(i =>
          decodeURIComponent(i)
        );
      }
    },
    async getDetails(id) {
      if (!id) return false;
      const res = await getGoodsDetails(id);
      if (res.code !== 200) return false;
      this.renderDetailsData(res);
    },

    // 运营人员列表
    async getOperationalStaffData(pageNum = 1) {
      const res = await getOperationalStaff({
        pageNum,
        pageSize: this.selectOperatorForm.pageSize,
        userName: this.selectOperatorForm.operatorName,
        userId: this.selectOperatorForm.id,
      });
      if (res.code !== 200) return Promise.reject();
      this.selectOperatorForm.pageNum = res.result.currPage;
      this.selectOperatorForm.pageSize = res.result.pageSize;
      this.selectOperatorForm.totalCount = res.result.totalCount;
      this.selectOperatorForm.list = res.result.list.map(i => {
        i.$key = i.userId;
        i._id = i.userId;
        i.checked = false;

        this.selectOperatorForm.selectedItemsBackups.forEach(j => {
          if (i._id === j._id) {
            i.checked = true;
          }
        });

        return i;
      });

      // 是否显示全选
      this.selectOperatorForm.isSelectAll = !this.selectOperatorForm.list.some(
        i => !i.checked
      );
    },

    // 监听打开运营弹窗事件
    onOpenSelectOperatorWindow(pageNum = 1) {
      if (!!this.allowSave) {
        this.state.isShowOperatorWindow = false;
      } else {
        this.selectOperatorForm.operatorName = '';
        this.selectOperatorForm.id = '';
        this.state.isShowOperatorWindow = true;
        this.getOperationalStaffData(pageNum);
      }
    },

    onOperatorWindowClose() {
      this.state.isShowOperatorWindow = false;
      if (!this.state.onCloseOperatorWindowType) {
        this.selectOperatorForm.selectedItemsBackups = [
          ...this.selectOperatorForm.selectedItems,
        ];
      }
    },

    // 选择运营人员弹窗 - 打开
    onOperatorWindowOpen() {
      this.state.onCloseOperatorWindowType = null;
      this.selectOperatorForm.selectedItemsBackups = [
        ...this.selectOperatorForm.selectedItems,
      ];
      this.selectOperatorForm.list.forEach(i => {
        i.checked = false;
        this.selectOperatorForm.selectedItemsBackups.forEach(j => {
          if (i._id === j._id) {
            i.checked = true;
          }
        });
      });

      // 是否显示全选
      this.selectOperatorForm.isSelectAll = !this.selectOperatorForm.list.some(
        i => !i.checked
      );

      this.state.isShowOperatorWindow = true;
    },

    // 课程图片
    handleSelectedCover(urls = []) {
      this.ruleForm.propagandaUrl = urls;
    },

    // 客服二维码
    handleSelectedCodeCover(urls = []) {
      this.ruleForm.codeUrl = urls;
    },

    // 获取运营列表
    getOperatorList(pageNum = 1) {
      this.getOperationalStaffData(pageNum);
    },

    // 复制
    copyDiscountsUrl(text = String) {
      copyText(text);
      this.$message.success('复制成功');
    },

    // 确定 -> 选择运营
    onOperatorWindowConfirm() {
      const newSelectedItems = [
        ...this.selectOperatorForm.selectedItemsBackups,
      ];
      this.ruleForm.operatorList = newSelectedItems;
      this.selectOperatorForm.selectedItems = newSelectedItems;
      // this.ruleForm.operatorName = newSelectedItems
      //   .map(i => i.operatorName.trim())
      //   .join(';');
      this.state.isShowOperatorWindow = false;
      this.state.onCloseOperatorWindowType = 200;
    },

    // 选择运营弹窗 - 【单选 or 全选】
    onSelectOperatorCheckBox(selection, isSelect, isAll) {
      if (isAll) {
        selection.forEach(i => {
          i.checked = isSelect;
        });
      }

      if (isSelect) {
        this.selectOperatorForm.selectedItemsBackups = _.uniqBy(
          [...this.selectOperatorForm.selectedItemsBackups, ...selection],
          '_id'
        );
      } else {
        this.selectOperatorForm.selectedItemsBackups = _.differenceBy(
          this.selectOperatorForm.selectedItemsBackups,
          selection,
          '_id'
        );
      }
      const isSelectAll = this.selectOperatorForm.list.every(i => !!i.checked);
      this.selectOperatorForm.isSelectAll = isSelectAll;
    },

    // 选择运营弹窗 - 删除一个已选中项
    onRemoveSelectedOperatorItem(item) {
      this.selectOperatorForm.list.some(i => {
        if (i._id === item._id) {
          i.checked = false;
          return true;
        }
        return false;
      });
      this.selectOperatorForm.selectedItemsBackups = _.differenceBy(
        this.selectOperatorForm.selectedItemsBackups,
        [item],
        '_id'
      );
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch('delView', this.$route);
      this.$router.go(-1);
    },

    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addGoods({
            id: this.goodsId,
            name: this.ruleForm.goodsName,
            originalPrice: Number(this.ruleForm.price),
            price: Number(this.ruleForm.salePrice),
            discount: Number(this.ruleForm.activityPrice),
            goodsCoverImage: this.ruleForm.propagandaUrl
              .map(i => encodeURIComponent(i))
              .join(','),
            customerServiceImage: this.ruleForm.codeUrl
              .map(i => encodeURIComponent(i))
              .join(','),
            hjGoodsId: this.ruleForm.hjGoodsId,
          }).then(res => {
            this.goodsId = res.result.id;
            this.renderDetailsData(res);
            this.allowSave = false;
            this.allowCreateLinks = true;
            this.$message.success('保存成功');
          });
        } else {
          return false;
        }
      });
    },

    // 生成链接
    handleCreateUrl() {
      if (!this.goodsId) return false;
      // if (!this.ruleForm.operatorList.length) {
      //   this.$message.warning('请绑定运营再生成链接');
      //   return false;
      // }
      getLinks({
        goodsId: this.goodsId,
        operators: this.ruleForm.operatorList.map(i => {
          return {
            operatorId: i.userId,
            operatorName: i.userName,
          };
        }),
      }).then(res => {
        this.renderDetailsData(res);
      });
    },
  },
};
</script>
<style lang="less" scoped>
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #aab2bd;
}
.goods-list-add {
  .originalPrice {
    width: 100%;
    text-decoration: line-through;
    height: 36px;
    padding-left: 15px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }
  .hasPrice {
    width: 100%;
    text-decoration: line-through;
    height: 36px;
    padding-left: 15px;
    border-radius: 4px;
    border: 1px solid #67c23a;
  }
  .cover-img {
    margin-right: 20px;
    display: inline-block;
    width: 100px;
    height: 100px;
  }

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
    background-color: #fff;
    cursor: pointer;
    user-select: none;
    position: relative;
    &.active {
      color: #333;
      border-color: #67c23a;
    }
    .tag-box {
      color: #409eff;
      padding: 3px;
      margin-right: 10px;
      border: 1px solid #409eff;
      border-radius: 4px;
      background: #ffffff;
    }
    .disabled-mask {
      position: absolute;
      display: inline-block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      cursor: url('/static/disabled.ico'), auto;
    }
  }
  .cover-tips {
    color: red;
  }
  .tips {
    margin: 20px 0px;
    color: #6b6a6a;
  }
  .price {
    margin-top: 20px;
    .priceUrl {
      color: blue;
      text-decoration: underline;
      margin-right: 20px;
    }
    .copy {
      cursor: pointer;
      color: blue;
      text-decoration: underline;
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
}
</style>