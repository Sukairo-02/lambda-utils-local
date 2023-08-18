import { Bucket, Job, StackContext, Function, Api } from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dotenv from "dotenv";
dotenv.config();

export function ExampleStack({ stack }: StackContext) {
  // const bucket = new Bucket(stack, "Bucket", {
  //   notifications: {
  //     resize: {
  //       function: {
  //         runtime: "container",
  //         timeout: 30,
  //         memorySize: 3008,
  //         handler: "./packages/functions",
  //       },
  //       events: ["object_created"],
  //     },
  //   },
  // });


  // bucket.attachPermissions([bucket]);

  const cropFunc = new Function(stack, "cropFunction", {
    architecture:"arm_64",
    runtime: "container",
    // runtime: "nodejs18.x",
    // handler: "./packages/functions"
    handler: "./packages/functions"
  })

  const api = new Api(stack, "Api", {
    routes: {
      "PUT /": cropFunc,
    }
  })

  api.attachPermissions([api])

  // Show the endpoint in the output
  stack.addOutputs({
    ApiUrl: api.url
  });
}
