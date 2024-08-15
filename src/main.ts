import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    new Bucket(this, 'Bucket', {
      // if I add any objects
      // autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const handler = new Function(this, 'handler', {
      handler: 'index.handler',
      runtime: Runtime.NODEJS_LATEST,
      code: Code.fromInline(
        'export default function handler() { return { statusCode: 200, body: "Hello World" };}',
      ),
    });
    const api = new HttpApi(this, 'chall-Api', {});
    api.addRoutes({
      path: '/hello',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('integration', handler),
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'chall-cdk-test-app-dev', { env: devEnv });
// new MyStack(app, 'cdk-test-app-prod', { env: prodEnv });

app.synth();
