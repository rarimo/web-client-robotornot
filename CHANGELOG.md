# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- `@napalmpapalam/rlx` package for changelog automation

### Changed
- Format changelog to match `Keep a Changelog` format
- Replace custom RSC script with `@napalmpapalam/rlx` package
- Update `yarn` to `4.2.2`

## [2.9.0] - 2024-04-10
### Changed
- Update `@rarimo/rarime-connector` with increased timeout per operation

## [2.8.0] - 2024-02-02
### Added
- resave VC in success page ([ProofSubmitted.tsx](src/pages/MainPage/components/8_ProofSubmitted/ProofSubmitted.tsx))

### Changed
- Update `@rarimo/rarime-connector` to `2.0.2`

### Fixed
- kyc provider detecting method calls, when did is not defined

## [2.7.0] - 2024-01-25
### Added
- Maintenance page
- Check MetaMask version
- Iden3 Core v2 compatible snap

### Fixed
- Remove the option to connect any other wallets except Metamask

## [2.6.1] - 2024-01-09
### Added
- Text about snap in connect snap step

### Changed
- Zero-Knowledge proof generation error message
- Icon key
- `Press enter` fixed styles and icon
- `@stylelint-declaration-strict-value` fixed version
- `@rarimo/rarime-connector` - bump version to`2.0.0-rc.1`

## [2.6.0] - 2023-12-22
### Added
- `IsNotRegistered` KYC unauthorized error

### Changed
- Notification toast styles
- Redirect to rariMe app on submitted proof view
- Update `large` media breakpoint to `1600px`

### Fixed
- KYC providers. Fix title font size

## [2.5.2] - 2023-12-21
### Changed
- OG image

## [2.5.1] - 2023-12-11
### Fixed
- `Link to Rarime dashboard` design

## [2.5.0] - 2023-12-11
### Added
- Link to Rarime dashboard

## [2.4.5] - 2023-12-08
### Changed
- snap connector version update to `1.0.2`

## [2.4.4] - 2023-12-07
### Changed
- errors time out notification

## [2.4.3] - 2023-12-07
### Changed
- Community link

## [2.4.2] - 2023-12-07
### Fixed
- github workflow `tag` action

## [2.4.1] - 2023-11-30
### Fixed
- identity creation

## [2.4.0] - 2023-11-28
### Changed
- `@rarimo/rarime-connector` - bump version to 1.0.0-rc.0
- Getting identity id's

## [2.3.0] - 2023-11-17
### Changed
- env files interaction, now .env files are able to bundle in ci

## [2.2.1] - 2023-11-10
### Changed
- fonts display type
- bg image type

## [2.2.0] - 2023-11-01
### Added
- sentry tracking for proved identities
- extra conditions for detecting start step

## [2.1.0] - 2023-10-30
### Changed
- Update CI/CD

## [2.0.0] - 2023-09-13
### Added
- Auth Providers page:
  - Civic kyc provider
  - Gitcoin kyc provider
  - UD kyc provider
  - Worldcoin kyc provider
- Kyc details and ZKP gen page
  - Saving PK
  - Generating ZKP
- ZKP submit page
  - transiting state
  - prove zkp (submit proof) (with increased gas limit)
  - checking core and target states
- ZKP context
  - generating proof
  - getting credentials
  - creating identity
  - check claim offer status
- Kyc context
  - working with (Civic, Gitcoin, UD, Worldcoin) kyc providers
  - parse kyc details
  - verifying kyc for claim issuing
- Web3 provider context
  - working with wallets (metamask)

## [1.0.0] - 2023-06-25
### Added
- Fields
  - Checkbox
  - Basic Select with icon
  - Switch
  - Textarea

### Changed
- Bump Eslint & Stylelint versions and fix deprecations
- Notification toasts usage
- Event bus usage
- Store: `Redux` to `Valtio`
- `Lodash-es` to `Lodash`
- Vite config

## [1.0.0-rc.1] - 2022-09-26
### Added
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
### Added
- Initiated and setup project


[Unreleased]: https://github.com/rarimo/web-client-robotornot/compare/2.9.0...HEAD
[2.9.0]: https://github.com/rarimo/web-client-robotornot/compare/2.8.0...2.9.0
[2.8.0]: https://github.com/rarimo/web-client-robotornot/compare/2.7.0...2.8.0
[2.7.0]: https://github.com/rarimo/web-client-robotornot/compare/2.6.1...2.7.0
[2.6.1]: https://github.com/rarimo/web-client-robotornot/compare/2.6.0...2.6.1
[2.6.0]: https://github.com/rarimo/web-client-robotornot/compare/2.5.2...2.6.0
[2.5.2]: https://github.com/rarimo/web-client-robotornot/compare/2.5.1...2.5.2
[2.5.1]: https://github.com/rarimo/web-client-robotornot/compare/2.5.0...2.5.1
[2.5.0]: https://github.com/rarimo/web-client-robotornot/compare/2.4.5...2.5.0
[2.4.5]: https://github.com/rarimo/web-client-robotornot/compare/2.4.4...2.4.5
[2.4.4]: https://github.com/rarimo/web-client-robotornot/compare/2.4.3...2.4.4
[2.4.3]: https://github.com/rarimo/web-client-robotornot/compare/2.4.2...2.4.3
[2.4.2]: https://github.com/rarimo/web-client-robotornot/compare/2.4.1...2.4.2
[2.4.1]: https://github.com/rarimo/web-client-robotornot/compare/2.4.0...2.4.1
[2.4.0]: https://github.com/rarimo/web-client-robotornot/compare/2.3.0...2.4.0
[2.3.0]: https://github.com/rarimo/web-client-robotornot/compare/2.2.1...2.3.0
[2.2.1]: https://github.com/rarimo/web-client-robotornot/compare/2.2.0...2.2.1
[2.2.0]: https://github.com/rarimo/web-client-robotornot/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/rarimo/web-client-robotornot/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/rarimo/web-client-robotornot/compare/1.0.0...2.0.0
[1.0.0]: https://github.com/rarimo/web-client-robotornot/compare/1.0.0-rc.1...1.0.0
[1.0.0-rc.1]: https://github.com/rarimo/web-client-robotornot/compare/1.0.0-rc.0...1.0.0-rc.1
[1.0.0-rc.0]: https://github.com/rarimo/web-client-robotornot/releases/tag/1.0.0-rc.0
