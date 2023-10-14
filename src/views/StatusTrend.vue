<template>
  <div id="trend">
    <div id="pump_status_trend">
      <PumpStatusTrend></PumpStatusTrend>
    </div>
    <div od="flow_trend">
      <FlowTrend></FlowTrend>
    </div>
  </div>
</template>

<script>
import PumpStatusTrend from "../components/PumpStatusTrend.vue";
import FlowTrend from "@/components/FlowTrend.vue";

export default {
  components: { PumpStatusTrend, FlowTrend },
};
</script>

<style>
#trend {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
