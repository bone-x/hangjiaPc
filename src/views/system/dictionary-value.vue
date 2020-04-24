<template>
  <div class="content-container">
    <!-- 系统管理 - 数字字典-编辑字典值 -->
    <div class="edit-dictionary">
      <div>
        <el-button type="primary" @click.native="addValue">添加字典值</el-button>
      </div>
      <el-table :data="dictionaryValue" border style="width: 90%; margin-top:30px" :header-cell-style="{background: '#eef1f6', color: '#606266', width: '100%'}">
        <el-table-column prop="code" label="字典编码" width="200"></el-table-column>
        <el-table-column prop="value" label="字典值" width="230"></el-table-column>
        <el-table-column prop="label" label="字典显示值" width="200"></el-table-column>
        <el-table-column prop="seq" label="排序" width="230"></el-table-column>
        <el-table-column prop="updateName" label="修改人" width="180"></el-table-column>
        <el-table-column fixed="right" width="300" prop="operating" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click.native="goEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click.native="goDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page.sync="dictionaryParams.pageNum"
          :page-size="dictionaryParams.pageSize"
          :total="totalCount"
          background
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <el-button size="mini" type="primary" class="sureBtn" @click.native="handleCurrentChange">确定</el-button>
      </div>
    </div>
    <!-- 弹窗部分 -->
    <!-- 添加字典值弹窗 -->
    <el-dialog :visible.sync="centerDialogVisible" title="添加字典值" width="600px" center>
      <el-form
        ref="addDictionaryValue"
        :model="addDictionaryValue"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="addDictionaryValue.code" disabled class="dictionaryValue codeInput"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="addDictionaryValue.value" class="dictionaryValue"></el-input>
        </el-form-item>
        <el-form-item label="字典显示值" prop="label">
          <el-input v-model="addDictionaryValue.label" class="dictionaryValue"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input
            v-model.number="addDictionaryValue.seq"
            autocomplete="off"
            class="dictionaryValue"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span class="tips">{{ tips }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="resetForm('addDictionaryValue')">取 消</el-button>
        <el-button type="primary" @click.native="submitForm('addDictionaryValue')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑字典值弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisibleEdit"
      title="编辑字典值"
      width="600px"
      center
      class="dialog"
    >
      <el-form
        ref="editValue"
        :model="editValue"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="editValue.code" disabled class="dictionaryValue codeInput"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="editValue.value" class="dictionaryValue"></el-input>
        </el-form-item>
        <el-form-item label="字典显示值" prop="label">
          <el-input v-model="editValue.label" class="dictionaryValue"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model.number="editValue.seq" class="dictionaryValue"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="tips">{{ tips }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="resetFormEdit('editValue')">取 消</el-button>
        <el-button type="primary" @click.native="submitFormEdit('editValue')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  editDictionaryList,
  addDictionarySubmit,
  editDictionaryValue,
  fixDictionaryValue,
  deleteDictionaryDetail
} from "@/api/system.js";

export default {
  name: "DictionaryValueEdit",
  components: {},
  data() {
    return {
      dictionaryValue: [], // 字典值列表数据
      totalCount: 10,
      totalPage: 10,
      centerDialogVisible: false, // 添加字典值弹窗开关
      centerDialogVisibleEdit: false, // 编辑字典值弹窗开关
      dictionaryParams: { // 获取列表所需请求参数
        queryKey: "code",
        queryValue: "",
        pageNum: 1,
        pageSize: 10,
        sidx: 'seq',
        sort: 'ascending',
      },
      addDictionaryValue: { // 添加字典值数据
        value: "",
        code: "",
        label: "",
        seq: ""
      },
      editValue: {}, // 编辑字典值数据
      tips: "", // 弹窗提示语
      rules: { // 表单验证
        value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
        code: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
        label: [
          { required: true, message: "请输入字典显示值", trigger: "blur" }
        ],
        seq: [
          { required: true, message: "请输入序号" },
          { type: "number", message: "序号必须为数字值" }
        ]
      }
    };
  },
  created() {
    this.dictionaryParams.queryValue = this.$route.params.code;
    this.addDictionaryValue.code = this.$route.params.code;
    this.getValueList();
  },
  methods: {
    onRouteChange() {
      // 监听路由的变化
    },

    // 获取列表数据
    getValueList() {
      // this.dictionaryParams.sidx = this.addDictionaryValue.seq;
      console.log('you', this.dictionaryParams);
      editDictionaryList(this.dictionaryParams).then(res => {
        this.dictionaryValue = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 点击添加字典值
    addValue() {
      this.centerDialogVisible = true;
    },

    // 提交添加字典
    submitForm(addDictionaryValue) {
      this.$refs[addDictionaryValue].validate(valid => {
        if (!valid) {
          this.tips = "请填写必填项";
        } else {
          this.tips = '';
          addDictionarySubmit(this.addDictionaryValue).then(res => {
            if (res.code === 200) {
              this.$message.success("添加成功！");
              this.centerDialogVisible = false;
              this.getValueList();
              this.$refs[addDictionaryValue].resetFields();
            } else {
              this.$message.error("添加失败！");
            }
          });
        }
      });
    },

    // 取消添加字典值
    resetForm(addDictionaryValue) {
      this.centerDialogVisible = false;
      this.$refs[addDictionaryValue].resetFields();
    },

    // 点击编辑获取单条数据
    goEdit(items) {
      this.centerDialogVisibleEdit = true;
      editDictionaryValue(items.id).then(res => {
        this.editValue = res.result;
      });
    },

    // 提交编辑字典值
    submitFormEdit(editValue) {
      const data = {
        code: this.editValue.code,
        label: this.editValue.label,
        value: this.editValue.value,
        seq: this.editValue.seq,
        id: this.editValue.id
      };
      this.$refs[editValue].validate(valid => {
        if (!valid) {
          this.tips = "请填写必填项";
        } else {
          this.tips = '';
          fixDictionaryValue(data).then(res => {
            if (res.code === 200) {
              this.$message.success("修改成功！");
              this.centerDialogVisibleEdit = false;
              this.getValueList();
            } else {
              this.$message.error("修改失败！");
            }
          });
        }
      });    
    },

    // 取消编辑字典
    resetFormEdit(editValue) {
      this.centerDialogVisibleEdit = false;
      this.tips = "";
      this.$refs[editValue].resetFields();
    },

    // 删除字典值
    goDelete(items) {
      this.$confirm("确定删除该字典值？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      })
        .then(() => {
          deleteDictionaryDetail(items.id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getValueList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分页
    handleSizeChange(val) {
      this.dictionaryParams.pageSize = val;
    },

    // 改变当前页
    handleCurrentChange(val) {
      this.dictionaryParams.pageNum = val;
      this.getValueList();
    }
  }
};
</script>

<style lang="less" scoped>
.edit-dictionary {
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
.codeInput {
  border: none;
}

.tips {
  color: red;
}

</style>
