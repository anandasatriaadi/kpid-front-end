class AuthService {
  subscribers = new Set();

  subscribe(fn: any) {
    this.subscribers.add(fn);
    console.log("[+] SUBSCRIBED", this.subscribers);
  }

  unsubscribe(fn: any) {
    this.subscribers.delete(fn);
    console.log("[-] UNSUBSCRIBED", this.subscribers);
  }

  logout() {
    console.log(this.subscribers);
    this.subscribers.forEach((fn: any) => fn());
  }
}

export let authService = new AuthService();
