<template>
  <div class="content-container">
    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col :span="3">
      </el-col>

      <el-col :span="2" style="text-align: center;">
        <el-button type="primary" v-permission="['sys:menu:select', 'sys:menu:list']"
                   @click.native="getTableData" >查询</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="24">
        <tree-table-2
          :data="tableData"
          :columns="tableColums"
          :expand-all="false"
          border
          max-height="700"
          @on-select="onSelectCheckBox"
        >
          <el-table-column label="操作" min-width="360" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-permission="['sys:menu:update']"
                icon="el-icon-edit"
                @click.native="onEdit(scope.row)"
              >编辑</el-button>
              <el-button
                v-permission="['sys:menu:delete']"
                icon="el-icon-delete"
                type="danger"
                @click.native="onDelete([scope.row])"
              >删除</el-button>
              <el-button
                v-if="scope.row._level !== 4"
                v-permission="['sys:menu:save']"
                icon="el-icon-plus"
                type="primary"
                @click.native="onAdd(scope.row)"
              >添加子菜单</el-button>
            </template>
          </el-table-column>
        </tree-table-2>
      </el-col>
    </el-row>

    <!-- 添加类目，子类目 -->
    <el-dialog
      :visible.sync="state.isShowDialog"
      width="500px"
      @close="dialogForm.name = '', dialogForm.sort = 1"
    >
      <el-row
        :gutter="10"
        type="flex"
        align="middle"
        style="padding-left: 20px;margin-bottom: 30px"
      >
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categoryName">菜单类型：</label>
        </el-col>
        <el-col :span="10">
          <el-select v-model="dialogForm.type" :disabled="!state.hasProjectType" placeholder="请选择菜单类型">
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
          <label style="display: inline-block;" for="dialog-categoryName">菜单名称：</label>
        </el-col>
        <el-col :span="10">
          <el-input id="dialog-categoryName" v-model="dialogForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" align="middle" style="padding-left: 20px; margin-top: 30px;">
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categoryName">菜单编码：</label>
        </el-col>
        <el-col :span="10">
          <el-input id="dialog-categoryName" v-model="dialogForm.code" placeholder="请输入菜单编码"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" align="middle" style="padding-left: 20px; margin-top: 30px;">
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categoryName">权限编码：</label>
        </el-col>
        <el-col :span="10">
          <el-input id="dialog-categoryName" v-model="dialogForm.perms" placeholder="请输入授权标识"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" align="middle" style="padding-left: 20px; margin-top: 30px;">
        <el-col :span="5" right>
          <label style="display: inline-block;" for="dialog-categorySort">排序：</label>
        </el-col>
        <el-col :span="10">
          <el-input id="dialog-categorySort" v-model="dialogForm.seq" placeholder="请输入排序"></el-input>
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
import treeTable2 from "@/components/TreeTable2";
import {
  getMenuList,
  delMenu,
  updateMenu,
  queryById,
  editMenu,
} from "@/api/system.js";

