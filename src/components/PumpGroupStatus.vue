<!--此组件绘两个泵组的实时状态-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-statistic
            group-separator=","
            :precision="2"
            :value="flow1"
            :title="title1"
          ></el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic
            group-separator=","
            :precision="2"
            :value="flow2"
            :title="title2"
          ></el-statistic>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      flow1: 0.0,
      flow2: 0.0,
      title1: "泵组1流量",
      title2: "泵组2流量",
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
        .get("http://127.0.0.1:8000/api/data/pump_group_status/")
        .then((response) => {
          this.flow1 = response.data.flow_1;
          this.flow2 = response.data.flow_2;
        })
        .catch((error) => {
          console.error("获取数据失败！" + error.data);
        });
    },
  },
};
</script>
<style lang="scss"></style>
