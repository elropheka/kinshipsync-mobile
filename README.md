# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
   pnpm start
   ```

## Code quality & security

Install [pre-commit](https://pre-commit.com/) and [Trivy](https://aquasecurity.github.io/trivy/), then enable hooks:

```bash
brew install pre-commit trivy   # or pip install pre-commit
pnpm precommit:install
```

Hooks run on each commit:

- **TypeScript** — `pnpm typecheck`
- **ESLint** — staged `.ts`/`.tsx` files (`--max-warnings 0` on staged files)
- **Trivy** — HIGH/CRITICAL vulnerabilities in app dependencies (`pnpm-lock.yaml`)

Manual checks:

```bash
pnpm typecheck      # TypeScript
pnpm lint:ci        # ESLint (zero warnings)
pnpm security:scan  # Trivy filesystem scan
pnpm precommit:run  # Run all pre-commit hooks
```

Cloud Functions (`functions/package-lock.json`) are excluded from the mobile Trivy hook; run `cd functions && npm audit` separately.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
