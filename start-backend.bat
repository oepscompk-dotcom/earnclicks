@echo off
cd /d C:\Users\PCP\Documents\earnclicks.app\backend
start "Laravel" cmd /c "C:\Users\PCP\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe artisan serve --port=8000"
exit
