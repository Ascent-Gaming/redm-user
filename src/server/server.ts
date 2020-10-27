import * as Config from "../../config.json"
import { UserServerClass } from "./models"

// -- [ Initialize the base User Map ] --
let UserMap: Map<string, UserServerClass> = undefined
on("onResourceStart", (resourceName: string) => {
  if (resourceName == GetCurrentResourceName()) {
    UserMap = new Map<string, UserServerClass>()
  }
})

on("onResourceStop", (resourceName: string) => {
  if (resourceName == GetCurrentResourceName()) {
    UserMap.clear()
  }
})

// -- [ Defer the Player's connection; ensuring they are connecting with Steam open.
//      Will also populate the UserMap described above with the players's "name", "ip", and "steamId" ] --
on("playerConnecting", (name, setKickReason, deferrals) => {
  emit("utilities:logServer", {
    level: "info",
    title: "User-Authorization",
    output: `Authorizing User: "${name}" using SteamID.`,
  })

  deferrals.defer()

  const player: string = global.source

  setTimeout(() => {
    deferrals.update(`Authenticating SteamID for ${Config.user.serverName}`)

    // Collect the player's SteamID for authorization
    let
      steamIdentifier = null

    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
      const identifier = GetPlayerIdentifier(player, i)

      if (identifier.includes("steam:")) {
        steamIdentifier = identifier
      }
    }

    // Defer the connection, either disallowing it or allowing it to progress.
    setTimeout(() => {
      if (steamIdentifier === null) {
        deferrals.done("Unable to authenticate SteamID. Relaunch RedM and make sure you have the Steam Client open.")
        return
      } else {
        deferrals.done()
      }
    }, 0)

  }, 0)

})

// -- [ Destroy the reference to this player in the UserMap ] --
on("playerDropped", (reason: string) => {
  const player = global.source

  emit("utilities:logServer", {
    level: "debug",
    title: "User",
    output: `User ${GetPlayerName(player)} has disconnected. Reason: ${reason}`
  })

  UserMap.delete(player)
})

// -- [ React to the player being activley on the Network; ensures their information is populated in the MySQL DB. ] --
onNet("user:networkActive", (event: UserActivatedEvent) => {
  const player = global.source

  // Collect the player's SteamID and IP for future reference
  let
    steamIdentifier = null,
    ipAddress = null

  for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
    const identifier = GetPlayerIdentifier(player, i)

    if (identifier.includes("steam:")) {
      steamIdentifier = identifier.substring(6, identifier.length)
    }

    if (identifier.includes("ip:")) {
      ipAddress = identifier.substring(3, identifier.length)
    }
  }

  UserMap.set(player, {
    steamId: steamIdentifier,
    ip: ipAddress
  })

  // Check if the player's account is already registered in the DB.
  emit("utilities:logServer", {
    level: "debug",
    title: "User-Authentication",
    output: "Authenticating user's existence in Database records.",
  })

  global.exports['mysql-async']['mysql_fetch_all'](
      "SELECT * FROM user WHERE steamId = @steamId",
      {"@steamId": steamIdentifier},
      (res: []) => onFetchUserExist(player, res)
  )
})

const onFetchUserExist = (playerId: string, response: []) => {
  // User does not exist, create them
  if (response.length == 0) {
    const user = UserMap.get(playerId)

    global.exports['mysql-async']['mysql_execute'](
      "INSERT INTO user (steamId, ip) VALUES (@steamId, @ip)",
      {
        "@steamId": user.steamId,
        "@ip": user.ip
      },
      (res: number) => onInsertUser(playerId, res)
    )
  }
}

const onInsertUser = (playerId: string, response: number) => {
  emit("utilities:logServer", {
    level: "info",
    title: "User-Authentication",
    output: `New USER created in DB. SteamID: ${UserMap.get(playerId).steamId}`
  })
}
