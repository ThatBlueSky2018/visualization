<!--泵组1的工作区间统计-->
<template>
  <div id="work_proportion_1">
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
      <div id="submit">
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </div>
    <div id="proportion1_data"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      selectedDate: Date.now,
      formattedDate: "2022-12-31",
      selectedWeek: null,
      selectedMonth: null,
      DateRange: {
        startDate: null,
        endDate: null,
      },
      type: "天",
      request_tail: "work_proportion_1_date/", //请求路径尾部，默认查询具体一个日期的数据
      chartData: {
        hour1: null,
        hour2: null,
        hour_together: null,
      },
    };
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    handleTypeChange(val) {
      this.type = val;
      if (val === "天") {
        this.request_tail = "work_proportion_1_date/";
        this.selectedWeek = null;
      } else {
        this.request_tail = "work_proportion_1_range/";
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
    handleMonthChange(val) {
      this.selectedMonth = val;
      const selectedDate = new Date(this.selectedMonth);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const lastDay = new Date(year, month, 0).getDate();

      this.DateRange.startDate = `${year}-${month}-01`;
      this.DateRange.endDate = `${year}-${month}-${lastDay}`;
    },

    updateWeekDateRange(selectedWeek) {
      const weekStartDate = moment(selectedWeek).startOf("week");
      const weekEndDate = moment(selectedWeek).endOf("week");

      this.DateRange.startDate = weekStartDate.format("YYYY-MM-DD");
      this.DateRange.endDate = weekEndDate.format("YYYY-MM-DD");
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
        .get("http://localhost/api/data/" + this.request_tail, {
          params: {
            time: this.type === "天" ? this.formattedDate : this.DateRange,
          },
        })
        .then((response) => {
          this.chartData.hour1 = response.data.hour1;
          this.chartData.hour2 = response.data.hour2;
          this.chartData.hour_together = response.data.hour_together;

          var chartDom = document.getElementById("proportion1_data");
          var myChart = echarts.init(chartDom);
          var option;

          option = {
            title: {
              text: "泵站工作时间比例",
              subtext: "按小时计",
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                name: "Access From",
                type: "pie",
                radius: "50%",
                data: [
                  { value: this.chartData.hour1, name: "泵站1工作时长" },
                  { value: this.chartData.hour2, name: "泵站2工作时长" },
                  {
                    value: this.chartData.hour_together,
                    name: "共同工作时长",
                  },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
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
#time_range {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
#proportion1_data {
  width: 100%;
  height: 300px;
}
#work_proportion_1 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
