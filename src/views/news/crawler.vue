<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-26 18:00:11
 * @LastEditTime: 2019-09-02 16:14:24
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-container">
    <!-- 资讯管理 - 爬取资讯管理 -->
    <div class="data_head">
      <el-row :gutter="20">
        <!-- <el-col :span="3">
          <el-select v-model="valueType" placeholder="请选择资讯类别">
            <el-option
              v-for="item in optiontype"
              :key="item.valueType"
              :label="item.label"
              :value="item.valueType"
            ></el-option>
          </el-select>
        </el-col> -->
        <el-col :span="4">
          <el-input v-model="content" placeholder="请输入查询标题" maxlength="10"></el-input>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="fetchTime"
            type="date"
            placeholder="选择日期"
            style="width: 100%;">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-input v-model="platform" placeholder="请输入平台名称" maxlength="10"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button v-permission="['info:crawer:select']" type="primary" @click="queryData">查询</el-button>
        </el-col>
        <el-col :span="3" style="margin-left:20px;">
          <el-button type="danger" @click="clearAll">清空</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="data_btn">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button v-permission="['info:crawer:delete']" type="danger" @click="deleteListdata">删除</el-button>
        </el-col>
        <el-col :span="2" :offset="20">
          <el-button
            v-permission="['info:crawer:result']"
            type="primary"
            @click="dialogVisible = true"
          >查看爬取结果</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格部分 -->
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="NO." width="80" sortable prop="id"></el-table-column>
        <el-table-column label="爬取资讯标题" width="150">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.title }}</p>
              <div slot="reference">
                <p class="limitwords">{{ scope.row.title }}</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column label="资讯类目" prop="secondCategoryName"></el-table-column> -->
        <el-table-column label="平台名称" prop="platform"></el-table-column>
        <!-- <el-table-column label="阅读数" prop="viewer"></el-table-column> -->
        <!-- <el-table-column label="点赞数" prop="likeAccount"></el-table-column> -->
        <!-- <el-table-column label="评论数" prop="commentAccount"></el-table-column> -->
        <el-table-column label="资讯地址" width="300" prop="url"></el-table-column>
        <el-table-column label="资讯发布人" prop="author"></el-table-column>
        <el-table-column label="发布时间" width="100">
          <template slot-scope="scope">{{ scope.row.publishTime ? timeFormat(scope.row.publishTime): '' }}</template>
        </el-table-column>
        <el-table-column label="爬取时间" width="100">
          <template slot-scope="scope">{{ scope.row.createTime ? timeFormat(scope.row.createTime) : '' }}</template>
        </el-table-column>
        <el-table-column label="修改人" prop="updatorName" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              v-permission="['info:crawer:update']"
              v-if="isoperation"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >应用模板</el-button>
            <el-button v-else size="mini" disabled>已发布</el-button>
            <el-button
              v-permission="['info:crawer:delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="padding-top:20px;">
      <el-button v-permission="['info:crawer:delete']" type="danger" @click="deleteListdata">删除</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSize"
            @current-change="handleCurrent"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 查看爬取结果的弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="查看爬取结果"
      width="800px"
    >
      <!-- <span>请选择范围：</span>
      <el-select v-model="valueDialog" placeholder="请选择资讯类别">
        <el-option
          v-for="item in optionDialog"
          :key="item.valueDialog"
          :label="item.label"
          :value="item.valueDialog"
        ></el-option>
      </el-select> -->
      <el-date-picker v-model="checkdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="queryResult">搜索</el-button>
      <el-button style="float:right;" @click="outData">导出全部数据</el-button>
      <div style="margin-bottom:20px;"></div>
      <div>
        <el-table :data="table" border style="width: 100%">
          <el-table-column align="center" prop="id" label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="webName" label="爬取网站"></el-table-column>
          <el-table-column align="center" prop="crawlAccount" label="爬取资讯量"></el-table-column>
          <el-table-column align="center" label="爬取时间" width="200">
            <template slot-scope="scope">{{ scope.row.createTime ? timeFormat(scope.row.createTime) : '' }}</template>
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20" style="padding-top:20px;">
        <el-col :span="12" :offset="6">
          <div class="block">
            <el-pagination
              :current-page.sync="currentPagedialog"
              :page-size="pageSizedialog"
              :total="totaldialog"
              layout="prev, pager, next, jumper"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="20" style="padding-top:20px;">
          <el-col :span="12" :offset="3">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowCreateNewsDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="应用模板"
      width="1000px"
      @close="onCloseCreateNewsDialog">
      <news-form v-if="isShowCreateNewsDialog" :form-data="editNewsFromData" source="crawler" @save="handleCreateNews" @push="handlePushNews" @cancel="isShowCreateNewsDialog = false"></news-form>
    </el-dialog>

  </div>
</template>

<script>
import { formatDate } from "@/utils/index";
import figureKeyframes from "@/components/figure-keyframes";
import Tinymce from "@/components/Tinymce";
import multiUploadImage from "@/components/Upload/multiImage";
import uploadSingle from "@/components/Upload/single";
import newsForm from "./layout/newsForm";

