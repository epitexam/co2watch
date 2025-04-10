// src/apiClient.js
const axios = require('axios');
const config = require('./config');
const logger = require("./logger");
const { log } = require('winston');

// Ajouter le token JWT dans les en-têtes des requêtes
const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${config.EXTERNAL_API_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

// Vérifier si l'API externe est disponible
const checkAPIAvailability = async () => {
    try {
        logger.info('Vérification de la disponibilité de l\'API externe...');
        const response = await axios.get(`${config.EXTERNAL_API_URL}example`, getAuthHeaders());
        if (response.status === 200) {
            logger.info('L\'API externe est disponible.');
            return true;
        } else {
            logger.warn('L\'API externe a répondu, mais le statut n\'est pas 200.');
            return false;
        }
    } catch (error) {
        if (error.response) {
            const errorData = typeof error.response.data === 'object' ? JSON.stringify(error.response.data, null, 2) : error.response.data;
            logger.error(`Erreur HTTP ${error.response.status} lors de la vérification de l'API : ${errorData}`);
        } else {
            logger.error('Erreur lors de la vérification de l\'API externe :', error.stack || error.message);
        }
        return false;
    }
};

// Vérifier si un capteur existe sur l'API externe
const checkSensorExists = async (friendlyName) => {
    try {
        logger.info(`Vérification de l'existence d'un capteur avec le friendly_name "${friendlyName}" sur l'API externe...`);
        const response = await axios.get(`${config.EXTERNAL_API_URL}v1/sensor`, {
            ...getAuthHeaders(),
            params: { friendly_name: friendlyName },
        });

        if (response.status === 200 && response.data.sensors && response.data.sensors.length > 0) {
            logger.info(`Un capteur avec le friendly_name "${friendlyName}" existe sur l'API externe.`);
            return true;
        } else {
            logger.warn(`Aucun capteur avec le friendly_name "${friendlyName}" trouvé sur l'API externe.`);
            return false;
        }
    } catch (error) {
        if (error.response) {
            const errorData = typeof error.response.data === 'object' ? JSON.stringify(error.response.data, null, 2) : error.response.data;
            logger.error(`Erreur HTTP ${error.response.status} lors de la vérification du capteur "${friendlyName}" : ${errorData}`);
        } else {
            logger.error(`Erreur lors de la vérification du capteur "${friendlyName}" :`, error.stack || error.message);
        }
        return false;
    }
};

// Créer un nouveau capteur dans l'API externe
const createSensor = async (friendlyName, unitOfMeasurement, roomId) => {
    try {
        logger.info(`Création d'un nouveau capteur avec le friendly_name "${friendlyName}" sur l'API externe...`);
        const response = await axios.post(
            `${config.EXTERNAL_API_URL}v1/admin/sensor`,
            {
                friendly_name: friendlyName,
                unit_of_measurement: unitOfMeasurement,
                room_id: roomId,
            },
            getAuthHeaders()
        );

        if (response.status === 201) {
            logger.info(`Le capteur "${friendlyName}" a été créé avec succès sur l'API externe.`);
            return true;
        } else {
            logger.warn(`Le capteur "${friendlyName}" n'a pas pu être créé. Statut : ${response.status}`);
            return false;
        }
    } catch (error) {
        if (error.response) {
            const errorData = typeof error.response.data === 'object' ? JSON.stringify(error.response.data, null, 2) : error.response.data;
            logger.error(`Erreur HTTP ${error.response.status} lors de la création du capteur "${friendlyName}" : ${errorData}`);
        } else {
            logger.error(`Erreur lors de la création du capteur "${friendlyName}" :`, error.stack || error.message);
        }
        return false;
    }
};

// Créer une entrée d'historique pour un capteur
const createSensorHistory = async (friendlyName, state, recordedAt) => {
    try {
        logger.info(`Création d'une entrée d'historique pour le capteur "${friendlyName}" avec l'état "${state}"...`);
        const response = await axios.post(
            `${config.EXTERNAL_API_URL}v1/admin/history/`,
            {
                friendly_name: friendlyName,
                state,
                recorded_at: recordedAt,
            },
            getAuthHeaders()
        );

        if (response.status === 201) {
            logger.info(`L'entrée d'historique pour le capteur "${friendlyName}" a été créée avec succès.`);
            return true;
        } else {
            logger.warn(`L'entrée d'historique pour le capteur "${friendlyName}" n'a pas pu être créée. Statut : ${response.status}`);
            return false;
        }
    } catch (error) {
        if (error.response) {
            const errorData = typeof error.response.data === 'object' ? JSON.stringify(error.response.data, null, 2) : error.response.data;
            logger.error(`Erreur HTTP ${error.response.status} lors de la création de l'historique pour le capteur "${friendlyName}" : ${errorData}`);
        } else {
            logger.error(`Erreur lors de la création de l'historique pour le capteur "${friendlyName}" :`, error.stack || error.message);
        }
        return false;
    }
};

module.exports = { checkAPIAvailability, checkSensorExists, createSensor, createSensorHistory };