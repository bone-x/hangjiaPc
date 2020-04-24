<template>
  <section class="layout-news-form">
    <el-form ref="form" :rules="formRules" :model="form" label-width="180px" class="courseFrom">
      <el-form-item label="所属项目：" prop="projectType">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="form.projectType" style="width: 100%;" placeholder="请选择所属项目">
              <el-option :value="1" label="行家"></el-option>
              <el-option :value="2" label="子墨学院"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="资讯标题：" prop="title">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.title" clearable placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="资讯类目：" prop="infCategoryId">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="state.selectedMainCategoryIndex" placeholder="请选择">
              <el-option
                v-for="(item, index) in newsCategory"
                :key="item.id"
                :label="item.name"
                :value="index"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-select v-model="form.infCategoryId" :disabled="isDisableInfCategory" placeholder="请选择">
              <el-option
                v-for="item in subCategorys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="3">
            <router-link :to="{ name: 'NewsType' }">
              <el-button type="info">类目管理</el-button>
            </router-link>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item v-if="state.selectedMainCategoryName === '早报'" label="早报定时推送时间：" prop="setTimeoutDateTime">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker
              v-model="form.setTimeoutDateTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="作者：" prop="author">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.author" clearable placeholder="默认发布作者名称" style="width:100%;"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="推荐到PC端最新资讯：" prop="isRecommend2NewNewsPC">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-radio v-model="form.isRecommend2NewNewsPC" :label="1">是</el-radio>
            <el-radio v-model="form.isRecommend2NewNewsPC" :label="0">否</el-radio>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item v-show="form.isRecommend2NewNewsPC === 1" label="最新资讯排序：" prop="recommend2NewNewsPCindex">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="form.recommend2NewNewsPCindex"
              type="number"
              placeholder="最新资讯排序"
              style="width: 100%;"
              clearable
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="推荐到app端热点置顶：" prop="isRecommend2HotAPP">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="form.isRecommend2HotAPP" :label="1">是</el-radio>
            <el-radio v-model="form.isRecommend2HotAPP" :label="0">否</el-radio>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="阅读基数：" prop="baseReadNum">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="form.baseReadNum"
              type="number"
              placeholder="请输入阅读基数"
              style="width:100%;"
              clearable
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="上传封面图：" prop="coverArr">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-row :gutter="20">
              <el-col :span="24">
                <multi-upload-image
                  :files="form.coverArr"
                  :max-file-size="2"
                  :limit="3"
                  @successCBK="handleSelectedCover"
                >
                  <el-button icon="el-icon-upload" size="medium">选择图片</el-button>
                </multi-upload-image>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="24">
                <img v-if="!form.coverArr.length" :src="NullImgFile" class="cover-img" />
                <img
                  v-for="(url, index) in form.coverArr"
                  :key="index"
                  :src="url"
                  class="cover-img"
                  alt="封面图"
                />
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="11">
            <el-row :gutter="20" style="color: red;">推荐：图片分辨率798 * 450</el-row>
            <el-row :gutter="20" style="line-height: 1.5;">
              注意：1.暂只支持上传JPG PNG格式图片，不超过2M
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.只能放1张或3张图片
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- <el-form-item label="资讯动态封面：" prop="newsVarCover.type">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-radio-group v-model="form.newsVarCover.type">
              <el-radio :label="0">不设置</el-radio>
              <el-radio :label="1">图片</el-radio>
              <el-radio :label="2">视频</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row
          v-show="form.newsVarCover.type == 1"
          type="flex"
          align="middle"
          style="margin-top: 20px; margin-left: 10px;"
        >
          <div style="position: relative; width: 300px; height: 180px; margin-left: 0;">
            <figure-keyframes
              :cover="form.newsVarCover.covers[0]"
              :keyframes="form.newsVarCover.covers"
            ></figure-keyframes>
          </div>
          <multi-upload-image :files="form.newsVarCover.covers" @successCBK="handleNewsVarCovers">
            <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传商品动态图片</el-button>
          </multi-upload-image>
        </el-row>

        <el-row
          v-show="form.newsVarCover.type == 2"
          :gutter="20"
          type="flex"
          align="middle"
          style="margin-top: 20px; margin-left: 10px;"
        >
          <video
            :src="form.newsVarCover.videoUrl"
            autoplay
            controls
            style="margin-left: 0; width: 300px; height: 180px;"
          ></video>
          <div style="margin-left: 40px;">
            <upload-single
              :accept="['video/mp4']"
              :max-file-size="5"
              @successCBK="handleGetNewsCoverVideoUrl"
            >
              <el-button icon="el-icon-upload" size="medium" style="margin-left: 10px;">上传商品动态视频</el-button>
            </upload-single>
            <div style="color: #777; font-size: 12px;">（ 文件格式为mp4，文件大小不超过5M ）</div>
          </div>
        </el-row>
      </el-form-item> -->

      <el-form-item label="上传视频：">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.videoUrl" clearable style="width: 100%" placeholder="请输入视频地址"></el-input>
          </el-col>

          <el-col :span="4">
            <el-button size="small" type="primary" @click="state.isUploadVideo = true">上传视频</el-button>
          </el-col>
        </el-row>

        <el-row
          v-show="form.videoUrl || state.isUploadVideo"
          :gutter="20"
          type="flex"
          align="middle"
          style="margin-top: 20px;"
        >
          <el-col :span="10" style="margin-left: 10px;">
            <video :src="form.videoUrl" autoplay controls width="100%"></video>
          </el-col>

          <el-col :span="8">
            <upload-single
              :accept="['video/mp4']"
              :max-file-size="10"
              @successCBK="handleGetUploadVideoUrl"
            >
              <el-button icon="el-icon-upload" size="medium" style="margin-left: 10px;">上传资讯视频</el-button>
            </upload-single>
            <div style="color: #777; font-size: 12px;">（ 文件格式为mp4，文件大小不超过10M ）</div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="推荐到PC端热点轮播：" prop="isRecommend2hotPC">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-radio v-model="form.isRecommend2hotPC" :label="1">是</el-radio>
            <el-radio v-model="form.isRecommend2hotPC" :label="0">否</el-radio>
          </el-col>

          <el-col v-if="form.isRecommend2hotPC === 1" :span="12">
            <span>轮播排序：</span>
            <el-input
              v-model="form.recommend2hotPCindex"
              type="number"
              placeholder="轮播排序"
              style="width: 200px; "
              clearable
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="点赞基数：" prop="baseZanNum">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.baseZanNum" clearable type="number" placeholder="请输入点赞基数" style="width:100%;"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- <el-form-item label="是否人工审核评论：" required>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-switch
              v-model="form.isCheckComment"
              active-color="#F56C6C"
              inactive-color="#909399"
            ></el-switch>
          </el-col>
        </el-row>
      </el-form-item> -->

      <el-form-item :required="!form.videoUrl" label="资讯内容：" prop="content">
        <el-row :gutter="20">
          <el-col :span="22">
            <Tinymce
              :max-file-size="2"
              :value="form.content"
              @input="getContent"
              @on-init="editTinymceInit"
            />
          </el-col>
        </el-row>
        
      </el-form-item>

      <el-form-item>
        <el-row type="flex" justify="center" style="margin-top: 30px;">
          <el-col :span="6">
            <el-button type="primary" @click="handleFormSave">{{ source === 'crawler' ? '创建资讯' : '保存' }}</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="success" @click="handleFormSaveAndPush">{{ source === 'crawler' ? '创建资讯并发布' : '保存并发布' }}</el-button>
          </el-col>
          <el-col :span="6">
            <el-button @click="handleFormCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import NullImgFile from '@/assets/null.png';
