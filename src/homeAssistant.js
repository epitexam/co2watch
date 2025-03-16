// src/homeAssistant.js
const axios = require('axios');
const config = require('./config');
const logger = require('./logger'); // Importer le logger

// Récupérer tous les capteurs avec une unité de mesure spécifique (par défaut 'ppm')
const getSensors = async (unit = 'ppm') => {
    try {
        logger.info('Récupération des capteurs depuis Home Assistant...');
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}/states`, {
            headers: {
                'Authorization': `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Filtrer les capteurs dont l'unité de mesure correspond
        const sensors = response.data.filter(entity => {
            return entity.attributes && entity.attributes.unit_of_measurement === unit;
        });

        logger.info(`${sensors.length} capteur(s) trouvé(s) avec l'unité de mesure "${unit}" :`);
        sensors.forEach(sensor => {
            logger.info(`- ${sensor.entity_id} : ${sensor.state} ${sensor.attributes.unit_of_measurement}`);
        });

        return sensors;
    } catch (error) {
        logger.error('Erreur lors de la récupération des capteurs :', error.message);
        return [];
    }
};

// Récupérer la valeur d'un capteur spécifique
const getSensorValue = async (sensorId) => {
    try {
        logger.info(`Récupération de la valeur du capteur ${sensorId}...`);
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}/states/${sensorId}`, {
            headers: {
                'Authorization': `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        const value = parseFloat(response.data.state);
        logger.info(`Valeur du capteur ${sensorId} : ${value}`);
        return value;
    } catch (error) {
        logger.error(`Erreur lors de la récupération de la valeur du capteur ${sensorId} :`, error.message);
        return null;
    }
};

module.exports = { getSensors, getSensorValue };