import {
  getmanagementList,
  getmanagementSingle,
  getmanagementExcel,
  delmanagementList,
  createdInformationByCrawler,
  getFathertype,
  getChildtype,
  getCrawlerContentById,
  unlockCrawlerNewsById,
} from "@/api/news";

let tinymceId;

export default {
  name: "NewsCrawler",
  components: {
    multiUploadImage,
    figureKeyframes,
    uploadSingle,
    Tinymce,
    newsForm,
  },
  data() {
    return {
      editNewsFromData: null,
      platform: '',
      fetchTime: new Date(),
      editItem: null,
      multipleSelection: [],
      optiontype: [],
      valueType: "",
      optionDialog: [],
      valueDialog: "",
      content: "",
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 10,
      currentPagedialog: 1,
      pageSizedialog: 10,
      totaldialog: 50,
      isoperation: true, // 是否发布
      dialogVisible: false,
      checkdate: "",
      table: [],
      isShowCreateNewsDialog: false,
      dialogoptiontype: [],
      dialogvalueType: "",
      dialogoptionsecond: [],
      dialogvalueScond: "",
    };
  },
  created() {
    this.getList();
    this.queryResult();
    this.getFathercontent();
  },
  beforeRouteLeave(to, from, next) {
    this.isShowCreateNewsDialog = false;
    next();
  },
  methods: {
    onCloseCreateNewsDialog() {
      if (this.editNewsFromData.crawlerNewsId) unlockCrawlerNewsById(this.editNewsFromData.crawlerNewsId);
    },
    goRouter(name, params, query) {
      this.$router.push({
        name,
        params,
        query,
      });
    },

    timeFormat: formatDate, // 时间戳转化

    // 点击所属项目刷新等级类目
    getProjectType(item) {
      this.getFathercontent(item);
      this.dialogvalueType = "";
      this.dialogvalueScond = "";
    },

    changeHandler(id) {
      // 二级联动
      this.dialogvalueScond = "";
      getChildtype({ id }).then(response => {
        this.dialogoptionsecond = response.result.map(item => {
          return {
            id: item.id,
            name: item.name
          };
        });
      });
    },
    getFathercontent(productId = 1) {
      // 获取父类目
      getFathertype(productId).then(response => {
        this.optiontype = response.result.map(item => {
          return {
            valueType: item.id,
            label: item.name
          };
        });
        this.optionDialog = response.result.map(item => {
          return {
            valueDialog: item.id,
            label: item.name
          };
        });
        this.dialogoptiontype = response.result.map(item => {
          return {
            dialogvalueType: item.id,
            name: item.name
          };
        });
        // console.log(this.dialogoptiontype, "父类目元素");
      });
    },
    getList() {
      // 获取列表信息
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize, // 每页多少条
        title: this.content || null,
        infCategoryId: this.valueType || null,
        startDate: this.fetchTime ? formatDate(this.fetchTime, 9) : '',
        platform: this.platform,
      };
      getmanagementList(params).then(response => {
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
        response.result.list.forEach(val => {
          if (val.status === "1") {
            this.isoperation = false;
          }
        });
      });
    },
    queryData() {
      //  查询
      setTimeout(() => {
        this.getList();
      }, 1000);
    },
    queryResult() {
      // 弹窗列表爬取结果
      const params = {
        categoryId: this.valueDialog || null,
        pageSize: this.pageSizedialog,
        pageNum: this.currentPagedialog || null,
        startDate: this.checkdate
      };
      getmanagementSingle(params).then(response => {
        this.table = response.result.list;
        this.totaldialog = response.result.totalCount;
      });
    },
    async outData() {
      // 导出数据
      const params = {
        categoryId: this.valueDialog || null,
        pageSize: this.pageSizedialog,
        pageNum: this.currentPagedialog,
        startDate: this.checkdate || null
      };
      const response = await getmanagementExcel(params);
      if (response.code !== 200) return Promise.reject();
      const { url } = response.result;
      if (url) {
        window.open(url, "_self");
      }
    },
    
    // api - 创建资讯
    async postCreateNews(data = {}) {
      const params = {
        crawlerNewsId: data.crawlerNewsId,
        authorName: data.author,
        basicLikeRemain: data.baseZanNum,
        basicViewerRemain: data.baseReadNum,
        content: data.content,
        coverImage: data.coverArr.map(i => encodeURIComponent(i)).join(','),
        mainCategoryId: data.mainCategoryId,
        suCategoryId: data.infCategoryId,
        status: data.status,
        title: data.title,
        productId: data.projectType,
        pcRecommendStatus: data.isRecommend2NewNewsPC,
        appTopStatus: data.isRecommend2HotAPP,
        pcCarouselStatus: data.isRecommend2hotPC,
        manualAuditStatus: 0,
      };

      // if (data.newsVarCover.type === 0) {
      //   params.dynamicType = 1;
      // } else if (data.newsVarCover.type === 1) {
      //   params.dynamicType = 2;
      //   params.dynamicImage = data.newsVarCover.covers.map(i => encodeURIComponent(i)).join(',');
      // } else if (data.newsVarCover.type === 2) {
      //   params.dynamicType = 3;
      //   params.dynamicVideo = data.newsVarCover.videoUrl;
      // }

      if (params.pcRecommendStatus === 1) params.rank = data.recommend2NewNewsPCindex;
      if (params.pcCarouselStatus === 1) params.popularOrder = data.recommend2hotPCindex;
      if (data.videoUrl) params.video = data.videoUrl;
      if (data.setTimeoutDateTime) params.morningNewspaperPushTimeStr = formatDate(data.setTimeoutDateTime, 8);
      const res = await createdInformationByCrawler(params);
      if (res.code !== 200) return Promise.reject(res.msg);
      this.isShowCreateNewsDialog = false;
      this.$message.success('操作成功');
      this.queryData();
      return res;
    },

    // 创建资讯
    handleCreateNews(formData = Object) {
      this.postCreateNews(Object.assign({}, formData, { status: 0 }));
    },

    // 发布资讯
    handlePushNews(formData = Object) {
      this.postCreateNews(Object.assign({}, formData, { status: 1 }));
    },

    // 适配编辑的资讯数据
    adapterEditNews(row = {}) {
      const data = {
        crawlerNewsId: row.id,                    // 爬取的资讯id
        projectType: 1,                           // 所属项目 
        title: '',                                // 资讯标题
        mainCategoryId: '',                       // 一级类目id
        infCategoryId: '',                        // 资讯类目（二级）
        setTimeoutDateTime: new Date(),           // 早报定时推送时间((一级类目name === 早报)时出现)
        author: '',                               // 作者
        isRecommend2NewNewsPC: 0,                 // 推荐到PC端最新资讯（0：否，1：是）
        recommend2NewNewsPCindex: '',             // 推荐到PC端最新资讯 - 排序
        isRecommend2HotAPP: 0,                    // 推荐到app端热点置顶（0：否，1：是）
        baseReadNum: '',                          // 阅读基数
        coverArr: [],                             // 封面图（1，3张）
        newsVarCover: {                           // 资讯动态封面
          type: 0,                                //   [0：不设置，1：图片，2：视频]
          covers: [],                             //   图片组[url, url, ...]
          videoUrl: '',                           //   视频url
        },
        videoUrl: row.videoSrc,                   // 视频url
        isRecommend2hotPC: 0,                     // 推荐到PC端热点轮播（0：否，1：是）
        recommend2hotPCindex: '',                 // 推荐到PC端热点轮播 - 排序
        baseZanNum: '',                           // 点赞基数
        isCheckComment: false,                    // 是否人工审核评论（0：否，1：是）
        content: '',                              // 资讯内容(html)
      };
      
      if (row.projectType !== undefined) data.projectType = row.projectType;
      if (row.title !== undefined) data.title = row.title;
      if (row.author !== undefined) data.author = row.author;
      if (row.content !== undefined) data.content = row.content;

      return data;
    },

    handleEdit(index, row) {
      getCrawlerContentById(row.id).then(res => {
        if (res.code !== 200) return false;
        const item = Object.assign({}, row, { content: res.result.content });
        this.editItem = item;
        this.editNewsFromData = this.adapterEditNews(item);
        this.isShowCreateNewsDialog = true;
      });
    },

    handleDelete(index, row) {
      this.$confirm("确定要删除已选中的资讯吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            newStr: row.id
          };
          delmanagementList(params).then(response => {});
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          setTimeout(() => {
            this.getList();
          }, 1000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteListdata() {
      const newArray = [];
      const newStatus = [];
      this.multipleSelection.forEach(val => {
        newArray.push(val.id);
        newStatus.push(val.status);
      });
      const newStr = newArray.join();
      if (newStr === "") {
        this.$message({
          message: "请选择要删除的资讯",
          type: "warning"
        });
      } else {
        this.$confirm("确定要删除已选中的资讯吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            const trueStatus = function(val) {
              return val === "1";
            };
            if (newStatus.some(trueStatus)) {
              this.$message({
                message:
                  "只能删除未发布和下架状态的资讯，请排查是否勾选了其他状态的资讯！",
                type: "warning"
              });
            } else {
              const params = {
                newStr
              };
              delmanagementList(params).then(response => {
                setTimeout(() => {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getList();
                }, 1000);
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            this.getList();
          });
      }
    },
    // 支持多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pageSizedialog = val;
      this.queryResult();
    },
    handleCurrentChange(val) {
      this.currentPagedialog = val;
      this.queryResult();
    },
    handleSize(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrent(val) {
      this.currentPage = val;
      this.getList();
    },
    clearAll() {
      this.valueType = "";
      this.content = "";
      this.platform = "";
      this.fetchTime = "";
    },
  }
};
</script>

<style lang="less" scoped>
.data_head {
  margin-bottom: 20px;
}
.data_btn {
  margin-bottom: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 180px;
  height: 120px;
  display: block;
}
.limitwords {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 42px;
}
.goods-cover-container {
  position: relative;
  margin-left: 10px;
  width: 288px;
  height: 160px;
  border: 1px solid #ebeef5;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.cover-img {
  display: inline-block;
  width: 100px;
  max-height: 100px;
  margin-right: 20px;
}
</style>
