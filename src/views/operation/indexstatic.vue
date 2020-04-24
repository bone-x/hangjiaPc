<template>
  <div class="content-container">
    <!-- 运营管理 - 首页静态页面展示 -->
    <div class="staticpage">
      <div>
        <div class="goodshow recommend">
          <p class="goodtxt">好课推荐展示</p>
          <el-button
            type="primary"
            class="goodbtn"
            @click="centerDialogVisible = true"
            @click.native="newShow"
          >新建展示</el-button>
          <!-- 点击新建展示出现的弹窗 -->
          <el-dialog :visible.sync="centerDialogVisible" title="选择商品类目" width="900px" left>
            <!-- select选框部分 -->
            <el-form :inline="true" :model="formSearch" class="flex-center">
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
              <el-form-item class="magin-left">
                <el-input
                  :remote-method="remoteMethod"
                  :loading="loading"
                  v-model="categoryName"
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
              <el-table-column type="selection" width="100"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="商品名称" width="180">
                <template slot-scope="scope">{{ scope.row.goodsCategoryName }}</template>
              </el-table-column>
              <el-table-column prop="name" label="教师名称" min-width="100"></el-table-column>
              <el-table-column prop="price" label="价格" min-width="100"></el-table-column>
            </el-table>
            <!-- 以上是表格部分 -->
            <!-- 弹窗分页样式 -->
            <div class="block">
              <el-pagination
                :current-page.sync="currentDialogPage"
                :page-size="dialogPageSize"
                :total="dialogTotal"
                layout="prev, pager, next, jumper"
                class="simplepage"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
            <span slot="footer" class="dialog-footer tablefoot">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="centerDialogVisible = false"
                @click.native="sureSelect"
              >确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 首页静态表格 -->
        <el-table :data="goodCourseData" row-key="id" border>
          <el-table-column type="index" label="排序" width="80"></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="goodsName"
            label="商品名称"
            min-width="80"
          ></el-table-column>

          <el-table-column prop="creatorName" label="创建人" min-width="80"></el-table-column>

          <el-table-column prop="createTime" label="创建时间" min-width="80"></el-table-column>

          <el-table-column prop="remark" label="操作" width="300" fixed="right">
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
              <el-button type="danger" @click.native="goodCourseDataDelete(props.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/api/operation";
import GoodsApi from "@/api/goods";

