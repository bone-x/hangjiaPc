<template>
  <div class="content-container">
    <!-- 运营管理 - 首页类目商品推荐 -->
    <div
      v-for="(item, index) in goodsCourses"
      :key="item.key"
      class="index-course"
    >
      <div class="goodshow">
        <p class="goodcourse">{{ item.title }}</p>
        <span
          v-if="item.displayState === false"
          class="goodsStatus"
        >（类目已下架）</span>
        <span class="course-tips">最多展示6个商品，如不设置将自动获取展示该类目月排行榜前6个商品</span>
        <p
          v-for="(secondItem, secondIndex) in item"
          :key="secondIndex"
        ></p>
        <el-button
          type="primary"
          class="goodbtn"
          @click.native="addGoodShow(item)"
        >新建展示</el-button>
      </div>
      <el-table
        :data="item.data"
        :show-overflow-tooltip="true"
        tooltip-effect="dark"
        class="recomtable"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          prop="goodsName"
          label="商品名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="creatorName"
          label="创建人"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.$index===0"
              type="primary"
              plain
              @click.native="handleUp(scope.row.id)"
            >上移</el-button>
            <el-button
              :disabled="scope.$index === (item.data.length - 1)"
              type="primary"
              plain
              @click.native="handleDown(scope.row.id)"
            >下移</el-button>
            <el-button
              type="danger"
              @click.native="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗部分 -->
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
        class="flex-center"
      >
        <el-form-item
          label
          style="width:150px;"
        >
          <el-select
            v-model="selectedCategoryMenu"
            placeholder="商品一级类目"
            disabled
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
              v-for="(item,index) in categoryMenuData2"
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
              v-for="(item,index) in categoryMenuData3"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="magin-left">
          <el-input
            :loading="loading"
            v-model="formData.name"
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
        <el-table-column type="selection"></el-table-column>
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
          min-width="70"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          min-width="45"
        ></el-table-column>
      </el-table>
      <!-- 以上是表格部分 -->
      <!-- 分页样式 -->
      <div class="block">
        <el-pagination
          :current-page.sync="formData.pageNum"
          :page-size="formData.pageSize"
          :total="total"
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
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          style="margin-left:10%"
          type="primary"
          @click="centerDialogVisible = false"
          @click.native="sureSelectOne"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDialogGoodsList,
  goodRecommandList,
  goodRecommandAdd,
  goodRecommandUp,
  goodRecommandDown,
  goodRecommandDelete,
} from '@/api/operation';
import GoodsApi from '@/api/goods';

export default {
  name: 'OperationManageIndexCourse',
  components: {},
  data() {
    return {
      categoryStatus: 1,
      // 存放所有请求的数据
      goodsCourses: [],
      // 存放弹窗里面选中的数据
      multipleTable: [],
      // 存放弹窗选中的id
      selectedGoodsId: [],
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
      // 第一个新建弹窗
      centerDialogVisible: false,
      getDialogData: [],
      categoryName: '',
      currentDialogPage: 1,
      dialogPageSize: 6,
      dialogTotal: 10,
      total: 10,
      totalPage: 10,
      currPage: 1,
      levelData: [],
      loading: false,
      formData: {
        pageNum: 1,
        pageSize: 6,
        name: '',
        goodsCategoryId: '',
        projectType: 1,
      },
    };
  },
  created() {
    this.getRecommandData();
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
    });
    this.dialogAllData();
  },
  methods: {
    // 弹窗选择类目选择数据
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

    // 弹窗表格商品内容
    dialogAllData(goodsCategoryId) {
      this.formData.goodsCategoryId =
        goodsCategoryId || this.selectedCategoryMenu;
      getDialogGoodsList(this.formData).then(res => {
        // 获取弹窗页面
        this.total = res.result.totalCount;
        this.totalPage = res.result.totalPage;
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
      });
    },

    // 请求所有表格的数据
    getRecommandData() {
      goodRecommandList().then(res => {
        this.goodsCourses = res.result;
      });
    },

    // 点击新建时判断是否已显示4条，是则不进入新建弹窗
    addGoodShow(item) {
      this.centerDialogVisible = true;
      this.resetAdd();
      if (item.data.length === 6) {
        this.centerDialogVisible = false;
        this.$message.warning('展示商品已满，请删除部分商品再操作！');
      } else {
        this.selectedCategoryMenu = item.categoryId; // 类目商品的id
        this.onSelectedCategory(item.categoryId, 1);
        this.currPage = 1;
        this.dialogAllData(item.categoryId);
        this.multipleSelection = [];
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection();
        });
      }
    },

    // 点击新建清空历史
    resetAdd() {
      this.selectedCategoryMenu = '';
      this.selectedCategoryMenu2 = '';
      this.selectedCategoryMenu3 = '';
      this.multipleSelection = '';
      this.formData.name = '';
    },

    // 弹窗 - 点击搜索
    onSubmit() {
      // 判断是拿到的是哪个商品类目和拿到输入的商品名称
      const gategoods =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      this.formData.goodsCategoryId = gategoods;
      this.dialogAllData();
    },

    // 弹窗 - 勾选商品后点击确定发起请求
    sureSelectOne() {
      if (this.multipleSelection.length <= 0) {
        return false;
      }
      this.selectedGoodsId = this.multipleSelection.map(i => i.id);
      const params = {
        categoryId: this.selectedCategoryMenu, // 一级类目id
        goodsIds: this.selectedGoodsId, // 商品id
      };
      if (this.levelData.length > 6) {
        this.$message.error('展示数据不能超过6条，请减少当前选择数量!');
      } else {
        // 商品推荐-新增
        goodRecommandAdd(params).then(res => {
          // 提交确定后刷新列表
          this.getRecommandData();
        });
      }
    },

    // 上移
    handleUp(id) {
      goodRecommandUp(id).then(res => {
        this.getRecommandData();
      });
    },

    // 下移
    handleDown(id) {
      goodRecommandDown(id).then(res => {
        this.getRecommandData();
      });
    },

    // 删除
    handleDelete(id) {
      goodRecommandDelete(id).then(res => {
        this.getRecommandData();
      });
    },

    // 搜集勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleSizeChange(val) {
      this.formData.pageSize = val;
    },

    handleCurrentChange(val) {
      this.formData.pageNum = val;
      this.dialogAllData();
    },
  },
};
</script>

<style lang="scss" scoped>
.index-course {
  padding: 0px 20px 20px 20px;
  .goodshow {
    height: 36px;
    margin-bottom: 20px;
    justify-content: space-between;
    display: flex;
    .goodcourse {
      font-weight: bold;
    }
    .goodsStatus {
      display: inline-block;
      margin-left: -183px;
      font-size: 12px;
      line-height: 50px;
      color: red;
    }
    .course-tips {
      display: inline-block;
      margin-left: -100px;
      font-size: 12px;
      line-height: 50px;
      color: rgb(255, 133, 3);
    }
  }
}
.threeSelect {
  width: 150px;
}
.tablefoot {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.recomtable {
  margin-bottom: 25px;
}
.block {
  width: 100%;
  display: flex;
  justify-content: center;
}
.recommend {
  margin-top: 35px;
}
</style>
