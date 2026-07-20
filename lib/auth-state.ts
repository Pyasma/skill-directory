export type AuthState = {
  success: boolean;
  message: string;
  error?: string;
};

export const initialAuthState: AuthState = {
  success: false,
  message: "",
};
