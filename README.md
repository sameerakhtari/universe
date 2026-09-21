# Universe

A real-time 3D educational journey from the observable universe to Earth's surface.

This version is a ground-up rebuild using **Three.js + WebGL + Vite**. It is not a sequence of 2D backgrounds: scroll drives a perspective camera through one spatially arranged 3D experience, and hover/click uses raycasting against real scene objects.

## What changed

- Real perspective camera travel with scroll-controlled position, target and field of view
- Thousands of GPU-rendered 3D stars with color-temperature variation and parallax
- Procedural spiral galaxies with stellar populations, warm bulges and dark dust lanes
- 3D cosmic-web nodes and filaments
- Procedural Milky Way and Local Group galaxies
- Volumetric-feeling Solar Neighborhood and Oort Cloud particle fields
- True planet meshes moving in orbital planes
- Separate materials/textures for Jupiter, Saturn, Uranus, Neptune, Mercury, Venus, Earth and Mars
- Saturn ring geometry, Jupiter banding and Great Red Spot
- Persistent high-detail Earth mesh with cloud shell and Fresnel atmosphere
- Earth–Moon orbital system
- Dedicated low-orbit, atmosphere and ocean-surface 3D environments
- Three.js raycasting for hover/click inspection
- Subtle bloom and ACES tone mapping
- Automatic lower-quality settings for constrained devices
- No GitHub Actions

## Scientific scale note

The journey covers roughly 23 orders of magnitude. Literal astronomical distances and object sizes cannot coexist in one conventional floating-point 3D scene while remaining visible and navigable, so positions and visible radii are **logarithmically/narratively compressed**. The educational labels state representative real-world scales and distances.

## Run on macOS

Requirements: Node.js 22+.

```bash
git clone https://github.com/sameerakhtari/universe.git
cd universe
npm install
npm run dev
```

Open the local URL Vite prints, normally:

```text
http://localhost:5173
```

For a production build:

```bash
npm run build
npm run preview
```

## Docker / homelab

```bash
docker compose up -d --build
```

Open:

```text
http://SERVER_IP:8088
```

## Controls

- Scroll: travel inward/outward through scale
- Pointer: subtle camera look/parallax
- Hover: raycast an object for quick facts
- Click: open full object details
- Arrow Up/Down or Page Up/Down: move stage-by-stage
- Home/End: beginning/end
- Esc: close inspector

## Dependencies

- `three` 0.186.0
- `vite` 8.3.0

No remote fonts, trackers, analytics, runtime CDNs, or GitHub Actions are used.
