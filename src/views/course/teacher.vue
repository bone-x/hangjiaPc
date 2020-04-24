<template>
  <div class="course-teacher-container">
    <!-- 课程管理 - 讲师库管理 -->
    <div class="teacherData">
      <el-row>
        <el-col :span="4">
          <el-input
            v-model="searchData.lecturerName"
            placeholder="请输入讲师名称"
            style="width:200px"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click.native="searchLecturers"
          >查询</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="danger"
            @click.native="clearbtn"
          >清空</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            v-permission="['course:teacher:save']"
            type="primary"
            @click.native="addLectures"
          >添加讲师</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        :data="teacherData"
        :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
        style="width: 100%;margin-top: 40px"
        border
      >
        <el-table-column
          prop="lecturerId"
          label="讲师ID"
          width="180"
        ></el-table-column>
        <el-table-column
          label="讲师头像"
          width="120"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.pic"
              alt
              class="images"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="lecturerName"
          label="讲师名称"
          width="120"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="lecturerIntro"
          label="讲师简介"
          width="320"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
          <template slot-scope="scope">
            <span>{{ timeFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime">{{ timeFormat(scope.row.updateTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['course:teacher:update']"
              size="mini"
              type="primary"
              plain
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['course:teacher:delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.lecturerId)"
            >删除</el-button>
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
          :current-page.sync="searchData.pageNum"
          :page-size="searchData.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新建讲师弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="添加讲师"
      width="680px"
      left
    >
      <el-form
        :model="addLecturersParams"
        class="courseFrom"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="讲师名称">
              <el-input
                v-model="addLecturersParams.lecturerName"
                placeholder="请输入讲师名称"
                width="10%"
                maxlength="10"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="讲师头像">
              <div class="slideImg">
                <!-- 引用上传单张图片组件 -->
                <div>
                  <img
                    v-if="addLecturersParams.pic"
                    :src="addLecturersParams.pic"
                    style="width:100px;height:100px;display:inline-block"
                  />
                  <img
                    v-else
                    :src="NullImgFile"
                    style="width: 100px; height: 100px;"
                  />
                </div>
                <!-- on-progress -->
                <upload-single @successCBK="onSingleUploadSuccessAdd">
                  <el-button
                    icon="el-icon-upload"
                    size="medium"
                    style="margin-left: 40px;"
                  >上传图片</el-button>
                  <p style="color:8c939d;margin-left: 25px">(图片尺寸100*100)</p>
                </upload-single>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="讲师简介">
              <el-input
                v-model="addLecturersParams.lecturerIntro"
                type="textarea"
                maxlength="100"
                style="width:400px"
                placeholder="讲师简介，不得超过100个字"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="dialogCancelBtn">取 消</el-button>
        <el-button
          type="primary"
          @click.native="addTeacherBtn"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      title="编辑讲师信息"
      width="30%"
    >
      <el-form
        :model="editTeachers"
        label-width="80px"
        class="courseFrom"
      >
        <el-form-item label="讲师名称">
          <el-input
            v-model="editTeachers.lecturerName"
            placeholder="请输入讲师名称"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="讲师头像">
          <div class="slideImg">
            <!-- 引用上传单张图片组件 -->
            <div>
              <img
                v-if="editTeachers.pic"
                :src="editTeachers.pic"
                style="width:100px;height:100px;display:inline-block"
              />
              <img
                v-else
                :src="NullImgFile"
                style="width: 100px; height: 100px;"
              />
            </div>
            <!-- on-progress -->
            <upload-single @successCBK="onSingleUploadSuccessEdit">
              <el-button
                icon="el-icon-upload"
                size="medium"
                style="margin-left: 40px;"
              >上传图片</el-button>
              <p style="color:8c939d;margin-left: 25px">(图片尺寸100*100)</p>
            </upload-single>
          </div>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="editTeachers.lecturerIntro"
            type="textarea"
            maxlength="100"
            placeholder="讲师简介，不得超过100个字"
          ></el-input>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="editDialogCancelBtn">取 消</el-button>
        <el-button
          type="primary"
          @click.native="updateTeacherBtn"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLecturersList,
  deleteChosenLectures,
  addOneLeturers,
  updateLeturers,
} from '@/api/lecturers';
import { formatDate } from '@/utils/index';
import uploadSingle from '@/components/Upload/single';
import NullImgFile from '@/assets/null.png';

export default {
  name: 'CourseManageTeacher',
  components: {
    uploadSingle,
  },
  data() {
    return {
      NullImgFile,
      searchData: {
        lecturerName: '',
        lecturerIdList: '',
        pageNum: 1,
        pageSize: 10,
      },
      totalCount: 10,
      totalPage: 10,
      teacherData: [],
      addLecturersParams: {
        lecturerName: '',
        lecturerIntro: '',
        pic: '',
      },
      editDialogVisible: false,
      editTeachers: {
        lecturerId: '',
        lecturerName: '',
        lecturerIntro: '',
        pic: '',
      },
      dialogVisible: false,
      form: {
        num: '',
        desc: '',
      },
      imageUrl: '',
      multipleSelection: [],
      ids: [],
    };
  },
  created() {
    this.getlecturersData();
  },
  methods: {
    timeFormat: formatDate, // 时间戳转化

    // 获取列表数据
    getlecturersData() {
      getLecturersList(this.searchData).then(res => {
        this.teacherData = res.result.list;
        this.totalCount = Number(res.result.totalCount);
        this.totalPage = res.result.totalPage;
      });
    },

    // 查询
    searchLecturers() {
      this.getlecturersData();
    },

    // 点击添加讲师
    addLectures() {
      this.addLecturersParams.lecturerName = '';
      this.addLecturersParams.lecturerIntro = '';
      this.addLecturersParams.pic = '';
      this.dialogVisible = true;
    },

    // 新建点击上传
    onSingleUploadSuccessAdd(url) {
      this.addLecturersParams.pic = url;
    },

    // 删除
    handleDelete(id) {
      this.$confirm('确定要删除该讲师吗？', '删除讲师', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteChosenLectures(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getlecturersData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    // 编辑
    handleEdit(index, row) {
      this.editTeachers.lecturerId = row.lecturerId;
      this.editTeachers.pic = row.pic;
      this.editTeachers.lecturerName = row.lecturerName;
      this.editTeachers.lecturerIntro = row.lecturerIntro;
      this.editDialogVisible = true;
    },

    // 编辑点击上传
    onSingleUploadSuccessEdit(url) {
      this.editTeachers.pic = url;
    },

    // 清空
    clearbtn() {
      this.searchData.lecturerName = '';
      this.getlecturersData();
    },

    // 分页
    handleSizeChange(val) {
      this.searchData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getlecturersData();
    },

    // 添加讲师
    addTeacherBtn() {
      if (!this.addLecturersParams.lecturerName) {
        this.$message.error('请输入讲师名称');
        return false;
      } else if (!this.addLecturersParams.pic) {
        this.$message.error('请选择上传图片');
        return false;
      } else if (!this.addLecturersParams.lecturerIntro) {
        this.$message.error('请填写讲师简介');
        return false;
      } else {
        addOneLeturers(this.addLecturersParams).then(res => {
          this.$message.success('添加成功！');
          this.getlecturersData();
          this.resetAddTeacher();
        });
        this.dialogVisible = false;
      }
    },

    // 弹窗取消按钮
    dialogCancelBtn() {
      this.resetAddTeacher();
      this.dialogVisible = false;
    },

    // 编辑弹窗提交
    updateTeacherBtn() {
      if (!this.editTeachers.lecturerName) {
        this.$message.error('请输入讲师名称');
        return false;
      } else if (!this.editTeachers.pic) {
        this.$message.error('请选择上传图片');
        return false;
      } else if (!this.editTeachers.lecturerIntro) {
        this.$message.error('请填写讲师简介');
        return false;
      } else {
        updateLeturers(this.editTeachers).then(res => {
          this.$message.success('修改成功！');
          this.editDialogVisible = false;
          this.getlecturersData();
        });
      }
    },

    // 新建弹窗->取消
    cancelAddTeacher() {
      this.resetAddTeacher();
    },

    // 编辑弹窗->取消
    editDialogCancelBtn() {
      this.editDialogVisible = false;
    },

    // 清空新建弹窗内容
    resetAddTeacher() {
      this.addLecturersParams.lecturerName = '';
      this.addLecturersParams.pic = '';
      this.addLecturersParams.lecturerIntro = '';
    },

    // 支持多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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
  },
};
</script>

<style lang="less" scoped>
.course-teacher-container {
  padding: 30px;
  .el-button {
    margin-right: 10px;
  }
  .teacherData {
    margin-bottom: 20px;
    .el-input {
      width: 10%;
      margin-right: 40px;
    }
  }
  .table {
    margin-top: 20px;
  }
  .addDel {
    margin-bottom: 20px;
  }
  .images {
    width: 100%;
    height: 100%;
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .el-table {
    margin-bottom: 50px;
  }
  .courseFrom {
    .el-input {
      width: 300px;
    }
  }
  .introduce {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.slideImg {
  display: flex;
}
</style>
