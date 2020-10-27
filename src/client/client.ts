import { Delay } from "../util"
import { UserClientClass } from "./models"

// -- [ Initialize the base User class (client-side) ] --
let User: UserClientClass = undefined
on("onClientResourceStart", (resourceName: string) => {
  if (resourceName == GetCurrentResourceName()) {
    User = new UserClientClass()
    User.NetworkActive = false
  }
})

// -- [ Loop checking for when a player becomes "ACTIVE" on the network. ] --
const networkActiveTick = setTick(async () => {
  const
    playerPedId = PlayerPedId(),
    playerId = NetworkGetPlayerIndexFromPed(playerPedId)

  while (!User.NetworkActive) {
    const
      isNetworkActive = NetworkIsPlayerActive(playerId)

    if (isNetworkActive) {
      // Update the global User object
      User.NetworkActive = true

      // Emit events to signal a user is activley connected to the network.
      const userActiveEvent: UserActivatedEvent = {
        playerPedId: playerPedId,
        playerId: playerId
      }
      emitNet("user:networkActive", userActiveEvent)
      emit("user:networkActive", userActiveEvent)

      // Cleanup
      clearTick(networkActiveTick)
    }
    await Delay(1000)
  }
})

on("user:networkActive", (event: UserActivatedEvent) => {
  emit("user:canSpawn")

  DoScreenFadeIn(500)
  ShutdownLoadingScreen()
  SetEntityCoords(event.playerPedId, 1.505, 1015.63, 208.4088, false, false, false, true)
  FreezeEntityPosition(event.playerPedId, false)
})
