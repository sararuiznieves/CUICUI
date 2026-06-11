export class SessionUtil {
    static setUserSession(sessionId: string, username: string): void {
      localStorage.setItem('userSessionId', sessionId);
      localStorage.setItem('username', username);
    }
  
    static clearUserSession(): void {
      localStorage.removeItem('userSessionId');
      localStorage.removeItem('username');
    }
  
    static isAuthenticated(): boolean {
      const sessionId = localStorage.getItem('userSessionId');
      const username = localStorage.getItem('username');
      return sessionId !== null && username !== null;
    }
  
    static getUsername(): string | null {
      return localStorage.getItem('username');
    }
  
    static getUserSessionId(): string | null {
      return localStorage.getItem('userSessionId');
    }
  }