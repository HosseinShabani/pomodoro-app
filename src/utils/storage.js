import { default as store } from "electron-json-storage";
const os = require("os");

store.setDataPath(os.tmpdir());

class Storage {
  save({ key, data }, cb = () => false) {
    store.set(key, data, cb);
  }

  remove({ key }) {
    storage.remove(key);
  }

  load({ key }) {
    return new Promise((resolve, reject) => {
      store.get(key, (error, data) => {
        if (error || !data) reject(error);
        else resolve(data);
      });
    });
  }
}

const storage = new Storage();
export { storage };
