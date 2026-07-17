module.exports = {
  apps: [
    {
      name: "buzz-backend",
      script: "./dist/server.js",
      instances: "max", // Cluster mode: scale across all available CPU cores
      exec_mode: "cluster",
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      time: true,
    },
  ],
};
