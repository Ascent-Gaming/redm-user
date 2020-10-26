on('onClientResourceStart', () => {
  // Show the entire RDR3 Map
  Citizen.invokeNative('0x4B8F743A4A6D2FF8', true)
})

let spawned = false
setImmediate(() => {
  while (!spawned) {
    const isSpawned = NetworkIsPlayerActive( PlayerPedId() )
    const isSpawned2: boolean = Citizen.invokeNative("0xB8DFD30D6973E135", PlayerPedId(), Citizen.resultAsInteger())
    console.log(`isSpawned: ${isSpawned ? "yes" : "no"}`)
    if (isSpawned2) {
      emitNet("user:playerSpawned")
      spawned = true
    }
  }
})
