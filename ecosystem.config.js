module.exports = {
  apps: [
    {
      name: 'portrait-server',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
