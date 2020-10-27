/**
 * Define common `Types` here to be automatically avialable in both the
 * `/client/` and `/server/` directories.
 * 
 * A common example would be `Events` passed between the client and server.
 */

type UserActivatedEvent = {
  playerPedId: number
  playerId: number
}
