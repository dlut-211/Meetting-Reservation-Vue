<template>
  <div>
    <el-row>
      <el-date-picker
        v-model="datevalue"
        type="date"
        @change="getTanleMsg"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
      >
        <!-- :picker-options="expireTimeOption" -->
      </el-date-picker>
      <el-table
        class="customer-table"
        :data="tableData"
        :cell-style="cellStyle"
        border
        @cell-mouse-enter="clickhandle"
        @cell-mouse-leave="close"  
      >
        <el-table-column prop="date" width="220"> </el-table-column>
        <el-table-column
          v-for="(item, index) in room"
          :key="index"
          :label="item.roomName"         
          width="100"
        >
        <!-- 预约详情弹出框 -->
          <template slot-scope="scope">           
            <el-popover trigger="hover" placement="right" v-model="visible">
              <el-form ref="form" :model="details" label-width="80px">
                <el-form-item label="使用单位">
                  <el-input v-model="details.department"></el-input>
                </el-form-item>
                <el-form-item label="预约人">
                  <el-input v-model="details.roomUser"></el-input>
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input v-model="details.mobile"></el-input>
                </el-form-item>
                <el-form-item label="会议主题">
                  <el-input v-model="details.meetingTheme"></el-input>
                </el-form-item>
                <el-form-item label="参会人员">
                  <el-input v-model="details.leader"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <template>
                    <el-form-item v-if="details.remark==null">
                      <el-input value="无"></el-input>
                    </el-form-item>
                    <el-form-item v-else>
                      <el-input v-model="details.remark"></el-input>
                    </el-form-item>
                  </template>
                </el-form-item>
              </el-form>
              <div slot="reference">
                <el-button
                  type="text"
                  style="
                    float: left;
                    font-size: 18px;
                    margin-left: 10%;
                    color: white;
                    line-height: 25px;
                  "
                  >{{ item.capacity }}</el-button>             
                <el-button
                  type="text"
                  :class="
                    item.equipment >= '2'
                      ? 'iconfont icon-shexiangtou'
                      : 'iconfont icon-shexiangtou_guanbi'
                  "
                  style="
                    float: right;
                    font-size: 25px;
                    margin-right: 10%;
                    color: #686868;
                  "
                  ></el-button>
              </div>
            </el-popover>
          </template>
          <!-- <span style="float:left" class="iconfont icon-mic"></span>
            <span  style="float:right" class="iconfonticon-shexiangtou_guanbi"></span>-->
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

  <script>
