import * as Config from "../../config.json"

on('playerConnecting', (name, setKickReason, deferrals) => {
  deferrals.defer()

  const player = global.source

  setTimeout(() => {
    deferrals.update(`Authenticating SteamID for ${Config.server_name}.`)
  
    let steamIdentifier = null

    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
      const identifier = GetPlayerIdentifier(player, i)
  
      if (identifier.includes('steam:')) {
        steamIdentifier = identifier
      }
    }

    setTimeout(() => {
      if (steamIdentifier === null) {
        deferrals.done('Unable to authenticate SteamID. Relaunch RedM and make sure you have the Steam Client open.')
        return
      } else {
        deferrals.done()
  
        // global.exports['mysql-async']['mysql_insert'](
        //   'INSERT INTO user (steamId) VALUES (@steamId)',
        //   {'@steamId': steamIdentifier},
        //   (res) => {console.log(res)}
        // )
      }
    }, 0)

  }, 0)

})

onNet("user:playerSpawned", () => {
  const player = global.source
  console.log("gotcha!")
})
