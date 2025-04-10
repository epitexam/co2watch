// src/homeAssistant.js
const axios = require('axios');
const config = require('./config');
const logger = require('./logger'); // Importer le logger

// Récupérer tous les capteurs avec une unité de mesure spécifique (par défaut 'ppm')
const getSensors = async (unit = 'ppm') => {
    try {
        logger.info('Récupération des capteurs depuis Home Assistant...');
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}states`, {
            headers: {
                'Authorization': `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Filtrer les capteurs dont l'unité de mesure correspond
        const sensors = response.data.filter(entity => {
            return entity.attributes && entity.attributes.unit_of_measurement === unit;
        }).map(sensor => ({
            entity_id: sensor.entity_id,
            state: sensor.state,
            friendly_name: sensor.attributes.friendly_name,
            unit_of_measurement: sensor.attributes.unit_of_measurement,
        }));

        logger.info(`${sensors.length} capteur(s) trouvé(s) avec l'unité de mesure "${unit}" :`);
        sensors.forEach(sensor => {
            logger.info(`- ${sensor.friendly_name} : ${sensor.state} ${sensor.unit_of_measurement}`);
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
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}states/${sensorId}`, {
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

// Vérifier la disponibilité de l'API Home Assistant
const checkHomeAssistantAvailability = async () => {
    try {
        logger.info('Vérification de la disponibilité de l\'API Home Assistant...');
        const response = await axios.get(`${config.HOME_ASSISTANT_URL}`, {
            headers: {
                'Authorization': `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            timeout: 5000, // Timeout set to 5 seconds
        });

        if (response.status === 200) {
            logger.info('L\'API Home Assistant est disponible.');
            return true;
        }

        logger.error(`L\'API Home Assistant a répondu avec un statut inattendu : ${response.status}`);
        return false;
    } catch (error) {
        if (error.response) {
            const { status, statusText } = error.response;
            const errorMessages = {
                401: 'Erreur 401 : Accès non autorisé à l\'API Home Assistant.',
                404: 'Erreur 404 : L\'API Home Assistant est introuvable.',
            };
            logger.error(errorMessages[status] || `Erreur HTTP ${status} : ${statusText}`);
        } else if (error.code === 'ECONNABORTED') {
            logger.error('La vérification de l\'API Home Assistant a expiré (timeout).');
        } else {
            logger.error('Erreur lors de la vérification de l\'API Home Assistant :', error.message);
        }
        return false;
    }
};

module.exports = { getSensors, getSensorValue, checkHomeAssistantAvailability };