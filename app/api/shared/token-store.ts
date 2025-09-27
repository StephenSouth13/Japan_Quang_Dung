// Shared token storage for password reset functionality
// In production, this should be replaced with a database

interface ResetToken {
  token: string;
  email: string;
  expires: number;
  used: boolean;
  createdAt: number;
}

class TokenStore {
  private tokens: Map<string, ResetToken> = new Map();

  // Generate a secure token
  generateToken(): string {
    // In production, use crypto.randomBytes
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
  }

  // Store a token for an email
  storeToken(email: string, token: string, expiresInMs: number = 60 * 60 * 1000): void {
    const expires = Date.now() + expiresInMs;
    this.tokens.set(token, {
      token,
      email,
      expires,
      used: false,
      createdAt: Date.now()
    });

    // Clean up expired tokens
    this.cleanupExpiredTokens();
  }

  // Verify and get token data
  verifyToken(token: string): { isValid: boolean; email?: string } {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return { isValid: false };
    }

    if (tokenData.used || tokenData.expires < Date.now()) {
      return { isValid: false };
    }

    return { isValid: true, email: tokenData.email };
  }

  // Mark token as used
  useToken(token: string): boolean {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData || tokenData.used || tokenData.expires < Date.now()) {
      return false;
    }

    tokenData.used = true;
    return true;
  }

  // Clean up expired tokens
  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expires < now || data.used) {
        this.tokens.delete(token);
      }
    }
  }

  // Get all tokens for debugging (remove in production)
  getDebugInfo(): any {
    return {
      totalTokens: this.tokens.size,
      tokens: Array.from(this.tokens.values()).map(t => ({
        email: t.email,
        expires: new Date(t.expires).toISOString(),
        used: t.used,
        createdAt: new Date(t.createdAt).toISOString()
      }))
    };
  }
}

// Export singleton instance
export const tokenStore = new TokenStore();