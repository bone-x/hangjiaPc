<template>
  <div class="content-container">
    <!-- 运营管理 - 首页静态页面展示 -->
    <div class="staticpage">
      <div>
        <div class="goodshow recommend">
          <p class="goodtxt">好课推荐展示</p>
          <span class="ad_tips">最多展示4个商品</span>
          <el-button
            type="primary"
            class="goodbtn"
            @click="centerDialogVisible = true, multipleTable = []"
            @click.native="newShow"
          >新建展示</el-button>
          <!-- 点击新建展示出现的弹窗 -->
          <el-dialog
            :visible.sync="centerDialogVisible"
            title="选择商品类目"
            width="900px"
            left
          >
            <!-- select选框部分 -->
            <el-form
              :inline="true"
              :model="formSearch"
              class="flex-center"
            >
              <el-form-item
                label
                style="width:150px;"
              >
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
              <el-form-item
                label
                style="width:150px;"
              >
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
              <el-form-item
                label
                style="width:150px;"
              >
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
                <el-button
                  icon="el-icon-search"
                  @click.native="onSubmit"
                >搜索</el-button>
              </el-form-item>
            </el-form>
            <!-- 表格部分 -->
            <el-table
              ref="multipleTable"
              :data="getDialogData"
              tooltip-effect="dark"
              class="recomtable"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="100"
              ></el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="商品名称"
                width="180"
              >
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
                prop="teacherNames"
                label="教师名称"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="price"
                label="价格"
                min-width="100"
              ></el-table-column>
            </el-table>
            <!-- 以上是表格部分 -->
            <!-- 弹窗分页样式 -->
            <div class="block">
              <el-pagination
                :current-page.sync="formSearch.pageNum"
                :page-size="formSearch.pageSize"
                :total="formConfig.totalCount"
                layout="prev, pager, next, jumper"
                class="simplepage"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
            <span
              slot="footer"
              class="dialog-footer tablefoot"
            >
              <el-button @click.native="cancelDialog">取 消</el-button>
              <el-button
                type="primary"
                @click="centerDialogVisible = false"
                @click.native="sureSelect"
              >确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 首页静态表格 -->
        <el-table
          :data="goodCourseData"
          row-key="id"
          border
        >
          <el-table-column
            type="index"
            label="排序"
            width="80"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="goodsName"
            label="商品名称"
            min-width="80"
          ></el-table-column>

          <el-table-column
            prop="creatorName"
            label="创建人"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="updateName"
            label="修改人"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="操作"
            width="300"
            fixed="right"
          >
            <template slot-scope="props">
              <el-button
                :class="{ gray: props.$index === 0 }"
                :disabled="props.$index===0"
                class="finger"
                type="primary"
                plain
                @click.native="goodCourseDataUp(props.row.id)"
              >上移</el-button>
              <el-button
                :class="{ gray: props.$index === props.length - 1 }"
                :disabled="props.$index === (goodCourseData.length - 1)"
                type="primary"
                plain
                @click.native="goodCourseDataDown(props.row.id)"
              >下移</el-button>
              <el-button
                type="danger"
                @click.native="goodCourseDataDelete(props.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 直播部分 -->
      <div class="liveList">
        <p class="goodtxt">精选直播展示</p>
        <span class="ad_tips">最多展示4个商品</span>
        <el-button
          type="primary"
          class="goodbtn"
          @click.native="addLiveShow"
        >新建展示</el-button>
        <el-table
          :data="liveListData"
          row-key="id"
          border
        >
          <el-table-column
            type="index"
            label="排序"
            width="80"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="goodsName"
            label="商品名称"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="creatorName"
            label="创建人"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="updateName"
            label="修改人"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="操作"
            width="300"
            fixed="right"
          >
            <template slot-scope="props">
              <el-button
                :class="{ gray: props.$index === 0 }"
                :disabled="props.$index===0"
                class="finger"
                type="primary"
                plain
                @click.native="liveUp(props.row.id)"
              >上移</el-button>
              <el-button
                :class="{ gray: props.$index === props.length - 1 }"
                :disabled="props.$index === (liveListData.length - 1)"
                type="primary"
                plain
                @click.native="liveDown(props.row.id)"
              >下移</el-button>
              <el-button
                type="danger"
                @click.native="liveDelete(props.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新建直播弹窗 -->
      <el-dialog
        :visible.sync="liveConfig.centerDialogVisible"
        title="选择商品类目"
        width="900px"
        left
      >
        <el-form
          :inline="true"
          :model="liveSearch"
          class="flex-center"
        >
          <el-form-item
            label
            style="width:150px;"
          >
            <el-select
              v-model="liveConfig.selectedCategoryMenu"
              placeholder="商品一级类目"
              @change="(val) => { onSelectedLiveCategory(val, 1) }"
            >
              <el-option
                v-for="(item, index) in liveConfig.categoryMenuData"
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
              v-model="liveConfig.selectedCategoryMenu2"
              placeholder="商品二级类目"
              @change="(val) => { onSelectedLiveCategory(val, 2) }"
            >
              <el-option
                v-for="(item, index) in liveConfig.categoryMenuData2"
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
              v-model="liveConfig.selectedCategoryMenu3"
              placeholder="商品三级类目"
              @change="(val) => { onSelectedLiveCategory(val, 3) }"
            >
              <el-option
                v-for="(item, index) in liveConfig.categoryMenuData3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-input
              :loading="loading"
              v-model="liveSearch.categoryName"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="商品名称"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-button
              icon="el-icon-search"
              type="primary"
              @click.native="liveSearchBtn"
            >搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 表格部分 -->
        <el-table
          ref="multipleLiveTable"
          :data="liveGoodsData"
          tooltip-effect="dark"
          class="recomtable"
          style="width: 100%"
          border
          @selection-change="handleSelectionChangeLive"
        >
          <el-table-column
            type="selection"
            width="100"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="商品名称"
            width="180"
          >
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            prop="teacherNames"
            label="教师名称"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            min-width="100"
          ></el-table-column>
        </el-table>
        <div class="livePage">
          <el-pagination
            :current-page.sync="liveSearch.pageNum"
            :page-size="liveSearch.pageSize"
            :total="liveConfig.totalCount"
            layout="prev, pager, next, jumper"
            class="simplepage"
            background
            @size-change="handleSizeChangeLive"
            @current-change="handleCurrentChangeLive"
          ></el-pagination>
        </div>
        <div
          slot="footer"
          class="dialog-footer liveBtn"
        >
          <el-button @click.native="cancelSelectLiveGoods">取 消</el-button>
          <el-button
            type="primary"
            @click.native="sureSelectLive"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  goodCourseList,
  goodCourseUp,
  goodCourseDown,
  goodCourseDelete,
  goodCourseAdd,
  getDialogGoodsList,
} from '@/api/operation';
import GoodsApi from '@/api/goods';
import {
  getSelectLiveList,
  selectLiveAdd,
  liveToUp,
  liveToDown,
  liveToDelete,
} from '@/api/live-room';

