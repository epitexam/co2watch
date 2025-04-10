# CO2 Watch

CO2 Watch is a Node.js application designed to monitor CO2 levels using sensors integrated with Home Assistant. It retrieves sensor data, processes it, and sends alerts when thresholds are exceeded. The application also interacts with an external API to store sensor data and history.

## Features

- Fetch CO2 sensor data from Home Assistant.
- Store sensor data and history in an external API.
- Monitor CO2 levels and send alerts when thresholds are exceeded.
- Configurable via environment variables.
- Scheduled execution using cron expressions.

## Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- A running instance of Home Assistant
- An external API for storing sensor data
- A notification service for sending alerts

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd co2watch
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and configure the required environment variables. You can use `.env.test` as a reference:
   ```bash
   cp .env.test .env
   ```

4. Update the `.env` file with your specific configuration:
   ```bash
   HOME_ASSISTANT_URL=http://your-home-assistant-url/api
   HOME_ASSISTANT_TOKEN=your_home_assistant_token
   EXTERNAL_API_URL=http://your-external-api-url/api
   EXTERNAL_API_TOKEN=your_external_api_token
   NOTIFICATION_SERVICE_URL=http://your-notification-service-url
   CRON_SCHEDULE=*/5 * * * * # Example: Run every 5 minutes
   ```

## Usage

1. Start the application:
   ```bash
   yarn start
   ```

2. The application will immediately execute the scheduled task and log the results. Subsequent tasks will run based on the configured cron schedule.

## Code Structure

### `/src/scheduler.js`

- **Purpose**: Manages the scheduled task execution.
- **Key Functions**:
  - `runTask`: Main function that fetches sensor data, checks thresholds, and interacts with the external API.

### `/src/logger.js`

- **Purpose**: Provides logging functionality using Winston.
- **Key Features**:
  - Logs messages to the console and files (`logs/app.log` and `logs/error.log`).

### `/src/index.js`

- **Purpose**: Entry point of the application.
- **Key Features**:
  - Executes the `runTask` function on startup.

### `/src/homeAssistant.js`

- **Purpose**: Interacts with the Home Assistant API.
- **Key Functions**:
  - `getSensors`: Fetches sensors with a specific unit of measurement.
  - `getSensorValue`: Retrieves the current value of a specific sensor.
  - `checkHomeAssistantAvailability`: Checks if the Home Assistant API is available.

### `/src/apiClient.js`

- **Purpose**: Interacts with the external API.
- **Key Functions**:
  - `checkAPIAvailability`: Checks if the external API is available.
  - `checkSensorExists`: Verifies if a sensor exists in the external API.
  - `createSensor`: Creates a new sensor in the external API.
  - `createSensorHistory`: Creates a history entry for a sensor.

### `/src/alertService.js`

- **Purpose**: Handles threshold checks and alert notifications.
- **Key Functions**:
  - `checkThreshold`: Determines if a value exceeds configured thresholds.
  - `sendAlert`: Sends an alert notification when thresholds are exceeded.

### `/src/config.js`

- **Purpose**: Centralized configuration management.
- **Key Features**:
  - Loads environment variables and provides default values.

## Dependencies

This project uses the following npm packages:

1. **`axios`**:
   - A promise-based HTTP client for making HTTP requests.
   - Used to interact with:
     - Home Assistant API (to fetch sensor data and values).
     - External API (to check sensor existence, create sensors, and store history).
     - Notification service (to send alerts).

2. **`dotenv`**:
   - Loads environment variables from a `.env` file into `process.env`.
   - Ensures sensitive data like API tokens and URLs are not hardcoded in the source code.
   - Used in `/src/config.js` to centralize configuration.

3. **`node-cron`**:
   - A library for scheduling tasks using cron expressions.
   - Used in `/src/scheduler.js` to schedule the execution of the `runTask` function at specified intervals.

