class Timer {
  timer: ReturnType<typeof setTimeout> | number | null;

  constructor() {
    this.timer = null;
  }

  debounce(func: (arg: any) => void, time: number) {
    if (this.timer) {
      clearTimeout(this.timer as number);
    }

    this.timer = setTimeout(func, time);
  }
}

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
};

export default Timer;
