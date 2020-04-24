<template>
  <div class="content-container">
    <!-- 运营管理 - 首页广告 -->
    <div class="index-ad">
      <div class="goodshow">
        <p class="goodcourse">广告位展示</p>
        <el-button
          type="primary"
          class="goodbtn"
          @click.native="addAdvertise"
          @click="centerDialogVisible = true"
        >新建展示</el-button>
      </div>
      <p class="ad_tips">支持4个广告展示</p>
      <!-- 广告位表格 -->
      <el-table :data="advertiseData" row-key="id" border>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" min-width="80"></el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" style="width:100%;height:80px" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="jumpUrl" label="跳转链接" min-width="100"></el-table-column>
        <el-table-column prop="creatorName" label="创建人" min-width="80"></el-table-column>
        <el-table-column prop="updateName" label="修改人" min-width="80"></el-table-column>
        <el-table-column prop="remark" label="操作" min-width="300" fixed="right">
          <template slot-scope="props">
            <el-button
              :disabled="props.$index===0"
              class="finger"
              type="primary"
              plain
              @click.native="advertisementToUp(props.row.id)"
            >上移</el-button>
            <el-button
              :disabled="props.$index === (advertiseData.length - 1)"
              type="primary"
              plain
              @click.native="advertisementToDown(props.row.id)"
            >下移</el-button>
            <el-button
              type="primary"
              @click="centerDialogVisibleEdit = true"
              @click.native="getSingleAdvertisement(props.row.id)"
            >编辑</el-button>
            <el-button type="danger" @click.native="advertisementToDelete(props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 点击新建展示出现的弹窗 -->
    <el-dialog :visible.sync="centerDialogVisible" title="新建展示" width="70%" left>
      <div class="addslide">
        <div v-if="boolean">
          <div class="singlegroup">
            <span class="slidetitle">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</span>
            <el-input
              v-model="collectAddAdvertisement.title"
              data-options="required:true"
              placeholder="输入标题"
              class="entertitle"
              maxlength="20"
              @keyup="checkLen2(value)"
            ></el-input>
            <span class="limit">最多不超过20个字</span>
          </div>
          <div class="singlegroup">
            <span class="slidetitle">跳转链接：</span>
            <el-input
              v-model="collectAddAdvertisement.jumpUrl"
              placeholder="输入链接"
              class="entertitle"
            ></el-input>
          </div>
          <div class="singlegroup pushpicture">
            <span class="slidetitle">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</span>
            <!-- 引用上传单张图片组件 -->
            <div class="slideImg">
              <img
                v-if="collectAddAdvertisement.imgUrl"
                :src="collectAddAdvertisement.imgUrl"
                style="width:100%;height:100%;display:inline-block"
              />
              <img v-else :src="NullImgFile" style="width: 100%; height: 100%;" />
            </div>
            <!-- on-progress -->
            <upload-single @successCBK="onSingleUploadSuccessAdd">
              <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传banner图片</el-button>
            </upload-single>
          </div>
        </div>

        <div>
          <span slot="footer" class="dialog-footer sure">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              class="sured"
              @click="centerDialogVisible = false"
              @click.native="addNewAdvertisement"
            >确 定</el-button>
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 点击编辑出现的弹窗 -->
    <el-dialog :visible.sync="centerDialogVisibleEdit" title="编辑展示" width="900px" left>
      <div class="addslide">
        <div v-if="boolean">
          <div class="singlegroup">
            <span class="slidetitle">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</span>
            <el-input
              v-model="singleAdvertisement.title"
              data-options="required:true"
              placeholder="输入标题"
              class="entertitle"
              maxlength="20"
              @keyup="checkLen2(value)"
            ></el-input>
            <span class="limit">最多不超过20个字</span>
          </div>
          <div class="singlegroup">
            <span class="slidetitle">跳转链接：</span>
            <el-input v-model="singleAdvertisement.jumpUrl" placeholder="输入链接" class="entertitle"></el-input>
          </div>
          <div class="singlegroup pushpicture">
            <span class="slidetitle">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</span>
            <!-- 引用上传单张图片组件 -->
            <div class="slideImg">
              <img
                v-if="singleAdvertisement.imgUrl"
                :src="singleAdvertisement.imgUrl"
                style="width:100%;height:100%;display:inline-block"
              />
              <img v-else :src="NullImgFile" style="width: 100%; height: 100%;" />
            </div>
            <!-- on-progress -->
            <upload-single @successCBK="onSingleUploadSuccess">
              <el-button icon="el-icon-upload" size="medium" style="margin-left: 40px;">上传banner图片</el-button>
            </upload-single>
          </div>
        </div>

        <div>
          <span slot="footer" class="dialog-footer sure">
            <el-button @click="centerDialogVisibleEdit = false">取 消</el-button>
            <el-button
              type="primary"
              class="sured"
              @click="centerDialogVisibleEdit = false"
              @click.native="confirmDetail"
            >确 定</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  advertisementList,
  advertisementUp,
  advertisementDown,
  advertisementDelete,
  advertisementEdit,
  advertisementCheckId,
  addAdvertisement
} from "@/api/operation";
import uploadSingle from "@/components/Upload/single";
import NullImgFile from "@/assets/null.png";

