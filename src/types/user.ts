export interface User {
  id: number;
  name: string;
  email: string;
  type: 'buyer' | 'seller' | 'admin' | 'scanner';
  mpConnected?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
