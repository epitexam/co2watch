// src/index.js
const { runTask } = require('./scheduler');

// Démarrer la tâche immédiatement au lancement du script
runTask().then(() => {
    console.log('Application démarrée. Les tâches seront exécutées toutes les 5 minutes.');
});