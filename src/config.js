// src/config.js
require('dotenv').config();

module.exports = {
    HOME_ASSISTANT_URL: process.env.HOME_ASSISTANT_URL || 'http://localhost:8123/api/',
    HOME_ASSISTANT_TOKEN: process.env.HOME_ASSISTANT_TOKEN || 'default_home_assistant_token',
    EXTERNAL_API_URL: process.env.EXTERNAL_API_URL || 'http://localhost:3000/api/',
    EXTERNAL_API_TOKEN: process.env.EXTERNAL_API_TOKEN || 'default_external_api_token',
    SENSOR_UNIT: process.env.SENSOR_UNIT || 'ppm',
    THRESHOLDS: process.env.THRESHOLDS ? process.env.THRESHOLDS.split(',').map(Number) : [800, 1000, 1200],
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4000/notify',
    CRON_SCHEDULE: process.env.CRON_SCHEDULE || '*/5 * * * *', // Default: Run every 5 minutes
};