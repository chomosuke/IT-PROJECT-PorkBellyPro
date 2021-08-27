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
