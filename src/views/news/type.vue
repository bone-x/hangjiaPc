<template>
  <div class="content-container">
    <!-- 资讯管理 - 资讯类别管理 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select
          v-model="productId"
          placeholder="请选择项目名称"
          @change="changeProjectName"
        >
          <el-option
            v-for="item in projectOption"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-select
          v-model="valueType"
          placeholder="请选择资讯类别"
          @change="changeHandler"
        >
          <el-option
            v-for="item in optiontype"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-select
          v-model="valueScond"
          placeholder="请选择资讯的二级目录"
        >
          <el-option
            v-for="item in optionsecond"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-input
          v-model="keywords"
          placeholder="请输入查询资讯关键字"
          maxlength="6"
        ></el-input>
      </el-col>

      <el-col :span="3">
        <el-button
          v-permission="['info:category:select']"
          size="small"
          type="primary"
          @click.native="query"
        >查询</el-button>
      </el-col>

      <el-col :span="2">
        <el-button
          size="small"
          type="danger"
          @click.native="clearAll"
        >清空</el-button>
      </el-col>

      <el-col :span="2">
        <el-button
          v-permission="['info:category:save']"
          type="primary"
          @click="dialogVisible = true"
        >新建类目</el-button>
      </el-col>
    </el-row>
    <!-- 列表组件 -->
    <ltreeTable
      :data="data"
      :columns="columns"
      border
      @selection-add="secondType"
      @selection-change="changesth"
      @selection-del="delectData"
    />

    <!-- 一级类目新建弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
      title="新建类别"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="所属项目">
          <el-select
            v-model="form.productId"
            placeholder="请选择所属项目"
            @change="getProjectType"
          >
            <el-option
              v-for="(item, index) in projectOption"
              :key="index"
              :value="item.value"
              :label="item.text"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input
            v-model="form.name"
            placeholder="请输入内容（最多输入2个中文）"
            maxlength="2"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input
            v-model="form.rank"
            placeholder="请输入内容"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio
            v-model="radio"
            label="1"
          >上架</el-radio>
          <el-radio
            v-model="radio"
            label="0"
          >下架</el-radio>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <el-button @click="handleClose">取 消</el-button>
              <el-button
                type="primary"
                @click.native="createdData"
              >确 定</el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </span>
    </el-dialog>

    <!-- 一级类目修改弹窗 -->
    <el-dialog
      :visible.sync="dialogChange"
      :before-close="edithandleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
      title="类别修改"
    >
      <el-form
        ref="form"
        :model="formChange"
        label-width="80px"
      >
        <el-form-item label="所属项目">
          <el-select
            v-model="formChange.productId"
            placeholder="请选择所属项目"
            disabled
            @change="getProjectType"
          >
            <el-option
              v-for="(item, index) in projectOption"
              :key="index"
              :value="item.value"
              :label="item.text"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input
            v-model="formChange.name"
            placeholder="请输入内容（最多输入2个中文）"
            maxlength="2"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input
            v-model="formChange.rank"
            placeholder="请输入内容"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio
            v-model="radioChange"
            label="1"
          >上架</el-radio>
          <el-radio
            v-model="radioChange"
            label="0"
          >下架</el-radio>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <el-button @click="edithandleClose">取 消</el-button>
              <el-button
                type="primary"
                @click.native="changeSubmit"
              >确 定</el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </span>
    </el-dialog>

    <!-- 二级新建弹窗 -->
    <el-dialog
      :visible.sync="dialogSecond"
      :before-close="secondhandleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
      title="二级类别新建"
    >
      <el-form
        ref="form"
        :model="formSecond"
        label-width="120px"
      >
        <el-form-item label="一级类别名称：">
          <span style="font-weight:bold;">{{ TypeName }}</span>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select
            v-model="formSecond.productId"
            placeholder="请选择所属项目"
            disabled
            @change="getProjectType"
          >
            <el-option
              v-for="(item, index) in projectOption"
              :key="index"
              :value="item.value"
              :label="item.text"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称:">
          <el-input
            v-model="formSecond.name"
            placeholder="请输入内容（最多输入6个中文）"
            maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input
            v-model="formSecond.rank"
            placeholder="请输入内容"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio
            v-model="radioSecond"
            label="1"
          >上架</el-radio>
          <el-radio
            v-model="radioSecond"
            label="0"
          >下架</el-radio>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <el-button @click="secondhandleClose">取 消</el-button>
              <el-button
                type="primary"
                @click="secondChange"
              >确 定</el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </span>
    </el-dialog>

    <!-- 二级修改弹窗 -->
    <el-dialog
      :visible.sync="dialogSecondchange"
      :before-close="changehandleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
      title="二级类别修改"
    >
      <el-form
        ref="form"
        :model="formSecondchange"
        label-width="120px"
      >
        <el-form-item label="一级类别名称：">
          <span style="font-weight:bold;">{{ TypeName }}</span>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select
            v-model="formSecondchange.productId"
            placeholder="请选择所属项目"
            disabled
            @change="getProjectType"
          >
            <el-option
              v-for="(item, index) in projectOption"
              :key="index"
              :value="item.value"
              :label="item.text"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称:">
          <el-input
            v-model="formSecondchange.name"
            placeholder="请输入内容（最多输入6个中文）"
            maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input
            v-model="formSecondchange.rank"
            placeholder="请输入内容"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio
            v-model="radioSecondchange"
            label="1"
          >上架</el-radio>
          <el-radio
            v-model="radioSecondchange"
            label="0"
          >下架</el-radio>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <el-button @click="changehandleClose">取 消</el-button>
              <el-button
                type="primary"
                @click.native="Secondchangesubmit"
              >确 定</el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ltreeTable from '@/components/LtreeTable/treetable.vue';

