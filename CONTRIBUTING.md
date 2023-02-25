## Setting Up a Development Environment

1. Install [pnpm](https://pnpm.io/)

2. Run the following commands to set up the development environment.

```
pnpm install
```

## Making sure your changes pass all tests

Some automated checks run on GitHub Actions when a pull request is created.
You can run those checks locally to ensure that your changes will not break the CI build.

### 1. Check the code for TypeScript style violations

```
pnpm lint
```

### 2. Run the test suite
```
pnpm test
```
