<template>
  <div class="goods-verify">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <!-- 待审核内容 -->
      <el-tab-pane
        label="待审核"
        name="first"
      >
        <el-row>
          <el-col :span="20">
            <h3>筛选查询</h3>
          </el-col>
        </el-row>
        <div class="searchForm">
          <el-row :gutter="30">
            <el-col :span="5">
              <el-input
                v-model="filter.goodsName"
                name="goodsName"
                placeholder="请输入商品名称"
                title="请输入商品名称"
                type="text"
                class="goodsName"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="filter.organization"
                name="goodsName"
                placeholder="请输入机构名"
                title="请输入机构名"
                type="text"
                class="goodsName"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <multi-cascader
                :options="categoryOptions"
                v-model="filter.categorySelected"
                @on-change="onCategoryValueChange"
              ></multi-cascader>
            </el-col>
            <el-col :span="5">
              <el-button
                type="primary"
                @click.native="verifySearch"
              >搜索</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <h3 class="tableTitle">机构商品审核</h3>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            style="width: 100%"
            tooltip-effect="dark"
            :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
            border
          >
            <el-table-column
              prop="id"
              label="商品ID"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="coverPicture"
              label="商品封面"
              width="200"
            >
              <template slot-scope="scope">
                <img
                  v-if="scope.row.coverPicture"
                  :src="scope.row.coverPicture"
                  style="width: 100px; height: 100px"
                />
                <img
                  v-else
                  :src="NoPic"
                  alt=""
                  style="width: 100px; height: 100px"
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称"
              width="300"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="所属机构"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="goodsCategoryName"
              label="商品类目"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="price"
              label="商品价格"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="提交时间"
              width="300"
            ></el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              width="200"
              fixed="right"
            >
              <template slot-scope="scope">
                <router-link :to="{ name: 'NoVerifyDetails', params: { id: scope.row.id } }">
                  <el-button
                    v-permission="['goods:audit:audit']"
                    type="primary"
                  >审核</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page.sync="filter.pageNum"
              :page-size="filter.pageSize"
              :total="totalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- 未通过内容 -->
      <el-tab-pane
        label="未通过"
        name="second"
      >
        <el-row>
          <el-col :span="20">
            <h3>筛选查询</h3>
          </el-col>
        </el-row>
        <div class="searchForm">
          <el-row :gutter="30">
            <el-col :span="5">
              <el-input
                v-model="filter.goodsName"
                name="goodsName"
                placeholder="请输入商品名称"
                title="请输入商品名称"
                type="text"
                class="goodsName"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="filter.organization"
                name="goodsName"
                placeholder="请输入机构名"
                title="请输入机构名"
                type="text"
                class="goodsName"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <multi-cascader
                :options="categoryOptions"
                v-model="filter.categorySelected"
                @on-change="onCategoryValueChange"
              ></multi-cascader>
            </el-col>
            <el-col :span="5">
              <el-button
                type="primary"
                @click.native="nopassSearch"
              >搜索</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <h3 class="tableTitle">机构商品审核</h3>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            style="width: 100%"
            tooltip-effect="dark"
            :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
            border
          >
            <el-table-column
              prop="id"
              label="商品ID"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="coverPicture"
              label="商品封面"
              width="200"
            >
              <template slot-scope="scope">
                <img
                  v-if="scope.row.coverPicture"
                  :src="scope.row.coverPicture"
                  style="width: 100px; height: 100px"
                />
                <img
                  v-else
                  :src="NoPic"
                  alt=""
                  style="width: 100px; height: 100px"
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称"
              width="300"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="所属机构"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="goodsCategoryName"
              label="商品类目"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="price"
              label="商品价格"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="updateTime"
              label="提交时间"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="auditTime"
              label="审核时间"
              width="200"
            ></el-table-column>
            <el-table-column
              prop
              label="操作"
              width="230"
              fixed="right"
            >
              <template slot-scope="scope">
                <router-link :to="{ name: 'NopassVerifyDetails', params: { id: scope.row.id } }">
                  <el-button
                    v-permission="['goods:audit:select']"
                    type="primary"
                  >查看详情</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page.sync="filter.pageNum"
              :page-size="filter.pageSize"
              :total="totalCount"
              layout="prev, pager, next, jumper"
              class="simplepage"
              background
              @size-change="verifySizeChange"
              @current-change="verifyCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MultiCascader from '@/components/MultiCascader';
import { getOrgGoodsList, goodsCategoryAll } from '@/api/goods';
import { formatDate } from '@/utils';
import NoPic from '@/assets/nopic.jpg';

