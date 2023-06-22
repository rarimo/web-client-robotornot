## Project setup
```shell
pnpm i
```

### Compiles and hot-reloads for development
```shell
pnpm start
```

### Compiles and minifies for production
```shell
pnpm build
```

### Lints and fixes files
```shell
pnpm lint
```

### Lints release/release candidate version
```shell
pnpm rsc %release-version%
```

### Analyze bundle
```shell
pnpm analyze
```

### Build docker image with version
```shell
 docker build --no-cache --progress=plain --build-arg BUILD_VERSION=0.0.1 -t dashboard .
```