export default {
  created() {
    this.getNowTime();
  },
  mounted() {
    this.getTanleMsg();
    this.getChosenList();
  },
  methods: {
    getTanleMsg() {
      this.$http({
        url: this.$http.adornUrl("/generator/servicemeeting/formuser"),
        method: "post",

        data: {
          value: this.datevalue,
        },
        // 设置请求头
        headers: {
          "Content-Type": "application/json",
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          this.choosetable = data.choosetable;
          this.room = data.room;
          this.tableData = data.list;

          console.log();
          this.form = {
            department: data.room[1].roomArea,
            name: data.now_user.email,
            mobile: data.now_user.mobile,
            belong: data.now_user.department,
            datechoose: this.datevalue,
            theme: [],
            date1: null,
            date2: null,
            room: null,
          };
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    context() {
      console.log("当前各项值");
      console.log("this.timesign");
      console.log(this.timesign);
      console.log("this.timestart");
      console.log(this.timestart);
      console.log("this.timeend");
      console.log(this.timeend);
      console.log("this.roomsign");
      console.log(this.roomsign);
      console.log("this.bechosed");
      console.log(this.bechosed);
    },
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
      // var defaultDate = '2020-09-24';
      this.datevalue = defaultDate;
    },
    //弹出框关闭时置空
    close() {
      this.visible = false;
      this.details = {};
    },
    resetchose() {
      this.timesign = false;
      this.timestart = "";
      this.timeend = "";
      this.roomsign = "";
      this.bechosed = false;
    },
    reset() {
      console.log("重置时间");
      this.$router.go(0);
    },
    // 单元格的 style 的回调方法
    cellStyle({ row, column, rowIndex, columnIndex }) {
      //初始渲染已选择
      for (let i = 0; i < this.choosetable.length; i++) {
        let a = this.choosetable[i].chose.split("_");
        if (
          column.label == a[0] &&
          rowIndex >= a[1] - 7 &&
          rowIndex <= a[2] - 8
        ) {
          return "border-radius: 15px;background-color:#909399;color:white;padding:0";
        }
      }

      //点击选择
      console.log(this.timestart);
      //console.log(rowIndex);
      if (columnIndex != 0 && this.timesign == true) {
        //this.context();
        if (
          this.timeend != "" &&
          column.label == this.roomsign &&
          rowIndex >= Number(this.timestart - 7) &&
          rowIndex <= Number(this.timeend - 8) &&
          this.bechosed == true
        ) {
          //console.log("进入if");
          //this.context();
          return "border-radius: 15px;background-color:#409EFF;color:white;padding:0";
        }

        if (
          column.label == this.roomsign &&
          rowIndex == Number(this.timestart - 7)
        ) {
          //console.log("进入else");
          //this.context();
          return "border-radius: 15px;background-color:#409EFF;color:white;padding:0";
        }
      }
      if (columnIndex != 0)
        return "border-radius: 15px;background-color:rgb(0, 215, 193);padding:0";
    },
    //判断选中的单元格
    clickhandle(row, column, event, cell) {
      let a = row.date.split("-");//选中的单元格
      let b = this.choseList;//当前页面所有被预约的单元格
      for(let i = 0; i < b.length; i++){
        let time1 = b[i].item.startTime.split(' ');//开始时间
        let time2 = b[i].item.endTime.split(' ');//结束时间
        if(
          b[i].item.roomName == column.label &&
          time1[0] == this.datevalue){
          if(
            a[0].split(":")[0] >= Number(time1[1].split(':')[0]) && 
            a[1].split(":")[0] <= Number(time2[1].split(':')[0])
          ){ 
            console.log(a[0].split(":")[0]);
            console.log(Number(time1[1].split(':')[0]));
            console.log(a[1].split(":")[0]);
            console.log(Number(time2[1].split(':')[0]));
            this.details = {
              department: b[i].item.department,
              headCount: b[i].item.headCount,
              leader: b[i].item.leader,
              meetingTheme: b[i].item.meetingTheme,
              remark: b[i].item.remark,
              roomName: b[i].item.roomName,
              roomUser: b[i].item.roomUser,
              startTime: b[i].item.startTime,
              endTime: b[i].item.endTime,
              remark: b[i].item.remark,
              mobile: b[i].mobile,
            };
            this.visible = true;
            console.log("我进来了");
            console.log(this.details);
          }
        
        }
      }
      // this.$http({
      //   url: this.$http.adornUrl("/generator/servicemeeting/atableget"),
      //   method: "post",
      //   data: {
      //     date: this.datevalue,
      //     starttime: a[0],
      //     endtime: a[1],
      //     room: column.label,
      //   },
      //   // 设置请求头
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // }).then(({ data }) => {
      //   this.details=[];
      //   if (data && data.code === 0) {
      //     if (data !== null) {
      //       //有数据时         
      //       this.details.push(data.date);
      //       console.log(data.date);
      //     } else {
      //       //无数据时
      //     }
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    },
     getChosenList() {
      this.$http({
        url: this.$http.adornUrl("/generator/servicemeeting/list"),
        method: "get",
        params: this.$http.adornParams({
          page:1,
          limit: 10,
          //key为查询字段
          key: '',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
           console.log('----------');
          console.log(data);
          this.choseList = data.listwithphone;
          this.choseList.reverse();
         
        } else {
         this.$message.error(data.msg);
        }
       
      });
    },
    // addIconClass({ row, column, rowIndex, columnIndex }) {
    //  if (columnIndex != 0)
    //       return "iconfont icon-mic icon-shexiangtou_guanbi";

    // },

    // 表头行的 style 的回调方法
    // headCellStyle({ row, column, rowIndex, columnIndex }) {
    //     if (columnIndex != 0 && rowIndex === 0) {
    //         return `padding-left:40px;`;
    //     }
    // },
  },
  data() {
    return {
      room: [],
      details: {},
      roomsize: "",
      tableData: [],
      form: {},
      datevalue: "",
      timestart: "",
      datasign: [],
      choosetable: {},
      timesign: false,
      timestart: "",
      timeend: "",
      roomsign: "",
      bechosed: false,
      choseList: {},
      sign: true,
      visible: false //详情弹出框是否可见
    };
  },
};
</script>


<style>
.el-table--border,
.el-table--group {
  border: none;
}
/* // 表格最外层边框-底部边框 */
.el-table--border::after,
.el-table--group::after {
  width: 0;
}
.customer-table::before {
  width: 0;
}
.customer-table .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}
</style>
<style>
/* inpu滚动条 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: textfield;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>