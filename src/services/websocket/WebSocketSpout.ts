import { WebSocketClient } from "./WebSocketClient.ts";
import { WebSocketHeader, WebSocketMessage } from "@/types/websocket";
import { store } from "@/store";

class WebSocketSpout {
  public sendSequence: number;
  public baseUrl?: string;
  public url?: string;
  public websocketClient?: WebSocketClient;
  static __instances__: WebSocketSpout;

  constructor() {
    this.sendSequence = 0;
    const token = store.getState().auth.token;
    if (token) {
      this.baseUrl = `ws://${import.meta.env.VITE_BASE_URL}/driver-websocket/ws`;
      this.url = `ws://${import.meta.env.VITE_BASE_URL}/driver-websocket/ws?Authorization=${token}`;
      this.websocketClient = WebSocketClient.getInstance(this.url);
      this.websocketClient?.connect();
    } else {
      console.error("Websocket Error:token is null");
    }
  }

  /**
   * 获取WebSocket实例，相同的url将会获得相同的实例。
   */

  static getInstance() {
    if (WebSocketSpout.__instances__) {
      return WebSocketSpout.__instances__;
    }
    const instance = new WebSocketSpout();
    WebSocketSpout.__instances__ = instance;
    return instance;
  }

  /**
   * 功能说明:
   * @param message
   * @param header : [Object] {command: *, topic: *}
   * @returns {number}
   */
  sendMessage(message: any, header: WebSocketHeader) {
    this.sendSequence++;
    const sendObj = this._buildSendObj(message, header);

    this.websocketClient?.sendMessage(sendObj);
    return this.sendSequence;
  }

  /**
   *功能描述:订阅一个主题.
   */
  subscribe(
    topic: string,
    onMessageCall?: (message: WebSocketMessage) => void,
    onErrorCall?: () => void,
    onProgress?: () => void,
  ) {
    this.websocketClient?.subscribe(
      topic,
      onMessageCall,
      onErrorCall,
      onProgress,
    );
  }

  /**
   * 构建发送的对象.包括头和体.
   * @param message.
   * @param header
   * @returns {{header: {sequence: number, command: *, topic: *}, body: {content: *}}}
   * @private
   */
  _buildSendObj(message: any, header: WebSocketHeader): WebSocketMessage {
    header.sequence = this.sendSequence;
    const body = { content: message };
    return { header, body };
  }

  dispose(force: boolean) {
    if (this.websocketClient) {
      this.websocketClient.dispose(force);
    }
  }

  clearListener(topic: string) {
    this.websocketClient?.clearListener(topic);
  }
}

export { WebSocketSpout };