export default {
  name: "SystemMenu",
  components: {
    treeTable2
  },
  data() {
    return {
      state: {
        name: "",
        phoneNumber: "",
        status: "",
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        total: 40,
        selectedItems: [],
        isShowDialog: false,
        dialogType: 1,
        hasProjectType: false
      },
      filter: {
        // 类目id
        menuId: "",
        // 类目名称
        menuName: ""
      },
      dialogForm: {
        type: "",
        menuName: "",
        code:"",
        perms:"",
        icon:"",
        status:"",
        seq: 1,
        parentId: 0,
      },
      projectOption: [
        {
          text: "菜单",
          value: 1
        },
        {
          text: "权限",
          value: 2
        }
      ],
      tableColums: [
        {
          text: "菜单ID",
          width: 130,
          align: "left",
          value: "menuId"
        },
        {
          text: "菜单名称",
          expand: true,
          width: 300,
          align: "left",
          value: "menuName"
        },
        {
          text: "菜单编码",
          width: 230,
          align: "left",
          value: "code"
        },
        {
          text: "权限编码",
          width: 230,
          align: "left",
          value: "perms"
        },
        {
          text: "图标",
          width: 150,
          align: "left",
          value: "icon"
        },
        {
          text: "排序",
          width: 150,
          align: "left",
          value: "sort"
        },
        {
          text: "状态",
          width: 150,
          align: "left",
          value: "status"
        },
      ],
      tableData: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 清空筛选栏
    clearFormFilter() {
      this.filter.menuId = "";
      this.filter.menuName = "";
    },
    // 单选 or 全选
    onSelectCheckBox(selection) {
      this.state.selectedItems = selection;
    },
    onAdd(item) {
      // this.state.hasProjectType = item;
      // this.dialogForm.id = "";
      // if (item) {
      //   console.log('p', item);
      //   // 添加子类目
      //   this.dialogForm.parentId = item.id;
      //   this.dialogForm.parentName = item.name;
      //   this.dialogForm.level = item._level + 1;
      //   this.dialogForm.name = "";
      //   this.dialogForm.projectType = item.projectType;
      // } else {
      //   // 添加主类目
      //   this.dialogForm.parentId = "";
      //   this.dialogForm.level = 1;
      //   this.dialogForm.name = "";
      //   this.dialogForm.projectType = "";
      // }
      this.state.isShowDialog = true;
      this.state.hasProjectType=true;
      console.log(item.id);
      console.log(item)
      this.dialogForm.parentId=item.menuId;
      this.dialogForm.menuName='';
      this.dialogForm.type='';
      this.dialogForm.code='';
      this.dialogForm.perms='';
      this.dialogForm.seq='';
    },
    onEdit(item) {

      // type: "",
      //   menuName: "",
      //   code:"",
      //   perms:"",
      //   icon:"",
      //   status:"",
      //   seq: 1,
      //   parentId: 0,

      //先查询根据id
      queryById(Number(item.menuId)).then(res =>{
        console.log(res.result.menuName)
        this.dialogForm.menuName=res.result.menuName;
        this.dialogForm.type=res.result.type;
        this.dialogForm.code=res.result.code;
        this.dialogForm.perms=res.result.perms;
        this.dialogForm.seq=res.result.seq;
        this.dialogForm.menuId=res.result.menuId;

      })

      console.log('r', item);
      this.dialogForm.parentId = item.parentId;
      this.dialogForm.id = item.id;
      this.dialogForm.level = item._level;
      this.dialogForm.sort = item.sort;
      this.dialogForm.name = item.name;
      this.dialogForm.projectType = item.projectType;
      this.state.isShowDialog = true;
    },
    // 请求菜单类目列表数据
    async getTableData() {
      const res = await getMenuList();
      if (res.code !== 200) return Promise.reject();

      const adapterFn = (arr = []) => {
        return arr.map(i => {
          const item = {
            menuId: i.menuId,
            menuName: i.menuName,
            code: i.code,
            perms: i.perms,
            icon: i.icon,
            seq: i.seq || 1,
            projectType: i.type,
            parentId: i.parentId,
            status: i.status === 0 ? '正常' : '禁用',
          };
          if (i.children) item.children = adapterFn(i.children);
          return item;
        });
      };

      this.tableData = adapterFn(res.result.tree || []);

      // 清空选择的项
      this.state.selectedItems = [];
    },
    // 添加主类目 or 子类目
    addCategory() {
      const data = {
        type: this.dialogForm.type,
        menuName: this.dialogForm.menuName,
        code: this.dialogForm.code,
        perms: this.dialogForm.perms,
        seq: this.dialogForm.seq,
        parentId:this.dialogForm.parentId,
        status:0
      };

      updateMenu(data).then(res => {
        console.log("commit", res);
        if (res.code === 200) {
          this.$message.success("添加成功！");
          this.state.isShowDialog = false;
          this.getTableData();
        } else {
          this.$message.error("添加失败！");
        }
      });
    },

    // 编辑类目
    editCategory() {
      const data = {
        type: this.dialogForm.type,
        menuName: this.dialogForm.menuName,
        code: this.dialogForm.code,
        perms: this.dialogForm.perms,
        seq: this.dialogForm.seq,
        parentId:this.dialogForm.parentId,
        status:0,
        menuId:this.dialogForm.menuId,
      };

      editMenu(data).then(res => {
        console.log("commit", res);
        if (res.code === 200) {
          this.$message.success("修改成功！");
          this.state.isShowDialog = false;
          this.getTableData();
        } else {
          this.$message.error("修改失败！");
        }
      });

    },

    // 如果没有选择，则提醒
    // 返回Boolean
    checkSelectIsNull(items = []) {
      if (items.length <= 0) {
        this.$confirm("请至少勾选一条数据！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        });
        return true;
      }
      return false;
    },

    // 删除类目
    async onDelete(items = []) {
      console.log(items)
      // 若勾选的所有类目数据中，只要有一个类目课程数量不为0，则不允许删除
      const recursionFn = (arr = []) =>
        arr.some(i => {
          if (i.children && i.children.length > 0) {
            return true;
          }
          return false;
        });
      const noPass = recursionFn(items);
      if (noPass) {
        this.$confirm(
          "该类目及其子分类下菜单数量不为0，无法删除！请确保该类目及其子分类下无菜单后再执行删除操作！",
          "删除类目提示",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "warning"
          }
        );
      } else {
        const confimRes = await this.$confirm(
          "确定要删除该权限",
          "删除类目",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        if (confimRes) {
          // 确认删除的回调
          const ids = items.map(i => i.menuId);
          console.log(ids)
          const { code } = await delMenu(ids);
          if (code === 200) {
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            // 重新获取列表
            this.getTableData();
          }
        }
      }
    },

    onDialogConfirm() {
       const isEdit = !!this.dialogForm.menuId;

      // if (this.state.hasProjectType) {
      //   if (!this.dialogForm.projectType) {
      //     this.$message({
      //       message: "请选择所属项目",
      //       type: "error"
      //     });
      //   } else if (!this.dialogForm.name) {
      //     this.$message({
      //       message: "请填写类目名称",
      //       type: "error"
      //     });
      //     return false;
      //   }
      // }
      // // 编辑
       if (isEdit) {
         this.editCategory();
       } else {
         // 添加
         this.addCategory();
       }

    }
  }
};
</script>

<style scoped>
</style>
