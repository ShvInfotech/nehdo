module.exports = {
  apps: [
    {
      name: "nehdo-backend",
      script: "src/app.js",
      cwd: "/home/mani/public_html/nehdowellness.com/server",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 8001
      }
    }
  ]
};
