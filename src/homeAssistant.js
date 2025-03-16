// src/homeAssistant.js
const axios = require('axios');
const config = require('./config');

// Récupérer tous les capteurs ou filtrer par type
const getSensors = async (sensorType = null) => {
    try {
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}/states`, {
            headers: {
                'Authorization': `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Filtrer par type de capteur si spécifié
        if (sensorType) {
            return response.data.filter(entity => entity.entity_id.includes(sensorType));
        }

        // Sinon, retourner tous les capteurs
        return response.data.filter(entity => entity.entity_id.startsWith('sensor.'));
    } catch (error) {
        console.error('Erreur lors de la récupération des capteurs :', error.message);
        return [];
    }
};

// Récupérer la valeur d'un capteur spécifique
const getSensorValue = async (sensorId) => {
    try {
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}/states/${sensorId}`, {
            headers: {
                'Authorization': `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return parseFloat(response.data.state); // Convertir la valeur en nombre
    } catch (error) {
        console.error(`Erreur lors de la récupération de la valeur du capteur ${sensorId} :`, error.message);
        return null;
    }
};

module.exports = { getSensors, getSensorValue };