const AdapterCategoryMenuData = function(data = []) {
  /**
    id: key,
    level,
    label: `${key}菜单${level}-${i}`,
    value: key,
    checked: false,
    children: hasChilren ? [] : null,
   */
  const temp = data.map(i => {
    const item = {
      id: i.id,
      value: i.id,
      level: i.level,
      label: i.name,
      checked: false,
      ...i,
    };
    if (i.childList && i.childList.length > 0) {
      item.children = AdapterCategoryMenuData(i.childList);
    }

    return item;
  });
  return temp;
};

export default {
  name: 'GoodsVerify',
  components: {
    MultiCascader,
  },
  data() {
    return {
      NoPic,
      activeName: 'first',
      categoryOptions: [],
      categoryIds: '',
      multipleSelection: [],
      filter: {
        goodsName: '',
        organization: '',
        categorySelected: [],
        issueStatus: 6,
        pageNum: 1,
        pageSize: 10,
      },
      totalCount: 15,
      totalPage: 10,
      tableData: [],
      // nopassSelection: []
    };
  },
  created() {
    // 获取商品类目菜单列表 - 行家
    goodsCategoryAll(0).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.categoryOptions = menuData;
      this.categoryOptions_hangjia = menuData;

      //获取第三方机构的table数据
      this.getTableOrg();
    });
  },
  mounted() {
    if (this.$route.params.status === 5) {
      this.activeName = 'second';
      this.filter.issueStatus = 5;
      this.getTableOrg();
    } else {
      this.activeName = 'first';
      this.filter.issueStatus = 6;
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName === 'second') {
        this.filter.issueStatus = 5;
        this.getTableOrg();
      }
      if (this.activeName === 'first') {
        this.filter.issueStatus = 6;
        this.getTableOrg();
      }
    },

    //获取第三方机构的table数据
    async getTableOrg(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        name: this.filter.goodsName,
        orgName: this.filter.organization,
        goodsCategoryIdList: this.filter.categoryIds,
        issueStatus: this.filter.issueStatus,
      };

      // 发起请求
      const res = await getOrgGoodsList(options);
      if (res.code !== 200) return Promise.reject();
      this.adapterGoodsToUI(res.result);

      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      });
    },

    // 适配商品列表数据到UI
    adapterGoodsToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0,
      } = result;

      this.filter.pageNum = currPage;
      this.filter.pageSize = pageSize || 10;
      this.totalPage = totalPage;
      this.totalCount = totalCount;

      this.tableData = list.map(item => {
        item.coverPicture = decodeURIComponent(item.coverPicture);
        return item;
      });
    },

    // 遍历树获取所需商品类目id，对接到filter.categoryIds
    adapterSelectedCategoryIds(treeArr) {
      const ids = [];
      const recurve = arr => {
        arr.forEach(i => {
          if (i.label === '全选') return false;
          if (i.checked) {
            ids.push(i.id);
          } else if (i.indeterminate && i.children && i.children.length > 0) {
            recurve(i.children);
          }
        });
      };
      recurve(treeArr);
      this.filter.categoryIds = ids.join(',');
    },

    // 商品类目选中值改变时触发
    onCategoryValueChange(values, item, arr) {
      this.adapterSelectedCategoryIds(arr);
    },

    // 待审核列表
    getVerifyList() {
      console.log('待审核数据');
    },

    // 待审核搜索
    verifySearch() {
      console.log('verifySearch');
      this.getTableOrg();
    },

    // 待审核多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 待审核分页
    handleSizeChange(val) {
      this.filter.pageSize = val;
    },

    handleCurrentChange(val) {
      this.filter.pageNum = val;
      this.getTableOrg(val);
    },

    // 未通过部分
    // 未通过列表
    getNopassList() {
      console.log('未通过数据');
      this.getTableOrg();
    },

    // 搜索
    nopassSearch() {
      this.getNopassList();
    },

    // 待审核多选
    nopassSelectionChange(val) {
      this.nopassSelection = val;
    },

    // 删除
    deleteData(item) {
      console.log(item);
    },

    // 未通过分页
    verifySizeChange(val) {
      this.nopassFilter.pageSize = val;
    },

    verifyCurrentChange(val) {
      this.filter.pageNum = val;
      this.getTableOrg(val);
    },
  },
};
</script>

<style lang="less">
.goods-verify {
  padding: 35px;
  .goodsName {
    width: 300px;
  }
  .tableTitle {
    margin-top: 50px;
  }
  .block {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
