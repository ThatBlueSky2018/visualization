<template>
  <div id="flow2">
    <div id="range">
      <div id="type">
        <span>请选择统计时间段：</span>
        <el-radio-group v-model="type" @change="handleTypeChange">
          <el-radio-button label="天" />
          <el-radio-button label="周" />
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
      <div id="submit">
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </div>
    <div id="flow2_data"></div>
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
      weekDateRange: {
        startDate: null,
        endDate: null,
      },
      type: "天",
      request_tail: "flow2_day/", //请求路径尾部
      chartData: {
        date: [],
        flow: [],
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
        this.request_tail = "flow2_day/";
        this.selectedWeek = null; // 选择"天"时，清空周选择器的值
      } else if (val === "周") {
        this.request_tail = "flow2_week/";
        this.selectedDay = null; // 选择"周"时，清空日期选择器的值
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

      this.weekDateRange.startDate = weekStartDate.format("YYYY-MM-DD");
      this.weekDateRange.endDate = weekEndDate.format("YYYY-MM-DD");
      console.log(this.weekDateRange);
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
        .get("http://127.0.0.1:8000/api/data/" + this.request_tail, {
          params: {
            field: this.type === "天" ? this.formattedDate : this.weekDateRange,
          },
        })
        .then((response) => {
          this.chartData.date = response.data.datetime;
          this.chartData.flow = response.data.flow;

          var chartDom = document.getElementById("flow2_data");
          var myChart = echarts.init(chartDom);
          var option;

          option = {
            title: {
              text: "泵组2流量历史数据",
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
                data: this.chartData.flow,
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
#range {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
#flow2_data {
  width: 100%;
  height: 300px;
}
#flow2 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
