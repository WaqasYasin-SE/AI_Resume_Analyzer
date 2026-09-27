
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type User,
} from "@/services/api/authApi";

import {
  ToastProvider,
} from "@/context/ToastContext";

import Toast from "@/components/common/Toast";

type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<AuthResult>;

  signup: (
    email: string,
    password: string,
    name?: string
  ) => Promise<AuthResult>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(
  null
);

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (!error) {
    return fallback;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: unknown;
        };
      }
    ).response;

    const data = response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (
      typeof data === "object" &&
      data !== null
    ) {
      const errorData = data as {
        detail?: unknown;
        message?: unknown;
      };

      if (Array.isArray(errorData.detail)) {
        const messages = errorData.detail
          .map((item) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "msg" in item
            ) {
              return String(
                (item as { msg: unknown }).msg
              );
            }

            return String(item);
          })
          .filter(Boolean);

        if (messages.length > 0) {
          return messages.join(", ");
        }
      }

      if (typeof errorData.detail === "string") {
        return errorData.detail;
      }

      if (typeof errorData.message === "string") {
        return errorData.message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
        }
      } catch (error: unknown) {
        console.error(
          "Failed to load current user:",
          error
        );

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<AuthResult> => {
      try {
        await loginUser({
          email,
          password,
        });

        const currentUser = await getCurrentUser();

        setUser(currentUser);

        return {
          success: true,
        };
      } catch (error: unknown) {
        console.error("Login failed:", error);

        return {
          success: false,
          error: getErrorMessage(
            error,
            "Login failed. Please try again."
          ),
        };
      }
    },
    []
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name?: string
    ): Promise<AuthResult> => {
      try {
        await registerUser({
          full_name: name || "",
          email,
          password,
        });

        return {
          success: true,
        };
      } catch (error: unknown) {
        console.error("Signup failed:", error);

        return {
          success: false,
          error: getErrorMessage(
            error,
            "Signup failed. Please try again."
          ),
        };
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (error: unknown) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
    }),
    [user, loading, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      <ToastProvider>
        {children}
        <Toast />
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

