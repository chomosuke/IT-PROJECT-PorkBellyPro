# Source code
This subdirectory holds the source code for our CRM.

## Building
- Clone the repository
  ```
  git clone https://github.com/chomosuke/IT-PROJECT-PorkBellyPro.git
  cd IT-PROJECT-PorkBellyPro/src
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
- With default port 80
  ```
  npm start -- -c mongodb://...
  ```
- With a specific port
  ```
  npm start -- -c mongodb://... -p <port>
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
