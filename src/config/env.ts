const processConfig = {
  name: process.env["name"],
  JWTs: {
    access: {
      key: process.env["JWT_SECRET"],
      duration: process.env["JWT_EXPIRES_IN"],
    },
    refresh: {
      key: process.env["JWT_REFRESH_KEY"],
      duration: process.env["JWT_REFRESH_DURATION"],
    },
    verifyEmail: {
      key: process.env["VERIFICATION_KEY"],
      duration: process.env["VERIFICATION_EXPIRES"],
    },
  },
  dbUrl: process.env["mongoURI"],
  cookie: {
    key: process.env["COOKIE_KEY"],
  },
  enviroment: process.env["NODE_ENV"],
  port: process.env["PORT"],
  bcryptRounds: process.env["BCRYPT_ROUNDS"],
  host: process.env["HOST"],
  mailer: {
    user: process.env["gmailUser"],
    pass: process.env["gmailPassword"],
  },
};

export default processConfig;
