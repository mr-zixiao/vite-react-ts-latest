export default {
  resize() {
    const baseSize = 16;
    const basePc = baseSize / 1920;
    let vW = window.innerWidth;
    const vH = window.innerHeight;
    const dueH = (vW * 1080) / 1920;
    if (vH < dueH) {
      vW = (vH * 1920) / 1080;
    }
    const rem = vW * basePc;
    document.documentElement.style.fontSize = rem + "px";
  },
};
