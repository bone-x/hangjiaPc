<template>
  <div class="news-newsCover">
    <!-- APP热门资讯封面 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select
          v-model="formData.issueStatus"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="timeLimit"
          :default-time="['10:00:00']"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
        ></el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          plain
          @click.native="onSearch"
        >查询</el-button>
      </el-col>
      <el-col :span="3">
        <el-button
          type="danger"
          @click.native="clearAll"
        >清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          v-permission='["info:image:save"]'
          type="primary"
          @click.native="addCover(centerDialogVisible = true)"
        >新建封面图</el-button>
      </el-col>
    </el-row>
    <div class="table">
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="newsCoverList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="类别id"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="imageSrc"
          label="预览图"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <img
              v-if="scope.row.imageSrc"
              :src="scope.row.imageSrc"
              alt=""
              class="picture"
            >
            <img
              v-else
              :src="defaultPic"
              class="picture"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="issueStatus"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.issueStatus === 1">
              未上架
            </span>
            <span v-if="scope.row.issueStatus === 2">
              已下架
            </span>
            <span v-if="scope.row.issueStatus === 3">
              已上架
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="issueTime"
          label="上架时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.issueTime">
              {{changeDateTime(scope.row.issueTime)}}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="modifyTime"
          label="修改时间"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyName"
          label="修改人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="publisher"
          label="发布人"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-permission='["info:image:update"]'
              :disabled="scope.row.issueStatus === 2"
              type="primary"
              plain
              size="mini"
              @click.native="editCoverDetail(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission='["info:image:off"]'
              :disabled="scope.row.issueStatus === 2"
              type="danger"
              size="mini"
              @click.native="unsale(scope.row.id)"
            >
              下架
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
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="新建封面图"
      width="800px"
      center
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        size="small"
        label-position="left"
        label-width="100px"
        style="margin-top: 30px;"
      >
        <el-form-item
          label="上传封面图"
          prop="imageSrc"
        >
          <div class="slideImg">
            <div>
              <upload-single :max-file-size="2" @successCBK="onSingleUploadSuccess">
                <div class="chooseBtn">
                  <el-button
                    icon="el-icon-upload"
                    size="medium"
                  >选择图片</el-button>
                </div>
              </upload-single>
              <div>
                <img
                  v-if="ruleForm.imageSrc"
                  :src="ruleForm.imageSrc"
                  style="width:150px;height:90px;display:inline-block"
                />
                <img
                  v-else
                  :src="NullImgFile"
                  style="width: 150px; height: 90px;"
                />
              </div>
            </div>
            <div class="atention">
              <p style="margin: 0px">图片大小 750*340</p>
              <p>*注意：1.暂只支持上传JPG PNG格式图片，不超过2M </p>
              <p style="margin-left: 49px">2.只能放1张</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="上架时间"
          prop="issueTime"
        >
          <el-date-picker
            v-model="ruleForm.issueTime"
            type="datetime"
            placeholder="请选择时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="timeRange"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="centerDialogVisibleEdit"
      title="编辑封面图"
      width="800px"
      center
    >
      <el-form
        :model="ruleFormEdit"
        :rules="rules"
        ref="ruleFormEdit"
        size="small"
        label-position="left"
        label-width="100px"
        style="margin-top: 30px;"
      >
        <el-form-item
          label="上传封面图"
          prop="imageSrc"
        >
          <div class="slideImg">
            <div>
              <upload-single :max-file-size="2" @successCBK="onSingleUploadSuccessEdit">
                <div class="chooseBtn">
                  <el-button
                    icon="el-icon-upload"
                    size="medium"
                  >选择图片</el-button>
                </div>
              </upload-single>
              <div>
                <img
                  v-if="ruleFormEdit.imageSrc"
                  :src="ruleFormEdit.imageSrc"
                  style="width:150px;height:90px;display:inline-block"
                />
                <img
                  v-else
                  :src="NullImgFile"
                  style="width: 150px; height: 90px;"
                />
              </div>
            </div>
            <div class="atention">
              <p style="margin: 0px">图片大小 750*340</p>
              <p>*注意：1.暂只支持上传JPG PNG格式图片，不超过2M </p>
              <p style="margin-left: 49px">2.只能放1张</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="上架时间"
          prop="issueTime"
        >
          <el-date-picker
            v-model="ruleFormEdit.issueTime"
            type="datetime"
            placeholder="请选择时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="timeRangeEdit"
          >
          </el-date-picker>

        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisibleEdit = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFormEdit('ruleFormEdit')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAppCoverList,
  addAppCover,
  updateAppCover,
  saleOutAppCover,
} from '@/api/news';
import uploadSingle from '@/components/Upload/single';
import NullImgFile from '@/assets/null.png';

