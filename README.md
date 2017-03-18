# Handle

Handle - is a serverless framework and a platform as a service. It allows you to create and deploy your microservices without having to manage the infrastructure. It provides an easy abstraction layer for a document-oriented DB and an object store. And of course it scales well out of the box.

## Features

### Easy HTTP routing

Just list your routes in the `handle.json` configuration file. Handle will automatically create an API Gateway endpoint for each route and integrate it with a service function. 

### Object store

Handle provides utility functions to store and read files from a cloud object store. It is also possible to subscribe to storage events and execute a service function each time an object is created, changed or removed. 

### Document-oriented DB

You get access to a document-oriented distributed database. Handle will create collections listed in your `handle.json` file and provide an API to write and query these collections.

### PubSub

With Handle you can create publish-subscribe channels and use them both on client side and as a communication channel for your services.

### Cron

You can easily schedule an an execution of your service using cron expressions in `handle.json`.

### Static websites

Handle allows to deploy your static content and creates an endpoint for your static website.

## Quick start

### Sign up

At this moment registration is not open yet. Drop an email to [f0rk.tt@gmail.com](mailto:f0rk.tt@gmail.com) if you want to participate in prototype testing.

### Install

```bash
$ npm install -g node-handle
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

For more examples visit [examples](examples)
