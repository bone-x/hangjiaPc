<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-05 09:12:21
 * @LastEditTime: 2019-08-27 09:55:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-container">
    <!-- 资讯管理 - 资讯列表 -->
    <div class="listHead">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="datetimerange"
            range-separator="-"
            start-placeholder="年/月/"
            end-placeholder="年/月/"
            style="width: 100%"
          ></el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-select
            v-model="valueType"
            placeholder="资讯类别"
            style="width: 100%"
            @change="changeHandler"
          >
            <el-option
              v-for="item in optiontype"
              :key="item.valueType"
              :label="item.label"
              :value="item.valueType"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select
            v-model="valueScond"
            style="width: 100%"
            placeholder="资讯类别（二级）"
          >
            <el-option
              v-for="item in optionsecond"
              :key="item.valueScond"
              :label="item.label"
              :value="item.valueScond"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row
        :gutter="20"
        style="margin-top: 20px;"
      >
        <el-col :span="3">
          <el-select
            v-model="valueStatus"
            style="width: 100%"
            placeholder="资讯的状态"
          >
            <el-option
              v-for="item in optionstatus"
              :key="item.valueStatus"
              :label="item.label"
              :value="item.valueStatus"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select
            v-model="valueHot"
            style="width: 100%"
            placeholder="是否热点轮播"
          >
            <el-option
              v-for="item in populer"
              :key="item.valueHot"
              :label="item.label"
              :value="item.valueHot"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select
            v-model="isFirstTimeNews"
            style="width: 100%"
            placeholder="是否最新资讯"
          >
            <el-option
              :value="1"
              label="是"
            ></el-option>
            <el-option
              :value="0"
              label="否"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-input
            v-model="keywords"
            style="width: 100%"
            placeholder="请输入查询的关键字"
            maxlength="10"
          ></el-input>
        </el-col>

        <el-col :span="2">
          <el-button
            v-permission="['info:list:select']"
            type="primary"
            @click="getList"
          >查询</el-button>
        </el-col>

        <el-col :span="2">
          <el-button
            type="danger"
            @click="clearAll"
          >清空</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="btn">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button
            v-permission="['info:list:auth']"
            type="info"
            @click="underData"
          >下架</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            v-permission="['info:list:delete']"
            type="danger"
            @click="deletelittleData"
          >删除</el-button>
        </el-col>
        <el-col
          :span="2"
          :offset="15"
        >
          <el-button
            v-permission="['info:list:save']"
            type="primary"
            @click="showCreateNewsDialog"
          >新建资讯</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            style="margin-left:40px;"
            @click="crawlData"
          >爬取资讯</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        :data="tableData"
        :default-sort="filter"
        style="width: 100%"
        max-height="650"
        border
        @sort-change="onTableSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="ID"
          width="80"
          prop="id"
          align="center"
        ></el-table-column>
        <el-table-column
          label="资讯标题"
          width="250"
        >
          <template slot-scope="scope">
            <p class="title">{{ scope.row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="资讯类目"
          width="120"
          prop="mainCategoryName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="资讯二级类目"
          width="120"
          prop="suCategoryName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="creatorName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="180"
          :sort-orders="['ascending', 'descending']"
          column-key="inf.create_time"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="最后修改人"
          prop="updateName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="发布时间"
          prop="publishTime"
          width="180"
          :sort-orders="['ascending', 'descending']"
          column-key="inf.publish_time"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          :sort-orders="['ascending', 'descending']"
          min-width="100px"
          label="阅读量"
          align="center"
          column-key="inf.viewer"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.basicViewer+scope.row.viewer }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点赞量"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.likeAccount+scope.row.basicLikeAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="视频"
          align="center"
        >
          <template slot-scope="scope">
            <svg-icon
              v-if="scope.row.video"
              icon-class="video"
              class="images"
            ></svg-icon>
          </template>
        </el-table-column>
        <el-table-column
          label="PC端热点轮播排序"
          min-width="150"
          prop="popularOrder"
          align="center"
        ></el-table-column>
        <el-table-column
          label="PC端最新资讯排序"
          min-width="150"
          prop="rank"
          align="center"
        ></el-table-column>
        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.status ==0 ? ("未发布") :(scope.row.status == 1?"已发布":"已下架") }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="245"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['info:list:update']"
              size="mini"
              @click="showEditNewsDialog(scope.row, scope.$index)"
            >编辑</el-button>
            <el-button
              v-permission="['info:list:delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>

            <router-link
              v-permission="['info:comment:select']"
              :to="{ name: 'CommentDetails', params: { id: scope.row.id }, query: { title: scope.row.title, firstCategoryName: scope.row.mainCategoryName, secondCategoryName: scope.row.suCategoryName } }"
            >
              <el-button
                size="mini"
                type="primary"
              >查看评论</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="btn">
      <el-button v-permission="['info:list:auth']" type="info" @click="underData">下架</el-button>
      <el-button v-permission="['info:list:delete']" type="danger" @click="deletelittleData">删除</el-button>
    </div> -->
    <el-row :gutter="20">
      <el-col
        :span="12"
        :offset="6"
      >
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 新建弹窗 -->
    <el-dialog
      :visible.sync="isShowCreateNewsDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="新建资讯"
      width="1000px"
      append-to-body
    >
      <news-form
        v-if="isShowCreateNewsDialog"
        :form-data="createNewsForm"
        @save="handleCreateNews"
        @push="handlePushNews"
        @cancel="isShowCreateNewsDialog = false"
      ></news-form>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      :visible.sync="isShowEditNewsDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="编辑资讯"
      width="1000px"
      @close="onCloseEidtNewsDialog"
    >
      <news-form
        v-if="isShowEditNewsDialog"
        :form-data="editNewsForm"
        @save="handleEditNews"
        @push="handleEditAndPushNews"
        @cancel="isShowEditNewsDialog = false"
      ></news-form>
    </el-dialog>
  </div>
