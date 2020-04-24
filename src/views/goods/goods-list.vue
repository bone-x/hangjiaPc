<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model="filter.goodsName"
          name="goodsName"
          placeholder="请输入商品名称"
          title="请输入商品名称"
          type="text"
        ></el-input>
      </el-col>

      <el-col :span="4">
        <multi-cascader
          :options="filterConfig.categoryOptions"
          v-model="filterConfig.categorySelected"
          @on-change="onCategoryValueChange"
        ></multi-cascader>
      </el-col>

      <el-col :span="2">
        <el-select v-model="filter.goodsTypeValue" placeholder="商品类型" title="商品类型">
          <el-option
            v-for="(item, index) in filterConfig.goodsTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-select v-model="filter.releaseStatus" placeholder="发布状态" title="发布状态">
          <el-option
            v-for="(item, index) in filterConfig.releaseStatus"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-select v-model="filter.isRecommended" placeholder="是否课程推荐" title="是否课程推荐">
          <el-option
            v-for="(item, index) in filterConfig.recommended"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-select v-model="filter.isAudition" placeholder="是否支持试听" title="是否支持试听">
          <el-option
            v-for="(item, index) in filterConfig.audition"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-select v-model="filter.activeType" placeholder="商品活动类型" title="商品活动类型">
          <el-option
            v-for="(item, index) in filterConfig.activeTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-input v-model="filter.creator" placeholder="请输入创建人" title="请输入创建人"></el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click.native="getGoodsList(1)">查询</el-button>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <el-row :gutter="40" style="margin-top: 30px;">
      <el-col v-permission="['goods:list:save']" :span="2">
        <router-link :to="{ name: 'GoodsListAdd' }">
          <el-button type="primary">新增商品</el-button>
        </router-link>
      </el-col>

      <el-col v-permission="['goods:list:ud']" :span="2">
        <el-button type="primary" @click.native="onPutaway(selectedItems)">批量上架</el-button>
      </el-col>

      <el-col v-permission="['goods:list:ud']" :span="2">
        <el-button type="info" @click.native="onSoldOut(selectedItems)">批量下架</el-button>
      </el-col>

      <el-col v-permission="['goods:list:commend']" :span="3">
        <el-button type="primary" @click.native="onRecommend(selectedItems)">批量设置商品推荐</el-button>
      </el-col>

      <el-col v-permission="['goods:list:commend']" :span="3">
        <el-button type="info" @click.native="onUnRecommend(selectedItems)">批量取消商品推荐</el-button>
      </el-col>

      <!-- <el-col v-permission="['goods:list:delete']" :span="3">
        <el-button type="danger" @click.native="onDelete(selectedItems)">批量删除</el-button>
      </el-col>-->
      <el-col :span="3">
        <el-button type="primary" @click.native="onChangeGoods(selectedItems)">批量修改商品类目</el-button>
      </el-col>

      <el-col :span="2">
        <!-- <el-button type="primary" @click.native="onChangeGoods(selectedItems)">批量修改商品类目</el-button> -->
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table
      ref="goods-table"
      :data="goodsList"
      :default-sort="filterConfig.sort"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
      @sort-change="onTableSort"
      @select="onSelectCheckBox"
      @select-all="onSelectCheckBox"
    >
      <el-table-column width="55" fixed="left" type="selection" align="center"></el-table-column>
      <el-table-column width="100" prop="id" label="商品ID" column-key="id" sortable="custom"></el-table-column>
      <el-table-column width="150" label="商品封面">
        <template slot-scope="scope">
          <img :src="scope.row.coverPicture" class="table-goods-cover" alt="商品封面" />
        </template>
      </el-table-column>
      <el-table-column width="150" prop="name" label="商品名称" column-key="name" sortable="custom"></el-table-column>
      <el-table-column
        width="150"
        prop="goodsCategoryName"
        label="商品类目"
        column-key="name"
        sortable="custom"
      ></el-table-column>
      <el-table-column width="150" prop="$type" label="商品类型"></el-table-column>
      <el-table-column width="150" prop="$dir" label="商品目录"></el-table-column>
      <el-table-column width="150" prop="projectType" label="所属项目">
        <template slot-scope="scope">
          <span v-if="scope.row.projectType === 1">行家</span>
          <span v-if="scope.row.projectType === 2">子墨学院</span>
        </template>
      </el-table-column>
      <el-table-column width="150" prop="$price" label="商品价格" column-key="name" sortable="custom"></el-table-column>
      <el-table-column
        width="150"
        prop="$issueStatus"
        label="发布状态"
        column-key="name"
        sortable="custom"
      ></el-table-column>
      <el-table-column width="150" prop="buyCount" label="学员数"></el-table-column>
      <el-table-column
        width="150"
        prop="stockCount"
        label="商品库存"
        column-key="name"
        sortable="custom"
      ></el-table-column>
      <el-table-column width="150" prop="$isRecommend" label="商品推荐"></el-table-column>
      <el-table-column width="150" prop="$isAudition" label="支持试听"></el-table-column>
      <el-table-column width="150" prop="activiteTypeName" label="商品活动类型"></el-table-column>
      <el-table-column width="150" prop="creatorName" label="创建人"></el-table-column>
      <el-table-column
        width="180"
        prop="$createTime"
        label="创建时间"
        column-key="name"
        sortable="custom"
      ></el-table-column>
      <el-table-column width="150" prop="modifierName" label="最后修改人"></el-table-column>
      <el-table-column
        width="180"
        prop="$updateTime"
        label="修改时间"
        column-key="name"
        sortable="custom"
      ></el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <router-link
            v-permission="['goods:list:update']"
            :to="{ name: 'GoodsListEdit', params: { id: scope.row.id } }"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>

          <el-button
            v-permission="['goods:list:ud']"
            v-if="scope.row.$btnUp"
            size="mini"
            @click.native="onPutaway([scope.row])"
          >上架</el-button>

          <el-button
            v-permission="['goods:list:ud']"
            v-if="scope.row.$btnDown"
            size="mini"
            @click.native="onSoldOut([scope.row])"
          >下架</el-button>

          <!-- <el-button
            v-permission="['goods:list:delete']"
            size="mini"
            type="danger"
            style="margin-left: 0; margin-top: 10px;"
            @click.native="onDelete([scope.row])"
          >删除</el-button>-->

          <el-dropdown
            trigger="click"
            @command="command => onClickMore(Number(command), scope.row)"
          >
            <span class="el-dropdown-link">更多</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">预览</el-dropdown-item>
              <el-dropdown-item v-permission="['goods:list:watch']" command="2">查看视频</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24" style="text-align: center;">
        <el-pagination
          :current-page.sync="filter.currPage"
          :page-size="filter.pageSize"
          :total="filter.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="oncurrPageChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 类目检验弹窗 -->
    <el-dialog :visible.sync="centerDialogOnCheck" title="提示" width="30%" center>
      <span>所选商品归属多个商品类目，请重新选择商品</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="onCheck">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量修改商品类目弹窗 -->
    <el-dialog :visible.sync="centerDialogVisible" title="修改类目" width="30%" center>
      <el-cascader
        v-model="filterConfig.changeSelected"
        :options="filterConfig.categoryOptions_type"
        filterable
        style="width:100%"
        @change="handleItemChange"
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="onSureChange">确认修改</el-button>
      </span>
    </el-dialog>

    <!--视频弹窗 -->
    <el-dialog :visible.sync="videosDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" title="视频列表" width="1000px" @close="onClosePreviewVideo">
      <el-row :gutter="20">
        <!-- 视频列表 -->
        <el-col :span="4" style="height:500px;overflow:auto;border: 1px solid #ccc;">
          <el-tree
            :data="videoTree"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          ></el-tree>
        </el-col>

        <el-col :span="20" style="display:flex;justify-content:center;">
          <div style="width:80%;height:500px;background:#000;">
            <div id="hangjia-cms-player" style="width: 100%; height: 100%;"></div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import MultiCascader from "@/components/MultiCascader";
