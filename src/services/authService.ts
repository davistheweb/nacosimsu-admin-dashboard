import { API } from './api'
import { AUTH_ENDPOINTS } from '@/lib/constants'
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/auth'

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await API.post(AUTH_ENDPOINTS.LOGIN, data)
    return response.data
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await API.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data)
    return response.data
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await API.post(AUTH_ENDPOINTS.VERIFY_OTP, data)
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await API.post(AUTH_ENDPOINTS.RESET_PASSWORD, data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await API.post(AUTH_ENDPOINTS.LOGOUT)
  },
}
