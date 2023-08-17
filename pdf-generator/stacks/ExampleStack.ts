import { Api, StackContext, use } from 'sst/constructs';

import { Storage } from './Storage';

export function ExampleStack({ stack }: StackContext) {
    const { bucket } = use(Storage);

    const api = new Api(stack, 'Api', {
        routes: {
            'POST /generate': 'packages/functions/src/generate.handler',
        },
    });

    api.bind([bucket]);

    // Show the endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}
