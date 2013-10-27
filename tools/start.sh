#!/bin/sh

forever start --minUptime 10000 --spinSleepTime 1000 --pidfile /tmp/doauth.pid ./tools/authorize.js debug=false config=../configs/network.json type=wireless repeat=3600000
