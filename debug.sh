#!/bin/bash

if pgrep "qemu-system-x86" > /dev/null
then
    echo "emulator Running"
else
    echo "starting emulator"
    emulator -avd phone &
    sleep 20s
fi

if pgrep "React\ Native\ De" > /dev/null
then
    echo "debugger Running"
else
    echo "starting debugger"
	~/bin/rn-debugger/React\ Native\ Debugger &
    sleep 10s
fi


npm run android
npm start
