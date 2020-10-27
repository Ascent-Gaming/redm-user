<h1 align="center">RedM User</h1>

<p align="center">
  <i>RedM player authorization and management.</i>
  <br>
  <br>
  <a href="https://github.com/d0p3t/fivem-ts-boilerplate/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="License: MIT">
  </a>
  <a href="https://github.com/Ascent-Gaming/redm-user/commits/master">
    <img src="https://img.shields.io/github/last-commit/Ascent-Gaming/redm-user.svg?style=flat" alt="Last commit">
  </a>
  <a href="">
    <img src="https://img.shields.io/github/workflow/status/Ascent-Gaming/redm-user/Node.js%20CI" alt="Workflow">
  </a>
</p>

## Overview

This resource offers authorization and managment capabilities for *players* connecting to a server.

It currently provides the following:

- **Authorization** using the `Steam` provider. Players must have Steam running in order to connect to the server.
- **Management** in the form of keeping-track who connects to the server, under what IP, and when they last connected.
- Provides a *foundation* for forming relationships between a player and various other, abstract, systems or resources.
- `Events` for responding to a player's connection to the server.

## Dependencies

You should have the following resources already installed and configured:

- [`mysql-async`](https://github.com/amakuu/mysql-async-temporary)
- [`redm-utilities`](https://github.com/Ascent-Gaming/redm-utilities)

## Installation

1. Ensure you have installed all **Dependencies** listed above.
2. `clone` or download this repository into your server's `./resources/` directory.
3. Adjust `config.json` to meet your needs.
4. Aftering ensuring its installed, run `yarn install` in this resources's directory.
5. Build the resource using `yarn build`.
6. `ensure` this resource *after* any of its dependencies.

### MySQL Table

Against the database you configured when installing `mysql-async`, run the `user_table.sql` query. This will populate the database with the necessary table(s) used by this resource.

## Features

### `user:networkActive` Event

> This is a `client` to `client` and `server` event.

An event fired once a player has fully connected to the *network*.

At this point, a player's ID (`global.source`) has been finalized for a player's session.

### `user:canSpawn` Event

> This is a `client` to `client` event.

An event fired once a player can be safely spawned.

***Note: Restarting the `user` resource will cause this event to fire; you should pragmatically account for this when handling the event.***

### `User` Management

When the `user:networkActive` event fires on the `server`, the resource will store the player's connection in the `user` table of your configured database.

This includes the following fields:

- `steamId`
- `ip`
- `createdOn` - Timestamp of when a record was initially *created*.
- `updatedOn` - Timestamp tracking when a record is *updated*.
- `lastOn` - Timestamp updated whenever a user *connects*.

## License
This product is MIT licensed. Please make sure you give credit and include this license in your product.
