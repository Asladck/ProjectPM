SDU Platform — Frontend quickstart and debugging

This README explains how to run the frontend and how to diagnose the "api is not defined" / "Failed to fetch" errors you saw.

1) Two common root causes for the errors you reported:
   - The frontend HTML was opened directly from the filesystem (file://). When opened that way, absolute paths like `/js/api.js` or `/css/main.css` won’t load. That leads to ReferenceError: api is not defined.
   - The backend services (Go auth+ws on 9090, Java attendance 4061, Java file-service 4062) are not running, causing `Failed to fetch` or `ERR_CONNECTION_REFUSED`.

2) Quick start (Windows cmd.exe)
   - Open a terminal (cmd.exe) and cd into project root (where this repo lives):

     cd C:\Users\DWA\GolandProjects\Pjpro

   - Start a simple local static server that serves the repository root (this is important — the HTML uses absolute paths from the project root):

     python -m http.server 8000

     (If you don't have Python, you can use any static server; the idea is to serve the project root so `/css`, `/js`, `/public` resolve.)

   - Open the app in a browser:

     http://localhost:8000/public/login.html

3) Start backend services (recommended via docker-compose)
   - From project root run (Windows cmd):

     docker-compose up --build

   - Wait until containers are healthy. Useful checks (in another terminal):

     curl http://localhost:9090/health
     curl http://localhost:4061/actuator/health
     curl http://localhost:4062/actuator/health

   If services are not available, you will see connection refused errors — start the specific service(s) and check logs using `docker-compose logs -f <service>`.

4) Why serve project root (important)
   - The HTML files reference scripts and styles with absolute paths like `/js/api.js` and `/css/main.css`. To avoid path mismatches, serve the repository root so those absolute paths map to the files created in the repo.

5) Common debugging checklist
   - Browser devtools Network tab: confirm `/js/api.js` returns 200 and is not blocked.
   - If `/js/api.js` 404s, check you started the static server from correct folder and opened `http://localhost:8000/public/login.html`.
   - If fetch calls to backend return `ERR_CONNECTION_REFUSED`, ensure the corresponding backend is online and listening on the expected port.
   - If you still see `ReferenceError: api is not defined`, open console and check exact script load order; `api.js` must be loaded before pages that use `API`/`auth`.

6) Dockerfile note
   - You mentioned a suspicious `EX` line. Make sure your `Dockerfile` contains a valid `EXPOSE` line, e.g.:

     EXPOSE 9090 8085 50051

   - No stray tokens should appear between `RUN chmod +x ./main` and `EXPOSE`.

7) Useful quick commands
   - Start static server in background (PowerShell):
     Start-Process -NoNewWindow -FilePath python -ArgumentList "-m","http.server","8000"

   - Check if a port is listening (PowerShell):
     netstat -ano | findstr ":9090"

8) What I changed in the frontend to address your errors
   - I created `js/api.js` and exposed both `window.API` and `window.api` for compatibility.
   - I created `js/auth.js` and exposed `window.auth`.
   - I updated `js/chat.js` so it waits for `API`/`auth` to be available and provides friendlier errors and reconnect.
   - I added a polished UI (CSS and HTML) under `public/` and `css/`.

9) Next steps I can take for you (pick any):
   - Convert all absolute `/path` imports in HTML to relative ones so you can open files via file:// (less recommended).
   - Add a small local Node-less static server (a small Go or Python script) as `start-frontend.bat` and a one-click developer run script.
   - Add more robust health-check and logs aggregator script.

If you want, I can now:
 - create `start-frontend.bat` to start the static server from project root and open the login page in default browser, and
 - optionally change HTML links to relative paths so opening files with file:// works (not recommended for serious dev).

Tell me which of these you want me to do next, or run the recommended commands and paste the browser console errors if anything still fails.
