<template>
  <transition>
    <div v-if="loaded">
      Next Vinyle in:<br /><span>
        {{ displayHours }} : {{ displayMinutes }} : {{ displaySeconds }}</span
      >
    </div>
  </transition>
</template>
<script>
export default {
  name: "countdown-component",
  data: () => ({
    displayHours: 0,
    displayMinutes: 0,
    displaySeconds: 0,
    loaded: false,
    expired: false,
  }),
  computed: {
    _seconds: () => 1000,
    _minutes() {
      return this._seconds * 60;
    },
    _hours() {
      return this._minutes * 60;
    },
  },
  mounted() {
    this.showRemaining();
  },
  methods: {
    formatTime: (time) => (time < 10 ? "0" + time : time),
    showRemaining() {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        const distance = end.getTime() - now.getTime();
        if (distance < 0) {
          clearInterval(timer);
          this.expired = true;
          return;
        }
        const hours = Math.floor(distance / this._hours);
        const minutes = Math.floor((distance % this._hours) / this._minutes);
        const seconds = Math.floor((distance % this._minutes) / this._seconds);
        this.displayMinutes = this.formatTime(minutes);
        this.displaySeconds = this.formatTime(seconds);
        this.displayHours = this.formatTime(hours);
        this.loaded = true;
      }, 1000);
    },
  },
};
</script>
<style scoped>
div > span {
  font-size: 75px;
}
@media (max-width: 768px) {
  div > span {
    font-size: 50px;
  }
}
.v-enter-active {
  animation: fade-in 0.3s;
}
.v-leave-active {
  animation: fade-in 0.4s reverse;
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