import figureKeyframes from '@/components/figure-keyframes';
import Tinymce from '@/components/Tinymce';
import multiUploadImage from '@/components/Upload/multiImage';
import uploadSingle from '@/components/Upload/single';

import {
  getFathertype,
  getChildtype,
  getforbddenList,
} from '@/api/news';

export default {
  name: 'LayoutNewsForm',
  components: {
    multiUploadImage,
    figureKeyframes,
    uploadSingle,
    Tinymce,
  },
  props: {
    formData: {
      type: Object,
      default() {
        return undefined;
      },
    },
    source: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      NullImgFile,
      form: {
        id: '',
        projectType: 1,
        title: '',
        mainCategoryId: '',
        infCategoryId: '',
        setTimeoutDateTime: new Date(),
        author: '',
        isRecommend2NewNewsPC: 0,
        recommend2NewNewsPCindex: '',
        isRecommend2HotAPP: 0,
        baseReadNum: '',
        coverArr: [],
        // newsVarCover: {
        //   type: 0,
        //   covers: [],
        //   videoUrl: '',
        // },
        videoUrl: '',
        isRecommend2hotPC: 0,
        recommend2hotPCindex: '',
        baseZanNum: '',
        isCheckComment: false,
        content: '',
      },
      formRules: {
        projectType: [{
          validator: (rule, value, callback) => {
            if (value === 1 || value === 2) {
              callback();
            } else {
              callback(new Error('请选择所属项目'));
            }
          },
          trigger: 'change',
          required: true,
        }],
        title: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!String(value).trim()) {
              callback(new Error('请输入资讯标题'));
            } else {
              getforbddenList({ text: value }).then(res => {
                if (res.code === 200) {
                  const { forbidden = [], invisible = [] } = res.result || {};
                  const tipsArr = [...forbidden, ...invisible];
                  if (tipsArr.length) {
                    callback(new Error(`包含敏感词：${tipsArr.join('，')}`));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }).catch(err => {
                callback();
                this.$message.error('服务器异常：敏感词检查服务不可用');
                console.error(err);
              });
            }
          },
          trigger: 'blur',
        }],
        infCategoryId: [{
          required: true,
          validator: (rule, value, callback) => {
            if (typeof this.state.selectedMainCategoryIndex !== 'number') {
              callback(new Error('请选择资讯类目'));
            } else {
              callback();
            }
          },
          trigger: 'change',
        }],
        setTimeoutDateTime: [{
          validator: (rule, value, callback) => {
            if (this.state.selectedMainCategoryName === '早报' && !value) {
              callback(new Error('请选择早报定时推送时间'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
          required: true,
        }],
        author: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!String(value).trim()) {
              callback(new Error('请输入作者名称'));
            } else {
              getforbddenList({ text: value }).then(res => {
                if (res.code === 200) {
                  const { forbidden = [], invisible = [] } = res.result || {};
                  const tipsArr = [...forbidden, ...invisible];
                  if (tipsArr.length) {
                    callback(new Error(`包含敏感词：${tipsArr.join('，')}`));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }).catch(err => {
                callback();
                this.$message.error('服务器异常：敏感词检查服务不可用');
                console.error(err);
              });
            }
          },
          trigger: 'change',
        }],
        isRecommend2NewNewsPC: [{
          validator: (rule, value, callback) => {
            if (value === 0 || value === 1) {
              callback();
            } else {
              callback(new Error('请选择是否推荐到PC端最新资讯'));
            }
          },
          trigger: 'change',
          required: true,
        }],
        recommend2NewNewsPCindex: [{
          validator: (rule, value, callback) => {
            if (this.form.isRecommend2NewNewsPC === 1 && Number(value) <= 0) {
              callback(new Error('请正确设置最新资讯排序（大于0）'));
            } else {
              callback();
            }
          },
          trigger: 'change',
          required: true,
        }],
        isRecommend2HotAPP: [{
          validator: (rule, value, callback) => {
            if (value === 0 || value === 1) {
              callback();
            } else {
              callback(new Error('请选择推荐到app端热点置顶'));
            }
          },
          trigger: 'change',
          required: true,
        }],
        baseReadNum: [{
          validator: (rule, value, callback) => {
            if (Number(value) <= 0) {
              callback(new Error('请正确输入阅读基数（大于0）'));
            } else {
              callback();
            }
          },
          trigger: 'change',
          required: true,
        }],
        coverArr: [{
          validator: (rule, value, callback) => {
            if (!value.length) {
              callback(new Error('请上传封面图'));
            } else if (value.length === 1 || value.length === 3) {
              callback();
            } else {
              callback(new Error('只能放1张或3张图片'));
            }
          },
          trigger: 'change',
          required: true,
        }],
        // 'newsVarCover.type': [{
        //   validator: (rule, value, callback) => {
        //     if (value === 1 && !this.form.newsVarCover.covers.length) {
        //       callback(new Error('请选择资讯动态封面 - 图片'));
        //     } else if (value === 2 && !this.form.newsVarCover.videoUrl) {
        //       callback(new Error('请选择资讯动态封面 - 视频'));
        //     } else {
        //       callback();
        //     }
        //   },
        //   trigger: 'change',
        // }],
        isRecommend2hotPC: [{
          validator: (rule, value, callback) => {
            if (value === 1 && Number(this.form.recommend2hotPCindex) <= 0) {
              callback(new Error('请正确设置轮播排序（大于0）'));
            } else {
              callback();
            }
          },
          trigger: 'change',
          required: true,
        }],
        baseZanNum: [{
          validator: (rule, value, callback) => {
            if (Number(value) <= 0) {
              callback(new Error('请正确输入点赞基数（大于0）'));
            } else if (Number(value) > (Number(this.form.baseReadNum || 0))) {
              callback(new Error('不能大于阅读基数'));
            } else {
              callback();
            }
          },
          trigger: 'change',
          required: true,
        }],
        content: [{
          validator: (rule, value, callback) => {
            if (!String(value).trim()) {
              if (this.form.videoUrl) {
                callback();
              } else {
                callback(new Error('请输入资讯内容'));
              }
            } else {
              getforbddenList({ text: value }).then(res => {
                if (res.code === 200) {
                  const { forbidden = [], invisible = [] } = res.result || {};
                  const tipsArr = [...forbidden, ...invisible];
                  if (tipsArr.length) {
                    callback(new Error(`包含敏感词：${tipsArr.join('，')}`));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }).catch(err => {
                callback();
                this.$message.error('服务器异常：敏感词检查服务不可用');
                console.error(err);
              });
            }
          },
          trigger: 'change',
        }],
      },
      state: {
        selectedMainCategoryIndex: '',
        selectedMainCategoryName: '',
        isUploadVideo: false,
      },
      newsCategory: [],
      subCategorys: [],
    };
  },
  computed: {
    isDisableInfCategory() {
      let temp = false;
      if (typeof this.state.selectedMainCategoryIndex === 'number') {
        if (this.newsCategory[this.state.selectedMainCategoryIndex]) {
          const name = this.newsCategory[this.state.selectedMainCategoryIndex].name;
          if (name === '热点' || name === '大事' || name === '早报') {
            temp = true;
          }
        }
      }
      return temp;
    }
  },
  watch: {
    'form.coverArr': function (newVal) {
      this.$refs.form.validateField(['coverArr']);
    },
    // 'form.infCategoryId': function (newVal) {
    //   this.$refs.form.validateField(['infCategoryId']);
    // },
    // 'form.newsVarCover.covers': function (newVal) {
    //   this.$refs.form.validateField(['newsVarCover.type']);
    // },
    // 'form.newsVarCover.videoUrl': function (newVal) {
    //   this.$refs.form.validateField(['newsVarCover.type']);
    // },
    'form.projectType': function (newVal) {
      this.state.selectedMainCategoryIndex = '';
      // 重置资讯类目
      getFathertype(newVal).then(({ result = [] }) => {
        let newsCategory = [];
        if (this.source === 'crawler') {
          result.forEach(i => {
            if (String(i.name).trim() !== '早报') {
              newsCategory.push(i);
            }
          });
        } else {
          newsCategory = result;
        }
        this.newsCategory = newsCategory;
      });
    },
    'state.selectedMainCategoryIndex': function (newVal) {
      this.subCategorys = [];
      if (typeof newVal !== 'number' || this.newsCategory.length <= 0) return false;
      // 获取二级类目
      const id = this.newsCategory[newVal].id;
      if (!id) return false;
      this.form.mainCategoryId = id;
      // this.form.infCategoryId = '';

      this.state.selectedMainCategoryName = String(
        this.newsCategory[newVal].name
      ).trim();

      getChildtype({ id }).then(({ result = [] }) => {
        this.subCategorys = result;
        const exitId = this.subCategorys.some(i => i.id === this.form.infCategoryId);
        if (!exitId) this.form.infCategoryId = '';
      });
    },
    'form.isRecommend2NewNewsPC': function (newVal) {
      this.$refs.form.validateField(['isRecommend2NewNewsPC']);
      if (newVal === 1) {
        this.$refs.form.validateField(['recommend2NewNewsPCindex']);
      }
    },
    'form.isRecommend2HotAPP': function () {
      this.$refs.form.validateField(['isRecommend2HotAPP']);
    },
    'form.isRecommend2hotPC': function () {
      this.$refs.form.validateField(['isRecommend2hotPC']);
    },
    'form.recommend2hotPCindex': function (newVal) {
      this.$refs.form.validateField(['isRecommend2hotPC']);
    }
  },

  mounted() {
    this.initData(this.formData);

    // 重置资讯类目
    getFathertype(this.form.projectType).then(({ result = [] }) => {
      let newsCategory = [];
      if (this.source === 'crawler') {
        result.forEach(i => {
          if (String(i.name).trim() !== '早报') {
            newsCategory.push(i);
          }
        });
      } else {
        newsCategory = result;
      }
      this.newsCategory = newsCategory;

      this.newsCategory.some((i, index) => {
        if (!this.form.mainCategoryId) return true;
        if (i.id === this.form.mainCategoryId) {
          this.state.selectedMainCategoryIndex = index;
          return true;
        }
        return false;
      });
    });

    this.$nextTick(() => {
      this.$refs.form.validate();
    });
  },
  methods: {
    initData(data = {}) {
      const defaultData = {
        id: '',                                   // 编辑id
        projectType: 1,                           // 所属项目 
        title: '',                                // 资讯标题
        mainCategoryId: '',                       // 资讯类目（一级）
        infCategoryId: '',                        // 资讯类目（二级）
        setTimeoutDateTime: new Date(),           // 早报定时推送时间((一级类目name === 早报)时出现)
        author: '',                               // 作者
        isRecommend2NewNewsPC: 0,                 // 推荐到PC端最新资讯（0：否，1：是）
        recommend2NewNewsPCindex: '',             // 推荐到PC端最新资讯 - 排序
        isRecommend2HotAPP: 0,                    // 推荐到app端热点置顶（0：否，1：是）
        baseReadNum: '',                          // 阅读基数
        coverArr: [],                             // 封面图（1，3张）
        // newsVarCover: {                           // 资讯动态封面
        //   type: 0,                                //   [0：不设置，1：图片，2：视频]
        //   covers: [],                             //   图片组[url, url, ...]
        //   videoUrl: '',                           //   视频url
        // },
        videoUrl: '',                             // 视频url
        isRecommend2hotPC: 0,                     // 推荐到PC端热点轮播（0：否，1：是）
        recommend2hotPCindex: '',                 // 推荐到PC端热点轮播 - 排序
        baseZanNum: '',                           // 点赞基数
        isCheckComment: false,                    // 是否人工审核评论（0：否，1：是）
        content: '',                              // 资讯内容(html)
        contentId: '',
      };

      this.form = Object.assign({}, defaultData, data);
    },
    editTinymceInit(id) {
      // 富文本id
      this.tinymceId = id;
    },
    getContent(data) {
      this.form.content = data;
    },
    handleSelectedCover(urls = []) {
      this.form.coverArr = urls;
    },
    handleNewsVarCovers(urls = []) {
      this.form.newsVarCover.covers = urls;
    },
    handleGetNewsCoverVideoUrl(url = '') {
      this.form.newsVarCover.videoUrl = url;
    },
    handleGetUploadVideoUrl(url = '') {
      this.form.videoUrl = url;
    },
    handleFormSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('save', { ...this.form });
        } else {
          this.$message.error('您输入的信息有误，请检查输入');
        }
      });
    },
    handleFormSaveAndPush() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('push', { ...this.form });
        } else {
          this.$message.error('您输入的信息有误，请检查输入');
        }
      });
    },
    handleFormCancel() {
      this.$emit('cancel', { ...this.form });
    },
  },
};
</script>

<style lang="less" scoped>
.layout-news-form {
  .cover-img {
    display: inline-block;
    width: 100px;
    max-height: 100px;
    margin-right: 20px;
  }
  /deep/ .el-form-item__error {
    padding-left: 10px;
  }
}
</style>
