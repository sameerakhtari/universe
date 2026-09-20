# Universe — An Interactive Journey to Earth

A dependency-free interactive learning site that starts near the edge of the observable universe and continuously dives inward toward Earth.

## Highlights

- Scroll-driven cosmic zoom: observable universe → cosmic web → Laniakea → Local Group → Milky Way → Orion Spur → Solar System → Earth
- Procedural rendering for stars, galaxies, cosmic filaments, orbits, atmosphere and motion
- Pointer parallax, hover targets and click-to-pin object facts
- Scale/progress HUD, stage navigator, keyboard controls and reduced-motion support
- Responsive desktop/mobile design
- No runtime framework, analytics, trackers, external fonts or third-party scripts
- No GitHub Actions and no generated build artifacts

## Run locally

### Simple static server

```bash
git clone https://github.com/sameerakhtari/universe.git
cd universe
python3 -m http.server 8080
```

Open `http://localhost:8080`.

### Docker Compose + Nginx

```bash
docker compose up -d --build
```

Open `http://SERVER_IP:8088`.

Stop it with:

```bash
docker compose down
```

If you use Nginx Proxy Manager, create a Proxy Host pointing to `http://SERVER_IP:8088`.

A direct Nginx example is included at `deploy/nginx-site.conf`.

## Controls

- Scroll / trackpad — travel across scale
- Move pointer — perspective/parallax
- Hover — discover interactive targets
- Click/tap — pin detailed facts
- Arrow Up/Down or Page Up/Down — jump between stages
- Home / End — beginning / Earth
- Esc — close pinned details

## Scientific framing

The journey spans tens of orders of magnitude, so a literal linear-scale rendering would be impossible on a normal display. The site uses a logarithmic educational scale and artistically compressed transitions while labeling representative real-world distances.

## Security

The public experience is intentionally static: no forms, login, cookies, local storage, server-side code, analytics, external JavaScript, or remote fonts. The included Nginx configs add restrictive security headers.

## License

MIT.
