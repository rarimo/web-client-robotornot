# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic Versioning].

## Unreleased
#### Added
- Support of new proposal types to create proposal form
- Ability to withdraw rewards for delegators
- Ability to withdraw commission for validators

#### Fixed
- Proposal type localization
- Vote message type localization
- The error showing after search
- Voting for proposals
- Validation on proposal form
- Update List votes, after voting
- Fixed max deposit on proposal form
- Search button disabled if input is empty
- Proposal form validation
- Proposal form wrapped label
- Deposit input max value handling
- Migrate to new versions web-kit
- "Staking APR" title
- Filter in account page

#### Removed
- Tokenomics section
- Mint params block
- Part of statistic block


## [0.3.0] - 2023-02-14
#### Added
- Params page
#### Fixed
- Parsing raw log of transaction on transaction overview page
- Rarimo core vote message type localization

## [0.2.1] - 2023-01-23
#### Fixed
- WebSocket config variable name to be overridable

## [0.2.0] - 2023-01-23
#### Added
- Network switcher
- Tokenomics block
- Consensus block
#### Changed
- Wrapped desktop navigation to the dropdown
- Refactored header

## [0.1.0] - 2023-01-18
#### Added
- Proposal create form
- Apollo-client
- Proposal list route
- Latest transactions-list and latest block-list
- Tally result to proposal details
- Voting form
- All transaction List
- All block List
- Account page
- Transaction overview page
- Dark scheme
- Block overview page
- Search bar on dashboard page
- Eslint unused import plugin
- Validators page
- Long pool data
- Delegation form

#### Changed
- CI docker image with preinstalled pnpm
- Refactored loading with useLoading hook
- Refactored table pagination with useTablePagination hook
- Refactored app to support dark scheme
- Refactored StatusMessage component
- Keplr wallet chain config
- Statistic board
- Refactored table lists
- Updated `iconoir-react` to `6.0.0`
- Updated `@mui/material` to `5.11.4`
- Exposed gasPriceStep config for Keplr wallet to the .env

#### Fixed
- Links to account page
- Theme issues
- Proposal types localization

## [0.0.1] - 2022-12-14
#### Under the hood changes
- Initiated project
- Added basic layout
- Added Keplr integration

[Unreleased]: https://gitlab.com/rarimo/dashboard/compare/0.3.0...main
[0.3.0]: https://gitlab.com/rarimo/dashboard/compare/0.2.1...0.3.0
[0.2.1]: https://gitlab.com/rarimo/dashboard/compare/0.2.0...0.2.1
[0.2.0]: https://gitlab.com/rarimo/dashboard/compare/0.1.0...0.2.0
[0.1.0]: https://gitlab.com/rarimo/dashboard/compare/0.0.1...0.1.0
[0.0.1]: https://gitlab.com/rarimo/dashboard/tags/0.0.1

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html
