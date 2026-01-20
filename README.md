# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Current Architecture

The stack is composed as follows:
<img src="./assets/scheme.svg"/>

- Apache handles inbound traffic, acting as a reverse proxy
  - HTTP requests are forwarded to 443
  - HTTPS request are TLS terminated and forwarded to NGINX
  - certificates are locally installed
- Caddy listens on its internal 80 port, serving the app
### Configuration

- Apache is consuming the `/etc/apache2/sites-available/reverse-proxy.conf` file on the machine.
- Caddy configuration is under `./deploy/Caddyfile`

## Deploy and CI/CD

### 1. Install the GitHub runner on the target machine

> Note: this has to be done only once

1. To add a new self-hosted GitHub runner open the **Settings** page of the repository and follow the instructions available on (Sidebar) Actions > Runners > "New self-hosted runner".
  - after launching `./run.sh` and verified that everything is ok, kill the process with CTRL+C.
  - install the runner as a service executing `./svc.sh install $USER`, then start it with `./svc.sh start`
  - if everything went ok you should see the new runner in the repo settings.
  - add a tag to identify the runner. This tag will be used by the deployment action to pick the right machine.
2. if needed, head over the **Environment** section (sidebar) and create a new environment.
  - in the page, be sure to have set:
    - `RUNNER_NAME`: the env name (e.g. `staging`)
    - `VITE_WP_ADMIN_URL_DEV`: WP Admin page URL (e.g. `https://dev.digipedia.tudelft.nl/wp/wp-admin/`)
    - `VITE_HOMEPAGE_URL_DEV`: Platform homepage ULR (e.g. `https://dev.digipedia.tudelft.nl/`)
    - `VITE_BASE_BACKEND_URL`: Backend URL (e.g. `https://dev.digipedia.tudelft.nl/wp-json/tutorial-platform/v1`)

### 2. Build the Docker image

The image build is pretty simple and is in two steps:
1. produces a production build with `npm run build`
2. build a Caddy container that serves the webapp.

Refer to the GitHub action in [.github/workflows/docker.yml]() or, if you want to test things locally, follow (and execute) [./deploy/build.sh]().

### 3. Deploy on staging machine

The deploy workflow is defined in [.github/workflows/deploy.yml](), and runs on the target machine. It is possible to deploy an old version (rollback) running manually the workflow.
