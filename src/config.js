// src/config.js
require('dotenv').config();

module.exports = {
    HOME_ASSISTANT_URL: process.env.HOME_ASSISTANT_URL,
    HOME_ASSISTANT_TOKEN: process.env.HOME_ASSISTANT_TOKEN,
    EXTERNAL_API_URL: process.env.EXTERNAL_API_URL,
    EXTERNAL_API_TOKEN: process.env.EXTERNAL_API_TOKEN,
    SENSOR_UNIT: process.env.SENSOR_UNIT || 'ppm',
    THRESHOLDS: process.env.THRESHOLDS ? process.env.THRESHOLDS.split(',').map(Number) : [800, 1000, 1200],
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,
    CRON_SCHEDULE: process.env.CRON_SCHEDULE,
};