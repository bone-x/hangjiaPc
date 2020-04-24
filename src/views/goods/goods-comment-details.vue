<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-date-picker
          v-model="filter.timeStart"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-col>

      <el-col :span="3">
        <el-date-picker
          v-model="filter.timeEnd"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-col>

      <el-col :span="3">
        <el-select v-model="filter.releaseStatus" placeholder="选择状态" title="选择状态">
          <el-option
            v-for="(item, index) in filterConfig.releaseStatus"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-input
          :clearable="true"
          v-model="filter.userName"
          name="userName"
          placeholder="请输入学员姓名"
          title="请输入学员姓名"
          type="text"
        ></el-input>
      </el-col>

      <el-col :span="4">
        <el-input
          :clearable="true"
          v-model="filter.phone"
          name="phone"
          placeholder="请输入学员手机号"
          title="请输入学员手机号"
          type="number"
        ></el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click.native="getGoodsCommentDetailsList(1)">查询</el-button>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <el-row :gutter="40" style="margin-top: 30px;">
      <el-col v-permission="['goods:evaluate:ud']" :span="2">
        <el-button type="primary" @click.native="onPutaway(selectedItems)">批量上架</el-button>
      </el-col>

      <el-col v-permission="['goods:evaluate:ud']" :span="2">
        <el-button type="info" @click.native="onSoldOut(selectedItems)">批量下架</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="goods-comment-details-table"
      :data="goodsCommentDetailsList"
      :default-sort="filterConfig.sort"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
      @select="onSelectCheckBox"
      @select-all="onSelectCheckBox"
    >
      <el-table-column width="55" fixed="left" type="selection" align="center"></el-table-column>
      <el-table-column width="200" prop="userId" label="学员ID"></el-table-column>
      <el-table-column width="150" prop="userName" label="学员姓名"></el-table-column>
      <el-table-column width="150" prop="phone" label="手机号"></el-table-column>
      <el-table-column width="100" prop="overallScore" label="综合评分"></el-table-column>
      <el-table-column width="100" prop="courseScore" label="商品评分"></el-table-column>
      <el-table-column width="100" prop="teacherScore" label="讲师评分"></el-table-column>
      <el-table-column width="200" prop="$tagName" label="标签"></el-table-column>
      <el-table-column min-width="300" prop="commentContent" label="评价内容"></el-table-column>
      <el-table-column width="200" prop="$updateTime" label="提交时间"></el-table-column>
      <el-table-column width="50" prop="$status" label="状态"></el-table-column>
      <el-table-column width="100" prop="modifierName" label="修改人"></el-table-column>
      <el-table-column width="200" prop="$operateTime" label="修改时间"></el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24" center>
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
  </div>
</template>

<script>
import MultiCascader from "@/components/MultiCascader";
import {
  getGoodsCommentDetailsList,
  goodsCommentDetailsUp,
  goodsCommentDetailsDown
} from "@/api/goods";
import { formatDate } from "@/utils";

export default {
  name: "GoodsCommentDetails",
  components: {
    MultiCascader
  },
  data() {
    return {
      filterConfig: {
        categoryOptions: [],
        categorySelected: [],
        releaseStatus: [
          {
            label: "全部",
            value: 0
          },
          {
            label: "上架",
            value: 1
          },
          {
            label: "下架",
            value: 2
          }
        ]
      },
      filter: {
        goodsName: "",
        releaseStatus: "",
        timeStart: "",
        timeEnd: "",
        userName: "",
        phone: "",
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      goodsCommentDetailsList: [],
      selectedItems: []
    };
  },
  created() {
    // 获取默认列表数据
    this.getGoodsCommentDetailsList();
  },
  methods: {
    // 清空筛选栏
    clearFormFilter() {
      this.filter.goodsName = "";
      this.filter.releaseStatus = "";
      this.filter.timeStart = "";
      this.filter.timeEnd = "";
      this.filter.userName = "";
      this.filter.phone = "";
    },

    // 根据参数请求 - 商品评价明细列表
    async getGoodsCommentDetailsList(pageNum = 1) {
      const options = {
        pageNum,
        goodsId: this.$route.params.id,
        timeStart: this.filter.timeStart,
        timeEnd: this.filter.timeEnd,
        status: this.filter.releaseStatus,
        phone: this.filter.phone,
        userName: this.filter.userName,
        pageSize: this.filter.pageSize
      };
      const res = await getGoodsCommentDetailsList(options);
      if (res.code !== 200) return Promise.reject();
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0
      } = res.result;

      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize || 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;
      this.goodsCommentDetailsList = list.map(i => {
        // 标签
        i.$tagName = String(i.tagName).replace(/,/g, "、");

        // 提交时间
        i.$updateTime = formatDate(i.updateTime, 8);

        // 状态
        if (i.status === 1) i.$status = "上架";
        else if (i.status === 2) i.$status = "下架";
        else i.$status = "";

        // 评价内容
        i.$commentContent = i.commentContent;
        if (!i.commentContent) i.$commentContent = "/";

        // 修改时间
        i.$operateTime = formatDate(i.operateTime, 8);
        return i;
      });

      this.$nextTick(() => {
        if (this.$refs["goods-comment-details-table"]) {
          this.$refs["goods-comment-details-table"].bodyWrapper.scrollTop = 0;
        }
      });
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

    // 操作 - [上架 or 批量上架]
    async onPutaway(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 过滤1: 已上架
      const filterItems = items.filter(i => i.status === 2);
      if (filterItems.length > 0) {
        const confimRes = await this.$confirm(
          "确定要上架已选中的商品评价吗？",
          "上架商品评价",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认删除的回调
          const ids = filterItems.map(i => i.id);
          const { code } = await goodsCommentDetailsUp(ids);
          if (code === 200) {
            this.$message({
              message: "上架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsCommentDetailsList();
          }
        }
      } else {
        // 判定为上架成功
        this.$message({
          message: "上架成功！",
          type: "success"
        });
        // 重新获取列表
        this.getGoodsCommentDetailsList();
      }
    },

    // 操作 - [下架 or 批量下架]
    async onSoldOut(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 只对已上架的商品进行下架
      const filterItems = items.filter(i => i.status === 1);
      if (filterItems.length > 0) {
        const confimRes = await this.$confirm(
          "确定要下架已选中的商品评价吗？",
          "下架商品评价",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认回调
          const ids = filterItems.map(i => i.id);
          const { code } = await goodsCommentDetailsDown(ids);
          if (code === 200) {
            this.$message({
              message: "下架成功！",
              type: "success"
            });
            // 重新获取列表
            this.getGoodsCommentDetailsList();
          }
        }
      } else {
        // 判定为下架成功
        this.$message({
          message: "下架成功！",
          type: "success"
        });
        // 重新获取列表
        this.getGoodsCommentDetailsList();
      }
    },

    // 单选 or 全选
    onSelectCheckBox(selection) {
      this.selectedItems = selection;
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getGoodsCommentDetailsList(pageNum);
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

/deep/ .el-date-editor {
  width: 100%;
}

.text-line-2 {
  height: 50px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
