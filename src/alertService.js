// src/alertService.js
const axios = require('axios');
const config = require('./config');

// Vérifier si la valeur dépasse un des seuils
const checkThreshold = (value) => {
    const exceededThresholds = config.THRESHOLDS.filter(threshold => value > threshold);
    return exceededThresholds.length > 0 ? exceededThresholds : null;
};

// Envoyer une alerte aux utilisateurs
const sendAlert = async (sensorId, value, exceededThresholds) => {
    try {
        const message = `Alerte : Le capteur ${sensorId} a mesuré ${value} ppm (seuils dépassés : ${exceededThresholds.join(', ')}).`;
        await axios.post(`${config.NOTIFICATION_SERVICE_URL}/send`, { message });
        console.log('Alerte envoyée avec succès :', message);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'alerte :', error.message);
    }
};

module.exports = { checkThreshold, sendAlert };