@echo off
echo Cleaning Gradle cache...
rmdir /s /q "%USERPROFILE%\.gradle\caches\*"
rmdir /s /q "%USERPROFILE%\.gradle\wrapper\dists"
rmdir /s /q ".gradle\buildOutputCleanup"
rmdir /s /q ".gradle\caches"
echo Done! 