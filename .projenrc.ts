import { awscdk } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.151.0',
  defaultReleaseBranch: 'main',
  buildWorkflow: false,
  release: false,
  githubOptions: {
    mergify: false,
    pullRequestLint: false,
  },
  name: 'cdk-test-app',
  projenrcTs: true,
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
    },
  },
  eslintOptions: {
    dirs: [],
    prettier: true,
  },
  packageManager: NodePackageManager.NPM,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
const eslint = project.tryFindObjectFile('.eslintrc.json');
// I don't want to show linting errors for things that get auto fixed
eslint?.addOverride('extends', ['plugin:import/typescript']);
project.synth();
