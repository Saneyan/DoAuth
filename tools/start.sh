#!/bin/sh

dirname="`dirname ${0}`/../"

forever start\
        --minUptime 10000\
        --pidFile /tmp/doauth.pid\
        --o $dirname/logs/stdout.log\
        --e $dirname/logs/error.log\
        $dirname/tools/authorize.js\
        auto=true\
          debug=false\
          config=$dirname/configs/network.json\
          type=wireless\
          test_repeat=5000\
          repeat=3600000
