import * as EventEmitter from "events";
import metadata from "../../metadata.json";

export class DebugAdapter extends EventEmitter {
  constructor() {
    super();
  }

  onLoad() {
    console.debug("[Pure Ads Mock - Adapter] OnLoad");
    this.emit("gameLoad", { width: window.innerWidth, height: window.innerHeight });
    this.emit("visible");

    window.addEventListener("resize", () => {
      this.emit("resize", { width: window.innerWidth, height: window.innerHeight });
    });

    window.addEventListener("focus", () => {
      this.emit("gameResume");
    });

    window.addEventListener("blur", () => {
      this.emit("gamePause");
    });
  }

  update() {
  }

  onAssetLoaded() {
    console.debug("[Pure Ads Mock - Adapter] OnAssetLoaded");
  }

  onStart() {
    console.debug("[Pure Ads Mock - Adapter] OnStart");
  }

  onInteraction() {
    console.debug("[Pure Ads Mock - Adapter] OnInteraction");
  }

  onWin() {
    console.debug("[Pure Ads Mock - Adapter] OnWin");
  }

  onLose() {
    console.debug("[Pure Ads Mock - Adapter] OnLose");
  }

  onReplay() {
    console.debug("[Pure Ads Mock - Adapter] OnReplay");
  }

  onOneLevelPassed() {
    console.debug("[Pure Ads Mock - Adapter] OnOneLevelPassed");
  }

  onMidwayProgress() {
    console.debug("[Pure Ads Mock - Adapter] onMidwayProgress");
  }

  onSendEvent(type, name) {
    console.debug("[Pure Ads Mock - Adapter] onSendEvent", type, name);
  }

  onCTAClick(url) {
    console.log(`[Pure Ads Mock - Adapter] OnCTAClicked: ${ url}`);
    window.open(url);
  }

  getScreenSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }
}

export default class PureAds extends EventEmitter {
  constructor() {
    super();
    /** @type {AdsAdapter} */
    this.adapter = new DebugAdapter();
    this.adType = "DEBUG";
    this.platform = this.getPlatform();
    console.log("[Pure Ads Mock] PureAds Inited");
  }

  registerEvents(gameObject) {
    if (this.adapter) {
      this.checkHaveFunction(gameObject.load) && this.adapter.addListener("gameLoad", () => {
        gameObject.load();
      });
      this.checkHaveFunction(gameObject.setPause) && this.adapter.addListener("gamePause", () => {
        gameObject.setPause(true);
      });
      this.checkHaveFunction(gameObject.setPause) && this.adapter.addListener("gameResume", () => {
        gameObject.setPause(false);
      });
      this.checkHaveFunction(gameObject.resize) && this.adapter.addListener("resize", (size) => {
        gameObject.resize(size);
      });
      this.checkHaveFunction(gameObject.onVisible) && this.adapter.addListener("visible", () => {
        gameObject.onVisible();
      });
    }
    else {
      console.warn("[Pure Ads Mock] Ads Adapter is null");
    }
  }

  checkHaveFunction(objFunc) {
    if (typeof objFunc === "function") {
      return true;
    }
    else if (typeof objFunc === "undefined") {
      console.error("[Pure Ads Mock] The game object was not implemented a function yet");
      return false;
    }
    else {
      console.warn(`[Pure Ads Mock] It's neither undefined nor a function. It's a ${ typeof objFunc}`);
      return false;
    }
  }

  load() {
    this.adapter.onLoad();
  }

  getScreenSize() {
    return this.adapter.getScreenSize();
  }

  onCTAClick() {
    let storeURL = (this.platform === "android") ? metadata.androidStoreURL : metadata.iosStoreURL;
    console.log(`[Pure Ads Mock] onCTAClick: ${ storeURL}`);
    this.adapter.onCTAClick(storeURL);
  }

  getPlatform() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if ((/android|Android/i).test(userAgent)) {
      return "android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if ((/iPad|iPhone|iPod|Macintosh/).test(userAgent) && !window.MSStream) {
      return "ios";
    }
    return "android";
  }
}
