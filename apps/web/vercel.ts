import {
  deploymentEnv,
  routes,
  type VercelConfig,
} from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      "/api/:path*",
      `${deploymentEnv("VITE_API_URL")}/:path*`,
    ),
    routes.rewrite(
      "/(.*)",
      "/index.html",
    ),
  ],
};