export default {
  name: "OperationManageIndexCourse",
  components: {
    uploadSingle
  },
  data() {
    return {
      NullImgFile,
      // 广告位展示数据
      advertiseData: [],
      // 新建广告展示所需数据容器
      collectAddAdvertisement: {
        imgUrl: "",
        jumpUrl: "",
        title: ""
      },
      // 点击编辑获取的单条数据
      singleAdvertisement: {
        id: "",
        title: "",
        imgUrl: "",
        jumpUrl: ""
      },
      centerDialogVisible: false,
      centerDialogVisibleEdit: false,
      imageUrl: "",
      imageUrlEdit: "",
      boolean: true
    };
  },
  created() {
    this.getAdvertiseData();
  },
  methods: {
    // 新建展示点击上传
    onSingleUploadSuccessAdd(url) {
      this.collectAddAdvertisement.imgUrl = url;
    },

    // 编辑展示点击上传图片
    onSingleUploadSuccess(url) {
      this.singleAdvertisement.imgUrl = url;
    },

    // 获取广告位列表数据
    getAdvertiseData() {
      advertisementList()
        .then(res => {
          this.advertiseData = res.result;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 广告位列表数据操作
    // 广告上移
    advertisementToUp(id) {
      advertisementUp(id)
        .then(res => {
          this.getAdvertiseData();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 广告下移
    advertisementToDown(id) {
      advertisementDown(id)
        .then(res => {
          this.getAdvertiseData();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 广告删除
    advertisementToDelete(id) {
      advertisementDelete(id)
        .then(res => {
          this.getAdvertiseData();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 广告编辑
    advertisementToEdit(id) {
      advertisementEdit(id)
        .then(res => {
          this.getAdvertiseData();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击详情根据ID查询
    getSingleAdvertisement(id) {
      advertisementCheckId(id).then(res => {
        this.singleAdvertisement = res.result;
      });
    },

    // 点击新建按钮判断
    addAdvertise() {
      this.collectAddAdvertisement.imgUrl = "";
      this.collectAddAdvertisement.jumpUrl = "";
      this.collectAddAdvertisement.title = "";
      if (this.advertiseData.length === 4) {
        this.centerDialogVisible = false;
        this.$message.warning("只能展示4条数据，请删除已有数据再新建!");
      } else {
        this.centerDialogVisible = true;
      }
    },

    // 点击新建展示后请求
    addNewAdvertisement() {
      let res = null;
      if (!this.collectAddAdvertisement.title.trim()) {
        this.$message.error("展示标题不能为空!");
        this.centerDialogVisible = true;
        res = false;
      } else if (!this.collectAddAdvertisement.jumpUrl.trim()) {
        this.$message.error("跳转链接不能为空!");
        this.centerDialogVisible = true;
        res = false;
      } else if (!this.collectAddAdvertisement.imgUrl) {
        this.$message.error("请选择上传的图片!");
        this.centerDialogVisible = true;
        res = false;
      } else {
        this.centerDialogVisible = false;
        // 请求需携带的参数
        const data = {
          imgUrl: this.collectAddAdvertisement.imgUrl,
          jumpUrl: this.collectAddAdvertisement.jumpUrl,
          title: this.collectAddAdvertisement.title
        };
        res = addAdvertisement(data)
          .then(res => {
            if (res.code === 200) {
              // 刷新列表
              this.getAdvertiseData();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      return res;
    },

    // 编辑详情以后提交确定请求
    confirmDetail() {
      let res = null;
      if (!this.singleAdvertisement.title.trim()) {
        this.$message.error("展示标题不能为空!");
        this.centerDialogVisibleEdit = true;
        res = false;
      } else if (!this.singleAdvertisement.jumpUrl.trim()) {
        this.$message.error("跳转链接不能为空!");
        this.centerDialogVisibleEdit = true;
        res = false;
      } else if (!this.singleAdvertisement.imgUrl) {
        this.$message.error("请选择上传的图片!");
        this.centerDialogVisibleEdit = true;
        res = false;
      } else {
        this.centerDialogVisibleEdit = false;
        // 请求需携带的参数
        const params = {
          id: this.singleAdvertisement.id,
          imgUrl: this.singleAdvertisement.imgUrl,
          jumpUrl: this.singleAdvertisement.jumpUrl,
          title: this.singleAdvertisement.title
        };
        res = advertisementEdit(params)
          .then(res => {
            if (res.code === 200) {
              // 刷新列表
              this.getAdvertiseData();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      return res;
    },

    // 新建上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 编辑上传图片
    handleAvatarSuccessEdit(res, file) {
      this.imageUrlEdit = URL.createObjectURL(file.raw);
    },
    beforeAvatarUploadEdit(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.index-ad {
  padding: 0px 20px 20px 20px;
  .ad_tips {
    margin-left: 10px;
    font-size: 13px;
    color: rgb(255, 133, 3);
    line-height: 50px;
  }
  .goodshow {
    margin-bottom: 20px;
    .goodcourse {
      float: left;
      margin-right: 10px;
      font-weight: bold;
    }
    .goodbtn {
      float: right;
    }
    .images {
      width: 80px;
      height: 80px;
    }
  }
}
.threeSelect {
  width: 150px;
}
.tablefoot {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.recomtable {
  margin-bottom: 25px;
}
.block {
  width: 100%;
  display: flex;
  justify-content: center;
}
.recommend {
  margin-top: 35px;
}
.addslide {
  padding: 0px 30px 20px 30px;
  .singlegroup {
    margin-bottom: 25px;
    .slidetitle {
      margin-right: 20px;
      .slideImg {
        position: relative;
        margin-left: 10px;
        width: 288px;
        height: 160px;
        border: 1px solid #ccc;
      }
    }
    // 上传图片的样式
    .avatar-uploader .el-upload {
      // border: 1px dashed #d9d9d9;
      border: 1px dashed #ccc;
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
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 3px;
      margin-left: 5px;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .pushbanner {
      line-height: 30px;
      color: #949292;
      margin-left: 20px;
    }
    // 以上是上传图片的样式
    .entertitle {
      width: 150px;
      margin-right: 20px;
    }
    .limit {
      color: #949292;
    }
  }
  .pushpicture,
  .settime {
    display: flex;
  }
  .settime {
    line-height: 36px;
    .time {
      display: inline-block;
      line-height: 36px;
    }
    .two {
      margin-right: 20px;
    }
    .timerule {
      color: #949292;
      margin-left: 20px;
    }
  }

  .sured {
    margin-left: 10%;
  }
  .el-dialog__body {
    padding: 30px 30px 0px 30px;
  }
  .pageblock {
    display: flex;
    justify-content: center;
    padding: 30px 0 0 0;
  }
  .block {
    display: flex;
    justify-content: center;
    padding: 30px 0 0 0;
  }
  .sure {
    display: flex;
    justify-content: center;
    .yes {
      margin-left: 100px;
    }
  }
}
</style>
