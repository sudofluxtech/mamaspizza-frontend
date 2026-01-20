import { LOGIN_API, ME_API, REGISTER_API, UPDATE_PROFILE_API } from '@/app/api';
import { User } from '@/lib/stores/useAuth';

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.data.access_token) {
        return {
          success: true,
          user: result.data.user,
          token: result.data.access_token,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Login failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  },

  register: async (
    name: string, 
    email: string, 
    password: string, 
    password_confirmation: string
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(REGISTER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      const result = await response.json();

      if (result.success && result.data.access_token) {
        return {
          success: true,
          user: result.data.user,
          token: result.data.access_token,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Registration failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  },

  fetchProfile: async (token: string): Promise<ProfileResponse> => {
    try {
      const response = await fetch(ME_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return {
            success: true,
            user: result.data,
          };
        }
      }
      return { success: false, message: 'Failed to fetch profile' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    }
  },

  updateProfile: async (
    token: string, 
    data: { name: string; email: string; user_image?: File }
  ): Promise<UpdateProfileResponse> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      
      if (data.user_image) {
        formData.append('user_image', data.user_image);
      }

      const response = await fetch(UPDATE_PROFILE_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: result.message || 'Profile updated successfully',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to update profile',
        };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    }
  },
};
