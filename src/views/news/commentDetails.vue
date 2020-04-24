<template>
  <div class="news-comment-details">
    <!-- 评论详情 - 阿里云过滤敏感词 -->
    <el-form
      :model="commentDetails"
      ref="commentDetails"
      size="small"
      label-position="right"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="资讯标题："
            prop="title"
          >
            <span class="title-content">{{commentDetails.title}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="资讯类目："
            prop="category"
          >
            <span class="title-content">{{commentDetails.firstCategoryName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="二级类目："
            prop="secordCategory"
          >
            <span class="title-content">{{commentDetails.secondCategoryName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="table">
      <el-table
        :data="commentList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          type="index"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="commentator"
          label="评论人昵称"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="comment"
          label="评论内容"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.comment.length > 200">
              <p v-if="!show">{{handleDesc(scope.row.comment)}}<span>...</span><span
                  class="more"
                  @click="checkMore"
                >更多</span></p>
              <p v-if="show">{{scope.row.comment}}<span
                  class="more"
                  @click="close"
                >收起</span></p>
            </div>
            <div v-else>{{scope.row.comment}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="评论时间"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <p v-permission='["info:comment:audit"]'>
              <span v-if="scope.row.status === 1">
                已显示
              </span>
              <span v-if="scope.row.status === 0">
                已隐藏
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 1"
              type="danger"
              @click.native="handleHide(scope.row.id)"
            >
              隐藏
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="primary"
              @click.native="handleDisplay(scope.row.id)"
            >
              显示
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row style="margin-top: 20px;">
      <el-col
        :span="24"
        style="text-align: center;"
      >
        <el-pagination
          :current-page.sync="formData.pageNum"
          :page-size="formData.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCommentList, changeStatus } from '@/api/news';

export default {
  name: 'CommentDetails',
  data() {
    return {
      show: false,
      commentDetails: {
        title: '',
        firstCategoryName: '',
        secondCategoryName: '',
      },
      commentList: [],
      formData: {
        infoId: 1,
        pageNum: 1,
        pageSize: 20,
      },
      totalCount: 20,
      totalPage: 20,
    };
  },
  created() {
    this.init();
    this.getDetails();
  },
  methods: {
    init() {
      this.formData.infoId = this.$route.params.id;
      this.commentDetails.title = this.$route.query.title;
      this.commentDetails.firstCategoryName = this.$route.query.firstCategoryName;
      this.commentDetails.secondCategoryName = this.$route.query.secondCategoryName;
    },

    // 获取详情
    getDetails() {
      getCommentList(this.formData).then(res => {
        this.commentList = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 查看更多
    checkMore() {
      this.show = true;
    },

    // 收起
    close() {
      this.show = false;
    },

    // 截取描述内容
    handleDesc(item) {
      const content = item.slice(0, 200);
      return content;
    },

    // 隐藏
    handleHide(id) {
      const data = {
        operateType: 0,
        id: id,
      };
      changeStatus(data).then(res => {
        this.$message.success('操作成功！');
        this.getDetails();
      });
    },

    // 显示
    handleDisplay(id) {
      const data = {
        operateType: 1, // 0显示 1隐藏
        id: id,
      };
      changeStatus(data).then(res => {
        this.$message.success('操作成功！');
        this.getDetails();
      });
    },

    // 分页
    handleSizeChange(val) {
      this.formData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.formData.pageNum = val;
      this.getDetails();
    },
  },
};
</script>
<style lang="less" scoped>
.news-comment-details {
  padding: 40px;
  .table {
    margin: 35px 0px;
    .more {
      text-decoration: underline;
      color: blue;
      cursor: pointer;
    }
  }
}
</style>