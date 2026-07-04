export default () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/medcare',
  },
  secretKey: process.env.SECRET_KEY || 'medcare_admin_secret_key_2026',
});
