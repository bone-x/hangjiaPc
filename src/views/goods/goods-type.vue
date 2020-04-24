<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model="filter.goodsCategoryName"
          name="goodsCategoryName"
          placeholder="请输入类目名称"
          type="text"
        ></el-input>
      </el-col>

      <el-col :span="3">
        <el-input
          :clearable="true"
          v-model="filter.goodsCategoryId"
          name="goodsCategoryId"
          placeholder="请输入类目ID"
          type="text"
        ></el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" @click.native="getTableData">查询</el-button>
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button @click.native="clearFormFilter">清空</el-button>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="2">
        <el-button
          v-permission="['goods:category:save']"
          type="primary"
          @click.native="onAdd()"
        >添加主类目</el-button>
      </el-col>

      <el-col :span="2">
        <el-button
          v-permission="['goods:category:delete']"
          type="danger"
          @click.native="onDelete(state.selectedItems)"
        >批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="24">
        <tree-table-2
          :data="tableData"
          :columns="tableColums"
          :expand-all="true"
          border
          max-height="700"
          @on-select="onSelectCheckBox"
        >
          <el-table-column label="操作" min-width="360" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-permission="['goods:category:update']"
                icon="el-icon-edit"
                @click.native="onEdit(scope.row)"
              >编辑</el-button>
              <el-button
                v-permission="['goods:category:delete']"
                icon="el-icon-delete"
                type="danger"
                @click.native="onDelete([scope.row])"
              >删除</el-button>
              <el-button
                v-permission="['goods:category:save']"
                v-if="scope.row._level !== 4"
                icon="el-icon-plus"
                type="primary"
                @click.native="onAdd(scope.row)"
              >添加子分类</el-button>
              <el-button 
                @click.native="upOrDownFun(scope.row)"
                v-if='!scope.row.displayState'
              >上架</el-button>
              <el-button 
                @click.native="upOrDownFun(scope.row)"
                v-else
              >下架</el-button>
            </template>
          </el-table-column>
        </tree-table-2>
      </el-col>
    </el-row>

    <!-- 添加类目，子类目 -->
    <el-dialog
      :visible.sync="state.isShowDialog"
      :title="dialogTitle"
      width="700px"
      @close="dialogForm.name = '', dialogForm.sort = 1"
    >
      <el-row
        :gutter="10"
        type="flex"
        align="middle"
        style="padding-left: 20px;margin-bottom: 30px"
      >
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categoryName">所属项目：</label>
        </el-col>
        <el-col :span="10">
          <el-select
            v-model="dialogForm.projectType"
            :disabled="!state.hasProjectType"
            placeholder="请选择所属项目"
            style="width: 262px"
          >
            <el-option
              v-for="(item, index) in projectOption"
              :key="index"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" align="middle" style="padding-left: 20px;">
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categoryName">类目名称：</label>
        </el-col>
        <el-col :span="10">
          <el-input id="dialog-categoryName" v-model="dialogForm.name" placeholder="请输入类目名称"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" align="middle" style="padding-left: 20px; margin-top: 30px;">
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categorySort">排序：</label>
        </el-col>
        <el-col :span="10">
          <el-input id="dialog-categorySort" v-model="dialogForm.sort" placeholder="请输入排序"></el-input>
        </el-col>
      </el-row>

      <el-row
        v-if="dialogForm.projectType === 1 && dialogForm.level === 1"
        :gutter="10"
        type="flex"
        align="middle"
        style="padding-left: 20px; margin-top: 30px;"
      >
        <el-col :span="5" right>
          <label style="display: inline-block;height: 109px;" for="dialog-logo">图标：</label>
        </el-col>
        <el-col :span="10">
          <div class="slideImg">
            <div>
              <upload-single
                :max-file-size="2"
                :size="[42, 42]"
                :accept="['image/png']"
                @successCBK="onSingleUploadSuccessEdit"
              >
                <div class="chooseBtn">
                  <el-button icon="el-icon-upload" size="medium">选择图片</el-button>
                </div>
              </upload-single>
              <div>
                <img
                  v-if="dialogForm.categoryPicture"
                  :src="dialogForm.categoryPicture"
                  class="logoImg"
                />
                <img v-else :src="NullImgFile" class="logoImg" />
              </div>
            </div>
            <div class="atention">
              <p>格式：png</p>
              <p style="margin: 0px">尺寸：42*42px</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row
        v-if="dialogForm.projectType === 1"
        :gutter="10"
        type="flex"
        align="middle"
        style="padding-left: 20px;margin-bottom: 30px; margin-top: 30px;"
      >
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categoryStatus">状态：</label>
        </el-col>
        <el-col :span="10">
          <el-radio v-model="dialogForm.displayState" :label="1">上架</el-radio>
          <el-radio v-model="dialogForm.displayState" :label="0">下架</el-radio>
        </el-col>
      </el-row>

      <el-row slot="footer">
        <el-button @click.native="state.isShowDialog = false">取消</el-button>
        <el-button type="primary" @click.native="onDialogConfirm">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import treeTable2 from '@/components/TreeTable2';
