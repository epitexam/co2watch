// src/index.js
const logger = require('./logger');
const { runTask } = require('./scheduler');
const cron = require('node-cron');
const config = require('./config');

// Démarrer la tâche immédiatement au lancement du script
runTask().then(() => {
    logger.info('Application démarrée. Les tâches seront exécutées selon la planification cron.');
}).catch((error) => {
    logger.error('Erreur lors de l\'exécution initiale de la tâche :', error.message);
});

// Planifier la tâche avec l'expression cron
cron.schedule(config.CRON_SCHEDULE, async () => {
    try {
        await runTask();
    } catch (error) {
        logger.error('Erreur lors de l\'exécution de la tâche planifiée :', error.message);
    }
});