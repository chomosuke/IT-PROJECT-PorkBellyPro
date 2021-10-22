# Setup Atlas database cluster + get the connection string

1. Head over to https://www.mongodb.com/atlas/database
2. Login to Mongodb Atlas by clicking the sign in button(hilighted in red)
  
    2.1 Or, create a new account by clicking the try free button(hilighted in blue). Please note that logging in with google account is also available.
  
![image](https://user-images.githubusercontent.com/88422113/138383783-80346ac2-696d-4061-a0a6-ac5f39d639f1.png)

3. The webpage will be redirected to the home page after signed in
4. Click on the "Build a Database" button in the middle of the home page, or at the top right of the home page if at least 1 server is existed in the account

![image](https://user-images.githubusercontent.com/88422113/138384417-23c1f4c1-4c86-40fe-abcd-f5fd4feaf697.png)

5. Choose the prefered database plan, server provide, and the server location
6. Setup the server name in the cloud provider selection page

![image](https://user-images.githubusercontent.com/88422113/138384815-deea28a0-a8da-4ce3-ae31-0bf7c9eb9f96.png)

7. Wait 1-3 minutes while the server is being created

![image](https://user-images.githubusercontent.com/88422113/138384911-b37a5310-ca85-4cb3-a889-d551854e5532.png)

8. Click the "connect" button after the database is generated

![image](https://user-images.githubusercontent.com/88422113/138385396-b9fb81de-8fc2-4736-b909-0d2ae1da1c7b.png)

9. add a connection IP address:
  
    9.1 click on  the "Add Current IP address" button if the application is going to be hosted by the current device
  
    9.2 if the application is going to be hosted by the other device, click on  the "Add a Different IP address" and fill in the host device's IP address

10. Create a database user if not existed, then proceed onward by clicking "Choose a connection method"

![image](https://user-images.githubusercontent.com/88422113/138386286-e78fad0c-85a1-47d3-b70e-5151069c7e9c.png)

11. Click on the "Connect your application" button

![image](https://user-images.githubusercontent.com/88422113/138386534-3e2e64dc-d50f-41b2-8c74-59ccb78f4f04.png)

12. make sure the driver is "Node.js" version "4.0 or later"
13. copy and note down the connection string. Please note that the connection string should start with username:password(created in [10]).
  
    13.1 eg. if the user name is "Test" and the password is "12345" then the connection string should start with mongodb+srv://Test1:12345@....
  
![image](https://user-images.githubusercontent.com/88422113/138387413-a8dede3c-b87c-483c-a123-00b5653c3f96.png)

this connection string is required to deploy the application

# Source code
This subdirectory holds the source code for our CRM.

## Building
- Clone the repository
  ```
  git clone https://github.com/chomosuke/IT-PROJECT-PorkBellyPro.git
  cd IT-PROJECT-PorkBellyPro
  ```
- Install dependencies
  ```
  npm install
  ```
- Build monorepo
  ```
  npm run build
  ```

## Running
First choose a secret key to be used with encryption on the server.
The server uses the AES256 encryption algorithm so the key must be 32 bytes long.
Use the `-s` or `--secret` command line argument to provide the key in **base64** encoding.

One easy way to obtain a secret key is using Node's own crypto API to generate one:
```
crypto.randomBytes(32).toString('base64');
```

- With default port 80
  ```
  npm start -- -s <secret> -c mongodb://...
  ```
- With a specific port
  ```
  npm start -- -s <secret> -c mongodb://... -p <port>
  ```

## Contributing
This codebase has a linter set up to automatically run upon Git commit.
If your code fails to commit and you see a line like
```
npm ERR! Lifecycle script `lint:nofix` failed with error: 
```
in your console, this means the linter spotted code style errors.
Fix them before committing your changes.
Small errors may be automatically fixable with
```
npm run lint
```
so try that first.
