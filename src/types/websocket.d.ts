export interface DataObject {
  [key: string]: any;
}

export interface WebSocketHeader {
  command?: string;
  topic: string;
  cover?: boolean;
  sequence?: number;
  sessionId?: string;
}

export interface WebSocketMessage {
  header: WebSocketHeader;
  body: { content: any };
}
