require('dotenv').config();
const app = require('./src/app');
const connectDatabase = require('./src/config/database');

// Connect to MongoDB
connectDatabase();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Graceful shutdown
  process.exit(1);
});
