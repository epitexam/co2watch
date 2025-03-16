// src/index.js
const { runTask } = require('./scheduler');

// Démarrer la tâche immédiatement au lancement du script
runTask().then(() => {
    console.log('Application démarrée. Les tâches seront exécutées selon la planification cron.');
});