4. **`winston`**:
   - A versatile logging library for Node.js.
   - Used in `/src/logger.js` to log application events, warnings, and errors to both the console and log files.

## Environment Variables

| Variable                  | Description                                      | Default Value                     |
|---------------------------|--------------------------------------------------|-----------------------------------|
| `HOME_ASSISTANT_URL`      | URL of the Home Assistant API                    | `http://localhost:8123/api/`      |
| `HOME_ASSISTANT_TOKEN`    | Token for authenticating with Home Assistant     | `default_home_assistant_token`    |
| `EXTERNAL_API_URL`        | URL of the external API                          | `http://localhost:3000/api/`      |
| `EXTERNAL_API_TOKEN`      | Token for authenticating with the external API   | `default_external_api_token`      |
| `NOTIFICATION_SERVICE_URL`| URL of the notification service                  | `http://localhost:4000/notify`    |
| `SENSOR_UNIT`             | Unit of measurement for sensors (e.g., `ppm`)   | `ppm`                             |
| `THRESHOLDS`              | Comma-separated list of thresholds (e.g., `800,1000,1200`) | `800,1000,1200`                  |
| `CRON_SCHEDULE`           | Cron expression for scheduling tasks            | `*/5 * * * *` (every 5 minutes)   |

## Logs

- Application logs are stored in the `logs/` directory:
  - `app.log`: General application logs.
  - `error.log`: Logs for errors only.

## Testing

- To test the application, you can use the `.env.test` configuration file and run the application in a test environment.

## Examples

Here are some examples of logs generated by the application:

- **Successful Task Execution**:
  ```
  2023-10-01 12:00:00 [info] : Application démarrée. Les tâches seront exécutées selon la planification cron.
  2023-10-01 12:05:00 [info] : === Début de la tâche planifiée ===
  2023-10-01 12:05:00 [info] : 2 capteur(s) trouvé(s) avec l'unité de mesure "ppm" :
  - Salon : 850 ppm
  - Chambre : 950 ppm
  2023-10-01 12:05:00 [info] : === Fin de la tâche planifiée ===
  ```

- **Threshold Exceeded**:
  ```
  2023-10-01 12:10:00 [warn] : Alerte : Le capteur Salon a mesuré 850 ppm (seuils dépassés : 800).
  ```

## Contributing

We welcome contributions to this project! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add my feature"
   ```
4. Push your branch:
   ```bash
   git push origin feature/my-feature
   ```
5. Open a pull request on the main repository.

## Troubleshooting

Here are some common issues and their solutions:

- **Home Assistant API Unavailable**:
  - Ensure the `HOME_ASSISTANT_URL` and `HOME_ASSISTANT_TOKEN` in your `.env` file are correct.
  - Check if the Home Assistant server is running and accessible.

- **External API Errors**:
  - Verify the `EXTERNAL_API_URL` and `EXTERNAL_API_TOKEN` in your `.env` file.
  - Check the external API logs for more details.

- **Cron Job Not Running**:
  - Ensure the `CRON_SCHEDULE` is correctly configured.
  - Check the application logs for errors.

## Architecture Diagram

Below is a high-level architecture diagram of the application:

```
+-------------------+       +-------------------+       +-------------------+
| Home Assistant    |       | External API      |       | Notification      |
| (CO2 Sensors)     | <---> | (Data Storage)    | <---> | Service           |
+-------------------+       +-------------------+       +-------------------+
         |                           |                           |
         v                           v                           v
+---------------------------------------------------------------+
|                         CO2 Watch                             |
|  - Fetch sensor data                                           |
|  - Store data in external API                                  |
|  - Monitor thresholds and send alerts                         |
+---------------------------------------------------------------+
```

## Acknowledgments

- Part of the code and documentation for this project was generated with the assistance of **GitHub Copilot**, an AI programming assistant.

## License

This project is licensed under the ISC License.

## Author

Created by **Epitexam**.
