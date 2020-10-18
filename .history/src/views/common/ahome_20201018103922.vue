

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
        @cell-click="clickhandle"
      >
        <el-table-column prop="date" width="220"> </el-table-column>
        <el-table-column
          v-for="(item, index) in room"
          :key="index"
          :label="item.roomName"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              style="
                float: left;
                font-size: 18px;
                margin-left: 10%;
                color: white;

                line-height: 25px;
              "
              >{{ item.capacity }}</el-button
            >
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
    clickhandle(row, column, event, cell) {
      let a = row.date.split("-");
       console.log("日期");
      console.log(this.datevalue);
      console.log("开始时间");
      console.log(a[0]);
      console.log("结束时间");
      console.log(a[1]);
      // console.log(column);
      // for (let i = 0; i < this.room.length; i++)
      //   if (this.room[i].roomName == column.label)
      //     this.roomsize = this.room[i].capacity;
      // if (this.timesign == false) {
      //   this.form.room = column.label;
      //   this.roomsign = column.label;
      //   this.form.date1 = a[0];
      //   this.timestart = a[0].split(":")[0];
      //   this.timeend = "";
      //   this.form.date2 = a[1];
      //   this.timesign = true;
      //   // this.context();
      //   // console.log(this.timestart);
      // }

      console.log("行");
      console.log(row);
      console.log("列");
      console.log(column);
      // console.log();
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