import {
  goodsCategoryAll,
  getGoodsList,
  goodsDelete,
  setGoodsUpOrDown,
  setGoodsRecommendOrUnRecommend,
  getCourseListById,
  // getPlayUrlByRecordId,
  changeCategory,
  // getVideosListData,
  getPreviewVideoToken
} from "@/api/goods";
import { formatDate } from "@/utils";
import { clearTimeout } from "timers";

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
      ...i
    };
    if (i.childList && i.childList.length > 0) {
      item.children = AdapterCategoryMenuData(i.childList);
    }

    return item;
  });
  return temp;
};

export default {
  name: "GoodsList",
  components: {
    MultiCascader
  },
  data() {
    return {
      videoTree: [],
      defaultProps: {
        children: "list",
        label: "name"
      },
      state: {
        editProjectType: 1
      },
      centerDialogOnCheck: false,
      centerDialogVisible: false,
      videosDialogVisible: false,
      categoryOptions_hangjia: [],
      categoryOptions_zimo: [],
      filterConfig: {
        selectedData: [],
        categoryOptions: [],
        categoryOptions_type: [],
        categorySelected: [],
        changeOptions: [],
        changeSelected: [],
        goodsTypes: [
          {
            label: "全部",
            value: 0
          },
          {
            label: "直播",
            value: 1
          },
          {
            label: "录播",
            value: 2
          }
        ],
        releaseStatus: [
          {
            label: "全部",
            value: -1
          },
          {
            label: "未发布",
            value: 2
          },
          {
            label: "上架",
            value: 1
          },
          {
            label: "下架",
            value: 0
          },
          {
            label: "停售",
            value: 4
          }
        ],
        recommended: [
          {
            label: "全部",
            value: 0
          },
          {
            label: "是",
            value: 1
          },
          {
            label: "否",
            value: 2
          }
        ],
        audition: [
          {
            label: "全部",
            value: 0
          },
          {
            label: "是",
            value: 1
          },
          {
            label: "否",
            value: 2
          }
        ],
        activeTypes: [
          {
            label: "全部",
            value: 0
          },
          {
            label: "积分",
            value: 1
          },
          {
            label: "秒杀",
            value: 2
          },
          {
            label: "限时抢购",
            value: 3
          }
        ],
        sort: {
          prop: "",
          order: ""
        }
      },
      filter: {
        goodsName: "",
        categoryIds: "",
        goodsTypeValue: "",
        releaseStatus: "",
        isRecommended: "",
        isAudition: "",
        activeType: "",
        creator: "",
        sidx: "",
        sort: "",
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      selectedParams: {
        parentId: "",
        name: "",
        sort: "",
        level: "",
        id: ""
      },
      props: {
        label: "label",
        value: "value",
        children: "children"
      },
      goodsList: [],
      selectedItems: []
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    // 获取商品类目菜单列表 - 行家
    goodsCategoryAll(0).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.filterConfig.categoryOptions = menuData;
      this.categoryOptions_hangjia = menuData;
    });

    // 获取商品类目菜单列表 - 子墨
    goodsCategoryAll(2).then(res => {
      const menuData = AdapterCategoryMenuData(res.result);
      this.categoryOptions_zimo = menuData;
    });
    // 获取默认列表数据
    this.getGoodsList();
  },

  methods: {
    onRouteChange(to) {
      if (to.name === "GoodsList") {
        this.getGoodsList(this.filter.currPage);
      }
    },

    // 清空筛选栏
    clearFormFilter() {
      this.filterConfig.categorySelected = [];
      this.filter.goodsName = "";
      this.filter.categoryIds = "";
      this.filter.goodsTypeValue = "";
      this.filter.releaseStatus = "";
      this.filter.isRecommended = "";
      this.filter.isAudition = "";
      this.filter.activeType = "";
      this.filter.creator = "";
    },

    async openVideoPlayUrl(goodsId) {
      this.videosDialogVisible = true;
      // console.log(courseId)
      //  getVideosListData({courseId:courseId}).then(res => {
      //   console.log(res, '视频的列表');
      // })
      if (!goodsId) return Promise.reject("goodsId is null");
      const res = await getCourseListById(goodsId);
      if (res.code !== 200) return Promise.reject();
      this.videoTree = res.result;

      // const courseDir = res.result || [{}];
      // const courseSubDir = courseDir[0].list || [{}];
      // const recordId = courseSubDir[0].recordId;
      // if (recordId) {
      //   const res2 = await getPlayUrlByRecordId(recordId);
      //   if (res2.code !== 200) return Promise.reject();
      //   window.open(res2.result.vidUrl, "_blank");
      // } else {
      //   this.$message.error("该商品下无章节信息");
      //   return Promise.reject();
      // }

      // 点击查看视频的时候遍历节点添加title
       this.$nextTick(() => {
        console.log(11111,document.getElementsByClassName("el-tree-node__label").length)
        let styles = document.getElementsByClassName("el-tree-node__label");
      let len = styles.length;
      for (let i = 0;i<len;i++) {
        styles[i].setAttribute("title",styles[i].innerText);
      }
      })
        
    },

    onClickMore(command, item) {
      let url = "";
      if (process.env.ENV_CONFIG === "prod") {
        url = `//hengqihj.com/course/id/${item.id}`;
      } else if (process.env.ENV_CONFIG === "trial") {
        url = `//pc.pre-pro.hengqihj.com/course/id/${item.id}`;
      } else {
        url = `//hengqihj.beta.hqjy.com/course/id/${item.id}`;
      }

      if (command === 1) {
        window.open(url + "?adminView=true");
      } else if (command === 2) {
        // 查看视频
        this.openVideoPlayUrl(item.id);
      }
    },

    // 获取弹窗里面最后一级
    getCascaderObj(val, opt) {
      return val.map((value, index, array) => {
        for (const itm of opt) {
          if (itm.value === value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },

    // 获取弹窗下拉列表最后一级
    handleItemChange() {
      const childData = this.getCascaderObj(
        this.filterConfig.changeSelected,
        this.filterConfig.categoryOptions
      );
      this.selectedData = childData[childData.length - 1];
      this.selectedParams.parentId = this.selectedData.parentId;
      this.selectedParams.name = this.selectedData.name;
      this.selectedParams.sort = this.selectedData.sort;
      this.selectedParams.level = this.selectedData.level;
      this.selectedParams.id = this.selectedData.id;
    },

    // 遍历树获取所需商品类目id，对接到filter.categoryIds
    adapterSelectedCategoryIds(treeArr) {
      const ids = [];
      const recurve = arr => {
        arr.forEach(i => {
          if (i.label === "全选") return false;
          if (i.checked) {
            ids.push(i.id);
          } else if (i.indeterminate && i.children && i.children.length > 0) {
            recurve(i.children);
          }
        });
      };
      recurve(treeArr);
      this.filter.categoryIds = ids.join(",");
    },

    // 适配商品列表数据到UI
    adapterGoodsToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0
      } = result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = Number(totalCount);

      this.goodsList = list.map(item => {
        // 商品类型
        if (item.type === 1) item.$type = "直播";
        else if (item.type === 2) item.$type = "录播";
        else item.$type = "其他";

        // 商品目录
        item.$dir = `${item.courseChapterNum}章${item.courseSectionNum}节`;

        // 商品价格
        item.$price = Number(item.price).toFixed(2);

        // 发布状态
        if (item.issueStatus === 2) item.$issueStatus = "未发布";
        else if (item.issueStatus === 1) item.$issueStatus = "上架";
        else if (item.issueStatus === 0) item.$issueStatus = "下架";
        else if (item.issueStatus === 4) item.$issueStatus = "停售";
        else item.$issueStatus = "--";

        // 商品推荐
        if (item.isRecommend) item.$isRecommend = "是";
        else item.$isRecommend = "否";

        // 是否试听
        if (item.isAudition) item.$isAudition = "是";
        else item.$isAudition = "否";

        // 创建时间
        item.$createTime = formatDate(item.createTime);

        // 修改时间
        item.$updateTime = formatDate(item.updateTime);

        // 发布状态（2：未发布；1：上架；0：下架；4:停售）
        // 上架按钮（未发布 or 下架）
        if (item.issueStatus === 2 || item.issueStatus === 0)
          item.$btnUp = true;

        // 下架按钮（上架）
        if (item.issueStatus === 1) item.$btnDown = true;

        return item;
      });
      this.selectedItems = [];
    },

    // 点击批量修改商品类目
    onChangeGoods(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return false;
      // 检查是否属于同一个商品类目
      const categoryIds = new Set(items.map(i => i.goodsCategoryId));
      if (categoryIds.size !== 1) {
        this.$confirm("所选商品归属多个商品类目，请重新选择商品", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        });
        return false;
      }
      // 判断所选商品类目一级类目是否一致，否则弹窗提示
      const noPass = this.selectedItems.every(i => i.goodsCategoryId);
      console.log("same", noPass);
      // if (this.selectedItems.goodsCategoryId)
      // this.centerDialogOnCheck = true;

      const { projectType } = items[0];
      if (projectType === 1) {
        // 设置备选商品类目数据 - 行家
        this.state.editProjectType = 1;
        this.filterConfig.categoryOptions_type = this.categoryOptions_hangjia.concat(
          []
        );
      } else if (projectType === 2) {
        // 设置备选商品类目数据 - 子墨
        this.state.editProjectType = 2;
        this.filterConfig.categoryOptions_type = this.categoryOptions_zimo.concat(
          []
        );
      }

      // 商品类目选择弹窗
      this.filterConfig.changeSelected = [];
      this.centerDialogVisible = true;
    },

    // 点击检验类目弹窗
    onCheck() {
      this.centerDialogOnCheck = false;
    },

    // 点击批量修改商品类目 -> 选择商品类目后点击确认修改
    onSureChange() {
      if (this.filterConfig.changeSelected.length === 0) {
        this.$message.error("请选择商品类目！");
      } else {
        this.$confirm(
          "修改后，所选商品所属类目均会更新，是否确认修改？",
          "提示",
          {
            confirmButtonText: "确定",
            showClose: false,
            type: "warning"
          }
        )
          .then(() => {
            const options = {
              goodsCategoryId: this.filterConfig.changeSelected[
                this.filterConfig.changeSelected.length - 1
              ],
              goodsIdList: this.selectedItems.map(i => i.id).join(","),
              projectType: this.state.editProjectType
            };
            changeCategory(options).then(res => {
              if (res.code !== 200) return false;
              this.$message.success("更改成功！");
              this.getGoodsList(this.filter.currPage);
            });
            this.centerDialogVisible = false;
            this.filterConfig.changeSelected = [];
          })
          .catch(() => {
            this.centerDialogVisible = false;
            this.filterConfig.changeSelected = [];
          });
      }
    },

    // 根据参数获取商品列表
    async getGoodsList(pageNum = 1) {
      const options = {
        // 页码
        pageNum,
        // 商品名称
        name: this.filter.goodsName,
        // 类目ids
        goodsCategoryIdList: this.filter.categoryIds,
        // 创建人名字
        creatorName: this.filter.creator,
        // 发布状态
        issueStatus: "",
        // 商品类型
        type: this.filter.goodsTypeValue || "",
        // 活动类型
        activityType: this.filter.activeType || "",
        // 排序字段
        sidx: this.filter.sidx,
        // 排序规则
        sort: this.filter.sort
      };
      // 是否推荐
      if (this.filter.isRecommended === 1) options.isRecommend = true;
      if (this.filter.isRecommended === 2) options.isRecommend = false;
      // 是否支持试听
      if (this.filter.isAudition === 1) options.isAudition = true;
      if (this.filter.isAudition === 2) options.isAudition = false;

      // 发布状态
      if (this.filter.releaseStatus !== -1) {
        options.issueStatus = this.filter.releaseStatus;
      }

      // 发起请求
      const res = await getGoodsList(options);
      if (res.code !== 200) return Promise.reject();
      this.adapterGoodsToUI(res.result);

      this.$nextTick(() => {
        // 清空选择的项
        this.$refs["goods-table"].clearSelection();

        if (this.$refs["goods-table"]) {
          this.$refs["goods-table"].bodyWrapper.scrollTop = 0;
        }
      });
    },

    // 商品类目选中值改变时触发
    onCategoryValueChange(values, item, arr) {
      this.adapterSelectedCategoryIds(arr);
    },

    // 判断单项是否满足条件 - 上架
    // 返回Boolean
    checkPutaway(item) {
      let temp = false;
      if (item.issueStatus === 0 || item.issueStatus === 2) temp = true;
      return temp;
    },

    // 判断单项是否满足条件 - 下架
    // 返回Boolean
    checkSoldOut(item) {
      let temp = false;
      if (item.issueStatus === 1) temp = true;
      return temp;
    },

    // 判断单项是否满足条件 - 删除
    // 返回Boolean
    checkDelete(item) {
      let temp = false;
      if (
        item.issueStatus === 0 ||
        item.issueStatus === 2 ||
        item.issueStatus === 4
      )
        temp = true;
      return temp;
    },

    // 如果没有选择，则提醒
    // 返回Boolean
    checkSelectIsNull(items = []) {
      if (items.length <= 0) {
        this.$confirm("请至少勾选一条数据！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        });
        return true;
      }
      return false;
    },

    // 操作 - [删除 or 批量删除]
    async onDelete(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 已选择
      const noPass = items.some(i => !this.checkDelete(i));
      if (noPass) {
        this.$confirm(
          "只能删除未发布、下架、停售状态的商品，请排查是否勾选了其他状态的商品！",
          "删除商品",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "warning"
          }
        );
      } else {
        const confimRes = await this.$confirm(
          "确定要删除已选中的商品吗？",
          "删除商品",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认删除的回调
          const ids = items.map(i => i.id);
          const { code } = await goodsDelete(ids);
          if (code === 200) {
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsList(this.filter.currPage);
          }
        }
      }
    },

    // 操作 - [上架 or 批量上架]
    async onPutaway(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 过滤1: 已上架，停售
      // 过滤2：库存为0
      const filterItems = items.filter(
        i => (i.issueStatus === 0 || i.issueStatus === 2) && i.stockCount > 0
      );
      if (filterItems.length > 0) {
        const confimRes = await this.$confirm(
          "确定要上架已选中的商品吗？",
          "上架商品",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认删除的回调
          const ids = filterItems.map(i => i.id);
          const { code } = await setGoodsUpOrDown(ids, 1);
          if (code === 200) {
            this.$message({
              message: "上架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsList();
          }
        }
      } else {
        // 判定为上架成功
        this.$message({
          message: "上架成功！",
          type: "success"
        });
        // 重新获取列表
        this.getGoodsList();
      }
    },

    // 操作 - [下架 or 批量下架]
    async onSoldOut(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 只对已上架的商品进行下架
      const filterItems = items.filter(i => i.issueStatus === 1);
      if (filterItems.length > 0) {
        const confimRes = await this.$confirm(
          "下架后，关联该商品的活动、轮播图、广告位、首页排行版等位置都会同步下架，确定要下架已选中的商品吗？",
          "下架商品",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认回调
          const ids = filterItems.map(i => i.id);
          const { code } = await setGoodsUpOrDown(ids, 2);
          if (code === 200) {
            this.$message({
              message: "下架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsList();
          }
        }
      } else {
        // 判定为上架成功
        this.$message({
          message: "下架成功！",
          type: "success"
        });
        // 重新获取列表
        this.getGoodsList();
      }
    },

    // 操作 - [推荐 or 批量推荐]
    async onRecommend(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 只对未推荐的商品进行操作
      const filterItems = items.filter(i => !i.isRecommend);
      if (filterItems.length > 0) {
        const confimRes = await this.$confirm(
          "确定要设置已选中的商品为推荐商品吗？",
          "设置商品推荐",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认回调
          const ids = filterItems.map(i => i.id);
          const { code } = await setGoodsRecommendOrUnRecommend(ids, 3);
          if (code === 200) {
            this.$message({
              message: "设置商品推荐成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsList();
          }
        }
      } else {
        // 判定为上架成功
        this.$message({
          message: "设置商品推荐成功！",
          type: "success"
        });
        // 重新获取列表
        this.getGoodsList();
      }
    },

    // 操作 - [不推荐 or 批量不推荐]
    async onUnRecommend(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 只对已推荐的商品进行操作
      const filterItems = items.filter(i => i.isRecommend);
      if (filterItems.length > 0) {
        const confimRes = await this.$confirm(
          "确定要取消已选中的商品为推荐商品吗？",
          "取消商品推荐",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认回调
          const ids = filterItems.map(i => i.id);
          const { code } = await setGoodsRecommendOrUnRecommend(ids, 4);
          if (code === 200) {
            this.$message({
              message: "取消商品推荐成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsList();
          }
        }
      } else {
        // 判定为上架成功
        this.$message({
          message: "取消商品推荐成功！",
          type: "success"
        });
        // 重新获取列表
        this.getGoodsList();
      }
    },

    // 单选 or 全选
    onSelectCheckBox(selection) {
      this.selectedItems = selection;
      console.log("选中", selection);
    },

    // 监听表格排序事件
    onTableSort({ prop, order }) {
      if (prop) this.filter.sidx = String(prop).replace("$", "");
      else this.filter.sidx = "";

      if (order === "descending") this.filter.sort = "desc";
      else if (order === "ascending") this.filter.sort = "asc";
      else this.filter.sort = "";
      this.getGoodsList();
    },
    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getGoodsList(pageNum);
    },
    // 关闭预览
    onClosePreviewVideo() {
      if (this.polyvPlayer) {
        if (this.polyvPlayer.destroy) this.polyvPlayer.destroy();
        this.polyvPlayer = null;
      }
    },
    // 点击视频列表的回调
    handleNodeClick({ recordId, vid }) {
      this.previewVideo(recordId, vid);
    },
    // 预览视频
    async previewVideo(recordId, vid) {
      // 获取签证
      const res = await getPreviewVideoToken({ recordId, vid });
      const videoAuthInfo = res.result;
      if (!this.polyvPlayer) {
        // 实例化播放器
        this.polyvPlayer = window.polyvPlayer({
          vid,
          wrap: "#hangjia-cms-player",
          width: "100%",
          height: "100%",
          watchStartTime: 0,
          playsafe: videoAuthInfo.data.token,
          ts: videoAuthInfo.data.ts,
          sign: videoAuthInfo.data.sign
        });
      } else {
        this.polyvPlayer.changeVid(
          vid,
          0,
          "on",
          videoAuthInfo.data.ts,
          videoAuthInfo.data.sign
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.table-goods-cover {
  display: inline-block;
  width: 100px;
  height: 60px;
}
.el-dropdown-link {
  margin-left: 10px;
  cursor: pointer;
}
</style>
