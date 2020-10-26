fx_version 'adamant'
games {'rdr3'}

name 'User'
description 'RedM User creation and authentication resource.'
author 'Ryan "Standal" Lockard'

client_scripts {
  'dist/client/*.client.js',
}
server_script {
  'dist/server/*.server.js',
  -- '@mysql-async/lib/MySQL.lua',
  -- ...
}

rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'
