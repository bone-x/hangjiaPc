<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="选择商品"
      width="70%"
      left>
      <div>
        <el-form
          :inline="true"
          :model="formInline"
          class="flex-center">
          <el-form-item
            label
            class="selectbox magin-left">
            <el-select v-model="formInline.status">
              <el-option
                v-for="(item,idx) in goodsStatus"
                :key="idx"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label
            class="selectbox magin-left">
            <el-select v-model="formInline.push">
              <el-option
                v-for="(item,idx) in pushStatus"
                :key="idx"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-select
              :remote-method="remoteMethod"
              :loading="loading"
              v-model="formInline.search"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="商品名称"
            >
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-button
              icon="el-icon-search"
              @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格部分 -->
      <div>
        <el-table
          :data="tableData"
          size="small">
          <el-table-column
            prop="name"
            label="商品名称"></el-table-column>
          <el-table-column
            prop="name"
            label="教师名称"></el-table-column>
          <el-table-column
            prop="address"
            label="价格"></el-table-column>
          <el-table-column
            prop="address"
            label="商品描述"></el-table-column>
        </el-table>
      </div>

      <!-- 分页选择 -->
      <div class="block">
        <el-pagination
          :page-size="100"
          :total="1000"
          :current-page.sync="currentPage3"
          layout="prev, pager, next, jumper"
          class="simplepage"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>

      <span
        slot="footer"
        class="dialog-footer sure">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          class="yes"
          @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SlideAddTable',
  data() {
    return {
      centerDialogVisible: false,
      // 这里放的是表单提交的数据
      formInline: {
        status: '课程一级类目',
        push: '课程二级类目',
        search: '', // 搜索框输入的内容
      },
      goodsStatus: [
        {
          id: 2134346,
          label: '课程一级类目',
          value: 'allaction',
        },
        {
          id: 32453534,
          label: '一级课程类目1',
          value: 'NotStarted',
        },
        {
          id: 897856,
          label: '一级课程类目2',
          value: 'end',
        },
        {
          id: 34564567,
          label: '一级课程类目3',
          value: 'allaction',
        },
      ],
      pushStatus: [
        {
          id: 76897897,
          label: '课程二级类目',
        },
        {
          id: 34534564,
          label: '二级课程类目1',
        },
        {
          id: 678967896,
          label: '二级课程类目2',
        },
        {
          id: 4534543567,
          label: '二级课程类目3',
        },
      ],
      options4: [],
      list: [],
      loading: false,
      total: '',
      currentPage3: 5,
      states: [
        // 这里的数据是从后端拿到的
        'Alabama',
        'Alaska',
        'Arizona',
        'Connecticut',
        'Delaware',
        'Florida',
        'Wyoming',
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    };
  },
  methods: {
    onSubmit() {},
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    close() {
      this.show;
      console.log(666);
    },
  },
};
</script>
