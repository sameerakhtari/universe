export const STAGES = [
  {
    id:"horizon", kicker:"01 · THE COSMIC HORIZON", title:"Observable Universe",
    description:"The farthest regions whose light has had time to reach us. Space expanded while that light travelled, so the present-day radius is about 46.5 billion light-years.",
    scale:"~10²⁶ metres", distance:"Radius ≈ 46.5 billion ly", exponent:26,
    objects:[
      {id:"cmb",type:"Oldest light",name:"Cosmic Microwave Background",x:.25,y:.34,r:34,text:"A nearly uniform afterglow released when the universe became transparent roughly 380,000 years after the Big Bang.",facts:[["Temperature","2.725 K today"],["Redshift","~1100"],["Age at release","~380,000 yr"],["Role","Early-universe snapshot"]]},
      {id:"web",type:"Large-scale structure",name:"Galaxy Web",x:.72,y:.57,r:36,text:"Matter is not distributed uniformly. Galaxies gather along filaments that wrap enormous underdense voids.",facts:[["Pattern","Filaments + voids"],["Largest tracer","Galaxy clusters"],["Main driver","Gravity"],["Hidden mass","Dark matter dominated"]]}
    ]
  },
  {
    id:"web", kicker:"02 · STRUCTURE EMERGES", title:"The Cosmic Web",
    description:"On the largest scales, gravity gathers matter into knots, walls and filaments. Galaxy clusters sit at the densest junctions while huge voids open between them.",
    scale:"~10²⁴ metres", distance:"Hundreds of millions of ly", exponent:24,
    objects:[
      {id:"cluster",type:"Galaxy cluster",name:"A Dense Node",x:.64,y:.44,r:30,text:"Cluster-scale nodes can hold hundreds or thousands of galaxies bound within vast dark-matter halos.",facts:[["Members","100s–1000s galaxies"],["Medium","Hot intracluster gas"],["Mass","Up to ~10¹⁵ Suns"],["Shape","Dark-matter halo"]]},
      {id:"void",type:"Underdensity",name:"Cosmic Void",x:.28,y:.64,r:42,text:"Voids are immense regions containing far fewer galaxies than the cosmic average.",facts:[["Typical size","Tens–100s Mly"],["Density","Below cosmic mean"],["Boundary","Filaments / walls"],["Expansion","Relatively faster"]]}
    ]
  },
  {
    id:"laniakea", kicker:"03 · OUR COSMIC WATERSHED", title:"Laniakea Supercluster",
    description:"Our local flow of galaxies lies within Laniakea, a vast gravitational basin whose motions converge broadly toward the region known as the Great Attractor.",
    scale:"~10²³ metres", distance:"≈ 520 million ly across", exponent:23,
    objects:[
      {id:"attractor",type:"Flow basin",name:"Great Attractor Region",x:.59,y:.53,r:34,text:"A region toward which many nearby galaxies have a measurable peculiar velocity, shaped by several large concentrations of mass.",facts:[["Direction","Centaurus region"],["Seen through","Zone of Avoidance"],["Effect","Galaxy flow"],["Not a single object","Yes"]]},
      {id:"virgo",type:"Galaxy cluster",name:"Virgo Cluster",x:.38,y:.38,r:28,text:"The Virgo Cluster is a major nearby galaxy cluster and an important landmark in our local large-scale structure.",facts:[["Distance","~54 million ly"],["Galaxies","~1,000+"],["Constellation","Virgo"],["Contains","M87"]]}
    ]
  },
  {
    id:"local", kicker:"04 · OUR GALACTIC NEIGHBOURHOOD", title:"The Local Group",
    description:"A gravitationally bound family of dozens of galaxies dominated by Andromeda and the Milky Way. Tiny dwarf galaxies swarm around both.",
    scale:"~10²² metres", distance:"≈ 10 million ly across", exponent:22,
    objects:[
      {id:"andromeda",type:"Spiral galaxy · M31",name:"Andromeda Galaxy",x:.68,y:.39,r:38,text:"The nearest large spiral galaxy to the Milky Way and a dominant member of the Local Group.",facts:[["Distance","~2.5 million ly"],["Diameter","~120,000+ ly"],["Type","Barred spiral"],["Catalog","M31 / NGC 224"]]},
      {id:"milkyway",type:"Our galaxy",name:"Milky Way",x:.39,y:.59,r:40,text:"A barred spiral galaxy containing the Solar System, gas, dust, stars and a massive dark halo.",facts:[["Diameter","~100,000–120,000 ly"],["Type","Barred spiral"],["Central black hole","Sagittarius A*"],["Solar orbit","~26,000 ly from center"]]}
    ]
  },
  {
    id:"milkyway", kicker:"05 · HOME GALAXY", title:"The Milky Way",
    description:"A barred spiral disk wrapped in a faint stellar halo. We live well away from the brilliant central bulge, inside a minor spiral feature called the Orion Spur.",
    scale:"~10²¹ metres", distance:"≈ 100,000 ly across", exponent:21,
    objects:[
      {id:"sgr",type:"Galactic center",name:"Sagittarius A*",x:.5,y:.5,r:28,text:"A supermassive black hole at the dynamical center of the Milky Way.",facts:[["Mass","~4 million Suns"],["Distance from us","~26,000 ly"],["Object type","Supermassive black hole"],["First image","EHT, 2022"]]},
      {id:"orion",type:"Spiral feature",name:"Orion Spur",x:.69,y:.59,r:30,text:"The Solar System lies in the Orion Spur, between the larger Sagittarius and Perseus spiral arms.",facts:[["Also called","Local Arm"],["Contains","Solar System"],["Setting","Galactic disk"],["Center distance","~26,000 ly"]]}
    ]
  },
  {
    id:"orion", kicker:"06 · THE LOCAL STELLAR SEA", title:"The Orion Spur",
    description:"Now the galaxy becomes a field of individual stars. The Sun is one ordinary G-type star among billions, orbiting the Milky Way roughly once every few hundred million years.",
    scale:"~10¹⁸ metres", distance:"Hundreds of light-years", exponent:18,
    objects:[
      {id:"sunmarker",type:"G-type main-sequence star",name:"The Sun",x:.53,y:.52,r:30,text:"Our star contains almost all the mass in the Solar System and powers nearly every surface ecosystem on Earth.",facts:[["Spectral type","G2 V"],["Age","~4.6 billion yr"],["Surface","~5,772 K"],["Galactic year","~225–250 Myr"]]},
      {id:"sirius",type:"Nearby star system",name:"Sirius",x:.73,y:.35,r:25,text:"The brightest star in Earth's night sky is a binary system about 8.6 light-years away.",facts:[["Distance","8.6 ly"],["Primary","Sirius A"],["Companion","White dwarf"],["Constellation","Canis Major"]]}
    ]
  },
  {
    id:"solar", kicker:"07 · ONE STAR, EIGHT PLANETS", title:"The Solar System",
    description:"The Sun's gravity binds eight planets, dwarf planets, moons, asteroids, comets and a vast population of icy bodies extending far beyond Neptune.",
    scale:"~10¹³ metres", distance:"Neptune ≈ 30 AU from Sun", exponent:13,
    objects:[
      {id:"sun",type:"Star",name:"Sun",x:.5,y:.5,r:31,text:"The Solar System's central star, containing about 99.8% of the system's mass.",facts:[["Radius","696,340 km"],["Light to Earth","~8 min 20 s"],["Mass fraction","~99.8%"],["Type","G2 V"]]},
      {id:"jupiter",type:"Gas giant",name:"Jupiter",x:.70,y:.60,r:26,text:"The largest planet, with a powerful magnetic field and a family of large moons.",facts:[["Diameter","139,820 km"],["Year","11.86 Earth yr"],["Known feature","Great Red Spot"],["Largest moon","Ganymede"]]},
      {id:"earthorbit",type:"Rocky planet",name:"Earth",x:.61,y:.46,r:25,text:"The third planet from the Sun, orbiting at roughly one astronomical unit.",facts:[["Distance from Sun","1 AU"],["Year","365.256 days"],["Moon","1 natural satellite"],["Surface water","~71%"]]}
    ]
  },
  {
    id:"earth", kicker:"08 · HOME", title:"Earth",
    description:"A rocky world with liquid oceans, a nitrogen-rich atmosphere, active geology and the only biosphere presently known to science.",
    scale:"~10⁷ metres", distance:"Diameter 12,742 km", exponent:7,
    objects:[
      {id:"earth",type:"Planet",name:"Earth",x:.5,y:.5,r:150,text:"Our home planet formed about 4.54 billion years ago. Its atmosphere, magnetic field and water cycle help sustain a diverse global biosphere.",facts:[["Mean radius","6,371 km"],["Age","~4.54 billion yr"],["Day","23 h 56 m"],["Orbital speed","~29.8 km/s"]]},
      {id:"moon",type:"Natural satellite",name:"The Moon",x:.80,y:.29,r:29,text:"Earth's only natural satellite stabilizes aspects of Earth's axial behavior and drives most ocean tides.",facts:[["Mean distance","384,400 km"],["Diameter","3,475 km"],["Orbital period","27.3 days"],["Formation","~4.5 billion yr ago"]]}
    ]
  }
];

export const PALETTE={ink:"#f6fbff",cyan:"#9aeaff",blue:"#7d9cff",violet:"#bd98ff",gold:"#ffd18a",red:"#ff8c8c",bg:"#02040b"};