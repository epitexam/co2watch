// src/scheduler.js
const cron = require('node-cron');
const { getSensors, getSensorValue } = require('./homeAssistant');
const { checkAPIAvailability, checkSensorExists, createSensor, createSensorHistory } = require('./apiClient');
const { checkThreshold, sendAlert } = require('./alertService');
const config = require('./config');
const logger = require('./logger');

// Fonction principale à exécuter selon la planification
const runTask = async () => {
    logger.info('\n=== Début de la tâche planifiée ===');

    try {
        // Vérifier la disponibilité de l'API externe
        const isAPIAvailable = await checkAPIAvailability();
        if (!isAPIAvailable) {
            logger.warn('L\'API externe n\'est pas disponible. Tâche annulée.');
            logger.info('=== Fin de la tâche planifiée ===\n');
            return;
        }

        // Récupérer les capteurs avec l'unité de mesure configurée
        const sensors = await getSensors(config.SENSOR_UNIT);
        if (sensors.length === 0) {
            logger.info('Aucun capteur trouvé avec l\'unité de mesure :', config.SENSOR_UNIT);
            logger.info('=== Fin de la tâche planifiée ===\n');
            return;
        }

        // Pour chaque capteur, vérifier son existence, le créer si nécessaire, récupérer la valeur et la traiter
        for (const sensor of sensors) {
            try {
                let sensorExists = await checkSensorExists(sensor.friendly_name);
                if (!sensorExists) {
                    logger.warn(`Le capteur "${sensor.friendly_name}" n'existe pas sur l'API externe. Tentative de création...`);
                    const unitOfMeasurement = sensor.unit_of_measurement || config.DEFAULT_UNIT; // Fallback to default if not provided
                    const roomId = 1; // Fallback to default if not provided
                    sensorExists = await createSensor(sensor.friendly_name, unitOfMeasurement, roomId);
                    if (!sensorExists) {
                        logger.error(`Impossible de créer le capteur "${sensor.friendly_name}". Ignoré.`);
                        continue;
                    }
                }
            } catch (error) {
                logger.error(`Erreur lors de la vérification ou de la création du capteur "${sensor.friendly_name}" :`, error.stack || error.message);
                continue;
            }

            const value = await getSensorValue(sensor.entity_id);
            if (value === null) continue;

            // Créer une entrée d'historique pour le capteur
            const recordedAt = new Date().toISOString();
            const historyCreated = await createSensorHistory(sensor.friendly_name, value, recordedAt);
            if (!historyCreated) {
                logger.error(`Impossible de créer une entrée d'historique pour le capteur "${sensor.friendly_name}".`);
                continue;
            }

            // Vérifier les seuils et envoyer une alerte si nécessaire
            const exceededThresholds = checkThreshold(value);
            if (exceededThresholds) {
                await sendAlert(sensor.entity_id, value, exceededThresholds);
            }
        }
    } catch (error) {
        logger.error('Erreur lors de l\'exécution de la tâche planifiée :', error.stack || error.message);
    }

    logger.info('=== Fin de la tâche planifiée ===\n');
};

// Récupérer l'expression cron depuis la configuration ou les arguments de ligne de commande
const cronSchedule = process.env.CRON_SCHEDULE || config.CRON_SCHEDULE;

// Exporter la fonction runTask
module.exports = { runTask };