import {
  getCategoryList,
  delCategoryList,
  changeCategoryList,
  createdCategoryList,
  getFathertype,
  getChildtype,
  getFathertypename,
} from '@/api/news';

export default {
  name: 'NewsType',
  components: {
    ltreeTable,
  },
  data() {
    return {
      row: {},
      date: '',
      keywords: '',
      optiontype: [],
      valueType: '',
      optionsecond: [],
      valueScond: '',
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
      columns: [
        {
          text: '资讯类别名称',
          value: 'name',
        },
        {
          text: '状态',
          value: '$status',
        },
        {
          text: '排序',
          value: 'rank',
        },
        {
          text: '资讯量',
          value: 'informationAccount',
        },
        {
          text: '修改人',
          value: 'updatorName',
        },
      ],
      data: [],
      multipleSelection: [],
      dialogVisible: false,
      dialogSecond: false,
      dialogChange: false,
      dialogSecondchange: false,
      form: {
        productId: '',
        name: '',
        rank: '',
      },
      formChange: {
        productId: '',
        name: '',
        rank: '',
      },
      radioChange: '1',
      radio: '1',
      formSecond: {
        productId: '',
        name: '',
        rank: '',
      },
      radioSecond: '1',
      formSecondchange: {
        productId: '',
        name: '',
        rank: '',
      },
      radioSecondchange: '1',
      TypeName: '',
      productId: null,
    };
  },
  created() {
    this.getList();
    this.getAllFatherType();
  },
  methods: {
    changeProjectName() {
      this.getAllFatherType();
    },

    // 获取父类目
    getAllFatherType(productId = this.productId) {
      getFathertype(productId).then(response => {
        this.optiontype = response.result.map(item => {
          return {
            id: item.id,
            name: item.name,
          };
        });
      });
    },

    // 点击所属项目刷新等级类目
    getProjectType(item) {
      console.log(item);
    },

    changeHandler(id) {
      // console.log(id, '111');
      this.valueType = id;
      this.valueScond = '';
      getChildtype({ id }).then(response => {
        // console.log('3333333', response);
        this.optionsecond = response.result.map(item => {
          return {
            id: item.id,
            name: item.name,
          };
        });
      });
    },
    getList() {
      // 列表数据
      const loop = list => {
        list.map(val => {
          if (val.status === -1) {
            val.$status = '已下架';
          } else if (val.status === 0) {
            val.$status = '未发布';
          } else {
            val.$status = '已上架';
          }
          if (val.subInfCategoryVOList) {
            loop(val.subInfCategoryVOList);
          }
          return val;
        });
      };
      getCategoryList().then(response => {
        // console.log('列表信息', response.result);
        loop(response.result);
        // response.result.forEach(val => {
        //   if (val.status === '-1') {
        //     val.$status = "已下架";
        //   } else if (val.status === '0') {
        //     val.$status = "未发布";
        //   } else {
        //     val.$status = "已上架";
        //   }
        //   if (val.subInfCategoryVOList) {
        //     val.subInfCategoryVOList.forEach(item => {
        //       if (item.status === '-1') {
        //         (item.$status = "已下架");
        //       } else if (item.$status === '0') {
        //         (item.$status = "未发布");
        //       } else {
        //         (item.$status = "已上架");
        //       }
        //     });
        //   }
        // });
        this.data = response.result;
      });
    },
    query() {
      const params = {
        // 查询
        keyword: this.keywords || null,
        id: this.valueScond || this.valueType || null,
        productId: this.productId || null,
      };
      const loop = list => {
        list.map(val => {
          if (val.status === -1) {
            val.$status = '已下架';
          } else if (val.status === 0) {
            val.$status = '未发布';
          } else {
            val.$status = '已上架';
          }
          if (val.subInfCategoryVOList) {
            loop(val.subInfCategoryVOList);
          }
          return val;
        });
      };
      getCategoryList(params).then(response => {
        loop(response.result);
        if (this.keywords !== '' || this.valueScond !== '') {
          response.result.map(item => {
            if (item.subInfCategoryVOList) {
              item.subInfCategoryVOList.map(i => {
                if (
                  i.name.indexOf(this.keywords) !== -1 ||
                  this.valueScond === i.id
                ) {
                  item._expanded = !item._expanded;
                } else {
                  return false;
                }
              });
            }
          });
        }

        this.data = response.result;
      });
    },
    firstAdd(val) {
      this.multipleSelection = val;
      console.log(val); // 子组件传值过来的数据
      console.log(val.length);
    },
    secondType(index, row) {
      // 二级添加
      this.row = row;
      this.formSecond.productId = row.productId;
      this.dialogSecond = true; // 二级添加
      this.TypeName = row.name;
    },
    delectData(index, row) {
      // 删除
      if (row.informationAccount) {
        this.$message({
          message: '该资讯类别还有资讯请全部删除资讯后才可以删除',
          type: 'warning',
        });
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const params = {
              id: row.id,
            };
            delCategoryList(params).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功',
              });
              console.log(12345678, response);
              this.getList();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    clearAll() {
      this.valueType = '';
      this.valueScond = '';
      this.keywords = '';
      this.productId = '';
      this.getList();
    },
    changesth(index, row) {
      console.log(row, 123123123);
      if (row._level === 1) {
        // 一级修改部分
        this.dialogChange = true;
        this.formChange.productId = row.productId;
        this.formChange.name = row.name;
        this.formChange.rank = row.rank;
        this.radioChange = String(row.status);
      } else {
        // 二级
        this.dialogSecondchange = true;
        this.formSecondchange.productId = row.productId;
        this.formSecondchange.name = row.name;
        this.formSecondchange.rank = row.rank;
        this.radioSecondchange = String(row.status);
        const params = {
          id: row.id,
        };
        getFathertypename(params).then(res => {
          console.log(res, '互殴父类目的名字');
          this.TypeName = res.result.parentName;
        });
      }
      this.row = row;
      console.log('i am master', row);
    },
    changeSubmit() {
      const reg = /^[\u0391-\uFFE5]+$/;
      if (this.formChange.name === '') {
        this.$message.error('请输入类别名称！');
      } else if (
        this.formChange.name === '大事' ||
        this.formChange.name === '热点' ||
        this.formChange.name === '早报'
      ) {
        this.$message.error('类目名称不能使用“热点”“大事”“早报”，请重新输入！');
        this.formChange.name = '';
      } else if (!reg.test(this.formChange.name)) {
        this.$message.error('类目名称最多输入2个中文');
        this.formChange.name = '';
      } else if (this.formChange.name.length > 2) {
        this.$message.error('类目名称最多输入2个中文');
        this.formChange.name = '';
      } else if (this.formChange.rank === '') {
        this.$message({
          message: '请输入排序',
          type: 'warning',
        });
      } else {
        // 修改一级确定
        const params = {
          productId: this.formChange.productId,
          id: this.row.id,
          name: this.formChange.name,
          rank: Number(this.formChange.rank),
          status: Number(this.radioChange),
        };
        changeCategoryList(params).then(response => {
          this.$message({
            message: '修改一级类别成功',
            type: 'success',
          });
          this.edithandleClose();
          this.getList();
          console.log(9999, response);
        });
      }
    },
    Secondchangesubmit() {
      const reg = /^[\u0391-\uFFE5]+$/;
      if (this.formSecondchange.name === '') {
        this.$message.error('请输入类别名称！');
      } else if (
        this.formSecondchange.name === '大事' ||
        this.formSecondchange.name === '热点' ||
        this.formSecondchange.name === '早报'
      ) {
        this.$message.error('类目名称不能使用“热点”“大事”“早报”，请重新输入！');
        this.formSecondchange.name = '';
      } else if (!reg.test(this.formSecondchange.name)) {
        this.$message.error('类目名称最多输入6个中文');
        this.formSecondchange.name = '';
      } else if (this.formSecondchange.name.length > 6) {
        this.$message.error('类目名称最多输入6个中文');
        this.formSecondchange.name = '';
      } else if (this.formSecondchange.rank === '') {
        this.$message.error('请输入排序！');
      } else {
        // 修改二级确定
        const params = {
          id: this.row.id,
          productId: this.formSecondchange.productId,
          name: this.formSecondchange.name,
          rank: Number(this.formSecondchange.rank),
          status: Number(this.radioSecondchange),
        };
        changeCategoryList(params).then(response => {
          this.$message({
            message: '修改二级类别成功',
            type: 'success',
          });
          this.changehandleClose();
          this.getList();
          console.log(9999, response);
        });
      }
    },
    changehandleClose() {
      this.radioSecondchange = '1';
      this.dialogSecondchange = false;
    },
    edithandleClose() {
      this.radioChange = '1';
      this.dialogChange = false;
    },
    createdData() {
      const reg = /^[\u0391-\uFFE5]+$/;
      //  新建类目
      if (!this.form.productId) {
        this.$message.warning('请选择所属项目');
      } else if (this.form.name === '') {
        this.$message({
          message: '请输入类别名称',
          type: 'warning',
        });
      } else if (
        this.form.name === '大事' ||
        this.form.name === '早报' ||
        this.form.name === '热点'
      ) {
        this.$message.error('类目名称不能使用“热点”“大事”“早报”，请重新输入！');
        this.form.name = '';
      } else if (!reg.test(this.form.name)) {
        this.$message.error('类目名称最多输入2个中文');
        this.form.name = '';
      } else if (this.form.rank === '') {
        this.$message({
          message: '请输入排序',
          type: 'warning',
        });
      } else {
        const params = {
          productId: this.form.productId,
          name: this.form.name + '',
          rank: this.form.rank,
          status: this.radio,
        };
        createdCategoryList(params).then(response => {
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: '新建一级类目成功',
          });
          this.handleClose();
          this.getList();
          console.log(9999, response);
        });
      }
    },
    handleClose() {
      // 新建一级目录初始化
      this.form.name = '';
      this.form.rank = '';
      this.radio = '1';
      this.dialogVisible = false;
    },
    secondChange() {
      const reg = /^[\u0391-\uFFE5]+$/;
      // 新建二级类目
      if (this.formSecond.name === '') {
        this.$message({
          message: '请输入类别名称',
          type: 'warning',
        });
      } else if (
        this.formSecond.name === '大事' ||
        this.formSecond.name === '热点' ||
        this.formSecond.name === '早报'
      ) {
        this.$message.error('类目名称不能使用“热点”“大事”“早报”，请重新输入！');
        this.formSecond.name = '';
      } else if (!reg.test(this.formSecond.name)) {
        this.$message.error('类目名称最多输入6个中文');
        this.formSecond.name = '';
      } else if (this.formSecond.rank === '') {
        this.$message({
          message: '请输入排序',
          type: 'warning',
        });
      } else {
        const params = {
          parentId: this.row.id,
          productId: this.formSecond.productId,
          name: this.formSecond.name,
          rank: Number(this.formSecond.rank),
          status: Number(this.radioSecond),
        };
        createdCategoryList(params).then(response => {
          this.$message({
            type: 'success',
            message: '添加二级类别成功',
          });
          this.secondhandleClose();
          this.getList();
          console.log(55555222, response, this.row.id);
        });
      }
    },
    secondhandleClose() {
      this.dialogSecond = false;
      this.formSecond.name = '';
      this.formSecond.rank = '';
      this.radioSecond = '1';
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
