import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { headersConfig, timeoutConfig } from "./httpConfig";
import { deleteAccessBearerToken, getAccessToken } from "./server";

const authPath = ["/account-recovery", "/login"];

const API_BASE_URL: string | undefined = process.env
  .NEXT_PUBLIC_API_BASE_URL as string;

export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    ...headersConfig,
  },
  ...timeoutConfig,
});

/**
 * @async
 * @function `get_bearer_token`
 *  Retrieves the bearer token and caches it for 20 minutes
 * to avoid fetching it from the server on every API request.
 *
 * For example, when a client makes a request, this function first checks for
 * a cached token. If none exists, it fetches the token from the server, caches
 * it for 20 minutes, and then uses it for subsequent external API requests.
 */
const get_bearer_token = async () => {
  if (
    typeof window !== undefined &&
    window.location.pathname.startsWith("/auth")
  )
    return undefined;
  const cachedToken = Cookies.get("cached_bearer_token");

  if (cachedToken) return cachedToken;

  const token = await getAccessToken();

  const now = new Date();

  const cachedBearerTokenExpirationTime = new Date(
    now.getTime() + 20 * 60 * 1000,
  );

  if (!token) Cookies.remove("cached_bearer_token", { path: "/" });

  if (token !== undefined)
    Cookies.set("cached_bearer_token", token, {
      expires: cachedBearerTokenExpirationTime,
      path: "/",
      secure: true,
      sameSite: "strict",
    });

  return token;
};

API.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const bearer_token = await get_bearer_token();

    if (bearer_token !== undefined) {
      config.headers.Authorization = `Bearer ${bearer_token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    console.log(response);

    return response;
  },
  async (error: AxiosError) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !authPath.includes(window.location.pathname)
    ) {
      await deleteAccessBearerToken().then(() => {
        if (typeof window !== "undefined") {
          localStorage.clear();
          Cookies.remove("cached_bearer_token", { path: "/" });
          window.location.reload();
        }
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default API;
