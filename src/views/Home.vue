<template>
  <div class="common-layout">
    <el-container class="home-container">
      <el-header style="padding: 0">
        <div>
          <span style="color: white">华博水务数据可视化平台</span>
        </div>
      </el-header>

      <el-container>
        <!--侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '220px'">
          <el-menu
            active-text-color="#fff"
            background-color="#333744"
            class="el-menu-vertical-demo"
            text-color="#fff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <div class="toggle-button" @click="toggleCol">
              <el-icon><Operation /></el-icon>
            </div>
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Histogram />
                </el-icon>
                <span>STATUS OVERVIEW</span>
              </template>
              <el-menu-item index="/overview">
                <template #title>
                  <el-icon>
                    <Aim />
                  </el-icon>
                  <span>泵组流量数据</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/pumpOverview">
                <template #title>
                  <el-icon>
                    <Clock />
                  </el-icon>
                  <span>泵站数据统计</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/groupHis1">
                <template #title>
                  <el-icon>
                    <Clock />
                  </el-icon>
                  <span>泵组运行数据</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Management />
                </el-icon>
                <span>PUMP STATUS</span>
              </template>
              <el-menu-item index="status">
                <template #title>
                  <el-icon><View /></el-icon>
                  <span>设备实时状态</span>
                </template>
              </el-menu-item>
              <el-menu-item index="trend">
                <template #title>
                  <el-icon><View /></el-icon>
                  <span>设备状态变化</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><Search /></el-icon>
                <span>MACHINE ANALYSIS</span>
              </template>
              <el-menu-item index="/analysis">
                <template #title>
                  <el-icon><MessageBox /></el-icon>
                  <span>设备运行数据分析</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import {
  //导入图标
  Histogram,
  Management,
  Clock,
  View,
  MessageBox,
  Operation,
  Aim,
  Search,
} from "@element-plus/icons-vue";
</script>
<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  created() {},
  methods: {
    toggleCol() {
      //菜单伸缩函数
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Play:wght@700&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  background: #fff;
}

.common-layout,
.home-container {
  height: 100vh;
}

.el-header {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-family: Play;
  background-color: #406384b6;
}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header div span {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-dropdown {
  color: #fff;
}

.el-aside {
  background-color: #333744;
}

.el-aside .el-menu {
  border-right: none;
}

.el-main {
  --el-main-padding: 0;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
  cursor: pointer;
}
</style>
