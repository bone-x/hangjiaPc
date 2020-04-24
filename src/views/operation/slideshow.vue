<template>
  <div class="content-container">
    <!-- 运营管理 - 首页轮播图列表 -->
    <div class="slidepage">
      <div class="goodshow">
        <div>
          <p class="goodtxt">轮播展示</p>
          <span
            style="display:inline-block;margin-left:10px;font-size:12px;line-height:50px;color:rgb(255, 133, 3)"
          >最多8个展位</span>
          <el-button type="primary" class="goodbtn" @click.native="goAddSlide">新建轮播</el-button>
        </div>

        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane name="first">
            <span slot="label" style="width:150px;display:inline-block;text-align:center;">PC端</span>
            <!-- 轮播展示的表格 -->
            <el-table :data="slideTableData1" style="width: 100%" fixed="right" border>
              <el-table-column type="index" label="排序" width="80"></el-table-column>

              <el-table-column :show-overflow-tooltip="true" prop="title" label="展示标题" width="180"></el-table-column>

              <el-table-column label="图片" width="120">
                <template slot-scope="scope">
                  <img :src="scope.row.imgUrl" style="width:100%;height:80px">
                </template>
              </el-table-column>

              <el-table-column prop="jumpUrl" label="跳转链接" width="200">
                <template slot-scope="scope">
                  <a
                    :href="scope.row.jumpUrl"
                    target="_blank"
                    class="jumpLink"
                  >{{ scope.row.jumpUrl }}</a>
                </template>
              </el-table-column>

              <el-table-column prop="syncTime" label="生效时间" min-width="100">
                <template slot-scope="scope">{{ timeFormat(scope.row.syncTime) }}</template>
              </el-table-column>

              <el-table-column prop="creatorName" label="创建人" min-width="80"></el-table-column>
              <el-table-column prop="updateName" label="修改人" min-width="80"></el-table-column>

              <el-table-column prop="status" label="状态" min-width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.status === 0 ? '未生效':'已生效' }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="remark" label="操作" width="350" fixed="right">
                <template slot-scope="props">
                  <el-button
                    :disabled="props.$index===0"
                    class="finger"
                    type="primary"
                    plain
                    @click.native="slideForUp(props.row.id)"
                  >上移</el-button>
                  <el-button
                    :disabled="props.$index === (slideTableData1.length - 1)"
                    type="primary"
                    plain
                    @click.native="slideForDown(props.row.id)"
                  >下移</el-button>
                  <el-button type="primary" plain @click.native="goEditSlice(props)">编辑</el-button>
                  <el-button type="danger" @click.native="slideTableDataDelete(props.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" style="width:150px;display:inline-block;text-align:center;">H5</span>
            <!-- 轮播展示的表格 -->
            <el-table :data="slideTableData2" style="width: 100%" fixed="right" border>
              <el-table-column type="index" label="排序" width="80"></el-table-column>

              <el-table-column :show-overflow-tooltip="true" prop="title" label="展示标题" width="180"></el-table-column>

              <el-table-column label="图片" width="120">
                <template slot-scope="scope">
                  <img :src="scope.row.imgUrl" style="width:100%;height:80px">
                </template>
              </el-table-column>

              <el-table-column prop="jumpUrl" label="跳转链接" width="200">
                <template slot-scope="scope">
                  <a
                    :href="scope.row.jumpUrl"
                    target="_blank"
                    class="jumpLink"
                  >{{ scope.row.jumpUrl }}</a>
                </template>
              </el-table-column>

              <el-table-column prop="syncTime" label="生效时间" min-width="100">
                <template slot-scope="scope">{{ timeFormat(scope.row.syncTime) }}</template>
              </el-table-column>

              <el-table-column prop="creatorName" label="创建人" min-width="80"></el-table-column>
              <el-table-column prop="updateName" label="修改人" min-width="80"></el-table-column>

              <el-table-column prop="status" label="状态" min-width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.status === 0 ? '未生效':'已生效' }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="remark" label="操作" width="350" fixed="right">
                <template slot-scope="props">
                  <el-button
                    :disabled="props.$index===0"
                    class="finger"
                    type="primary"
                    plain
                    @click.native="slideForUp(props.row.id)"
                  >上移</el-button>
                  <el-button
                    :disabled="props.$index === (slideTableData2.length - 1)"
                    type="primary"
                    plain
                    @click.native="slideForDown(props.row.id)"
                  >下移</el-button>
                  <el-button type="primary" plain @click.native="goEditSlice(props)">编辑</el-button>
                  <el-button type="danger" @click.native="slideTableDataDelete(props.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="third">
            <span slot="label" style="width:150px;display:inline-block;text-align:center;">App</span>
            <!-- 轮播展示的表格 -->
            <el-table :data="slideTableData3" style="width: 100%" fixed="right" border>
              <el-table-column type="index" label="排序" width="80"></el-table-column>

              <el-table-column :show-overflow-tooltip="true" prop="title" label="展示标题" width="180"></el-table-column>

              <el-table-column label="图片" width="120">
                <template slot-scope="scope">
                  <img :src="scope.row.imgUrl" style="width:100%;height:80px">
                </template>
              </el-table-column>

              <el-table-column prop="jumpUrl" label="跳转链接" width="200">
                <template slot-scope="scope">
                  <a
                    :href="scope.row.jumpUrl"
                    target="_blank"
                    class="jumpLink"
                  >{{ scope.row.jumpUrl }}</a>
                </template>
              </el-table-column>

              <el-table-column prop="syncTime" label="生效时间" min-width="100">
                <template slot-scope="scope">{{ timeFormat(scope.row.syncTime) }}</template>
              </el-table-column>

              <el-table-column prop="creatorName" label="创建人" min-width="80"></el-table-column>
              <el-table-column prop="updateName" label="修改人" min-width="80"></el-table-column>

              <el-table-column prop="status" label="状态" min-width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.status === 0 ? '未生效':'已生效' }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="remark" label="操作" width="350" fixed="right">
                <template slot-scope="props">
                  <el-button
                    :disabled="props.$index===0"
                    class="finger"
                    type="primary"
                    plain
                    @click.native="slideForUp(props.row.id)"
                  >上移</el-button>
                  <el-button
                    :disabled="props.$index === (slideTableData3.length - 1)"
                    type="primary"
                    plain
                    @click.native="slideForDown(props.row.id)"
                  >下移</el-button>
                  <el-button type="primary" plain @click.native="goEditSlice(props)">编辑</el-button>
                  <el-button type="danger" @click.native="slideTableDataDelete(props.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- ----- 分界线 ----- -->
      <div class="goodshow study">
        <p class="goodtxt">大家在学</p>
        <span
          style="display:inline-block;margin-left:10px;font-size:12px;line-height:50px;color:rgb(255, 133, 3)"
        >不限展位</span>
        <el-button type="primary" class="goodbtn" @click.native="goAddSlideTwo">新建展示</el-button>
        <!-- 大家在学的表格 -->
        <el-table :data="allStudy" style="width: 100%" fixed="right" border>
          <el-table-column prop="$id" label="排序" width="80"></el-table-column>

          <el-table-column :show-overflow-tooltip="true" prop="title" label="展示标题" width="180"></el-table-column>

          <el-table-column label="图片" width="120">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" style="width:100%;height:80px">
            </template>
          </el-table-column>

          <el-table-column prop="jumpUrl" label="跳转链接" width="200">
            <template slot-scope="scope">
              <a :href="scope.row.jumpUrl" target="_blank" class="jumpLink">{{ scope.row.jumpUrl }}</a>
            </template>
          </el-table-column>

          <el-table-column prop="syncTime" label="生效时间" min-width="100">
            <template slot-scope="scope">{{ timeFormat(scope.row.syncTime) }}</template>
          </el-table-column>

          <el-table-column prop="creatorName" label="创建人" min-width="80"></el-table-column>
          <el-table-column prop="updateName" label="修改人" min-width="80"></el-table-column>

          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.status === 0 ? '未生效':'已生效' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="操作" width="350" fixed="right">
            <template slot-scope="props">
              <el-button
                :disabled="props.row.$id === 1"
                class="finger"
                type="primary"
                plain
                @click.native="allStudyToUp(props.row.id)"
              >上移</el-button>
              <el-button
                :disabled="props.row.$id === total"
                type="primary"
                plain
                @click.native="allStudyToDown(props.row.id)"
              >下移</el-button>
              <el-button type="primary" plain @click.native="goStudyEditSlice(props)">编辑</el-button>
              <el-button type="danger" @click.native="allStudyToDelete(props.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="display:flex;justify-content:center;margin:20px 0px">
          <el-pagination
            :total="total"
            :page-size="8"
            :current-page.sync="currentPage"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" title="提示" width="30%" center>
      <span>当前轮播位置已满，请删除部分数据后再操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  slideList,
  slideToUp,
  slideToDown,
  slideDelete,
  allStudyList,
  allStudyUp,
  allStudyDown,
  allStudyDelete
} from "@/api/operation";
import { formatDate } from "@/utils/index";

