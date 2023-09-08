<template>
  <div id="main" style="width: 100%; height: 40%"></div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  data() {
    return {};
  },

  mounted() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    var option;
    axios.interceptors.request.use(
      (config) => {
        if (localStorage.getItem("Authorization")) {
          config.headers.Authorization = localStorage.getItem("Authorization");
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    axios.get("http://localhost:8000/api/data/flow/").then((response) => {
      run(response.data.data);
    });

    // 将时间字符串转换为时间戳的函数
    function parseTimeStringToTimestamp(timeString) {
      return new Date(timeString).getTime();
    }

    function run(_rawData) {
      for (let j = 1; j < _rawData.length; ++j) {
        _rawData[j][2] = parseTimeStringToTimestamp(_rawData[j][2]);
      }
      option = {
        dataset: [
          {
            id: "dataset_raw",
            source: _rawData,
          },
          {
            id: "dataset_since_1950_of_germany",
            fromDatasetId: "dataset_raw",
            transform: {
              type: "filter",
              config: {
                and: [{ dimension: "equipment", "=": "设备1" }],
              },
            },
          },
          {
            id: "dataset_since_1950_of_france",
            fromDatasetId: "dataset_raw",
            transform: {
              type: "filter",
              config: {
                and: [{ dimension: "equipment", "=": "设备2" }],
              },
            },
          },
        ],
        title: {
          text: "流量数据可视化",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          nameLocation: "middle",
        },
        yAxis: {
          name: "Flow",
        },
        series: [
          {
            type: "line",
            datasetId: "dataset_since_1950_of_germany",
            showSymbol: false,
            encode: {
              x: "time",
              y: "Flow",
              itemName: "time",
              tooltip: ["Flow"],
            },
          },
          {
            type: "line",
            datasetId: "dataset_since_1950_of_france",
            showSymbol: false,
            encode: {
              x: "time",
              y: "Flow",
              itemName: "time",
              tooltip: ["Flow"],
            },
          },
        ],
      };
      myChart.setOption(option);
    }
    option && myChart.setOption(option);
  },
};
</script>

<style></style>