export default {
  name: "OperationManageIndexstatic",
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
      // 搜索框的值
      goodsCategoryName: "",
      // 获取所有的商品列表的数据
      allGoodsData: [],
      // 获取弹窗列表的数据
      getDialogData: [],
      categoryName: "",
      // 获取select选框的值
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        name: "", // 商品名称
        goodsCategoryId: "" // 商品的ID
      },
      // 获取页码
      // 弹窗当前页
      currentDialogPage: 1,
      // 每页长度
      dialogPageSize: 10,
      // 共几页
      dialogTotal: 10,
      dialogTableVisible: false,
      centerDialogVisible: false,
      total: "",
      currentPage3: 5,
      // 这里放的是表单提交的数据
      formInline: {
        status: "课程一级类目",
        push: "课程二级类目",
        second: "课程三级类目",
        search: "" // 搜索框输入的内容
      },

      options4: [],
      list: [],
      loading: false
    };
  },
  created() {
    this.getGoodsCourse();
    GoodsApi.goodsCategoryAll().then(res => {
      this.categoryMenuData = [...res.result];
      // console.log(this.categoryMenuData);
    });
    this.dialogAllData();
  },

  methods: {
    // 弹窗表格商品内容
    dialogAllData() {
      const params = {
        pageNum: this.pageNum, // 页码
        pageSize: this.pageSize, // 每页条数
        name: "",
        id: ""
      };
      Api.getDialogGoodsList(params).then(res => {
        // 获取弹窗页面
        // 当前页面
        this.currentDialogPage = res.result.currPage;
        this.dialogPageSize = res.result.pageSize || 10;
        this.dialogTotal = res.result.totalPage;
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
        console.log("arawate", res.result);
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
        console.log("类目二", this.selectedCategoryMenu2);
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
        console.log("类目三", this.selectedCategoryMenu3);
      }
    },
    // 弹窗所有商品

    // 好课推荐请求数据
    getGoodsCourse() {
      Api.goodCourseList()
        .then(res => {
          console.log(res);
          if (res.result.length > 4) {
            this.goodCourseData = res.result.slice(0, 4);
          } else {
            this.goodCourseData = res.result;
            console.log("好课推荐表格数据", this.goodCourseData);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 好课推荐 - 上移
    goodCourseDataUp(id) {
      Api.goodCourseUp(id).then(res => {
        console.log("上移");
        this.getGoodsCourse();
      });
    },

    // 好课推荐 - 下移
    goodCourseDataDown(id) {
      Api.goodCourseDown(id).then(res => {
        console.log("下移", res);
        this.getGoodsCourse();
      });
    },

    // 好课推荐 - 删除
    goodCourseDataDelete(id) {
      console.log("删除项的id", id);
      Api.goodCourseDelete(id)
        .then(res => {
          if (res.code === 200) {
            console.log("删除成功", res);
            this.getGoodsCourse();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击新建请求数据
    // 所有商品列表数据
    // 点击新建时判断是否已显示4条，是则不进入新建弹窗
    newShow() {
      if (this.goodCourseData.length !== 4) {
        this.centerDialogVisible = true;
      } else {
        this.centerDialogVisible = false;
        this.$message.warning("请删除部分数据再新建");
      }
    },

    // 商品多选操作
    handleSelectionChange(val) {
      // 把选中的每行数据赋值给multipleTable
      this.multipleTable = val;
      if (this.goodCourseData.length > 4) {
        return this.$message.warning(
          "展示条数已达上限,请先删除个别数据再选择！"
        );
      }
      const num = 4 - this.goodCourseData.length;

      if (val.length > num) {
        this.$message.warning("你只能选择" + num + "条");
      } else {
        this.multipleSelection = val;
      }
      console.log(this.multipleSelection);
    },

    // 弹窗表格分页
    handleSizeChange(val) {
      this.dialogPageSize = val;
      this.dialogAllData();
      console.log(`每页 ${val} 条`);
    },
    // 弹窗当前页码
    handleCurrentChange(val) {
      this.currentDialogPage = val;
      this.dialogAllData();
      console.log(`当前页: ${val}`);
    },

    // 选择类目和输入商品名称后搜索请求
    onSubmit() {
      // 判断是拿到的是哪个商品类目和拿到输入的商品名称
      const gategoods =
        this.selectedCategoryMenu3 ||
        this.selectedCategoryMenu2 ||
        this.selectedCategoryMenu;
      const params = {
        pageNum: this.pageNum, // 页码
        pageSize: this.pageSize, // 每页条数
        goodsCategoryId: gategoods, // 商品id
        name: this.categoryName // 商品名称
      };
      Api.getDialogGoodsList(params).then(res => {
        // 获取弹窗页面
        // 当前页面
        this.currentDialogPage = res.result.currPage;
        this.dialogPageSize = res.result.pageSize;
        this.dialogTotal = res.result.totalPage;
        // 获取弹窗数据列
        this.getDialogData = res.result.list;
      });
    },

    // 勾选好弹窗里的商品后点击确定发起请求
    sureSelect() {
      const categorysIds = [];
      const categorysNames = [];
      this.multipleTable.map(item => {
        console.log(333333333333, item.goodsCategoryId);
        categorysIds.push(item.goodsCategoryId);
        categorysNames.push(item.goodsCategoryName);
      });
      const goodsData = {
        goodsIds: categorysIds,
        goodsNames: categorysNames
      };
      // 好课推荐-新增
      Api.goodCourseAdd(goodsData).then(res => {
        console.log("选好商品店确定", res);
        // 提交确定后刷新列表
        this.getGoodsCourse();
      });
      console.log("需要请求的数据", goodsData);
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          );
        }, 200);
      } else {
        this.options4 = [];
      }
    }
  }
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
}
</style>
