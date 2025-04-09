// src/index.js
const logger = require('./logger');
const { runTask } = require('./scheduler');

// Démarrer la tâche immédiatement au lancement du script
runTask().then(() => {
    logger.info('Application démarrée. Les tâches seront exécutées selon la planification cron.');
});