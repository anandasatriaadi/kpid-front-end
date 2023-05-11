class AuthService {
  logout_subs = new Set();
  unauthorized_subs = new Set();

  sub_logout(fn: any) {
    this.logout_subs.add(fn);
  }

  unsub_logout(fn: any) {
    this.logout_subs.delete(fn);
  }

  logout() {
    this.logout_subs.forEach((fn: any) => fn());
  }

  sub_unauthorized(fn: any) {
    this.unauthorized_subs.add(fn);
  }

  unsub_unauthorized(fn: any) {
    this.unauthorized_subs.delete(fn);
  }

  unauthorized() {
    this.unauthorized_subs.forEach((fn: any) => fn());
  }
}

export let authService = new AuthService();
