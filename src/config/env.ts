const processConfig = {
  name: process.env["name"],
  JWTs: {
    secret: process.env["JWT_SECRET"],
    duration: process.env["JWT_EXPIRES_IN"],
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
  HOST: process.env["HOST"],
  mailer:{
    user:process.env["gmailUser"],
    pass:process.env["gmailPassword"]
  }
};

export default processConfig;
