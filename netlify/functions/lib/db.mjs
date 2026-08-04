import mysql from "mysql2/promise";

let pool;

function requireEnvironmentVariable(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: requireEnvironmentVariable("DB_HOST"),
      port: Number(process.env.DB_PORT || 4000),
      user: requireEnvironmentVariable("DB_USER"),
      password: requireEnvironmentVariable("DB_PASSWORD"),
      database: requireEnvironmentVariable("DB_NAME"),
      ssl:
        process.env.DB_SSL === "false"
          ? undefined
          : {
              minVersion: "TLSv1.2",
              rejectUnauthorized: true,
            },
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  return pool;
}
