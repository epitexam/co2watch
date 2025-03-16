// src/scheduler.js
const cron = require('node-cron');
const { getSensors, getSensorValue } = require('./homeAssistant');
const { sendSensorsToAPI, sendSensorValueToAPI } = require('./apiClient');
const { checkThreshold, sendAlert } = require('./alertService');
const config = require('./config');

// Fonction principale à exécuter toutes les 5 minutes
const runTask = async () => {
    console.log('Début de la tâche planifiée...');

    // Récupérer les capteurs (filtrer par type si spécifié)
    const sensors = await getSensors(config.SENSOR_TYPE);
    if (sensors.length === 0) {
        console.log('Aucun capteur trouvé.');
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

        // Vérifier le seuil et envoyer une alerte si nécessaire
        if (checkThreshold(value)) {
            await sendAlert(sensor.entity_id, value);
        }
    }

    console.log('Tâche planifiée terminée.');
};

// Planifier l'exécution toutes les 5 minutes
cron.schedule('*/5 * * * *', runTask);

module.exports = { runTask };