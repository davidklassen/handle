import * as service from '<%= path %>';
import config from './handle.json';

exports['default'] = async (e, ctx, fn) => {
    try {
        // FIXME: should handle not only http events.
        const action = config.http.routes
            .find((r) => (r.path === `/${e.resource.split('/').slice(3).join('/')}`) && (r.method === e.httpMethod))
            .action.split('.')[1];
        const result = await service[action](e);
        fn(null, {
            "statusCode": 200,
            "headers": {},
            "body": JSON.stringify(result)
        })
    } catch (e) {
        console.log(e);

        fn(null, {
            "statusCode": 500,
            "headers": {},
            "body": JSON.stringify(e)
        });
    }
};
