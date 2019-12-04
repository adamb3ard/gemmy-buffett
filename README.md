# gemmy-buffett

> A GitHub App built with [Probot](https://github.com/probot/probot) that Checks that server PRs have the latest igneous/plutonic commit hashes in their gemfile.lock
> Made as a part of Q4 Hackday

## Setup

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run bot in dev
npm run dev

# Run the bot
npm start
```
## TODO
Add listener for commit web hooks
Apply better coding practices (DRY,lint,documentation,...)
Get branch/igneous/plutonic details from PR instead of hardcoded
Investigate moving to enterprise Github

## Contributing

If you have suggestions for how gemmy-buffett could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Adam Banks-Beard <adam.banks-beard@cerner.com>
