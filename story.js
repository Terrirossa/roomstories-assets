/* ==========================================================================
   story.js — Story mode content & rules for Roomstories
   --------------------------------------------------------------------------
   Pure data + pure logic (no DOM). index.html loads this after data.js and
   uses the global `Story`. To change a brief, a line of dialogue, a star
   cost or a unlock rule, edit this file only — the engine in index.html
   never needs to change for content.

   Everything here is written against the REAL catalog in data.js: colors are
   the game's own color names (Green, Beige, Light Wood, ...), materials are
   the game's own materials, and "kinds" (flowers, easel, couch, mixer, ...)
   are matched by item id / category below. If an item is added or renamed in
   data.js, only the KINDS table has to learn about it.
   ========================================================================== */
var STORY_FILE_VERSION = '0.7.0'; // stamped by the build, shown on the title screen
var Story = (function(){

  /* ------------------------------------------------------------------ town */
  var TOWN = {
    name: 'Pennywhistle Cove',
    map: 'story/town_map.jpg',
    aspect: [2400, 1350],
    // Seasonal versions of the map. Put a file name here (for example 'story/town_map_autumn.jpg')
    // and the town switches to it whenever the story calendar reaches that season.
    // A season left as null just uses the main map with a gentle colour wash.
    seasonMaps: { spring:'story/spring.jpg', summer:null, autumn:'story/town_autumn.jpg', winter:'story/town_winter.jpg' },
    // the story calendar: day 0 is this date (month is 0-based: 5 = June)
    calendar: { year:2025, month:5, day:2 },
    // ambient life on the map (positions are in % of the map image; the sparkle
    // points were checked against the painting so nothing glitters on land)
    clouds: { src:'story/cloud_shadows.jpg', opacity:0.4, minutes:4 },
    fx: {"glints":[[26.7,96.2,0.59],[88.8,13.3,0.34],[19.5,10.4,0.29],[33.2,1.5,0.3],[59.0,84.9,0.31],[18.8,5.3,0.27],[47.3,87.0,0.57],[50.0,6.2,0.31],[26.3,7.1,0.3],[70.2,98.5,0.33],[44.2,9.5,0.52],[56.3,88.2,0.75],[12.3,6.2,0.34],[73.8,18.3,0.57],[77.0,98.2,0.31],[41.5,98.5,0.75],[31.7,95.0,0.29],[84.7,6.5,0.56],[73.5,20.7,0.35],[69.0,20.7,0.33],[95.7,20.1,0.3],[47.5,4.4,0.57],[65.5,91.1,0.34],[26.0,10.4,0.27],[25.7,4.4,0.49],[38.5,90.2,0.28],[26.5,97.6,0.54],[52.7,89.6,0.54],[46.0,80.2,0.35],[15.7,15.1,0.29],[56.2,82.2,0.3],[81.3,9.5,0.27],[51.5,85.5,0.38],[93.3,26.6,0.33],[92.8,27.2,0.34],[70.8,68.6,0.59],[42.5,85.8,0.3],[90.7,37.0,0.53],[80.0,25.4,0.75],[28.0,3.3,0.29],[83.2,9.5,0.59],[65.7,15.7,0.54],[91.8,27.2,0.3],[17.0,7.4,0.53],[95.0,30.8,0.54],[45.0,87.3,0.35],[86.5,44.1,0.27],[89.3,32.2,0.34],[87.0,42.3,0.31],[59.0,8.3,0.75],[86.0,27.2,0.51],[27.3,92.9,0.32],[43.7,84.9,0.3],[26.7,39.6,0.36],[62.8,12.7,0.28],[39.8,94.7,0.56],[78.2,58.0,0.75],[56.0,86.4,0.29],[69.7,67.5,0.31],[39.8,92.9,0.32],[54.0,91.1,0.35],[18.5,11.2,0.31],[35.3,8.6,0.36],[89.5,21.3,0.36],[69.0,13.6,0.35],[83.0,14.8,0.34],[32.7,89.3,0.27],[22.0,6.5,0.37],[11.3,14.5,0.75],[24.2,94.7,0.28],[68.5,10.7,0.29],[57.0,12.1,0.32],[73.2,10.9,0.36],[21.8,3.6,0.27],[97.3,10.1,0.29],[93.2,16.6,0.34],[52.8,92.3,0.59],[27.3,11.2,0.57],[9.2,13.0,0.26],[80.3,18.9,0.28],[42.8,92.3,0.28],[13.8,78.7,0.34],[28.8,97.3,0.36],[51.7,98.5,0.31],[36.0,91.7,0.36],[69.5,16.9,0.38],[81.7,11.5,0.35],[37.2,3.6,0.52],[78.5,20.1,0.34],[99.0,27.2,0.26],[74.3,16.3,0.38],[43.8,7.1,0.29],[99.5,19.8,0.52],[43.2,88.2,0.28],[15.8,8.0,0.37],[55.3,89.6,0.34],[85.7,29.3,0.37],[28.0,5.0,0.75],[78.8,17.2,0.31],[34.7,83.7,0.59],[20.7,4.4,0.33],[55.0,13.9,0.27],[79.0,18.3,0.36],[42.7,79.3,0.3],[29.7,10.7,0.75],[73.5,15.1,0.36],[82.8,46.7,0.28],[34.0,7.4,0.58],[29.2,91.7,0.36],[75.8,21.0,0.37],[59.2,93.5,0.37],[48.8,10.4,0.28],[90.0,10.4,0.6],[25.7,13.6,0.56],[76.2,13.6,0.37],[83.2,11.5,0.37],[76.5,9.2,0.75],[92.8,30.2,0.56],[24.5,87.6,0.59],[45.2,81.4,0.33],[39.2,11.2,0.3],[90.3,23.7,0.58],[88.5,10.7,0.48],[37.3,95.9,0.29],[88.0,23.7,0.56],[78.8,13.3,0.31],[64.5,8.3,0.29],[18.3,16.3,0.31],[64.7,16.0,0.53],[95.2,28.7,0.33],[78.5,23.4,0.36],[57.3,6.5,0.59],[67.7,9.8,0.34],[50.5,89.1,0.58],[46.7,8.3,0.36],[82.2,12.1,0.26],[45.3,94.4,0.26],[51.7,4.7,0.75],[88.3,25.7,0.54],[62.0,93.2,0.53],[51.7,10.7,0.52],[22.0,1.5,0.75],[25.7,93.2,0.56],[77.3,55.9,0.34],[17.2,14.8,0.3],[67.5,99.1,0.37],[72.5,22.5,0.52],[23.3,96.2,0.38],[35.2,0.6,0.26],[63.5,96.4,0.35],[98.7,16.9,0.58],[11.8,9.5,0.34],[26.7,17.2,0.75],[73.2,23.7,0.75],[94.8,7.1,0.75],[34.7,82.0,0.54],[53.8,83.7,0.26],[10.5,7.7,0.33],[19.8,3.3,0.28],[73.3,17.5,0.34],[88.7,9.8,0.29],[72.3,25.7,0.53],[48.2,11.8,0.36],[89.2,16.3,0.32],[93.5,34.6,0.37],[25.5,16.3,0.52],[56.0,8.9,0.29],[47.0,92.0,0.59],[51.3,82.0,0.31],[90.2,33.7,0.37],[38.7,88.2,0.34],[83.7,12.7,0.49],[88.3,17.8,0.28],[90.5,22.2,0.33],[34.0,90.2,0.31],[37.5,86.7,0.33],[20.8,12.4,0.54],[68.2,75.1,0.29],[89.5,39.6,0.55],[97.2,8.0,0.32],[79.2,16.6,0.52],[34.7,99.1,0.34],[35.5,7.1,0.27],[81.2,14.8,0.75],[71.0,67.2,0.55],[73.3,14.2,0.26],[80.5,54.1,0.57],[91.2,12.1,0.3],[72.5,14.2,0.53],[96.7,16.9,0.55],[97.5,29.3,0.33],[57.3,10.1,0.28],[40.8,85.8,0.31],[75.0,11.2,0.54],[72.3,16.0,0.48],[61.2,8.0,0.58],[51.8,83.4,0.3],[35.2,97.0,0.5],[95.8,9.5,0.29],[87.7,15.4,0.38],[66.3,10.7,0.28],[98.2,18.3,0.56],[66.2,12.7,0.34],[69.7,94.7,0.26],[73.8,13.0,0.59],[55.3,5.0,0.33],[30.8,92.0,0.27],[58.0,91.1,0.5],[91.5,33.7,0.48],[88.5,28.4,0.36],[90.8,24.9,0.57],[86.3,5.9,0.31],[97.5,22.5,0.3],[92.0,29.0,0.33],[36.3,97.6,0.29],[85.3,47.9,0.34],[46.8,83.7,0.31],[90.7,6.2,0.59],[34.7,12.4,0.75],[53.2,82.5,0.35],[67.3,72.8,0.32],[77.7,15.4,0.34],[46.5,13.9,0.75],[94.0,20.4,0.37],[30.2,14.2,0.32],[11.3,4.7,0.28],[64.2,95.0,0.35],[15.0,93.8,0.27],[18.3,7.1,0.31],[32.3,87.0,0.37],[82.5,12.7,0.34],[55.7,83.4,0.48],[54.2,87.9,0.3],[44.0,93.5,0.53],[79.5,55.6,0.33],[38.5,7.4,0.53],[81.5,17.2,0.75],[84.5,44.7,0.33],[84.7,28.4,0.28],[41.3,90.2,0.35],[47.3,6.5,0.27],[55.5,92.0,0.32],[28.2,8.0,0.55],[76.3,97.0,0.32],[52.8,85.5,0.57],[49.2,7.4,0.52],[19.8,8.9,0.54],[84.8,24.6,0.75],[55.2,84.6,0.75],[54.3,95.6,0.27],[83.7,20.4,0.34],[37.0,10.1,0.56],[28.7,99.1,0.56],[60.7,10.7,0.33],[80.2,9.2,0.36],[35.2,89.1,0.54],[74.8,63.6,0.29],[88.5,8.6,0.75],[40.5,8.0,0.26],[47.2,98.5,0.56],[34.8,85.8,0.56],[69.3,11.5,0.52],[80.7,13.0,0.29],[64.8,89.9,0.28],[82.0,52.1,0.31],[80.2,56.8,0.3],[91.3,14.5,0.26],[74.5,12.7,0.34],[82.5,28.7,0.26],[29.8,89.6,0.75],[98.5,13.6,0.57],[30.3,97.3,0.27],[72.2,18.3,0.5],[15.2,11.5,0.55],[66.5,77.2,0.75],[77.2,8.0,0.31],[24.2,16.6,0.52],[93.3,9.8,0.59],[41.3,9.2,0.56],[89.0,41.7,0.3],[52.7,9.5,0.37],[55.3,11.8,0.54],[86.5,15.1,0.35],[97.5,28.4,0.34],[55.8,56.5,0.3],[14.2,9.2,0.35],[37.5,12.1,0.28],[64.2,17.5,0.54],[68.0,96.4,0.6],[37.8,91.4,0.27],[17.5,5.6,0.28],[59.2,90.5,0.57],[23.0,0.6,0.27],[74.7,8.9,0.37],[91.2,22.8,0.54],[22.0,8.3,0.75],[95.0,9.2,0.34],[83.7,16.9,0.28],[79.0,26.9,0.29],[67.5,18.9,0.35],[30.3,98.8,0.26],[23.3,5.0,0.35],[38.3,13.9,0.57],[42.3,91.1,0.28],[72.5,19.8,0.51],[41.2,82.8,0.56],[44.5,3.0,0.75],[21.7,13.9,0.33],[89.7,12.4,0.31],[83.5,23.7,0.33],[78.5,14.5,0.35],[18.8,98.8,0.29],[30.3,8.0,0.54],[95.8,15.1,0.29],[95.5,10.9,0.34],[70.7,18.9,0.54],[61.3,92.0,0.29],[16.0,98.2,0.29],[90.0,16.6,0.55],[67.0,15.1,0.53],[84.0,10.7,0.35],[53.3,13.0,0.3],[58.2,95.6,0.29],[95.3,25.7,0.58],[41.0,95.6,0.56],[22.7,11.2,0.54],[93.7,5.0,0.34],[55.2,7.4,0.33],[86.2,24.9,0.28],[65.0,71.6,0.34],[97.3,11.8,0.36],[88.3,19.5,0.36],[36.2,95.3,0.49],[71.3,11.5,0.36],[95.7,13.6,0.37],[48.3,95.6,0.36],[61.7,95.9,0.38],[31.8,1.5,0.5],[79.8,20.4,0.34],[72.3,63.0,0.34],[93.7,13.6,0.31],[29.7,86.4,0.59],[80.3,13.9,0.3],[13.8,13.0,0.35],[66.7,97.9,0.6],[41.0,13.6,0.55],[48.0,1.2,0.31],[50.0,99.1,0.3],[90.2,21.6,0.58],[63.3,11.8,0.32],[42.3,96.4,0.29],[31.3,12.1,0.32],[92.2,16.3,0.33],[25.3,96.7,0.27],[92.0,19.2,0.75],[93.3,19.2,0.3],[65.3,96.7,0.31],[53.7,11.2,0.38],[31.8,3.3,0.35],[91.0,28.1,0.34],[87.0,32.0,0.5],[58.2,87.3,0.75],[59.7,14.5,0.38],[85.2,43.2,0.31],[26.3,2.7,0.3],[48.5,88.5,0.75],[52.2,6.8,0.35],[89.3,18.9,0.38],[78.0,12.4,0.29],[42.8,81.4,0.38],[79.7,7.1,0.36],[51.0,87.6,0.75],[41.3,92.6,0.31],[64.7,10.9,0.27],[84.8,13.3,0.37],[91.3,25.7,0.28],[87.3,21.9,0.75],[31.2,93.5,0.32],[50.3,8.3,0.29],[94.5,27.5,0.53],[26.8,14.2,0.3],[95.0,26.6,0.35],[95.8,16.3,0.56],[66.7,16.0,0.33],[62.0,14.8,0.52],[92.0,17.5,0.32],[53.5,98.2,0.5],[39.3,84.6,0.36],[29.7,1.8,0.38],[84.2,8.9,0.32],[70.0,66.3,0.5],[14.8,5.0,0.33],[56.5,98.5,0.37],[38.8,2.7,0.59],[83.3,26.0,0.32],[98.8,22.8,0.26],[72.7,10.4,0.37],[58.5,10.9,0.5],[49.8,80.2,0.55],[80.5,51.5,0.32]],
      "boats":[
      // x/y = where the boat floats (in % of the map), w = its width (1 = 1% of the picture),
      // rx/ry = how far it drifts, dur = seconds for one slow loop, flip = face the other way.
      // two in Kingfisher Bay (top left), two in Glimmer Bay (top right), two in the Harbour (bottom)
      {img:"story/boats/boat2.png", x:17.5, y:8.6,  w:1.8, rx:.7, ry:.28, dur:52, delay:0,   flip:false},
      {img:"story/boats/boat4.png", x:32.5, y:10.2, w:1.6, rx:.6, ry:.22, dur:58, delay:-22, flip:true},
      {img:"story/boats/boat3.png", x:78.0, y:15.0, w:1.9, rx:.6, ry:.28, dur:49, delay:-9,  flip:false},
      {img:"story/boats/boat5.png", x:90.0, y:20.5, w:1.6, rx:.5, ry:.25, dur:55, delay:-30, flip:true},
      {img:"story/boats/boat1.png", x:35.0, y:88.5, w:2.3, rx:.7, ry:.3,  dur:63, delay:-14, flip:false},
      {img:"story/boats/boat6.png", x:52.5, y:93.5, w:2.2, rx:1.1,ry:.35, dur:74, delay:-40, flip:true}
    ],
      "leaves":{"area":[1,30,33,72],"count":14},"smoke":[]},
    // named neighbourhoods (polygons in % of the map image). The first one that
    // contains a point wins, so the small ones come first.
    districts: [
      {id:"lane",name:"Lantern Lane",blurb:"Little log cabins strung along the top of the Rise.",reason:"The old orchard-keepers' cottages. They kept the chimneys and the quiet, and Lantern Night started here.",homes:"Log cabins",poly:[[34,20],[42,18.5],[52,19],[58,22],[58,29],[50,28.5],[42,27],[34,26]],label:[46,22.5]},
      {id:"eastbank",name:"Far Shore",blurb:"Brick townhouses across the water.",reason:"Painters settled here for the cheap rents and the patient ferry. The gallery followed.",homes:"Brick townhouses",poly:[[91,30],[100,28],[100,56],[94,52],[91,44]],label:[96,36]},
      {id:"orchard",name:"Orchard Rise",blurb:"Tidy lanes and one stubborn apple tree per garden.",reason:"The old orchard was sold off lane by lane. Bright new flats went up between the apple trees, and families moved in, and so did the cats.",homes:"Modern family flats",poly:[[14,17],[24,15],[40,14],[52,15],[53,22],[52,29],[44,30],[34,31],[24,31],[16,28]],label:[33,22.5]},
      {id:"glass",name:"Glass Row",blurb:"The new towers, on the old timber yard.",reason:"Built for the firms that arrived with the ferry timetable: lifts, balconies, first proper jobs. One concrete block from the seventies survived the rebuild, and its tenants defend it.",homes:"Brutalist and modern flats, penthouse lofts",poly:[[63,24],[72,20],[84,21],[91,26],[91,40],[84,50],[75,52],[67,47],[63,38]],label:[77,31]},
      {id:"canal",name:"Canal Row",blurb:"Narrow brick houses along the water.",reason:"Boatbuilders lived here. The yards were fitted out as bright, modern flats behind the old brick: the cheerful, affordable street for a first key.",homes:"Modern flats in old brick shells",poly:[[52,47],[60,43],[66,49],[72,55],[73,68],[70,79],[62,81],[54,77],[52,64]],label:[61,72]},
      {id:"oldtown",name:"Old Town",blurb:"The original market square, with a clock tower that runs fast.",reason:"Everything started here: the antiques, the Courier's office and the best pavement for gossip.",homes:"Historic flats above shops",poly:[[37,26],[47,24],[58,25],[63,28],[63,42],[58,44],[52,47],[52,70],[44,72],[38,64],[36,48],[37,34]],label:[45,44]},
      {id:"church",name:"Church Hill",blurb:"White clapboard, a very tall steeple.",reason:"The oldest families live up here. Weddings, casseroles and the winter candles all happen on this hill.",homes:"Sunlit clapboard flats",poly:[[0,33],[12,28],[26,31],[34,34],[37,40],[36,60],[40,70],[32,79],[16,83],[0,81]],label:[17,60]},
      {id:"mills",name:"The Old Mills",blurb:"The textile mills closed in the nineties.",reason:"The warehouses were turned into lofts and attic studios, and the artists came for the echoing stairwells.",homes:"Lofts and attic studios",poly:[[73,54],[91,50],[100,57],[100,100],[74,100],[72,86],[75,72]],label:[90,78]},
      {id:"harbour",name:"The Harbour",blurb:"Ferry, fishing boats and the regatta.",reason:"The reason the Cove exists at all. Boats mostly come; some even go.",poly:[[0,86],[20,88],[40,84],[56,83],[72,86],[74,100],[0,100]],label:[36,94]},
      {id:"bay",name:"Kingfisher Bay",blurb:"Named for the kingfisher on the far point.",reason:"Sunday sailors, early swimmers and the first light of the day.",poly:[[0,0],[47,0],[50,6],[50,11],[40,14],[20,16],[0,17]],label:[28,8]},
      {id:"glimmer",name:"Glimmer Bay",blurb:"The wide water east of the towers.",reason:"At dusk the windows light up and the whole bay glitters, hence the name.",poly:[[50,6],[60,9.5],[72,10],[86,8.5],[100,8],[100,28],[91,30],[91,26],[84,21],[72,20],[63,24],[60,18],[50,11]],label:[82,14]}
    ],
    prologue: [
      "Pennywhistle Cove is the kind of town where everybody knows whose umbrella is whose.",
      "You started arranging rooms as a hobby. Cushions. Plants. The occasional heated opinion about rugs.",
      "Then a friend asked for help with her very first flat — and word got around. Quietly. In a cozy way."
    ]
  };

  // renown = the sum of hearts you've earned. It unlocks fancier (more
  // starry) furniture and more neighbours.
  var RENOWN_LEVELS = [
    { at: 0,  title: 'Hobbyist',             maxStars: 3 },
    { at: 5,  title: 'Friend of the Street', maxStars: 4 },
    { at: 15, title: 'Local Favourite',      maxStars: 5 },
    { at: 35, title: 'Pride of the Cove',    maxStars: 5 }
  ];
  function renownLevel(points){
    var lvl = 0;
    for (var i = 0; i < RENOWN_LEVELS.length; i++) if (points >= RENOWN_LEVELS[i].at) lvl = i;
    return lvl;
  }

  /* ------------------------------------------------------------ characters */
  // `color` is the accent used for their map pin and letters.
  var CHARACTERS = {
    mia:   { id:'mia',   name:'Mia',   age:24, job:'Vet receptionist',        color:'#8fb996',
             blurb:"Just got her own keys. Shy, bakes a lot, can't walk past a flower shop." },
    jules: { id:'jules', name:'Jules', age:22, job:'Illustration student',    color:'#4f7fd6',
             blurb:"Arrived with a suitcase and eleven boxes of paint. The paint was unpacked first." },
    sam:   { id:'sam',   name:'Sam',   age:35, job:'Events producer',         color:'#a8454f',
             blurb:"Confident, generous, plans a dinner for twelve in a flat that seats four." },
    noor:  { id:'noor',  name:'Noor',  age:40, job:'Architect',               color:'#4a5f7a',
             blurb:"Dry, precise, secretly funny. Can tell when a shelf is two centimetres off." },
    theo:  { id:'theo',  name:'Theo',  age:29, job:'Baker',        color:'#d9a441',
             blurb:"Keeps everything 'because it might be useful'. About to become a dad." },
    rosa:  { id:'rosa',  name:'Rosa',  age:68, job:'Retired costume maker',   color:'#7a3b5e',
             blurb:"Theatrical, outspoken, wonderful. Has opinions about workmanship and about you." }
  };
  // mood steers how "nice" is judged: cohesive = a calm, related palette;
  // bold = lots of colours is a feature; calm = fewer things, more air.
  var MOODS = { mia:'cohesive', jules:'bold', sam:'cohesive', noor:'calm', theo:'cohesive', rosa:'bold' };

  /* ------------------------------------------------------------ properties */
  // Each property is one flat (always ONE room family, like the free-play
  // flats). `rooms` is the full layout in left-to-right order; a commission
  // only unlocks the rooms it lists in `edit`. Doors are chosen so
  // neighbouring rooms connect: right door -> next room's left door.
  var PROPERTIES = {
    MIA_HOME_A:    { owner:'mia',   name:"Mia's first flat",       family:'modern', district:'canal', map:{x:59.5,y:63},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'twowindows-bothdoors'},
                             {key:'spare',   label:'Little spare room', arch:'onewindow-leftdoor'} ] },
    MIA_HOME_B:    { owner:'mia',   name:"Mia & Alex's flat",      family:'sunlit-living-room-twin-windows', district:'church', map:{x:21,y:58},
                     rooms:[ {key:'living',  label:'Living room', arch:'both-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'both-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'both-leftdoor'} ] },
    JULES_HOME_A:  { owner:'jules', name:"Jules's attic studio",    family:'historic', district:'mills', map:{x:83,y:64},
                     rooms:[ {key:'studio',  label:'The studio',  arch:'onewindow-nodoors'} ] },
    JULES_HOME_B:  { owner:'jules', name:"Jules's top-floor loft", family:'loft', district:'mills', map:{x:88,y:63},
                     rooms:[ {key:'living',  label:'Living room', arch:'threewindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'threewindows-bothdoors'},
                             {key:'art',     label:'Art room',    arch:'threewindows-leftdoor'} ] },
    SAM_HOME_A:    { owner:'sam',   name:"Sam's city apartment",   family:'brutalist', district:'glass', map:{x:75,y:38},
                     rooms:[ {key:'kitchen', label:'Kitchen',     arch:'bigwindow-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'bigwindow-bothdoors'},
                             {key:'living',  label:'Living room', arch:'bigwindow-leftdoor'} ] },
    SAM_HOME_B:    { owner:'sam',   name:"Sam & Robin's home",     family:'historic', district:'oldtown', map:{x:44,y:35},
                     rooms:[ {key:'kitchen', label:'Kitchen',     arch:'twowindows-rightdoor'},
                             {key:'living',  label:'Living room', arch:'roundwindow-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'baywindowright-leftdoor'} ] },
    NOOR_HOME_A:   { owner:'noor',  name:"Noor's rental",          family:'modern', district:'glass', map:{x:69,y:31},
                     rooms:[ {key:'bedroom', label:'Bedroom',     arch:'widenarrowwindow-rightdoor'},
                             {key:'living',  label:'Living room', arch:'widenarrowwindow-bothdoors'},
                             {key:'kitchen', label:'Kitchen',     arch:'widenarrowwindow-leftdoor'} ] },
    NOOR_HOME_B:   { owner:'noor',  name:"Noor's top-floor flat", family:'loft', district:'glass', map:{x:72.5,y:34},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'onewindow-bothdoors'},
                             {key:'study',   label:'Quiet room',  arch:'onewindow-leftdoor'} ] },
    THEO_HOME_A:   { owner:'theo',  name:"Theo & Elena's cabin",   family:'cozy-cabin', district:'lane', map:{x:36.8,y:23.4},
                     rooms:[ {key:'living',  label:'Living room', arch:'bigwindow-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'smallwindow-leftdoor'} ] },
    THEO_HOME_B:   { owner:'theo',  name:"Theo's family flat",     family:'modern', district:'orchard', map:{x:20.3,y:24.8},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'twowindows-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'twowindows-leftdoor'} ] },
    ROSA_HOME_A:   { owner:'rosa',  name:"Rosa's old apartment",   family:'historic', district:'oldtown', map:{x:46.5,y:63},
                     rooms:[ {key:'sitting', label:'Sitting room',arch:'twowindows-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'roundwindow-bothdoors'},
                             {key:'guest',   label:'Guest bedroom',arch:'baywindowright-leftdoor'} ] },
    ROSA_CABIN_A:  { owner:'rosa',  name:"Rosa's cabin on Lantern Lane",   family:'cozy-cabin', district:'lane', map:{x:43,y:24.9},
                     rooms:[ {key:'living',  label:'Living room', arch:'bigwindow-rightdoor'},
                             {key:'kitchen', label:'Kitchen & dining', arch:'woodenroom-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'smallwindow-leftdoor'} ] }
  };

  /* ----------------------------------------------------------------- kinds */
  // A "kind" is a friendly name for a group of real catalog items.
  function nm(a){ return (a.name || '').toLowerCase(); }
  var KINDS = {
    flowers:     function(a){ return /^flowers-|^blooming-flowers/.test(a.id); },
    easel:       function(a){ return /easel/.test(a.id); },
    couch:       function(a){ return /^couch-/.test(a.id); },
    armchair:    function(a){ return /^armchair-/.test(a.id); },
    chair:       function(a){ return /^chair-/.test(a.id); },
    stool:       function(a){ return /^stool-/.test(a.id); },
    seat:        function(a){ return a.category === 'seating'; },
    bed:         function(a){ return /^bed-/.test(a.id); },
    bedside:     function(a){ return /^bedsidetable-/.test(a.id); },
    sidetable:   function(a){ return /^sidetable-/.test(a.id); },
    coffeetable: function(a){ return a.category === 'tables' && /couchtable/.test(a.id); },
    dining:      function(a){ return /^diningtable-/.test(a.id); },
    storage:     function(a){ return a.category === 'storage'; },
    bookshelf:   function(a){ return /^bookshelf-/.test(a.id); },
    sideboard:   function(a){ return /^(sideboard|cabinet)-/.test(a.id); },
    lamp:        function(a){ return a.category === 'lighting'; },
    rug:         function(a){ return a.category === 'rugs'; },
    wallart:     function(a){ return a.category === 'wall-art'; },
    curtain:     function(a){ return a.category === 'curtains'; },
    plant:       function(a){ return a.category === 'plants'; },
    books:       function(a){ return /book/.test(nm(a)); },
    cushion:     function(a){ return /cushion|pillow/.test(nm(a)); },
    fridge:      function(a){ return /^fridge-/.test(a.id); },
    counter:     function(a){ return /^kitchen-(counter|island)/.test(a.id); },
    // the "cooking gear" the catalog really has — there is no stove or oven
    // yet, so Sam's letters make a running joke of that
    gadget:      function(a){ return /^(standmixer|mixer|coffeemaschine|coffee-maker|coffeemaker|mocca|kettle)/.test(a.id); },
    patterned:   function(a){ return /pattern|persian|zebra|cowhide/.test(a.id) || a.color === 'Multi'; },
    vase:        function(a){ return /^vase-/.test(a.id); }
  };
  function isKind(kind, asset){ return !!(KINDS[kind] && KINDS[kind](asset)); }

  /* ----------------------------------------------------------------- roles */
  // "Furnish it as a ..." — a loose, friendly check of what a room reads as.
  // (Stricter versions of these already exist as achievements.)
  var ROLES = {
    living:  { label:'A proper living room',  needs:[ {kinds:['couch','armchair'],min:1,say:'a couch or armchair'}, {kinds:['coffeetable','sidetable'],min:1,say:'a table'}, {kinds:['lamp'],min:1,say:'a lamp'} ] },
    sitting: { label:'A proper sitting room', needs:[ {kinds:['couch','armchair'],min:2,say:'two places to sit'}, {kinds:['coffeetable','sidetable'],min:1,say:'a table'}, {kinds:['lamp'],min:1,say:'a lamp'} ] },
    bedroom: { label:'A proper bedroom',      needs:[ {kinds:['bed'],min:1,say:'a bed'}, {kinds:['bedside','sidetable'],min:1,say:'a bedside table'} ] },
    dining:  { label:'A proper dining room',  needs:[ {kinds:['dining'],min:1,say:'a dining table'}, {kinds:['chair','stool','armchair'],min:3,say:'three seats'} ] },
    kitchen: { label:'A working kitchen',     needs:[ {kinds:['counter'],min:1,say:'a counter or island'}, {kinds:['fridge'],min:1,say:'a fridge'} ] },
    reading: { label:'A reading room',        needs:[ {kinds:['armchair','chair','couch'],min:1,say:'a comfy seat'}, {kinds:['lamp'],min:1,say:'a lamp'}, {kinds:['books','bookshelf'],min:1,say:'something to read'} ] },
    studio:  { label:'Sleeping & sitting in one room', needs:[ {kinds:['bed'],min:1,say:'a bed'}, {kinds:['couch','armchair','chair'],min:1,say:'somewhere to sit'} ] },
    artroom: { label:'A room for making things', needs:[ {kinds:['easel'],min:1,say:'an easel'}, {kinds:['wallart'],min:1,say:'something on the walls'} ] },
    study:   { label:'A quiet thinking room', needs:[ {kinds:['bookshelf','sideboard'],min:1,say:'a shelf or sideboard'}, {kinds:['chair','armchair'],min:1,say:'a chair'}, {kinds:['lamp'],min:1,say:'a good lamp'} ] }
  };

  /* ----------------------------------------------------------------- stars */
  // Every item is worth 1-5 stars. Most things are 1-3; a few really special
  // pieces are 4-5 and only unlock as your renown grows.
  var STAR_RULES = [
    [/^fireplace/, 4], [/^chandelier/, 3], [/^(couch|sofa)-/, 3], [/^armchair-/, 2], [/^chair-/, 2], [/^stool-/, 1],
    [/^bed-/, 2], [/^bedding-/, 2], [/^bedsidetable-/, 2], [/^sidetable-/, 1], [/couchtable/, 2], [/^diningtable-/, 3],
    [/^(sideboard|cabinet)-/, 3], [/^bookshelf-/, 3], [/^wallshelf-/, 2],
    [/^kitchen-island/, 4], [/^kitchen-counter/, 3], [/^fridge-/, 3],
    [/^(standmixer|mixer|coffeemaschine|coffee-maker|coffeemaker|mocca|kettle)/, 2],
    [/^curtain-rod/, 1], [/^paiting-easel/, 2], [/^(recordplayer|bust|marble-pillar|chessboard|globe)/, 2]
  ];
  var STAR_BY_CATEGORY = { lighting:2, rugs:2, curtains:2, 'wall-art':1, plants:1, textiles:1, decor:1, kitchen:1, seating:2, tables:2, storage:3, bed:3 };
  // hand-tuned exceptions: id -> stars
  var STAR_OVERRIDES = {
    // a few real "statement pieces" — the 5-star tier
    'diningtable-candy-marble-travertine': 5, 'diningtable-lala-green-marble': 5,
    'kitchen-island-serena-steel': 5, 'couch-uwe-light-leather': 5,
    'chandelier-ana': 4, 'couch-hennes-rosa-long': 5
  };
  function starsFor(a){
    if (STAR_OVERRIDES[a.id] != null) return STAR_OVERRIDES[a.id];
    var s = null, i;
    for (i = 0; i < STAR_RULES.length; i++) if (STAR_RULES[i][0].test(a.id)){ s = STAR_RULES[i][1]; break; }
    if (s == null) s = STAR_BY_CATEGORY[a.category] || 1;
    if (a.material === 'Marble') s += 1;
    if (a.material === 'Leather' && a.category === 'seating') s += 1;
    if (a.category === 'wall-art' && (a.defaultWidth || 0) >= 16) s += 1;
    if (a.category === 'plants' && (a.defaultWidth || 0) >= 14) s += 1;
    if ((a.defaultWidth || 0) >= 30 && a.category !== 'rugs' && a.category !== 'curtains') s += 1;
    return Math.max(1, Math.min(5, s));
  }

  /* ---------------------------------------------------------------- quests */
  // Requirement helper. tier: 'must' | 'like' | 'avoid'
  function R(tier, id, text, test, lines){
    var r = { id:id, tier:tier, text:text, test:test };
    if (lines){ r.praise = lines[0]; r.miss = lines[1]; }
    return r;
  }

  var QUESTS = [

  /* ======================== MIA ======================== */
  { id:'MIA_01', char:'mia', title:'A Key of My Own', property:'MIA_HOME_A', change:'new', edit:['living'],
    requires:[], day:0, allowance:32,
    story:"Mia has started at the vet practice and finally has her own keys. Most of her savings went on the deposit, so there's exactly one room she can afford to feel good in.",
    message:"I've never had a room where I get to choose everything! Green and beige, light wood, somewhere comfy to sit. And flowers, please. There's a rumour that a florist is opening on my street and I'm already emotionally invested.",
    brief:[
      R('must','role','A proper living room: a couch or armchair, a table and a lamp',{role:'living',room:'living'},
        ["It's a real living room — I can actually sit down in it!","I'm still sitting on a moving box, but I'm sure it's character-building."]),
      R('must','flowers','At least one bunch of flowers',{kinds:['flowers'],min:1},
        ["You remembered the flowers!","The flower-shop lady is going to ask where my flowers went."]),
      R('like','palette','Mostly green, beige and light wood',{colors:['Green','Beige','White','Yellow','Light Wood'],minShare:0.5},
        ["It's so soft and green in here. It's like a hug.","I love it, I just… wanted a bit more green and beige?"]),
      R('like','wood','Some light wood',{colors:['Light Wood'],min:1},
        ["The light wood is exactly right."]),
      R('avoid','noblack','No black furniture',{colors:['Black'],max:0},
        [null,"There's a black piece in there. It's looking at me."]),
      R('avoid','nochrome','Nothing shiny and chrome',{colors:['Chrome'],max:0},
        [null,"Something chrome snuck in. It's very shiny. I'm a bit scared."])
    ],
    reply:{ low:"It's a start. I'm just happy it's mine.", mid:"It feels like a place I could live in. Thank you!", high:"I came home, sat down, and just stayed there. This is the first place that's really felt like mine." }
  },
  { id:'MIA_02', char:'mia', title:'Now the Rest Feels Empty', property:'MIA_HOME_A', change:'more', edit:['bedroom','spare'],
    requires:['MIA_01','JULES_01'], day:46, allowance:58,
    story:"Mia passed her probation (and got a small raise). Every evening she ends up in the living room you did, because the rest of the flat still feels temporary.",
    message:"Every evening I end up in the room you did. Could you help with the other two? A soft pink bedroom, I think, and green in the little room. You already know how I feel about flowers.",
    brief:[
      R('must','bedroom','The bedroom: a bed and a bedside table',{role:'bedroom',room:'bedroom'},["I slept so well I was late for work. Worth it."]),
      R('must','reading','The little room as a reading room: a comfy seat, a lamp, something to read',{role:'reading',room:'spare'},["I've already started a very long fantasy book in there."]),
      R('must','flowers','Flowers in both new rooms',{kinds:['flowers'],min:1,rooms:['bedroom','spare'],each:true},["Flowers in BOTH rooms. You get me."]),
      R('like','pink','Soft pink and beige in the bedroom',{colors:['Rosa','Pink','Blush','Beige','White'],minShare:0.5,room:'bedroom'},["The bedroom is the softest thing I've ever seen."]),
      R('like','green','Plenty of green in the little room',{colors:['Green'],min:2,room:'spare'},["The little room feels like a garden."]),
      R('avoid','nodark','Nothing dark or black',{colors:['Black','Dark Wood'],max:0},[null,"A couple of the pieces are a bit dark for my taste."])
    ],
    reply:{ low:"The rooms feel less empty, and that's a lot already.", mid:"Now the whole flat feels like me. Thank you.", high:"I invited my mum round. I didn't apologise for anything. That's new." }
  },
  { id:'MIA_03', char:'mia', title:'Our First Place', property:'MIA_HOME_B', change:'move', edit:['living','dining','bedroom'],
    requires:['MIA_02'], minRenown:15, day:178, allowance:92,
    story:"Mia and Alex are moving in together. Alex likes blue and simple shapes. Mia wants her softer, greener self to come along.",
    message:"Alex wants blue, I still want green, and we both want it to feel like home. Could you bring a bit of my old living room with us? And leave room for flowers on the dining table. (Alex says hi. Alex is very organised.)",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room is ours already."]),
      R('must','dining','A dining table with seats',{role:'dining',room:'dining'},["We can have people over. A frightening thought!"]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["We both want to go to bed right now, which is the best review."]),
      R('must','flowers','Flowers in the living and dining rooms',{kinds:['flowers'],min:1,rooms:['living','dining'],each:true},["Flowers on the table! Alex actually gasped."]),
      R('like','palette','Green, blue and beige together, with light wood',{colors:['Green','Blue','Beige','White','Light Wood'],minShare:0.6},["It's Alex AND me. I didn't think it would work!"]),
      R('like','navy','A few blue pieces for Alex',{colors:['Blue'],min:3},["Alex found the blue and went very quiet. That's good."]),
      R('avoid','notdark','Not too dark overall',{colors:['Black','Dark Wood'],maxShare:0.25},[null,"It's a bit heavy on the dark side. We're cosy people, not moody ones."])
    ],
    reply:{ low:"It's a roof, a table and each other. That counts.", mid:"We have a home. A real one. With a table!", high:"Alex says it feels like both of us. I say it feels like the first room I ever chose, but bigger." }
  },

  /* ======================== JULES ======================== */
  { id:'JULES_01', char:'jules', title:'Everything Happens Here', property:'JULES_HOME_A', change:'new', edit:['studio'],
    requires:['MIA_01'], day:10, allowance:34,
    story:"Mia sent Jules your way. Jules has arrived in Pennywhistle Cove to finish an illustration course, and has taken an attic room in an old mill. Every art supply is unpacked; the bed is not.",
    message:"The easel goes in first. After that, somewhere to sleep would be sensible, I suppose. Blue and orange, please! I want to walk in and feel like making something. (Please don't make it beige. Beige is how they get you.)",
    brief:[
      R('must','easel','An easel, for the important part',{kinds:['easel'],min:1},["THE EASEL. I could cry."]),
      R('must','studio','Somewhere to sleep and somewhere to sit, in the same room',{role:'studio',room:'studio'},["A bed AND a chair. Luxury!"]),
      R('like','blue','A few blue pieces',{colors:['Blue'],min:3},["So much blue. Yes."]),
      R('like','orange','Some orange pop',{colors:['Orange','Red','Yellow'],min:2},["That orange makes me want to paint something silly."]),
      R('like','mix','At least four different colours (nothing like a matching set)',{minDistinct:4},["Nothing matches and I love it."]),
      R('avoid','nobeige','Not predominantly beige or white',{colors:['Beige','White'],maxShare:0.4},[null,"It's gone a bit beige in here. I feel it in my bones."])
    ],
    reply:{ low:"It's a roof and an easel. I can work with that.", mid:"I can walk in and want to make something. That's all I wanted.", high:"I put the easel down and painted until 3am. The room made me do it." }
  },
  { id:'JULES_02', char:'jules', title:'My First Paid Commission', property:'JULES_HOME_A', change:'refresh', edit:['studio'],
    requires:['JULES_01','SAM_01'], day:58, allowance:30,
    story:"Someone has actually paid Jules for an illustration! The studio gets a refresh — the room you made stays as it is, with a few new things.",
    message:"Someone has actually PAID me. I'd like to spend a little on this place. Keep the easel and the blue, but could we try something pink with it? It still needs to feel like my room.",
    brief:[
      R('must','easel','Keep the easel',{kinds:['easel'],min:1},["The easel is still the boss of the room."]),
      R('must','new','Bring in at least 3 new pieces',{newMin:3},["A few new bits and it feels like I grew up a little."]),
      R('like','blue','Keep the blue',{colors:['Blue'],min:3},["Blue stays. Good."]),
      R('like','lilac','Something pink (the Carla couch comes in pink!)',{colors:['Pink','Rosa','Blush'],min:2},["PINK. You found pink!"]),
      R('avoid','nobeige','Not beige-dominated',{colors:['Beige','White'],maxShare:0.35},[null,"There's a lot of beige creeping back in."])
    ],
    reply:{ low:"A tiny bit fancier. A tiny bit more me.", mid:"It's like my room grew up and kept its personality.", high:"I'm going to tell the client it's from my 'inspiration space'. It's from you." }
  },
  { id:'JULES_03', char:'jules', title:'A Door with My Name on It', property:'JULES_HOME_B', change:'upstairs', edit:['living','bedroom','art'],
    requires:['JULES_02','ROSA_02'], minRenown:15, day:214, allowance:94,
    story:"Jules graduated and a small creative grant arrived. The mill's landlord has offered Jules the whole top floor: a live-work loft with an actual room for art. Jules is slightly overwhelmed by the idea of a door that closes.",
    message:"An actual room for painting! Give that room ALL the colour. The bedroom can be softer. And please don't make the living room look like a reception area.",
    brief:[
      R('must','art','The art room: an easel and something on the walls',{role:'artroom',room:'art'},["The art room smells of future mess. Perfect."]),
      R('must','living','A living room to sit in',{role:'living',room:'living'},["The living room is lived-in already. Which is a polite way of saying messy."]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["I'm going to sleep in a bedroom. Away from the turpentine."]),
      R('like','color','The art room bursting with colour',{minDistinct:5,room:'art'},["The art room is a rainbow that has had too much coffee. 10/10."]),
      R('like','soft','A quieter, softer bedroom',{colors:['Beige','White','Grey','Pink','Rosa','Blush','Light Wood'],minShare:0.6,room:'bedroom'},["The bedroom is the first calm room I've ever owned."]),
      R('avoid','reception','The living room is not a matching beige reception',{colors:['Beige','White'],maxShare:0.4,room:'living'},[null,"The living room looks suspiciously like a dentist's waiting room."])
    ],
    reply:{ low:"It's a loft. It's mine. I'll make it messier myself.", mid:"A door with my name on it. Technically a sticker.", high:"I'm hosting the first-ever Jules Open Studio. Nobody will come. I will make cake." }
  },

  /* ======================== SAM ======================== */
  { id:'SAM_01', char:'sam', title:'Dinner at Mine', property:'SAM_HOME_A', change:'new', edit:['kitchen'],
    requires:['JULES_01'], day:24, allowance:42,
    story:"Sam has moved for a better-paying job and has already invited his entire new team to dinner. The kitchen comes first. The oven is, as of this week, 'on its way'.",
    message:"The bedroom can wait. I want a kitchen I'm excited to cook in. Dark wood, red, plenty of metal. Spare no mixers! (The oven is on back-order. It's been on back-order for six weeks. We don't talk about it.)",
    brief:[
      R('must','kitchen','A working kitchen: a counter or island, and a fridge',{role:'kitchen',room:'kitchen'},["It looks like a kitchen where things happen."]),
      R('must','gadgets','At least 3 cooking gadgets: mixers, coffee machines, kettles',{kinds:['gadget'],min:3},["Gadgets! I'll have the whole team making pasta by Friday."]),
      R('like','dark','Dark wood, red and brown',{colors:['Dark Wood','Red','Brown'],min:2},["Dark wood and a dash of red. Theatrical. I'm in love."]),
      R('like','metal','Metal finishes: chrome and steel',{colors:['Chrome','Steel','Silver'],min:3},["So much chrome. My reflection approves."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"Is that… a flower? In my kitchen? We'll talk."]),
      R('avoid','nolightwood','No light rustic wood',{colors:['Light Wood'],max:0},[null,"I spotted some light wood. It's very… farmhouse."])
    ],
    reply:{ low:"It's a kitchen. I'll make dinner anyway — on the floor if needed.", mid:"This is a kitchen I'd happily burn something in.", high:"This is exactly the kitchen I wanted to invite people into. Dinner at mine. Bring wine." }
  },
  { id:'SAM_02', char:'sam', title:'Come Through to the Living Room', property:'SAM_HOME_A', change:'more', edit:['dining','living'],
    requires:['SAM_01','NOOR_01'], minRenown:5, day:104, allowance:64,
    story:"Dinner at Sam's has become a Thing. The kitchen is working overtime, and the guests now need somewhere lovely to eat and then to lie around dramatically.",
    message:"The kitchen's getting plenty of use. Now: somewhere lovely to eat, and somewhere to collapse afterwards. Keep that dark wood. Leather would be wonderful. (Velvet is also on back-order. Don't ask.)",
    brief:[
      R('must','dining','A dining table and seats for the guests',{role:'dining',room:'dining'},["Twelve seats! … Okay, it's five. But it's the thought."]),
      R('must','living','A living room with a couch, a table and a lamp',{role:'living',room:'living'},["The 'collapse afterwards' room works."]),
      R('like','leather','A leather couch or armchair',{materials:['Leather'],kinds:['couch','armchair'],min:1},["Leather. Smells expensive. Isn't. Perfect."]),
      R('like','dark','Dark wood and red continued from the kitchen',{colors:['Dark Wood','Red','Brown'],min:4},["The kitchen's mood carries all the way through. Chef's kiss."]),
      R('like','orange','Orange accents',{colors:['Orange'],min:2},["That orange! Sunset in a room."]),
      R('like','chrome','A few chrome or black pieces for drama',{colors:['Chrome','Black'],min:3},["A little chrome, a little black. Seventies in the best way."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"Flowers again. I see what's happening."]),
      R('avoid','nolightwood','No light rustic wood',{colors:['Light Wood'],max:0},[null,"A bit of light wood got in. It's like a cabin visited."])
    ],
    reply:{ low:"A place to sit. People will sit. People are flexible.", mid:"I can already hear the clinking of glasses.", high:"People stayed until 2am and nobody wanted to leave the couch. That's the review I wanted." }
  },
  { id:'SAM_03', char:'sam', title:'A Key for Both of Us', property:'SAM_HOME_B', change:'move', edit:['kitchen','living','bedroom'],
    requires:['SAM_02'], minRenown:15, day:238, allowance:104,
    story:"Sam got promoted and he and Robin, a teacher, have bought their first home together. Robin loves Sam's taste but would like to sleep somewhere that doesn't feel like a stage.",
    message:"I'd still put the kitchen first. Robin wants the bedroom lighter, which is fair. Can you make it feel like one home without making every room equally dramatic? (We now own a dish rack. It's the best day of my life.)",
    brief:[
      R('must','kitchen','A working kitchen',{role:'kitchen',room:'kitchen'},["The kitchen. THE kitchen."]),
      R('must','gadgets','At least 3 cooking gadgets',{kinds:['gadget'],min:3},["Mixers, kettles, glory."]),
      R('must','living','A living room',{role:'living',room:'living'},["The living room has presence."]),
      R('must','bedroom','A bedroom with a bed and bedside table',{role:'bedroom',room:'bedroom'},["Robin tested the bed immediately. Good sign."]),
      R('like','dark','Dark wood and red in the kitchen and living room',{colors:['Dark Wood','Red','Brown'],min:5,rooms:['kitchen','living']},["The public rooms say 'Sam'."]),
      R('like','lightbed','A lighter bedroom: mostly beige and white',{colors:['Beige','White','Light Wood'],minShare:0.5,room:'bedroom'},["Robin says it's the best room. I'm not offended. I'm a little offended."]),
      R('like','leather','Leather in the living room',{materials:['Leather'],kinds:['couch','armchair'],min:1,room:'living'},["Leather: it's practically a love language."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"I found a flower. I'm choosing to be calm."]),
      R('avoid','notdarkbed','Bedroom not heavily dark',{colors:['Black','Dark Wood'],maxShare:0.3,room:'bedroom'},[null,"The bedroom is a touch dramatic for sleeping."])
    ],
    reply:{ low:"It's ours. That's the part that matters.", mid:"One home, many moods. I like it.", high:"Robin came home, put the kettle on and said 'ah'. I'm calling that five stars." }
  },

  /* ======================== NOOR ======================== */
  { id:'NOOR_01', char:'noor', title:'Somewhere to Switch Off', property:'NOOR_HOME_A', change:'new', edit:['bedroom'],
    requires:['SAM_01'], day:38, allowance:32,
    story:"Noor has moved within Pennywhistle Cove after a breakup, and has decided that is entirely her own business. She wants one calm room finished before looking at the rest.",
    message:"The bedroom first. White, blue, light wood. I look at plans all day; I don't want work following me to bed. Fewer things, chosen well.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["It's quiet. The good kind."]),
      R('like','palette','Mostly white, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["The palette is… correct."]),
      R('like','blue','A little blue',{colors:['Blue'],min:1},["That blue is exactly the right amount."]),
      R('like','storage','Somewhere to put things away',{kinds:['sideboard','storage'],min:1},["Closed storage. The room can breathe."]),
      R('like','calm','Calm: no more than 12 pieces',{maxItems:12},["You left space. Do you know how rare that is?"]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"There's a pattern. It's shouting."])
    ],
    reply:{ low:"It's a bedroom. I'll make it work.", mid:"Calm. Mostly. I could sleep here.", high:"It feels calm. You paid attention. Most people don't." }
  },
  { id:'NOOR_02', char:'noor', title:'You Understood Me', property:'NOOR_HOME_A', change:'more', edit:['living','kitchen'],
    requires:['NOOR_01','THEO_01'], day:124, allowance:60,
    story:"Noor liked the bedroom enough to say so. Out loud. In the office, within hearing of two colleagues. She'd like the living room and kitchen to follow it.",
    message:"You listened. I'd like you to do the kitchen and living room too. The same restraint, but they don't have to look identical. Keep the blue.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room does exactly what it should."]),
      R('must','kitchen','A working kitchen',{role:'kitchen',room:'kitchen'},["A kitchen I'd actually cook in."]),
      R('like','palette','White, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["Same restraint. Different room. Well done."]),
      R('like','wood','Light wood in the living room',{colors:['Light Wood'],min:2,room:'living'},["The wood in the living room is lovely."]),
      R('like','metal','Steel, chrome or white in the kitchen',{colors:['Steel','Chrome','Silver','White','Grey'],minShare:0.5,room:'kitchen'},["The kitchen is clean and a little bit smug. Like me."]),
      R('like','calm','No more than 14 pieces per room',{maxItems:14,rooms:['living','kitchen'],each:true},["You left things out. That's craftsmanship."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"There's a pattern. I'm trying to ignore it."])
    ],
    reply:{ low:"Functional. I can work with that.", mid:"It feels like one person lives here. That person is me.", high:"I invited my sister over. I didn't tidy first. That's how I know." }
  },
  { id:'NOOR_03', char:'noor', title:'A Place of My Own', property:'NOOR_HOME_B', change:'upstairs', edit:['living','bedroom','study'],
    requires:['NOOR_02'], minRenown:15, day:270, allowance:96,
    story:"Noor got promoted and bought the top floor of her own building: tall windows, a ceiling you could lose a kite in, and absolutely one rule: no desk. 'Desks are how work follows you home.'",
    message:"I bought the top floor, so I intend to stay. I'd like the furniture to feel considered. A quiet bedroom, somewhere I actually want to sit at the end of the day, and a small room to think in. No desk. A chair, a shelf, a good lamp.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["I'll sit here at the end of every day."]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom is a respite."]),
      R('must','study','The quiet room: a shelf or sideboard, a chair and a good lamp',{role:'study',room:'study'},["The quiet room. A chair, a shelf, a lamp. Perfect."]),
      R('like','stone','One good stone or marble piece',{materials:['Marble','Stone'],min:1},["That marble piece: considered. I noticed."]),
      R('like','palette','White, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood','Travertine'],minShare:0.55},["Clean. Proportional. Quietly correct."]),
      R('like','calm','No more than 12 pieces per room',{maxItems:12,rooms:['living','bedroom','study'],each:true},["Lots of air. Lots of calm."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"A pattern. Of course."])
    ],
    reply:{ low:"It's a start. I'll live with it.", mid:"Considered. That's the word I'd use.", high:"I came home from the site, took my shoes off, and nobody needed me. The flat agrees. Thank you." }
  },

  /* ======================== THEO ======================== */
  { id:'THEO_01', char:'theo', title:'Before the Baby Arrives', property:'THEO_HOME_A', change:'new', edit:['living'],
    requires:['NOOR_01'], day:74, allowance:32,
    starters:[ {room:'living', asset:'sideboard-akio-mediumwood', x:56, y:58, width:null} ],
    story:"Theo and Elena have found a little cabin on Lantern Lane, at the top of Orchard Rise, with just enough room for a growing family. Their belongings have arrived. The living room is a collection of temporary solutions.",
    message:"We want somewhere we can both sit and breathe for a minute. Elena likes white; I'd love some yellow or blue. It doesn't need to be fancy. Oh, and we kept the old sideboard. It might be useful.",
    brief:[
      R('must','living','A living room to sit and breathe in',{role:'living',room:'living'},["We sat down and just… breathed. Thank you."]),
      R('like','white','White and beige',{colors:['White','Beige'],min:2},["Elena says the white is very her."]),
      R('like','mustard','A bit of yellow or orange',{colors:['Yellow','Orange'],min:1},["Yellow! I knew we needed some."]),
      R('like','blue','Blue',{colors:['Blue'],min:1},["That blue is lovely and sturdy."]),
      R('like','wood','Practical wood',{colors:['Light Wood','Medium Wood'],min:1},["Good solid wood."]),
      R('avoid','nowhitecouch','No white upholstery',{kinds:['couch','armchair'],colors:['White'],max:0},[null,"White upholstery and a baby on the way? Brave."]),
      R('avoid','novases','Nothing fragile: no vases',{kinds:['vase'],max:0},[null,"A vase! Which will be on the floor by Tuesday."])
    ],
    reply:{ low:"It's a good start. We'll make it ours.", mid:"This feels like somewhere we can actually settle in.", high:"Elena cried a little and said it was 'hormones'. I think it was the sideboard." }
  },
  { id:'THEO_02', char:'theo', title:'A Room for Us, Too', property:'THEO_HOME_A', change:'more', edit:['bedroom'],
    requires:['THEO_01','NOOR_03'], day:302, allowance:36,
    story:"The baby has arrived and so has a lot of laundry. Theo and Elena have spent their money on essentials and left their own bedroom for last. They'd love one room that's restful and adult.",
    message:"The living room still makes us happy. Could you help with our bedroom now? Elena suggested green. I'd like to keep the wood and keep it simple. And somewhere to put clothes that isn't 'the chair'.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["It's a real bedroom. With a bed we can find the floor around."]),
      R('must','storage','Somewhere to put clothes: a sideboard or cabinet',{kinds:['sideboard'],min:1},["Storage that isn't a chair. Finally."]),
      R('like','green','Green and white',{colors:['Green','White','Beige'],minShare:0.5},["Green and white. Elena says it's 'calm in a fresh way'."]),
      R('like','wood','Sturdy wood',{colors:['Light Wood','Medium Wood'],min:2},["The wood keeps it grounded."]),
      R('avoid','nowhitebed','No white bed',{kinds:['bed'],colors:['White'],max:0},[null,"A white bed, with a baby in the house? Daring."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. I'm sorry. Our history with vases is not good."])
    ],
    reply:{ low:"It's somewhere to sleep. That's a lot, right now.", mid:"Restful. Adult. That's all we asked.", high:"We slept for six hours straight. The baby did too. Is this witchcraft?" }
  },
  { id:'THEO_03', char:'theo', title:'Enough Room for Everyone', property:'THEO_HOME_B', change:'move', edit:['living','dining','bedroom'],
    requires:['THEO_02'], minRenown:15, day:360, allowance:86,
    starters:[ {room:'living', asset:'sideboard-akio-mediumwood', x:60, y:58, width:null} ],
    story:"Theo is now a co-owner of the bakery and the family has moved to a bigger flat with a proper dining room. They can afford new furniture, but they brought the sideboard. It might be useful.",
    message:"We've finally got a proper dining room! I'd love us all to sit down together when family visits. Bring what still works from the old place, we don't need to start from zero. (The sideboard is back. It followed us.)",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room is comfy and ready for naps."]),
      R('must','dining','A dining room with a table and seats',{role:'dining',room:'dining'},["A table. For everyone. I might cry into the soup."]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom is peaceful."]),
      R('like','palette','White, green, yellow and blue, with wood',{colors:['White','Beige','Green','Yellow','Orange','Blue','Light Wood','Medium Wood'],minShare:0.65},["It's cheerful AND practical. A rare combo."]),
      R('like','mustard','A touch of yellow',{colors:['Yellow','Orange'],min:1},["Yellow is back."]),
      R('like','wood','Sturdy wood in a few places',{colors:['Light Wood','Medium Wood'],min:3},["Plenty of good wood."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. Our nemesis."]),
      R('avoid','nowhite','No white upholstery',{kinds:['couch','armchair','bed'],colors:['White'],max:0},[null,"White upholstery. In THIS household."])
    ],
    reply:{ low:"It's a home. We'll fill the rest with noise.", mid:"A proper family flat. We're delighted.", high:"Everyone sat at the table and nobody wanted to leave. Even the baby's grandad. That never happens." }
  },

  /* ======================== ROSA ======================== */
  { id:'ROSA_01', char:'rosa', title:'Finally, the Sitting Room', property:'ROSA_HOME_A', change:'new', edit:['sitting'],
    requires:['THEO_01'], day:88, allowance:42,
    starters:[ {room:'sitting', asset:'sideboard-nikola-darkwood', x:58, y:56, width:null} ],
    story:"Rosa retired from the theatre costume department last month and hasn't enjoyed a single beige thing since. She knows which belongings she loves and which she's tolerated for years. She wants someone who'll work with her taste, not erase it.",
    message:"I've hated that arrangement for years. The dark wood stays — I'm very attached to the sideboard. And I want proper colour: red, yellow, something with a pattern. Retirement is no reason to turn everything beige, darling.",
    brief:[
      R('must','sitting','A sitting room with two places to sit, a table and a lamp',{role:'sitting',room:'sitting'},["Yes. Now one can receive."]),
      R('must','pattern','Something patterned: a rug, a cushion, a painting',{kinds:['patterned'],min:1},["A pattern! One feels dressed."]),
      R('like','wine','Red, yellow and dark wood',{colors:['Red','Orange','Yellow','Dark Wood','Brown','Gold','Brass'],minShare:0.45},["Red, yellow, dark wood. You've been listening, darling."]),
      R('like','red','At least two red pieces',{colors:['Red'],min:2},["Red, yes. A life without red is a life unlived."]),
      R('like','ochre','Some yellow or orange',{colors:['Yellow','Orange'],min:2},["That yellow warms the soul."]),
      R('avoid','noall','Not a pale room: little white or beige',{colors:['White','Beige'],maxShare:0.25},[null,"There's rather a lot of beige. One could faint."])
    ],
    reply:{ low:"It's a start. I'll complain about it fondly.", mid:"Plenty of colour, and it still feels like my home. Good.", high:"I sat in it and wanted to hold a small dinner party immediately. That's a compliment, darling." }
  },
  { id:'ROSA_02', char:'rosa', title:'Stay for Tea', property:'ROSA_HOME_A', change:'more', edit:['dining','guest'],
    requires:['ROSA_01','MIA_02'], day:146, allowance:68,
    story:"Rosa has started teaching small sewing classes in the village hall. Friends stay for tea afterwards, and her daughter visits at weekends. The dining room needs attention, and the guest room is 'where I put things I haven't decided about'.",
    message:"Everyone ends up staying longer now. The dining room needs some attention, and my daughter deserves better than the room where I put things I haven't decided about. Blue and green in her room, I think. Red and yellow for the table.",
    brief:[
      R('must','dining','A dining table with seats',{role:'dining',room:'dining'},["Tea for six, and a debate. Perfect."]),
      R('must','guest','A guest bedroom: a bed and a bedside table',{role:'bedroom',room:'guest'},["My daughter will feel adored. And a bit spoilt."]),
      R('like','dining','Red, yellow and dark wood in the dining room',{colors:['Red','Orange','Yellow','Dark Wood','Brown'],minShare:0.4,room:'dining'},["The dining room is a stage set for conversation."]),
      R('like','guest','Green and blue in the guest room',{colors:['Green','Blue','Beige','White'],minShare:0.5,room:'guest'},["The guest room is so peaceful. Almost suspicious."]),
      R('like','brass','A touch of brass or gold',{colors:['Brass','Gold'],min:1},["A bit of gold. One should always have a bit of gold."]),
      R('like','dark','Dark wood in the dining room',{colors:['Dark Wood'],min:2,room:'dining'},["The wood is substantial. I approve."]),
      R('avoid','nowhite','Not white and pale everywhere',{colors:['White'],maxShare:0.25},[null,"Too much white. It's a hospital, not a home."])
    ],
    reply:{ low:"A fine beginning. One expects improvements.", mid:"Lovely. Now everyone will stay even longer. Good.", high:"Four people stayed until midnight. I've found the room's 'one more cup' effect. Marvellous." }
  },
  { id:'ROSA_03', char:'rosa', title:'The Little House on Lantern Lane', property:'ROSA_CABIN_A', change:'second', edit:['living','kitchen','bedroom'],
    requires:['ROSA_02'], minRenown:15, day:330, allowance:110,
    story:"With long-held savings and an inheritance, Rosa has bought a little cabin on Lantern Lane, with the bay glinting through the trees. She keeps her city flat. The cabin is small and bright, and calls for a lighter, breezier version of her taste.",
    message:"I want to know I'm near the water when I open the windows. I don't need little ducks on the cushions. Lighter wood, some green and blue — but don't make it anonymous, darling. A little yellow. I do have a reputation.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["I could read here for weeks."]),
      R('must','kitchen','A kitchen, with a counter and a fridge',{role:'kitchen',room:'kitchen'},["Tea, toast. A kitchen of dignity."]),
      R('must','bedroom','A bedroom with a bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom will let me sleep to the sound of the water."]),
      R('like','palette','Green, blue, beige and light wood',{colors:['Green','Blue','Beige','White','Light Wood'],minShare:0.6},["It's the bay in a room. Not literal. Wonderful."]),
      R('like','ochre','Small warm accents: yellow, orange or gold',{colors:['Yellow','Orange','Gold','Brass'],min:1},["That bit of yellow is me, in tiny form."]),
      R('like','wood','Light wood in a few places',{colors:['Light Wood'],min:3},["Light, lovely wood."]),
      R('like','table','A table in the kitchen to eat at',{kinds:['dining'],min:1,room:'kitchen'},["A kitchen table. Bliss."]),
      R('avoid','nodark','Not an all-dark-wood interior',{colors:['Dark Wood'],maxShare:0.2},[null,"Rather a lot of dark wood for a little cabin, darling."])
    ],
    reply:{ low:"It's a house with a view of the bay. One forgives a great deal.", mid:"It's light and it's mine. Lovely.", high:"I opened the window, heard the ducks, and decided to stay till autumn. You've ruined my city flat for me." }
  }

  ];

  /* ------------------------------------------------------------------ voices */
  // How each neighbour writes and talks. `paper` picks the stationery and
  // handwriting in the UI; `hi`/`bye` frame the reply they send back; `ask`
  // is what they say when you try to hand something over a bit early; `idle`
  // are little moments shown when you click their door on the map.
  var VOICES = {
    mia:   { paper:'mia',   sign:'Mia',   hi:'Hello!',   replyBye:'Thank you, really. — Mia x',
             ask:"Sorry — I hate to ask — but I was really hoping for…",
             idle:["Mia is in the doorway holding a tray of something that smells of cinnamon.",
                   "Mia waves, then pretends she was fixing her hair.",
                   "Mia is arranging flowers she definitely did not need to buy."] },
    jules: { paper:'jules', sign:'Jules', hi:'OKAY.',    replyBye:'Yours in turpentine, J.',
             ask:"WAIT. Before you go. I was kind of counting on…",
             idle:["Jules is leaning out of a window with paint on their nose.",
                   "Jules waves with a brush. Something drips.",
                   "Jules is drawing a pigeon. The pigeon is posing."] },
    sam:   { paper:'sam',   sign:'Sam',   hi:'Well,',    replyBye:'Warmly, Sam',
             ask:"Not to be a bore, but I did mention…",
             idle:["Sam is carrying nine bags of shopping and a smile.",
                   "Sam raises a glass at you from the balcony. It's tea. Probably.",
                   "Sam is on the phone, mouthing 'two minutes', clearly meaning twenty."] },
    noor:  { paper:'noor',  sign:'Noor',  hi:'Hello.',   replyBye:'Regards, N.',
             ask:"A small note. I asked for:",
             idle:["Noor nods, once. That is high praise.",
                   "Noor is measuring something that does not need measuring.",
                   "Noor's window is open. Her plants are perfectly spaced."] },
    theo:  { paper:'theo',  sign:'Theo',  hi:'Hey!',     replyBye:'Cheers, Theo (and Elena)',
             ask:"Ah — quick one — I think we were hoping for…",
             idle:["Theo is carrying a tray of rolls and singing badly.",
                   "Theo waves a spanner like a flag.",
                   "Theo is pushing a very small, very serious pram."] },
    rosa:  { paper:'rosa',  sign:'Rosa',  hi:'Darling,', replyBye:'Fondly, Rosa',
             ask:"One moment, darling. One had rather hoped for…",
             idle:["Rosa is on her balcony, wearing something magnificent.",
                   "Rosa is pinning a hem on a mannequin and judging the street.",
                   "Rosa raises one eyebrow at you. It is affection."] }
  };
  Object.keys(VOICES).forEach(function(k){ CHARACTERS[k].voice = VOICES[k]; });

  /* ---------------------------------------------------------------- letters */
  // The brief, written as a real letter. `body` paragraphs are read top to
  // bottom; the structured list (must / love / avoid) lives on the note that
  // is clipped to the letter and pinned up while you decorate.
  var LETTERS = {
    MIA_01: { hello:"Hello {you}!",
      body:["I have a key now. My own key! I keep checking my pocket. You were always the one who knew what I'd like before I did, so I'm asking the best person I know.",
            "I can only afford to make one room nice: the living room. Somewhere comfy, a little table, a lamp. Green, beige and light wood. And flowers! (A florist is about to open on my street and I'm already emotionally invested.) My toes are always cold, so something soft for the floor?",
            "No black furniture or shiny chrome, please. Shiny things make me nervous."],
      bye:"Thank you so much,", ps:"There will be cookies." },
    MIA_02: { hello:"Hello again!",
      body:["I passed my probation! I buy dahlias at Fennel & Fern every Friday (the shop cat waits for me), and every evening I still end up in the living room you made, like a cat in the only sunny spot. My room at Mum's had a black table on a dark rug, and it felt like a cave.",
            "Could you do the other two rooms? A soft pink bedroom, and the little room as a reading corner, green like a tiny garden. Flowers in both, please, and nothing too dark."],
      bye:"Thank you again,", ps:"A friend called Alex carried my bookcase up the stairs. I'm saying nothing." },
    MIA_03: { hello:"Dear {you},",
      body:["Alex and I are moving in together! A real flat with a real dining table. (Alex's grandmother's wooden one survived three house moves and a rave. We want one like it.)",
            "Alex likes blue and clean shapes; I like green and anything that smells of baking. Could you find the middle? A living room, a dining room and a bedroom. Flowers on the table (Fennel & Fern, obviously), a few blue pieces for Alex, and nothing too dark. We're cosy people, not moody ones."],
      bye:"Gratefully (and sticky),", ps:"There's a lemon loaf waiting. In my head, but still." },

    JULES_01: { hello:"HELLO!!",
      body:["Mia gave me your name and a cookie. I have one suitcase and ELEVEN boxes of paint. The paint is unpacked. The bed is… somewhere?",
            "One room that does everything. The EASEL first, then somewhere to sleep, then somewhere to sit and stare at the ceiling. Blue and orange, the only couple I believe in, plus lots of colours that don't match. Matching is how they get you.",
            "Please don't make it beige. BEIGE IS HOW THEY GET YOU."],
      bye:"Yours in turpentine,", ps:"I drew you on the back. You look like a potato in a nice jumper." },
    JULES_02: { hello:"OKAY SO,",
      body:["SOMEONE PAID ME. For a drawing of a heron in a raincoat. I've read the email eleven times. (I spent half of it at the flea market, on a clock.)",
            "Keep the easel and the blue, bring in three or four new things, and could we try pink? Also: I've named my fern Gerald and he needs a friend. The Carla couch comes in pink and I've been staring at it for days. And less beige. I can feel it creeping back."],
      bye:"Gratefully chaotic,", ps:"The heron is going on a mug." },
    JULES_03: { hello:"GUESS WHAT,",
      body:["I GRADUATED. The mill's landlord offered me the whole top floor: a live-work loft with a DOOR THAT CLOSES. AND the Paper Moth Gallery has asked for six of my prints!!",
            "The art room needs ALL the colour: easel, things on the walls, a rainbow that had too much coffee. The bedroom should be soft and quiet. And please don't let the living room look like a dentist's waiting room."],
      bye:"Yours, slightly overwhelmed,", ps:"I'm planning an Open Studio. I will make cake. (I can't bake.)" },

    SAM_01: { hello:"Good evening, {you},",
      body:["I've just moved for a better job and invited my whole team to dinner on Friday. Eleven people, a flat that seats four. It'll be wonderful.",
            "The kitchen comes first: dark wood, red, plenty of chrome and steel, an island big enough to put a party on, and a fridge that hums reassuringly. (I once saw brass beside chrome and had to sit down.) And gadgets: three mixers at least. No flowers (they wilt when I look at them) and nothing light and rustic.",
            "(The oven is on back-order. We don't discuss it.)"],
      bye:"Warmly, and in need of a whisk,", ps:"Friday, seven o'clock. That's an invitation, not a request." },
    SAM_02: { hello:"My friend,",
      body:["The kitchen is a triumph. Eleven people ate in it and the only casualty was a lemon. A florist opened across the road; I have walked past it twice, on purpose.",
            "A dining table with enough seats to pretend I planned this, and a room next door to collapse in. Leather, please. Keep the dark wood and red, add orange and a little chrome or black. Wood should behave: one tone, not a lumberyard. Still no flowers. Still nothing pale."],
      bye:"Gratefully,", ps:"A guest called Robin did all the washing up. I have invited them back." },
    SAM_03: { hello:"Dear friend,",
      body:["I got promoted. And Robin and I have bought a place, together. We own a dish rack. Best day of my life.",
            "Kitchen first, obviously, with gadgets worth bragging about. Dark wood, red and leather in the living room. The bedroom lighter, beige and white, because Robin would like to sleep somewhere that isn't a stage set. A little drama is a seasoning, not a main course. And no flowers!"],
      bye:"Yours, in a rare moment of restraint,", ps:"Robin says I'm not allowed a second mixer. We'll see." },

    NOOR_01: { hello:"Hello.",
      body:["Sam passed on your details. He said you actually listen. I'll assume that's true.",
            "I've moved. That's not up for discussion. I'd like one room finished: the bedroom. A bed, a bedside table, white, a little blue, light wood. Twelve things at most; I counted. Somewhere to put things away. No busy patterns, and matching grain matters to me."],
      bye:"Regards,", ps:"If a shelf is two centimetres off, I'll know." },
    NOOR_02: { hello:"Hello again.",
      body:["The bedroom works. I said so out loud, in the office. One colleague dropped a stapler.",
            "Now the living room and the kitchen: the same restraint, but each with its own temperament. Light wood in the living room; steel, chrome or white in the kitchen. Keep the blue. Fourteen pieces a room at most. No patterns. (Chrome next to brass is a family argument.)"],
      bye:"Regards,", ps:"My sister asked who did the bedroom. I said ‘someone good’." },
    NOOR_03: { hello:"Hello.",
      body:["I have bought the top floor of my building: tall windows, a ceiling you could lose a kite in. I intend to stay.",
            "A living room I want to sit in at the end of the day, a quiet bedroom, and a small room to think in: a chair, a shelf, one good lamp. One. No desk. One good piece of stone or marble. White, blue, grey, light wood; twelve pieces a room at most; no patterns."],
      bye:"With some warmth, which I'm told is noticeable,", ps:"The windows are 3.4 metres tall. I measured twice." },

    THEO_01: { hello:"Hi there!",
      body:["Noor said you were good, and she doesn't say that about anyone. Elena and I have found a little cabin up on Lantern Lane. The baby's due in spring and the living room is full of ‘temporary solutions’. Elena calls blue and yellow ‘our colours’, like the shop sign.",
            "We'd love somewhere to sit and breathe: white, a bit of yellow, some blue, solid wood. Nothing white to sit on (small person incoming) and nothing breakable. I once owned a vase. It's a sad story. We kept the old sideboard. It might be useful."],
      bye:"Cheers!", ps:"If you ever need bread, I'm yours. I'm not great with words." },
    THEO_02: { hello:"Hi again!",
      body:["She's here! Wren, six weeks old, very loud, already stealing my heart and my socks. Elena sends a tired thank-you for the living room.",
            "Wren has started rolling across rooms like a small sausage. Our bedroom is last on the list. Restful, please: green and white, sturdy wood, a bed that isn't white, and somewhere for clothes that isn't ‘the chair’. It has become load-bearing. Nothing fragile."],
      bye:"Sleepily yours,", ps:"Rosa has offered to sew Wren a coat. I'm scared of her." },
    THEO_03: { hello:"Hey you,",
      body:["Two bits of news. I'm now co-owner of the bakery (the old owner cried, I cried, the shop cat cried). And we've found a flat with a proper dining room!",
            "I'd love everyone round one table: grandad, aunts, the lot. (Grandad only trusts wood he can knock on.) Living room for naps, dining room for noise, bedroom for six hours of sleep. Bring what still works from the old place. The sideboard followed us. It does that. Same as before: white, green, yellow, blue, solid wood, nothing fragile."],
      bye:"Thank you, again and always,", ps:"Come by at six one morning. The first loaf is yours." },

    ROSA_01: { hello:"My dear,",
      body:["I have retired from thirty-one years in the costume department of the Playhouse and been told to ‘relax’. I have never been less relaxed. My sitting room has been wrong since 1998. (I hear an antiques shop is opening on Church Hill. I intend to be unbearable about it.)",
            "The sideboard stays. Everything else must earn its place: two places to sit, a table, and a lamp with personality. I light a room like a stage: never from just one place. And colour, darling: red, yellow, dark wood and something patterned. What I will not have is a pale room. Not beige. Not ‘greige’."],
      bye:"With great expectations,", ps:"Theo says you're good. He once tried to pay me in sourdough." },
    ROSA_02: { hello:"Darling,",
      body:["I've begun teaching sewing at the village hall, and everyone stays for tea afterwards. ‘Everyone’ is currently six people and one opinionated dachshund.",
            "Pattern is a soloist, not a choir. The dining room needs a proper table, seats for all, and the mood of a stage set before the curtain goes up: red, yellow, dark wood, a touch of gold. My daughter visits at weekends and deserves a proper guest room: a bed, a bedside table, and greens and blues with beige. And no white. It's a home, not a hospital."],
      bye:"Fondly, and with a flourish,", ps:"Mia's dahlias have the whole village talking." },
    ROSA_03: { hello:"Darling,",
      body:["I have done something impulsive. I have bought a little house up on Lantern Lane. Small, bright, slightly crooked, with a kitchen window that looks straight down to the bay. I'm keeping the flat in town; I'm not a monster.",
            "It needs a lighter version of me: a living room for a book and the view, a kitchen with a table for toast with dignity (that window is the whole show), and a bedroom to be rocked to sleep in. Green, blue and beige, light wood, a small touch of yellow. No ducks on the cushions. And not too much dark wood. It's a cabin, not a library in a thriller."],
      bye:"With wet boots already,", ps:"Come for tea when it's done. I've warned the ducks." }
  };
  QUESTS.forEach(function(q){ q.letter = LETTERS[q.id]; });

  /* ---------------------------------------------------------------- rewards */
  // Every job leaves a thank-you gift: pieces that stay locked in story mode
  // until the neighbour gives them to you. Hand in your best work (all 5
  // hearts) and they tuck an extra one into the envelope.
  var REWARDS = {
    MIA_01:   { items:['candle-joerg-off','flowers-sia-white'],                    bonus:['vase-victoria'] },
    MIA_02:   { items:['blanket-basket','painting-flowers-pink'],                  bonus:['lamp-kay-blush'] },
    MIA_03:   { items:['painting-turner-blue','lamp-kay-blue'],                    bonus:['rug-persian-blue'] },
    JULES_01: { items:['paintbrushes-incup-beige','painting-maja'],                bonus:['magazines-stacked-orange'] },
    JULES_02: { items:['lamp-kay-red','cowhide-carrie-cheetah'],                   bonus:['painting-horses-pink'] },
    JULES_03: { items:['vase-lisa-orange','pillows-stacked-orange'],               bonus:['cowhide-carrie-rosa'] },
    SAM_01:   { items:['recordplayer-darkwood','chrome-teecup'],                   bonus:['standmixer-smeggy-chrome'] },
    SAM_02:   { items:['chandelier-ana','chessboard-marble'],                      bonus:['couch-uwe-dark-leather'] },
    SAM_03:   { items:['kitchen-island-serena-steel','couch-uwe-light-leather'],   bonus:['bust-art-dave-stone'] },
    NOOR_01:  { items:['standing-lamp-kai','painting-fog'],                        bonus:['wallshelf-vila'] },
    NOOR_02:  { items:['bust-art-lisa-stone','couchtable-marble-elle-light'],      bonus:['chandelier-kiki'] },
    NOOR_03:  { items:['fireplace-marlo-marble-white','bedsidetable-moppy-marble'],bonus:['chessboard-beige'] },
    THEO_01:  { items:['rug-elena-yellow','globe'],                                bonus:['recordplayer-old-mediumwood'] },
    THEO_02:  { items:['curtain-siri-green','books-leaning-beige'],                bonus:['lamp-hubby'] },
    THEO_03:  { items:['fireplace-milo-stone-beige','couch-hennes-green-long'],    bonus:['fruit-bowl-oranges'] },
    ROSA_01:  { items:['candle-kiki-off','rug-malana-orange-pattern'],             bonus:['lamp-sia-gold'] },
    ROSA_02:  { items:['bust-art-alena-stone','couch-henry-red'],                  bonus:['chandelier-irina'] },
    ROSA_03:  { items:['fireplace-marco-marble-beige','rug-persian-rosa'],         bonus:['vase-blue-china'] }
  };
  var GIFT_OWNER = {};   // item id -> { quest, bonus }
  QUESTS.forEach(function(q){
    var r = REWARDS[q.id]; q.reward = r;
    if (!r) return;
    r.items.forEach(function(id){ GIFT_OWNER[id] = { quest:q.id, bonus:false }; });
    r.bonus.forEach(function(id){ GIFT_OWNER[id] = { quest:q.id, bonus:true }; });
  });
  // the set of gifts earned so far, from the story save's `quests` record
  function giftsEarned(questRecords){
    var out = {};
    QUESTS.forEach(function(q){
      var rec = questRecords && questRecords[q.id];
      if (!rec || !rec.done || !q.reward) return;
      q.reward.items.forEach(function(id){ out[id] = true; });
      if ((rec.best || 0) >= 5) q.reward.bonus.forEach(function(id){ out[id] = true; });
    });
    return out;
  }
  function giftOwner(itemId){ return GIFT_OWNER[itemId] || null; }


  /* ------------------------------------------------------------------ quirks
     Things a neighbour never puts on their list: tastes and no-gos you have to
     pick up from their letter (or learn the first time you hand in a room).
     A quirk, once learned, stays on that neighbour's note for every later job,
     so the first job is the only time you can get it wrong "by surprise".
     Every quirk is hinted at in the letter, and the verdict always names it. */
  var DARK_FURN = ['Black','Dark Wood'];
  var FURN_KINDS = ['couch','armchair','chair','stool','bed','bedside','sidetable','coffeetable','dining','storage','sideboard','bookshelf'];
  var WOODS = ['Light Wood','Medium Wood','Dark Wood','Warm Wood'];
  function Qk(id, who, text, test, lines){ return { id:id, who:who, tier:'quirk', text:text, test:test, praise:lines[0], miss:lines[1] }; }
  var QUIRKS = {
    mia_rug:    Qk('mia_rug','mia','A soft rug underfoot (her toes are always cold)',{kinds:['rug'],min:1,each:true},
                   ["You gave me something soft underfoot. My toes have never been so happy.","The floor was a bit bare for my cold toes. A rug would have been lovely."]),
    mia_cave:   Qk('mia_cave','mia','No dark furniture on a dark rug (it makes a room feel like a cave)',{combo:{a:{kinds:FURN_KINDS,colors:DARK_FURN},b:{kinds:['rug'],colors:['Black','Brown','Dark Wood']}},each:true},
                   ["Light on the floor and no cave in sight. Thank you.","Dark furniture on a dark rug: it felt a little like a cave in there."]),
    mia_table:  Qk('mia_table','mia','A wooden dining table (like Alex\'s grandmother\'s)',{kinds:['dining'],materials:['Wood'],min:1},
                   ["A real wooden table. Alex ran a hand over it and went quiet.","Alex was hoping for a proper wooden table, like his grandmother's."]),
    jules_pair: Qk('jules_pair','jules','Blue and orange together',{pair:[{colors:['Blue']},{colors:['Orange']}]},
                   ["Blue AND orange. You've seen my soul.","Blue and orange belong together. One of them was missing."]),
    jules_plant:Qk('jules_plant','jules','A plant for company (the fern is called Gerald)',{kinds:['plant'],min:1},
                   ["Gerald has a friend now. He's thrilled.","Nothing green to talk to. Gerald would have liked a friend."]),
    jules_mix:  Qk('jules_mix','jules','A living room with at least three colours (no waiting-room beige)',{minDistinct:3,room:'living'},
                   ["Three colours in the living room and not one dentist in sight.","The living room is a bit too tidy-minded. Two colours is a waiting room."]),
    sam_metals: Qk('sam_metals','sam','Metals that match: no brass or gold next to chrome and steel',{metals:true,each:true},
                   ["Everything gleams in the same key. Bliss.","Brass beside chrome. I had to sit down."]),
    sam_woods:  Qk('sam_woods','sam','One tone of wood per room',{maxDistinct:1,colors:WOODS,each:true},
                   ["One wood, one mood. That's discipline.","Three woods in a room. It's a lumberyard, darling."]),
    sam_robin:  Qk('sam_robin','sam','A restful bedroom: nothing black or dark wood (Robin sleeps lightly)',{colors:DARK_FURN,max:0,room:'bedroom'},
                   ["Robin slept for nine hours. Nine!","The bedroom has something dark in it. Robin sleeps lightly."]),
    noor_wood:  Qk('noor_wood','noor','Only one tone of wood in a room (the grain should match)',{maxDistinct:1,colors:WOODS,each:true},
                   ["The grain matches. I noticed within a second.","Two wood tones in one room. I'm not angry, only precise."]),
    noor_metal: Qk('noor_metal','noor','No mixing of warm and cool metals',{metals:true,each:true},
                   ["Cool metals only. Nobody argued.","Chrome beside brass is a family argument."]),
    noor_lamp:  Qk('noor_lamp','noor','Exactly one lamp in the quiet room',{kinds:['lamp'],min:1,max:1,room:'study'},
                   ["One lamp. One good thought at a time.","The quiet room needs one lamp. Not none, not three."]),
    theo_colours:Qk('theo_colours','theo','Blue and yellow together (their colours)',{pair:[{colors:['Yellow','Orange']},{colors:['Blue']}]},
                   ["Blue and yellow, like the shop sign. Elena cried a bit.","Elena calls blue and yellow 'our colours'. One was missing."]),
    theo_roll:  Qk('theo_roll','theo','A soft rug in the bedroom (Wren has started rolling)',{kinds:['rug'],min:1,room:'bedroom'},
                   ["A soft rug for the sausage. She approved.","Wren has started rolling around. A rug in the bedroom would have helped."]),
    theo_knock: Qk('theo_knock','theo','A wooden dining table (grandad only trusts wood he can knock on)',{kinds:['dining'],materials:['Wood'],min:1},
                   ["Grandad knocked on it twice. That's his highest praise.","Grandad only trusts wood he can knock on."]),
    rosa_lights:Qk('rosa_lights','rosa','At least two light sources (she lights a room like a stage)',{kinds:['lamp'],min:2},
                   ["Two lights at different heights. Now it has a stage.","One light source, darling. A room should be lit from more than one place."]),
    rosa_solo:  Qk('rosa_solo','rosa','Only one pattern per room (a soloist, not a choir)',{kinds:['patterned'],max:1,each:true},
                   ["One pattern, beautifully placed. A soloist.","Two patterns in one room is a choir with no conductor."]),
    rosa_window:Qk('rosa_window','rosa','Nothing in front of the cabin window (no curtains in the kitchen)',{kinds:['curtain'],max:0,room:'kitchen'},
                   ["The window gets to be the show. Bravo.","I wanted the window left bare. It's the whole show."])
  };
  var QUEST_QUIRKS = {
    MIA_01:['mia_rug'], MIA_02:['mia_rug','mia_cave'], MIA_03:['mia_rug','mia_cave','mia_table'],
    JULES_01:['jules_pair'], JULES_02:['jules_pair','jules_plant'], JULES_03:['jules_pair','jules_plant','jules_mix'],
    SAM_01:['sam_metals'], SAM_02:['sam_metals','sam_woods'], SAM_03:['sam_metals','sam_woods','sam_robin'],
    NOOR_01:['noor_wood'], NOOR_02:['noor_wood','noor_metal'], NOOR_03:['noor_wood','noor_metal','noor_lamp'],
    THEO_01:['theo_colours'], THEO_02:['theo_colours','theo_roll'], THEO_03:['theo_colours','theo_roll','theo_knock'],
    ROSA_01:['rosa_lights'], ROSA_02:['rosa_lights','rosa_solo'], ROSA_03:['rosa_lights','rosa_solo','rosa_window']
  };
  QUESTS.forEach(function(q){ q.quirks = (QUEST_QUIRKS[q.id] || []).map(function(id){ return QUIRKS[id]; }); });

  /* ---- indexing & unlock rules ---- */
  var QUEST_BY_ID = {};
  QUESTS.forEach(function(q){ QUEST_BY_ID[q.id] = q; });
  function questById(id){ return QUEST_BY_ID[id] || null; }
  function questsOf(charId){ return QUESTS.filter(function(q){ return q.char === charId; }); }
  // a quest's letter is available when every required quest is done and
  // the renown threshold is met
  function isUnlocked(q, doneMap, renownPoints){
    if (q.minRenown && renownPoints < q.minRenown) return false;
    for (var i = 0; i < q.requires.length; i++) if (!doneMap[q.requires[i]]) return false;
    return true;
  }

  /* ===================================================================== time
     The story has a calendar. Day 0 is the date in TOWN.calendar. Every job has
     a `day`; the town's "today" is the day of the latest job you've finished,
     so time passes as you help your neighbours. Seasons follow the date, which
     is how a spring / autumn / winter map can slot in later (TOWN.seasonMaps). */
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function dateOf(day){
    var c = TOWN.calendar, d = new Date(Date.UTC(c.year, c.month, c.day + Math.max(0, Math.round(day || 0))));
    var wd = d.getUTCDay(), m = d.getUTCMonth(), dd = d.getUTCDate();
    return { day:day, y:d.getUTCFullYear(), m:m, d:dd, wd:wd, monthName:MONTHS[m], weekday:WEEKDAYS[wd],
             short: WEEKDAYS[wd].slice(0, 3) + ' ' + dd + ' ' + MONTHS[m].slice(0, 3),
             label: WEEKDAYS[wd] + ' ' + dd + ' ' + MONTHS[m],
             daysInMonth: new Date(Date.UTC(d.getUTCFullYear(), m + 1, 0)).getUTCDate() };
  }
  function seasonOf(day){
    var m = dateOf(day).m;
    return (m === 11 || m <= 1) ? 'winter' : (m <= 4 ? 'spring' : (m <= 7 ? 'summer' : 'autumn'));
  }
  // the calendar only counts in months: "Late July"
  function monthOf(day){
    var d = dateOf(day), part = d.d <= 10 ? 'Early' : (d.d <= 20 ? 'Mid' : 'Late');
    return { m:d.m, y:d.y, name:d.monthName, part:part, label:part + ' ' + d.monthName, short:d.monthName.slice(0, 3), year:d.y, key:d.y * 12 + d.m };
  }
  // the day of the story that was reached by the jobs finished so far
  function todayOf(doneMap, renownPts){
    var t = 0;
    QUESTS.forEach(function(q){ if (doneMap && doneMap[q.id] && q.day > t) t = q.day; });
    // the town never moves past a job that is open and still waiting for you
    var rp = renownPts == null ? 999999 : renownPts;
    QUESTS.forEach(function(q){
      if (!(doneMap && doneMap[q.id]) && q.day < t && isUnlocked(q, doneMap || {}, rp)) t = q.day;
    });
    return t;
  }

  /* ----------------------------------------------------------- places & happenings */
  // Little places that appear on the map as the story goes on. Shops stay for
  // good. Happenings are on for `len` days from `day`. (You can't buy anything
  // in the shops yet — the shop cards say "coming soon".)
  var SPOTS = [
    { id:'flowers',  kind:'shop', icon:'flower',  name:'Fennel & Fern',          x:54.3, y:54.3, day:58,
      blurb:"A striped awning, buckets of dahlias and a very serious cat called Parsley.", soon:"Soon you'll be able to buy fresh flowers here." },
    { id:'antiques', kind:'shop', icon:'urn',     name:'Marigold & Moss Antiques', x:26.3, y:69.5, day:106,
      blurb:"In the pink house with the porch, where the old Church Hill families send their attics. Chairs with stories, lamps with opinions, most of it very heavy.", soon:"Soon you'll be able to hunt for one-off pieces here." },
    { id:'books',    kind:'shop', icon:'book',    name:'The Dog-Eared Bookshop',   x:27.0, y:22.0, day:236,
      blurb:"A crooked little shop on Orchard Rise with a ladder on rails, a sleeping dog and a very good children's corner.", soon:"Soon you'll be able to browse the shelves here." },
    { id:'gallery',  kind:'shop', icon:'frame',   name:'The Paper Moth Gallery',   x:95.2, y:40.5, day:322,
      blurb:"Small prints, big frames, and a free glass of something fizzy on opening night.", soon:"Soon you'll be able to buy art for your rooms here." },
    { id:'bakery',   kind:'shop', icon:'loaf',    name:'Crumb & Crown Bakery',     x:41.5, y:56.5, day:140,
      blurb:"Open at seven, sold out by eleven. The old baker is handing Theo every recipe he owns, one loaf at a time. A shop cat supervises.", soon:"Soon you'll be able to buy a warm loaf here." },

    { id:'fleamarket', kind:'happening', icon:'flag', name:'Flea Market on Orchard Green', x:46.0, y:19.5, day:40, len:8,
      blurb:"Tables of teapots, brass bells and one suspiciously large clock. Bring a bag." },
    { id:'regatta',  kind:'happening', icon:'sail',   name:'Summer Regatta',   x:61.5, y:87.0, day:52, len:9,
      blurb:"Sails, bunting and a prize for the most dramatic wobble." },
    { id:'lantern',  kind:'happening', icon:'lantern', name:'Lantern Night',       x:47.0, y:26.0, day:90, len:8,
      blurb:"Paper lanterns along the lane, hot chocolate, and a lane-side neighbour who ‘didn't plan any of this’." },
    { id:'harvest',  kind:'happening', icon:'flag',   name:'Harvest Market',      x:49.0, y:56.0, day:118, len:10,
      blurb:"Pumpkins, chutneys and a jam stall with a queue. Old Town smells of cinnamon." },
    { id:'lights',   kind:'happening', icon:'lantern', name:'Winter Lights',       x:30.0, y:63.0, day:200, len:16,
      blurb:"Every window on Church Hill gets a candle. The steeple gets a star." },
    { id:'streetparty', kind:'happening', icon:'flag', name:'Canal Row Street Party', x:61.0, y:70.0, day:8, len:5,
      blurb:"Trestle tables across the cobbles, one very loud speaker and a neighbour who brought a whole ham." },
    { id:'bonfire',  kind:'happening', icon:'lantern', name:'Midsummer Bonfire',   x:5.5, y:88.5, day:19, len:4,
      blurb:"On the beach below Church Hill. Marshmallows, guitar, and someone's grandad telling the same story." },
    { id:'kites',    kind:'happening', icon:'sail',   name:'Kite Day on Glimmer Bay', x:85.5, y:25.0, day:82, len:6,
      blurb:"Kites over the water from the Glass Row quay. Three are still stuck in the clock tower." },
    { id:'appleday', kind:'happening', icon:'flag',   name:'Apple Day on Orchard Green', x:46.0, y:19.5, day:98, len:6,
      blurb:"Every garden brings its one stubborn apple tree's apples. There is a competition. There is always a competition." },
    { id:'bakesale', kind:'happening', icon:'bell',   name:'Bake Sale at the White Church', x:31.5, y:55.5, day:136, len:5,
      blurb:"Lemon loaf, cinnamon buns and a queue that goes round the steeple." },
    { id:'openstudio', kind:'happening', icon:'frame', name:'Open Studio at the Mills', x:85.0, y:62.0, day:226, len:6,
      blurb:"Doors open all along the loft stairwells. Paint, prints, tea and a cake that was definitely baked by someone else." },
    { id:'tulips',   kind:'happening', icon:'flower', name:'Tulip Day at Fennel & Fern', x:54.3, y:52.0, day:285, len:6,
      blurb:"A bucket of tulips outside for everyone, free. Parsley supervises the queue." },
    { id:'eggs',     kind:'happening', icon:'flag',   name:'Egg Hunt on Orchard Green', x:46.0, y:19.5, day:314, len:4,
      blurb:"Chocolate eggs in the hedges and one very suspicious dachshund." },
    { id:'soupswap', kind:'happening', icon:'bell', name:'Soup Swap on Church Hill', x:29.5, y:60.0, day:165, len:5,
      blurb:"Bring a pot, leave with a different pot. Forty ladles and a very opinionated dachshund." },
    { id:'wedding',  kind:'happening', icon:'bell',   name:"Priya & Dev's Wedding", x:33.0, y:54.0, day:296, len:33,
      blurb:"Saturday 25 April, two o'clock, at the white church. The whole street is invited." },
    { id:'springmarket', kind:'happening', icon:'flag', name:'Spring Flea Market', x:46.0, y:19.5, day:334, len:9,
      blurb:"Back by popular demand. Seedlings, bunting and the large clock, still unsold." }
  ];
  var SPOT_BY_ID = {};
  SPOTS.forEach(function(s){ SPOT_BY_ID[s.id] = s; s.district = (districtAt(s.x, s.y) || {}).id || null; });
  // `jump` = {from,to}: the stretch of town time your last finished job covered. Anything that
  // came up during that stretch is still "on" until the next job moves time along again, so
  // a happening is never over before you've had a chance to see it.
  function spotsAt(today, doneMap, jump){
    return SPOTS.filter(function(s){
      if (s.needs && !(doneMap && doneMap[s.needs])) return false;
      var from = s.day || 0;
      if (today < from) return false;
      if (!s.len || today < from + s.len) return true;
      return !!(jump && from > jump.from && from <= jump.to);
    });
  }

  /* ----------------------------------------------------------------- events */
  // Event cards pop up when the story reaches their day (or when a job is done).
  // kinds: shop | happening | invite | birth | home
  var EVENTS = [
    { id:'e_street', react:[['mia',"Right outside my window. I'm bringing a tray of cookies, obviously."],['jules',"I'll draw the whole street. Please hold still."]], day:8, kind:'happening', spot:'streetparty', title:'Street Party on Canal Row',
      lines:["Trestle tables across the cobbles, bunting from window to window and one very loud speaker.","Bring a chair. Bring a dish. Do not bring the ham; someone already has."], tease:"Street party on Canal Row" },
    { id:'e_bonfire', react:[['jules',"Sparks and charcoal. I may sketch with a burnt stick."],['mia',"Marshmallows. Maybe I'll even stay past nine."],['sam',"I brought the sausages. I'm not saying I organised it."]], day:19, kind:'happening', spot:'bonfire', title:'Midsummer Bonfire on the Beach',
      lines:["The longest day ends with a fire on the sand below Church Hill.","Marshmallows, a guitar and somebody's grandad telling the same story."], tease:"Midsummer bonfire on the beach" },
    { id:'e_kites', react:[['jules',"A kite in blue and orange. Obviously."],['theo',"I built three frames. Don't tell Elena."],['sam',"I'm not flying a kite. I'm supervising one."]], day:82, kind:'happening', spot:'kites', title:'Kite Day on Glimmer Bay',
      lines:["Kites from the Glass Row quay, high over the water, and the bay glittering below them.","Three kites are, as of Sunday, in the clock tower."], tease:"Kite Day on Glimmer Bay" },
    { id:'e_apple', react:[['mia',"An apple tart. Perhaps three. For the competition, obviously."],['rosa',"Autumn. At last, a season with proper colours."],['theo',"Our tree's apples are tiny. I'm entering them anyway."]], day:98, kind:'happening', spot:'appleday', title:'Apple Day on Orchard Green',
      lines:["Every garden on the Rise brings the apples of its one stubborn tree. There is a competition.","There is always a competition."], tease:"Apple Day on Orchard Green" },
    { id:'e_bake', react:[['mia',"I'm baking two lemon loaves. One for the sale, one for emergencies."],['rosa',"I'll judge the buns. Gently. Mostly."],['noor',"I'll buy a loaf. And measure the queue."]], day:136, kind:'happening', spot:'bakesale', title:'Bake Sale at the White Church',
      lines:["Lemon loaf, cinnamon buns and a queue that goes round the steeple.","The money goes to the new church roof. The buns go to everyone."], tease:"Bake sale at the white church" },
    { id:'e_studio', react:[['mia',"I baked the cake. Jules asked very nicely. Several times."],['noor',"I'll come. I'll admire. I'll say nothing about the staircase."],['rosa',"I'll bring a shawl, in case someone needs a costume."]], day:226, kind:'happening', spot:'openstudio', title:'Open Studio at the Mills',
      lines:["Doors open all along the loft stairwells: paint, prints, tea and a very large dog.","The cake was definitely baked by someone else."], tease:"Open Studio at the Mills" },
    { id:'e_tulips', react:[['mia',"Tulips! For the bedroom, the table, and possibly my hair."],['jules',"Yellow ones. For the easel. Obviously."],['sam',"I walked past. Twice. I didn't take one. (I took one.)"]], day:285, kind:'happening', spot:'tulips', title:'Tulip Day at Fennel & Fern',
      lines:["A bucket of tulips outside the shop for anyone who wants one, free.","Parsley supervises the queue and judges your choice."], tease:"Tulip Day at Fennel & Fern" },
    { id:'e_eggs', react:[['theo',"Wren is too small for eggs. I'm hiding them anyway."],['mia',"I'll bake an egg-shaped cake. Don't judge me."],['rosa',"Costumes for the little ones: bunny ears, whiskers, the lot."]], day:314, kind:'happening', spot:'eggs', title:'Egg Hunt on Orchard Green',
      lines:["Chocolate eggs in the hedges and one very suspicious dachshund.","Under-sevens first, then everybody."], tease:"Egg hunt on Orchard Green" },
    { id:'e_books', react:[['noor',"A ladder on rails. I'd like the exact measurements, please."],['mia',"Fantasy shelf: thirty minutes. Cosy mysteries: the rest of my life."],['rosa',"Costume history on the second shelf, I hope. I'll check."],['jules',"Picture books! I'm going to be a nuisance in the children's corner."]], day:236, kind:'shop', spot:'books', title:'A bookshop on Orchard Rise',
      lines:["The Dog-Eared Bookshop has opened in the crooked house on the lane: a ladder on rails, a sleeping dog and a very good children's corner.","The dog is not for sale. People have asked."] },
    { id:'e_flowers', react:[['mia',"Dahlias on my street! Parsley already knows my name."],['jules',"Orange ones, for the easel. Obviously."],['sam',"Flowers. How lovely. I'll walk the long way round."]], day:58, kind:'shop', spot:'flowers', title:'A florist has opened on Canal Row',
      lines:["Fennel & Fern has put out its striped awning and a hundred buckets of dahlias.","Parsley the shop cat is in charge of the till. Mia was seen outside before it opened. Obviously."] },
    { id:'e_flea', react:[['jules',"A teapot, a clock and nothing I needed. Perfect."],['mia',"I'm bringing a tin of lemon cookies. For research."],['sam',"Fourteen stalls and not one with a proper sign. I'm only offering to help."]], day:40, kind:'happening', spot:'fleamarket', title:'Flea Market on Orchard Green',
      lines:["Saturday morning, long tables, hand-painted signs: teapots, brass bells, a very large clock.","Bring a bag. Haggle politely."], tease:"Flea market on Orchard Green" },
    { id:'e_regatta', react:[['sam',"A prize for the most dramatic wobble? I've entered myself."],['theo',"Lovely boats. I'd have put gears on them."],['mia',"I'll wave from the harbour wall. And bake for the winners."]], day:52, kind:'happening', spot:'regatta', title:'Summer Regatta at the Harbour',
      lines:["Bunting on every mast and a prize for the most dramatic wobble.","The harbour master has been practising his ‘ahoy’."], tease:"Summer Regatta at the Harbour" },
    { id:'e_antiques', react:[['rosa',"Chairs with stories! At last, a shop that talks my language."],['noor',"I admire a chair from the doorway. It is two centimetres too wide."],['theo',"‘One of a kind’? Elena says I may look, not buy."],['jules',"A whole shop of things to draw. Send snacks."]], day:106, kind:'shop', spot:'antiques', title:'Antiques on Church Hill',
      lines:["Marigold & Moss has opened in the pink house with the porch on Church Hill, where the old families send their attics.","Everything is ‘one of a kind’. Most of it is very heavy."] },
    { id:'e_lantern', react:[['theo',"Hot chocolate at our cabin. Elena says we're hosting. News to me."],['mia',"I'm baking for the whole lane. Possibly twice."],['rosa',"Candlelight in the trees. I shall wear the green shawl."]], day:90, kind:'happening', spot:'lantern', title:'Lantern Night on Lantern Lane',
      lines:["Paper lanterns line the lane at dusk and little candle boats are set afloat in the bay. Hot chocolate by the cabins.","Bring a jumper; the evenings get cold fast."], tease:"Lantern Night on Lantern Lane" },
    { id:'e_harvest', react:[['rosa',"Yellow everywhere. Autumn finally agrees with me."],['mia',"I'm entering the pumpkin loaf. Quietly."],['sam',"I'm not catering. I'm advising. Loudly."]], day:118, kind:'happening', spot:'harvest', title:'Harvest Market in Old Town',
      lines:["Pumpkins, chutneys and a jam stall with an actual queue.","The first red leaf landed on the clock tower on Tuesday. The market is its reward."], tease:"Harvest Market in Old Town" },
    { id:'e_gallery', react:[['jules',"A GALLERY. I've already measured the wall. Just in case."],['noor',"Red brick, green door. The proportions are correct."],['rosa',"Someone will finally hang something with courage."],['mia',"Small prints for the bedroom. Yes, please."]], day:322, kind:'shop', spot:'gallery', title:'A gallery on the Far Shore',
      lines:["The Paper Moth has opened in the red-brick house across the water: small prints, big frames, a very quiet owner.","Opening night: a free glass of something fizzy."] },
    { id:'e_bakery', react:[['theo',"I have flour on the ceiling. Elena says it suits me."],['mia',"A real bakery on the corner! I may have to stop baking. (I won't.)"],['sam',"Bread for the flat, finally. I'm there at seven."],['noor',"I will come at eight, when the queue is orderly."]], day:140, kind:'shop', spot:'bakery', title:'A bakery has opened in Old Town',
      lines:["Crumb & Crown has lit its ovens on the corner by the clock tower. Open at seven, sold out by eleven.","The old baker is teaching Theo the recipes. The shop cat supervises both of them."] },
    { id:'e_soup', react:[['mia',"Pumpkin and lemon soup. Don't ask. Do taste."],['rosa',"I'll bring a ladle and an opinion."],['noor',"A pot with a lid that fits. I check."]], day:165, kind:'happening', spot:'soupswap', title:'Soup Swap on Church Hill',
      lines:["Bring a pot of something hot, leave with someone else's pot of something hot.","Forty ladles, six leeks and a very opinionated dachshund."], tease:"Soup swap on Church Hill" },
    { id:'e_lights', react:[['sam',"I may have helped with the star. Only a little. Robin held the ladder."],['rosa',"I'm sewing little cloaks for the lantern children."],['mia',"Soup. I'm bringing soup. And bread."]], day:200, kind:'happening', spot:'lights', title:'Winter Lights on Church Hill',
      lines:["Every window gets a candle. The steeple gets a star.","Neighbours bring soup, and a surprising amount of tinsel."], tease:"Winter Lights on Church Hill" },
    { id:'e_birth', react:[['rosa',"Coat measured, cut and basted. She won't escape it."],['mia',"A lemon loaf is on its way. And no vases."],['jules',"I drew her a tiny heron in a tiny raincoat."]], day:258, kind:'birth', from:'theo', title:'Wren has arrived!',
      lines:["Wren, born on a very rainy morning, a few weeks before she was due. Loud, tiny, and already in charge.","Theo and Elena say thank you for the living room, and ask for no vases."], sign:'Theo, Elena & Wren' },
    { id:'e_wedding', react:[['rosa',"I'm making the veil. Don't tell Priya."],['sam',"I offered to produce it. I've been told to stand quietly."],['noor',"I'll bring a gift and an opinion on the pews."]], day:296, kind:'invite', spot:'wedding', from:'mia', title:'You are invited',
      names:'Priya & Dev', lines:["are getting married.","Saturday 25 April · Two o'clock · The white church on Church Hill","Cake to follow. Tea to follow cake. Dancing to follow tea."],
      sign:'Please say yes. There is a lemon loaf.', tease:"Priya & Dev's wedding" },
    { id:'e_spring', react:[['theo',"Bread for the kids' stall. The shop cat will supervise."],['jules',"I'm selling prints. Next to the clock. Nobody buy the clock."],['mia',"Seedlings for the windowsill! Mine are already named."]], day:334, kind:'happening', spot:'springmarket', title:'The flea market is back',
      lines:["Seedlings, bunting and the very large clock, still unsold.","Spring on Orchard Green."], tease:"Spring Flea Market" },

    // moves: these arrive when the matching job is finished
    { id:'h_mia', react:[['rosa',"A tablecloth, darling. She's grown up."],['jules',"I'm bringing a painting. Don't say no."],['sam',"A table that seats six? I can work with that."]], after:'MIA_03', kind:'home', who:'mia', home:'MIA_HOME_B', title:'Mia & Alex have moved in!',
      lines:["Keys in, boxes unpacked (mostly), a dining table with an actual tablecloth.","Mia's first flat on Canal Row is quiet now. The new place is on Church Hill."] },
    { id:'h_jules', react:[['mia',"Cake is in the oven. It's lemon. It's always lemon."],['noor',"I looked at the staircase. It is four millimetres off. I love it."],['rosa',"A door that closes. Finally, an artist with sense."]], after:'JULES_03', kind:'home', who:'jules', home:'JULES_HOME_B', title:'Jules has moved upstairs',
      lines:["Same mill, one staircase higher: a loft with a door that closes and a room just for paint.","The Open Studio is next Saturday. There will be cake. (Mia is baking it.)"] },
    { id:'h_sam', react:[['noor',"A dish rack and a big kitchen. A good start."],['mia',"I'll bring bread. Sam will bring opinions."],['rosa',"Red and leather? He listens, that one."]], after:'SAM_03', kind:'home', who:'sam', home:'SAM_HOME_B', title:'Sam & Robin bought a home',
      lines:["Their first place together, in Old Town, with a dish rack and a very big kitchen.","The oven is, we are told, ‘on its way’."] },
    { id:'h_noor', react:[['sam',"A ceiling for a kite! I'll bring a ladder. And wine."],['jules',"I'm making her a very small, very square drawing."],['theo',"Up that many stairs? I'll bring the bread. Warm."]], after:'NOOR_03', kind:'home', who:'noor', home:'NOOR_HOME_B', title:'Noor bought the top floor',
      lines:["Same tower, a few floors higher: tall windows, a ceiling you could lose a kite in.","No desk. She was very clear."] },
    { id:'h_theo', react:[['rosa',"A dining room for grandad and the aunts. Wonderful."],['mia',"I'm baking for the housewarming. Obviously."],['noor',"A sideboard that follows them. I respect that."]], after:'THEO_03', kind:'home', who:'theo', home:'THEO_HOME_B', title:'Theo & Elena have a family flat',
      lines:["A proper dining room on Orchard Rise, with space for grandad, the aunts and the sideboard.","Theo is now co-owner of Crumb & Crown, too."] },
    { id:'h_rosa', react:[['theo',"A neighbour up the lane! I'll bring bread. And Wren."],['mia',"Tea with a view of the bay. I'm bringing the lemon loaf."],['jules',"Ducks on the cushions? I can draw some. Don't tell her."]], after:'ROSA_03', kind:'home', who:'rosa', home:'ROSA_CABIN_A', second:true, title:'Rosa has bought a cabin',
      lines:["A little house on Lantern Lane, with a kitchen window that looks straight down to the bay.","She is keeping her flat in town. ‘I am not a monster, darling.’"] }
  ];
  var EVENT_BY_ID = {};
  EVENTS.forEach(function(e){
    EVENT_BY_ID[e.id] = e;
    if (e.after){ e.day = (QUEST_BY_ID_EARLY(e.after) || {}).day || 0; }
  });
  function QUEST_BY_ID_EARLY(id){ for (var i = 0; i < QUESTS.length; i++) if (QUESTS[i].id === id) return QUESTS[i]; return null; }
  // events that are due: their day has come (or their job is done) and they haven't been shown
  function eventsDue(today, doneMap, seen){
    var s = {}; (seen || []).forEach(function(id){ s[id] = true; });
    return EVENTS.filter(function(e){
      if (s[e.id]) return false;
      return e.after ? !!(doneMap && doneMap[e.after]) : e.day <= today;
    }).sort(function(a, b){ return a.day - b.day; });
  }
  // what's coming up in the next few weeks (for the calendar)
  function upcoming(today, doneMap, horizon){
    return EVENTS.filter(function(e){ return !e.after && e.tease && e.day > today && e.day <= today + (horizon || 45); })
      .sort(function(a, b){ return a.day - b.day; });
  }
  // what already happened, for the calendar's month view
  function pastEvents(today, doneMap){
    return EVENTS.filter(function(e){ return e.after ? !!(doneMap && doneMap[e.after]) : e.day <= today; });
  }

  /* ------------------------------------------------------------- newspaper */
  // "The Cove Courier": an issue appears once the story reaches its day.
  var NEWS = [
    { day:0, lead:{ h:"Pennywhistle Cove Wakes Up Slowly", t:"The first ferry leaves at seven, the clock tower runs four minutes fast, and nobody minds. New neighbours are arriving all week, say the removal vans." },
      items:[ {h:"Pigeon census", t:"Up by twelve. The council blames the ferry café."}, {h:"Lost", t:"One blue umbrella. Reward: a lemon cookie."} ],
      notice:"WANTED: someone who is good with rooms. Apply anywhere in the Cove." },
    { day:29, lead:{ h:"Midsummer Bonfire Lit on Time", t:"The bonfire on the beach below Church Hill was lit exactly on time and put out slightly late. The marshmallow shortage is being investigated.", spot:'bonfire' },
      items:[ {h:"Street party", t:"Canal Row ate for six hours. The ham has still not been identified."}, {h:"Dinner parties", t:"A flat in Glass Row now seats eleven. The neighbours are ‘delighted, mostly’."} ],
      notice:"WANTED: a second oven, gently used. Ask at the harbour café." },
    { day:60, lead:{ h:"A Florist for Canal Row", t:"Fennel & Fern has put up its striped awning with a hundred buckets of dahlias and one cat. Early customers described the queue as ‘polite but hungry for tulips’.", spot:'flowers' },
      items:[ {h:"Flea Market", t:"By ten o'clock on Saturday there wasn't a teapot left on Orchard Green. One shopper went home with a grandfather clock and no plan."}, {h:"Regatta results", t:"First place: the boat that stayed upright. Second: a very wobbly one."} ],
      notice:"OPEN MIC Thursday at the harbour café. Bring a song, or a snack." },
    { day:91, lead:{ h:"Kites Over Glimmer Bay", t:"The bay was full of kites on Sunday, launched from the Glass Row quay. Three are still in the clock tower. The Courier has asked, politely, for them back.", spot:'kites' },
      items:[ {h:"Lantern Night", t:"Paper lanterns, hot chocolate, and a lane-side neighbour who ‘didn't plan any of this’."}, {h:"Weather", t:"Hottest week on record. The canal ducks are reported to be ‘sulking’."} ],
      notice:"LOST: one cat, answers to ‘Parsley’. Does not answer." },
    { day:121, lead:{ h:"Antiques Arrive on Church Hill", t:"Marigold & Moss has opened in the pink porch house on Church Hill. Every item is ‘one of a kind’ and most are extremely heavy. Browsers are advised to bring a friend.", spot:'antiques' },
      items:[ {h:"Autumn arrives, tidily", t:"The first red leaf landed on the clock tower on Tuesday. The Courier asks the others to follow in an orderly fashion."}, {h:"Apple Day", t:"The competition was won, as usual, by a very small apple and a very large opinion."} ],
      notice:"SOUP SWAP in November, Church Hill. Bring a ladle." },
    { day:152, lead:{ h:"Fresh Bread on the Corner", t:"Crumb & Crown has lit its ovens by the clock tower. It opens at seven and sells out by eleven. The old baker is teaching his young apprentice everything, and the shop cat supervises both.", spot:'bakery' },
      items:[ {h:"Harvest Market", t:"The jam stall queue stretched all the way to the clock tower on Saturday. A new record, and a very sticky one."}, {h:"Bake sale", t:"The church roof is two buns away from a new tile."} ],
      notice:"EXTRA FERRY on Saturdays. It will be late, as always." },
    { day:182, lead:{ h:"Forty Ladles on Church Hill", t:"The Soup Swap went ahead in a light drizzle: forty ladles, six leeks and one very opinionated dachshund. Nobody went home with their own pot.", spot:'soupswap' },
      items:[ {h:"Sewing classes", t:"Full. The waiting list is now one dachshund."}, {h:"First frost", t:"The canal has a thin glass lid. The ducks are unbothered."} ],
      notice:"LOST: one mitten, red. Possibly on the clock tower." },
    { day:213, lead:{ h:"The Year in Review", t:"Looking back: a florist, an antiques shop, a bakery, two markets and a great many casseroles. The Cove has had a busy seven months, and a very good season for cake.", },
      items:[ {h:"Winter Lights", t:"Every window on Church Hill had a candle and the steeple had a star. Soup was provided by anyone with a pot."}, {h:"New Year's swim", t:"Cancelled due to common sense."}, {h:"Resolutions", t:"The bakery reports a 300% rise in ‘just one more’."} ],
      notice:"THANK YOU to whoever left soup on the clock tower steps." },
    { day:244, lead:{ h:"A Bookshop on the Rise", t:"The Dog-Eared Bookshop has opened on Orchard Rise with a ladder on rails and a dog on the doormat. The dog has been asked to sign copies.", spot:'books' },
      items:[ {h:"Snow day", t:"School is closed, the bakery is open, and the ducks are furious. Chimneys all over town are smoking happily, the cabins on Lantern Lane most of all."}, {h:"Open Studio", t:"Half the Mills opened their doors, and the stairwells hummed. The cake was Mia's."}, {h:"Sledges", t:"The hill behind the church is officially ‘fast’. Crumb & Crown sold hot buns from the top of it."} ],
      notice:"FOUND: one sledge. Not yours. Very good sledge." },
    { day:272, lead:{ h:"Thaw!", t:"The first crocus appeared on Orchard Rise this morning, to cheers from a cat. The canal has un-frozen. The ducks have forgiven everyone.", },
      items:[ {h:"A new arrival", t:"Wren, 3.1 kilos, a little early and entirely loud. Mother, father and the shop cat are doing well."}, {h:"Ferry", t:"Back on schedule. Almost."} ],
      notice:"SEEDLINGS free outside Fennel & Fern, Saturday." },
    { day:303, lead:{ h:"A Wedding Invitation Goes Round Town", t:"Priya (of the vet practice) and Dev will marry at the white church on Saturday 25 April, and the whole street is invited. The bakery has been warned about the cake.", spot:'wedding' },
      items:[ {h:"Tulip Day", t:"Parsley judged every bucket. Six people left with tulips and a smaller ego."}, {h:"Egg hunt", t:"Orchard Green, soon. Under-sevens first, dachshund last."} ],
      notice:"CONFETTI: biodegradable, please." },
    { day:333, lead:{ h:"Wedding Bells (and One Dropped Cake)", t:"The church was full, the sun came out for the vows, and the three-tier lemon cake survived all but one corner. The veil, sewn by retired costume-maker Rosa, got more applause than the cake. Priya and Dev left in a rowing boat hung with tin cans.", },
      items:[ {h:"Art across the water", t:"The Paper Moth Gallery has opened on the Far Shore, in the red-brick house with the green door. Prints are small, frames are big, the owner is shy.", spot:'gallery'}, {h:"Dancing", t:"Went on until the ducks complained."}, {h:"Flowers", t:"The church smelled of peonies. Fennel & Fern sold out."} ],
      notice:"THANK YOU to everyone who stayed to wash up." },
    { day:364, lead:{ h:"A Whole Year in the Cove", t:"A year ago the removal vans started arriving. Today the clock tower is still four minutes fast, the harbour is full of sails, and the neighbours know whose umbrella is whose.", },
      items:[ {h:"Midsummer", t:"The bonfire is back on the calendar. Please bring your own marshmallows."}, {h:"Lantern Lane", t:"Cabin windows are open again. The ducks on the bay have been told."} ],
      notice:"WANTED (again): someone who is good with rooms. You know who you are." }
  ];
  function issuesAt(today){
    var list = NEWS.map(function(n, i){ n.no = i + 1; return n; });
    return list.filter(function(n){ return n.day <= today; }).sort(function(a, b){ return b.day - a.day; });
  }

  /* -------------------------------------------------------------- scoring */
  function matchesTest(test, asset){
    if (test.kinds){
      var any = false;
      for (var i = 0; i < test.kinds.length; i++) if (isKind(test.kinds[i], asset)){ any = true; break; }
      if (!any) return false;
    }
    if (test.colors && test.colors.indexOf(asset.color) === -1) return false;
    if (test.materials && test.materials.indexOf(asset.material) === -1) return false;
    if (test.ids && test.ids.indexOf(asset.id) === -1) return false;
    return true;
  }
  function roleSatisfied(roleId, entries){
    var role = ROLES[roleId];
    if (!role) return { ok:false, missing:[] };
    var missing = [];
    role.needs.forEach(function(n){
      var c = 0;
      entries.forEach(function(e){
        for (var i = 0; i < n.kinds.length; i++) if (isKind(n.kinds[i], e.asset)){ c++; break; }
      });
      if (c < n.min) missing.push(n.say);
    });
    return { ok: missing.length === 0, missing: missing };
  }
  // entries: [{asset, piece:{roomKey,q,x,...}}] already restricted to the
  // rooms in scope; returns {met, progress}
  function evalOnEntries(test, entries, questId){
    var total = entries.length;
    if (test.role){
      var rs = roleSatisfied(test.role, entries);
      return { met: rs.ok, progress: rs.ok ? '✓' : ('needs ' + rs.missing.join(', ')) };
    }
    if (test.maxItems != null){
      return { met: total <= test.maxItems, progress: total + '/' + test.maxItems };
    }
    if (test.combo){
      var ha = entries.some(function(e){ return matchesTest(test.combo.a, e.asset); }), hb = entries.some(function(e){ return matchesTest(test.combo.b, e.asset); });
      return { met: !(ha && hb), progress: (ha && hb) ? 'clash' : '' };
    }
    if (test.metals){
      var warm = entries.some(function(e){ return e.asset.color === 'Gold' || e.asset.color === 'Brass'; });
      var cool = entries.some(function(e){ return e.asset.color === 'Chrome' || e.asset.color === 'Steel' || e.asset.color === 'Silver'; });
      return { met: !(warm && cool), progress: (warm && cool) ? 'mixed' : '' };
    }
    if (test.pair){
      var okp = test.pair.every(function(g){ return entries.some(function(e){ return matchesTest(g, e.asset); }); });
      return { met: okp, progress: okp ? '✓' : '' };
    }
    if (test.maxDistinct != null){
      var seenD = {};
      entries.forEach(function(e){ if (matchesTest(test, e.asset)) seenD[e.asset.color] = true; });
      var nd = Object.keys(seenD).length;
      return { met: nd <= test.maxDistinct, progress: String(nd) };
    }
    if (test.newMin != null){
      var n = entries.filter(function(e){ return e.piece.q === questId && !e.piece.starter; }).length;
      return { met: n >= test.newMin, progress: n + '/' + test.newMin };
    }
    var matching = entries.filter(function(e){ return matchesTest(test, e.asset); });
    var count = matching.length;
    if (test.minDistinct != null){
      var seen = {};
      matching.forEach(function(e){ seen[e.asset.color] = true; });
      var d = Object.keys(seen).length;
      return { met: d >= test.minDistinct, progress: d + '/' + test.minDistinct };
    }
    if (test.minShare != null){
      var share = total ? count / total : 0;
      return { met: total > 0 && share >= test.minShare, progress: Math.round(share * 100) + '%' };
    }
    if (test.maxShare != null){
      var sh = total ? count / total : 0;
      return { met: sh <= test.maxShare, progress: Math.round(sh * 100) + '%' };
    }
    if (test.max != null && test.min != null){
      return { met: count >= test.min && count <= test.max, progress: String(count) };
    }
    if (test.max != null){
      return { met: count <= test.max, progress: String(count) };
    }
    var need = test.min != null ? test.min : 1;
    return { met: count >= need, progress: Math.min(count, need) + '/' + need };
  }

  // pieces: [{assetId, roomKey, q, starter, x}] (only pieces in this property)
  // getAsset: id -> asset
  function evaluate(quest, pieces, getAsset, learnedMap){
    var entries = [];
    pieces.forEach(function(p){
      var a = getAsset(p.assetId);
      if (a) entries.push({ asset:a, piece:p });
    });
    function inRooms(keys){ return entries.filter(function(e){ return keys.indexOf(e.piece.roomKey) !== -1; }); }

    function runReq(req){
      var t = req.test;
      var keys = t.room ? [t.room] : (t.rooms || quest.edit);
      var res;
      if (t.each && keys.length > 1){
        var passed = 0;
        keys.forEach(function(k){ if (evalOnEntries(t, inRooms([k]), quest.id).met) passed++; });
        res = { met: passed === keys.length, progress: passed + '/' + keys.length + ' rooms' };
      } else {
        res = evalOnEntries(t, inRooms(keys), quest.id);
      }
      return { id:req.id, tier:req.tier, text:req.text, met:res.met, progress:res.progress, praise:req.praise, miss:req.miss };
    }
    var reqs = quest.brief.map(runReq);
    // the unspoken things; learnedMap says which ones this neighbour has already taught you
    var quirks = (quest.quirks || []).map(function(qk){
      var r = runReq(qk); r.known = !!(learnedMap && learnedMap[qk.id]); return r;
    });

    function frac(tier){
      var list = reqs.filter(function(r){ return r.tier === tier; });
      if (!list.length) return 1;
      return list.filter(function(r){ return r.met; }).length / list.length;
    }
    var scoped = inRooms(quest.edit);
    var hasStuff = scoped.length > 0;
    var quirkFrac = quirks.length ? quirks.filter(function(r){ return r.met; }).length / quirks.length : 1;
    var brief = quirks.length
      ? Math.round(100 * (0.45 * frac('must') + 0.25 * frac('like') + 0.10 * (hasStuff ? frac('avoid') : 0) + 0.20 * (hasStuff ? quirkFrac : 0)))
      : Math.round(100 * (0.55 * frac('must') + 0.30 * frac('like') + 0.15 * (hasStuff ? frac('avoid') : 0)));
    var mustAll = reqs.filter(function(r){ return r.tier === 'must'; }).every(function(r){ return r.met; });
    var quirksOk = quirks.every(function(r){ return r.met; });

    return { reqs:reqs, quirks:quirks, brief:brief, mustAll:mustAll, quirksOk:quirksOk };
  }

  // "furnished nicely": measurable things only — fullness, variety, balance,
  // and a palette that fits the character's mood. `bonusCount` is how many
  // achievements the commissioned rooms earned.
  // The four ingredients of "furnished nicely", per commissioned room, 0-100.
  function qualityRooms(quest, pieces, getAsset){
    var mood = MOODS[quest.char] || 'cohesive';
    return quest.edit.map(function(key){
      var list = pieces.filter(function(p){ return p.roomKey === key; })
        .map(function(p){ return { p:p, a:getAsset(p.assetId) }; }).filter(function(e){ return e.a; });
      var n = list.length;
      if (!n) return { key:key, n:0, full:0, variety:0, balance:0, harmony:0, score:0 };
      var full;
      if (mood === 'calm'){
        full = n < 6 ? n / 6 * 100 : (n <= 12 ? 100 : Math.max(50, 100 - (n - 12) * 8));
      } else {
        full = n < 8 ? n / 8 * 100 : (n <= 20 ? 100 : Math.max(60, 100 - (n - 20) * 4));
      }
      var cats = {}, colors = {}, zones = [false,false,false];
      list.forEach(function(e){
        cats[e.a.category] = true;
        colors[e.a.color] = (colors[e.a.color] || 0) + 1;
        zones[e.p.x < 33.34 ? 0 : (e.p.x < 66.67 ? 1 : 2)] = true;
      });
      var variety = Math.min(Object.keys(cats).length / 5, 1) * 100;
      var zn = zones.filter(Boolean).length;
      var balance = n <= 1 ? 40 : (zn === 3 ? 100 : (zn === 2 ? 70 : 35));
      var harmony;
      if (mood === 'bold'){
        harmony = Math.min(Object.keys(colors).length / 4, 1) * 100;
      } else {
        var counts = Object.keys(colors).map(function(k){ return colors[k]; }).sort(function(a,b){ return b-a; });
        var top3 = (counts[0] || 0) + (counts[1] || 0) + (counts[2] || 0);
        harmony = Math.min(top3 / n / 0.7, 1) * 100;
      }
      return { key:key, n:n, full:full, variety:variety, balance:balance, harmony:harmony,
               score:(full + variety + 2 * balance + harmony) / 5 };   // a well-spread room counts for more than a pile in the middle
    });
  }
  function quality(quest, pieces, getAsset, bonusCount){
    var perRoom = qualityRooms(quest, pieces, getAsset).map(function(r){ return r.score; });
    var avg = perRoom.reduce(function(a,b){ return a + b; }, 0) / (perRoom.length || 1);
    return Math.max(0, Math.min(100, Math.round(avg + Math.min((bonusCount || 0) * 4, 12))));
  }
  // The same four ingredients averaged over the commission, each with a
  // plain-words verdict for the result screen.
  function qualityDetail(quest, pieces, getAsset){
    var mood = MOODS[quest.char] || 'cohesive';
    var rooms = qualityRooms(quest, pieces, getAsset);
    function avg(k){ return Math.round(rooms.reduce(function(a, r){ return a + r[k]; }, 0) / (rooms.length || 1)); }
    var n = rooms.reduce(function(a, r){ return a + r.n; }, 0) / (rooms.length || 1);
    var full = avg('full'), variety = avg('variety'), balance = avg('balance'), harmony = avg('harmony');
    var crowded = (mood === 'calm' && n > 12) || n > 20;
    return [
      { key:'full', label:'Fullness', score:full,
        note: crowded ? (mood === 'calm' ? 'A touch crowded for someone who likes air' : 'Getting crowded') : (full >= 85 ? 'Comfortably filled' : (full >= 55 ? 'Room for a few more pieces' : 'Still quite bare')) },
      { key:'variety', label:'Variety', score:variety,
        note: variety >= 85 ? 'A good mix of furniture, light and decor' : (variety >= 55 ? 'A few more kinds of things would help' : 'Mostly the same kind of piece') },
      { key:'balance', label:'Balance', score:balance,
        note: balance >= 85 ? 'Spread nicely across the room' : (balance >= 55 ? 'Leaning a little to one side' : 'Huddled in one corner') },
      { key:'harmony', label:mood === 'bold' ? 'Colour' : 'Harmony', score:harmony,
        note: mood === 'bold' ? (harmony >= 85 ? 'Gloriously colourful' : (harmony >= 55 ? 'Could be bolder' : 'Rather shy with colour'))
                              : (harmony >= 85 ? 'A calm, related palette' : (harmony >= 55 ? 'A few colours pulling apart' : 'The colours are arguing')) }
    ];
  }

  // Which of YOUR pieces earned the thumbs-up or the raised eyebrow, and which
  // colours/materials the brief was fond of or wary of.
  function analyze(quest, pieces, getAsset, ev){
    var entries = [];
    pieces.forEach(function(p, i){ var a = getAsset(p.assetId); if (a) entries.push({ asset:a, piece:p, i:i }); });
    var scope = entries.filter(function(e){ return quest.edit.indexOf(e.piece.roomKey) !== -1; });
    var loved = {}, doubted = {}, wantC = {}, avoidC = {}, wantM = {}, avoidM = {};
    function add(bucket, e, r){
      var b = bucket[e.asset.id] || (bucket[e.asset.id] = { assetId:e.asset.id, n:0, seen:{}, reasons:[] });
      if (!b.seen[e.i]){ b.seen[e.i] = 1; b.n++; }
      if (b.reasons.indexOf(r.text) === -1) b.reasons.push(r.text);
    }
    ev.reqs.forEach(function(r, idx){
      var t = quest.brief[idx].test;
      (t.colors || []).forEach(function(c){ (r.tier === 'avoid' ? avoidC : wantC)[c] = true; });
      (t.materials || []).forEach(function(c){ (r.tier === 'avoid' ? avoidM : wantM)[c] = true; });
      var keys = t.room ? [t.room] : (t.rooms || quest.edit);
      var inRoom = scope.filter(function(e){ return keys.indexOf(e.piece.roomKey) !== -1; });
      var hits;
      if (t.role){
        var role = ROLES[t.role]; if (!role) return;
        hits = inRoom.filter(function(e){
          return role.needs.some(function(nd){ return nd.kinds.some(function(k){ return isKind(k, e.asset); }); });
        });
      } else if (t.kinds || t.colors || t.materials || t.ids){
        hits = inRoom.filter(function(e){ return matchesTest(t, e.asset); });
      } else return;
      if (!hits.length) return;
      if (r.tier === 'avoid'){ if (!r.met) hits.forEach(function(e){ add(doubted, e, r); }); }
      else if (r.met){ hits.forEach(function(e){ add(loved, e, r); }); }
    });
    function list(bucket){
      return Object.keys(bucket).map(function(k){ var b = bucket[k]; delete b.seen; b.reasons.sort(function(x, y){ return x.length - y.length; }); return b; })
        .sort(function(a, b){ return (b.reasons.length - a.reasons.length) || (b.n - a.n); });
    }
    return { loved:list(loved), doubted:list(doubted),
             wantColors:Object.keys(wantC), avoidColors:Object.keys(avoidC),
             wantMaterials:Object.keys(wantM), avoidMaterials:Object.keys(avoidM) };
  }

  // which named neighbourhood a map point falls in (small ones are listed first)
  function districtAt(x, y){
    var ds = TOWN.districts || [];
    for (var i = 0; i < ds.length; i++){
      var poly = ds[i].poly, inside = false;
      for (var a = 0, b = poly.length - 1; a < poly.length; b = a++){
        var xi = poly[a][0], yi = poly[a][1], xj = poly[b][0], yj = poly[b][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
      }
      if (inside) return ds[i];
    }
    return null;
  }

  function heartsFor(briefScore, qualityScore, mustAll, anyPieces, quirksOk){
    if (!anyPieces) return 1;
    var final = 0.5 * briefScore + 0.5 * qualityScore;
    var h = final < 25 ? 1 : (final < 45 ? 2 : (final < 65 ? 3 : (final < 88 ? 4 : 5)));
    if (mustAll && h < 3) h = 3;     // if you listened to every must-have, you get at least 3
    if (quirksOk === false && h > 4) h = 4;   // five hearts means they felt truly understood
    return h;
  }

  // the client's reply: opener by tier + up to two things they liked + one
  // gentle remark about something missed
  function buildReply(quest, evalResult, hearts){
    var tier = hearts >= 4 ? 'high' : (hearts === 3 ? 'mid' : 'low');
    var out = { opener: quest.reply[tier], praised:[], miss:null };
    var met = evalResult.reqs.filter(function(r){ return r.met && r.tier !== 'avoid' && r.praise; });
    // favour must-haves first, then likes
    met.sort(function(a,b){ return (a.tier === 'must' ? 0 : 1) - (b.tier === 'must' ? 0 : 1); });
    out.praised = met.slice(0, 2).map(function(r){ return r.praise; });
    var qk = (evalResult.quirks || []);
    var qBroke = qk.filter(function(r){ return !r.met && r.miss; }), qMet = qk.filter(function(r){ return r.met && r.praise; });
    if (qMet.length && out.praised.length < 2) out.praised.push(qMet[0].praise);
    var missed = evalResult.reqs.filter(function(r){ return !r.met && r.miss && r.tier !== 'avoid'; });
    var broke = evalResult.reqs.filter(function(r){ return !r.met && r.miss && r.tier === 'avoid'; });
    if (hearts <= 4){
      var m = qBroke[0] || missed[0] || broke[0];
      if (m) out.miss = m.miss;
    }
    return out;
  }

  return {
    TOWN: TOWN, RENOWN_LEVELS: RENOWN_LEVELS, renownLevel: renownLevel,
    CHARACTERS: CHARACTERS, PROPERTIES: PROPERTIES, QUESTS: QUESTS, ROLES: ROLES, KINDS: KINDS, MOODS: MOODS,
    questById: questById, questsOf: questsOf, isUnlocked: isUnlocked,
    QUIRKS: QUIRKS, giftsEarned: giftsEarned, giftOwner: giftOwner, REWARDS: REWARDS, VOICES: VOICES,
    starsFor: starsFor, isKind: isKind,
    evaluate: evaluate, quality: quality, qualityDetail: qualityDetail, analyze: analyze, districtAt: districtAt, dateOf: dateOf, monthOf: monthOf, seasonOf: seasonOf, todayOf: todayOf, SPOTS: SPOTS, spotById: function(id){ return SPOT_BY_ID[id] || null; }, spotsAt: spotsAt, EVENTS: EVENTS, eventById: function(id){ return EVENT_BY_ID[id] || null; }, eventsDue: eventsDue, upcoming: upcoming, pastEvents: pastEvents, NEWS: NEWS, issuesAt: issuesAt, heartsFor: heartsFor, buildReply: buildReply
  };
})();
