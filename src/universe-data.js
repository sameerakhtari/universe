export const STAGES=[
  {
    id:"horizon",hold:"long",title:"Observable Universe",kicker:"01 · THE COSMIC HORIZON",exponent:26,
    scale:"~10²⁶ metres",distance:"Present-day radius ≈ 46.5 billion ly",
    description:"This is not a wall in space. It is the limit of what can be observed from Earth today: the most distant regions whose signals have had time to reach us while the universe expanded.",
    objects:[
      {id:"cmb",type:"Oldest electromagnetic light",name:"Cosmic Microwave Background",summary:"The afterglow from the young universe.",text:"The cosmic microwave background was released when the universe cooled enough for neutral atoms to form and photons could travel freely. We observe that ancient radiation today as a nearly uniform microwave glow.",facts:[["Released","~380,000 years after Big Bang"],["Temperature today","2.725 K"],["Typical redshift","~1100"],["What it reveals","Early density fluctuations"]]},
      {id:"horizon",type:"Observation limit",name:"Cosmic Horizon",summary:"The boundary of the observable region, not an edge of space.",text:"The observable universe is defined by what light and other signals can have reached us. Regions beyond our horizon may exist, but they cannot currently exchange information with us.",facts:[["Radius today","~46.5 billion ly"],["Diameter","~93 billion ly"],["Physical wall?","No"],["Center","Every observer has their own"]]},
      {id:"web",type:"Large-scale structure",name:"Cosmic Web",summary:"Galaxies trace filaments around immense voids.",text:"Matter on the largest scales forms a web-like pattern of filaments, walls, knots and voids. Dark matter supplies most of the gravitational framework while galaxies make parts of it visible.",facts:[["Components","Filaments, walls, voids"],["Dense nodes","Galaxy clusters"],["Dominant mass","Dark matter"],["Growth mechanism","Gravity"]]}
    ]
  },
  {
    id:"web",hold:"long",title:"Cosmic Web",kicker:"02 · STRUCTURE EMERGES",exponent:24,
    scale:"~10²⁴ metres",distance:"Hundreds of millions of light-years",
    description:"Gravity amplifies tiny early density differences into a luminous network. Galaxy clusters gather at the intersections while huge low-density voids open between them.",
    objects:[
      {id:"node",type:"Galaxy-cluster node",name:"Dense Cosmic Node",summary:"A junction where several filaments meet.",text:"The densest intersections of the cosmic web can host massive galaxy clusters embedded in enormous dark-matter halos and filled with hot X-ray-emitting gas.",facts:[["Members","Hundreds to thousands of galaxies"],["Cluster mass","Up to ~10¹⁵ solar masses"],["Between galaxies","Hot intracluster plasma"],["Binding","Gravity"]]},
      {id:"filament",type:"Cosmic filament",name:"Matter Filament",summary:"A bridge of galaxies and dark matter between dense nodes.",text:"Filaments can extend for tens to hundreds of millions of light-years. They channel matter toward clusters and surround underdense cosmic voids.",facts:[["Contents","Galaxies + gas + dark matter"],["Scale","Tens–hundreds of Mly"],["Geometry","Thread / wall-like"],["Between them","Cosmic voids"]]},
      {id:"void",type:"Underdense region",name:"Cosmic Void",summary:"A vast region containing far fewer galaxies than average.",text:"Voids occupy much of the volume of the universe. They are not perfectly empty, but their matter density is far below the cosmic mean.",facts:[["Size","Often tens of Mly"],["Galaxy density","Low"],["Boundaries","Walls and filaments"],["Empty?","No"]]}
    ]
  },
  {
    id:"laniakea",title:"Laniakea",kicker:"03 · OUR SUPERCLUSTER BASIN",exponent:23,
    scale:"~10²³ metres",distance:"≈ 520 million light-years across",
    description:"Our galaxy belongs to a vast flow basin called Laniakea. Galaxies inside it have large-scale motions that broadly converge toward dense regions in the direction of the Great Attractor.",
    objects:[
      {id:"attractor",type:"Flow region",name:"Great Attractor Region",summary:"A direction toward which many nearby galaxies have peculiar motion.",text:"The Great Attractor is not a single giant object. It describes a region of enhanced gravitational influence in the direction of Centaurus, partly hidden behind the Milky Way's disk.",facts:[["Direction","Centaurus"],["Single object?","No"],["Observed through","Zone of Avoidance"],["Effect","Peculiar galaxy velocities"]]},
      {id:"laniakea",type:"Supercluster basin",name:"Laniakea",summary:"The large-scale basin containing the Milky Way.",text:"Laniakea is defined using galaxy motions rather than as one tightly bound object. On the largest scales, cosmic expansion eventually dominates over local gravitational binding.",facts:[["Name meaning","Immense heaven"],["Scale","~520 million ly"],["Contains","Milky Way region"],["Definition","Velocity-flow basin"]]}
    ]
  },
  {
    id:"local-sheet",title:"Local Sheet",kicker:"04 · OUR NEARBY COSMIC NEIGHBORHOOD",exponent:22,
    scale:"~10²² metres",distance:"Tens of millions of light-years",
    description:"Before reaching the Local Group, we cross the Local Sheet: a flattened nearby arrangement of galaxies, with the Virgo Cluster looming beyond our small galactic neighborhood.",
    objects:[
      {id:"virgo",type:"Galaxy cluster",name:"Virgo Cluster",summary:"The nearest large galaxy cluster to the Local Group.",text:"The Virgo Cluster is a rich collection of galaxies roughly 54 million light-years away. Its central region includes the giant elliptical galaxy M87.",facts:[["Distance","~54 million ly"],["Members","~1,000+ galaxies"],["Notable galaxy","M87"],["Constellation","Virgo"]]},
      {id:"local-sheet",type:"Nearby structure",name:"Local Sheet",summary:"A flattened local arrangement that contains the Local Group.",text:"The Local Group sits within a relatively thin sheet of nearby galaxies. This intermediate scale connects our small group to larger supercluster structure.",facts:[["Contains","Local Group"],["Shape","Flattened"],["Scale","Several Mpc"],["Nearby landmark","Virgo Cluster"]]}
    ]
  },
  {
    id:"local-group",hold:"long",title:"Local Group",kicker:"05 · OUR GALACTIC FAMILY",exponent:22,
    scale:"~10²² metres",distance:"Roughly 10 million light-years across",
    description:"The Milky Way and Andromeda dominate a small gravitationally bound collection of galaxies. Dozens of dwarf galaxies orbit the two giants and the smaller Triangulum Galaxy.",
    objects:[
      {id:"milkyway",type:"Barred spiral galaxy",name:"Milky Way",summary:"Our home galaxy.",text:"The Milky Way is a barred spiral galaxy whose disk contains stars, gas, dust and spiral structure, surrounded by a much larger dark-matter halo.",facts:[["Visible disk","~100,000–120,000 ly"],["Central black hole","Sagittarius A*"],["Our position","Orion Spur"],["Galaxy type","Barred spiral"]]},
      {id:"andromeda",type:"Large spiral galaxy",name:"Andromeda · M31",summary:"The nearest large spiral galaxy to the Milky Way.",text:"Andromeda is the other dominant large galaxy of the Local Group. Under dark skies it is visible to the unaided eye as a faint elongated smudge.",facts:[["Distance","~2.5 million ly"],["Catalog","M31 / NGC 224"],["Galaxy type","Spiral"],["Local Group role","Major member"]]},
      {id:"triangulum",type:"Spiral galaxy",name:"Triangulum · M33",summary:"The Local Group's third major spiral galaxy.",text:"Triangulum is smaller than both the Milky Way and Andromeda but is still one of the Local Group's most prominent members.",facts:[["Distance","~2.7 million ly"],["Catalog","M33"],["Constellation","Triangulum"],["Type","Spiral galaxy"]]}
    ]
  },
  {
    id:"milkyway",hold:"long",title:"Milky Way",kicker:"06 · HOME GALAXY",exponent:21,
    scale:"~10²¹ metres",distance:"Visible stellar disk ≈ 100,000+ light-years",
    description:"Now one galaxy fills the view. A central bar feeds spiral arms and a luminous bulge, while the Sun sits far from the center in a smaller feature called the Orion Spur.",
    objects:[
      {id:"sgr",type:"Supermassive black hole",name:"Sagittarius A*",summary:"The compact object at the dynamical center of the Milky Way.",text:"Sagittarius A* is a supermassive black hole with a mass of roughly four million Suns. It sits around 26,000 light-years from the Solar System.",facts:[["Mass","~4 million Suns"],["Distance from us","~26,000 ly"],["Location","Galactic center"],["Direct image","Event Horizon Telescope, 2022"]]},
      {id:"orion",type:"Spiral feature",name:"Orion Spur",summary:"The local spiral feature containing the Solar System.",text:"The Solar System is not near the Galactic Center. It lies in the Orion Spur, between the larger Sagittarius and Perseus arms.",facts:[["Also called","Local Arm / Orion Arm"],["Contains","Solar System"],["Setting","Galactic disk"],["Center distance","~26,000 ly"]]},
      {id:"perseus",type:"Major spiral arm",name:"Perseus Arm",summary:"One of the Milky Way's major spiral arms.",text:"The Perseus Arm lies farther from the Galactic Center than the Sun and contains many star-forming regions.",facts:[["Structure","Spiral arm"],["Relative to Sun","Farther outward"],["Contents","Stars, gas, star formation"],["Galaxy","Milky Way"]]}
    ]
  },
  {
    id:"neighborhood",title:"Solar Neighborhood",kicker:"07 · A LOCAL SEA OF STARS",exponent:18,
    scale:"~10¹⁸ metres",distance:"Hundreds of light-years",
    description:"The galaxy resolves into individual stars. The Sun becomes one local point among many, with nearby systems scattered through the Orion Spur.",
    objects:[
      {id:"sun",type:"G-type main-sequence star",name:"Sun",summary:"Our ordinary but indispensable star.",text:"The Sun is a G2 V main-sequence star about 4.6 billion years old. It contains almost all the mass in the Solar System.",facts:[["Spectral type","G2 V"],["Age","~4.6 billion years"],["Surface temperature","~5,772 K"],["Galactic orbit","~225–250 million years"]]},
      {id:"sirius",type:"Binary star system",name:"Sirius",summary:"The brightest star in Earth's night sky.",text:"Sirius is a binary star system roughly 8.6 light-years away, made of bright Sirius A and the white dwarf Sirius B.",facts:[["Distance","8.6 ly"],["Primary","Sirius A"],["Companion","White dwarf"],["Constellation","Canis Major"]]},
      {id:"proxima",type:"Red dwarf",name:"Proxima Centauri",summary:"The closest known star to the Sun.",text:"Proxima Centauri is a small red dwarf in the Alpha Centauri system and the nearest known star to the Sun.",facts:[["Distance","~4.24 ly"],["Type","Red dwarf"],["System","Alpha Centauri"],["Known planets","Yes"]]}
    ]
  },
  {
    id:"oort",title:"Oort Cloud",kicker:"08 · THE SOLAR SYSTEM'S DISTANT FRINGE",exponent:16,
    scale:"~10¹⁶ metres",distance:"Thousands to perhaps ~100,000 AU",
    description:"The Sun is now clearly the destination, but the planetary system is still tiny. Far beyond the planets may lie an enormous roughly spherical reservoir of icy bodies: the Oort Cloud.",
    objects:[
      {id:"sun",type:"Star",name:"Sun",summary:"A tiny bright center from this distance.",text:"From Oort Cloud scales, the familiar planets occupy only the innermost fraction of the scene around the Sun.",facts:[["Planetary zone","Inside ~30 AU"],["Oort scale","Thousands–~100,000 AU"],["Light-year","63,241 AU"],["Binding","Solar gravity, weakly"]]},
      {id:"oort",type:"Hypothesized comet reservoir",name:"Oort Cloud",summary:"A distant shell thought to store long-period comet nuclei.",text:"The Oort Cloud has not been directly imaged as a whole. Its existence is inferred from the orbits of long-period comets and models of Solar System formation.",facts:[["Shape","Roughly spherical"],["Evidence","Long-period comets"],["Directly imaged?","No"],["Composition","Icy small bodies"]]}
    ]
  },
  {
    id:"outer-solar",hold:"long",title:"Outer Solar System",kicker:"09 · GIANTS AND ICY WORLDS",exponent:13,
    scale:"~10¹³ metres",distance:"Neptune ≈ 30 AU from Sun",
    description:"The planetary system finally expands across the screen. Jupiter, Saturn, Uranus and Neptune dominate the outer architecture while smaller icy bodies continue beyond them.",
    objects:[
      {id:"sun",type:"Star",name:"Sun",summary:"The gravitational center of the Solar System.",text:"The Sun contains roughly 99.8% of the Solar System's mass and supplies the light and heat that dominate Earth's surface environment.",facts:[["Radius","696,340 km"],["Mass fraction","~99.8%"],["Type","G2 V"],["Light to Earth","~8 min 20 s"]]},
      {id:"jupiter",type:"Gas giant",name:"Jupiter",summary:"The largest planet in the Solar System.",text:"Jupiter's gravity, moons and vast magnetosphere make it effectively a miniature planetary system of its own.",facts:[["Diameter","139,820 km"],["Year","11.86 Earth years"],["Largest moon","Ganymede"],["Feature","Great Red Spot"]]},
      {id:"saturn",type:"Gas giant",name:"Saturn",summary:"A giant planet surrounded by an immense ring system.",text:"Saturn's rings are made mostly of water-ice particles ranging from dust-sized grains to much larger chunks.",facts:[["Year","29.45 Earth years"],["Rings","Ice-rich"],["Largest moon","Titan"],["Planet type","Gas giant"]]},
      {id:"neptune",type:"Ice giant",name:"Neptune",summary:"The outermost major planet.",text:"Neptune orbits about 30 astronomical units from the Sun and has some of the fastest winds measured in the Solar System.",facts:[["Distance","~30 AU"],["Year","164.8 Earth years"],["Largest moon","Triton"],["Planet type","Ice giant"]]}
    ]
  },
  {
    id:"inner-solar",hold:"long",title:"Inner Solar System",kicker:"10 · THE ROCKY PLANETS",exponent:11,
    scale:"~10¹¹ metres",distance:"Earth = 1 astronomical unit from the Sun",
    description:"The outer giants fall away. Mercury, Venus, Earth and Mars orbit close to the Sun on a scale where one astronomical unit is the key ruler.",
    objects:[
      {id:"mercury",type:"Rocky planet",name:"Mercury",summary:"The innermost planet.",text:"Mercury is the smallest major planet and completes an orbit in only 88 Earth days.",facts:[["Distance","~0.39 AU"],["Year","88 days"],["Moons","0"],["Type","Rocky planet"]]},
      {id:"venus",type:"Rocky planet",name:"Venus",summary:"Earth-sized, but wrapped in a dense greenhouse atmosphere.",text:"Venus is similar to Earth in size yet has a very different surface environment, with a dense carbon-dioxide atmosphere and extremely high surface temperatures.",facts:[["Distance","~0.72 AU"],["Year","224.7 days"],["Moons","0"],["Atmosphere","Mostly CO₂"]]},
      {id:"earth",type:"Rocky planet",name:"Earth",summary:"Third planet from the Sun — our destination.",text:"Earth orbits at roughly one astronomical unit. Liquid surface oceans, a dynamic atmosphere and active geology support the only biosphere currently known.",facts:[["Distance","1 AU"],["Year","365.256 days"],["Moons","1"],["Surface water","~71%"]]},
      {id:"mars",type:"Rocky planet",name:"Mars",summary:"A cold desert world beyond Earth.",text:"Mars is smaller than Earth and preserves abundant evidence that liquid water once flowed across parts of its surface.",facts:[["Distance","~1.52 AU"],["Year","687 days"],["Moons","2"],["Surface","Iron-rich dust"]]}
    ]
  },
  {
    id:"earth-moon",hold:"earth",title:"Earth–Moon System",kicker:"11 · OUR DOUBLE-WORLD VIEW",exponent:9,
    scale:"~10⁹ metres",distance:"Moon ≈ 384,400 km from Earth",
    description:"Earth separates from the planetary system. The Moon now becomes a distinct companion, orbiting at a distance of about thirty Earth diameters.",
    objects:[
      {id:"earth",type:"Planet",name:"Earth",summary:"A 12,742 km-wide world seen with its Moon.",text:"Earth is the largest of the four rocky inner planets. Its magnetic field, atmosphere, oceans and active interior interact as a coupled planetary system.",facts:[["Diameter","12,742 km"],["Mean radius","6,371 km"],["Mass","5.97 × 10²⁴ kg"],["Natural satellites","1"]]},
      {id:"moon",type:"Natural satellite",name:"Moon",summary:"Earth's only natural satellite.",text:"The Moon is tidally locked, so roughly the same hemisphere faces Earth. Its gravity is the dominant driver of Earth's ocean tides.",facts:[["Mean distance","384,400 km"],["Diameter","3,475 km"],["Orbital period","27.3 days"],["Surface gravity","~16.5% of Earth's"]]}
    ]
  },
  {
    id:"earth",hold:"earth",title:"Planet Earth",kicker:"12 · A LIVING WORLD",exponent:7,
    scale:"~10⁷ metres",distance:"Diameter 12,742 km",
    description:"Earth finally fills the frame. Oceans dominate the visible surface while continents, clouds, polar ice and a thin atmospheric glow reveal a restless planet.",
    objects:[
      {id:"earth",type:"Planet",name:"Earth",summary:"The only world currently known to host life.",text:"Earth formed about 4.54 billion years ago. Plate tectonics, liquid water, an oxygen-rich atmosphere and a protective magnetosphere all shape the environment we inhabit today.",facts:[["Age","~4.54 billion years"],["Mean radius","6,371 km"],["Surface water","~71%"],["Atmosphere","~78% N₂, ~21% O₂"]]},
      {id:"atmosphere",type:"Planetary atmosphere",name:"Atmosphere",summary:"A very thin layer compared with Earth's radius.",text:"Most of Earth's atmosphere is concentrated close to the surface. From space its blue limb appears remarkably thin against the planet's enormous diameter.",facts:[["Main gas","Nitrogen"],["Second","Oxygen"],["Weather layer","Troposphere"],["Space boundary convention","Kármán line ~100 km"]]},
      {id:"ocean",type:"Hydrosphere",name:"Global Ocean",summary:"Connected salt-water basins cover most of Earth's surface.",text:"About seventy-one percent of Earth's surface is covered by ocean. Water redistributes heat, shapes climate and is fundamental to the known biosphere.",facts:[["Surface coverage","~71%"],["State","Mostly liquid"],["Role","Climate + biosphere"],["Largest basin","Pacific Ocean"]]}
    ]
  },
  {
    id:"orbit",hold:"earth",title:"Low Earth Orbit",kicker:"13 · JUST ABOVE HOME",exponent:6,
    scale:"~10⁶ metres",distance:"Hundreds to a few thousand kilometres above the surface",
    description:"The planet is now too large to see at once. Earth's curved limb cuts across the view and the atmosphere becomes a narrow blue layer between surface and space.",
    objects:[
      {id:"limb",type:"Planetary limb",name:"Earth's Curvature",summary:"The horizon seen from orbital altitude.",text:"From low Earth orbit the planet's curvature is obvious because the observer is hundreds of kilometres above the surface while Earth itself is more than twelve thousand kilometres across.",facts:[["Earth diameter","12,742 km"],["LEO regime","~160–2,000 km"],["Visible feature","Curved limb"],["Below","Atmosphere + surface"]]},
      {id:"airglow",type:"Upper atmosphere",name:"Atmospheric Limb",summary:"Sunlight and excited atoms make the atmosphere glow along the horizon.",text:"Viewed edge-on, the atmosphere is compressed into a thin luminous band. Different layers and emissions can create blue, green or reddish glows.",facts:[["Relative thickness","Very thin vs Earth"],["Kármán line","100 km convention"],["Weather","Mostly below ~20 km"],["View","Edge-on limb"]]}
    ]
  },
  {
    id:"atmosphere",hold:"earth",title:"Inside the Atmosphere",kicker:"14 · FROM SPACE INTO SKY",exponent:5,
    scale:"~10⁵ metres",distance:"~100 km down toward sea level",
    description:"The star field fades. Blue scattering, cloud decks and the curved horizon take over as the journey crosses from space into the atmosphere.",
    objects:[
      {id:"karman",type:"Conventional boundary",name:"Kármán Line",summary:"A widely used 100 km reference for the edge of space.",text:"The atmosphere has no hard upper edge; it becomes progressively thinner. The Kármán line at 100 km is a useful convention rather than a physical membrane.",facts:[["Altitude","100 km"],["Physical wall?","No"],["Purpose","Reference boundary"],["Below","Denser atmosphere"]]},
      {id:"troposphere",type:"Lowest atmospheric layer",name:"Troposphere",summary:"The layer where almost all familiar weather occurs.",text:"The troposphere contains most of the atmosphere's mass and nearly all of its water vapour. Its thickness varies with latitude and season.",facts:[["Weather","Yes"],["Contains","Most water vapour"],["Approx. top","~8–18 km"],["Below","Earth's surface"]]},
      {id:"clouds",type:"Water droplets and ice",name:"Cloud Deck",summary:"Weather finally becomes larger than the curvature beneath it.",text:"Clouds form when water vapour condenses or freezes around tiny particles. From above they reveal large-scale atmospheric circulation and storm systems.",facts:[["Material","Water droplets / ice"],["Driver","Cooling + condensation"],["Role","Weather + climate"],["View","Dynamic and layered"]]}
    ]
  },
  {
    id:"surface",hold:"earth",title:"Earth's Surface",kicker:"15 · HOME SCALE",exponent:3,
    scale:"~10³–10⁵ metres",distance:"Landscape and regional scale",
    description:"The cosmic hierarchy ends in a familiar world of ocean, land, cloud and daylight. Scroll a little farther to finish the journey, or move the pointer across the scene to inspect the layers that made the descent possible.",
    objects:[
      {id:"ocean",type:"Surface environment",name:"Ocean Surface",summary:"The connected ocean covers most of the planet.",text:"From human scale, the global ocean becomes waves, horizons, currents and weather. It remains physically connected to the planetary system seen only a few scrolls earlier.",facts:[["Planetary coverage","~71%"],["Largest basin","Pacific"],["Climate role","Heat transport"],["Life","Major habitat"]]},
      {id:"cloud",type:"Weather",name:"Cloud Layer",summary:"A local expression of the global water cycle.",text:"Clouds connect surface water to the atmosphere through evaporation, condensation and precipitation — processes that operate from local weather to planetary climate.",facts:[["Cycle","Water cycle"],["Phases","Liquid + ice"],["Scale","Metres to thousands of km"],["Lifetime","Minutes to days"]]},
      {id:"horizon",type:"Geometric boundary",name:"Horizon",summary:"At the surface, the planet's curvature hides itself again.",text:"The horizon is the apparent line where Earth's surface and sky seem to meet. Its distance grows as the observer's height increases.",facts:[["Cause","Curved surface + line of sight"],["Depends on","Observer height"],["From sea level","A few kilometres"],["Same planet","Yes"]]}
    ]
  }
];

export const PALETTE={ink:"#f6fbff",cyan:"#9aeaff",blue:"#7d9cff",violet:"#bd98ff",gold:"#ffd18a",red:"#ff8c8c",bg:"#01030a"};
