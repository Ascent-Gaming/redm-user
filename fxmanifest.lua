fx_version 'adamant'
games {'rdr3'}

name 'Outlawed Roleplay User'
description 'RedM User creation and authentication resource.'
author 'Ryan "Standal" Lockard'

client_scripts {
  'dist/client/*.client.js',
}
server_script {
  '@mysql-async/lib/MySQL.lua',
  'dist/server/*.server.js',
  -- ...
}

rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'
