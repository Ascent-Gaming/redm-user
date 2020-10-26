import { Delay } from "../util"

on("onClientResourceStart", () => {
  // Show the entire RDR3 Map
  Citizen.invokeNative("0x4B8F743A4A6D2FF8", true)
})

// -- [ Loop checking for when a player becomes "ACTIVE" on the network. ] --
let NetworkActive = false
const NetworkTick = setTick(async () => {
  while (!NetworkActive) {
    const
      playerPedId = PlayerPedId(),
      playerId = NetworkGetPlayerIndexFromPed(playerPedId),
      isNetworkActive = NetworkIsPlayerActive(playerId)

    if (isNetworkActive) {
      emitNet("user:networkActive")
      global.exports['spawnmanager']['spawnPlayer']()
      NetworkActive = true
      clearTick(NetworkTick)
    }
    await Delay(1000)
  }
})
