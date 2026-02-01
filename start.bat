@echo off
echo Starting Pageant Voting System...

REM Start the backend server in a new window
start "Backend Server" cmd /k "cd server && npm install && npm run dev"

REM Start the frontend server in a new window
start "Frontend Server" cmd /k "cd client && npm install && npm start"

echo Servers started in separate windows.
pause