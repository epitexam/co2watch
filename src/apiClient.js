// src/apiClient.js
const axios = require('axios');
const config = require('./config');

// Envoyer la liste des capteurs à l'API externe
const sendSensorsToAPI = async (sensors) => {
    try {
        await axios.post(`${config.EXTERNAL_API_URL}/sensors`, { sensors });
        console.log('Liste des capteurs envoyée avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi des capteurs à l\'API :', error.message);
    }
};

// Envoyer les données d'un capteur à l'API externe
const sendSensorValueToAPI = async (sensorId, value) => {
    try {
        await axios.post(`${config.EXTERNAL_API_URL}/sensor-data`, { sensorId, value });
        console.log(`Valeur du capteur ${sensorId} envoyée avec succès.`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données du capteur à l\'API :', error.message);
    }
};

module.exports = { sendSensorsToAPI, sendSensorValueToAPI };