<template>
  <div id="pressure_difference">
    <PressureDifference></PressureDifference>
  </div>
  <div id="frequency"><Frequency></Frequency></div>
</template>

<script>
import Frequency from "@/components/historical-data/Frequency.vue";
import PressureDifference from "../components/historical-data/PressureDifference.vue";

export default {
  components: { Frequency, PressureDifference },
};
</script>
<style></style>
