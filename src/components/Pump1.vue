<template>
  <div id="pumpStatus1">
    <span style="color: black">泵站1</span>
    <el-tag class="ml-2" type="success" v-if="this.status === 1">
      正在运行</el-tag
    >
    <el-tag class="ml-2" type="danger" v-else-if="this.status === 0"
      >停止运行</el-tag
    >
    <el-tag class="ml-2" type="info" v-else>运行情况不明</el-tag>
    <img
      src="../assets/pump.png"
      style="height: 170px; width: 170px"
      id="pump_img"
    />
    <div id="data1">
      <span style="color: black" class="data1_item">频率：{{ frequency }}</span>
      <span style="color: black" class="data1_item"
        >压力差：{{ pressure_difference }}</span
      >
      <span style="color: black" class="data1_item"
        >用电量：{{ electricity_consumption }}</span
      >
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      frequency: 0,
      pressure_difference: 0,
      electricity_consumption: 0,
      status: 0,
    };
  },

  mounted() {
    this.fetchData();
  },

  methods: {
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
        .get("http://localhost:8000/api/data/pump1_status/")
        .then((response) => {
          this.frequency = response.data.frequency;
          this.pressure_difference = response.data.pressure_difference;
          this.electricity_consumption = response.data.electricity_consumption;
          this.status = response.data.status;
        })
        .catch((error) => {
          console.error("获取数据失败！" + error.data);
        });
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Play:wght@700&display=swap");

#pumpStatus1 {
  width: 190px;
  height: 290px;
  font-size: 10px;
  text-align: center;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #e5eaf3;
}
#pump_img {
  border-radius: 5px;
}
#data1 {
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.data1_item {
  width: 170px;
  text-align: left;
  border-radius: 3px;
  background-color: white;
}
</style>
