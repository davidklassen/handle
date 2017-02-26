# Handle

Handle - is a serverless framework and a platform as a service. It allows you to create and deploy your microservices without having to manage the infrastructure. It provides an easy abstraction layer for a document-oriented DB and an object store. And of course it scales well out of the box.

## Features

- Easy HTTP routing
- Object store
- Document-oriented DB
- Much more in progress

## Quick start

### Sign up

At this moment registration is not open yet. Drop an email to [f0rk.tt@gmail.com](mailto:f0rk.tt@gmail.com) if you want to participate in prototype testing.

### Install

```bash
$ npm install -g handle
$ handle login
email: <your email>
password: <your password>
```

### Create your first project

Create a directory for the project and two files:

#### hello.js

```javascript
/**
 * Responds with a "Hello, World!" string.
 *
 * @return {string}
 */
export default () => 'Hello, World!';
```

#### handle.json

```json
{
  "name": "hello",
  "services": [
    {
      "name": "hello",
      "src": "./hello.js"
    }
  ],
  "http": {
    "routes": [
      {
        "path": "/hello",
        "method": "GET",
        "action": "hello.default"
      }
    ]
  }
}
```

### Deploy

```bash
$ handle deploy
Updating application configuration.

Building services:
	hello: success

Deploying services:
	hello: success

Deploying api:
	GET https://<account-id>-<app-name>.apps.testterritory.com/hello: success

Done.
```

### Enjoy

Visit `https://<account-id>-<app-name>.apps.testterritory.com/hello` to check how your application works.

## Examples

For more examples visit `examples`

## Documentation

// TODO: ...

## TODO

- PubSub
- Static website
- Crontab
