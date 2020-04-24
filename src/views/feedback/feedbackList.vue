<template>
  <div class="content-container">
    <!-- 反馈管理列表 -->
    <div class="feedbackList">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="来源">
              <el-select
                v-model="formData.clientType"
                placeholder="全部"
                @change="selectSource"
              >
                <el-option
                  v-for="item in sourceList"
                  :key="item.id"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="feedbackList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
        border
        style="width: 100%; margin-top:20px"
      >
        <el-table-column
          label="序号"
          type="index"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="context"
          label="反馈内容"
          width="500"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="clientType"
          label="来源"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="反馈时间"
          align="center"
        >
          <template slot-scope="props">
            <span>{{ dateFormat(props.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="deviceMsg"
          label="设备信息"
          align="center"
        >
          <template slot-scope="props">
            <div v-if="props.row.equipmentVersion">设备版本：{{ props.row.equipmentVersion }}</div>
            <div v-if="props.row.versionCode">行家版本：{{ props.row.versionCode }}</div>
            <div v-if="props.row.distinguishability">分辨率：{{ props.row.distinguishability }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="images"
          label="图片"
          width="500px"
          fixed="right"
        >
          <template slot-scope="props">
            <img
              v-for="(item, index) in props.row.images"
              v-if="item"
              :src="item"
              :key="index"
              preview="1"
              class="imgs"
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="totalCount">
        <span style="margin-left:10px">共{{ totalPage }}页 {{ totalCount }}条记录</span>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page.sync="formData.pageNum"
          :page-size="formData.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <el-button
          type="primary"
          size="mini"
          style="height: 28px; margin-left: 10px"
          @click="handleCurrentChange"
        >确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getFeedbackList } from '@/api/feedback';

export default {
  name: 'FeedbackList',
  data() {
    return {
      formData: {
        clientType: '',
        pageNum: 1,
        pageSize: 10,
      },
      totalPage: 0,
      totalCount: 0,
      sourceList: [
        {
          text: '全部',
          value: '',
          id: 1,
        },
        {
          text: 'ios',
          value: 'ios',
          id: 2,
        },
        {
          text: 'android',
          value: 'android',
          id: 3,
        },
        {
          text: 'h5',
          value: 'h5',
          id: 4,
        },
        {
          text: 'pc',
          value: 'pc',
          id: 5,
        },
      ],
      feedbackList: [],
    };
  },
  created() {
    this.feedbackData();
  },
  methods: {
    // 时间格式转化
    dateFormat(time) {
      return time.replace(/-/g, '.');
    },

    // 获取列表数据
    feedbackData() {
      getFeedbackList(this.formData).then(res => {
        this.totalPage = res.result.totalPage;
        this.totalCount = res.result.totalCount;
        this.feedbackList = res.result.list.map(i => {
          if (i.images) i.images = i.images.split(',');
          return i;
        });
        setTimeout(() => {
          this.$previewRefresh();
        }, 1000);
      });
    },

    selectSource(item) {
      // console.log('item', item);
      this.feedbackData();
    },

    // 分页
    handleSizeChange(val) {
      this.formData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.formData.pageNum = val;
      this.feedbackData();
    },
  },
};
</script>
<style lang="less" scoped>
.feedbackList {
  padding: 10px 20px;
  .imgs {
    width: 100px;
    height: 70px;
    margin-right: 25px;
  }
  .totalCount {
    text-align: right;
    margin: 20px 0;
    font-size: 14px;
  }
  .block {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>