export default {
  name: 'HotNewsCover',
  components: {
    uploadSingle,
  },
  data() {
    return {
      NullImgFile,
      centerDialogVisible: false,
      centerDialogVisibleEdit: false,
      defaultPic: require('@/assets/nopic.jpg'),
      timeLimit: [],
      totalPage: 20,
      totalCount: 20,
      formData: {
        issueStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
      },
      statusList: [
        {
          value: 1,
          label: '未上架',
        },
        {
          value: 2,
          label: '已下架',
        },
        {
          value: 3,
          label: '已上架',
        },
      ],
      newsCoverList: [],
      ruleForm: {
        imageSrc: '',
        issueTime: null,
      },
      rules: {
        imageSrc: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        issueTime: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
      },
      ruleFormEdit: {
        imageSrc: '',
        issueTime: '',
        id: '',
      },
      nowDate: '',
      selectDate: '',
    };
  },
  created() {
    this.getCoverList();
  },
  methods: {
    // 截取时间
    changeDateTime(item) {
      return item.slice(0, 16);
    },

    getSelectTime(time) {
      if (!this.timeLimit) {
        this.formData.startTime = '';
        this.formData.endTime = '';
      } else {
        return this.timeLimit;
      }
    },

    timeRange(timer) {
      const now = Date.parse(new Date());
      const selectTime = Date.parse(new Date(timer));
      if (selectTime < now) {
        this.$message.error('上架时间必须大于当前时间！请重新设置上架时间！');
        this.ruleForm.issueTime = '';
      } else {
        return this.ruleForm.issueTime;
      }
    },

    // 新建封面提交
    submitForm(ruleForm) {
      const now = Date.parse(new Date());
      const selectTime = Date.parse(new Date(this.ruleForm.issueTime));
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (selectTime < now) {
            this.$message.error(
              '上架时间必须大于当前时间！请重新设置上架时间！'
            );
            this.ruleForm.issueTime = '';
          } else {
            addAppCover(this.ruleForm).then(res => {
              this.$message.success('提交成功！');
              this.centerDialogVisible = false;
              this.getCoverList();
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 重置新建表单
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },

    // 编辑选择时间
    timeRangeEdit(time) {
      const now = Date.parse(new Date());
      const selectTime = Date.parse(new Date(time));
      if (selectTime < now) {
        this.$message.error('上架时间必须大于当前时间！请重新设置上架时间！');
        this.ruleFormEdit.issueTime = '';
      } else {
        return this.ruleFormEdit.issueTime;
      }
    },

    // 编辑封面提交
    submitFormEdit(ruleFormEdit) {
      const now = Date.parse(new Date());
      const selectTime = Date.parse(new Date(this.ruleFormEdit.issueTime));
      this.$refs[ruleFormEdit].validate(valid => {
        if (valid) {
          if (selectTime < now) {
            this.ruleFormEdit.issueTime = '';
            this.$message.error(
              '上架时间必须大于当前时间！请重新设置上架时间！'
            );
          } else {
            updateAppCover(this.ruleFormEdit).then(res => {
              this.$message.success('修改成功！');
              this.centerDialogVisibleEdit = false;
              this.getCoverList();
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 重置编辑表单
    resetFormEdit(ruleFormEdit) {
      this.$refs[ruleFormEdit].resetFields();
    },

    // 获取封面列表
    getCoverList() {
      if (this.timeLimit) {
        this.formData.startTime = this.timeLimit[0];
        this.formData.endTime = this.timeLimit[1];
      }
      getAppCoverList(this.formData).then(res => {
        this.newsCoverList = res.result.list;
        this.totalPage = res.result.totalPage;
        this.totalCount = res.result.totalCount;
      });
    },

    // 查询
    onSearch() {
      this.getCoverList();
    },

    // 清空
    clearAll() {
      this.formData.issueStatus = '';
      this.timeLimit = '';
      this.formData.startTime = '';
      this.formData.endTime = '';
      this.getCoverList();
    },

    // 新建封面图
    addCover() {
      this.ruleForm.imageSrc = '';
      this.ruleForm.issueTime = '';
    },

    // 上传图片 -> 新建
    onSingleUploadSuccess(url) {
      this.ruleForm.imageSrc = url;
    },

    // 上传图片 -> 编辑
    onSingleUploadSuccessEdit(url) {
      this.ruleFormEdit.imageSrc = url;
    },

    // 编辑
    editCoverDetail(item) {
      this.centerDialogVisibleEdit = true;
      this.ruleFormEdit.imageSrc = item.imageSrc;
      this.ruleFormEdit.issueTime = item.issueTime;
      this.ruleFormEdit.id = item.id;
    },

    // 下架
    unsale(id) {
      const data = {
        id: id,
      };
      saleOutAppCover(data)
        .then(res => {
          this.$message.success('操作成功！');
          this.getCoverList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 分页
    handleSizeChange(val) {
      this.formData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.formData.pageNum = val;
      this.getCoverList();
    },
  },
};
</script>
<style lang="less">
// .newsCover {
.el-button--text {
  span {
    display: none !important;
  }
}
// }
</style>
<style lang="less" scoped>
.news-newsCover {
  padding: 40px;
  .check {
    margin-right: 50px;
  }
  .table {
    margin: 45px 0px;
    .picture {
      width: 100%;
      height: 100%;
    }
  }
  .slideImg {
    display: flex;
    margin-bottom: 20px;
    .atention {
      width: 55%;
      margin-left: 40px;
    }
    .chooseBtn {
      margin-bottom: 15px;
    }
  }
}
</style>