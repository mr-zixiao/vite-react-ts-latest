import JsonBig from "json-bigint";
import { DataObject, WebSocketMessage } from "@/types/websocket";

const initObjDataStructure = () => {
  let obj: DataObject = {};
  return {
    get(key: string) {
      return Reflect.get(obj, key);
    },
    set(key: string, value: any, isCoverOld = true) {
      if (isCoverOld) {
        if (key !== null && key !== undefined) {
          obj[key] = value;
        }
      } else if (!Reflect.has(obj, key)) {
        if (key !== null && key !== undefined) {
          obj[key] = value;
        }
      }
    },
    has(key: string) {
      return Reflect.has(obj, key);
    },
    remove(key: string) {
      return Reflect.deleteProperty(obj, key);
    },
    clear() {
      obj = {};
    },
    getValues() {
      return Object.values(obj);
    },
    getKeys() {
      return Object.keys(obj);
    },
    forEach(fun: (key: string, value: any, obj: DataObject) => void) {
      if (fun) {
        Object.entries(obj).forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fun(key, value, obj);
          }
        });
      }
    },
  };
};

enum WEBSOCKET_MESSAGE_TYPE {
  CLOSE = "CLOSE",
  OPEN = "OPEN",
  MESSAGE = "MESSAGE",
}

class WebSocketClient {
  public sessionId?: string;
  public baseUrl: string;
  public MAX_CONNECT_NUM: number;
  public topicListenerObj: DataObject;
  public toSendAfterConnect: any[];
  public _ws: WebSocket | null;
  static __instances__: Map<string, WebSocketClient> = new Map();

  constructor(webSocketUrl: string) {
    this._ws = null;
    this.sessionId = "";
    // websocket地址
    this.baseUrl = webSocketUrl;
    this.MAX_CONNECT_NUM = 3;
    // 存储已经订阅的主题.
    this.topicListenerObj = initObjDataStructure();
    // 该数组的目的是为了处理如果没有连接上，将消息暂时存入数组，连接上以后再使用该消息
    this.toSendAfterConnect = [];
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.addEventListener("beforeunload", () => {
      this.closeConnect();
    });
  }

  /**
   * 连接websocket。
   */
  connect() {
    if (this._ws !== null && this._ws !== undefined) {
      return;
    }
    this._ws = new WebSocket(this.baseUrl);
    this._ws.binaryType = "arraybuffer";
    this._ws.onopen = this._onopen.bind(this);
    this._ws.onerror = this._onerror.bind(this);
  }

  /**
   * 重连
   */
  reconnect() {
    if (this.isConnected()) {
      console.warn("WebSocket have connected,do not need reconnect");
      return;
    }
    if (this._ws) {
      this._ws.close();
    }
    this._ws = null;
    this.connect();
  }

  /**
   *是否连接上/。
   */
  isConnected() {
    return this._ws && this._ws.readyState === 1;
  }

  /**
   * 关闭连接。
   */
  closeConnect() {
    if (this._ws) {
      this._ws.close();
    }
    this.MAX_CONNECT_NUM = 3;
    this._ws = null;
    console.warn("WebSocket断开连接");
  }

  /**
   * 发送消息。
   * @param message
   */
  sendMessage(message: WebSocketMessage) {
    if (
      message.header.command === null ||
      message.header.command === undefined
    ) {
      message.header.command = WEBSOCKET_MESSAGE_TYPE.MESSAGE;
    }
    this._send(message);
  }

  /**
   *功能描述:订阅一个主题.
   * @param topic
   * @param onCorrectCall
   * @param onErrorCall
   * @param onProgress
   * @Author guanyq
   * @return
   */
  subscribe(
    topic: string,
    onCorrectCall?: (message: WebSocketMessage) => void,
    onErrorCall?: () => void,
    onProgress?: () => void,
  ) {
    const structure = initObjDataStructure();
    structure.set("success", onCorrectCall);
    structure.set("error", onErrorCall);
    structure.set("progress", onProgress);
    if (this.topicListenerObj.has(topic)) {
      this.topicListenerObj.get(topic).push(structure);
      return;
    }
    this.topicListenerObj.set(topic, [structure], true);
  }

