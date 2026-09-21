export const STAGES = [
  {
    id: 'observable', title: 'Observable Universe', kicker: '01 · THE COSMIC HORIZON', exponent: 26, hold: 1.55,
    scale: '~10²⁶ metres', distance: 'Present-day radius ≈ 46.5 billion ly',
    description: 'The observable universe is not a physical shell. It is the region whose signals have had time to reach us while space expanded.',
    camera: { position: [0, 20, 520], target: [0, 0, -100], fov: 54 },
    objects: [
      { id: 'cosmic-horizon', name: 'Cosmic Horizon', type: 'Observation limit', summary: 'The limit of the observable region, not an edge of space.', text: 'Every observer has an observable horizon. Regions beyond ours may exist, but their signals have not had time to reach Earth.', facts: [['Radius today','~46.5 billion ly'],['Diameter','~93 billion ly'],['Physical wall?','No'],['Why limited?','Finite signal travel time']] },
      { id: 'cmb', name: 'Cosmic Microwave Background', type: 'Oldest electromagnetic light', summary: 'The afterglow released when the early universe became transparent.', text: 'The CMB preserves tiny temperature variations that trace the density fluctuations from which later cosmic structure grew.', facts: [['Released','~380,000 yr after Big Bang'],['Temperature today','2.725 K'],['Typical redshift','~1100'],['Role','Early-universe snapshot']] }
    ]
  },
  {
    id: 'web', title: 'Cosmic Web', kicker: '02 · STRUCTURE EMERGES', exponent: 24, hold: 1.55,
    scale: '~10²⁴ metres', distance: 'Hundreds of millions of light-years',
    description: 'Gravity gathers matter into filaments, walls and knots around huge underdense voids. Galaxy clusters occupy the densest intersections.',
    camera: { position: [20, 12, -520], target: [0, 0, -900], fov: 52 },
    objects: [
      { id: 'web-node', name: 'Galaxy-cluster Node', type: 'Dense cosmic-web junction', summary: 'A dense knot where several filaments meet.', text: 'The largest nodes host galaxy clusters embedded in massive dark-matter halos and hot intracluster gas.', facts: [['Members','Hundreds–thousands of galaxies'],['Mass','Up to ~10¹⁵ Suns'],['Binding','Gravity'],['Between galaxies','Hot plasma']] },
      { id: 'cosmic-void', name: 'Cosmic Void', type: 'Underdense region', summary: 'A vast region containing far fewer galaxies than average.', text: 'Voids are not completely empty, but their matter density is well below the cosmic mean.', facts: [['Typical scale','Tens–100s Mly'],['Galaxy density','Low'],['Boundaries','Walls and filaments'],['Empty?','No']] }
    ]
  },
  {
    id: 'laniakea', title: 'Laniakea', kicker: '03 · OUR SUPERCLUSTER BASIN', exponent: 23, hold: 1.35,
    scale: '~10²³ metres', distance: '≈ 520 million light-years across',
    description: 'Our local galaxies participate in a vast flow basin called Laniakea, with motions broadly converging toward dense regions in Centaurus.',
    camera: { position: [-25, 8, -1420], target: [15, 0, -1780], fov: 50 },
    objects: [
      { id: 'great-attractor', name: 'Great Attractor Region', type: 'Large-scale flow region', summary: 'A direction toward which many nearby galaxies have peculiar motion.', text: 'The Great Attractor is not one object; it is a region of enhanced gravitational influence partly obscured by the Milky Way.', facts: [['Direction','Centaurus'],['Single object?','No'],['Observed through','Zone of Avoidance'],['Evidence','Galaxy velocities']] }
    ]
  },
  {
    id: 'local-sheet', title: 'Local Sheet', kicker: '04 · NEARBY COSMIC NEIGHBORHOOD', exponent: 22, hold: 1.3,
    scale: '~10²² metres', distance: 'Tens of millions of light-years',
    description: 'The Local Group sits in a flattened arrangement of nearby galaxies. Beyond it, the rich Virgo Cluster becomes a major landmark.',
    camera: { position: [18, 8, -2240], target: [0, 0, -2600], fov: 48 },
    objects: [
      { id: 'virgo', name: 'Virgo Cluster', type: 'Galaxy cluster', summary: 'The nearest large galaxy cluster to the Local Group.', text: 'Virgo contains well over a thousand galaxies and includes the giant elliptical galaxy M87.', facts: [['Distance','~54 million ly'],['Members','~1,000+'],['Notable galaxy','M87'],['Constellation','Virgo']] }
    ]
  },
  {
    id: 'local-group', title: 'Local Group', kicker: '05 · OUR GALACTIC FAMILY', exponent: 22, hold: 1.5,
    scale: '~10²² metres', distance: 'Roughly 10 million light-years across',
    description: 'The Milky Way, Andromeda and Triangulum dominate a gravitationally bound family of dozens of smaller galaxies.',
    camera: { position: [-20, 10, -3050], target: [0, 0, -3420], fov: 48 },
    objects: [
      { id: 'milky-way', name: 'Milky Way', type: 'Barred spiral galaxy', summary: 'Our home galaxy.', text: 'The Sun lives in the Milky Way disk, far from its center, inside a smaller spiral feature called the Orion Spur.', facts: [['Disk diameter','~100,000–120,000 ly'],['Central black hole','Sagittarius A*'],['Our location','Orion Spur'],['Type','Barred spiral']] },
      { id: 'andromeda', name: 'Andromeda · M31', type: 'Spiral galaxy', summary: 'The nearest large spiral galaxy to the Milky Way.', text: 'Andromeda is another dominant Local Group galaxy, approximately 2.5 million light-years away.', facts: [['Distance','~2.5 million ly'],['Catalog','M31 / NGC 224'],['Type','Spiral galaxy'],['Local Group','Major member']] },
      { id: 'triangulum', name: 'Triangulum · M33', type: 'Spiral galaxy', summary: 'The third major spiral galaxy in the Local Group.', text: 'Triangulum is smaller than both Andromeda and the Milky Way but remains one of the Local Group’s most prominent members.', facts: [['Distance','~2.7 million ly'],['Catalog','M33'],['Constellation','Triangulum'],['Type','Spiral galaxy']] }
    ]
  },
  {
    id: 'milky-way', title: 'Milky Way', kicker: '06 · HOME GALAXY', exponent: 21, hold: 1.65,
    scale: '~10²¹ metres', distance: 'Visible disk ≈ 100,000+ light-years',
    description: 'A warm central bulge, dark dust lanes and blue-white spiral arms fill the scene. The Solar System sits far from the core.',
    camera: { position: [45, 24, -3950], target: [0, 0, -4320], fov: 46 },
    objects: [
      { id: 'sagittarius-a', name: 'Sagittarius A*', type: 'Supermassive black hole', summary: 'The compact object at the Milky Way’s dynamical center.', text: 'Sagittarius A* has a mass of roughly four million Suns and lies about 26,000 light-years from us.', facts: [['Mass','~4 million Suns'],['Distance from Sun','~26,000 ly'],['Location','Galactic center'],['Direct image','EHT, 2022']] },
      { id: 'orion-spur', name: 'Orion Spur', type: 'Local spiral feature', summary: 'The Milky Way feature containing the Solar System.', text: 'The Solar System lies in the Orion Spur between the larger Sagittarius and Perseus arms.', facts: [['Also called','Local Arm'],['Contains','Solar System'],['Setting','Galactic disk'],['Galactic-center distance','~26,000 ly']] }
    ]
  },
  {
    id: 'neighborhood', title: 'Solar Neighborhood', kicker: '07 · A LOCAL SEA OF STARS', exponent: 18, hold: 1.35,
    scale: '~10¹⁸ metres', distance: 'Hundreds of light-years',
    description: 'The galaxy resolves into individual stars. Parallax becomes obvious as the camera moves through a genuinely three-dimensional stellar field.',
    camera: { position: [18, 4, -4780], target: [0, 0, -5200], fov: 50 },
    objects: [
      { id: 'sun-neighborhood', name: 'Sun', type: 'G2 V main-sequence star', summary: 'Our local star among billions.', text: 'The Sun is about 4.6 billion years old and contains almost all the mass in the Solar System.', facts: [['Spectral type','G2 V'],['Age','~4.6 billion yr'],['Surface temperature','~5,772 K'],['Galactic orbit','~225–250 Myr']] },
      { id: 'sirius', name: 'Sirius', type: 'Binary star system', summary: 'The brightest star in Earth’s night sky.', text: 'Sirius lies about 8.6 light-years away and contains bright Sirius A plus white-dwarf companion Sirius B.', facts: [['Distance','8.6 ly'],['Primary','Sirius A'],['Companion','White dwarf'],['Constellation','Canis Major']] },
      { id: 'proxima', name: 'Proxima Centauri', type: 'Red dwarf star', summary: 'The closest known star to the Sun.', text: 'Proxima Centauri is a small red dwarf in the Alpha Centauri system and lies a little over four light-years from us.', facts: [['Distance','~4.24 ly'],['Type','Red dwarf'],['System','Alpha Centauri'],['Known planets','Yes']] }
    ]
  },
  {
    id: 'oort', title: 'Oort Cloud', kicker: '08 · THE SOLAR SYSTEM’S DISTANT FRINGE', exponent: 16, hold: 1.35,
    scale: '~10¹⁶ metres', distance: 'Thousands to perhaps ~100,000 AU',
    description: 'The Sun becomes an anchor inside a sparse, roughly spherical reservoir inferred from long-period comet orbits.',
    camera: { position: [0, 18, -5600], target: [0, 0, -6040], fov: 50 },
    objects: [
      { id: 'sun-oort', name: 'Sun', type: 'G-type star', summary: 'From Oort-cloud scale, the entire planetary system hugs this tiny central star.', text: 'Even Neptune is only about 30 AU from the Sun, while proposed Oort-cloud distances extend thousands to tens of thousands of AU.', facts: [['Type','G2 V'],['Planetary zone','Inside ~30 AU'],['Light to Earth','~8 min 20 s'],['Age','~4.6 billion yr']] },
      { id: 'oort-cloud', name: 'Oort Cloud', type: 'Hypothesized comet reservoir', summary: 'A distant shell of icy bodies around the planetary system.', text: 'The Oort Cloud has not been directly imaged as a whole. Its existence is inferred from long-period comet trajectories and formation models.', facts: [['Shape','Roughly spherical'],['Evidence','Long-period comets'],['Directly imaged?','No'],['Composition','Icy small bodies']] }
    ]
  },
  {
    id: 'outer-solar', title: 'Outer Solar System', kicker: '09 · GIANTS AND ICY WORLDS', exponent: 13, hold: 1.55,
    scale: '~10¹³ metres', distance: 'Neptune ≈ 30 AU from the Sun',
    description: 'The giant planets become real spheres moving in three-dimensional orbits around the Sun rather than icons on a flat diagram.',
    camera: { position: [110, 85, -6350], target: [0, 0, -6680], fov: 45 },
    objects: [
      { id: 'sun', name: 'Sun', type: 'G-type star', summary: 'The gravitational and luminous center of the Solar System.', text: 'The Sun contains almost all of the Solar System’s mass and powers the planets with light and heat.', facts: [['Type','G2 V'],['Mass fraction','~99.8%'],['Radius','696,340 km'],['Age','~4.6 billion yr']] },
      { id: 'jupiter', name: 'Jupiter', type: 'Gas giant', summary: 'The largest planet in the Solar System.', text: 'Jupiter’s banded atmosphere, Great Red Spot, moons and powerful magnetosphere make it a planetary system in miniature.', facts: [['Diameter','139,820 km'],['Year','11.86 Earth yr'],['Largest moon','Ganymede'],['Feature','Great Red Spot']] },
      { id: 'saturn', name: 'Saturn', type: 'Gas giant', summary: 'A giant planet surrounded by a broad ring system.', text: 'Saturn’s rings are made mostly of water-ice particles, with many gaps and ringlets.', facts: [['Year','29.45 Earth yr'],['Rings','Ice-rich'],['Largest moon','Titan'],['Type','Gas giant']] },
      { id: 'uranus', name: 'Uranus', type: 'Ice giant', summary: 'A pale ice giant rotating almost on its side.', text: 'Uranus has an extreme axial tilt of about 98 degrees, likely produced by major impacts early in Solar System history.', facts: [['Distance','~19.2 AU'],['Year','84 Earth yr'],['Axial tilt','~98°'],['Type','Ice giant']] },
      { id: 'neptune', name: 'Neptune', type: 'Ice giant', summary: 'The outermost major planet.', text: 'Neptune orbits about 30 AU from the Sun and hosts extremely fast atmospheric winds.', facts: [['Distance','~30 AU'],['Year','164.8 Earth yr'],['Largest moon','Triton'],['Type','Ice giant']] }
    ]
  },
  {
    id: 'inner-solar', title: 'Inner Solar System', kicker: '10 · THE ROCKY PLANETS', exponent: 11, hold: 1.6,
    scale: '~10¹¹ metres', distance: 'Earth = 1 astronomical unit from the Sun',
    description: 'Mercury, Venus, Earth and Mars now separate around the Sun. The camera path begins to favor one small blue planet.',
    camera: { position: [90, 38, -7010], target: [15, 0, -7340], fov: 42 },
    objects: [
      { id: 'sun', name: 'Sun', type: 'G-type star', summary: 'The inner planets orbit this dominant central star.', text: 'Sunlight takes a little over eight minutes to travel from the Sun to Earth.', facts: [['Type','G2 V'],['Earth distance','1 AU'],['Light to Earth','~8 min 20 s'],['Mass fraction','~99.8%']] },
      { id: 'mercury', name: 'Mercury', type: 'Rocky planet', summary: 'The smallest and innermost major planet.', text: 'Mercury circles the Sun every 88 Earth days and has almost no atmosphere to redistribute heat.', facts: [['Distance','~0.39 AU'],['Year','88 days'],['Moons','0'],['Type','Rocky planet']] },
      { id: 'venus', name: 'Venus', type: 'Rocky planet', summary: 'An Earth-sized world beneath a dense greenhouse atmosphere.', text: 'Venus is similar to Earth in size but its dense carbon-dioxide atmosphere produces extreme surface temperatures.', facts: [['Distance','~0.72 AU'],['Year','224.7 days'],['Moons','0'],['Atmosphere','Mostly CO₂']] },
      { id: 'earth-orbit', name: 'Earth', type: 'Rocky planet', summary: 'The third planet from the Sun — our destination.', text: 'Earth orbits the Sun at roughly one astronomical unit and is the only world currently known to host life.', facts: [['Distance from Sun','1 AU'],['Year','365.256 days'],['Moon','1'],['Surface water','~71%']] },
      { id: 'mars', name: 'Mars', type: 'Rocky planet', summary: 'A cold desert world beyond Earth.', text: 'Mars preserves abundant geological evidence of a wetter past.', facts: [['Distance','~1.52 AU'],['Year','687 days'],['Moons','2'],['Surface','Iron-rich dust']] }
    ]
  },
  {
    id: 'earth-moon', title: 'Earth–Moon System', kicker: '11 · OUR DOUBLE-WORLD VIEW', exponent: 9, hold: 1.7,
    scale: '~10⁹ metres', distance: 'Moon ≈ 384,400 km from Earth',
    description: 'Earth separates from the planetary system. The Moon becomes a distinct moving companion rather than a decorative dot.',
    camera: { position: [45, 25, -7880], target: [0, 0, -8330], fov: 40 },
    objects: [
      { id: 'earth-system', name: 'Earth', type: 'Rocky planet', summary: 'A dynamic ocean world viewed together with its Moon.', text: 'Earth’s atmosphere, oceans, ice, active interior and magnetic field interact as a coupled planetary system.', facts: [['Diameter','12,742 km'],['Mean radius','6,371 km'],['Mass','5.97 × 10²⁴ kg'],['Natural satellites','1']] },
      { id: 'moon', name: 'Moon', type: 'Natural satellite', summary: 'Earth’s only natural satellite.', text: 'The Moon is tidally locked and is the dominant driver of Earth’s ocean tides.', facts: [['Mean distance','384,400 km'],['Diameter','3,475 km'],['Orbital period','27.3 days'],['Surface gravity','~16.5% of Earth']] }
    ]
  },
  {
    id: 'earth', title: 'Planet Earth', kicker: '12 · A LIVING WORLD', exponent: 7, hold: 1.85,
    scale: '~10⁷ metres', distance: 'Diameter 12,742 km',
    description: 'The globe now dominates the view: ocean, continents, clouds, polar ice, a day–night terminator and a thin atmospheric glow.',
    camera: { position: [16, 6, -8145], target: [0, 0, -8330], fov: 36 },
    objects: [
      { id: 'earth-globe', name: 'Earth', type: 'Planet', summary: 'The only world currently known to host life.', text: 'Earth formed about 4.54 billion years ago. Its surface, atmosphere, hydrosphere and biosphere continually exchange energy and matter.', facts: [['Age','~4.54 billion yr'],['Radius','6,371 km'],['Surface water','~71%'],['Atmosphere','~78% N₂, ~21% O₂']] },
      { id: 'atmosphere', name: 'Atmosphere', type: 'Planetary atmosphere', summary: 'A remarkably thin layer compared with Earth’s radius.', text: 'Viewed edge-on from space, the atmosphere appears as a narrow blue limb even though it governs weather and supports surface life.', facts: [['Main gas','Nitrogen'],['Second gas','Oxygen'],['Weather layer','Troposphere'],['Kármán convention','100 km']] }
    ]
  },
  {
    id: 'orbit', title: 'Low Earth Orbit', kicker: '13 · JUST ABOVE HOME', exponent: 6, hold: 1.8,
    scale: '~10⁶ metres', distance: 'Hundreds to ~2,000 km above the surface',
    description: 'The camera now genuinely approaches the Earth mesh. Curvature fills the frame and the atmosphere becomes a narrow luminous rim.',
    camera: { position: [96, 18, -8330], target: [0, 0, -8330], fov: 52 },
    objects: [
      { id: 'earth-limb', name: 'Earth’s Curvature', type: 'Planetary limb', summary: 'The curved horizon seen from orbital altitude.', text: 'From low Earth orbit, the planet’s curvature is obvious because the observer is hundreds of kilometres above a world over twelve thousand kilometres across.', facts: [['Earth diameter','12,742 km'],['LEO regime','~160–2,000 km'],['Visible feature','Curved limb'],['Below','Atmosphere + surface']] }
    ]
  },
  {
    id: 'atmosphere', title: 'Atmosphere', kicker: '14 · FROM SPACE INTO SKY', exponent: 5, hold: 1.8,
    scale: '~10⁵ metres', distance: '~100 km down toward sea level',
    description: 'The camera enters an atmospheric scene where black space gives way to Rayleigh-blue sky, haze and cloud depth.',
    camera: { position: [0, 34, -8790], target: [0, 12, -9060], fov: 54 },
    objects: [
      { id: 'karman', name: 'Kármán Line', type: 'Conventional boundary', summary: 'A widely used 100 km reference for the edge of space.', text: 'Earth’s atmosphere has no hard upper edge. The Kármán line is a convention rather than a physical membrane.', facts: [['Altitude','100 km'],['Physical wall?','No'],['Purpose','Reference boundary'],['Below','Denser atmosphere']] },
      { id: 'troposphere', name: 'Troposphere', type: 'Lowest atmospheric layer', summary: 'The layer where nearly all familiar weather occurs.', text: 'The troposphere contains most atmospheric water vapour and most of the atmosphere’s mass.', facts: [['Weather','Yes'],['Water vapour','Most'],['Approx. top','~8–18 km'],['Below','Surface']] }
    ]
  },
  {
    id: 'surface', title: 'Earth’s Surface', kicker: '15 · HOME SCALE', exponent: 3, hold: 1.85,
    scale: '~10³–10⁵ metres', distance: 'Landscape and regional scale',
    description: 'Cosmic scale resolves into ocean, cloud and horizon. The 3D camera finally arrives at a human-scale environment.',
    camera: { position: [0, 18, -9440], target: [0, 7, -9730], fov: 58 },
    objects: [
      { id: 'ocean-surface', name: 'Ocean Surface', type: 'Surface environment', summary: 'The connected ocean covers most of Earth.', text: 'The ocean stores and transports enormous amounts of heat and provides a major habitat for life.', facts: [['Coverage','~71% of Earth'],['Largest basin','Pacific'],['Climate role','Heat transport'],['State','Mostly liquid water']] },
      { id: 'horizon', name: 'Horizon', type: 'Geometric boundary', summary: 'At human scale, Earth’s curvature hides itself again.', text: 'The horizon is where the curved surface drops below the observer’s line of sight. Its distance increases with observer height.', facts: [['Cause','Curvature + line of sight'],['Depends on','Observer height'],['At sea level','A few kilometres'],['Same planet','Yes']] }
    ]
  }
];
