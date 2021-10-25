To run test locally:
- Set the enviromental variable `NODE_ENV` to be "test".
- Start a running server instance.
- While the server instance is running run the acceptance test via `npm run test:acceptance`. <br>If your server instance is using a port other than 80, set the enviromental variable `SERVER_PORT` to the port that you used before running the test.

Note the database used for testing will be filled junk data after acceptance tests.

If you're writing some acceptance tests and are confused as why your tests aren't passing, take a screenshot with `await screenshot()` from taiko.
