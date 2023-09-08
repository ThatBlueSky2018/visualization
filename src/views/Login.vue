<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2 class="login-title">请登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginFormRules"
        label-width="80px"
      >
        <el-form-item
          label="用户名"
          prop="username"
          style="margin-bottom: 30px"
        >
          <el-input
            v-model="loginData.username"
            placeholder="Enter your username"
            :suffix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="margin-bottom: 30px">
          <el-input
            v-model="loginData.password"
            type="password"
            placeholder="Enter your password"
            :suffix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="70">
            <el-col :span="10">
              <el-button type="info" @click="cancel">Cancel</el-button>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" @click="login">Login </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="elres">
          <el-row>
            <el-col>
              <span style="text-align: left"
                >如果你忘记了密码，请
                <router-link to="/register">点击这里</router-link>
                来找回
              </span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage } from "element-plus";
</script>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      loginData: {
        email: "",
        password: "",
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "input username",
            trigger: "blur",
          },
          {
            min: 3,
            max: 100,
            message: "email name should be between 3 and 100",
          },
        ],
        password: [
          {
            required: true,
            message: "input password",
            trigger: "blur",
          },
          {
            min: 6,
            max: 100,
            message: "password name should be between 6 and 100",
          },
        ],
      },
      userToken: "",
    };
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    cancel() {
      this.$router.push("/fail");
    },
    login() {
      let _this = this;
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return;
        } else {
          axios
            .post("http://127.0.0.1:8000/api/login", {
              username: this.loginData.username,
              password: this.loginData.password,
            })
            .then((response) => {
              if (response.status === 200) {
                _this.userToken = "Token " + response.data.token;
                _this.changeLogin({ Authorization: _this.userToken });
                _this.$router.push("/home");
                ElMessage.success("登录成功！");
              } else {
                ElMessage.error("用户名或密码错误！");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap");

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  width: 400px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  font-family: "Montserrat", sans-serif;
}

.login-title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

.el-form {
  font-size: 30px !important;
}

.el-form .elres .el-form-item__content {
  margin-left: 0 !important;
}
</style>
