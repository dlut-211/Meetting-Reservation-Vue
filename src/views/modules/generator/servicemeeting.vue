<template>
  <div class="mod-config" style="border:0px">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.key"
          placeholder="预约人姓名"
          clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('generator:servicemeeting:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button
          v-if="isAuth('generator:servicemeeting:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <!-- <el-button type="primary" plain @click="getCurrentList()">当前记录</el-button>
        <el-button type="primary" plain>历史记录</el-button> -->
        <el-radio v-model="radio" label="1" border @change="getCurrentList()">当前记录</el-radio>
        <el-radio v-model="radio" label="2" border @change="getHistoryList()">历史记录</el-radio>         
      </el-form-item>
    </el-form>
    <!-- 当前记录的表格 -->
    <span v-if="this.radio == 1">
      <el-table
      :data="currentList"
      border
      stripe
      sortable
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%"
      height="550">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="item.department"
        header-align="center"
        align="center"
        label="使用单位">
      </el-table-column>
      <el-table-column
        prop="item.roomName"
        header-align="center"
        align="center"
        label="会议室名称">
      </el-table-column>
      <el-table-column
        prop="item.roomUser"
        header-align="center"
        align="center"
        label="预约人">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="item.startTime"
        header-align="center"
        align="center"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="item.endTime"
        header-align="center"
        align="center"
        label="结束时间">
      </el-table-column>     
      <el-table-column
        prop="item.status"
        header-align="center"
        align="center"
        label="预约状态">
        <template slot-scope="scope">
          <span v-if="scope.row.item.status == 0">已成功</span>
          <span v-else-if="scope.row.item.status == 1">已取消</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"            
            @click="dialogTableVisible = true;detailsClick(scope.row.item.orderId)">详情
          </el-button>
          <el-dialog
            title="详细信息" 
            :visible.sync="dialogTableVisible"
            :append-to-body="true"
            width="40%"
            center>
            <el-table :data="details">
              <el-table-column
                prop="meetingTheme"
                label="会议主题"></el-table-column>
              <el-table-column prop="leader" label="参会人员"></el-table-column>
              <el-table-column
                prop="headCount"
                label="参会人数"></el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <span v-if="scope.row.remark == null">无</span>
                  <span v-else>{{ scope.row.remark }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>  
          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.item.orderId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </span>
    <!-- 历史记录的表格 -->
    <span v-else-if="this.radio == 2">
      <el-table
      :data="historyList"
      border
      stripe
      sortable
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%"
      height="550">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="item.department"
        header-align="center"
        align="center"
        label="使用单位">
      </el-table-column>
      <el-table-column
        prop="item.roomName"
        header-align="center"
        align="center"
        label="会议室名称">
      </el-table-column>
      <el-table-column
        prop="item.roomUser"
        header-align="center"
        align="center"
        label="预约人">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="item.startTime"
        header-align="center"
        align="center"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="item.endTime"
        header-align="center"
        align="center"
        label="结束时间">
      </el-table-column>     
      <el-table-column
        prop="item.status"
        header-align="center"
        align="center"
        label="预约状态">
        <template slot-scope="scope">
          <span v-if="scope.row.item.status == 0">已成功</span>
          <span v-else-if="scope.row.item.status == 1">已取消</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"            
            @click="dialogTableVisible = true;detailsClick(scope.row.item.orderId)">详情
          </el-button>
          <el-dialog
            title="详细信息" 
            :visible.sync="dialogTableVisible"
            :append-to-body="true"
            width="40%"
            center>
            <el-table :data="details">
              <el-table-column
                prop="meetingTheme"
                label="会议主题"></el-table-column>
              <el-table-column prop="leader" label="参会人员"></el-table-column>
              <el-table-column
                prop="headCount"
                label="参会人数"></el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <span v-if="scope.row.remark == null">无</span>
                  <span v-else>{{ scope.row.remark }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>  
          <!-- <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.item.orderId)">删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    </span>
    
    <!-- 分页处理 -->
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./servicemeeting-add-or-update";
export default {
   data() {
    return {
      dataForm: {
        key: "",
      },
      dataList: [],
      listwithphone: [],//带有联系方式的数据列表
      details: [],//“详情”所需字段的数据列表
      currentList: [],//当前的预约记录
      historyList: [],//历史预约记录
      nowTime: {},//系统时间
      radio: '1',//1表示当前记录，2表示历史记录     
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dialogTableVisible: false
    };
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/generator/servicemeeting/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          //key为查询字段
          key: this.dataForm.key,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          this.dataList = data.page.list;
          this.dataList.reverse();
          this.listwithphone = data.listwithphone;
          this.listwithphone.reverse();
          this.dataList.orderId = null;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
        this.getCurrentList();
      });
    },
    //获取当前的记录列表
    getCurrentList() {
      this.historyList = [];
      this.getNowTime();//获取系统时间
      for (let a of this.listwithphone) {
        if (this.nowTime[0] < a.item.startTime.split("-")[0]) {//系统时间年份比记录时间年份小
          this.currentList.push(a);
        } else if (this.nowTime[0] == a.item.startTime.split("-")[0]) {//系统时间年份跟记录时间年份相等
          if (this.nowTime[1] < Number(a.item.startTime.split("-")[1])) {//系统时间月份比记录时间月份小
            this.currentList.push(a);
          } else if (this.nowTime[1] == Number(a.item.startTime.split("-")[1])) {//系统时间月份跟记录时间月份相等
            if (this.nowTime[2] < Number(a.item.startTime.split("-")[2].split(" ")[0])) {//系统时间日比记录时间日小
              this.currentList.push(a);
            } else if (this.nowTime[2] == Number(a.item.startTime.split("-")[2].split(" ")[0])) {//系统时间日跟记录时间日相等
              if (this.nowTime[3] < Number(a.item.startTime.split(" ")[1].split(":")[0])) {//系统时间小时比记录时间小时小
                this.currentList.push(a);
              }
            }
          }
        }
      }
    },
    //获取历史的记录列表
    getHistoryList() {
      this.currentList = [];
      this.getNowTime();//获取系统时间
      for (let a of this.listwithphone) {
        if (this.nowTime[0] > a.item.startTime.split("-")[0]) {//系统时间年份比记录时间年份小
          this.historyList.push(a);
        } else if (this.nowTime[0] == a.item.startTime.split("-")[0]) {//系统时间年份跟记录时间年份相等
          if (this.nowTime[1] > Number(a.item.startTime.split("-")[1])) {//系统时间月份比记录时间月份小
            this.historyList.push(a);
          } else if (this.nowTime[1] == Number(a.item.startTime.split("-")[1])) {//系统时间月份跟记录时间月份相等
            if (this.nowTime[2] > Number(a.item.startTime.split("-")[2].split(" ")[0])) {//系统时间日比记录时间日小
              this.historyList.push(a);
            } else if (this.nowTime[2] == Number(a.item.startTime.split("-")[2].split(" ")[0])) {//系统时间日跟记录时间日相等
              if (this.nowTime[3] >= Number(a.item.startTime.split(" ")[1].split(":")[0])) {//系统时间小时比记录时间小时小
                this.historyList.push(a);
              }
            }
          }
        }
      }

    },
    //详情信息
    detailsClick(id) {
      this.details = [];
      for (let aaa of this.listwithphone) {
        if (aaa.item.orderId == id) {
          this.details.push(aaa.item);
        }
      }
    },
    //获取系统时间
    getNowTime() {
      var aDate = new Date();
      this.nowTime[0] = aDate.getFullYear();
      this.nowTime[1] = aDate.getMonth() + 1;//月份默认0-11
      this.nowTime[2] = aDate.getDate();
      this.nowTime[3] = aDate.getHours();
      this.nowTime[4] = aDate.getMinutes();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    // addOrUpdateHandle (id) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },    
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.orderId;
          });
      this.$confirm(`确定进行[${id ? "删除" : "批量删除"}]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/generator/servicemeeting/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
  },
};
</script>