// config/env.js
export const envConfig = {
  development: {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  },
  production: {
    // domain: "vercel.app",
    // path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "None",
  },
};
