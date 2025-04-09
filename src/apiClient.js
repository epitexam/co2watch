// src/apiClient.js
const axios = require('axios');
const config = require('./config');
const logger = require("./logger");

// Envoyer la liste des capteurs à l'API externe
const sendSensorsToAPI = async (sensors) => {
    try {
        logger.info('Envoi de la liste des capteurs à l\'API externe...');
        logger.info('URL de l\'API :', `${config.EXTERNAL_API_URL}/sensors`);
        logger.info('Données envoyées :', JSON.stringify({ sensors }, null, 2));

        await axios.post(`${config.EXTERNAL_API_URL}/sensors`, { sensors });
        logger.info('Liste des capteurs envoyée avec succès.');
    } catch (error) {
        logger.error('Erreur lors de l\'envoi des capteurs à l\'API :', error.message);
    }
};

// Envoyer les données d'un capteur à l'API externe
const sendSensorValueToAPI = async (sensorId, value) => {
    try {
        logger.info(`Envoi des données du capteur ${sensorId} à l\'API externe...`);
        logger.info('URL de l\'API :', `${config.EXTERNAL_API_URL}/sensor-data`);
        logger.info('Données envoyées :', JSON.stringify({ sensorId, value }, null, 2));

        await axios.post(`${config.EXTERNAL_API_URL}/sensor-data`, { sensorId, value });
        logger.info(`Valeur du capteur ${sensorId} envoyée avec succès.`);
    } catch (error) {
        logger.error('Erreur lors de l\'envoi des données du capteur à l\'API :', error.message);
    }
};

module.exports = { sendSensorsToAPI, sendSensorValueToAPI };