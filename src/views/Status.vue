<template>
  <div id="status">
    <div id="four_status">
      <div class="status_item">
        <Pump1></Pump1>
      </div>
      <div class="status_item">
        <Pump2></Pump2>
      </div>
      <div class="status_item">
        <Pump3></Pump3>
      </div>
      <div class="status_item">
        <Pump4></Pump4>
      </div>
    </div>
    <div id="status_dis2">
      <div id="flow_status">
        <PumpGroupStatus></PumpGroupStatus>
      </div>
    </div>
  </div>
</template>

<script>
import Pump1 from "../components/Pump1.vue";
import Pump2 from "../components/Pump2.vue";
import Pump3 from "../components/Pump3.vue";
import Pump4 from "../components/Pump4.vue";
import PumpGroupStatus from "../components/PumpGroupStatus.vue";

import * as echarts from "echarts";

export default {
  components: { Pump1, Pump2, Pump3, Pump4, PumpGroupStatus },
};
</script>

<style>
#status {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#four_status {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#status_dis2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#status_trend {
  width: 800px;
  height: 60%;
}
#flow_status {
  width: 400px;
}
</style>
