<template>
  <div class="content-container">
    <!-- 系统管理 - 数字字典 -->
    <div class="dictionary-container">
      <div>
        <el-button
          v-permission="['sys:dict:save']"
          type="primary"
          @click="centerDialogVisible = true"
        >添加字典</el-button>
      </div>
      <el-table
        :data="dictionaryData"
        border
        style="width: 100%; margin-top:30px"
        :header-cell-style="{background: '#eef1f6', color: '#606266', width: '100%'}"
      >
        <el-table-column
          prop="id"
          label="字典ID"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="字典名称"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="字典编码"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="updateName"
          label="修改人"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="数据类型"
          width="180"
        >
          <template slot-scope="scope">
            <span
              v-for="(item, index) in dataType"
              :key="index"
            >
              <span v-if="scope.row.type === item.value">{{ item.label }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="450"
          prop="operating"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['sys:dict:update']"
              type="primary"
              icon="el-icon-edit"
              plain
              @click.native="goEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['sys:dict:delete']"
              type="danger"
              icon="el-icon-delete"
              @click.native="goDelete(scope.row)"
            >删除</el-button>
            <el-button
              v-permission="['sys:dict:update']"
              type="primary"
              icon="el-icon-edit"
              @click.native="goEditValue(scope.row)"
            >编辑字典值</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row
        type="flex"
        justify="center"
        style="margin-top: 30px"
      >
        <el-pagination
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="totalCount"
          background
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <el-button
          size="mini"
          type="primary"
          class="sureBtn"
          @click.native="handleCurrentChange"
        >确定</el-button>
      </el-row>
    </div>
    <!-- 弹窗部分 -->
    <!-- 添加字典弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="添加字典"
      width="600px"
      center
    >
      <el-form
        ref="addDictionary"
        :model="addDictionary"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="字典名称"
          prop="name"
        >
          <el-input
            v-model="addDictionary.name"
            class="dictionaryValue"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="字典编码"
          prop="code"
        >
          <el-input
            v-model="addDictionary.code"
            class="dictionaryValue"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="数据类型"
          prop="type"
        >
          <el-select
            v-model="addDictionary.type"
            placeholder="默认为空"
            class="dictionaryValue"
          >
            <el-option
              v-for="(item, index) in dataType"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="tips">{{ tips }}</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetForm('addDictionary')">取 消</el-button>
        <el-button
          type="primary"
          @click.native="submitForm('addDictionary')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑字典弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisibleEdit"
      title="编辑字典"
      width="600px"
      center
    >
      <el-form
        ref="editDictionary"
        :model="editDictionary"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="字典名称"
          prop="name"
        >
          <el-input
            v-model="editDictionary.name"
            class="dictionaryValue"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="字典编码"
          prop="code"
        >
          <el-input
            v-model="editDictionary.code"
            class="dictionaryValue"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="数据类型"
          prop="type"
        >
          <el-select
            v-model="editDictionary.type"
            placeholder="默认为空"
            class="dictionaryValue"
          >
            <el-option
              v-for="(item, index) in dataType"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="tips">{{ tips }}</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetDictionaryForm('editDictionary')">取 消</el-button>
        <el-button
          type="primary"
          @click.native="submitDictionaryForm('editDictionary')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  dictionaryList,
  systemConfigType,
  addDigitalDictionary,
  editDigitalDictionary,
  deleteDictionary,
  updateDictionary,
} from '@/api/system.js';

export default {
  name: 'DigitalDictionary',
  components: {},
  data() {
    return {
      centerDialogVisible: false,
      centerDialogVisibleEdit: false,
      tips: '',
      dataType: '',
      pageNum: 1,
      pageSize: 10,
      totalCount: 10,
      totalPage: 10,
      dictionaryData: [],
      addDictionary: {
        name: '',
        code: '',
        type: '',
      },
      editDictionary: {},
      // 存放每行id
      dictionaryId: '',
      rules: {
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择数据类型', trigger: 'change' },
        ],
      },
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    this.getDictionaryList();
    this.configDataType();
  },
  methods: {
    onRouteChange(to) {
      // 监听路由的变化
      if (to.name === 'DigitalDictionary') {
        this.getconfigurationData();
      }
    },

    // 时间格式转化
    dateFormat(time) {
      return time.replace(/-/g, '.');
    },

    // 获取数字字典列表
    getDictionaryList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      dictionaryList(params).then(res => {
        this.dictionaryData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 获取数据类型
    configDataType() {
      systemConfigType().then(res => {
        this.dataType = res.result;
      });
    },

    // 提交添加字典
    submitForm(addDictionary) {
      this.$refs[addDictionary].validate(valid => {
        if (!valid) {
          this.tips = '请填写必填项';
        } else {
          this.tips = '';
          addDigitalDictionary(this.addDictionary).then(res => {
            if (res.code === 200) {
              this.$message.success('添加成功！');
              this.centerDialogVisible = false;
              this.getDictionaryList();
              this.$refs[addDictionary].resetFields();
            } else {
              this.$message.error('添加失败！');
            }
          });
        }
      });
    },

    // 取消添加字典
    resetForm(addDictionary) {
      this.centerDialogVisible = false;
      this.$refs[addDictionary].resetFields();
    },

    // 点击编辑获取单条数据
    goEdit(item) {
      this.dictionaryId = item.id;
      this.centerDialogVisibleEdit = true;
      this.getSingleDictionary();
    },

    // 请求单条数据
    getSingleDictionary() {
      editDigitalDictionary(this.dictionaryId).then(res => {
        this.editDictionary = res.result;
      });
    },

    // 提交编辑字典
    submitDictionaryForm(editDictionary) {
      this.$refs[editDictionary].validate(valid => {
        if (!valid) {
          this.tips = '请填写必填项';
        } else {
          this.tips = '';
          const data = {
            code: this.editDictionary.code,
            id: this.editDictionary.id,
            name: this.editDictionary.name,
            type: this.editDictionary.type,
          };
          updateDictionary(data).then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功！');
              this.centerDialogVisibleEdit = false;
              this.getDictionaryList();
            } else {
              this.$message.error('修改失败！');
            }
          });
        }
      });
    },

    // 取消编辑字典
    resetDictionaryForm(editDictionary) {
      this.centerDialogVisibleEdit = false;
      this.$refs[editDictionary].resetFields();
    },

    // 点击删除
    goDelete(item) {
      this.$confirm('确定删除该字典？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false,
      })
        .then(() => {
          deleteDictionary(item.id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getDictionaryList();
            } else {
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    // 点击编辑字典值跳转页面
    goEditValue(items) {
      this.$router.push({
        name: 'DictionaryValueEdit',
        params: {
          code: items.code,
        },
      });
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
    },

    // 改变当前页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDictionaryList();
    },
  },
};
</script>

<style lang="less" scoped>
.dictionary-container {
  padding: 20px;
  .pagination {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
  .sureBtn {
    margin-left: 20px;
  }
}
.dictionaryValue {
  width: 400px;
}
.tips {
  color: red;
}
</style>