</template>

<script>
import NullImgFile from '@/assets/null.png';
import figureKeyframes from '@/components/figure-keyframes';
import Tinymce from '@/components/Tinymce';
import multiUploadImage from '@/components/Upload/multiImage';
import uploadSingle from '@/components/Upload/single';
import newsForm from './layout/newsForm';

import { formatDate } from '@/utils/index';
import {
  getFathertype,
  getChildtype,
  getNewsList,
  createdInformation,
  changeInformation,
  deleteInformation,
  underInformation,
  getclearList,
  getforbddenList,
  getAllNewsType,
  getNewsDetailsLockByEditId,
  unlockNewsById,
} from '@/api/news';

let tinymceId;
let editTinyceId;

export default {
  name: 'NewsList',
  components: {
    Tinymce,
    uploadSingle,
    multiUploadImage,
    figureKeyframes,
    newsForm,
  },
  data() {
    return {
      createNewsForm: null,
      editNewsForm: null,
      tiynewContent: '', // 新建数据咨询内容
      uploadVideo: 0, // 显示上传视频
      NullImgFile, // 静态图片
      newfeatureVideo: '',
      newfeatureImgs: [],
      newfeatureType: 0, // 新建动态资讯单选
      featureVideo: '',
      featureImgs: [],
      featureType: 0, // 编辑动态资讯单选
      tinymceContent: '',
      istrue: true,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = '';
            // console.log(maxDate);
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate !== '') {
            const day30 = (30 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day30;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            // console.log(new Date(), maxTime, Date.now());
            return time.getTime() > maxTime;
          }
          return time.getTime() > Date.now(); // 禁用未来的时间
        },
      },
      date: '',
      optiontype: [],
      optionsecond: [],
      dialogoptiontype: [],
      dialogoptionsecond: [],
      projectOption: [
        {
          text: '行家',
          value: 1,
        },
        {
          text: '子墨学院',
          value: 2,
        },
      ],
      optionstatus: [
        {
          valueStatus: '0',
          label: '未发布',
        },
        {
          valueStatus: '1',
          label: '已发布',
        },
        {
          valueStatus: '-1',
          label: '已下架',
        },
      ],
      populer: [
        {
          valueHot: 1,
          label: '是',
        },
        {
          valueHot: 0,
          label: '否',
        },
      ],
      valueHot: null,
      isFirstTimeNews: '',
      valueType: '',
      valueScond: '',
      valueStatus: '',
      dialogvalueType: '',
      dialogvalueScond: '',
      keywords: '',
      tableData: [],
      currentPage: 1,
      total: 10,
      pageSize: 20,
      isShowCreateNewsDialog: false,
      isShowEditNewsDialog: false,
      form: {
        productId: 1,
        title: '',
        number: '',
        author: '',
        imageUrl: '',
      },
      radioHome: '0',
      radioTop: '0',
      loadvideo: '',
      homePage: '',
      radix: '',
      rank: 0, // 首页排序编号
      editdialogVisible: false, // 编辑弹窗
      editform: {
        productId: '',
        editnum: '',
        editname: '',
        editnumber: '',
      },
      editradioHome: '0',
      editradioTop: '0',
      editimageUrl: '', // 上传图片
      editloadvideo: '',
      edithomePage: '',
      editradix: '',
      editrank: 0, // 首页排序编号
      editdialogID: 0, // 编辑列表ID
      editdialogoptiontype: [],
      editdialogoptionsecond: [],
      editdialogvalueScond: '',
      editdialogvalueType: '',
      multipleSelection: [],
      multipleID: [],
      newContent: '',
      editContent: '',
      filter: {
        sidx: 'inf.create_time',
        sort: 'desc',
      },
    };
  },
  created() {
    this.getList();
    this.getlistType();
    this.getNewsCategoryType();
  },
  beforeRouteLeave(to, from, next) {
    this.isShowCreateNewsDialog = false;
    this.isShowEditNewsDialog = false;
    next();
  },
  methods: {
    // 打开新建资讯窗口
    showCreateNewsDialog() {
      // 初始化表单
      this.createNewsForm = {
        projectType: 1, // 所属项目
        title: '', // 资讯标题
        mainCategoryId: '', // 一级类目id
        infCategoryId: '', // 资讯类目（二级）
        setTimeoutDateTime: new Date(), // 早报定时推送时间((一级类目name === 早报)时出现)
        author: '', // 作者
        isRecommend2NewNewsPC: 0, // 推荐到PC端最新资讯（0：否，1：是）
        recommend2NewNewsPCindex: '', // 推荐到PC端最新资讯 - 排序
        isRecommend2HotAPP: 0, // 推荐到app端热点置顶（0：否，1：是）
        baseReadNum: '', // 阅读基数
        coverArr: [], // 封面图（1，3张）
        newsVarCover: {
          // 资讯动态封面
          type: 0, //   [0：不设置，1：图片，2：视频]
          covers: [], //   图片组[url, url, ...]
          videoUrl: '', //   视频url
        },
        videoUrl: '', // 视频url
        isRecommend2hotPC: 0, // 推荐到PC端热点轮播（0：否，1：是）
        recommend2hotPCindex: '', // 推荐到PC端热点轮播 - 排序
        baseZanNum: '', // 点赞基数
        isCheckComment: false, // 是否人工审核评论（0：否，1：是）
        content: '', // 资讯内容(html)
      };
      this.isShowCreateNewsDialog = true;
    },

    // api - [创建、修改]资讯
    async postCreateOrEditNews(data = {}) {
      const params = {
        authorName: data.author,
        basicLikeRemain: data.baseZanNum,
        basicViewerRemain: data.baseReadNum,
        content: data.content,
        coverImage: data.coverArr.map(i => encodeURIComponent(i)).join(','),
        mainCategoryId: data.mainCategoryId,
        suCategoryId: data.infCategoryId,
        status: data.status || 0,
        title: data.title,
        productId: data.projectType,
        pcRecommendStatus: data.isRecommend2NewNewsPC,
        appTopStatus: data.isRecommend2HotAPP,
        pcCarouselStatus: data.isRecommend2hotPC,
        manualAuditStatus: 0,
        contentId: data.contentId || '',
      };

      if (data.id) params.id = data.id;

      // if (data.newsVarCover.type === 0) {
      //   params.dynamicType = 1;
      // } else if (data.newsVarCover.type === 1) {
      //   params.dynamicType = 2;
      //   params.dynamicImage = data.newsVarCover.covers
      //     .map(i => encodeURIComponent(i))
      //     .join(',');
      // } else if (data.newsVarCover.type === 2) {
      //   params.dynamicType = 3;
      //   params.dynamicVideo = data.newsVarCover.videoUrl;
      // }

      if (params.pcRecommendStatus === 1)
        params.rank = data.recommend2NewNewsPCindex;
      if (params.pcCarouselStatus === 1)
        params.popularOrder = data.recommend2hotPCindex;
      if (data.videoUrl) params.video = data.videoUrl;
      if (data.setTimeoutDateTime)
        params.morningNewspaperPushTimeStr = formatDate(
          data.setTimeoutDateTime,
          8
        );

      // 编辑
      if (params.id) {
        const res = await changeInformation(params);
        if (res.code !== 200) return Promise.reject(res.msg);
        this.$message.success('操作成功');
        return res;
      }

      // 新增
      const res = await createdInformation(params);
      if (res.code !== 200) return Promise.reject(res.msg);
      this.$message.success('操作成功');
      return res;
    },

    // 创建资讯
    handleCreateNews(formData = Object) {
      this.postCreateOrEditNews(
        Object.assign({}, formData, { status: 0 })
      ).then(() => {
        this.isShowCreateNewsDialog = false;
        this.getList();
      });
    },

    // 创建资讯并发布
    handlePushNews(formData = Object) {
      this.postCreateOrEditNews(
        Object.assign({}, formData, { status: 1 })
      ).then(() => {
        this.isShowCreateNewsDialog = false;
        this.getList();
      });
    },

    // 打开编辑资讯窗口
    showEditNewsDialog(row, index) {
      // 根据资讯id，获取资讯详情（如果被其他用户锁定，则可能报错）
      getNewsDetailsLockByEditId({ id: row.id }).then(res => {
        if (res.code !== 200) return false;
        const item = res.result || {};

        // 初始化
        const form = {
          id: '', // 编辑id
          projectType: 1, // 所属项目
          title: '', // 资讯标题
          mainCategoryId: '', // 一级类目id
          infCategoryId: '', // 资讯类目（二级）
          setTimeoutDateTime: new Date(), // 早报定时推送时间((一级类目name === 早报)时出现)
          author: '', // 作者
          isRecommend2NewNewsPC: Number(item.pcRecommendStatus), // 推荐到PC端最新资讯（0：否，1：是）
          recommend2NewNewsPCindex: '', // 推荐到PC端最新资讯 - 排序
          isRecommend2HotAPP: 0, // 推荐到app端热点置顶（0：否，1：是）
          baseReadNum: '', // 阅读基数
          coverArr: [], // 封面图（1，3张）
          newsVarCover: {
            // 资讯动态封面
            type: 0, //   [0：不设置，1：图片，2：视频]
            covers: [], //   图片组[url, url, ...]
            videoUrl: '', //   视频url
          },
          videoUrl: row.videoSrc, // 视频url
          isRecommend2hotPC: 0, // 推荐到PC端热点轮播（0：否，1：是）
          recommend2hotPCindex: '', // 推荐到PC端热点轮播 - 排序
          baseZanNum: '', // 点赞基数
          isCheckComment: 0, // 是否人工审核评论（0：否，1：是）
          content: '', // 资讯内容(html)
          contentId: item.contentId,
        };

        form.id = item.id;
        form.projectType = item.productId;
        form.title = item.title;
        form.mainCategoryId = item.mainCategoryId;
        form.infCategoryId = item.suCategoryId;
        if (item.morningNewspaperPushTime)
          form.setTimeoutDateTime = new Date(
            formatDate(item.morningNewspaperPushTime, 8)
          );
        form.author = item.authorName;
        form.recommend2NewNewsPCindex = Number(item.rank) || '';
        form.isRecommend2HotAPP = Number(item.appTopStatus);
        form.baseReadNum = Number(item.basicViewerRemain);
        form.coverArr = item.coverImage
          .split(',')
          .map(i => decodeURIComponent(i));
        // if (Number(item.dynamicType) === 2) form.newsVarCover.type = 1;
        // if (Number(item.dynamicType) === 3) form.newsVarCover.type = 2;
        // form.newsVarCover.covers = item.dynamicImage
        //   .split(',')
        //   .map(i => decodeURIComponent(i));
        // form.newsVarCover.videoUrl = item.dynamicVideo;
        form.videoUrl = item.video;
        form.isRecommend2hotPC = Number(item.pcCarouselStatus);
        form.recommend2hotPCindex = Number(item.popularOrder) || '';
        form.baseZanNum = Number(item.basicLikeRemain) || '';
        form.isCheckComment = Number(item.manualAuditStatus);
        form.content = item.content;

        this.editNewsForm = form;
        this.isShowEditNewsDialog = true;
      });
    },

    // 编辑资讯 - 关闭
    onCloseEidtNewsDialog() {
      if (this.editNewsForm.id) unlockNewsById(this.editNewsForm.id);
    },

    // 编辑资讯
    handleEditNews(formData = Object) {
      this.postCreateOrEditNews(
        Object.assign({}, formData, { status: 0 })
      ).then(() => {
        this.isShowEditNewsDialog = false;
        this.getList();
      });
    },

    // 编辑并保存资讯
    handleEditAndPushNews(formData = Object) {
      this.postCreateOrEditNews(
        Object.assign({}, formData, { status: 1 })
      ).then(() => {
        this.isShowEditNewsDialog = false;
        this.getList();
      });
    },

    timeFormat: formatDate, // 时间戳转化
    // 监听商品动态封面上传成功
    onMultiUploadSuccess(arr) {
      this.featureImgs = arr;
    },
    // 上传视频成功
    onSingleUploadVideoSuccess(url) {
      this.featureVideo = url;
    },
    // 新建监听商品动态封面上传成功
    newMultiUploadSuccess(arr) {
      this.newfeatureImgs = arr;
    },
    // 新建上传视频成功
    newSingleUploadVideoSuccess(url) {
      this.newfeatureVideo = url;
    },

    // 点击所属项目刷新等级类目
    getProjectType(item) {
      this.getlistType(item);
      this.dialogvalueType = '';
      this.dialogvalueScond = '';
      this.editdialogvalueType = '';
      this.editdialogvalueScond = '';
    },

    // 获取所有资讯类目
    getNewsCategoryType() {
      getAllNewsType().then(res => {
        this.optiontype = res.result.map(item => {
          return {
            // 顶部
            valueType: item.id,
            label: item.name,
          };
        });
      });
    },

    getlistType(productId = this.form.productId || this.editform.productId) {
      // 获取父类目
      getFathertype(productId).then(response => {
        this.dialogoptiontype =
          response.result.map(item => {
            return {
              // 新建
              dialogvalueType: item.id,
              label: item.name,
            };
          }) || [];
        // this.optiontype = response.result.map(item => {
        //   return {
        //     // 顶部
        //     valueType: item.id,
        //     label: item.name
        //   };
        // });
        this.editdialogoptiontype =
          response.result.map(item => {
            return {
              // 编辑
              editdialogvalueType: item.id,
              label: item.name,
            };
          }) || [];
      });
    },

    // 获取行家类目
    getHangjia(productId = 1) {
      // 获取父类目
      getFathertype(productId).then(response => {
        this.editdialogoptiontype =
          response.result.map(item => {
            return {
              // 编辑
              editdialogvalueType: item.id,
              label: item.name,
            };
          }) || [];
      });
    },

    // 获取子墨类目
    getZimo(productId = 2) {
      // 获取父类目
      getFathertype(productId).then(response => {
        this.editdialogoptiontype =
          response.result.map(item => {
            return {
              // 编辑
              editdialogvalueType: item.id,
              label: item.name,
            };
          }) || [];
      });
    },

    changeHandler(id) {
      // 二级联动-顶部
      console.log(id, '二级联动-顶部');
      this.valueScond = '';
      getChildtype({ id }).then(response => {
        console.log('3333333', response);
        this.optionsecond = response.result.map(item => {
          return {
            valueScond: item.id,
            label: item.name,
          };
        });
      });
    },
    newchangeHandler(id) {
      // 二级联动--新建
      console.log(id, 565656565656);
      this.dialogvalueScond = '';
      getChildtype({ id }).then(response => {
        console.log('3333333', response);
        this.dialogoptionsecond = response.result.map(item => {
          return {
            dialogvalueScond: item.id,
            label: item.name,
          };
        });
      });
    },
    editchangeHandler(id) {
      // 二级联动--编辑
      this.editdialogvalueScond = '';
      getChildtype({ id }).then(response => {
        console.log('edit232333', response);
        this.editdialogoptionsecond = response.result.map(item => {
          return {
            editdialogvalueScond: item.id,
            label: item.name,
          };
        });
        console.log(this.editdialogoptionsecond);
      });
    },
    handleSelectionChange(val) {
      // 批量处理
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    edithandleAvatarSuccess(res, file) {
      this.editimageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    Classifier() {
      // 类目管理
      this.$router.push({ name: 'NewsType' });
      this.editdialogVisible = false;
      this.newCancel();
    },
    handleEdit(index, row) {
      if (row.productId === 1) {
        this.getHangjia();
      } else {
        this.getZimo();
      }
      // 编辑的数据展示
      const params = {
        id: row.id,
      };
      getclearList(params).then(response => {
        // 判断动态封面的显示
        if (response.result.dynamicVideo) {
          this.featureType = 2;
        } else if (response.result.dynamicImage) {
          this.featureType = 1;
        } else {
          this.featureType = 0;
        }
        console.log(this.featureType, '选择哪个数据');

        this.editform.productId = response.result.productId;
        this.editimageUrl = response.result.coverImage;
        this.featureImgs =
          response.result.dynamicImage
            .split(';')
            .map(i => decodeURIComponent(i)) || null;
        this.featureVideo = response.result.dynamicVideo || null;
        this.editdialogID = response.result.id; // id字段
        this.editdialogvalueType = response.result.firstCategoryId;
        this.editchangeHandler(response.result.firstCategoryId);
        this.editdialogvalueScond = response.result.secondCategoryId; // 二级目录
        this.editform.editnum = response.result.title;
        this.tinymceContent = response.result.content;
        this.editform.editnumber = response.result.lastBasicViewerAccount; // 阅读基数
        this.editradix = response.result.lastBasicLikeAccount; // 点赞基数
        this.editform.editname = response.result.author; // 作者
        this.editradioTop = response.result.isTop === false ? '0' : '1';
        this.editradioHome = response.result.isPopular === false ? '0' : '1';
        if (this.editradioHome == 1) {
          this.editrank = 1;
        }
        this.edithomePage =
          response.result.popularOrder === 0
            ? null
            : response.result.popularOrder;
      });
      this.editdialogVisible = true;
      this.editdialogID = row.id;
    },
    handleDelete(index, row) {
      // 单个删除
      if (row.status === 1) {
        this.$message({
          message:
            '只能删除未发布和下架状态的资讯，请排查是否勾选了其他状态的资讯！',
          type: 'warning',
        });
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const newStr = row.id + '';
            const params = {
              newStr,
            };
            deleteInformation(params).then(response => {
              console.log(response);
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.getList();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
            this.getList();
          });
      }
    },
    deletelittleData() {
      // 多个删除
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要删除的资讯',
          type: 'warning',
        });
      } else {
        this.$confirm('确定要删除已选中的资讯吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const newArray = [];
            const newStatus = [];
            this.multipleSelection.forEach(val => {
              newArray.push(val.id);
              newStatus.push(val.status);
            });
            console.log(22222222222222222, newStatus);
            newStatus.forEach(val => {
              if (val === 1) {
                this.$message({
                  message:
                    '只能删除未发布和下架状态的资讯，请排查是否勾选了其他状态的资讯！',
                  type: 'warning',
                });
                this.getList();
              } else {
                const newStr = newArray.join();
                const params = {
                  newStr,
                };
                deleteInformation(params).then(response => {
                  console.log(response);
                });
                this.$message({
                  type: 'success',
                  message: '删除成功',
                });
                this.getList();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
            this.getList();
          });
      }
    },

    // 监听表格排序事件
    onTableSort({ column, prop, order }) {
      this.filter.sidx = column.columnKey;
      if (order === 'descending') this.filter.sort = 'desc';
      else if (order === 'ascending') this.filter.sort = 'asc';
      else this.filter.sort = '';
      this.getList();
    },

    getList() {
      // 列表数据
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keywords,
        startTime: this.date[0],
        endTime: this.date[1],
        mainCategoryId: this.valueType,
        suCategoryId: this.valueScond,
        status: this.valueStatus,
        pcCarouselStatus: this.valueHot,
        pcRecommendStatus: this.isFirstTimeNews,
        sidx: this.filter.sidx,
        order: this.filter.sort,
      };

      getNewsList(query).then(response => {
        this.tableData = response.result.list;
        this.total = response.result.totalCount;
      });
    },
    clearAll() {
      // 清空
      this.date = '';
      this.valueType = '';
      this.valueScond = '';
      this.valueStatus = '';
      this.keywords = '';
      this.valueHot = '';
      this.isFirstTimeNews = '';

      this.getList();
    },
    crawlData() {
      this.$router.push({ name: 'NewsCrawler' });
    },
    submit() {
      // 保存新建
      if (!this.form.productId) {
        this.$message({
          type: 'warning',
          message: '请选择所属项目',
        });
      } else if (!this.form.title) {
        this.$message({
          type: 'warning',
          message: '请输入资讯标题',
        });
      } else if (!this.dialogvalueType || !this.dialogvalueScond) {
        this.$message({
          type: 'warning',
          message: '请输入类目',
        });
      } else if (!this.form.author) {
        this.$message({
          type: 'warning',
          message: '请输入作者',
        });
      } else if (!this.form.imageUrl) {
        this.$message({
          type: 'warning',
          message: '请输入封面图',
        });
      } else if (!this.NewContent) {
        this.$message({
          type: 'warning',
          message: '请输入资讯内容',
        });
      } else if (!this.form.number) {
        this.$message({
          type: 'warning',
          message: '请输入阅读基数',
        });
      } else if (!this.radix) {
        this.$message({
          type: 'warning',
          message: '请输入点赞基数',
        });
      } else {
        this.featureImgs = this.newfeatureImgs
          .map(i => encodeURIComponent(i))
          .join(';');
        console.log(this.newContent);
        const params = {
          productId: this.form.productId,
          author: this.form.author,
          basicLikeRemain: Number(this.radix),
          basicViewerRemain: Number(this.form.number),
          content: this.newContent,
          coverImage: this.form.imageUrl,
          dynamicImage: this.newfeatureImgs
            .map(i => encodeURIComponent(i))
            .join(';'),
          dynamicVideo: this.newfeatureVideo,
          infCategoryId: this.dialogvalueScond,
          isPopular: this.radioTop,
          isTop: this.radioHome,
          popularOrder: this.homePage,
          status: 0,
          title: this.form.title,
          video: this.loadvideo,
        };
        createdInformation(params).then(response => {
          this.$message({
            message: '新建成功',
            type: 'success',
          });
          console.log(response);
          this.getList();
          // 新建初始化
          this.newCancel();
        });
      }
    },
    async submitIssue() {
      // 保存并发布
      if (!this.form.productId) {
        this.$message({
          type: 'warning',
          message: '请选择所属项目',
        });
      } else if (!this.form.title) {
        this.$message({
          type: 'warning',
          message: '请输入资讯标题',
        });
      } else if (!this.dialogvalueType || !this.dialogvalueScond) {
        this.$message({
          type: 'warning',
          message: '请输入类目',
        });
      } else if (!this.form.author) {
        this.$message({
          type: 'warning',
          message: '请输入作者',
        });
      } else if (!this.form.imageUrl) {
        this.$message({
          type: 'warning',
          message: '请输入封面图',
        });
      } else if (!this.NewContent || !this.newContent) {
        this.$message({
          type: 'warning',
          message: '请输入资讯内容',
        });
      } else if (!this.form.number) {
        this.$message({
          type: 'warning',
          message: '请输入阅读基数',
        });
      } else if (!this.radix) {
        this.$message({
          type: 'warning',
          message: '请输入点赞基数',
        });
      } else {
        this.featureImgs = this.newfeatureImgs
          .map(i => encodeURIComponent(i))
          .join(';');
        console.log(this.newContent, 'qian');

        const params = {
          productId: this.form.productId,
          author: this.form.author,
          basicLikeRemain: Number(this.radix),
          basicViewerRemain: Number(this.form.number),
          content: this.newContent,
          coverImage: this.form.imageUrl,
          dynamicImage: this.newfeatureImgs
            .map(i => encodeURIComponent(i))
            .join(';'),
          dynamicVideo: this.newfeatureVideo,
          infCategoryId: this.dialogvalueScond,
          isPopular: this.radioTop,
          isTop: this.radioHome,
          popularOrder: this.homePage,
          status: 1,
          title: this.form.title,
          video: this.loadvideo,
        };
        // 根据后台返回的数据判断是否存在敏感词
        this.tiynewContent = this.newContent;
        this.$nextTick(() => {
          window.tinymce.get(tinymceId).setContent(this.newContent);
        });
        const optionTitle = {
          text: this.form.title,
        };
        const res1 = await getforbddenList(optionTitle);
        if (res1.code !== 200) return Promise.reject();
        let data1 = res1.result.forbidden
          .concat(res1.result.invisible)
          .join(',');
        if (
          res1.result.forbidden.length != 0 ||
          res1.result.invisible.length != 0
        ) {
          this.$message({
            type: 'warning',
            message: `标题不能含有敏感词:${data1}`,
          });
          return Promise.reject();
        }

        const optionAuthor = {
          text: this.form.author,
        };
        const res2 = await getforbddenList(optionAuthor);
        if (res2.code !== 200) return Promise.reject();
        let data2 = res2.result.forbidden
          .concat(res2.result.invisible)
          .join(',');
        if (
          res2.result.forbidden.length != 0 ||
          res2.result.invisible.length != 0
        ) {
          this.$message({
            type: 'warning',
            message: `作者不能含有敏感词:${data2}`,
          });
          return Promise.reject();
        }

        const optionContent = {
          text: this.newContent,
        };
        const res3 = await getforbddenList(optionContent);
        if (res3.code !== 200) return Promise.reject();
        let data3 = res3.result.forbidden
          .concat(res3.result.invisible)
          .join(',');
        if (
          res3.result.forbidden.length != 0 ||
          res3.result.invisible.length != 0
        ) {
          this.$message({
            type: 'warning',
            message: `资讯内容不能含有敏感词:${data3}`,
          });
          return Promise.reject();
        }

        createdInformation(params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '发布成功',
              type: 'success',
            });
            console.log(response);
            this.getList();
            // 新建发布保存初始化
            this.newCancel();
          } else if (response.code === -1) {
            this.$message({
              message: '输入含有敏感词',
              type: 'warning',
            });
          }
        });
      }
    },
    newCancel() {
      // 取消新建
      this.form.productId = '';
      this.form.author = '';
      this.radix = '';
      this.form.number = '';
      this.form.imageUrl = '';
      this.newfeatureImgs = [];
      this.newfeatureVideo = '';
      this.dialogvalueScond = '';
      this.form.title = '';
      this.loadvideo = '';
      this.dialogvalueType = '';
      this.radioHome = '0';
      this.radioTop = '0';
      this.uploadVideo = '0';
      this.newfeatureType = 0;
      this.homePage = '';
      this.rank = 0;
      this.backHomepage();
      this.isShowCreateNewsDialog = false;
    },
    editCancel() {
      // 取消编辑
      this.editform.productId = '';
      this.editdialogVisible = false;
      this.editform.editname = '';
      this.editform.editnumber = '';
      this.editimageUrl = '';
      this.editradioTop = '0';
      this.featureType = 0;
      this.featureImgs = [];
      this.featureVideo = '';
      this.uploadVideo = 0;
      this.editloadvideo = '';
      this.editrank = 0;
      this.editradioHome = '0';
      this.edithomePage = '';
      this.editradix = '';
    },
    editSubmit() {
      if (!this.editform.productId) {
        this.$message.error('请选择所属项目！');
      } else {
        // 保存编辑
        const params = {
          productId: this.editform.productId,
          author: this.editform.editname,
          basicLikeRemain: Number(this.editradix),
          basicViewerRemain: Number(this.editform.editnumber),
          content: this.editContent,
          coverImage: this.editimageUrl,
          dynamicImage: this.featureImgs
            .map(i => encodeURIComponent(i))
            .join(';'),
          dynamicVideo: this.featureVideo,
          id: this.editdialogID,
          infCategoryId: this.editdialogvalueScond,
          isPopular: this.editradioHome,
          isTop: this.editradioTop,
          popularOrder: Number(this.edithomePage),
          status: 0,
          title: this.editform.editnum,
          video: this.editloadvideo,
        };
        changeInformation(params).then(response => {
          this.$message({
            message: '编辑成功',
            type: 'success',
          });
          this.editCancel();
          this.getList();
          console.log(response);
        });
      }
    },
    async editSubmitissue() {
      if (!this.editform.productId) {
        this.$message.error('请选择所属项目！');
      } else {
        // 保存编辑并发布
        const params = {
          productId: this.editform.productId,
          author: this.editform.editname,
          basicLikeRemain: Number(this.editradix),
          basicViewerRemain: Number(this.editform.editnumber),
          content: this.editContent,
          coverImage: this.editimageUrl,
          dynamicImage: this.featureImgs
            .map(i => encodeURIComponent(i))
            .join(';'),
          dynamicVideo: this.featureVideo,
          id: this.editdialogID,
          infCategoryId: this.editdialogvalueScond,
          isPopular: this.editradioHome,
          isTop: this.editradioTop,
          popularOrder: Number(this.edithomePage),
          status: 1,
          title: this.editform.editnum,
          video: this.editloadvideo,
        };
        const optionTitle = {
          text: this.editform.editnum,
        };
        const res1 = await getforbddenList(optionTitle);
        if (res1.code !== 200) return Promise.reject();
        if (
          res1.result.forbidden.length != 0 ||
          res1.result.invisible.length != 0
        ) {
          let data1 = res1.result.forbidden
            .concat(res1.result.invisible)
            .join(',');
          this.$message({
            type: 'warning',
            message: `标题不能含有敏感词:${data1}`,
          });
          return Promise.reject();
        }

        const optionAuthor = {
          text: this.editform.editname,
        };
        const res2 = await getforbddenList(optionAuthor);
        if (res2.code !== 200) return Promise.reject();
        if (
          res2.result.forbidden.length != 0 ||
          res2.result.invisible.length != 0
        ) {
          let data2 = res2.result.forbidden
            .concat(res2.result.invisible)
            .join(',');
          this.$message({
            type: 'warning',
            message: `作者不能含有敏感词:${data2}`,
          });
          return Promise.reject();
        }

        const optionContent = {
          text: this.editContent || this.tinymceContent,
        };
        const res3 = await getforbddenList(optionContent);
        if (res3.code !== 200) return Promise.reject();
        let data3 = res3.result.forbidden
          .concat(res3.result.invisible)
          .join(',');
        if (
          res3.result.forbidden.length != 0 ||
          res3.result.invisible.length != 0
        ) {
          this.$message({
            type: 'warning',
            message: `资讯内容不能含有敏感词:${data3}`,
          });
          return Promise.reject();
        }
        if (!this.editContent || !this.tinymceContent) {
          this.$message({
            type: 'warning',
            message: '资讯内容不能为空',
          });
        } else {
          changeInformation(params).then(response => {
            this.editCancel();
            this.$message({
              message: '发布成功',
              type: 'success',
            });
            this.editCancel();
            this.getList();
          });
        }
      }
    },
    underData() {
      // 下架(包括批量下架)
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要下架的资讯',
          type: 'warning',
        });
      } else {
        this.$confirm('确定要下架已选中的资讯吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const newArray = [];
            this.multipleSelection.forEach(val => {
              newArray.push(val.id);
            });
            const ids = newArray.join();
            console.log(ids, '点击下架是的');
            const params = {
              ids,
            };
            underInformation(params).then(response => {
              this.$message({
                message: '下架成功',
                type: 'success',
              });
              console.log(response);
              this.getList();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下架',
            });
          });
      }
    },
    editorContent(data) {
      this.editContent = data;
      console.log(data, '编辑页面的数据'); // 把用户输入的内容输出
    },
    NewContent(data) {
      this.newContent = data; // 传值到编辑器展示内容
      console.log(data, '传值到编辑器展示内容');
    },
    onSingleUploadSuccess(url) {
      // 商品封面回调
      this.form.imageUrl = url;
    },
    editSingleUploadSuccess(url) {
      // 商品封面回调2
      this.editimageUrl = url;
    },
    UploadVideoSuccessfile(url) {
      // 上传编辑资讯视频
      this.editloadvideo = url;
    },
    NewuploadVideoSuccessfile(url) {
      // 上传的新建资讯视频
      this.loadvideo = url;
    },
    goHomepage() {
      this.rank = 1;
    },
    backHomepage() {
      this.rank = 0;
      this.homePage = '';
    },
    goEditHomepage() {
      this.editrank = 1;
    },
    backEditHomepage() {
      this.editrank = 0;
      this.edithomePage = '';
    },
    handleClose() {
      // 回调弹窗消失
      this.newCancel();
    },
    edithandleClose() {
      this.editCancel();
    },
    // 编辑器初始化完成
    onTinymceInit(id) {
      tinymceId = id;
    },
    editTinymceInit(id) {
      editTinyceId = id;
    },
  },
};
</script>

<style lang="less" scoped>
.content-container {
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
  .listHead {
    margin-bottom: 20px;
    .float_ {
      float: right;
    }
  }
  .btn {
    margin-bottom: 20px;
  }
  .el-table {
    margin-bottom: 20px;
    .images {
      width: 50px;
      height: 50px;
    }
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      max-height: 42px;
    }
    .courseFrom {
      .Information {
        .el-select {
          float: left;
        }
        .el-button {
          float: right;
        }
      }
      .courseName {
        width: 20px;
      }
    }
  }
}
</style>
