<template>
  <div id="efficiency">
    <div id="time_range">
      <div id="type">
        <span>请选择统计时间段：</span>
        <el-radio-group v-model="type" @change="handleTypeChange">
          <el-radio-button label="天" />
          <el-radio-button label="周" />
          <el-radio-button label="月" />
        </el-radio-group>
      </div>
      <div id="date" v-if="this.type === '天'">
        <span>请选择一个具体日期：</span>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择统计日期"
          @change="handleDateChange"
        ></el-date-picker>
      </div>
      <div id="week" v-else-if="this.type === '周'">
        <span>请选择某一周的日期：</span>
        <el-date-picker
          v-model="selectedWeek"
          type="week"
          placeholder="选择统计周"
          @change="handleWeekChange"
        ></el-date-picker>
      </div>
      <div id="month" v-else-if="this.type === '月'">
        <span>请选择某个月份：</span>
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="选择统计月份"
          @change="handleMonthChange"
        ></el-date-picker>
      </div>

      <div id="pump_station">
        <span>请选择泵站：</span>
        <select v-model="selectedPump" id="select_pump">
          <option value="pump_1">泵站1</option>
          <option value="pump_2">泵站2</option>
          <option value="pump_1_2">泵站1、2</option>
        </select>
      </div>
      <div id="submit">
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </div>
    <div id="efficiency_data"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      selectedDate: Date.now, //选择的日期
      formattedDate: "2022-12-31", //格式化之后的日期
      selectedWeek: null, //选择的周
      selectedMonth: null, //选择的月份
      type: "天", //选择的类型
      selectedPump: "pump_1",
      DateRange: {
        startDate: null,
        endDate: null,
      },
      request_tail: "efficiency_1_date/", //请求路径尾部，默认查询具体一个日期的数据
      chartData: {
        date: [],
        efficiency: [],
      }, //图表数据
    };
  },
  mounted() {
    this.fetchData();
  },

  methods: {
    handleTypeChange(val) {
      this.type = val;
      if (val === "天") {
        this.request_tail = "efficiency_1_date/";
        this.selectedWeek = null;
      } else {
        this.request_tail = "efficiency_1_range/";
        this.selectedDay = null;
        if (val === "周") {
          this.selectedMonth = null;
        } else {
          this.selectedWeek = null;
        }
      }
    },
    handleDateChange(val) {
      this.selectedDate = val;
      this.formattedDate = moment(this.selectedDate).format("YYYY-MM-DD");
    },
    handleWeekChange(val) {
      this.selectedWeek = val;
      this.updateWeekDateRange(this.selectedWeek);
    },
    updateWeekDateRange(selectedWeek) {
      const weekStartDate = moment(selectedWeek).startOf("week");
      const weekEndDate = moment(selectedWeek).endOf("week");

      this.DateRange.startDate = weekStartDate.format("YYYY-MM-DD");
      this.DateRange.endDate = weekEndDate.format("YYYY-MM-DD");
      console.log(this.weekDateRange);
    },

    handleMonthChange(val) {
      this.selectedMonth = val;
      const selectedDate = new Date(this.selectedMonth);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const lastDay = new Date(year, month, 0).getDate();

      this.DateRange.startDate = `${year}-${month}-01`;
      this.DateRange.endDate = `${year}-${month}-${lastDay}`;
    },
    fetchData() {
      axios.interceptors.request.use(
        (config) => {
          if (localStorage.getItem("Authorization")) {
            config.headers.Authorization =
              localStorage.getItem("Authorization");
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      axios
        .get("http://localhost:8000/api/data/" + this.request_tail, {
          params: {
            time: this.type === "天" ? this.formattedDate : this.DateRange,
            pump_id: this.selectedPump,
          },
        })
        .then((response) => {
          this.chartData.date = response.data.date;
          this.chartData.efficiency = response.data.efficiency;

          var chartDom = document.getElementById("efficiency_data");
          var myChart = echarts.init(chartDom);
          var option;

          option = {
            title: {
              text: "效率统计",
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            xAxis: {
              type: "category",
              data: this.chartData.date,
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                data: this.chartData.efficiency,
                type: "line",
                smooth: true,
              },
            ],
          };

          option && myChart.setOption(option);
        })
        .catch((error) => {
          console.error("获取数据失败：" + error);
        });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap");
#efficiency_data {
  width: 600px;
  height: 260px;
}
#select_field {
  width: 120px;
  height: 30px;
}
#select_option {
  width: 120px;
}
#status_trend {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
