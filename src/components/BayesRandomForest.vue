<template>
  <div id="predictedData">
    <span style="color: black" class="electricity_consumption"
      >泵组1：{{ electricity_consumption_1 }}</span
    >
    <span style="color: black" class="electricity_consumption"
      >泵组2：{{ electricity_consumption_2 }}</span
    >
    <span style="color: black" class="electricity_consumption"
      >泵组3：{{ electricity_consumption_3 }}</span
    >
    <span style="color: black" class="electricity_consumption"
      >泵组4：{{ electricity_consumption_4 }}</span
    >
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      electricity_consumption_1: 0,
      electricity_consumption_2: 0,
      electricity_consumption_3: 0,
      electricity_consumption_4: 0,
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
        .get("http://localhost/api/data/bayes_random_forest/")
        .then((response) => {
          this.electricity_consumption_1 = response.data[0][0];
          this.electricity_consumption_2 = response.data[0][1];
          this.electricity_consumption_3 = response.data[0][2];
          this.electricity_consumption_4 = response.data[0][3];
        })
        .catch((error) => {
          console.error("获取数据失败！" + error.data);
        });
    },
  },
};
</script>
<style>
#predictedData {
  width: 280px;
  height: 140px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #e5eaf3;
}
.electricity_consumption {
  width: 260px;
  text-align: left;
  border-radius: 3px;
  background-color: white;
}
</style>
