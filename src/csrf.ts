import { doubleCsrf, DoubleCsrfConfigOptions } from "csrf-csrf";

const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  getSecret: () => process.env.CSRF_SECRET as string,
  cookieName: "XSRF-TOKEN",
  cookieOptions: {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
  getTokenFromRequest: (req) => req.body.csrfToken,
};

const csrf = doubleCsrf(doubleCsrfOptions);

export default csrf;
