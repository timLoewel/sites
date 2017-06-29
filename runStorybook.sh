#!/bin/bash

~/Android/Sdk/emulator/emulator -avd PhoneAPI23 > /dev/null 2>&1 &
sleep 10
adb reverse tcp:7007 tcp:7007
yarn run storybook
xdg-open http://localhost:7007/
