# Deployment

Live at **https://vektor.dpsg-marcelcallo.de** (Uberspace `marcel@sculptor.uberspace.de`), behind its own Basic Auth login (single user `marcel`). Same setup as the LASER repo.

Every push to `main` deploys automatically:

GitHub webhook (push events, JSON) → `https://marcel.uber.space/deploy/vektor`
→ route `deploy_vektor` in `/home/marcel/webhook/app.py` (gunicorn on port 8001, global backend `/deploy`)
→ checks `X-Hub-Signature-256` against `/home/marcel/webhook/vektor_secret`
→ runs `~/vektor/scripts/deploy.sh` (fetch + reset to `origin/main`, rsync `dist/` into the docroot)

| What | Where |
|---|---|
| Checkout | `/home/marcel/vektor` |
| Document root | `/var/www/virtual/marcel/vektor.dpsg-marcelcallo.de` |
| Password file | `/var/www/virtual/marcel/.htpasswd-vektor` |
| Log | `/home/marcel/webhook/deploy-vektor.log` |

Notes:
- DNS: `vektor` CNAME → `sculptor.uberspace.de` (Strato). The domain needs its own backend `uberspace web backend set vektor.dpsg-marcelcallo.de --apache`, otherwise the global `/` backend (Stripe webhook) answers.
- The webhook URL must use `marcel.uber.space`; on the app's own domain `/deploy…` goes to Apache.
- After changing `app.py`: `supervisorctl restart webhook`.
- Manual deploy: `~/vektor/scripts/deploy.sh /var/www/virtual/marcel/vektor.dpsg-marcelcallo.de`
- Change/add a login: `htpasswd -B /var/www/virtual/marcel/.htpasswd-vektor <user>`
