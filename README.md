<h2 align="center">Banhammer</h2>

<p align="center">
  <em>🔨 Bot for the French branch of the SCP Foundation. Yep.</em>
</p>

The Banhammer project is an open source discord bot developed by HelloEdit, based on an original version of Loki for the French discord server of the international community that the SCP Foundation is.

This bot includes moderation, page search functions in the SCP Foundation database and other various commands.

## Structure

```
src/
  - assets/     - ressource files like tags list...
  - commands/   - where the commands are located, sorted by group
  - helper/     - some small external functions for layout, verification etc...
  - middleware/ - functions performed before / after commands (authorization, error handler...)
  - plugin/     - Hershel's plugins executed at bot startup
  - types/      - Typescript type folder
```

### Setting up

The bot expects several variables of specific environment:

- `DISCORD_TOKEN` - Discord bot token
- `WIKIDOT_TOKEN` - Wikidot API Token (read-only for security reasons)
- `NODE_ENV` (optional) - `dev` or `production` (default to `production`)

### Install

```bash
yarn i
```

### Build Typescript files

```bash
yarn run build
```

### FAQ

**Why this FAQ?**

To answer extremely interesting questions about bot design, architecture, political orientation and why not, about the various design choices....
Honestly, I just find the FAQs are way too swag.

**Why rely on Hershel instead of Commando, Akairo or others?**

Hershel was created to be as powerful as possible while remaining light and readable, two points that, I find, are too neglected by the other frameworks.

[Hershel](https://github.com/hershel) was created with the aim of combining comfort, simplicity and modularity.

**I want that bot on my server. Now. Right now.**

First of all, thank you very much for your interest in the project, you can't even imagine how happy I am. You can of course use the code under MIT license anywhere you want. You will need to host your own instance of the Banhammer, which is designed to run on only one Guild at a time.

**Pain au chocolat or Chocolatine?**

Butter croissant is better. _dab_

**This FAQ is far too long**

You weren't supposed to read until then.

### Thanks

Because a great project is nothing without great friends, I would like to thank the BMC group for their help and patience when I proved by a + b that Node > PHP.

Thanks also to my friends from Aleph, who have always supported me with messages like "Your humor is as existing as the new version of the bot" or "You've been on the home stretch for a month" and last but no least "Weren't you supposed to code the bot instead of playing Mario Kart?". I love you. You'll go to hell, but I love you all <3.

Special thanks for Loki, I love u man 💖.

### License

MIT

<p align="center">🎩</p>
