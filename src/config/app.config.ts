import * as joi from 'joi';

import { toBoolean } from '@/common/ultils/helper';

export const configValidationSchema = joi.object({
  PORT: joi.number().default(3000),
  IS_DEBUG: joi.bool().default(false),
  DATABASE_URL: joi.string().required(),

  // JWT Access Config
  JWT_ACCESS_SECRET: joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: joi.string().default('15m'),
  JWT_REFRESH_SECRET: joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
});

export const appConfiguration = () => ({
  isDebug: toBoolean(process.env.IS_DEBUG) ?? false,
  port: parseInt(process.env.PORT ?? '3000'),
  DATABASE_URL: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});
