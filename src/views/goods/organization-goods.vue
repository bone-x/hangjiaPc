<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <h4>筛选查询</h4>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-input
          v-model="filter.name"
          name="goodsName"
          placeholder="请输入商品名称"
          title="请输入商品名称"
          type="text"
          class="goodsName"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="filter.organization"
          name="goodsName"
          placeholder="请输入机构名"
          title="请输入机构名"
          type="text"
          class="goodsName"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <multi-cascader
          :options="categoryOptions"
          v-model="filter.goodsCategoryIdList"
          @on-change="onCategoryValueChange"
        ></multi-cascader>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="filter.goodsType"
          placeholder="请选择商品类型"
        >
          <el-option
            v-for="(item, index) in goodsTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="filter.issueStatus"
          placeholder="发布状态"
        >
          <el-option
            v-for="(item, index) in issueStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="filter.audition"
          placeholder="是否支持试听"
        >
          <el-option
            v-for="(item, index) in auditionList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          @click.native="searchData"
        >搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h4 class="goodsTitle">机构商品列表</h4>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
      style="width: 100%"
      tooltip-effect="dark"
      border
    >
      <el-table-column
        prop="id"
        label="商品ID"
      ></el-table-column>
      <el-table-column
        prop="coverPicture"
        label="商品封面"
        width="150"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.coverPicture"
            alt
            class="pic"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        width="200"
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
        prop="type"
        label="商品类型"
      >
        <template slot-scope="res">
          <span v-if="res.row.type === 0">其他</span>
          <span v-if="res.row.type === 1">直播</span>
          <span v-if="res.row.type === 2">录播</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="courseChapterNum"
        label="商品目录"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="商品价格"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="issueStatus"
        label="发布状态"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.issueStatus === 1">上架</span>
          <span v-if="scope.row.issueStatus === 2">未发布</span>
          <span v-if="scope.row.issueStatus === 0">下架</span>
          <span v-if="scope.row.issueStatus === 4">停售</span>
          <span v-if="scope.row.issueStatus === 5">审核拒绝</span>
          <span v-if="scope.row.issueStatus === 6">待审核</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="buyCount"
        label="学员数"
      ></el-table-column>
      <el-table-column
        prop="stockCount"
        label="商品库存"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="isRecommend"
        label="商品推荐"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend === true">是</span>
          <span v-if="scope.row.isRecommend === false">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isAudition"
        label="支持试听"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isAudition === true">是</span>
          <span v-if="scope.row.isAudition === false">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建人"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="auditTime"
        label="审核时间"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link :to="{ name: 'OrganizationGoodsDetails', params: { id: scope.row.id } }">
            <el-button
              type="primary"
              size="mini"
              plain
            >详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px;">
      <el-col
        :span="24"
        style="text-align: center;"
      >
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import MultiCascader from '@/components/MultiCascader';
import { getOrgGoodsList, goodsCategoryAll } from '@/api/goods';
import { formatDate } from '@/utils';

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
  name: 'OrganizationGoods',
  components: {
    MultiCascader,
  },
  data() {
    return {
      issueStatusTig: 1,
      categoryOptions: [],
      multipleSelection: [],
      filter: {
        categoryIds: '',
        name: '',
        organization: '',
        goodsCategoryIdList: [],
        projectType: '',
        type: '',
        issueStatus: '',
        isRecommend: '',
        audition: '',
        pageNum: 1,
        pageSize: 15,
      },
      totalCount: 15,
      totalPage: 10,
      goodsTypeList: [
        {
          value: 1,
          label: '直播',
        },
        {
          value: 2,
          label: '录播',
        },
      ],
      issueStatusList: [
        {
          value: 1,
          label: '上架',
        },
        {
          value: 0,
          label: '下架',
        },
        {
          value: 2,
          label: '未发布',
        },
        {
          value: 4,
          label: '停售',
        },
        {
          value: 5,
          label: '审核拒绝',
        },
        {
          value: 6,
          label: '待审核',
        },
      ],
      auditionList: [
        {
          value: true,
          label: '是',
        },
        {
          value: false,
          label: '否',
        },
      ],
      tableData: [],
    };
  },
  created() {
    // 获取商品类目菜单列表 - 行家
    goodsCategoryAll(1).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.categoryOptions = menuData;
      this.categoryOptions_hangjia = menuData;
    });

    //获取第三方机构的table数据
    this.getTableOrg();
  },

  watch: {
    $route: 'onRouteChange',
  },
  methods: {
    //路由跳转
    onRouteChange(to) {
      if (to.name === 'OrganizationGoodsDetails') {
        this.getTableOrg(this.filter.pageNum);
      }
    },

    //获取第三方机构的table数据
    async getTableOrg(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        name: this.filter.name,
        orgName: this.filter.organization,
        goodsCategoryIdList: this.filter.categoryIds,
        type: this.filter.goodsType,
        issueStatus: this.filter.issueStatus,
        isAudition: this.filter.audition,
        issueStatusTig: this.issueStatusTig,
      };

      //再发起请求前按判读
      if (!this.filter.issueStatus) {
        this.issueStatusTig = 1;
      }

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
        item.courseChapterNum =
          item.courseChapterNum + '章' + item.courseSectionNum + '节';
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

    // 点击搜索
    searchData() {
      console.log('search', this.filter);
      this.getTableOrg();
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 分页
    handleSizeChange(val) {
      this.filter.pageSize = val;
    },

    handleCurrentChange(val) {
      this.filter.pageNum = val;
      this.getTableOrg(val);
    },
  },
};
</script>
<style lang="less" scoped>
.content-container {
  .goodsName {
    width: 200px;
  }
  .goodsTitle {
    margin-top: 50px;
    margin-bottom: 30px;
  }
  .pic {
    width: 80px;
    height: 80px;
  }
  .onSale {
    color: #58bc58;
  }
}
</style>