import {
  getGoodsCategoryList,
  addGoodsCategory,
  removeCategory,
  editCategory,
  upOrDown
  
} from '@/api/goods.js';
import uploadSingle from '@/components/Upload/single';
import NullImgFile from '@/assets/null.png';

export default {
  name: 'GoodsType',
  components: {
    treeTable2,
    uploadSingle,
  },
  data() {
    return {
      NullImgFile,
      state: {
        selectedItems: [],
        isShowDialog: false,
        dialogType: 1,
        hasProjectType: false,
        isShowLogo: false,
      },
      filter: {
        // 类目id
        goodsCategoryId: '',
        // 类目名称
        goodsCategoryName: '',
      },
      dialogForm: {
        projectType: '',
        name: '',
        sort: 1,
        parentId: '',
        level: 1,
        id: '',
        displayState: 1,
        categoryPicture: null,
      },
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
      tableColums: [
        {
          text: '类目ID',
          width: 200,
          align: 'left',
          value: 'id',
        },
        {
          text: '类目名称',
          expand: true,
          width: 500,
          align: 'left',
          value: 'name',
        },
        {
          text: '类目商品数',
          width: 150,
          align: 'left',
          value: 'goodsCount',
        },
        {
          text: '排序',
          width: 100,
          align: 'left',
          value: 'sort',
        },
        {
          text: '状态',
          width: 150,
          align: 'center',
          value: '$status',
        },
        {
          text: '最后修改人',
          width: 100,
          align: 'left',
          value: 'modifierName',
        },
      ],
      tableData: [],
      dialogTitle: '添加主类目',
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    upOrDownFun(data){
       console.log(data)
        upOrDown({id:data.id,displayState:!data.displayState}).then(res=>{
          
                this.getTableData();
         
        //     // console.log(res)
        })
    },
    onSingleUploadSuccessEdit(url) {
      this.dialogForm.categoryPicture = url;
    },

    // 清空筛选栏
    clearFormFilter() {
      this.filter.goodsCategoryId = '';
      this.filter.goodsCategoryName = '';
    },
    // 单选 or 全选
    onSelectCheckBox(selection) {
      this.state.selectedItems = selection;
    },
    onAdd(item) {
      this.state.hasProjectType = !item;
      this.dialogForm.id = '';
      if (item) {
        // 添加子类目
        console.log('item', item);
        this.dialogTitle = '添加子类目';
        this.dialogForm.parentId = item.id;
        this.dialogForm.level = item._level + 1;
        this.dialogForm.name = '';
        this.dialogForm.displayState = 1;
        this.dialogForm.projectType = item.projectType;
      } else {
        // 添加主类目
        this.dialogForm.parentId = '';
        this.dialogForm.level = 1;
        this.dialogForm.name = '';
        this.dialogForm.projectType = '';
        this.dialogForm.categoryPicture = '';
        this.dialogForm.displayState = 1;
      }
      this.state.isShowDialog = true;
    },
    onEdit(item) {
      // console.log('itit', item);
      if (item.level === 1) {
        this.dialogTitle = '编辑主类目';
      } else {
        this.dialogTitle = '编辑子类目';
      }
      this.dialogForm.parentId = item.parentId;
      this.dialogForm.id = item.id;
      this.dialogForm.level = item._level;
      this.dialogForm.sort = item.sort;
      this.dialogForm.name = item.name;
      this.dialogForm.projectType = item.projectType;
      this.dialogForm.categoryPicture = item.categoryPicture;
      this.dialogForm.$status = item.$status;
      this.state.isShowDialog = true;
    },
    // 请求商品类目列表数据
    async getTableData() {
      const options = {
        goodsCategoryId: this.filter.goodsCategoryId,
        goodsCategoryName: this.filter.goodsCategoryName,
      };
      const res = await getGoodsCategoryList(options);
      if (res.code !== 200) return Promise.reject();

      const adapterFn = (arr = []) => {
        return arr.map(i => {
          const item = {
            id: i.id,
            goodsCount: i.goodsCount,
            level: i.level,
            name: i.name,
            parentId: i.parentId,
            sort: i.sort || 1,
            projectType: i.projectType,
            modifierName:i.modifierName,
            displayState:i.displayState,
            categoryPicture:i.categoryPicture,
          };

            item.$status=i.displayState?'上架':'下架'
      
          if (i.childList) item.children = adapterFn(i.childList);
          return item;
        });
      };
    
      this.tableData = adapterFn(res.result || []);
      // 清空选择的项
      this.state.selectedItems = [];
    },
    // 添加主类目 or 子类目
    addCategory() {
      if (!this.dialogForm.name) {
        this.$message.error('请填写类目名称');
        return false;
      }
      if (this.dialogForm.projectType === 1 && this.dialogForm.level === 1) {
        if (!this.dialogForm.categoryPicture) {
          this.$message.error('请上传图标');
          return false;
        } else if (this.dialogForm.status === '') {
          this.$message.error('请选择状态');
          return false;
        }
      }

      this.dialogForm.id = '';
      addGoodsCategory(this.dialogForm).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功！',
            type: 'success',
          });
          this.state.isShowDialog = false;
          // 重新获取列表
          this.getTableData();
        }
      });
    },

    // 编辑类目
    editCategory() {
      if (!this.dialogForm.name) {
        this.$message.error('请填写类目名称！');
        return false;
      } else if (!this.dialogForm.sort) {
        this.$message.error('请填写排序！');
        return false;
      } else if (
        this.dialogForm.projectType === 1 &&
        this.dialogForm.level === 1
      ) {
        if (!this.dialogForm.categoryPicture) {
          this.$message.error('请上传图标！');
          return false;
        } else {
          editCategory(this.dialogForm).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '编辑成功！',
                type: 'success',
              });
              this.state.isShowDialog = false;
              // 重新获取列表
              this.getTableData();
            }
          });
        }
      } else {
        editCategory(this.dialogForm).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '编辑成功！',
              type: 'success',
            });
            this.state.isShowDialog = false;
            // 重新获取列表
            this.getTableData();
          }
        });
      }
    },

    // 如果没有选择，则提醒
    // 返回Boolean
    checkSelectIsNull(items = []) {
      if (items.length <= 0) {
        this.$confirm('请至少勾选一条数据！', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          type: 'warning',
        });
        return true;
      }
      return false;
    },

    // 删除类目
    async onDelete(items = []) {
      // 如果未选择
      const noItem = this.checkSelectIsNull(items);
      if (noItem) return Promise.reject();

      // 若勾选的所有类目数据中，只要有一个类目课程数量不为0，则不允许删除
      const recursionFn = (arr = []) =>
        arr.some(i => {
          if (i.goodsCount) return true;
          if (i.children && i.children.length > 0) {
            return recursionFn(i.children);
          }

          return false;
        });
      const noPass = recursionFn(items);
      if (noPass) {
        this.$confirm(
          '该类目及其子分类下商品数量不为0，无法删除！请确保该类目及其子分类下无商品后再执行删除操作！',
          '删除类目提示',
          {
            confirmButtonText: '确定',
            showCancelButton: false,
            showClose: false,
            type: 'warning',
          }
        );
      } else {
        const confimRes = await this.$confirm(
          '确定要删除该类目及其子分类吗？',
          '删除类目',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
        if (confimRes) {
          // 确认删除的回调
          const ids = items.map(i => i.id);
          const { code } = await removeCategory(ids);
          if (code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success',
            });
            // 重新获取列表
            this.getTableData();
          }
        }
      }
    },

    onDialogConfirm() {
      const isEdit = !!this.dialogForm.id;
      if (this.state.hasProjectType) {
        if (!this.dialogForm.projectType) {
          this.$message({
            message: '请选择所属项目',
            type: 'error',
          });
        } else if (!this.dialogForm.name) {
          this.$message({
            message: '请填写类目名称',
            type: 'error',
          });
          return false;
        }
      }
      // 编辑
      if (isEdit) {
        this.editCategory();
      } else {
        // 添加
        this.addCategory();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.slideImg {
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  .atention {
    // width: 55%;
    margin-left: 20px;
  }
  .logoImg {
    display: inline-block;
    width: 44px;
    height: 44px;
  }
  .chooseBtn {
    margin-bottom: 15px;
  }
}
</style>
