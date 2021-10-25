## Integration Test Instructions

While the integration test suite had been prepared to fit Continous Integration, some setup would be to required to run this locally.

### Nature of integrations tests
---
- Integration tests use the 'Big Bang' integration strategy
- Testing will be done on the basis of creating agents, sending requests to a <u>LIVE</u> backend instance, and checking the database directly with drivers to monitor for acceptance.
- Hence, an appropriate server instance and MongoDB database is a requisite for running Integration Tests locally.

<br/>

### Environmental Variables
---
Integration test files rely on two environmental variables. These are injected at `agent.helpers.ts`.  
These variables must correspond with the arguments for starting the backend server instance.

| Environmental Variable | Example Value | Purpose|
|---|---|---|
|DB_TESTING_PATH| `mongodb://localhost:27017/integrationTests`  | Database connection path used by the  server instance. This is used by the database drivers in each test. |
|SERVER_PORT|`8080`|Server listening port number: used by Agents to conect to backend for sending requests.|

### Example Instructions to set environmental variables
- Bash:  `export SERVER_PORT=8080`
- Powershell: `$env:SERVER_PORT="8080"`

### How to run test
- Set the enviromental variable `NODE_ENV` to be "test".
- Start a running server instance.
- While the server instance is running, run the integration test via `npm run test:integration`. <br>If your server instance is using a port other that 8080, set the enviromental variable `SERVER_PORT` to the port that you used before running the test. <br>If your server instance is using a connection string other than `mongodb://localhost:27017/integrationTests`, set the enviromental variable `DB_TESTING_PATH` to the connection string you're using.

Note the database used for testing will be filled junk data after integration tests.
