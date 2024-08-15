import * as pulumiCdk from '@pulumi/cdk';
import { RemovalPolicy } from 'aws-cdk-lib';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class MyStack extends pulumiCdk.Stack {
  constructor(id: string, props: pulumiCdk.StackOptions = {}) {
    super(id, props);
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

    this.synth();
  }
}

new MyStack('chall-cdk-test-app-dev');
// new MyStack(app, 'cdk-test-app-prod', { env: prodEnv });
