type Listener = (...args: any[]) => void;

export class EventEmitter {
  private _events: Record<string, Listener[]> = {};

  on(event: string, listener: Listener) {
    (this._events[event] ||= []).push(listener);
    return this;
  }

  addListener(event: string, listener: Listener) {
    return this.on(event, listener);
  }

  once(event: string, listener: Listener) {
    const wrapped: Listener = (...args) => {
      this.off(event, wrapped);
      listener(...args);
    };
    return this.on(event, wrapped);
  }

  off(event: string, listener: Listener) {
    const arr = this._events[event];
    if (!arr) return this;
    this._events[event] = arr.filter((l) => l !== listener);
    return this;
  }

  removeListener(event: string, listener: Listener) {
    return this.off(event, listener);
  }

  removeAllListeners(event?: string) {
    if (event) delete this._events[event];
    else this._events = {};
    return this;
  }

  emit(event: string, ...args: any[]) {
    const arr = this._events[event];
    if (!arr) return false;
    for (const l of arr.slice()) l(...args);
    return true;
  }
}

export default EventEmitter;
