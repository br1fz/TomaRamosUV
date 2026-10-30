// Cross-tab Single Session Lock communication simulator

type SessionCallback = (event: { type: 'SESSION_TRANSFERRED' | 'NEW_LOGIN'; rut: string; timestamp: number }) => void;

class SessionChannelManager {
  private channel: BroadcastChannel | null = null;
  private listeners: SessionCallback[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('uv_single_session_lock_bus');
        this.channel.onmessage = (event) => {
          this.listeners.forEach((fn) => fn(event.data));
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or restricted', e);
      }
    }

    // Also listen to storage events as secondary fallback for browsers
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'uv_session_transfer_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.listeners.forEach((fn) => fn(data));
          } catch {
            // ignore
          }
        }
      });
    }
  }

  public notifyNewLogin(rut: string) {
    const payload = {
      type: 'SESSION_TRANSFERRED' as const,
      rut,
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage(payload);
    }

    try {
      localStorage.setItem('uv_session_transfer_event', JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  public subscribe(callback: SessionCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }
}

export const sessionChannel = new SessionChannelManager();
