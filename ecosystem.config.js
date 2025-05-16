module.exports = {
  apps: [
    {
      name: "co2watch",
      script: "./src/index.js",
      watch: false,
      env: {
        NODE_ENV: "production"
      },
      log_file: "./logs/pm2.log",
    }
  ]
};
