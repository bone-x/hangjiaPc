<template>
  <div class="content-container">
    <!-- 运营管理 - 卡片设置 -->
    <!-- 数据表格 -->
    <el-table
      ref="card-set-table"
      :data="tableData"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column width="150" prop="typeName" label="卡片类型"></el-table-column>
      <el-table-column min-width="150" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.pictureUrl" class="table-cover" alt="图片">
        </template>
      </el-table-column>
      <el-table-column width="200" prop="$updateTime" label="修改时间"></el-table-column>
      <el-table-column min-width="200" prop="updateName" label="修改用户"></el-table-column>

      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button @click.native="onEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑弹窗-->
    <el-dialog :visible.sync="state.isShowEditWindow" title="编辑" width="600px">
      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="3">
          <label>图片：</label>
        </el-col>
        <el-col :span="10">
          <img :src="editItem.pictureUrl" class="dialog-img" alt="请上传图片">
        </el-col>
        <el-col :span="4">
          <upload-single @successCBK="onSingleUploadSuccess">
            <el-button plain type="primary">上传图片</el-button>
          </upload-single>
        </el-col>
        <el-col :span="7">
          <span>&nbsp;&nbsp;（推荐：618 * 837）</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.isShowEditWindow = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCardSetList, getCardSetEdit } from "@/api/operation";
import { formatDate } from "@/utils";
import uploadSingle from "@/components/Upload/single";

export default {
  name: "OperationAppCardSet",
  components: {
    uploadSingle
  },
  data() {
    return {
      state: {
        isShowEditWindow: false
      },
      filter: {
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      tableData: [],
      editItem: {
        id: "",
        pictureUrl: ""
      }
    };
  },
  watch: {
    // $route: "onRouteChange"
  },
  created() {
    this.getPageData();
  },
  methods: {
    getPageData() {
      getCardSetList().then(res => {
        if (res.code === 200) {
          const {
            list = [],
            currPage = 1,
            pageSize = 10,
            totalPage = 1,
            totalCount = 0
          } = res.result;

          this.filter.currPage = currPage;
          this.filter.pageSize = pageSize;
          this.filter.totalPage = totalPage;
          this.filter.totalCount = totalCount;
          this.tableData = list.map(li => {
            li.$createTime = formatDate(li.createTime, 8);
            li.$updateTime = formatDate(li.updateTime, 8);
            return li;
          });
        }
      });
    },
    // onRouteChange(to) {},
    onEdit(item) {
      this.editItem.id = item.id;
      this.editItem.pictureUrl = item.pictureUrl;
      this.state.isShowEditWindow = true;
    },
    onConfirmEdit() {
      const options = { ...this.editItem };
      getCardSetEdit(options).then(res => {
        if (res.code === 200) {
          this.state.isShowEditWindow = false;
          this.$message.success('操作成功');
          this.getPageData();
        }
      });
    },
    onSingleUploadSuccess(url) {
      this.editItem.pictureUrl = url;
    }
  }
};
</script>

<style scoped lang="scss">
.table-cover {
  display: inline-block;
  width: 100px;
  height: 60px;
}
.dialog-img {
  display: inline-block;
  width: 200px;
  height: 120px;
}
</style>