export default {
  name: 'OperationManageIndexstatic',
  components: {},
  data() {
    return {
      multipleSelection: [],
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
      goodsCategoryName: '',
      allGoodsData: [],
      getDialogData: [],
      categoryName: '',
      // 获取select选框的值
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        name: '', // 商品名称
        goodsCategoryId: '', // 商品的ID
        projectType: 1,
      },
      formConfig: {
        totalCount: 10,
        totalPage: 10,
      },
      currentPage: 1,
      pageSize: 6,
      total: 10,
      totalPage: 10,
      dialogTableVisible: false,
      centerDialogVisible: false,
      loading: false,
      // ---------  直播 ---------- //
      type: 2,
      liveListData: [],
      liveConfig: {
        centerDialogVisible: false,
        selectedCategoryMenu: null,
        selectedCategoryMenu2: null,
        selectedCategoryMenu3: null,
        categoryMenuData: [],
        categoryMenuData2: [],
        categoryMenuData3: [],
        totalCount: 10,
        totalPage: 10,
        multipleSelection: [],
      },
      liveGoodsData: [],
      multipleLiveTable: [],
      liveSearch: {
        pageNum: 1,
        pageSize: 6,
        categoryName: '',
      },
    };
  },
  created() {
    this.getGoodsCourse();
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
      this.liveConfig.categoryMenuData = [...res.result];
    });
    this.dialogAllData();
    this.getSelectLiveData(); // 精选直播列表
    this.getLiveShowGoods(); // 直播商品列表
  },

  methods: {
    // 弹窗表格商品内容
    dialogAllData() {
      const gategoods =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      this.formSearch.goodsCategoryId = gategoods;
      getDialogGoodsList(this.formSearch).then(res => {
        this.formConfig.totalCount = res.result.totalCount;
        this.formConfig.totalPage = res.result.totalPage;
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

    // 弹窗->取消
    cancelDialog() {
      this.centerDialogVisible = false;
    },

    // 好课推荐请求数据
    getGoodsCourse() {
      const params = {
        type: 1,
      };
      goodCourseList(params)
        .then(res => {
          if (res.result.length > 4) {
            this.goodCourseData = res.result.slice(0, 4);
          } else {
            this.goodCourseData = res.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 好课推荐 - 上移
    goodCourseDataUp(id) {
      goodCourseUp(id).then(res => {
        this.$message.success('上移成功！');
        this.getGoodsCourse();
      });
    },

    // 好课推荐 - 下移
    goodCourseDataDown(id) {
      goodCourseDown(id).then(res => {
        this.$message.success('下移成功！');
        this.getGoodsCourse();
      });
    },

    // 好课推荐 - 删除
    goodCourseDataDelete(id) {
      goodCourseDelete(id)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！');
            this.getGoodsCourse();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击新建时判断是否已显示4条，是则不进入新建弹窗
    newShow() {
      this.selectedCategoryMenu = '';
      this.selectedCategoryMenu2 = '';
      this.selectedCategoryMenu3 = '';
      this.getDialogData.goodsCategoryName = '';
      this.multipleTable = [];
      if (this.goodCourseData.length === 4) {
        this.centerDialogVisible = false;
        this.$message.warning('当前好课推荐位置已满，请删除部分数据后再操作!');
      }
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
      });
    },

    // 商品多选操作
    handleSelectionChange(val) {
      // 把选中的每行数据赋值给
      this.multipleTable = val;
      if (this.goodCourseData.length > 4) {
        return this.$message.error('展示条数已达上限,请先删除个别数据再选择！');
      }
      const num = 4 - this.goodCourseData.length;

      if (val.length > num) {
        this.$message.error('只能展示4条数据！');
      } else {
        this.multipleSelection = val;
      }
    },

    // 弹窗表格分页
    handleSizeChange(val) {
      this.formSearch.pageSize = val;
    },
    // 弹窗当前页码
    handleCurrentChange(val) {
      this.formSearch.pageNum = val;
      this.dialogAllData();
    },

    // 选择类目和输入商品名称后搜索请求
    onSubmit() {
      this.dialogAllData();
    },

    // 勾选好弹窗里的商品后点击确定发起请求
    sureSelect() {
      if (this.multipleTable.length <= 0) {
        this.$message.error('请至少选择一条数据');
        return false;
      }
      const goodsIds = [];
      const goodsNames = [];
      this.multipleTable.map(item => {
        goodsIds.push(item.id);
        goodsNames.push(item.name);
      });
      const goodsData = {
        goodsIds,
        goodsNames,
      };
      // 好课推荐-新增
      goodCourseAdd(goodsData).then(res => {
        // 提交确定后刷新列表
        this.getGoodsCourse();
      });
    },

    // ---------直播---------
    // 获取精选直播列表
    getSelectLiveData() {
      const params = {
        type: this.type,
      };
      getSelectLiveList(params).then(res => {
        if (res.result.length > 4) {
          this.liveListData = res.result.slice(0, 4);
        } else {
          this.liveListData = res.result;
        }
      });
    },

    // 精选直播 - 上移
    liveUp(id) {
      liveToUp(id).then(res => {
        this.$message.success('上移成功！');
        this.getSelectLiveData();
      });
    },

    // 精选直播 - 下移
    liveDown(id) {
      liveToDown(id).then(res => {
        this.$message.success('下移成功！');
        this.getSelectLiveData();
      });
    },

    // 精选直播 - 删除
    liveDelete(id) {
      liveToDelete(id)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！');
            this.getSelectLiveData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 新建直播
    addLiveShow() {
      this.liveConfig.selectedCategoryMenu = '';
      this.liveConfig.selectedCategoryMenu2 = '';
      this.liveConfig.selectedCategoryMenu3 = '';
      this.liveSearch.categoryName = '';
      this.liveConfig.multipleLiveTable = [];
      this.liveConfig.centerDialogVisible = true;
      if (this.liveListData.length === 4) {
        this.liveConfig.centerDialogVisible = false;
        this.$message.warning('当前精选直播位置已满，请删除部分数据后再操作!');
      }
      this.$nextTick(() => {
        this.$refs.multipleLiveTable.clearSelection();
      });
    },

    // 精选直播选择类目
    onSelectedLiveCategory(id, level) {
      if (level === 1) {
        this.liveConfig.selectedCategoryMenu = id;
        // 第一个select框数据有子级则附到一级后面
        this.liveConfig.categoryMenuData.some(item => {
          // 从一级里面拿到二级
          if (item.id === id) {
            this.liveConfig.categoryMenuData2 = item.childList;
            this.liveConfig.selectedCategoryMenu2 = '';
            this.liveConfig.selectedCategoryMenu3 = '';
            return true;
          }
          return false;
        });
        // 清空三级
        this.liveConfig.categoryMenuData3 = [];
      } else if (level === 2) {
        this.liveConfig.selectedCategoryMenu2 = id;
        this.liveConfig.categoryMenuData2.some(item => {
          // 从二级里面拿到三级
          if (item.id === id) {
            this.liveConfig.categoryMenuData3 = item.childList;
            this.liveConfig.selectedCategoryMenu3 = '';
            return true;
          }
          return false;
        });
      } else if (level === 3) {
        this.liveConfig.selectedCategoryMenu3 = id;
      }
    },

    // 获取精选直播商品列表
    getLiveShowGoods() {
      const gategoods =
        this.liveConfig.selectedCategoryMenu3 ||
        this.liveConfig.selectedCategoryMenu2 ||
        this.liveConfig.selectedCategoryMenu;
      const params = {
        pageNum: this.liveSearch.pageNum, // 页码
        pageSize: this.liveSearch.pageSize, // 每页条数
        goodsCategoryId: gategoods, // 商品类目id
        name: this.liveSearch.categoryName, // 商品名称
        projectType: 3,
        type: 1, // 直播
      };
      getDialogGoodsList(params).then(res => {
        this.liveConfig.totalCount = res.result.totalCount;
        this.liveConfig.totalPage = res.result.totalPage;
        // 获取弹窗数据列
        this.liveGoodsData = res.result.list;
      });
    },

    // 弹窗搜索
    liveSearchBtn() {
      this.getLiveShowGoods();
    },

    // 弹窗表格分页
    handleSizeChangeLive(val) {
      this.liveSearch.pageSize = val;
    },
    // 弹窗当前页码
    handleCurrentChangeLive(val) {
      this.liveSearch.pageNum = val;
      this.getLiveShowGoods();
    },

    // 直播商品多选操作
    handleSelectionChangeLive(val) {
      // 把选中的每行数据赋值给
      this.multipleLiveTable = val;
      if (this.liveListData.length > 4) {
        return this.$message.error('展示条数已达上限,请先删除个别数据再选择！');
      }
      const num = 4 - this.liveListData.length;

      if (val.length > num) {
        this.$message.error('只能展示4条数据！');
      } else {
        this.liveConfig.multipleSelection = val;
      }
    },

    // 提交选择的直播商品
    sureSelectLive() {
      if (this.multipleLiveTable.length <= 0) {
        this.$message.error('请至少选择一条数据');
        return false;
      }
      const goodsIds = [];
      const goodsNames = [];
      this.multipleLiveTable.map(item => {
        goodsIds.push(item.id);
        goodsNames.push(item.name);
      });
      const goodsData = {
        goodsIds: goodsIds,
        goodsNames: goodsNames,
        type: 2,
      };
      selectLiveAdd(goodsData).then(res => {
        this.liveConfig.centerDialogVisible = false;
        // 提交确定后刷新列表
        this.getSelectLiveData();
      });
    },

    // 弹窗->取消
    cancelSelectLiveGoods() {
      this.liveConfig.centerDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.staticpage {
  padding: 10px 20px;
  .goodshow {
    margin-bottom: 20px;
    .goodtxt {
      float: left;
      font-weight: bold;
    }
    .ad_tips {
      display: inline-block;
      margin-left: 10px;
      font-size: 12px;
      line-height: 50px;
      color: rgb(255, 133, 3);
    }
    .goodbtn {
      float: right;
    }
    .threeSelect {
      width: 150px;
    }
    .tablefoot {
      display: flex;
      justify-content: center;
    }
    .recomtable {
      margin-bottom: 25px;
    }
    .block {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .recommend {
    margin-top: 35px;
  }
  .liveList {
    margin-top: 50px;
    .goodtxt {
      float: left;
      font-weight: bold;
    }
    .ad_tips {
      display: inline-block;
      margin-left: 10px;
      font-size: 12px;
      line-height: 50px;
      color: rgb(255, 133, 3);
    }
    .goodbtn {
      float: right;
    }
  }
  .livePage {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
  .liveBtn {
    display: flex;
    justify-content: center;
  }
}
</style>
