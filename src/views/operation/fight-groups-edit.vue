<template>
  <div class="content-container">
    <section class="fight-groups-edit">
      <h4>
        <span class="color-block-primary"></span>
        拼团信息（带
        <span style="color: #f56c6c">*</span>为必填项）
      </h4>

      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        size="small"
        label-position="right"
        label-width="120px"
        style="margin-top: 30px;"
      >
        <el-form-item label="团名：" prop="fightGroupsName">
          <el-col :span="8">
            <el-input
              v-model="ruleForm.fightGroupsName"
              style="width: 100%;"
              size="medium"
              max="15"
              clearable
              placeholder="请输入团名称，不超过15个字"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="生效范围：" prop="effectType">
          <el-row>
            <el-col :span="3">
              <el-radio v-model="state.effectType" :label="1">全场通用</el-radio>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col :span="3">
              <el-radio v-model="state.effectType" :label="2">指定商品类目</el-radio>
            </el-col>
            <el-col v-if="state.effectType === 2" :span="10">
              <div v-for="(item, index) in ruleForm.effectValueArr" :key="index" class="effect-li">
                <el-cascader
                  :options="config.catagoryOptions"
                  :value="item"
                  change-on-select
                  size="medium"
                  separator=" -> "
                  style="width: 70%;"
                  @change="(val) => onCategoryChange(val, index)"
                ></el-cascader>
                <i
                  v-if="(ruleForm.effectValueArr.length > 1)"
                  class="el-icon-remove-outline icon-delete"
                  @click="onEffectDelete(index)"
                ></i>

                <i
                  v-if="index === (ruleForm.effectValueArr.length - 1) && item.length > 0"
                  class="el-icon-circle-plus-outline icon-add"
                  @click="onEffectAdd"
                ></i>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col :span="3">
              <el-radio v-model="state.effectType" :label="3">指定商品</el-radio>
            </el-col>
            <el-col v-if="state.effectType === 3" :span="10">
              <div
                :class="{ active: ruleForm.selectedGoodsItems.length > 0 }"
                class="input-box"
                style="display: inline-block; width: 70%;"
                @click="onOpenSelectLecturerWindow"
              >{{ ruleForm.selectedGoodsItemsName || '请选择商品' }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <div class="effet-tips">
                <span>注意</span>：在有效期内，有一个商品同时参与多个团时，在前端展示上会根据生效范围的优先级展示最高优先级的商品拼团信息，优先级从高到低为：
                <span>指定商品 > 指定商品类目 > 全场通用</span> ，在设置生效范围时，尽量避免该情况的出现
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="有效期：" prop="validityType">
          <el-col :span="24">
            <el-radio-group v-model="ruleForm.validityType">
              <el-radio :label="0">24h</el-radio>
              <el-radio :label="1">36h</el-radio>
              <el-radio :label="2">72h</el-radio>
              <el-radio :label="3">其他</el-radio>
            </el-radio-group>

            <span v-if="ruleForm.validityType === 3" style="margin-left: 20px;">
              <el-input
                v-model="ruleForm.validityValue"
                min="0"
                step="1"
                type="number"
                clearable
                style="display: inline-block; width: 100px;"
              ></el-input>&nbsp;h
              <span class="validity-value-tips">只能填整数，必须大于0</span>
            </span>
          </el-col>
        </el-form-item>

        <el-form-item label="拼团优惠：" prop="discountsType">
          <el-row>
            <el-col :span="2">
              <el-radio v-model="state.discountsType" :label="1">现金优惠</el-radio>
            </el-col>
            <el-col v-if="state.discountsType === 1" :span="8">
              <el-input
                v-model="ruleForm.discountsValue"
                min="0"
                type="number"
                style="display: inline-block; width: 80px;"
                @blur="onDiscountsValueChange"
              ></el-input>&nbsp;元
              <span class="validity-value-tips">精确到分，如9.00、9.99</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-radio v-model="state.discountsType" :label="2">折扣优惠</el-radio>
            </el-col>
            <el-col v-if="state.discountsType === 2" :span="8">
              <el-input
                v-model="ruleForm.discountsValue2"
                min="1"
                max="10"
                step="1"
                type="number"
                style="display: inline-block; width: 80px;"
                @blur="onDiscountsValue2Change"
              ></el-input>&nbsp;折
              <span class="validity-value-tips">取1-10之间任一值，必须为整数</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="初始成团数：" prop="fightGroupsVal">
          <el-input
            v-model="ruleForm.fightGroupsVal[0]"
            min="0"
            step="1"
            type="number"
            style="display: inline-block; width: 80px;"
            @blur="onFightGroupsVal"
          ></el-input>
          <span>-</span>
          <el-input
            v-model="ruleForm.fightGroupsVal[1]"
            min="0"
            step="1"
            type="number"
            style="display: inline-block; width: 80px;"
            @blur="onFightGroupsVal2"
          ></el-input>
          <span class="validity-value-tips">如[12，50]，格式为整数，右端点必须大于左端点，随机取该区间中的任一值</span>
        </el-form-item>

        <el-form-item style="margin-top: 50px;">
          <el-button size="medium" style="margin-left: 100px;" @click.native="goBack">取消</el-button>
          <el-button
            size="medium"
            style="margin-left: 50px;"
            type="primary"
            @click.native="submitForm('ruleForm')"
          >重新提交</el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 选择商品弹窗 -->
    <el-dialog
      :visible.sync="state.isShowSelectGoodsWindow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="选择商品"
      width="800px"
      custom-class="dialog-window"
      @close="onSelectGoodsWindowClose"
      @open="onSelectGoodsWindowOpen"
    >
      <el-form :model="selectGoodsWindow">
        <!-- filter -->
        <el-row :gutter="20">
          <el-col :span="16">
            <el-row :gutter="30" type="flex" align="middle">
              <el-col :span="10">
                <el-cascader
                  :options="config.catagoryOptions"
                  v-model="selectGoodsWindow.selectedCategory"
                  change-on-select
                  size="medium"
                  separator=" -> "
                ></el-cascader>
              </el-col>

              <el-col :span="12">
                <el-input v-model="selectGoodsWindow.name" placeholder="商品名称"></el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="12" center>
                <el-button type="primary" @click.native="getGoodsList()">查询</el-button>
              </el-col>
              <el-col :span="12" center>
                <el-button @click.native="selectGoodsWindow.name = ''">清空</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- table -->
        <el-table
          ref="goods-table"
          :data="selectGoodsWindow.list"
          current-row-key="id"
          row-key="id"
          max-height="400"
          border
          size="small"
          style="margin-top: 30px;"
        >
          <el-table-column width="50" align="center">
            <template slot="header" slot-scope="scope">
              <el-checkbox
                v-model="selectGoodsWindow.isSelectAll"
                @change="val => { onSelectLecturerCheckBox(selectGoodsWindow.list, val, true) }"
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
          <el-table-column prop="id" width="200" label="商品ID"></el-table-column>
          <el-table-column prop="name" min-width="150" label="商品名称"></el-table-column>
        </el-table>
        <!-- pagination -->
        <el-row style="margin-top: 20px;">
          <el-col :span="24" center>
            <el-pagination
              :current-page.sync="selectGoodsWindow.currPage"
              :page-size="selectGoodsWindow.pageSize"
              :total="selectGoodsWindow.totalCount"
              background
              layout="prev, pager, next, jumper"
              @current-change="getGoodsList(selectGoodsWindow.currPage)"
            ></el-pagination>
          </el-col>
        </el-row>

        <!-- selected list -->
        <div class="goods-window-selected">
          <el-row :gutter="20" type="flex" align="top">
            <el-col :span="4">已选中：</el-col>
            <el-col :span="20" style="max-height: 80px; overflow-y: auto;">
              <el-tag
                v-for="tag in selectGoodsWindow.selectedItemsBackups"
                :key="tag.$key"
                closable
                type="info"
                @close="onRemoveSelectedLecturerItem(tag)"
              >{{ tag.name }}</el-tag>
            </el-col>
          </el-row>
        </div>

        <!-- foolter -->
        <el-row :gutter="20" type="flex" align="middle" justify="center" style="margin-top: 30px;">
          <el-col :span="6" center>
            <el-button @click.native="state.isShowSelectGoodsWindow = false">取消</el-button>
          </el-col>
          <el-col :span="6" center>
            <el-button type="primary" @click.native="onLecturerWindowConfirm">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { goodsCategoryAll } from "@/api/goods";
import {
  editFightGroups,
  getFightGroupInfoById,
  getDialogGoodsList
} from "@/api/operation";

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

export default {
  name: "OperationFightGroupsEdit",
  components: {},
  data() {
    return {
      state: {
        effectType: 0,
        discountsType: 0,
        isShowSelectGoodsWindow: false,
        onCloseLectureWindowType: null
      },
      config: {
        catagoryOptions: []
      },
      ruleForm: {
        fightGroupsName: "",
        effectValueArr: [[]],
        effectValueArr2: [],
        validityType: 0,
        validityValue: "",
        discountsValue: "",
        discountsValue2: "",
        fightGroupsVal: ["", ""],
        selectedGoodsItems: [],
        selectedGoodsItemsName: ""
      },
      rules: {
        fightGroupsName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (String(value).length > 15) {
                callback(new Error("团名称不能超过15个字"));
              } else if (String(value) === "") {
                callback(new Error("请输入团名称"));
              } else {
                callback();
              }
            }
          }
        ],
        effectType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.state.effectType === 1) {
                callback();
              } else if (this.state.effectType === 2) {
                const isPass = this.ruleForm.effectValueArr.every(
                  i => i.length > 0
                );
                if (!isPass) {
                  callback(new Error("请正确填写生效范围 -  指定商品类目"));
                } else {
                  callback();
                }
              } else if (this.state.effectType === 3) {
                if (this.selectGoodsWindow.selectedItems.length <= 0) {
                  callback(new Error("请正确填写生效范围 - 指定商品"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请正确填写生效范围"));
              }
            }
          }
        ],
        validityType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                this.ruleForm.validityType === 3 &&
                (!this.ruleForm.validityValue ||
                  String(this.ruleForm.validityValue).indexOf(".") !== -1)
              ) {
                callback(new Error("请正确填写有效期"));
              } else {
                callback();
              }
            }
          }
        ],
        discountsType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.state.discountsType === 1) {
                if (
                  Number(this.ruleForm.discountsValue) !== 0 &&
                  !Number(this.ruleForm.discountsValue)
                ) {
                  callback(new Error("请正确填写现金优惠"));
                } else {
                  callback();
                }
              } else if (this.state.discountsType === 2) {
                if (
                  Number(this.ruleForm.discountsValue2) < 1 ||
                  Number(this.ruleForm.discountsValue2) > 10
                ) {
                  callback(new Error("请正确填写折扣优惠"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请正确填写拼团优惠"));
              }
            }
          }
        ],
        fightGroupsVal: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                !Number(this.ruleForm.fightGroupsVal[0]) ||
                !Number(this.ruleForm.fightGroupsVal[1])
              ) {
                callback(new Error("请正确填写初始成团数"));
              }
              if (
                Number(this.ruleForm.fightGroupsVal[0]) >=
                Number(this.ruleForm.fightGroupsVal[1])
              ) {
                callback(new Error("右端点必须大于左端点"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      selectGoodsWindow: {
        selectedCategory: [],
        paramsStr: "",
        name: "",
        list: [],
        isSelectAll: false,
        selectedVal: "",
        selectedItems: [],
        selectedItemsBackups: [],
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      }
    };
  },
  watch: {
    "state.effectType": function() {
      this.$refs.ruleForm.validateField(["effectType"]);
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 现金优惠 - 保留2位小数
    onDiscountsValueChange() {
      this.ruleForm.discountsValue = Number(
        this.ruleForm.discountsValue
      ).toFixed(2);
    },

    // 折扣优惠 - 整数
    onDiscountsValue2Change() {
      this.ruleForm.discountsValue2 =
        parseInt(this.ruleForm.discountsValue2, 10) || "";
    },

    // 初始成团数 - 左
    onFightGroupsVal() {
      this.ruleForm.fightGroupsVal[0] =
        parseInt(this.ruleForm.fightGroupsVal[0], 10) || 0;
      this.ruleForm.fightGroupsVal = this.ruleForm.fightGroupsVal.concat([]);
    },

    // 初始成团数 - 右
    onFightGroupsVal2() {
      this.ruleForm.fightGroupsVal[1] =
        parseInt(this.ruleForm.fightGroupsVal[1], 10) || 0;
      this.ruleForm.fightGroupsVal = this.ruleForm.fightGroupsVal.concat([]);
    },

    async getFightGroupInfoById() {
      const res = await getFightGroupInfoById(this.$route.params.id);
      if (res.code !== 200) return Promise.reject();
      // 团名
      this.ruleForm.fightGroupsName = res.result.groupName;

      // 生效范围
      this.state.effectType = res.result.rangeType;
      if (res.result.rangeType === 2) {
        // 指定商品类目
        const findCategoryIdsByChildId = childId => {
          if (!childId) return [];
          const categorys = [...this.config.catagoryOptions];
          let selectedItem;
          const generateParentTree = (arr = [], parent) => {
            arr.some(i => {
              i.parent = parent;
              if (i.id === 20) {
                selectedItem = i;
              } else if (i.children && i.children.length > 0) {
                generateParentTree(i.children, i);
              }
              if (selectedItem) return true;
              return false;
            });
          };
          generateParentTree(categorys);
          let ids = [];
          const findIds = (obj = {}) => {
            if (obj.id) ids.push(obj.id);
            if (obj.parent) findIds(obj.parent);
          };
          findIds(selectedItem);
          ids = ids.reverse();
          return ids;
        };
        const effectValueArr = [];
        res.result.rangeList.forEach(i => {
          effectValueArr.push(findCategoryIdsByChildId(i.goodsCategoryId));
        });
        this.ruleForm.effectValueArr = effectValueArr;
      } else if (res.result.rangeType === 3) {
        const list = res.result.rangeList.map(i => {
          return {
            $key: i.goodsId,
            id: i.goodsId,
            name: i.goodsName,
            ...i
          };
        });
        // 指定商品
        this.selectGoodsWindow.selectedItems = list;
        this.ruleForm.selectedGoodsItems = list;
        this.ruleForm.selectedGoodsItemsName = list
          .map(i => i.goodsName.trim())
          .join("、");
      }

      // 有效期
      if (res.result.effectiveTerm === 24) {
        this.ruleForm.validityType = 0;
      } else if (res.result.effectiveTerm === 36) {
        this.ruleForm.validityType = 1;
      } else if (res.result.effectiveTerm === 72) {
        this.ruleForm.validityType = 2;
      } else {
        this.ruleForm.validityType = 3;
      }
      this.ruleForm.validityValue = res.result.effectiveTerm;

      // 拼团优惠
      if (res.result.discountType === 1) {
        // 现金优惠
        this.ruleForm.discountsValue = Number(res.result.discountAmount).toFixed(2);
      } else if (res.result.discountType === 2) {
        // 折扣优惠
        this.ruleForm.discountsValue2 = res.result.discountRate;
      }
      this.state.discountsType = res.result.discountType;

      // 初始成团数
      this.ruleForm.fightGroupsVal[0] = res.result.groupSizeLow;
      this.ruleForm.fightGroupsVal[1] = res.result.groupSizeHigh;
      this.ruleForm.fightGroupsVal = this.ruleForm.fightGroupsVal.concat([]);
    },

    // 页面初始化
    async initData() {
      // 获取讲师列表
      this.getGoodsList();

      // 获取商品类目菜单列表
      const categoryRes = await goodsCategoryAll();
      if (categoryRes.code !== 200) return Promise.reject();
      this.config.catagoryOptions = AdapterCategoryMenuData(
        categoryRes.result || []
      );

      // 获取详情
      this.getFightGroupInfoById();
    },

    // 返回上一页
    goBack() {
      this.$store.dispatch("delView", this.$route);
      this.$router.go(-1);
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const options = {
            group: {
              id: this.$route.params.id,
              groupName: this.ruleForm.fightGroupsName,
              effectiveTerm: this.ruleForm.validityValue,
              discountType: this.state.discountsType,
              discountAmount: this.ruleForm.discountsValue,
              discountRate: this.ruleForm.discountsValue2,
              groupSizeLow: this.ruleForm.fightGroupsVal[0],
              groupSizeHigh: this.ruleForm.fightGroupsVal[1],
              rangeType: this.state.effectType
            },
            groupRangeDTO: {
              goodsIds: "",
              goodsCategoryIds: ""
            }
          };

          // 有效期
          if (this.ruleForm.validityType === 0) {
            options.group.effectiveTerm = 24;
          } else if (this.ruleForm.validityType === 1) {
            options.group.effectiveTerm = 36;
          } else if (this.ruleForm.validityType === 2) {
            options.group.effectiveTerm = 72;
          }

          // 生效范围
          if (this.state.effectType === 2) {
            const goodsCategoryIds = [];
            this.ruleForm.effectValueArr.forEach(i => {
              if (i.length > 0) {
                goodsCategoryIds.push(i[i.length - 1]);
              }
            });
            options.groupRangeDTO.goodsCategoryIds = goodsCategoryIds.join(",");
          } else if (this.state.effectType === 3) {
            options.groupRangeDTO.goodsIds = this.selectGoodsWindow.selectedItems
              .map(i => i.id)
              .join(",");
          }

          editFightGroups(options).then(res => {
            if (res.code === 200) {
              this.$message.success("添加成功");
              this.goBack();
            }
          });
        } else {
          return false;
        }
      });
    },

    // 指定商品类目 - 选择商品类目
    onCategoryChange(valArr, index) {
      const newArr = this.ruleForm.effectValueArr.concat([]);
      newArr[index] = valArr;
      this.ruleForm.effectValueArr = newArr;
    },

    // 指定商品类目 - 添加
    onEffectAdd() {
      this.ruleForm.effectValueArr.push([]);
    },

    // 指定商品类目 - 删除
    onEffectDelete(index) {
      this.ruleForm.effectValueArr.splice(index, 1);
    },

    // 指定商品类目 - 删除
    onEffectGoodsNameDelete(index) {
      this.ruleForm.effectValueArr2.splice(index, 1);
    },

    // 监听打开讲师弹窗事件
    onOpenSelectLecturerWindow() {
      this.state.isShowSelectGoodsWindow = true;
    },

    // 获取商品列表
    async getGoodsList(pageNum = 1) {
      const options = {
        name: this.selectGoodsWindow.name.trim(),
        goodsCategoryId: "",
        pageNum,
        pageSize: 10
      };

      if (this.selectGoodsWindow.selectedCategory.length > 0) {
        options.goodsCategoryId = this.selectGoodsWindow.selectedCategory[
          this.selectGoodsWindow.selectedCategory.length - 1
        ];
      }

      const jsonParams = JSON.stringify(options);
      if (this.selectGoodsWindow.paramsStr === jsonParams) {
        return Promise.resolve();
      }
      this.selectGoodsWindow.paramsStr = jsonParams;

      // 发起请求
      const res = await getDialogGoodsList(options);
      if (res.code !== 200) return Promise.reject();

      // 数据填充
      this.selectGoodsWindow.list = res.result.list.map(i => {
        i.$key = i.id;
        i.checked = false;

        this.selectGoodsWindow.selectedItemsBackups.forEach(j => {
          if (i.id === j.id) {
            i.checked = true;
          }
        });

        return i;
      });

      // 是否显示全选
      this.selectGoodsWindow.isSelectAll = !this.selectGoodsWindow.list.some(
        i => !i.checked
      );

      this.selectGoodsWindow.currPage = res.result.currPage;
      this.selectGoodsWindow.pageSize = res.result.pageSize || 10;
      this.selectGoodsWindow.totalPage = res.result.totalPage;
      this.selectGoodsWindow.totalCount = res.result.totalCount;

      this.$nextTick(() => {
        if (this.$refs["goods-table"]) {
          this.$refs["goods-table"].bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 选择商品弹窗 - 【单选 or 全选】
    onSelectLecturerCheckBox(selection, isSelect, isAll) {
      if (isAll) {
        selection.forEach(i => {
          i.checked = isSelect;
        });
      }

      if (isSelect) {
        this.selectGoodsWindow.selectedItemsBackups = _.uniqBy(
          [...this.selectGoodsWindow.selectedItemsBackups, ...selection],
          "id"
        );
      } else {
        this.selectGoodsWindow.selectedItemsBackups = _.differenceBy(
          this.selectGoodsWindow.selectedItemsBackups,
          selection,
          "id"
        );
      }
      const isSelectAll = this.selectGoodsWindow.list.every(i => !!i.checked);
      this.selectGoodsWindow.isSelectAll = isSelectAll;
    },

    // 选择商品弹窗 - 确定
    onLecturerWindowConfirm() {
      const newSelectedItems = [...this.selectGoodsWindow.selectedItemsBackups];
      this.ruleForm.selectedGoodsItems = newSelectedItems;
      this.selectGoodsWindow.selectedItems = newSelectedItems;
      this.ruleForm.selectedGoodsItemsName = newSelectedItems
        .map(i => i.name.trim())
        .join("、");
      this.state.isShowSelectGoodsWindow = false;
      this.state.onCloseLectureWindowType = 200;
    },

    // 选择商品弹窗 - 删除一个已选中项
    onRemoveSelectedLecturerItem(item) {
      this.selectGoodsWindow.list.some(i => {
        if (i.id === item.id) {
          i.checked = false;
          return true;
        }
        return false;
      });
      this.selectGoodsWindow.selectedItemsBackups = _.differenceBy(
        this.selectGoodsWindow.selectedItemsBackups,
        [item],
        "id"
      );
    },

    // 选择商品弹窗 - 打开
    onSelectGoodsWindowOpen() {
      this.state.onCloseLectureWindowType = null;
      this.selectGoodsWindow.selectedItemsBackups = [
        ...this.selectGoodsWindow.selectedItems
      ];
      let isSelectAll = false;

      this.selectGoodsWindow.list.forEach(i => {
        i.checked = false;
        isSelectAll = false;
        this.selectGoodsWindow.selectedItemsBackups.forEach(j => {
          if (i.id === j.id) {
            i.checked = true;
            isSelectAll = true;
          }
        });
      });

      // 是否显示全选
      this.selectGoodsWindow.isSelectAll = isSelectAll;
    },

    // 选择商品弹窗 - 关闭
    onSelectGoodsWindowClose() {
      if (!this.state.onCloseLectureWindowType) {
        this.selectGoodsWindow.selectedItemsBackups = [
          ...this.selectGoodsWindow.selectedItems
        ];
      }
      this.$refs.ruleForm.validateField(["effectType"]);
    }
  }
};
</script>

<style lang="less">
.fight-groups-edit {
  .color-block-primary {
    display: inline-block;
    width: 5px;
    height: 20px;
    margin-right: 2px;
    background-color: #409eff;
    vertical-align: bottom;
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

  .effect-li {
    margin-bottom: 10px;
    .icon-add {
      margin-left: 10px;
      vertical-align: middle;
      font-size: 28px;
      color: #999;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
      &:active {
        opacity: 0.6;
      }
    }
    .icon-delete {
      margin-left: 10px;
      vertical-align: middle;
      font-size: 28px;
      color: #999;
      cursor: pointer;
      &:hover {
        color: #f56c6c;
      }
      &:active {
        opacity: 0.6;
      }
    }
  }
  .effet-tips {
    margin-top: 20px;
    margin-bottom: 10px;
    padding: 5px;
    background-color: #d5d5d5;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    span {
      color: #f56c6c;
    }
  }
  .validity-value-tips {
    margin-left: 20px;
    font-size: 14px;
    color: #999;
  }
}
.goods-window-selected {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