export default {
  name: "OperationManageSlideshow",
  components: {},
  data() {
    return {
      // 切换到那个表格
      activeName: "first",
      // 第一个表格数据（仅展示8条）
      slideTableData1: [],
      slideTableData2: [],
      slideTableData3: [],
      // 提示弹窗
      centerDialogVisible: false,
      // 大家在学请求数据
      allStudy: [],
      // 外层数据
      allData: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      total: null
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    this.getList1();
    this.getList2();
    this.getList3();
    this.getStudyList();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === "OperationManageSlideshow") {
        this.getList1();
        this.getList2();
        this.getList3();
        this.getStudyList();
      }
    },
    timeFormat: formatDate, // 时间戳转化
    // 轮播展示请求数据
    getList1() {
      const params = {
        type: 1
      };
      slideList(params)
        .then(res => {
          if (res.code === 200) {
            console.log(res, "请求的列表数据");
            this.slideTableData1 = res.result.slice(0, 8);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList2() {
      const params = {
        type: 2
      };
      slideList(params)
        .then(res => {
          if (res.code === 200) {
            console.log(res, "请求的列表数据");
            this.slideTableData2 = res.result.slice(0, 8);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList3() {
      const params = {
        type: 3
      };
      slideList(params)
        .then(res => {
          if (res.code === 200) {
            console.log(res, "请求的列表数据");
            this.slideTableData3 = res.result.slice(0, 8);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 轮播上移
    slideForUp(id) {
      slideToUp(id)
        .then(res => {
          this.getList1();
          this.getList2();
          this.getList3();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 轮播下移
    slideForDown(id) {
      slideToDown(id)
        .then(res => {
          this.getList1();
          this.getList2();
          this.getList3();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击轮播展示-删除
    slideTableDataDelete(id) {
      slideDelete(id)
        .then(res => {
          if (res.code === 200) {
            this.getList1();
            this.getList2();
            this.getList3();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击新建轮播跳转
    goAddSlide() {
      this.$router.push("index-slideshow/add");
      // 先判断哪个端，然后对每个端的数据的长度校验
      // if (this.activeName === 'first') {
      //      if (this.slideTableData1.length === 8) {
      //         this.$message.warning("当前PC轮播位置已满，请删除部分数据后再操作!");
      //       } else {
      //         this.$router.push("index-slideshow/add");
      //       }
      // } else if (this.activeName === 'second') {
      //   if (this.slideTableData2.length === 8) {
      //         this.$message.warning("当前H5轮播位置已满，请删除部分数据后再操作!");
      //       } else {
      //         this.$router.push("index-slideshow/add");
      //       }
      // } else if (this.activeName === 'third') {
      //   if (this.slideTableData3.length === 8) {
      //         this.$message.warning("当前APP轮播位置已满，请删除部分数据后再操作!");
      //       } else {
      //         this.$router.push("index-slideshow/add");
      //       }
      // } 
    },

    // 点击首页轮播表格里面的编辑跳转
    goEditSlice(props) {
      this.$router.push({
        name: "OperationManageSlideshowEdit",
        params: {
          id: props.row.id
        }
      });
    },

    // 大家在学请求数据
    getStudyList(currPage) {
      const params = {
        pageSize: 8,
        pageNum: currPage || this.currentPage
      };
      allStudyList(params)
        .then(res => {
          if (res.code === 200) {
            this.allStudy = res.result.list;
            this.allStudy.map((item, index) => {
              if (this.pageNum === 1) {
                this.$set(item, "$id", index + 1);
              } else if (this.pageNum > 1) {
                let num = (this.pageNum - 1) * 8;
                this.$set(item, "$id", index + num + 1);
              } else {
                return false;
              }
              return true;
            });
            this.total = res.result.totalCount;
            this.pageSize = res.result.size || 10;
            this.currentPage = res.result.currPage;
            console.log("data", this.allStudy);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 大家在学上移
    allStudyToUp(id) {
      allStudyUp(id)
        .then(res => {
          this.getStudyList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 大家在学下移
    allStudyToDown(id) {
      allStudyDown(id)
        .then(res => {
          this.getStudyList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 大家在学删除
    allStudyToDelete(id) {
      allStudyDelete(id)
        .then(res => {
          this.getStudyList();
          this.$message.success("删除成功！");
        })
        .catch(err => {
          this.$message.error("删除失败！");
          console.log(err);
        });
    },
    goAddSlideTwo() {
      this.$router.push("index-slideshow/all/add");
    },
    // 分页
    /**
     * 页面大小发生变化
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getStudyList();
    },
    /**
     * 当前页码发生变化
     */
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getStudyList(val);
    },

    // 大家在学编辑跳转
    goStudyEditSlice(props) {
      // 点击编辑按钮跳转到商品详情页
      this.$router.push({
        name: "OperationManageSlideshowAllEdit",
        params: {
          id: props.row.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.slidepage {
  height: 100%;
  padding: 10px 20px;
  .goodshow {
    overflow: hidden;
    margin-bottom: 20px;
    .jumpLink:hover {
      text-decoration: underline;
      color: blue;
    }
    .goodtxt {
      float: left;
      font-weight: bold;
    }
    .goodbtn {
      float: right;
    }
  }
  .study {
    margin-top: 30px;
  }
}
</style>
