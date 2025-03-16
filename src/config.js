// src/config.js
module.exports = {
    HOME_ASSISTANT_URL: 'http://<HOME_ASSISTANT_IP>:8123/api',
    HOME_ASSISTANT_TOKEN: '<YOUR_ACCESS_TOKEN>',
    EXTERNAL_API_URL: 'http://<EXTERNAL_API_URL>',
    SENSOR_TYPE: 'co2', // Type de capteur à surveiller (par défaut 'co2')
    THRESHOLD: 1000, // Seuil pour les alertes
    NOTIFICATION_SERVICE_URL: 'http://<NOTIFICATION_SERVICE_URL>',
};