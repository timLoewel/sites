#!/bin/bash

~/Android/Sdk/emulator/emulator -avd PhoneAPI23 > /dev/null 2>&1htop
adb reverse tcp:7007 tcp:7007
npm run storybook
xdg-open http://localhost:7007/
