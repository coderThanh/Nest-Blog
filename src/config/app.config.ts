import * as joi from 'joi';

export const configValidationSchema = joi.object({
  PORT: joi.number().default(3000),
  DATABASE_URL: joi.string().required(),

  // JWT Access Config
  JWT_ACCESS_SECRET: joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: joi.string().default('15m'),
  JWT_REFRESH_SECRET: joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
});

export const appConfiguration = () => ({
  port: parseInt(process.env.PORT ?? '3000'),
  DATABASE_URL: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});
