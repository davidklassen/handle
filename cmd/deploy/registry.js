import axios from 'axios'
import settings from './settings';
import sleep from '../utils/sleep';


const registryAPI = 'https://registry.testterritory.com';


async function request(method, endpoint, data) {
    for (let i = 0; i < 10; i++) {
        try {
            return (await axios({
                method,
                url: registryAPI + endpoint,
                headers: { 'x-api-key': settings.accessToken },
                data
            })).data;
        } catch (e) {
            // TODO: parse the response body to determine sleep time.
            if (e.response.data.code === 'TooManyRequestsException') {
                await sleep(500);
                continue;
            }

            throw e;
        }
    }

    throw new Error('Failed to make a request due to "TooManyRequestsException"');
}


export default {
    apps: {
        index() {
            return request(
                'GET',
                `/apps`
            );
        },

        put(config) {
            return request(
                'PUT',
                `/apps/${config.name}`,
                config
            );
        }
    },

    services: {
        deploy(app, bundle) {
            return request(
                'PUT',
                `/apps/${app.name}/services/${bundle.name}`,
                bundle
            );
        }
    },

    db: {
        createCollection(app, collection) {
            return request(
                'PUT',
                `/apps/${app.name}/collections/${collection.name}`,
                collection
            );
        }
    },

    http: {
        createRoute(app, route, service) {
            return request(
                'PUT',
                `/apps/${app.name}/routes/${route.method}_${route.path.replace(/\//g, '_')}`,
                {
                    route,
                    service: {
                        name: service.name,
                        arn: service.arn
                    }
                }
            );
        },

        deployApi(app) {
            return request(
                'PUT',
                `/apps/${app.name}/stages/prod`
            );
        }
    }
}
