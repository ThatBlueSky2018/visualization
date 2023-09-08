<template>
  <div id="status_trend">
    <div id="chart"></div>
    <div id="select_field">
      <span>请选择观察指标</span>
      <br />
      <select
        v-model="selectedOption"
        id="select_option"
        @change="fetchChartData"
      >
        <option value="frequency">频率</option>
        <option value="pressure_difference">压力差</option>
        <option value="electricity_consumption">用电量</option>
      </select>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  data() {
    return {
      selectedOption: "frequency",
      chartData: {
        legend: ["泵站1", "泵站2", "泵站3", "泵站4"],
        xAxis: [],
        seriesData: [],
      },
    };
  },

  mounted() {
    this.fetchChartData();
  },

  methods: {
    fetchChartData() {
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
        .get("http://localhost:8000/api/data/status_trend/", {
          params: {
            field: this.selectedOption,
          },
        })
        .then((response) => {
          this.chartData.legend = ["泵站1", "泵站2", "泵站3", "泵站4"];
          this.chartData.xAxis = response.data.data[0];
          this.chartData.seriesData = [
            response.data.data[1],
            response.data.data[2],
            response.data.data[3],
            response.data.data[4],
          ];

          var chartDom = document.getElementById("chart");
          var myChart = echarts.init(chartDom);
          var option = {
            title: {
              text: "运行状态变化图",
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: this.chartData.legend,
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: this.chartData.xAxis,
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                name: "泵站1",
                type: "line",
                stack: "Total",
                data: this.chartData.seriesData[0],
              },
              {
                name: "泵站2",
                type: "line",
                stack: "Total",
                data: this.chartData.seriesData[1],
              },
              {
                name: "泵站3",
                type: "line",
                stack: "Total",
                data: this.chartData.seriesData[2],
              },
              {
                name: "泵站4",
                type: "line",
                stack: "Total",
                data: this.chartData.seriesData[3],
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
#chart {
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
