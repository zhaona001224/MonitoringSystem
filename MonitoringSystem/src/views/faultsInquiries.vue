<template>
  <div class="contain">
    <div class="tab">
      <div
        class="li"
        @click="changeTab(index)"
        v-for="(item, index) in tabList"
        :key="index"
      >
        <span class="li" :class="index == activeIndex ? 'active' : ''">
          <img
            v-if="index === activeIndex"
            :src="
              require('../assets/image/faultsInquiries/tab' +
                (index + 1) +
                '-1.png')
            "
          />
          <img
            v-else
            :src="
              require('../assets/image/faultsInquiries/tab' +
                (index + 1) +
                '.png')
            "
          />
          {{ item }} </span
        ><span
          v-if="index !== activeIndex && index !== tabList.length - 1"
          class="split"
        ></span>
      </div>
    </div>
    <div class="box-card">
      <el-row v-if="activeIndex !== 1">
        <div v-if="activeIndex == 0">
          测点
          <el-select v-model="point" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.ID"
              :label="item.name"
              :value="item.datakey"
            >
            </el-option>
          </el-select>
        </div>
        开始
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="start"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        结束
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="end"
          type="datetime"
          @change="judgeTime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <el-button type="primary" class="common-btn" @click="queryTabel"
          >查询</el-button
        >
      </el-row>
      <div class="table" v-if="activeIndex == 0">
        <el-table :data="tableData" width="100%">
          <el-table-column
            align="center"
            header-align="center"
            prop="ID"
            label="编号"
            width="200px"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="date"
            label="日期"
            width="200px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="time"
            label="时间"
            width="200px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="key"
            label="测点"
            width="510px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="value"
            label="运行值"
            width="430px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="table" v-if="activeIndex == 1">
        <el-table :data="tableData" width="100%">
          <el-table-column
            align="center"
            header-align="center"
            prop="id"
            label="编号"
            width="100px"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="date"
            label="日期"
            width="200px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="time"
            label="时间"
            width="200px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="报警内容"
            width="430px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="type"
            label="报警级别"
            width="160px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            label="处理措施"
            min-width="240px"
            cell-class-name="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title=""
                width="200"
                trigger="click"
              >
                <div v-html="pointData[scope.row.rel].instruction"></div>
                <span class="fix" slot="reference">预防检修 </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="故障确认"
            min-width="140px"
            cell-class-name="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <div class="confirm" @click="fix(scope.row)">确认</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table" v-if="activeIndex == 2">
        <el-table :data="tableData" width="100%">
          <el-table-column
            align="center"
            header-align="center"
            prop="id"
            label="编号"
            width="200px"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="updated"
            label="日期"
            width="200px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="updated"
            label="时间"
            width="200px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="updated"
            label="报警内容"
            width="530px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="updated"
            label="报警级别"
            width="360px"
            cell-class-name="center"
            header-align="center"
          >
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="" :visible.sync="showTip" width="30%">
        <span>是否确认故障</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showTip = false">取 消</el-button>
          <el-button type="primary" @click="sendData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: "parameterMon",
  data() {
    return {
      tabList: ["历史数据查询", "实时报警查询", "历史报警查询"],
      activeIndex: 0,
      tableData: [
        {
          updated: "1201221",
          id: 1,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      start: "",
      end: "",
      total: 0,
      options: [],
      point: "",
      pointData: {},
      showTip: false,
      activeObj: {},
    };
  },
  methods: {
    //校验时间格式
    judgeTime() {
      if (!this.start || !this.end) return;
      const time1 = this.start.getTime();
      const time2 = this.end.getTime();
      if (time1 - time2 > 0) {
        this.$message({
          type: "warning",
          message: "开始时间不能大于结束时间",
        });
      }
    },
    dealData() {
      this.tableData.map((item) => {
        item.key = this.point;
        item.value = item[this.point];
        const datetime = new Date(item.timestamp);
        const year = datetime.getFullYear();
        const month = ("0" + (datetime.getMonth() + 1)).slice(-2);
        const date = ("0" + datetime.getDate()).slice(-2);
        const hour = ("0" + datetime.getHours()).slice(-2);
        const minute = ("0" + datetime.getMinutes()).slice(-2);
        const second = ("0" + datetime.getSeconds()).slice(-2);
        item.date = year + "-" + month + "-" + date;
        item.time = hour + ":" + minute + ":" + second;
      });
    },
    queryTabel() {
      const url = this.activeIndex === 0 ? "/log/history/" : "/alarm/history/";
      this.$get(
        url +
          this.point +
          "?start=" +
          this.start.getTime() +
          "&end=" +
          this.end.getTime(),
        {}
      ).then((response) => {
        this.tableData = response.data || [];
        this.dealData();
      });
    },
    getBaseData() {
      this.$get("/admin/v1/contents?type=Point&offset=-1&count=-1", {}).then(
        (response) => {
          this.options = response.data;
          this.point = response.data[0] && response.data[0].datakey;
          this.options.map((item) => {
            this.pointData[item.datakey] = item;
          });
          this.queryTabel();
        }
      );
    },
    changeTab(index) {
      this.activeIndex = index;
      if (index === 1) {
        this.tableData = this.$store.state.alarmData.alarms || [];
        this.dealData();
      } else {
        this.queryTabel();
      }
    },
    fix(item) {
      this.activObj = item;
      this.showTip = true;
    },
    sendData() {
      var obj = {
        cmd: "cmd",
        alarmclass: "A",
        data: JSON.stringify(this.activObj),
      };
      const that = this;
      this.centrifuge.publish("alarmdata", obj).then(
        function (res) {
          that.showTip = false;
          that.$message({
            message: "操作成功!",
            type: "success",
          });

         
        },
        function (err) {
          console.log("publish error", err);
        }
      );
    },
  },
   mounted() {
	  const that=this
    this.centrifuge.subscribe("alarmdata", function (message) { 
      if (message.data.timestamp&&that.activeIndex==1) {
         that.tableData = that.$store.state.alarmData.alarms || [];
          that.dealData();
      }
    });
  },
  created() {
    this.start = new Date(new Date() - 58 * 60 * 60 * 1000); //获取当天零点的时间
    this.end = new Date(); //获取当天23:59:59的时间
    this.getBaseData();

  },
};
</script>
<style lang="less" scoped>
.contain {
  padding: 2px 21px;
  .tab {
    display: flex;
    align-items: center;
    width: 1566px;
    background-color: #ffffff;
    box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
    border-radius: 3px;
    .li {
      display: flex;
      height: 59px;
      align-items: center;
      width: 250px;
      text-align: center;
      font-size: 20px;
      color: #b3b3b3;
      justify-content: center;
      img {
        margin-right: 8px;
      }
      &.active {
        background-color: #229ffe;
        border-radius: 3px;
        color: #fff;
      }
    }
    .split {
      display: block;
      width: 1px;
      height: 26px;
      background: #d2d2d2;
    }
  }
  .box-card {
    margin-top: 20px;
    box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
    border-radius: 3px;
    height: 870px;
    overflow-y: auto;
  }
  .el-row {
    padding: 24px 0;
    padding-left: 20px;
    display: flex;
    align-items: center;
  }
  .fix {
    display: block;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
    width: 119px;
    height: 40px;
    background-color: #229ffe;
    box-shadow: 3px 4px 10px 0px rgba(34, 159, 254, 0.5);
    border-radius: 4px;
  }
  /*.fix1 {
			display: inline-block;
			color: #fff;
			text-align: center;
			font-size: 20px;
			line-height: 40px;
			width: 119px;
			height: 40px;
			background-color: #fe4e46;
			box-shadow: 3px 4px 10px 0px rgba(254, 51, 90, 0.5);
			border-radius: 4px;
		}*/
  .confirm {
    color: #fff;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
    width: 94px;
    height: 40px;
    background-color: #5ac462;
    box-shadow: 3px 4px 10px 0px rgba(90, 196, 98, 0.5);
    border-radius: 4px;
    margin: 0 auto;
  }
  /deep/ .el-table th {
    background-color: #f7f7f7 !important;
  }
  .common-btn {
    width: 140px;
    height: 50px;
    background-image: linear-gradient(
        90deg,
        rgba(87, 185, 255, 0.5) 0%,
        rgba(115, 118, 247, 0.5) 100%,
        rgba(115, 155, 247, 0.5) 100%
      ),
      linear-gradient(#57b9ff, #57b9ff);
    border-radius: 25px;
    font-size: 22px;
    color: #f6f7fb;
  }
}
</style>