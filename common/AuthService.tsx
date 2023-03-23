class AuthService {
  subscribers = new Set();

  subscribe(fn: any) {
    this.subscribers.add(fn);
  }

  unsubscribe(fn: any) {
    this.subscribers.delete(fn);
  }

  logout() {
    this.subscribers.forEach((fn: any) => fn());
  }
}

export let authService = new AuthService();
