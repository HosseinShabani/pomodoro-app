class Utils {
  formatedDate(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? "0" + min : min}: ${sec < 10 ? "0" + sec : sec}`;
  }
}
const utils = new Utils();
export { utils };
