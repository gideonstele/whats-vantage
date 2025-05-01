import { config as dotenvConfig } from 'dotenv';
import { expand as dotenvExpand } from 'dotenv-expand';
import fs from 'node:fs';
import path from 'node:path';

function getClientEnvironment(publicUrl: string) {
  const envPath = path.join(publicUrl, '.env');

  const dotenvFiles = [
    `${envPath}.${process.env.NODE_ENV}.local`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    process.env.NODE_ENV !== 'test' && `${envPath}.local`,
    `${envPath}.${process.env.NODE_ENV}`,
    envPath,
  ].filter(Boolean) as string[];

  const env = {};

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      const envItem = dotenvExpand(
        dotenvConfig({
          path: dotenvFile,
        }),
      );

      Object.assign(env, envItem);
    }
  });

  const raw = Object.keys(process.env).reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      // Useful for determining whether we’re running in production mode.
      // Most importantly, it switches React into the correct mode.
      NODE_ENV: process.env.NODE_ENV || 'development',
    } as Record<string, string | undefined>,
  );
  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce(
      (env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      },
      {} as Record<string, string | undefined>,
    ),
  };

  return { raw, stringified };
}

export default getClientEnvironment;
