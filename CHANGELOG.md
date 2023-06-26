# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2023-06-25
#### Added
- Fields
  - Checkbox
  - Basic Select with icon
  - Switch
  - Textarea

#### Changed
- Bump Eslint & Stylelint versions and fix deprecations
- Notification toasts usage
- Event bus usage
- Store: `Redux` to `Valtio`
- `Lodash-es` to `Lodash`
- Vite config

## [1.0.0-rc.1] - 2022-09-26
#### Added
- Eslint
- Stylelint
- prettier
- Vite bundler
- react-router-dom
- store
- axios api
- CI/CD
  - gitlab-ci
  - werf.yaml
- Dockerfile
- nginx.conf
- static dir as public dir
  - branding static files
  - styles and files for init-loader
  - noscript files
- sanity-check
- ErrorHandler
- Event Bus by mitt
- i18n localization
- MathUtil
- DateUtil
- Styles structure
- commons
  - AppButton
  - App logo
  - App navbar
  - Collapse
  - ErrorMessage
  - Icon
  - Loader
    - Spinner
  - Modal
  - NoDataMessage
  - Notification
- Fields
  - InputField
  - CheckboxField
  - SelectField
- hooks
  - useForm
  - useFormValidation
- Unit tests

## [1.0.0-rc.0] - 2022-06-30
#### Under the hood changes
- Initiated and setup project

[Unreleased]: https://gitlab.com/distributed_lab/frontend/react-template/compare/1.0.0...main
[1.0.0]: https://gitlab.com/distributed_lab/frontend/react-template/compare/1.0.0-rc.1...1.0.0
[1.0.0-rc.1]: https://gitlab.com/distributed_lab/frontend/react-template/compare/1.0.0-rc.0...1.0.0-rc.1
[1.0.0-rc.0]: https://gitlab.com/distributed_lab/frontend/react-template/tags/1.0.0-rc.0
