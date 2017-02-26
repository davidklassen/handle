import fs from 'fs';
import chalk from 'chalk';
import compile from './compile';
import compress from './compress';
import registry from './registry';
import settings from './settings';


async function task(name, subtasks) {
    const results = [];
    console.log(chalk.bold(`\n${name}`));
    for (const subtask of subtasks) {
        try {
            results.push(await subtask.promise());
            console.log(`\t${subtask.name}: ${chalk.green('success')}`);
        } catch (e) {
            console.log(`\t${subtask.name}: ${chalk.red('error')}`);
            console.log(e);
            process.exit(1);
        }
    }

    return results;
}


export default async () => {
    try {
        console.log(chalk.bold(`Updating application configuration.`));
        const app = await registry.apps.put(JSON.parse(fs.readFileSync('./handle.json').toString()));
        let services;

        if (app.config.services) {
            const bundles = await task('Building services:', app.config.services.map((service) => ({
                name: service.name,
                promise: async () => ({
                    name: service.name,
                    zip: compress(await compile(service))
                })
            })));

             services = await task('Deploying services:', bundles.map((bundle) => ({
                name: bundle.name,
                promise: () => registry.services.deploy(app, bundle)
            })));
        }

        if (app.config.db) {
            await task('Deploying database collections:', app.config.db.collections.map((collection) => ({
                name: collection.name,
                promise: () => registry.db.createCollection(app, collection)
            })));
        }

        if (app.config.http) {
            await task('Deploying api:', app.config.http.routes.map((route) => ({
                name: `${route.method} https://${settings.accountId}-${app.name}.apps.testterritory.com${route.path}`,
                promise: () => registry.http.createRoute(app, route, services.find((s) => s.name === route.action.split('.')[0]))
            })));

            await registry.http.deployApi(app);
        }

        console.log(chalk.bold(`\nDone.`));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}
