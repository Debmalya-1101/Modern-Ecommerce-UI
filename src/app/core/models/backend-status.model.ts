export type BackendConnectionState = 'connected';

export interface BackendConnectionStatus {
  state: BackendConnectionState;
  endpoint: string;
  checkedAt: string;
  message: string;
  sampleProductCount: number;
}
