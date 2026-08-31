module.exports = {
  apps: [
    {
      name: 'labourcodes',
      script: 'server/index.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        API_PORT: 8787,
        MONGODB_URI: 'mongodb+srv://maruconsultancy:marulaw@maru.mk4qvu8.mongodb.net/?appName=Maru',
        CLOUDINARY_URL: 'cloudinary://354465238347128:liG-x4mwCgO4omBM-hOt3BOakf0@ulxjdptx',
        SESSION_SECRET: 'b67555c4d08f7d94eb9f17447715f439cea7045b8ec77f892f8dd6de6da13e2d0d126801e3fb98540db19b267fb33c43',
        ADMIN_EMAIL: 'maru.payslip@gmail.com',
        // Paste your Gmail App Password below (16-char password from Google Account → Security → App Passwords)
        GMAIL_APP_PASSWORD: 'uylf ywso nnqr wzcu',
      },
    },
  ],
};
3