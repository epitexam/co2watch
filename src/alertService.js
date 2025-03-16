// src/alertService.js
const axios = require('axios');
const config = require('./config');

// Vérifier si le seuil est dépassé
const checkThreshold = (value) => {
    return value > config.THRESHOLD;
};

// Envoyer une alerte aux utilisateurs
const sendAlert = async (sensorId, value) => {
    try {
        const message = `Alerte : Le capteur ${sensorId} a mesuré ${value} (seuil dépassé).`;
        await axios.post(`${config.NOTIFICATION_SERVICE_URL}/send`, { message });
        console.log('Alerte envoyée avec succès :', message);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'alerte :', error.message);
    }
};

module.exports = { checkThreshold, sendAlert };