  clearListener(topic: string) {
    this.topicListenerObj.remove(topic);
  }

  /**
   * 接受到的消息为二进制的处理函数
   */
  bufferCall() {
    return this;
  }

  /**
   * 接受到的消息为文本的处理函数。
   * @param string
   */
  textCall(string: string) {
    const parse = JsonBig.parse(string);
    const command = parse.header.command;
    if (command === WEBSOCKET_MESSAGE_TYPE.OPEN) {
      console.warn(parse.body.content);
      this.openCall(parse);
    } else if (command === WEBSOCKET_MESSAGE_TYPE.CLOSE) {
      console.warn(parse.body.content);
      this._onclose();
    } else {
      const topic = parse.header.topic;
      const topicCalls = this.topicListenerObj.get(topic);
      if (topicCalls && Array.isArray(topicCalls)) {
        topicCalls.forEach((topicCall) => {
          if (
            topicCall &&
            topicCall.has("success") &&
            typeof topicCall.get("success") === "function"
          ) {
            topicCall.get("success")(parse);
          }
        });
      }
    }
  }

  /**
   * 打开成功的回调函数。将会清空任务队列中的任务。
   * @param message
   */
  openCall(message: WebSocketMessage) {
    this.sessionId = message.header.sessionId;
    while (this.isConnected() && this.toSendAfterConnect.length > 0) {
      const message = this.toSendAfterConnect.shift();
      this._send(message);
    }
  }

  /**
   * 打开的回调函数
   * @private
   */
  _onopen(/* openEvent*/) {
    if (this._ws) {
      this._ws.onmessage = this._onmessage.bind(this);
      this._ws.onclose = this._onclose.bind(this);
    } else {
      this.reconnect();
    }
  }

  /**
   * 关闭的回调函数。
   * @private
   */
  _onclose(e?: any) {
    console.warn(e);
    this.closeConnect();
  }

  /**
   * 有消息的回调函数。
   * @param message
   * @private
   */
  _onmessage(message: any) {
    if (message.data instanceof ArrayBuffer) {
      this.bufferCall();
    } else if (typeof message.data === "string") {
      this.textCall(message.data);
    }
  }

  /**
   * 出错的回调函数。
   * @private
   */
  _onerror() {
    if (this.MAX_CONNECT_NUM === 0) {
      console.error("WebSocket连接失败");
      this._ws = null;
      return;
    }
    console.warn(
      "WebSocket连接失败，自动重新尝试连接第" + this.MAX_CONNECT_NUM + "次",
    );
    this.MAX_CONNECT_NUM--;
    this.reconnect();
  }

  /**
   * 发送消息
   * @param message
   * @private
   */
  _send(message: WebSocketMessage) {
    if (this._ws && this.isConnected()) {
      message.header.sessionId = this.sessionId;
      this._ws.send(JSON.stringify(message));
    } else {
      this.toSendAfterConnect.push(message);
    }
  }

  dispose(force: boolean) {
    if (force) {
      console.warn("singleton WebSocketClient will been dispose");
      this.closeConnect();
    }
    this.topicListenerObj.clear();
  }

  /**
   * 获取WebSocket实例，相同的url将会获得相同的实例。
   * @param webSocketUrl
   */
  static getInstance(webSocketUrl: string) {
    if (WebSocketClient.__instances__.has(webSocketUrl)) {
      return WebSocketClient.__instances__.get(webSocketUrl);
    }
    const instance = new WebSocketClient(webSocketUrl);
    WebSocketClient.__instances__.set(webSocketUrl, instance);
    return instance;
  }
}

WebSocketClient.__instances__ = new Map();
export { WebSocketClient };
