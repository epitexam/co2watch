// src/scheduler.js
const cron = require('node-cron');
const { getSensors, getSensorValue } = require('./homeAssistant');
const { sendSensorsToAPI, sendSensorValueToAPI, checkAPIAvailability } = require('./apiClient');
const { checkThreshold, sendAlert } = require('./alertService');
const config = require('./config');

// Fonction principale à exécuter selon la planification
const runTask = async () => {
    console.log('\n=== Début de la tâche planifiée ===');

    // Vérifier la disponibilité de l'API externe
    const isAPIAvailable = await checkAPIAvailability();
    if (!isAPIAvailable) {
        console.log('L\'API externe n\'est pas disponible. Tâche annulée.');
        console.log('=== Fin de la tâche planifiée ===\n');
        return;
    }

    // Récupérer les capteurs avec l'unité de mesure configurée
    const sensors = await getSensors(config.SENSOR_UNIT);
    if (sensors.length === 0) {
        console.log('Aucun capteur trouvé avec l\'unité de mesure :', config.SENSOR_UNIT);
        console.log('=== Fin de la tâche planifiée ===\n');
        return;
    }

    // Envoyer la liste des capteurs à l'API externe
    await sendSensorsToAPI(sensors);

    // Pour chaque capteur, récupérer la valeur et la traiter
    for (const sensor of sensors) {
        const value = await getSensorValue(sensor.entity_id);
        if (value === null) continue;

        // Envoyer la valeur du capteur à l'API externe
        await sendSensorValueToAPI(sensor.entity_id, value);

        // Vérifier les seuils et envoyer une alerte si nécessaire
        const exceededThresholds = checkThreshold(value);
        if (exceededThresholds) {
            await sendAlert(sensor.entity_id, value, exceededThresholds);
        }
    }

    console.log('=== Fin de la tâche planifiée ===\n');
};

// Récupérer l'expression cron depuis la configuration ou les arguments de ligne de commande
const cronSchedule = process.env.CRON_SCHEDULE || config.CRON_SCHEDULE;

// Exporter la fonction runTask
module.exports = { runTask };