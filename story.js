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
var STORY_FILE_VERSION = '0.14.0'; // stamped by the build, shown on the title screen
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

  // D(m) = the story day of the 2nd of month m (0 = June 2025). Jobs, shops and
  // happenings are all pinned to months, so the three years read as a calendar.
  function D(m){
    var c = TOWN.calendar;
    return Math.round((Date.UTC(c.year, c.month + m, c.day) - Date.UTC(c.year, c.month, c.day)) / 86400000);
  }

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
    mia:   { id:'mia',   name:'Mia',   age:24, bday:9, job:'Vet receptionist',        color:'#8fb996',
             blurb:"Just got her own keys. Shy, bakes a lot, can't walk past a flower shop." },
    jules: { id:'jules', name:'Jules', age:22, bday:2, job:'Illustration student',    color:'#4f7fd6',
             blurb:"Arrived with a suitcase and eleven boxes of paint. The paint was unpacked first." },
    sam:   { id:'sam',   name:'Sam',   age:35, bday:7, job:'Events producer',         color:'#a8454f',
             blurb:"Confident, generous, plans a dinner for twelve in a flat that seats four." },
    noor:  { id:'noor',  name:'Noor',  age:40, bday:0, job:'Architect',               color:'#4a5f7a',
             blurb:"Dry, precise, secretly funny. Can tell when a shelf is two centimetres off." },
    theo:  { id:'theo',  name:'Theo',  age:29, bday:10, job:'Baker',        color:'#d9a441',
             blurb:"Keeps everything 'because it might be useful'. About to become a dad." },
    rosa:  { id:'rosa',  name:'Rosa',  age:68, bday:11, job:'Retired costume maker',   color:'#7a3b5e',
             blurb:"Theatrical, outspoken, wonderful. Has opinions about workmanship and about you." }
    ,
    // the street speaking together: only the final letter comes from here
    town:  { id:'town',  name:'The Cove', age:0, bday:0, job:'', color:'#7a8f6d', hidden:true, glyph:'⌂',
             blurb:"Everyone you have helped, all at once." }
  };
  // mood steers how "nice" is judged: cohesive = a calm, related palette;
  // bold = lots of colours is a feature; calm = fewer things, more air.
  var MOODS = { mia:'cohesive', jules:'bold', sam:'cohesive', noor:'calm', theo:'cohesive', rosa:'bold', town:'cohesive' };

  /* ------------------------------------------------------------ properties */
  // Each property is one flat (always ONE room family, like the free-play
  // flats). `rooms` is the full layout in left-to-right order; a commission
  // only unlocks the rooms it lists in `edit`. Doors are chosen so
  // neighbouring rooms connect: right door -> next room's left door.
  var PROPERTIES = {
    /* ---- Mia ---- */
    MIA_HOME_A:    { owner:'mia',   name:"Mia's first flat",       family:'modern', district:'canal', map:{x:59.5,y:63},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'bigwindow-bothdoors'},
                             {key:'green',   label:'The little green room', arch:'onewindow-leftdoor'} ] },
    MIA_HOME_B:    { owner:'mia',   name:"Mia & Alex's garden flat", family:'sunlit-living-room-twin-windows', district:'church', map:{x:21,y:58},
                     rooms:[ {key:'living',  label:'Living room', arch:'both-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'left-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'right-leftdoor'} ] },
    /* ---- Jules ---- */
    JULES_HOME_A:  { owner:'jules', name:"Jules's attic studio",    family:'historic', district:'mills', map:{x:83,y:64},
                     rooms:[ {key:'studio',  label:'The studio',  arch:'onewindow-nodoors'} ] },
    JULES_HOME_B:  { owner:'jules', name:"Jules's studio flat",     family:'historic', district:'mills', map:{x:79,y:72},
                     rooms:[ {key:'art',     label:'The painting room', arch:'twowindows-rightdoor'},
                             {key:'living',  label:'Living & sleeping', arch:'roundwindow-leftdoor'} ] },
    JULES_LOFT:    { owner:'jules', name:"Jules's top-floor loft", family:'loft', district:'mills', map:{x:88,y:63},
                     rooms:[ {key:'living',  label:'Living room', arch:'threewindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'twowindows-bothdoors'},
                             {key:'art',     label:'Art room',    arch:'onewindow-leftdoor'} ] },
    /* ---- Sam ---- */
    SAM_HOME_A:    { owner:'sam',   name:"Sam's city apartment",   family:'brutalist', district:'glass', map:{x:75,y:38},
                     rooms:[ {key:'kitchen', label:'Kitchen',     arch:'bigwindow-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'twowindows-bothdoors'},
                             {key:'living',  label:'Living room', arch:'bigwindow-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'rightwindow-leftdoor'} ] },
    SAM_OFFICE:    { owner:'sam',   name:"Sam & Co. Events",       family:'brutalist', district:'glass', map:{x:80,y:33}, work:true,
                     rooms:[ {key:'office',  label:'The office',  arch:'twowindows-nodoors'} ] },
    SAM_HOME_B:    { owner:'sam',   name:"Sam & Robin's home",     family:'historic', district:'oldtown', map:{x:44,y:35},
                     rooms:[ {key:'kitchen', label:'Kitchen',     arch:'twowindows-rightdoor'},
                             {key:'living',  label:'Living room', arch:'roundwindow-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'baywindowright-leftdoor'} ] },
    /* ---- Noor ---- */
    NOOR_HOME_A:   { owner:'noor',  name:"Noor's rental",          family:'modern', district:'glass', map:{x:69,y:31},
                     rooms:[ {key:'bedroom', label:'Bedroom',     arch:'widenarrowwindow-rightdoor'},
                             {key:'living',  label:'Living room', arch:'bigwindow-bothdoors'},
                             {key:'music',   label:'The practice room', arch:'onewindow-leftdoor'} ] },
    NOOR_HOME_B:   { owner:'noor',  name:"Noor's top-floor flat", family:'loft', district:'glass', map:{x:72.5,y:34},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'onewindow-bothdoors'},
                             {key:'study',   label:'Quiet room',  arch:'threewindows-leftdoor'} ] },
    NOOR_OFFICE:   { owner:'noor',  name:"Noor Architects",       family:'modern', district:'glass', map:{x:66.5,y:41}, work:true,
                     rooms:[ {key:'office',  label:'The office',  arch:'twowindows-nodoors'} ] },
    /* ---- Theo ---- */
    THEO_HOME_A:   { owner:'theo',  name:"Theo & Elena's cabin",   family:'cozy-cabin', district:'lane', map:{x:36.8,y:23.4},
                     rooms:[ {key:'living',  label:'Living room', arch:'bigwindow-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'smallwindow-bothdoors'},
                             {key:'kitchen', label:'Kitchen',     arch:'woodenroom-leftdoor'} ] },
    THEO_BAKERY:   { owner:'theo',  name:"Crumb & Crown",          family:'historic', district:'oldtown', map:{x:44.6,y:58.8}, work:true,
                     rooms:[ {key:'shop',    label:'The corner table', arch:'twowindows-nodoors'} ] },
    THEO_HOME_B:   { owner:'theo',  name:"Theo's family flat",     family:'modern', district:'orchard', map:{x:20.3,y:24.8},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'widenarrowwindow-bothdoors'},
                             {key:'wren',    label:"Wren's room", arch:'onewindow-leftdoor'} ] },
    /* ---- Rosa ---- */
    ROSA_HOME_A:   { owner:'rosa',  name:"Rosa's old apartment",   family:'historic', district:'oldtown', map:{x:46.5,y:63},
                     rooms:[ {key:'sitting', label:'Sitting room',arch:'twowindows-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'roundwindow-bothdoors'},
                             {key:'spare',   label:'The sewing room', arch:'baywindowright-leftdoor'} ] },
    ROSA_CABIN_A:  { owner:'rosa',  name:"Rosa's cabin on Lantern Lane",   family:'cozy-cabin', district:'lane', map:{x:43,y:24.9},
                     rooms:[ {key:'living',  label:'Living room', arch:'bigwindow-rightdoor'},
                             {key:'kitchen', label:'Kitchen & dining', arch:'woodenroom-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'smallwindow-leftdoor'} ] },
    ROSA_ATELIER:  { owner:'rosa',  name:"The Costume Cupboard",   family:'historic', district:'oldtown', map:{x:50.5,y:52}, work:true,
                     rooms:[ {key:'shop',    label:'The workroom', arch:'onewindow-nodoors'} ] }
  };

  /* ---- the last key: a flat of your own, in whichever neighbourhood you pick (the final job) ---- */
  var OWN_FLATS = [
    // doors chain from room to room: the first room opens on the right, the middle ones on both sides, the last on the left
    { id:'canal',    family:'modern',   map:{x:64.5,y:52},  arch:['twowindows-rightdoor','bigwindow-bothdoors','widenarrowwindow-bothdoors','onewindow-leftdoor'] },
    { id:'church',   family:'sunlit-living-room-twin-windows', map:{x:6,y:64}, arch:['both-rightdoor','left-bothdoors','right-bothdoors','big-leftdoor'] },
    { id:'mills',    family:'loft',     map:{x:88.5,y:80},  arch:['threewindows-rightdoor','twowindows-bothdoors','onewindow-bothdoors','onewindow-leftdoor'] },
    { id:'glass',    family:'brutalist',map:{x:75.7,y:26.5},arch:['leftwindow-rightdoor','twowindows-bothdoors','bigwindow-bothdoors','rightwindow-leftdoor'] },
    { id:'oldtown',  family:'historic', map:{x:53,y:34},    arch:['twowindows-rightdoor','roundwindow-bothdoors','onewindow-bothdoors','baywindowright-leftdoor'] },
    { id:'lane',     family:'cozy-cabin',map:{x:40,y:20.5}, arch:['bigwindow-rightdoor','smallwindow-bothdoors','woodenroom-bothdoors','bigwindow-leftdoor'] },
    { id:'orchard',  family:'modern',   map:{x:24.2,y:27.3},arch:['onewindow-rightdoor','twowindows-bothdoors','widenarrowwindow-bothdoors','bigwindow-leftdoor'] },
    { id:'eastbank', family:'historic', map:{x:96.3,y:51.5},arch:['onewindow-rightdoor','roundwindow-bothdoors','twowindows-bothdoors','twowindows-leftdoor'] }
  ];

  OWN_FLATS.forEach(function(f){
    PROPERTIES['OWN_' + f.id] = { owner:'town', own:true, name:'Your place', family:f.family, district:f.id, map:f.map,
      rooms:[ {key:'living',  label:'Living room',    arch:f.arch[0]},
              {key:'bedroom', label:'Bedroom',        arch:f.arch[1]},
              {key:'kitchen', label:'Kitchen',        arch:f.arch[2]},
              {key:'extra',   label:'Your own room',  arch:f.arch[3]} ] };
  });


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
    vase:        function(a){ return /^vase-/.test(a.id); },
    desk:        function(a){ return /^desk-/.test(a.id); },
    deskchair:   function(a){ return /^deskchair-/.test(a.id); },
    wardrobe:    function(a){ return /^wardrobe-/.test(a.id); },
    tech:        function(a){ return /^(computer|laptop)-/.test(a.id); },
    instrument:  function(a){ return /^(piano|grand-piano|keyboard|guitar|violin|drums)-/.test(a.id); },
    drums:       function(a){ return /^drums-/.test(a.id); },
    poof:        function(a){ return /^poof-/.test(a.id); },
    wallshelf:   function(a){ return /^wallshelf-/.test(a.id); }
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
    study:   { label:'A quiet thinking room', needs:[ {kinds:['bookshelf','sideboard'],min:1,say:'a shelf or sideboard'}, {kinds:['chair','armchair'],min:1,say:'a chair'}, {kinds:['lamp'],min:1,say:'a good lamp'} ] },
    office:  { label:'A proper office',       needs:[ {kinds:['desk'],min:1,say:'a desk'}, {kinds:['deskchair','chair','armchair'],min:1,say:'a chair'}, {kinds:['tech'],min:1,say:'a computer or laptop'}, {kinds:['lamp'],min:1,say:'a lamp'} ] },
    music:   { label:'A music room',          needs:[ {kinds:['instrument'],min:1,say:'an instrument'}, {kinds:['chair','stool','armchair','deskchair','poof'],min:1,say:'somewhere to sit'}, {kinds:['bookshelf','sideboard','wallshelf','sidetable','desk'],min:1,say:'a place for the sheet music'} ] },
    sewing:  { label:'A sewing room',         needs:[ {kinds:['dining','desk'],min:1,say:'a big table to cut on'}, {kinds:['chair','stool','armchair','deskchair'],min:1,say:'a chair'}, {kinds:['lamp'],min:1,say:'good light'} ] }
  };

  /* ----------------------------------------------------------------- stars */
  // Every item is worth 1-5 stars. Most things are 1-3; a few really special
  // pieces are 4-5 and only unlock as your renown grows.
  var STAR_RULES = [
    [/^desk-/, 3], [/^computer-/, 2], [/^laptop-/, 1], [/^poof-/, 1], [/^deskchair-/, 2], [/^grand-piano/, 4], [/^piano-/, 3], [/^drums-/, 2],
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

  var QUESTS = [].concat(
  [
  /* ======================== MIA ======================== */
  { id:'MIA_01', n:0, char:'mia', job:'Vet receptionist', title:'A Key of My Own', property:'MIA_HOME_A', change:'new', edit:['living'], allowance:32,
    story:"Mia has started at the vet practice and finally has her own keys. Most of her savings went on the deposit, so there's exactly one room she can afford to feel good in.",
    message:"I've never had a room where I get to choose everything! Green and beige, light wood, somewhere comfy to sit. And flowers, please. There's a rumour that a florist is opening on my street and I'm already emotionally invested.",
    brief:[
      R('must','role','A proper living room: a couch or armchair, a table and a lamp',{role:'living',room:'living'},
        ["It's a real living room — I can actually sit down in it!","I'm still sitting on a moving box, but I'm sure it's character-building."]),
      R('must','flowers','At least one bunch of flowers',{kinds:['flowers'],min:1},
        ["You remembered the flowers!","The flower-shop lady is going to ask where my flowers went."]),
      R('like','palette','Mostly green, beige and light wood',{colors:['Green','Beige','White','Yellow','Light Wood'],minShare:0.5},
        ["It's so soft and green in here. It's like a hug.","I love it, I just… wanted a bit more green and beige?"]),
      R('avoid','noblack','No black furniture',{colors:['Black'],max:0},
        [null,"There's a black piece in there. It's looking at me."]),
      R('avoid','nochrome','Nothing shiny and chrome',{colors:['Chrome'],max:0},
        [null,"Something chrome snuck in. It's very shiny. I'm a bit scared."])
    ],
    reply:{ low:"It's a start. I'm just happy it's mine.", mid:"It feels like a place I could live in. Thank you!", high:"I came home, sat down, and just stayed there. This is the first place that's really felt like mine." },
    letter:{ hello:"Hello {you}!",
      body:["I have a key now. My own key! I keep checking my pocket. You were always the one who knew what I'd like before I did, so I'm asking the best person I know.",
            "I can only afford to make one room nice: the living room. Somewhere comfy, a little table, a lamp. Green, beige and light wood. And flowers! (A florist is about to open on my street and I'm already emotionally invested.) My toes are always cold, so something soft for the floor?",
            "No black furniture or shiny chrome, please. Shiny things make me nervous."],
      bye:"Thank you so much,", ps:"There will be cookies." },
    reward:{ items:['candle-joerg-off','flowers-sia-white'], bonus:['vase-victoria'] }, quirks:['mia_rug'] },

  { id:'MIA_02', n:6, char:'mia', job:'Vet receptionist', title:'Now the Bedroom Feels Empty', property:'MIA_HOME_A', change:'more', edit:['bedroom'], allowance:36, minRenown:5,
    story:"Mia passed her probation (and got a small raise). Every evening she ends up in the living room you did, because the bedroom still looks like a storage cupboard with a mattress.",
    message:"I passed my probation! Every evening I end up in the room you did, like a cat in the only sunny spot. Could you do the bedroom now? Soft pink, I think. And flowers. You already know how I feel about flowers.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["I slept so well I was late for work. Worth it."]),
      R('must','flowers','Flowers by the bed',{kinds:['flowers'],min:1},["Flowers by the bed. You get me."]),
      R('like','pink','Soft pink and beige',{colors:['Rosa','Pink','Blush','Beige','White'],minShare:0.5},["The bedroom is the softest thing I've ever seen."]),
      R('like','light','A soft lamp for reading in bed',{kinds:['lamp'],min:1},["A reading lamp. I'm never getting up."]),
      R('avoid','nodark','Nothing dark or black',{colors:['Black','Dark Wood'],max:0},[null,"A couple of the pieces are a bit dark for my taste."])
    ],
    reply:{ low:"It's a bed in a room. That's an improvement.", mid:"Now the whole flat feels a bit more like me. Thank you.", high:"I invited my mum round. I didn't apologise for anything. That's new." },
    letter:{ hello:"Hello again!",
      body:["I passed my probation! I buy dahlias at Fennel & Fern every Friday (the shop cat waits for me), and every evening I still end up in the living room you made, like a cat in the only sunny spot. My room at Mum's had a black table on a dark rug, and it felt like a cave.",
            "Could you do the bedroom? Soft pink, please, something warm underfoot, and a little lamp so I can read in bed until I fall asleep on the book. Flowers by the bed. And nothing too dark."],
      bye:"Thank you again,", ps:"A friend called Alex carried my bookcase up the stairs. I'm saying nothing." },
    reward:{ items:['blanket-basket','painting-flowers-pink'], bonus:['lamp-kay-blush'] }, quirks:['mia_rug','mia_cave'] },

  { id:'MIA_03', n:12, char:'mia', job:'Vet receptionist · weekend gardener', title:'A Little Garden Indoors', property:'MIA_HOME_A', change:'more', edit:['green'], allowance:42, minRenown:12,
    story:"Parsley's florist gave Mia a cutting of something, then another, then a whole tray of seedlings. The little spare room is now a jungle in waiting. Mia has discovered she likes growing things as much as buying them.",
    message:"I've started growing things! It began with one cutting and now the little room looks like a greenhouse that lost its glass. Green everywhere, please, a spot for pots, a chair to sit and watch it all grow. And please don't cover the window. Plants need the light.",
    brief:[
      R('must','plants','At least four plants',{kinds:['plant'],min:4},["It's a jungle. A very tidy one."]),
      R('must','chair','A comfy chair to sit in and watch them grow',{kinds:['armchair','chair','stool'],min:1},["I sat down for a minute and it was an hour later."]),
      R('must','shelf','Somewhere to stand pots: a shelf, a sideboard or a table',{kinds:['sideboard','bookshelf','sidetable','wallshelf'],min:1},["A potting spot. I feel like a professional."]),
      R('like','green','Lots of green',{colors:['Green'],min:4},["So much green. I might never leave."]),
      R('like','wood','Light wood to go with all the leaves',{colors:['Light Wood','Beige','White'],minShare:0.4},["The light wood and the leaves are best friends."]),
      R('like','flowers','A bunch of flowers, for the ones that have already bloomed',{kinds:['flowers'],min:1},["The first flowers I grew myself. Well. Nearly."]),
      R('avoid','nodark','Nothing dark',{colors:['Black','Dark Wood'],max:0},[null,"It's a little dark in there for a room full of leaves."])
    ],
    reply:{ low:"The plants will forgive me. They're good like that.", mid:"The little room is my favourite one now. Don't tell the others.", high:"I gave Gerald's cousin a pot of basil and cried. It was a good day." },
    letter:{ hello:"Hello {you}!",
      body:["I have to tell you something. I've started growing things. It began with one cutting from the florist, then a second, then a tray of seedlings that now lives on every windowsill. The little room at the back is a greenhouse in waiting.",
            "Could you make it a proper green room? Lots of plants, somewhere for the pots, one very comfy chair for watching it all grow. And please, nothing in front of the window. They need all the light they can get."],
      bye:"Muddy hands, warm heart,", ps:"Parsley is not impressed by my basil. Parsley is hard to impress." },
    reward:{ items:['hangingplant-jule','olive-branches'], bonus:['orange-tree'] }, quirks:['mia_rug','mia_cave','mia_sun'] },

  { id:'MIA_04', n:18, char:'mia', job:'Vet receptionist · weekend gardener', title:'Room for Alex', property:'MIA_HOME_A', change:'refresh', edit:['living','bedroom'], allowance:58, minRenown:22,
    story:"Alex has been 'staying over' for six months. Alex's bike is now in the hall. Alex's board games are in the living room. It's official: Alex lives here, and the flat needs to notice.",
    message:"Alex is moving in! Properly. There are board games in the hall and a bike in the bedroom and I'm so happy I could cry. Could you make room for two? Keep what we love, bring in a few new things, and a bit of blue for Alex in the living room. And somewhere for Alex's clothes. I own four hangers.",
    brief:[
      R('must','new','Bring in at least five new pieces',{newMin:5},["A few new bits and it feels like two people live here."]),
      R('must','wardrobe','Somewhere for two people’s clothes: a wardrobe in the bedroom',{kinds:['wardrobe'],min:1,room:'bedroom'},["Alex hung up a shirt and looked so proud."]),
      R('must','living','The living room still works: seats, a table and a lamp',{role:'living',room:'living'},["The living room fits two. And a board game."]),
      R('like','blue','A few blue pieces for Alex',{colors:['Blue'],min:2},["Blue! Alex went quiet. That's the good kind."]),
      R('like','green','Keep the green and the light wood',{colors:['Green','Light Wood','Beige','White'],minShare:0.5},["It's still me. And now it's also us."]),
      R('like','flowers','Flowers in both rooms',{kinds:['flowers'],min:1,rooms:['living','bedroom'],each:true},["Flowers for two."]),
      R('avoid','notdark','Nothing dark or black',{colors:['Black','Dark Wood'],maxShare:0.15},[null,"A bit dark for us two cosy people."])
    ],
    reply:{ low:"It's a bit squashed, but we're squashed together, so it's fine.", mid:"It feels like a home for two. A small, happy one.", high:"Alex says it's the first place that feels like ours. I said it back. Then we both cried and ate cake." },
    letter:{ hello:"Dear {you},",
      body:["Alex is moving in! Properly. There's a bike in the hall, board games in every corner and a toothbrush next to mine, and I'm so happy I could pop.",
            "Could you make a bit of room for two? The living room needs space for Alex's games and a few blue things (Alex's favourite colour), and the bedroom needs a wardrobe that isn't me. I own four hangers. Keep the green, keep the flowers, and still nothing dark or too shiny. We're cosy people, not moody ones."],
      bye:"With a full heart and an empty wardrobe,", ps:"We've rented an allotment plot together. Alex thinks it's for vegetables. It's for dahlias." },
    reward:{ items:['painting-turner-blue','lamp-kay-blue'], bonus:['rug-persian-blue'] }, quirks:['mia_rug','mia_cave'] },

  { id:'MIA_05', n:24, char:'mia', job:'Vet receptionist · flower grower', title:'Our Place with a Garden', property:'MIA_HOME_B', change:'move', edit:['living','dining'], allowance:78, minRenown:35,
    story:"The allotment became a garden and the garden became a reason: Mia and Alex have found a flat on Church Hill with its own little garden and a gate. Alex wants a table that fits the whole family. Mia wants flowers on it.",
    message:"We found a flat with a garden! A real one, with a gate and a crooked apple tree. Alex wants a proper table and space for friends; I want flowers on it, from my own garden. Bring a bit of the old living room with us, please. And Alex's grandmother's wooden table was perfect, so a wooden one like that.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room is ours already."]),
      R('must','dining','A dining table with seats',{role:'dining',room:'dining'},["We can have people over. A frightening thought!"]),
      R('must','flowers','Flowers in both rooms',{kinds:['flowers'],min:1,rooms:['living','dining'],each:true},["Flowers on the table! Alex actually gasped."]),
      R('like','palette','Green, blue and beige together, with light wood',{colors:['Green','Blue','Beige','White','Light Wood'],minShare:0.6},["It's Alex AND me. I didn't think it would work!"]),
      R('like','plants','Plenty of plants (the garden is coming indoors)',{kinds:['plant'],min:3},["The garden came inside. I love it."]),
      R('like','navy','A few blue pieces for Alex',{colors:['Blue'],min:3},["Alex found the blue and went very quiet. That's good."]),
      R('avoid','notdark','Not too dark overall',{colors:['Black','Dark Wood'],maxShare:0.2},[null,"It's a bit heavy on the dark side. We're cosy people, not moody ones."])
    ],
    reply:{ low:"It's a roof, a table and each other. That counts.", mid:"We have a home. A real one. With a table and a garden!", high:"Alex says it feels like both of us. I say it feels like the first room I ever chose, but bigger." },
    letter:{ hello:"Dear {you},",
      body:["We found a flat with a GARDEN. A real one, with a gate and one very crooked apple tree. It's on Church Hill, close enough to hear the bells and far enough to ignore them.",
            "Alex wants a proper table, one like their grandmother's wooden one, that survived three house moves and a rave. I want flowers on it, from my own patch. A living room that has a bit of old me and a bit of new us: green, blue, beige, light wood, and plants. Lots of plants. And nothing too dark."],
      bye:"Gratefully (and covered in soil),", ps:"I'm going to sell the extra flowers from the gate. Don't tell Parsley." },
    reward:{ items:['fruit-bowl-oranges','rug-jannis-blue'], bonus:['vase-hannah'] }, quirks:['mia_rug','mia_cave','mia_table'] },

  { id:'MIA_06', n:30, char:'mia', job:'Vet receptionist · flower grower', title:'A Bedroom to Wake Up Married In', property:'MIA_HOME_B', change:'more', edit:['bedroom'], allowance:60, minRenown:45,
    story:"Alex asked on the allotment, between the dahlias and the compost heap. Mia said yes before the question was finished. The wedding is in spring, in the white church. Before then, one room has to feel like the quiet in the middle of it all.",
    message:"ALEX ASKED. Between the dahlias and the compost heap, in muddy boots, and I said yes before they'd finished. The wedding is in spring! I'd love a bedroom that's calm after all the noise: soft, green, pale pink, flowers from my garden in every room. And a place for the dress to hang. Somewhere nobody sees it.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["A bedroom to be married in. I can't think of anything better."]),
      R('must','wardrobe','A wardrobe for the dress (and the suit, and everything else)',{kinds:['wardrobe'],min:1},["The dress has a home. Nobody will find it."]),
      R('must','flowers','Flowers by the bed, from the garden',{kinds:['flowers'],min:2},["Two bunches. One for me, one for the dress."]),
      R('like','palette','Soft pink, green and beige',{colors:['Rosa','Pink','Blush','Green','Beige','White','Light Wood'],minShare:0.6},["The bedroom is a hug in a room."]),
      R('like','plant','A plant or two',{kinds:['plant'],min:2},["Green things at the foot of the bed. Perfect."]),
      R('like','soft','Soft things: a rug and a few cushions',{kinds:['rug','cushion'],min:2},["Soft underfoot and soft everywhere else."]),
      R('like','light','Warm light: a lamp each side',{kinds:['lamp'],min:2},["Warm light on both sides. Alex's side has a book. It's still unread."]),
      R('avoid','nodark','Nothing dark or black',{colors:['Black','Dark Wood'],max:0},[null,"There's a dark piece in there. It's looking at the dress."])
    ],
    reply:{ low:"It's a room, and in it I'll be married soon. It's perfect.", mid:"I lay on the bed and felt completely calm. That never happens before a wedding.", high:"Alex came in, looked around and said 'oh'. That's the best review of my life." },
    letter:{ hello:"Dear {you},",
      body:["Alex asked. In muddy boots, on the allotment, between the dahlias and the compost heap, and I said yes before they'd finished the question. The wedding is in spring, at the white church on Church Hill. The whole street is coming. I have already started growing the flowers.",
            "Before the noise starts I'd like one calm room: a bedroom that feels like a deep breath. Soft pink, green and beige, light wood, flowers from the garden, something soft underfoot, and a wardrobe for the dress. The one nobody's allowed to see. Nothing dark. Not even a little."],
      bye:"Yours, practically married,", ps:"Rosa has promised me a veil. I'm terrified and thrilled." },
    reward:{ items:['lamp-heidi-blush','curtain-siri-blush'], bonus:['rug-elena-rosa'] }, quirks:['mia_rug','mia_cave','mia_blooms'] },

  ],
  [
  /* ======================== JULES ======================== */
  { id:'JULES_01', n:1, char:'jules', job:'Illustration student', title:'Everything Happens Here', property:'JULES_HOME_A', change:'new', edit:['studio'], allowance:34,
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
    reply:{ low:"It's a roof and an easel. I can work with that.", mid:"I can walk in and want to make something. That's all I wanted.", high:"I put the easel down and painted until 3am. The room made me do it." },
    letter:{ hello:"HELLO!!",
      body:["Mia gave me your name and a cookie. I have one suitcase and ELEVEN boxes of paint. The paint is unpacked. The bed is… somewhere?",
            "One room that does everything. The EASEL first, then somewhere to sleep, then somewhere to sit and stare at the ceiling. Blue and orange, the only couple I believe in, plus lots of colours that don't match. Matching is how they get you.",
            "Please don't make it beige. BEIGE IS HOW THEY GET YOU."],
      bye:"Yours in turpentine,", ps:"I drew you on the back. You look like a potato in a nice jumper." },
    reward:{ items:['paintbrushes-incup-beige','painting-maja'], bonus:['magazines-stacked-orange'] }, quirks:['jules_pair'] },

  { id:'JULES_02', n:7, char:'jules', job:'Illustration student', title:'My First Paid Commission', property:'JULES_HOME_A', change:'refresh', edit:['studio'], allowance:30, minRenown:5,
    story:"Someone has actually paid Jules for an illustration! The studio gets a refresh. The room you made stays as it is, with a few new things.",
    message:"Someone has actually PAID me. I'd like to spend a little on this place. Keep the easel and the blue, but could we try something pink with it? It still needs to feel like my room.",
    brief:[
      R('must','easel','Keep the easel',{kinds:['easel'],min:1},["The easel is still the boss of the room."]),
      R('must','new','Bring in at least 3 new pieces',{newMin:3},["A few new bits and it feels like I grew up a little."]),
      R('like','blue','Keep the blue',{colors:['Blue'],min:3},["Blue stays. Good."]),
      R('like','lilac','Something pink (the Carla couch comes in pink!)',{colors:['Pink','Rosa','Blush'],min:2},["PINK. You found pink!"]),
      R('like','plant','A plant (the fern is called Gerald and he is lonely)',{kinds:['plant'],min:1},["Gerald has a friend now. He's thrilled."]),
      R('avoid','nobeige','Not beige-dominated',{colors:['Beige','White'],maxShare:0.35},[null,"There's a lot of beige creeping back in."])
    ],
    reply:{ low:"A tiny bit fancier. A tiny bit more me.", mid:"It's like my room grew up and kept its personality.", high:"I'm going to tell the client it's from my 'inspiration space'. It's from you." },
    letter:{ hello:"OKAY SO,",
      body:["SOMEONE PAID ME. For a drawing of a heron in a raincoat. I've read the email eleven times. (I spent half of it at the flea market, on a clock.)",
            "Keep the easel and the blue, bring in three or four new things, and could we try pink? Also: I've named my fern Gerald and he needs a friend. The Carla couch comes in pink and I've been staring at it for days. And less beige. I can feel it creeping back."],
      bye:"Gratefully chaotic,", ps:"The heron is going on a mug." },
    reward:{ items:['lamp-kay-red','cowhide-carrie-cheetah'], bonus:['painting-horses-pink'] }, quirks:['jules_pair','jules_plant'] },

  { id:'JULES_03', n:13, char:'jules', job:'Illustrator', title:'A Desk for Grown-Up Work', property:'JULES_HOME_A', change:'refresh', edit:['studio'], allowance:48, minRenown:12,
    story:"The course is over. Jules graduated with a very small hat and a very large pile of unpaid invoices, and now works two days at the Dog-Eared Bookshop and draws the rest of the week. The easel is not enough anymore: clients want files, and files need a desk.",
    message:"I GRADUATED (in a hat that didn't fit). Now I have actual clients, who want actual files, who send actual emails. I need a desk, a proper chair and a laptop, and the easel has to stay, because the easel is my soul. Blue and orange, obviously. And please nothing from the beige family.",
    brief:[
      R('must','desk','A proper desk and a chair to go with it',{kinds:['desk'],min:1},["A desk! It's like having a job. Because I do."]),
      R('must','chairs','A desk chair',{kinds:['deskchair'],min:1},["My back will thank you. Eventually."]),
      R('must','tech','A laptop or a computer',{kinds:['tech'],min:1},["The laptop is the only thing in here that isn't messy. Wait, give it time."]),
      R('must','easel','Keep the easel, always',{kinds:['easel'],min:1},["The easel is still the boss."]),
      R('like','blue','Blue (and orange to go with it)',{colors:['Blue','Orange'],min:4},["Blue and orange, the only couple I believe in."]),
      R('like','mix','At least four different colours',{minDistinct:4},["It's chaos. Beautiful, planned chaos."]),
      R('avoid','nobeige','Not predominantly beige or white',{colors:['Beige','White'],maxShare:0.35},[null,"It's gone a bit beige in here again."])
    ],
    reply:{ low:"A desk and an easel. It's a start, and it's mine.", mid:"It's a studio that sends invoices. Very grown-up. Very me.", high:"I sent my first invoice from here and cried a bit. In a good way." },
    letter:{ hello:"HEY, {you}!!",
      body:["I GRADUATED. In a hat that didn't fit, holding a certificate that says my name wrong. I now work two days at the Dog-Eared Bookshop (the dog sits on my feet) and the rest of the week I draw things for people who send emails.",
            "Which means the attic needs a desk, a proper chair and a laptop. The easel stays, obviously; the easel is my soul. Blue and orange, lots of different colours, and please nothing from the beige family. I can still feel it."],
      bye:"Yours, newly employed,", ps:"A gallery is opening on the Far Shore. I'm trying not to look in its direction." },
    reward:{ items:['standing-lamp-hana-black','laptop-lumia'], bonus:['painting-fern-blue'] }, quirks:['jules_pair','jules_plant'] },

  { id:'JULES_04', n:19, char:'jules', job:'Illustrator · gallery artist', title:'The Paper Moth Wants Six', property:'JULES_HOME_B', change:'move', edit:['art'], allowance:60, minRenown:22,
    story:"The Paper Moth Gallery has asked Jules for six prints for its winter wall. A flat at the Mills just came free, with two rooms: one for painting, one for living. The painting room comes first.",
    message:"THE PAPER MOTH WANTS SIX OF MY PRINTS. SIX. I'm moving into a flat at the Mills with two rooms, and the first thing I need is the room for painting. Colour, please, as much as you can. Somewhere to hang the prints, somewhere to lay them out, and Gerald needs a spot with light.",
    brief:[
      R('must','art','The art room: an easel and something on the walls',{role:'artroom',room:'art'},["The art room smells of future mess. Perfect."]),
      R('must','table','A big table to lay prints out on',{kinds:['desk','dining'],min:1},["A big table. I'll be on the floor anyway, but now I'll feel guilty."]),
      R('must','tech','A laptop, for the emails the gallery sends',{kinds:['tech'],min:1},["The laptop looks very official. I'll cover it in paint."]),
      R('like','color','The art room bursting with colour',{minDistinct:5},["The art room is a rainbow that has had too much coffee. 10/10."]),
      R('like','prints','Plenty on the walls',{kinds:['wallart'],min:3},["Walls full of things. It's like a gallery that hasn't been introduced yet."]),
      R('like','plant','A plant by the window (Gerald, behave)',{kinds:['plant'],min:1},["Gerald has a view. He's insufferable."]),
      R('avoid','nobeige','Not beige or white',{colors:['Beige','White'],maxShare:0.3},[null,"It's looking a bit like a waiting room."])
    ],
    reply:{ low:"It's a room with an easel and walls. I'll fill the rest myself.", mid:"It's the first room I've had that looks like I mean it.", high:"I stood in the middle of it and said 'oh no, it's real.' Then I painted for six hours." },
    letter:{ hello:"{you}!! {you}!!",
      body:["THE PAPER MOTH WANTS SIX OF MY PRINTS. SIX. Not for the back room, not for the bargain basket, for the winter wall by the window. I have read the email so many times I can recite it.",
            "And the flat next to the stairwell at the Mills has come free: two rooms. The first one is for painting, so that comes first. Colour, as much as you dare. A big table for laying out prints, something on every wall, a laptop for the gallery emails and a good spot for Gerald."],
      bye:"Yours, slightly feral with excitement,", ps:"Mia has promised to bake. Nobody knows what for." },
    reward:{ items:['painting-livia','vase-lisa-orange'], bonus:['cowhide-carrie-rosa'] }, quirks:['jules_pair','jules_plant'] },

  { id:'JULES_05', n:25, char:'jules', job:'Gallery artist', title:'Somewhere to Live, Finally', property:'JULES_HOME_B', change:'more', edit:['living'], allowance:56, minRenown:35,
    story:"Six prints sold out in a week. The gallery wants twelve more. The painting room is full of canvases and the second room is still a mattress on the floor. Jules would like to be a person who lives somewhere, not just paints somewhere.",
    message:"They sold. All six! The gallery wants twelve more and I'd like to sleep somewhere that isn't a mattress next to the radiator. The second room is for living: somewhere to sleep, somewhere to sit, somewhere to eat toast. It can have plenty of colour but, please, a quieter kind than the art room, or I'll never fall asleep.",
    brief:[
      R('must','studio','Somewhere to sleep and somewhere to sit, in the same room',{role:'studio',room:'living'},["A bed AND a sofa. In one room. This is what grown-ups do."]),
      R('must','storage','Somewhere to put clothes and things: a wardrobe or a sideboard',{kinds:['wardrobe','sideboard'],min:1},["Storage! My clothes finally have a home. They're nervous."]),
      R('must','lamp','Lamps for a room that is lived in at night',{kinds:['lamp'],min:2},["A glow in the evening. Not a spotlight. Revolutionary."]),
      R('like','soft','Softer, more restful colours than the art room',{colors:['Beige','White','Blue','Pink','Rosa','Blush','Light Wood','Green'],minShare:0.5},["Quiet colours. I could actually sleep here."]),
      R('like','mix','Still at least three colours (nothing matching, ever)',{minDistinct:3},["Three colours. No waiting-room beige. I'm safe."]),
      R('like','plant','Plants (Gerald has cousins now)',{kinds:['plant'],min:2},["Gerald's whole family has moved in."]),
      R('avoid','nobeige','Not a beige waiting room',{colors:['Beige','White'],maxShare:0.4},[null,"The living room looks suspiciously like a dentist's waiting room."])
    ],
    reply:{ low:"It's somewhere to sleep. I don't ask for more tonight.", mid:"A home. With a sofa and everything. I almost don't recognise myself.", high:"I came home, kicked off my shoes and sat on the sofa. Just sat. That's what other people do." },
    letter:{ hello:"{you}, my friend,",
      body:["They SOLD. All six prints, in a week. The gallery wants twelve more and a person from the paper wants to take my photo. I told her I was busy. I wasn't. I just panicked.",
            "The painting room is done and I'm very proud of it. The other room is still a mattress next to the radiator. I'd like a room where I live: a bed, a sofa, a wardrobe, proper lamps for the evenings. Colourful, but quieter than the studio, or I'll never sleep."],
      bye:"Yours, newly a person with a sofa,", ps:"The gallery owner said I have 'a clear voice'. I've been walking around saying it to myself." },
    reward:{ items:['pillows-stacked-blue','lamp-heidi-red'], bonus:['curtain-siri-darkbrown'] }, quirks:['jules_pair','jules_plant','jules_mix'] },

  { id:'JULES_06', n:31, char:'jules', job:'Artist', title:'The Top Floor', property:'JULES_LOFT', change:'upstairs', edit:['living','bedroom','art'], allowance:112, minRenown:45,
    story:"Three years after the attic, with a gallery wall of her own and a waiting list for her prints, Jules has been offered the top floor of the mill: a loft with a door that closes and a room just for painting. This time it isn't luck. She earned it.",
    message:"The landlord offered me the top floor of the mill. THE TOP FLOOR. I said yes before he'd finished the sentence. It has an art room, a living room and a bedroom with a door that shuts. Give the art room ALL the colour. The bedroom should be soft. And please don't let the living room look like a reception area.",
    brief:[
      R('must','art','The art room: an easel and something on the walls',{role:'artroom',room:'art'},["The art room smells of future mess. Perfect."]),
      R('must','living','A living room to sit in',{role:'living',room:'living'},["The living room is lived-in already. Which is a polite way of saying messy."]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["I'm going to sleep in a bedroom. Away from the turpentine."]),
      R('must','tech','A desk and a laptop in the art room, for the business side',{pair:[{kinds:['desk']},{kinds:['tech']}],room:'art'},["A corner for invoices. In the art room. The art room approves."]),
      R('like','color','The art room bursting with colour',{minDistinct:5,room:'art'},["The art room is a rainbow that has had too much coffee. 10/10."]),
      R('like','soft','A quieter, softer bedroom',{colors:['Beige','White','Grey','Pink','Rosa','Blush','Light Wood'],minShare:0.6,room:'bedroom'},["The bedroom is the first calm room I've ever owned."]),
      R('like','prints','Plenty on the walls everywhere',{kinds:['wallart'],min:4},["Walls full of paintings. The gallery is jealous."]),
      R('avoid','reception','The living room is not a matching beige reception',{colors:['Beige','White'],maxShare:0.4,room:'living'},[null,"The living room looks suspiciously like a dentist's waiting room."])
    ],
    reply:{ low:"It's a loft. It's mine. I'll make it messier myself.", mid:"A door with my name on it. Technically a sticker.", high:"I'm hosting the first-ever Jules Open Studio on the top floor. Everyone will come. I will make cake." },
    letter:{ hello:"GUESS WHAT,",
      body:["The landlord offered me the top floor of the mill. THE TOP FLOOR. A live-work loft with three rooms and a door that closes. I said yes before he'd finished the sentence, then said yes again to be safe.",
            "The art room needs ALL the colour: easel, things on every wall, a corner for the boring business side, because there is one now. The living room must not look like a dentist's waiting room. The bedroom should be soft and quiet. And everywhere, as many paintings as the walls can bear."],
      bye:"Yours, no longer in an attic,", ps:"I've named the loft. It's called 'Gerald's Place'. He doesn't know." },
    reward:{ items:['pillows-stacked-orange','rug-iris-pattern-orange'], bonus:['wall-lamp-octavia'] }, quirks:['jules_pair','jules_plant','jules_mix'] },

  ],
  [
  /* ======================== SAM ======================== */
  { id:'SAM_01', n:2, char:'sam', job:'Events producer', title:'Dinner at Mine', property:'SAM_HOME_A', change:'new', edit:['kitchen'], allowance:42,
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
    reply:{ low:"It's a kitchen. I'll make dinner anyway — on the floor if needed.", mid:"This is a kitchen I'd happily burn something in.", high:"This is exactly the kitchen I wanted to invite people into. Dinner at mine. Bring wine." },
    letter:{ hello:"Good evening, {you},",
      body:["I've just moved for a better job and invited my whole team to dinner on Friday. Eleven people, a flat that seats four. It'll be wonderful.",
            "The kitchen comes first: dark wood, red, plenty of chrome and steel, an island big enough to put a party on, and a fridge that hums reassuringly. (I once saw brass beside chrome and had to sit down.) And gadgets: three mixers at least. No flowers (they wilt when I look at them) and nothing light and rustic.",
            "(The oven is on back-order. We don't discuss it.)"],
      bye:"Warmly, and in need of a whisk,", ps:"Friday, seven o'clock. That's an invitation, not a request." },
    reward:{ items:['recordplayer-darkwood','chrome-teecup'], bonus:['standmixer-smeggy-chrome'] }, quirks:['sam_metals'] },

  { id:'SAM_02', n:8, char:'sam', job:'Events producer', title:'Seats for Everyone', property:'SAM_HOME_A', change:'more', edit:['dining'], allowance:40, minRenown:5,
    story:"Dinner at Sam's has become a Thing. Eleven people ate in the kitchen last time, standing up, and the only casualty was a lemon. The dining room is the next step: a table, enough seats to pretend this was planned.",
    message:"The kitchen is a triumph. Eleven people ate in it and the only casualty was a lemon. Now give them somewhere to sit. A proper table, plenty of seats, dark wood and red, and a light that makes everyone look interesting. Still no flowers. Still nothing pale.",
    brief:[
      R('must','dining','A dining table and seats for the guests',{role:'dining',room:'dining'},["Twelve seats! … Okay, it's five. But it's the thought."]),
      R('must','seats','At least five seats around it',{kinds:['chair','stool','armchair'],min:5},["Five seats. A leap of faith. Guests will bring their own."]),
      R('like','dark','Dark wood and red',{colors:['Dark Wood','Red','Brown'],min:3},["The kitchen's mood carries through. Chef's kiss."]),
      R('like','light','A statement light over the table',{kinds:['lamp'],min:1},["A light that makes everyone look more interesting. That's the job."]),
      R('like','orange','Orange accents',{colors:['Orange'],min:1},["That orange! Sunset in a room."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"Flowers again. I see what's happening."]),
      R('avoid','nolightwood','No light rustic wood',{colors:['Light Wood'],max:0},[null,"A bit of light wood got in. It's like a cabin visited."])
    ],
    reply:{ low:"A table. People will sit. People are flexible.", mid:"I can already hear the clinking of glasses.", high:"People stayed until 2am and nobody wanted to leave the table. That's the review I wanted." },
    letter:{ hello:"My friend,",
      body:["The kitchen is a triumph. Eleven people ate in it and the only casualty was a lemon. A florist opened across the road; I have walked past it twice, on purpose.",
            "A dining table with enough seats to pretend I planned this. Dark wood, red, a touch of orange, and something to light it all. Wood should behave: one tone, not a lumberyard. Still no flowers. Still nothing pale."],
      bye:"Gratefully,", ps:"A guest called Robin did all the washing up. I have invited them back." },
    reward:{ items:['chandelier-ana','chessboard-marble'], bonus:['couch-uwe-dark-leather'] }, quirks:['sam_metals','sam_woods'] },

  { id:'SAM_03', n:14, char:'sam', job:'Events producer', title:'Somewhere to Collapse', property:'SAM_HOME_A', change:'more', edit:['living'], allowance:52, minRenown:12,
    story:"Robin keeps coming back, and so does the washing up. After dinner, everyone wants somewhere to lie around dramatically. The living room needs to be that somewhere.",
    message:"Dinner is going well. Too well. People stay until 2am, and they want somewhere to collapse afterwards. Leather, please. Keep the dark wood and the red, add some orange and a bit of chrome or black. (Robin says the room should feel 'lived in'. I said it already does. Robin said 'by a stage manager'.)",
    brief:[
      R('must','living','A living room with a couch, a table and a lamp',{role:'living',room:'living'},["The 'collapse afterwards' room works."]),
      R('must','seats','Room for six: at least three seats',{kinds:['couch','armchair','poof'],min:3},["Six people, one room, nobody standing. Triumph."]),
      R('like','leather','A leather couch or armchair',{materials:['Leather'],kinds:['couch','armchair'],min:1},["Leather. Smells expensive. Isn't. Perfect."]),
      R('like','dark','Dark wood and red continued from the kitchen',{colors:['Dark Wood','Red','Brown'],min:4},["The kitchen's mood carries all the way through."]),
      R('like','orange','Orange accents',{colors:['Orange'],min:2},["That orange! Sunset in a room."]),
      R('like','chrome','A few chrome or black pieces for drama',{colors:['Chrome','Black'],min:3},["A little chrome, a little black. Seventies in the best way."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"Flowers again. I see what's happening."]),
      R('avoid','nolightwood','No light rustic wood',{colors:['Light Wood'],max:0},[null,"A bit of light wood got in. It's like a cabin visited."])
    ],
    reply:{ low:"A place to sit. People will sit. People are flexible.", mid:"I can already hear the clinking of glasses.", high:"People stayed until 2am and nobody wanted to leave the couch. That's the review I wanted." },
    letter:{ hello:"Dear friend,",
      body:["Dinner at mine has become a regular thing. A day-of-the-week thing. Robin brings dessert, which is usually more impressive than my main course, which I'm not going to discuss.",
            "People stay until two in the morning and want somewhere to lie around dramatically afterwards. Leather, please. Keep the dark wood and red, add orange and a little chrome or black. Seats for six, at least. Wood should still behave: one tone. And still no flowers."],
      bye:"Warmly, with a wine glass in my hand,", ps:"Robin has brought a toothbrush. I'm choosing not to notice. Loudly." },
    reward:{ items:['kitchen-island-serena-steel','couch-uwe-light-leather'], bonus:['bust-art-dave-stone'] }, quirks:['sam_metals','sam_woods'] },

  { id:'SAM_04', n:20, char:'sam', job:'Head of events', title:'Robin Stays', property:'SAM_HOME_A', change:'more', edit:['bedroom'], allowance:46, minRenown:22,
    story:"Sam was promoted to head of events and Robin, who teaches at the primary school, has given up pretending the toothbrush is a coincidence. The bedroom has been a mattress and a lamp for two years. It's time.",
    message:"I got promoted! And Robin, who teaches Year 3 and sleeps lightly, has moved in. The bedroom has been a mattress with ambitions since I arrived. I'd like it to be proper: a real bed, a wardrobe, bedside tables, something calm. Robin says no dark things. I said it's my bedroom. Robin said 'it's OUR bedroom'. I'm getting used to it.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["Robin tested the bed immediately. Good sign."]),
      R('must','wardrobe','A wardrobe big enough for two people and one suit collection',{kinds:['wardrobe'],min:1},["A wardrobe that closes! I may have cried."]),
      R('must','lamps','A bedside lamp on each side',{kinds:['lamp'],min:2},["Two lamps. Equality."]),
      R('like','lightbed','A lighter bedroom: mostly beige, white and light wood',{colors:['Beige','White','Light Wood','Grey'],minShare:0.5},["Robin says it's the best room. I'm not offended. I'm a little offended."]),
      R('like','red','One bit of red for me',{colors:['Red','Orange'],min:1},["A touch of red. I'll allow it to be a signature."]),
      R('like','soft','Something soft underfoot',{kinds:['rug'],min:1},["A rug. Robin's feet have never been happier."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"I found a flower. I'm choosing to be calm."]),
      R('avoid','notdarkbed','Bedroom not heavily dark',{colors:['Black','Dark Wood'],maxShare:0.3},[null,"The bedroom is a touch dramatic for sleeping."])
    ],
    reply:{ low:"It's a bed in a room. Robin says it's progress.", mid:"A bedroom that isn't a stage set. I might cry.", high:"Robin slept for nine hours. NINE. I took a photo. I did not show Robin the photo." },
    letter:{ hello:"Dear friend,",
      body:["I got promoted. Head of events, which means a bigger budget and a bigger headache, and Robin has moved in properly, toothbrush and all. After two years the bedroom is still a mattress with ambitions.",
            "Make it proper. A real bed, a wardrobe that closes, a lamp on each side. Robin sleeps lightly, so nothing dark and dramatic; a lighter room, beige and white and light wood, with one bit of red so it still feels like me. And a soft rug. Still no flowers."],
      bye:"Warmly, and slightly outnumbered,", ps:"Robin plays the violin. Quietly. In another room. Yes, I'm in love." },
    reward:{ items:['lamp-sia-sblack','vase-otto-black'], bonus:['wall-lamp-muse'] }, quirks:['sam_metals','sam_woods','sam_robin'] },

  { id:'SAM_05', n:26, char:'sam', job:'Founder, Sam & Co. Events', title:'Sam & Co.', property:'SAM_OFFICE', change:'second', edit:['office'], allowance:66, minRenown:35,
    story:"Sam has done what every producer secretly dreams of: he quit. Sam & Co. Events has its first client, its first invoice and its first office: one room on Glass Row with a view of the quay. It needs to look like a company, and feel like Sam.",
    message:"I QUIT. Properly, with a speech. Sam & Co. Events has a client, an invoice and an office on Glass Row. I need it to look serious and feel like me: a big desk, a good chair, a laptop, a table for clients to sit at and nod, a couch for when the nodding gets tired. Dark wood, red, metal. Nothing pale. No flowers.",
    brief:[
      R('must','office','A proper office: a desk, a chair, a computer or laptop and a lamp',{role:'office',room:'office'},["It looks like a company. A company with taste."]),
      R('must','meeting','A table for meetings, with seats for four',{kinds:['dining'],min:1,room:'office'},["A table where deals get done. Or at least discussed."]),
      R('must','clients','Somewhere for clients to wait: a couch or two armchairs',{kinds:['couch','armchair'],min:1},["Clients will wait here happily. Briefly. Because I'm quick."]),
      R('like','dark','Dark wood and red',{colors:['Dark Wood','Red','Brown'],min:4},["Dark wood and red. The brand writes itself."]),
      R('like','metal','Chrome and steel to catch the light',{colors:['Chrome','Steel','Silver'],min:2},["Gleaming. Like a very confident spoon."]),
      R('like','art','Something on the wall: a painting or two',{kinds:['wallart'],min:2},["Art on the walls. Clients ask who it's by. I say 'a friend'."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"There's a flower in my office. Who sent a flower?"]),
      R('avoid','nolightwood','No light rustic wood',{colors:['Light Wood'],max:0},[null,"A bit of light wood. In my office. It's a cabin again."])
    ],
    reply:{ low:"It's an office. I'll make it mine with time and a very large coffee machine.", mid:"A real office. I'm a real CEO. Please don't tell anyone I cried in the lift.", high:"The first client walked in, looked around, and said 'you've done this before'. I haven't. I just have taste." },
    letter:{ hello:"Dear friend,",
      body:["I QUIT. With a speech. There was a standing ovation, mostly from the people I'd been planning events for. Sam & Co. Events now has a client, an invoice and one small office on Glass Row, with a view of the quay.",
            "It needs to look like a company and feel like me. A big desk, a good chair, a laptop. A table for meetings, with seats for four, and a couch for when the nodding gets tired. Dark wood, red, a bit of chrome, something on the walls. Wood still behaves: one tone. Still no flowers. Robin says I'm 'brave'. I think it was a compliment."],
      bye:"With a fresh business card and a fresher mortgage,", ps:"Robin has already booked the first anniversary party. In my office. For the staff. Which is me." },
    reward:{ items:['computer-divan','desk-ariana-darkwood-marble'], bonus:['deskchair-simonas-chrome'] }, quirks:['sam_metals','sam_woods'] },

  { id:'SAM_06', n:32, char:'sam', job:'Founder, Sam & Co. Events', title:'A Key for Both of Us', property:'SAM_HOME_B', change:'move', edit:['kitchen','living'], allowance:104, minRenown:45,
    story:"Sam & Co. has twelve clients and one waiting list. Robin has a permanent post at the school. Together they've bought a first-floor flat above the old market in Old Town: a big kitchen, a round-windowed living room and a violin that has been practising in silence for years.",
    message:"We bought a place! Robin and I. Over the old market in Old Town, with a kitchen the size of my entire first flat. The kitchen comes first, obviously, with gadgets worth bragging about. Then the living room: dark wood, red and leather, and a corner for Robin's violin. A little drama is a seasoning, not a main course. And no flowers!",
    brief:[
      R('must','kitchen','A working kitchen',{role:'kitchen',room:'kitchen'},["The kitchen. THE kitchen."]),
      R('must','gadgets','At least 3 cooking gadgets',{kinds:['gadget'],min:3},["Mixers, kettles, glory."]),
      R('must','living','A living room',{role:'living',room:'living'},["The living room has presence."]),
      R('must','violin','A corner for Robin’s violin: an instrument and a chair beside it',{pair:[{kinds:['instrument']},{kinds:['chair','armchair','stool']}],room:'living'},["Robin picked up the violin and played for the first time in front of me. I did not say a word."]),
      R('like','dark','Dark wood and red in the kitchen and living room',{colors:['Dark Wood','Red','Brown'],min:5},["The public rooms say 'Sam'."]),
      R('like','leather','Leather in the living room',{materials:['Leather'],kinds:['couch','armchair'],min:1,room:'living'},["Leather: it's practically a love language."]),
      R('like','metal','Chrome and steel in the kitchen',{colors:['Chrome','Steel','Silver'],min:3,room:'kitchen'},["The kitchen gleams. It's a bit smug. Like me."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"I found a flower. I'm choosing to be calm."]),
      R('avoid','nolightwood','No light rustic wood',{colors:['Light Wood'],max:0},[null,"A bit of light wood got in. It's like a cabin visited."])
    ],
    reply:{ low:"It's ours. That's the part that matters.", mid:"One home, many moods. I like it.", high:"Robin came home, put the kettle on and said 'ah'. I'm calling that five stars." },
    letter:{ hello:"Dear friend,",
      body:["Robin and I have bought a place. Together. A first-floor flat over the old market in Old Town, with a round window in the living room and a kitchen the size of my first flat. We own a dish rack. It's the best day of my life, and I have organised a lot of days.",
            "Kitchen first, obviously, with gadgets worth bragging about: mixers, kettles, a very large coffee machine. Then the living room: dark wood, red and leather, and in the corner a place for Robin's violin. A chair beside it, so the music has company. A little drama is a seasoning, not a main course. And no flowers."],
      bye:"Yours, in a rare moment of restraint,", ps:"Robin says I'm not allowed a second mixer. We'll see." },
    reward:{ items:['standmixer-lara-chrome','coffeemaschine-fika-grey'], bonus:['coffeemaschine-salana-chrome'] }, quirks:['sam_metals','sam_woods'] },

  ],
  [
  /* ======================== NOOR ======================== */
  { id:'NOOR_01', n:3, char:'noor', job:'Architect', title:'Somewhere to Switch Off', property:'NOOR_HOME_A', change:'new', edit:['bedroom'], allowance:32,
    story:"Noor has moved within Pennywhistle Cove after a breakup, and has decided that is entirely her own business. She wants one calm room finished before looking at the rest.",
    message:"The bedroom first. White, blue, light wood. I look at plans all day; I don't want work following me to bed. Fewer things, chosen well.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["It's quiet. The good kind."]),
      R('like','palette','Mostly white, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["The palette is… correct."]),
      R('like','blue','A little blue',{colors:['Blue'],min:1},["That blue is exactly the right amount."]),
      R('like','storage','Somewhere to put things away',{kinds:['sideboard','storage','wardrobe'],min:1},["Closed storage. The room can breathe."]),
      R('like','calm','Calm: no more than 12 pieces',{maxItems:12},["You left space. Do you know how rare that is?"]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"There's a pattern. It's shouting."])
    ],
    reply:{ low:"It's a bedroom. I'll make it work.", mid:"Calm. Mostly. I could sleep here.", high:"It feels calm. You paid attention. Most people don't." },
    letter:{ hello:"Hello.",
      body:["Sam passed on your details. He said you actually listen. I'll assume that's true.",
            "I've moved. That's not up for discussion. I'd like one room finished: the bedroom. A bed, a bedside table, white, a little blue, light wood. Twelve things at most; I counted. Somewhere to put things away. No busy patterns, and matching grain matters to me."],
      bye:"Regards,", ps:"If a shelf is two centimetres off, I'll know." },
    reward:{ items:['standing-lamp-kai','painting-fog'], bonus:['wallshelf-vila'] }, quirks:['noor_wood'] },

  { id:'NOOR_02', n:9, char:'noor', job:'Architect', title:'You Understood Me', property:'NOOR_HOME_A', change:'more', edit:['living'], allowance:40, minRenown:5,
    story:"Noor liked the bedroom enough to say so. Out loud. In the office, within hearing of two colleagues. She'd like the living room to follow it.",
    message:"You listened. The bedroom works. I'd like the living room to follow, with the same restraint but its own temperament. Light wood, white and blue, somewhere to sit that isn't a chair I'm tolerating. Keep the blue.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room does exactly what it should."]),
      R('like','palette','White, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["Same restraint. Different room. Well done."]),
      R('like','wood','Light wood',{colors:['Light Wood'],min:2},["The wood in the living room is lovely."]),
      R('like','read','Somewhere to read: a good chair and a lamp',{kinds:['armchair'],min:1},["A chair worth sitting in. Rare."]),
      R('like','calm','No more than 14 pieces',{maxItems:14},["You left things out. That's craftsmanship."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"There's a pattern. I'm trying to ignore it."])
    ],
    reply:{ low:"Functional. I can work with that.", mid:"It feels like one person lives here. That person is me.", high:"I invited my sister over. I didn't tidy first. That's how I know." },
    letter:{ hello:"Hello again.",
      body:["The bedroom works. I said so out loud, in the office. One colleague dropped a stapler.",
            "Now the living room: the same restraint, but its own temperament. Light wood, a little blue, white and grey. A chair I actually want to sit in, and a good lamp beside it. Fourteen pieces at most. No patterns. (Chrome next to brass is a family argument.)"],
      bye:"Regards,", ps:"My sister asked who did the bedroom. I said ‘someone good’." },
    reward:{ items:['bust-art-lisa-stone','couchtable-marble-elle-light'], bonus:['chandelier-kiki'] }, quirks:['noor_wood','noor_metal'] },

  { id:'NOOR_03', n:15, char:'noor', job:'Architect', title:'A Room for Practice', property:'NOOR_HOME_A', change:'more', edit:['music'], allowance:44, minRenown:12,
    story:"At the antiques shop on Lantern Lane, Noor walked in to measure a window and walked out with a plan to learn the piano at forty-one. The practice room is the little spare room, and it has two rules: neighbours must not hear, and nothing is allowed to look like a hobby.",
    message:"I've decided to learn the piano. At forty-one. Don't comment. I need a small room for it: an instrument, a good chair, somewhere for sheet music, a lamp. And something soft on the floor or at the window; the neighbours have views. White, blue, light wood as ever. No more than ten things.",
    brief:[
      R('must','music','A music room: an instrument, somewhere to sit and a place for the sheet music',{role:'music',room:'music'},["I played one note. It was the right one. I'm calling it progress."]),
      R('like','palette','White, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["The room has the same tone as the rest. Calm."]),
      R('like','lamp','One good lamp',{kinds:['lamp'],min:1},["A lamp that doesn't glare. Considered."]),
      R('like','calm','Calm: no more than 10 pieces',{maxItems:10},["Ten things. I counted."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"There's a pattern. It's off-key."]),
      R('avoid','nodrums','No drums. The neighbours have views.',{kinds:['drums'],max:0},[null,"Drums. The neighbours will have more than views."])
    ],
    reply:{ low:"It's a keyboard in a corner. I'll make it work.", mid:"I can practise here. That's all I wanted.", high:"I played the first eight bars of something. Nobody banged on the wall. I'll call that a concert." },
    letter:{ hello:"Hello.",
      body:["I'd like to say something and ask you not to comment. I have decided to learn the piano. I'm forty-one. I walked into the antiques shop to measure a window and walked out with a plan.",
            "The little spare room will be the practice room: an instrument (a keyboard is acceptable; the piano is a long-term goal), a good chair, a place for the sheet music, and one good lamp. White, blue, grey, light wood. Something soft, a rug or a curtain, because the neighbours have views. Ten things, at most. No drums."],
      bye:"Regards, with a very small ambition,", ps:"My sister has laughed twice. She's since apologised. Once." },
    reward:{ items:['keyboard-jannis','chessboard-beige'], bonus:['curtain-lana-white'] }, quirks:['noor_wood','noor_metal','noor_soft'] },

  { id:'NOOR_04', n:21, char:'noor', job:'Architect, partner', title:'A Place of My Own', property:'NOOR_HOME_B', change:'upstairs', edit:['living'], allowance:56, minRenown:22,
    story:"Noor made partner and bought the top floor of her own building: tall windows, a ceiling you could lose a kite in, and absolutely one rule: no desk. 'Desks are how work follows you home.' The living room comes first.",
    message:"I made partner. I bought the top floor of my own building, so I intend to stay. I'd like the living room to feel considered: a place to sit at the end of the day, a stone or marble piece, and as much air as possible. No desk. A chair, a shelf, a good lamp.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["I'll sit here at the end of every day."]),
      R('must','read','A shelf with books, within reach of the chair',{kinds:['books','bookshelf'],min:1},["A shelf and a chair. It's all I'll ever need."]),
      R('like','stone','One good stone or marble piece',{materials:['Marble','Stone'],min:1},["That marble piece: considered. I noticed."]),
      R('like','palette','White, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood','Travertine'],minShare:0.55},["Clean. Proportional. Quietly correct."]),
      R('like','calm','No more than 12 pieces',{maxItems:12},["Lots of air. Lots of calm."]),
      R('avoid','nodesk','No desk',{kinds:['desk'],max:0},[null,"There's a desk in the living room. I'm choosing to not look."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"A pattern. Of course."])
    ],
    reply:{ low:"It's a start. I'll live with it.", mid:"Considered. That's the word I'd use.", high:"I came home from the site, took my shoes off, and nobody needed me. The flat agrees. Thank you." },
    letter:{ hello:"Hello.",
      body:["I made partner. The firm will have my name on the door. I celebrated by buying the top floor of my own building: tall windows, a ceiling you could lose a kite in. I intend to stay.",
            "Living room first. A place to sit at the end of the day, a shelf within reach, one good stone or marble piece. White, blue, grey, light wood; twelve things at most; no patterns. And no desk. A chair, a shelf, a good lamp. Desks are how work follows you home."],
      bye:"With some warmth, which I'm told is noticeable,", ps:"The windows are 3.4 metres tall. I measured twice." },
    reward:{ items:['fireplace-marlo-marble-white','bedsidetable-moppy-marble'], bonus:['vase-otto-white'] }, quirks:['noor_wood','noor_metal'] },

  { id:'NOOR_05', n:27, char:'noor', job:'Architect, partner', title:'Two Quiet Rooms', property:'NOOR_HOME_B', change:'more', edit:['bedroom','study'], allowance:74, minRenown:35,
    story:"The living room is finished and Noor has started closing the door on the rest. Two rooms are left: a bedroom that should feel like a deep breath, and a small room to think in, where the lamp matters more than the furniture.",
    message:"The living room works. Now the other two: the bedroom, quiet, with plenty of air. And the small room, which is for thinking: a chair, a shelf, one lamp. One. Not none, not three. No desk. I'll know if there is.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom is a respite."]),
      R('must','study','The quiet room: a shelf or sideboard, a chair and a good lamp',{role:'study',room:'study'},["The quiet room. A chair, a shelf, a lamp. Perfect."]),
      R('like','palette','White, blue, grey and light wood',{colors:['White','Blue','Grey','Light Wood','Travertine'],minShare:0.55},["Clean. Proportional. Quietly correct."]),
      R('like','soft','Something soft underfoot in the bedroom',{kinds:['rug'],min:1,room:'bedroom'},["A rug. My feet noticed first."]),
      R('like','calm','No more than 12 pieces per room',{maxItems:12,rooms:['bedroom','study'],each:true},["Lots of air. Lots of calm."]),
      R('avoid','nodesk','No desk',{kinds:['desk'],max:0},[null,"A desk in here. Of all places."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"A pattern. Of course."])
    ],
    reply:{ low:"Two rooms. I can live with that.", mid:"Considered. Both of them.", high:"I closed the door of the small room and thought one whole thought. Without a single email. Thank you." },
    letter:{ hello:"Hello.",
      body:["The living room works. I sit in it every evening. Now the others: the bedroom, quiet, with plenty of air, and the small room at the end, which is for thinking.",
            "The small room needs a chair, a shelf and one lamp. One. Not none, not three. White, blue, grey, light wood, no more than twelve pieces a room, no patterns. And still no desk. I'd have mentioned it, but you already know."],
      bye:"Regards,", ps:"I've started playing a piece with both hands. Very slowly. Don't tell my sister." },
    reward:{ items:['wall-lamp-nati','rug-hadi-beige'], bonus:['curtain-maya-beige'] }, quirks:['noor_wood','noor_metal','noor_lamp'] },

  { id:'NOOR_06', n:33, char:'noor', job:'Founder, Noor Architects', title:'Noor Architects', property:'NOOR_OFFICE', change:'second', edit:['office'], allowance:68, minRenown:45,
    story:"Noor left the firm. Not dramatically. She handed in her resignation on a Tuesday, in a typed letter, with three copies. Noor Architects now has a client, a small office near the quay and a very strong opinion about desks. This is the one place she will have one.",
    message:"I've left the firm. Not dramatically; I sent three copies of the letter. Noor Architects has an office near the quay, and I'd like it to be exactly right. A proper desk (the one place I'll allow it), a good chair, a laptop, a big table to lay drawings on. Light wood, white, grey, a little blue. Air. And a plant. One.",
    brief:[
      R('must','office','A proper office: a desk, a chair, a computer or laptop and a lamp',{role:'office',room:'office'},["A desk. Finally. In the right place."]),
      R('must','table','A big table for laying out drawings',{kinds:['dining','desk'],min:2},["The drawings fit. Edge to edge. I measured."]),
      R('must','shelf','A shelf for the model-making',{kinds:['bookshelf','sideboard','wallshelf'],min:1},["A shelf. For the models. They'll love it."]),
      R('like','palette','White, grey, blue and light wood',{colors:['White','Blue','Grey','Light Wood','Travertine'],minShare:0.55},["Calm. The clients will relax and sign."]),
      R('like','plant','One plant. Exactly one.',{kinds:['plant'],min:1,max:1},["One plant. It has a name now, and I won't tell you what."]),
      R('like','calm','No more than 14 pieces',{maxItems:14},["Air. The architecture speaks for itself."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"A pattern. In the office. Of course."]),
      R('avoid','nodark','Nothing dark or black',{colors:['Black','Dark Wood'],maxShare:0.15},[null,"Rather a lot of dark for a place with good light."])
    ],
    reply:{ low:"It's an office. It'll do until I make it better.", mid:"Considered. The first client said so, out loud.", high:"I stood in the doorway for a full minute. The room was exactly right. I didn't want to spoil it by going in." },
    letter:{ hello:"Hello.",
      body:["I've left the firm. Not dramatically; I handed in a typed letter, in triplicate, on a Tuesday. Noor Architects now has one client, a small office near the quay and a very strong opinion about desks.",
            "This is the one place I will have one. A proper desk, a good chair, a laptop. A big table for drawings, a shelf for models, one lamp that doesn't glare. White, grey, a little blue, light wood; no patterns; air. And one plant. Exactly one. I'll know if there are two."],
      bye:"With some warmth, which people keep noticing,", ps:"The piano piece is nearly finished. The neighbours have asked for an encore. I said no." },
    reward:{ items:['standing-lamp-taria','desk-matthias-lightwood'], bonus:['deskchair-hinata-white'] }, quirks:['noor_wood','noor_metal'] },

  ],
  [
  /* ======================== THEO ======================== */
  { id:'THEO_01', n:4, char:'theo', job:'Baker', title:'Before the Baby Arrives', property:'THEO_HOME_A', change:'new', edit:['living'], allowance:32,
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
    reply:{ low:"It's a good start. We'll make it ours.", mid:"This feels like somewhere we can actually settle in.", high:"Elena cried a little and said it was 'hormones'. I think it was the sideboard." },
    letter:{ hello:"Hi there!",
      body:["Noor said you were good, and she doesn't say that about anyone. Elena and I have found a little cabin up on Lantern Lane. The baby's due in spring and the living room is full of ‘temporary solutions’. Elena calls blue and yellow ‘our colours’, like the shop sign.",
            "We'd love somewhere to sit and breathe: white, a bit of yellow, some blue, solid wood. Nothing white to sit on (small person incoming) and nothing breakable. I once owned a vase. It's a sad story. We kept the old sideboard. It might be useful."],
      bye:"Cheers!", ps:"If you ever need bread, I'm yours. I'm not great with words." },
    reward:{ items:['rug-elena-yellow','globe'], bonus:['recordplayer-old-mediumwood'] }, quirks:['theo_colours'] },

  { id:'THEO_02', n:10, char:'theo', job:'Baker', title:'A Room for Us, Too', property:'THEO_HOME_A', change:'more', edit:['bedroom'], allowance:36, minRenown:5,
    story:"The baby has arrived and so has a lot of laundry. Theo and Elena have spent their money on essentials and left their own bedroom for last. They'd love one room that's restful and adult.",
    message:"She's here! Wren, a few weeks old, very loud. The living room still makes us happy. Could you help with our bedroom now? Elena suggested green. I'd like to keep the wood and keep it simple. And somewhere to put clothes that isn't 'the chair'. Wren has started rolling around like a small sausage, so something soft on the floor.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["It's a real bedroom. With a bed we can find the floor around."]),
      R('must','storage','Somewhere to put clothes: a sideboard, cabinet or wardrobe',{kinds:['sideboard','wardrobe'],min:1},["Storage that isn't a chair. Finally."]),
      R('like','green','Green and white',{colors:['Green','White','Beige'],minShare:0.5},["Green and white. Elena says it's 'calm in a fresh way'."]),
      R('like','wood','Sturdy wood',{colors:['Light Wood','Medium Wood'],min:2},["The wood keeps it grounded."]),
      R('avoid','nowhitebed','No white bed',{kinds:['bed'],colors:['White'],max:0},[null,"A white bed, with a baby in the house? Daring."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. I'm sorry. Our history with vases is not good."])
    ],
    reply:{ low:"It's somewhere to sleep. That's a lot, right now.", mid:"Restful. Adult. That's all we asked.", high:"We slept for six hours straight. The baby did too. Is this witchcraft?" },
    letter:{ hello:"Hi again!",
      body:["She's here! Wren, a few weeks old, very loud, already stealing my heart and my socks. Elena sends a tired thank-you for the living room.",
            "Wren has started rolling across rooms like a small sausage. Our bedroom is last on the list. Restful, please: green and white, sturdy wood, a bed that isn't white, a soft rug, and somewhere for clothes that isn't ‘the chair’. It has become load-bearing. Nothing fragile."],
      bye:"Sleepily yours,", ps:"Rosa has offered to sew Wren a coat. I'm scared of her." },
    reward:{ items:['curtain-siri-green','books-leaning-beige'], bonus:['lamp-hubby'] }, quirks:['theo_colours','theo_roll'] },

  { id:'THEO_03', n:16, char:'theo', job:'Baker', title:'Where the Bread Begins', property:'THEO_HOME_A', change:'more', edit:['kitchen'], allowance:46, minRenown:12,
    story:"The old baker at Crumb & Crown has offered Theo a share in the bakery. Theo wants to be ready: he's been baking test loaves at three in the morning, in a cabin kitchen that was not made for it. The kitchen needs to catch up with him.",
    message:"The old baker offered me a share of the bakery! I said yes, then threw up in a bush. Before I start I want to practise at home, so the kitchen needs to work: counter, fridge, a mixer or two, a table where Elena can sit and taste. Stools at the counter, I'm always up and down. Warm colours: blue and yellow, our colours, and solid wood. Nothing fragile near the flour.",
    brief:[
      R('must','kitchen','A working kitchen: a counter or island, and a fridge',{role:'kitchen',room:'kitchen'},["It's a kitchen where bread can happen. Finally."]),
      R('must','gadgets','At least 2 cooking gadgets: mixers and the like',{kinds:['gadget'],min:2},["Two mixers. I'll bake the whole street a loaf."]),
      R('must','table','A table for Elena to sit and taste at',{kinds:['dining','sidetable'],min:1},["Elena sat down and tasted. She said 'more salt'. She's right."]),
      R('like','palette','Blue, yellow, white and solid wood',{colors:['White','Beige','Blue','Yellow','Orange','Light Wood','Medium Wood'],minShare:0.6},["It's cheerful AND practical. A rare combo."]),
      R('like','plant','A plant or herbs on the windowsill',{kinds:['plant'],min:1},["Herbs by the window. Elena says it's the cutest thing in the house."]),
      R('avoid','novases','Nothing fragile near the flour',{kinds:['vase'],max:0},[null,"A vase. Near the flour. Our nemesis."]),
      R('avoid','nochrome','Not too shiny and chrome',{colors:['Chrome'],max:2},[null,"A bit too much chrome for a cabin."])
    ],
    reply:{ low:"It's a kitchen. Loaves will be made. Possibly burnt.", mid:"A proper baker's kitchen at home. Elena says I'm unbearable.", high:"I baked my first perfect loaf here at four in the morning and cried a little into the flour. It was a good loaf." },
    letter:{ hello:"Hey you,",
      body:["Two bits of news. The old baker at Crumb & Crown has offered me a share of the bakery (I said yes, then threw up in a bush), and Wren has said her first word. It was 'Dada'. Elena says she was pointing at the bread.",
            "Before I start I'd like to practise properly at home, so the cabin kitchen needs to work: counter, fridge, a mixer or two, a table where Elena can sit and taste. Stools at the counter; I'm always up and down. Blue, yellow, white and solid wood. A plant on the windowsill. Nothing fragile near the flour."],
      bye:"Thank you, again and always,", ps:"Come by at six one morning. The first loaf is yours." },
    reward:{ items:['standmixer-sina-white','kettle-bruno-beige'], bonus:['mixer-jochen-green'] }, quirks:['theo_colours','theo_stools'] },

  { id:'THEO_04', n:22, char:'theo', job:'Baker, co-owner of Crumb & Crown', title:'The Corner Table', property:'THEO_BAKERY', change:'second', edit:['shop'], allowance:60, minRenown:22,
    story:"The old baker has retired to a deckchair and left Crumb & Crown to Theo, who has never owned anything bigger than a sourdough starter. The shop has a corner no one has ever known what to do with. Theo thinks it should be a place to sit, eat a roll and not be rushed.",
    message:"The old baker retired and left me the keys, and the cat. I'd like to turn the empty corner of the shop into a place to sit. Small tables, enough chairs, a plant or two, somewhere to put the cakes. It should feel like our kitchen at home, only with more flour. Blue and yellow, solid wood. Nothing fragile!",
    brief:[
      R('must','tables','At least two tables for customers',{kinds:['dining','coffeetable'],min:2},["Two tables. People already want the corner one."]),
      R('must','seats','At least five seats',{kinds:['chair','stool','armchair'],min:5},["Seats! Customers can stay more than five minutes."]),
      R('must','counter','A counter for the cakes',{kinds:['counter'],min:1},["The cakes finally have a stage."]),
      R('like','palette','Blue, yellow, white and solid wood',{colors:['White','Beige','Blue','Yellow','Orange','Light Wood','Medium Wood'],minShare:0.6},["It's cheerful AND practical."]),
      R('like','plants','A couple of plants',{kinds:['plant'],min:2},["Plants. The shop cat has already claimed one."]),
      R('like','light','Warm lights over the tables',{kinds:['lamp'],min:2},["Warm light. It smells like bread even at night."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. In a bakery. Customers will find it."]),
      R('avoid','nodark','Not too dark',{colors:['Black','Dark Wood'],maxShare:0.2},[null,"A bit dark for a place that opens at seven."])
    ],
    reply:{ low:"It's a corner with chairs. Customers will fill it.", mid:"A place to sit. Customers are already confused by how nice it is.", high:"Someone stayed an hour. At a bakery! Over a roll! I nearly cried into the till." },
    letter:{ hello:"Hey you,",
      body:["The old baker has retired to a deckchair and left me the keys. And the cat, who has opinions. Crumb & Crown is mine now, mostly. There's a corner at the back that nobody has ever known what to do with.",
            "I want it to be a place to sit: small tables, enough chairs, a counter for the cakes, a plant or two and warm lights. It should feel like our kitchen at home, only with more flour. Blue and yellow, solid wood, nothing fragile."],
      bye:"Flour on my nose and everywhere else,", ps:"The shop cat has claimed the best chair. I'm not going to argue." },
    reward:{ items:['stacked-bowls-white','coffee-maker-filter-hannes'], bonus:['mocca-maker-fred-white'] }, quirks:['theo_colours'] },

  { id:'THEO_05', n:28, char:'theo', job:'Baker, owner of Crumb & Crown', title:'Enough Room for Everyone', property:'THEO_HOME_B', change:'move', edit:['living','dining'], allowance:80, minRenown:35,
    story:"Wren has discovered stairs, Elena has discovered a spare year of savings, and the cabin has discovered it has no more room. They've found a family flat on Orchard Rise with a proper dining room. They brought the sideboard. It followed them.",
    message:"We've found a flat with a proper dining room! I'd love us all to sit down together when family visits. Grandad only trusts wood he can knock on, so a wooden table, please. Bring what still works from the cabin; we don't need to start from zero. (The sideboard is back. It followed us.)",
    starters:[ {room:'living', asset:'sideboard-akio-mediumwood', x:60, y:58, width:null} ],
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room is comfy and ready for naps."]),
      R('must','dining','A dining room with a table and seats',{role:'dining',room:'dining'},["A table. For everyone. I might cry into the soup."]),
      R('like','palette','White, green, yellow and blue, with wood',{colors:['White','Beige','Green','Yellow','Orange','Blue','Light Wood','Medium Wood'],minShare:0.65},["It's cheerful AND practical. A rare combo."]),
      R('like','mustard','A touch of yellow',{colors:['Yellow','Orange'],min:1},["Yellow is back."]),
      R('like','wood','Sturdy wood in a few places',{colors:['Light Wood','Medium Wood'],min:3},["Plenty of good wood."]),
      R('like','soft','Something soft on the floor in both rooms (Wren is walking)',{kinds:['rug'],min:1,rooms:['living','dining'],each:true},["Soft landings everywhere. Wren fell on three of them already."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. Our nemesis."]),
      R('avoid','nowhite','No white upholstery',{kinds:['couch','armchair','bed'],colors:['White'],max:0},[null,"White upholstery. In THIS household."])
    ],
    reply:{ low:"It's a home. We'll fill the rest with noise.", mid:"A proper family flat. We're delighted.", high:"Everyone sat at the table and nobody wanted to leave. Even Wren's grandad. That never happens." },
    letter:{ hello:"Hey you,",
      body:["Wren has discovered stairs and the cabin has discovered it has no more space. We've found a flat on Orchard Rise with a proper dining room. And the bakery's doing well enough that Elena says ‘yes, we can’, which is the first time in five years.",
            "I'd love everyone round one table: grandad, aunts, the lot. (Grandad only trusts wood he can knock on.) A living room for naps, a dining room for noise, something soft on the floor because Wren is walking at full speed. Bring what still works from the cabin. The sideboard followed us. It does that. Same as before: white, green, yellow, blue, solid wood, nothing fragile."],
      bye:"Thank you, again and always,", ps:"Come by at six one morning. The first loaf is still yours." },
    reward:{ items:['fireplace-milo-stone-beige','couch-hennes-green-long'], bonus:['stacked-plates-beige'] }, quirks:['theo_colours','theo_knock'] },

  { id:'THEO_06', n:34, char:'theo', job:'Baker, owner of Crumb & Crown', title:'A Big-Girl Room', property:'THEO_HOME_B', change:'more', edit:['wren'], allowance:52, minRenown:45,
    story:"Wren is two and a bit, has opinions about socks and has outgrown the cot. Elena has also, very quietly, mentioned that there might be another small person on the way. Both are reasons to make a room that grows with them.",
    message:"Wren is two and a bit and needs a room of her own. A bed (not white!), somewhere for toys and clothes, a soft rug, a few books, and enough colour to make it hers. Elena says there might be another one coming. We've told nobody. We're telling you. Nothing fragile, please. She throws things.",
    brief:[
      R('must','bed','A proper bed',{kinds:['bed'],min:1},["A big-girl bed. Wren climbed in and refused to get out."]),
      R('must','storage','Somewhere for toys and clothes',{kinds:['wardrobe','sideboard','storage'],min:1},["A place for everything. For about a week."]),
      R('must','rug','A soft rug',{kinds:['rug'],min:1},["Soft landings guaranteed."]),
      R('like','books','A few books',{kinds:['books','bookshelf'],min:1},["Wren has already pulled all the books out. Happily."]),
      R('like','color','Bright and cheerful: at least four colours',{minDistinct:4},["It's a rainbow with a bed. She loves it."]),
      R('like','plant','A plant out of reach',{kinds:['plant'],min:1},["A plant. She's already named it. It's called 'Bread'."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. She throws things. We've talked about this."]),
      R('avoid','nowhite','No white bed',{kinds:['bed'],colors:['White'],max:0},[null,"A white bed. Brave. Messy. Wren says hello."])
    ],
    reply:{ low:"It's a bed and a rug. She says it's a castle.", mid:"Her own room. She said 'mine'. It's her favourite word.", high:"She fell asleep in her own room without a fuss. Elena and I looked at each other like we'd won the lottery." },
    letter:{ hello:"Hey you,",
      body:["Wren is two and a bit, has opinions about socks and has outgrown the cot. She needs a room of her own: a bed that isn't white (we've learnt), a place for toys and clothes, a soft rug, a few books, and enough colour to make it hers.",
            "And I'd like you to be the first to know that Elena says there might be another one on the way. We've told nobody. Not even grandad. Nothing fragile, please. She throws things."],
      bye:"Thank you, again and always,", ps:"The bakery has a queue round the corner. A queue! Someone's brought a chair." },
    reward:{ items:['pillow-willow-green','bockstack-02'], bonus:['cushion-lala-rosa'] }, quirks:['theo_colours','theo_rug'] },

  ],
  [
  /* ======================== ROSA ======================== */
  { id:'ROSA_01', n:5, char:'rosa', job:'Retired costume maker', title:'Finally, the Sitting Room', property:'ROSA_HOME_A', change:'new', edit:['sitting'], allowance:42,
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
    reply:{ low:"It's a start. I'll complain about it fondly.", mid:"Plenty of colour, and it still feels like my home. Good.", high:"I sat in it and wanted to hold a small dinner party immediately. That's a compliment, darling." },
    letter:{ hello:"My dear,",
      body:["I have retired from thirty-one years in the costume department of the Playhouse and been told to ‘relax’. I have never been less relaxed. My sitting room has been wrong since 1998. (I hear an antiques shop is opening on Lantern Lane. I intend to be unbearable about it.)",
            "The sideboard stays. Everything else must earn its place: two places to sit, a table, and a lamp with personality. I light a room like a stage: never from just one place. And colour, darling: red, yellow, dark wood and something patterned. What I will not have is a pale room. Not beige. Not ‘greige’."],
      bye:"With great expectations,", ps:"Theo says you're good. He once tried to pay me in sourdough." },
    reward:{ items:['candle-kiki-off','rug-malana-orange-pattern'], bonus:['lamp-sia-gold'] }, quirks:['rosa_lights'] },

  { id:'ROSA_02', n:11, char:'rosa', job:'Retired costume maker', title:'Stay for Tea', property:'ROSA_HOME_A', change:'more', edit:['dining'], allowance:44, minRenown:5,
    story:"Rosa has started teaching a little sewing class in the village hall, and everyone stays for tea afterwards. 'Everyone' is currently six people and one opinionated dachshund. The dining room needs to take them.",
    message:"I've begun teaching sewing at the village hall and everyone stays for tea. ‘Everyone’ is six people and a dachshund. The dining room needs a proper table, seats for all, and the mood of a stage set before the curtain goes up: red, yellow, dark wood, a touch of gold. And please, one pattern, darling. Not a choir.",
    brief:[
      R('must','dining','A dining table with seats',{role:'dining',room:'dining'},["Tea for six, and a debate. Perfect."]),
      R('must','seats','At least six seats',{kinds:['chair','stool','armchair'],min:6},["Six seats. And the dachshund has chosen the seventh."]),
      R('like','dining','Red, yellow and dark wood',{colors:['Red','Orange','Yellow','Dark Wood','Brown'],minShare:0.4},["The dining room is a stage set for conversation."]),
      R('like','brass','A touch of brass or gold',{colors:['Brass','Gold'],min:1},["A bit of gold. One should always have a bit of gold."]),
      R('like','dark','Dark wood',{colors:['Dark Wood'],min:2},["The wood is substantial. I approve."]),
      R('like','lights','Light from more than one place',{kinds:['lamp'],min:2},["Two lights at different heights. Now it has a stage."]),
      R('avoid','nowhite','Not white and pale everywhere',{colors:['White'],maxShare:0.25},[null,"Too much white. It's a hospital, not a home."])
    ],
    reply:{ low:"A fine beginning. One expects improvements.", mid:"Lovely. Now everyone will stay even longer. Good.", high:"Six people stayed until midnight. I've found the room's 'one more cup' effect. Marvellous." },
    letter:{ hello:"Darling,",
      body:["I've begun teaching sewing at the village hall, and everyone stays for tea afterwards. ‘Everyone’ is currently six people and one opinionated dachshund.",
            "Pattern is a soloist, not a choir. The dining room needs a proper table, seats for all, and the mood of a stage set before the curtain goes up: red, yellow, dark wood, a touch of gold, light from more than one place. And no white. It's a home, not a hospital."],
      bye:"Fondly, and with a flourish,", ps:"Mia's dahlias have the whole village talking." },
    reward:{ items:['bust-art-alena-stone','couch-henry-red'], bonus:['chandelier-irina'] }, quirks:['rosa_lights','rosa_solo'] },

  { id:'ROSA_03', n:17, char:'rosa', job:'Sewing teacher', title:'The Sewing Room', property:'ROSA_HOME_A', change:'more', edit:['spare'], allowance:54, minRenown:12,
    story:"The class has grown to twelve, with a waiting list and a very slow-moving dachshund. The 'room where I put things I haven't decided about' has to decide. It needs to be a proper workroom, with enough light to see the colour of thread, and a corner for her daughter's weekend bed.",
    message:"The class has twelve people and a waiting list. The spare room has to become a proper sewing room: a table big enough to cut cloth on, seats for the class, shelves for the fabric, good light from more than one place, and no curtains, darling. One must see colour in daylight. And a daybed in the corner for my daughter at weekends.",
    brief:[
      R('must','sewing','A sewing room: a big table to cut on, a chair and good light',{role:'sewing',room:'spare'},["A table to cut on! One feels like a professional again."]),
      R('must','seats','Seats for the class: at least four',{kinds:['chair','stool','armchair'],min:4},["Four seats. The class has doubled; the seats must follow."]),
      R('must','shelf','Shelves or a sideboard for the fabric',{kinds:['sideboard','bookshelf','wallshelf','wardrobe'],min:1},["Fabric has a home. I could weep."]),
      R('like','colour','Red, yellow, blue and green: colour to match the thread',{colors:['Red','Yellow','Blue','Green','Orange'],min:3},["It looks like a box of embroidery thread. Heaven."]),
      R('like','bed','A daybed or couch for my daughter',{kinds:['couch','bed'],min:1},["A corner for my daughter. She'll complain, then stay a week."]),
      R('like','lights','Light from more than one place',{kinds:['lamp'],min:2},["Good light. Now one can see what one has done wrong."]),
      R('avoid','nocurtains','No curtains: one must see colour in daylight',{kinds:['curtain'],max:0},[null,"Curtains, darling? In a sewing room? One can't see colour through lace."]),
      R('avoid','nowhite','Not white and pale everywhere',{colors:['White'],maxShare:0.25},[null,"Too much white. It's an operating theatre."])
    ],
    reply:{ low:"It's a room with a table. The thread will do the rest.", mid:"The class has taken over the whole flat. Gloriously.", high:"Twelve people stitched till dusk and nobody checked a phone. That's my review." },
    letter:{ hello:"Darling,",
      body:["The class has twelve people and a waiting list. The village hall has asked, politely, to have its radiator back. And the room where I keep the things I haven't decided about… has to decide.",
            "A sewing room: a table big enough to cut cloth on, seats for the class, a place for the fabric, good light from more than one place, and no curtains. One must see the colour of thread in daylight. A daybed for my daughter at weekends. And colour, darling: red, yellow, blue, green. It should look like a box of embroidery thread."],
      bye:"Fondly, and with a pin in my mouth,", ps:"The dachshund has been appointed class mascot. He sits on the pattern." },
    reward:{ items:['pillows-stacked-beige-pattern','vase-amora-black'], bonus:['pillow-willow-rosa'] }, quirks:['rosa_lights','rosa_solo','rosa_daylight'] },

  { id:'ROSA_04', n:23, char:'rosa', job:'Sewing teacher', title:'The Little House on Lantern Lane', property:'ROSA_CABIN_A', change:'second', edit:['living','kitchen'], allowance:84, minRenown:22,
    story:"With long-held savings and a small inheritance, Rosa has bought a cabin on Lantern Lane, with the bay glinting through the trees. She keeps her flat in town. The cabin is small and bright and calls for a lighter, breezier version of her taste, starting with the living room and the kitchen.",
    message:"I have done something impulsive. I've bought a cabin on Lantern Lane, and I'm keeping the flat; I'm not a monster. I want to know I'm near the water when I open the windows. A living room for a book and the view, a kitchen with a table for toast with dignity. Lighter wood, some green and blue, but don't make it anonymous, darling. A little yellow. I do have a reputation.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["I could read here for weeks."]),
      R('must','kitchen','A kitchen, with a counter and a fridge',{role:'kitchen',room:'kitchen'},["Tea, toast. A kitchen of dignity."]),
      R('like','palette','Green, blue, beige and light wood',{colors:['Green','Blue','Beige','White','Light Wood'],minShare:0.6},["It's the bay in a room. Not literal. Wonderful."]),
      R('like','ochre','Small warm accents: yellow, orange or gold',{colors:['Yellow','Orange','Gold','Brass'],min:1},["That bit of yellow is me, in tiny form."]),
      R('like','wood','Light wood in a few places',{colors:['Light Wood'],min:3},["Light, lovely wood."]),
      R('like','table','A table in the kitchen to eat at',{kinds:['dining'],min:1,room:'kitchen'},["A kitchen table. Bliss."]),
      R('avoid','nodark','Not an all-dark-wood interior',{colors:['Dark Wood'],maxShare:0.2},[null,"Rather a lot of dark wood for a little cabin, darling."])
    ],
    reply:{ low:"It's a house with a view of the bay. One forgives a great deal.", mid:"It's light and it's mine. Lovely.", high:"I opened the window, heard the ducks, and decided to stay till autumn. You've ruined my city flat for me." },
    letter:{ hello:"Darling,",
      body:["I have done something impulsive. I have bought a little house up on Lantern Lane. Small, bright, slightly crooked, with a kitchen window that looks straight down to the bay. I'm keeping the flat in town; I'm not a monster.",
            "It needs a lighter version of me: a living room for a book and the view, and a kitchen with a table for toast with dignity (that window is the whole show, so no curtains on it). Green, blue and beige, light wood, a small touch of yellow. No ducks on the cushions. And not too much dark wood. It's a cabin, not a library in a thriller."],
      bye:"With wet boots already,", ps:"Come for tea when it's done. I've warned the ducks." },
    reward:{ items:['fireplace-marco-marble-beige','rug-persian-rosa'], bonus:['vase-blue-china'] }, quirks:['rosa_lights','rosa_solo','rosa_window'] },

  { id:'ROSA_05', n:29, char:'rosa', job:'Sewing teacher', title:'Sleep to the Sound of the Water', property:'ROSA_CABIN_A', change:'more', edit:['bedroom'], allowance:50, minRenown:35,
    story:"After a summer at the cabin Rosa sleeps there more often than not. The bedroom is still the room she hasn't decided about. She wants it as peaceful as the kitchen is lively: a bed to sleep to the sound of the water in.",
    message:"I've been sleeping at the cabin more often than in town, and the bedroom is still a mattress and an opinion. I want to sleep to the sound of the water. A proper bed, a wardrobe for the costumes I can't bear to give up, something soft underfoot, light from more than one place. Greens and blues, a touch of gold, and a little pattern, just one. Nothing too dark.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom will let me sleep to the sound of the water."]),
      R('must','wardrobe','A wardrobe for the costumes',{kinds:['wardrobe'],min:1},["The costumes have a home. They'd like to be introduced."]),
      R('like','palette','Green, blue, beige and light wood, with a little gold',{colors:['Green','Blue','Beige','White','Light Wood','Gold','Brass'],minShare:0.6},["It's the bay in a bedroom. I could weep."]),
      R('like','soft','Something soft underfoot',{kinds:['rug'],min:1},["A rug. My feet may never leave."]),
      R('like','lights','A lamp on each side of the bed',{kinds:['lamp'],min:2},["A lamp on each side. A little stage for reading."]),
      R('like','pattern','One lovely pattern',{kinds:['patterned'],min:1},["One pattern, beautifully placed. A soloist."]),
      R('avoid','nodark','Not dark',{colors:['Dark Wood','Black'],maxShare:0.2},[null,"Rather a lot of dark for a bedroom with a window like that."])
    ],
    reply:{ low:"It's a bedroom with a view of the water. One forgives a great deal.", mid:"I slept ten hours and woke to ducks. Lovely.", high:"I woke up, opened the window, and a kingfisher looked at me. It's the best review I can give." },
    letter:{ hello:"Darling,",
      body:["I've spent the whole summer at the cabin. The flat has been told it's very much loved and very much empty. The bedroom is still a mattress and an opinion.",
            "I want to sleep to the sound of the water. A proper bed, a wardrobe for the costumes I can't bear to give up, something soft underfoot, a lamp on each side. Greens and blues, a touch of gold, and one pattern, just the one. Nothing too dark; the window is the whole show."],
      bye:"Fondly, and nearly asleep,", ps:"The veil is nearly finished. It's in the wardrobe. Do not look. I know where you live." },
    reward:{ items:['wall-lamp-olivia','rug-melanie-beige'], bonus:['curtain-maya'] }, quirks:['rosa_lights','rosa_solo'] },

  { id:'ROSA_06', n:35, char:'rosa', job:'Costume maker, the Cove\'s own', title:'The Costume Cupboard', property:'ROSA_ATELIER', change:'second', edit:['shop'], allowance:72, minRenown:45,
    story:"The wedding veil got more applause than the cake. Suddenly everybody in the Cove wants costumes for the lantern children, the regatta, the school play. Rosa has rented a small shop front in Old Town and called it The Costume Cupboard. The sign is already crooked, on purpose.",
    message:"The veil got more applause than the cake. Now everyone wants costumes. I've rented a tiny shop in Old Town, The Costume Cupboard. I need a big table to cut on, rails and wardrobes for the finished things, somewhere for the customers to sit while I pin them, a lamp that flatters, and colour, darling. All of it. One pattern per corner. No white.",
    brief:[
      R('must','sewing','A workroom: a big table to cut on, a chair and good light',{role:'sewing',room:'shop'},["A cutting table! One feels like a professional again."]),
      R('must','wardrobes','At least two wardrobes for the finished costumes',{kinds:['wardrobe'],min:2},["Two wardrobes full of costumes. There's room for one more soul."]),
      R('must','seats','Seats for customers to wait on',{kinds:['couch','armchair','chair','stool'],min:3},["Customers are already staying too long. How wonderful."]),
      R('like','colour','Red, yellow, blue and green',{colors:['Red','Yellow','Blue','Green','Orange','Gold'],min:5},["It looks like a theatre wardrobe that's had a very good night."]),
      R('like','gold','A bit of gold or brass',{colors:['Gold','Brass'],min:1},["A bit of gold. One should always have a bit of gold."]),
      R('like','lights','Light from more than one place',{kinds:['lamp'],min:3},["Light from all sides. Flattering and fair."]),
      R('like','pattern','A lovely pattern or two',{kinds:['patterned'],min:2},["Two soloists. A duet."]),
      R('avoid','nowhite','Not white and pale everywhere',{colors:['White'],maxShare:0.2},[null,"Too much white. It's a hospital again."])
    ],
    reply:{ low:"A cupboard. A small one. It'll fill up.", mid:"Rather magnificent. The mannequins approve.", high:"The first customer walked in, gasped, and ordered a whole pirate ship. I have never been happier." },
    letter:{ hello:"Darling,",
      body:["The veil got more applause than the cake. I'm told this is unprecedented. Suddenly everybody in the Cove wants costumes: the lantern children, the regatta crew, the school play, one gentleman who would like to be a wolf.",
            "I've rented a tiny shop in Old Town and called it The Costume Cupboard. A big table to cut on, wardrobes for the finished things, somewhere for customers to sit while I pin them, lamps that flatter. And colour, darling. All of it. Red, yellow, blue, green, a flash of gold. A little pattern, but not a choir. And no white."],
      bye:"With a pin in my mouth and a crown on my head,", ps:"I'm sewing something for you. I won't say what. It involves a great deal of red." },
    reward:{ items:['vase-amora-whiteblack','lamp-heidi-creme'], bonus:['curtain-lana'] }, quirks:['rosa_lights','rosa_solo'] },

  ]
  ).sort(function(a, b){ return a.n - b.n; });
  // One job a month. n = which month of the three years (0 = June 2025), so the calendar,
  // the seasons and the happenings all line up. Each neighbour's jobs follow one another.
  QUESTS.forEach(function(q){ q.day = D(q.n); });
  (function(){
    var last = {};
    QUESTS.forEach(function(q){ q.requires = last[q.char] ? [last[q.char]] : []; last[q.char] = q.id; });
  })();

  /* ---- the final job: no brief, no hearts, no star budget. The street gives you a key. ---- */
  (function(){
    var lastOf = {};
    QUESTS.forEach(function(q){ lastOf[q.char] = q.id; });
    var req = Object.keys(lastOf).map(function(k){ return lastOf[k]; });
    var fq = { id:'COVE_FINAL', n:36, char:'town', job:'', title:'A Key of Your Own', property:'OWN_oldtown', change:'new', final:true,
      edit:['living','bedroom','kitchen','extra'], allowance:9999,
      story:"Three years on, the neighbours give you a flat of your own, wherever you like in the Cove. No brief, no hearts, nobody to please.",
      message:"There's a key with your name on it. Pick a corner of the Cove and make it yours.",
      brief:[], quirks:[], starters:[],
      letter:{ hello:"Dear {you},",
        body:[
          "It's been three years since you first turned up at Mia's with a measuring tape and strong opinions about rugs. Look at the Cove now. Look at the windows.",
          "We held a very serious meeting. It was on Rosa's balcony, with Theo's bread, Sam's seating plan and Jules drawing a pigeon on the minutes. Noor took them (her entry reads: 'agreed'). Every one of us has told you exactly what we wanted, for three years, and not one of us ever asked what YOU would like.",
          "So here is a key. A flat is yours, in whichever neighbourhood you choose, with no brief, no list, no star budget and nobody to please. Pick the corner of the Cove that feels like you, then furnish it however you want. We'll stay out of your way. (We'll come by afterwards, with cake. Mia insists.)"
        ],
        bye:"With love,", ps:"Jules drew you a map to your front door. It is mostly pigeons." },
      requires:req };
    fq.day = D(fq.n);
    QUESTS.push(fq);
  })();

  /* ------------------------------------------------------------------ v0.14 letters: warm, asking for help, in each neighbour's voice */
  var LETTERS_V014 = {
 "MIA_01": {
  "hello": "Hello {you}!",
  "body": [
   "I have a key now. My own key! I keep checking my pocket to make sure it's still there. It's a very ordinary key and I'm in love with it.",
   "And now a huge favour to ask: would you help me make the flat feel like mine? Pretty please? You always knew what I'd like before I did. I can only afford to make one room nice, so let's start with the living room: somewhere comfy to sit, a little table and a lamp. Green and beige and light wood, I think. And flowers! A florist is about to open on my street and I'm already emotionally invested.",
   "My toes are always cold, so something soft for the floor would make me very happy. Please nothing black, and nothing shiny and chrome. Shiny things make me nervous."
  ],
  "bye": "Thank you so much, I owe you,",
  "ps": "There will be cookies."
 },
 "JULES_01": {
  "hello": "HELLO!!",
  "body": [
   "Mia gave me your name and a cookie. I have one suitcase and ELEVEN boxes of paint. The paint is unpacked. The bed is… somewhere?",
   "Please, PLEASE can you help me? I need one room that does everything. The EASEL goes in first (important), then somewhere to sleep, then somewhere to sit and stare at the ceiling. And blue and orange, the only couple I believe in, plus lots of colours that don't match each other. Matching is how they get you.",
   "Pretty pleeeease? And not beige. BEIGE IS HOW THEY GET YOU."
  ],
  "bye": "Yours in turpentine,",
  "ps": "I drew you on the back. You look like a potato in a nice jumper."
 },
 "SAM_01": {
  "hello": "Good evening, {you},",
  "body": [
   "I've just moved for a better job and, in a fit of confidence, invited my whole team to dinner on Friday. Eleven people. A flat that seats four. It'll be wonderful.",
   "Everyone says you're the person to ask, so I'm asking nicely: would you help me, please? The kitchen comes first. Dark wood, red, plenty of chrome and steel (I once saw brass beside chrome and had to sit down), an island big enough to put a party on, and a fridge that hums reassuringly. And gadgets: three of them at least, mixers and coffee machines and kettles. I'd take it as a personal kindness.",
   "No flowers; they wilt when I look at them. Nothing light and rustic, either. (The oven is on back-order. We don't discuss it.)"
  ],
  "bye": "Warmly, and in need of a whisk,",
  "ps": "Friday, seven o'clock. That's an invitation, not a request."
 },
 "NOOR_01": {
  "hello": "Hello.",
  "body": [
   "Sam passed on your details. He said you actually listen. I'll assume that's true.",
   "I've moved. That's not up for discussion. I find I need help, and I'm told asking is the first step, so: would you help me, please? I'd like one room finished, the bedroom. A bed, a bedside table, somewhere to put things away. White, a little blue, light wood. Twelve things at most; I counted.",
   "No busy patterns, and matching grain matters to me: one tone of wood. Thank you in advance. That was difficult to write."
  ],
  "bye": "Regards,",
  "ps": "If a shelf is two centimetres off, I'll know."
 },
 "THEO_01": {
  "hello": "Hi there!",
  "body": [
   "Noor said you were good, and she doesn't say that about anyone, so I'm a bit nervous writing. Elena and I have found a little cabin up on Lantern Lane. The baby's due in spring and the living room is full of ‘temporary solutions’.",
   "Could you help us make it somewhere we can both sit and breathe? Please? Nothing fancy. White, a bit of yellow, some blue (Elena calls blue and yellow ‘our colours’, like the shop sign) and solid wood that can take a knock. Nothing white to sit on, small person incoming, and nothing breakable. I once owned a vase. It's a sad story.",
   "We kept the old sideboard. It might be useful."
  ],
  "bye": "Cheers, and thanks so much!",
  "ps": "If you ever need bread, I'm yours. I'm not great with words."
 },
 "ROSA_01": {
  "hello": "My dear,",
  "body": [
   "I have retired from thirty-one years in the costume department of the Playhouse and been told to ‘relax’. I have never been less relaxed. My sitting room has been wrong since 1998. (I hear an antiques shop is opening on Lantern Lane. I intend to be unbearable about it.)",
   "So I shall ask you properly, darling: will you help me? The sideboard stays. Everything else must earn its place: two places to sit, a table, and a lamp with personality. I light a room like a stage, never from just one place, so there will be two lights at least. And colour! Red, yellow, dark wood, something patterned.",
   "What I will not have is a pale room. Not beige. Not ‘greige’. Do say yes."
  ],
  "bye": "With great expectations,",
  "ps": "Theo says you're good. He once tried to pay me in sourdough."
 },
 "MIA_02": {
  "hello": "Hello again!",
  "body": [
   "I passed my probation! I buy dahlias at Fennel & Fern every Friday (the shop cat waits for me), and every evening I still end up in the living room you made, like a cat in the only sunny spot. Thank you, really.",
   "Which is why I'm writing to beg for one more room. Pretty please? The bedroom is so empty! Soft pink and beige, I think, a bed and a bedside table with flowers by it, and a little lamp so I can read in bed until I fall asleep on the book. And something warm underfoot. (My old room at Mum's had a black table on a dark rug, and it felt like a cave.)",
   "Nothing dark or black, please. You know me."
  ],
  "bye": "Thank you again,",
  "ps": "A friend called Alex carried my bookcase up the stairs. I'm saying nothing."
 },
 "JULES_02": {
  "hello": "OKAY SO,",
  "body": [
   "SOMEONE PAID ME. For a drawing of a heron in a raincoat. I've read the email eleven times. (I spent half of it at the flea market, on a clock.)",
   "And the attic is the best it has ever been, you did SO great, I lie on the floor and look at it. Do you mind helping me again? Pretty pleeeease? Can you keep the easel and the blue, bring in three or four new things, and could we try pink? The Carla couch comes in pink and I've been staring at it for days.",
   "Also: I've named my fern Gerald and he needs a friend. And less beige. I can feel it creeping back."
  ],
  "bye": "Gratefully chaotic,",
  "ps": "The heron is going on a mug."
 },
 "SAM_02": {
  "hello": "My friend,",
  "body": [
   "The kitchen is a triumph. Eleven people ate in it and the only casualty was a lemon. A florist opened across the road; I have walked past it twice, on purpose.",
   "Which brings me to a request, and I am asking nicely: would you do the dining room? Now that they've seen the kitchen, everyone wants to stay for dinner. I need a table with enough seats (five at least) to pretend I planned this, and something dramatic to light it. Dark wood, red, a touch of orange.",
   "Wood should behave: one tone, not a lumberyard. All the metals should agree. Still no flowers. Still nothing pale. Please say yes."
  ],
  "bye": "Gratefully,",
  "ps": "A guest called Robin did all the washing up. I have invited them back."
 },
 "NOOR_02": {
  "hello": "Hello again.",
  "body": [
   "The bedroom works. I said so out loud, in the office. One colleague dropped a stapler.",
   "I would like to ask again. Please. Would you do the living room? The same restraint, but its own temperament. Light wood, white and grey, and keep the blue. A chair I actually want to sit in, and a good lamp beside it. Fourteen pieces at most.",
   "No patterns. One tone of wood. (Chrome next to brass is a family argument.) Thank you. I mean it."
  ],
  "bye": "Regards,",
  "ps": "My sister asked who did the bedroom. I said ‘someone good’."
 },
 "THEO_02": {
  "hello": "Hi again!",
  "body": [
   "She's here! Wren, a few weeks old, very loud, already stealing my heart and my socks. Elena sends a very tired thank-you for the living room. We sit in it at three in the morning and it helps.",
   "Could we ask for one more favour? Pretty please, with a sticky bun? Our bedroom is last on the list. Something restful: green and white, sturdy wood, a bed that isn't white, and somewhere for clothes that isn't ‘the chair’. It has become load-bearing. Wren is starting to wriggle across rooms like a small sausage, so a soft rug, please.",
   "Blue and yellow again if you can; they're ours. And nothing fragile."
  ],
  "bye": "Sleepily yours,",
  "ps": "Rosa has offered to sew Wren a coat. I'm scared of her."
 },
 "ROSA_02": {
  "hello": "Darling,",
  "body": [
   "I've begun teaching sewing at the village hall, and everyone stays for tea afterwards. ‘Everyone’ is currently six people and one opinionated dachshund. The sitting room was a triumph; I now receive visitors like a duchess.",
   "Would you do it again for me, darling? Do say yes. The dining room needs a proper table with seats for six at least, and the mood of a stage set before the curtain goes up: red, yellow, dark wood, a touch of gold, and light from more than one place.",
   "One pattern, mind. A soloist, not a choir. And no white. It's a home, not a hospital."
  ],
  "bye": "Fondly, and with a flourish,",
  "ps": "Mia's dahlias have the whole village talking."
 },
 "MIA_03": {
  "hello": "Hello {you}!",
  "body": [
   "I have to tell you something. I've started growing things. It began with one cutting from the florist, then a second, then a tray of seedlings that now lives on every windowsill. The little room at the back is a greenhouse in waiting.",
   "You made the rest of the flat so lovely that I feel cheeky asking again, but please, please could you help me turn it into a proper green room? At least four plants, somewhere to stand the pots, and one very comfy chair for watching it all grow. Lots of green, light wood, and a bunch of flowers for the ones that have already bloomed.",
   "And please nothing in front of the window. They need all the light they can get. Nothing dark, and my toes would like a rug."
  ],
  "bye": "Muddy hands, warm heart,",
  "ps": "Parsley is not impressed by my basil. Parsley is hard to impress."
 },
 "JULES_03": {
  "hello": "HEY, {you}!!",
  "body": [
   "I GRADUATED. In a hat that didn't fit, holding a certificate that says my name wrong. I now work two days at the Dog-Eared Bookshop (the dog sits on my feet) and the rest of the week I draw things for people who send emails.",
   "Remember how you saved the attic? Can you do it AGAIN? Pretty pleeeease? It needs to grow up: a proper desk, a proper chair and a laptop. The easel stays, obviously; the easel is my soul. Keep the blue and bring the orange, lots of different colours, and Gerald would like a plant friend.",
   "And nothing from the beige family. I can still feel it."
  ],
  "bye": "Yours, newly employed,",
  "ps": "A gallery is opening on the Far Shore. I'm trying not to look in its direction."
 },
 "SAM_03": {
  "hello": "Dear friend,",
  "body": [
   "Dinner at mine has become a regular thing. A day-of-the-week thing. Robin brings dessert, which is usually more impressive than my main course, which I'm not going to discuss.",
   "People stay until two in the morning and want somewhere to lie around dramatically afterwards, and I would be so grateful if you'd help me with the living room. Leather, please: a couch, a table, a lamp, and seats for six at least. Keep the dark wood and the red, add some orange and a little chrome or black for drama.",
   "Wood should still behave: one tone. The metals should agree. And still no flowers. Do say yes."
  ],
  "bye": "Warmly, with a wine glass in my hand,",
  "ps": "Robin has brought a toothbrush. I'm choosing not to notice. Loudly."
 },
 "NOOR_03": {
  "hello": "Hello.",
  "body": [
   "I'd like to say something and ask you not to comment. I have decided to learn the piano. I'm forty-one. I walked into the antiques shop to measure a window and walked out with a plan.",
   "I would be grateful for your help once more. The little spare room will be the practice room: an instrument (a keyboard is acceptable; the piano is a long-term goal), a good chair, a place for the sheet music, and one good lamp. White, blue, grey, light wood. Ten things at most. Something soft, a rug or a curtain, because the neighbours have views.",
   "No patterns. No drums. One tone of wood, and no mixing warm and cool metals. Please."
  ],
  "bye": "Regards, with a very small ambition,",
  "ps": "My sister has laughed twice. She's since apologised. Once."
 },
 "THEO_03": {
  "hello": "Hey you,",
  "body": [
   "Two bits of news. The old baker at Crumb & Crown has offered me a share of the bakery (I said yes, then threw up in a bush), and Wren has said her first word. It was ‘Dada’. Elena says she was pointing at the bread.",
   "Before I start I'd like to practise properly at home, so, please, could you help me with the cabin kitchen? I know I keep asking. A counter, a fridge, a mixer or two, and a table where Elena can sit and taste. And two stools at the counter, because I'm always up and down.",
   "Blue and yellow again, white and solid wood, and a plant on the windowsill. Nothing fragile near the flour, and not too shiny. I'd offer you a loaf, but I'm hoping you'll say yes first."
  ],
  "bye": "Thank you, again and always,",
  "ps": "Come by at six one morning. The first loaf is yours."
 },
 "ROSA_03": {
  "hello": "Darling,",
  "body": [
   "The class has twelve people and a waiting list. The village hall has asked, politely, to have its radiator back. And the room where I keep the things I haven't decided about… has to decide.",
   "Will you be an angel and help me turn it into a sewing room? A table big enough to cut cloth on, a chair, seats for at least four of the class, shelves or a sideboard for the fabric, and good light from more than one place. A daybed for my daughter at weekends.",
   "And no curtains. One must see the colour of thread in daylight. It should look like a box of embroidery thread: red, yellow, blue, green. One pattern only. Please say yes."
  ],
  "bye": "Fondly, and with a pin in my mouth,",
  "ps": "The dachshund has been appointed class mascot. He sits on the pattern."
 },
 "MIA_04": {
  "hello": "Dear {you},",
  "body": [
   "Alex is moving in! Properly. There's a bike in the hall, board games in every corner and a toothbrush next to mine, and I'm so happy I could pop.",
   "You made this flat so lovely that I feel cheeky asking, but could you help me make room for two? Pretty please? The living room needs space for Alex's games and a few blue things (Alex's favourite colour), and the bedroom needs a wardrobe that isn't me. I own four hangers. At least five new pieces would be a dream.",
   "Keep the green, the light wood and the flowers (in both rooms!), a rug for my toes, and still nothing dark or too shiny. We're cosy people, not moody ones."
  ],
  "bye": "With a full heart and an empty wardrobe,",
  "ps": "We've rented an allotment plot together. Alex thinks it's for vegetables. It's for dahlias."
 },
 "JULES_04": {
  "hello": "{you}!! {you}!!",
  "body": [
   "THE PAPER MOTH WANTS SIX OF MY PRINTS. SIX. Not for the back room, not for the bargain basket, for the winter wall by the window. I have read the email so many times I can recite it.",
   "And the flat next to the stairwell at the Mills has come free: two rooms! Will you help me? Pretty please with extra paint on top? The first room is for painting, so that comes first. Colour, as much as you dare. An easel, something on every wall, a big table to lay out prints, a laptop for the gallery emails, and a good spot for Gerald.",
   "Same blue and orange as always. And absolutely nothing beige."
  ],
  "bye": "Yours, slightly feral with excitement,",
  "ps": "Mia has promised to bake. Nobody knows what for."
 },
 "SAM_04": {
  "hello": "Dear friend,",
  "body": [
   "I got promoted. Head of events, which means a bigger budget and a bigger headache, and Robin has moved in properly, toothbrush and all. After two years the bedroom is still a mattress with ambitions.",
   "I come to you humbly: would you make it proper? A real bed and bedside table, a wardrobe that closes (big enough for two and a ridiculous number of suits), and a lamp on each side. Robin sleeps lightly, so nothing dark and dramatic: beige and white and light wood, with one bit of red so it still feels like me, and something soft underfoot.",
   "One tone of wood, one family of metals, and still no flowers. Name your price in cake."
  ],
  "bye": "Warmly, and slightly outnumbered,",
  "ps": "Robin plays the violin. Quietly. In another room. Yes, I'm in love."
 },
 "NOOR_04": {
  "hello": "Hello.",
  "body": [
   "I made partner. The firm will have my name on the door. I celebrated by buying the top floor of my own building: tall windows, a ceiling you could lose a kite in. I intend to stay.",
   "Would you help me with it? You know how I like things, which is rarer than you would think. Living room first: a place to sit at the end of the day, a shelf of books within reach of the chair, one good stone or marble piece, and a good lamp. White, blue, grey, light wood. Twelve things at most.",
   "No patterns. One tone of wood. And no desk. Desks are how work follows you home. Thank you in advance."
  ],
  "bye": "With some warmth, which I'm told is noticeable,",
  "ps": "The windows are 3.4 metres tall. I measured twice."
 },
 "THEO_04": {
  "hello": "Hey you,",
  "body": [
   "The old baker has retired to a deckchair and left me the keys. And the cat, who has opinions. Crumb & Crown is mine now, mostly. There's a corner at the back that nobody has ever known what to do with.",
   "You've done so much for us at home that I'm bold enough to ask: could you help with the shop, too? Please? I want it to be a place to sit: two small tables at least, five chairs, a counter for the cakes, a plant or two and warm lights over the tables. It should feel like our kitchen at home, only with more flour.",
   "Blue and yellow, white and solid wood. Nothing fragile, and not too dark. I'll pay you in cinnamon buns."
  ],
  "bye": "Flour on my nose and everywhere else,",
  "ps": "The shop cat has claimed the best chair. I'm not going to argue."
 },
 "ROSA_04": {
  "hello": "Darling,",
  "body": [
   "I have done something impulsive. I have bought a little house up on Lantern Lane. Small, bright, slightly crooked, with a kitchen window that looks straight down to the bay. I'm keeping the flat in town; I'm not a monster.",
   "Will you be a dear and help me with it? It needs a lighter version of me: a living room for a book and the view, and a kitchen with a counter, a fridge and a table for toast with dignity. Green, blue and beige, light wood, a small touch of yellow or gold, and light from more than one place.",
   "No curtains on that kitchen window; it's the whole show. One pattern, no ducks on the cushions, and not too much dark wood. It's a cabin, not a library in a thriller."
  ],
  "bye": "With wet boots already,",
  "ps": "Come for tea when it's done. I've warned the ducks."
 },
 "MIA_05": {
  "hello": "Dear {you},",
  "body": [
   "We found a flat with a GARDEN. A real one, with a gate and one very crooked apple tree. It's on Church Hill, close enough to hear the bells and far enough to ignore them.",
   "I know it's a lot to ask, but would you help us settle in? Pretty please? Alex wants a proper table, a wooden one like their grandmother's that survived three house moves and a rave. I want flowers on it, from my own patch, and flowers in the living room too. A living room with a bit of old me and a bit of new us: green, blue, beige, light wood, and plants. Lots of plants.",
   "Something soft for my toes, and nothing too dark. You know the rules."
  ],
  "bye": "Gratefully (and covered in soil),",
  "ps": "I'm going to sell the extra flowers from the gate. Don't tell Parsley."
 },
 "JULES_05": {
  "hello": "{you}, my friend,",
  "body": [
   "They SOLD. All six prints, in a week. The gallery wants twelve more and a person from the paper wants to take my photo. I told her I was busy. I wasn't. I just panicked.",
   "The painting room is done and I'm very proud of it (thank you!!). The other room is still a mattress next to the radiator. Could you help me finish the flat? Pretty please? A room where I actually live: a bed, a sofa, a wardrobe, proper lamps for the evenings. Colourful, but quieter than the studio, or I'll never sleep.",
   "At least three colours (no waiting-room beige), blue and orange somewhere, obviously, and plants. Gerald has cousins now."
  ],
  "bye": "Yours, newly a person with a sofa,",
  "ps": "The gallery owner said I have ‘a clear voice’. I've been walking around saying it to myself."
 },
 "SAM_05": {
  "hello": "Dear friend,",
  "body": [
   "I QUIT. With a speech. There was a standing ovation, mostly from the people I'd been planning events for. Sam & Co. Events now has a client, an invoice and one small office on Glass Row, with a view of the quay.",
   "It needs to look like a company and feel like me, and I need someone with taste and a steady hand. Would you? A big desk, a good chair, a laptop and a lamp. A table for meetings with seats for four, and a couch for clients to wait on, or for when the nodding gets tired. Dark wood, red, a bit of chrome, something on the walls.",
   "One wood, one family of metals. Still no flowers. Robin says I'm ‘brave’. I think it was a compliment."
  ],
  "bye": "With a fresh business card and a fresher mortgage,",
  "ps": "Robin has already booked the first anniversary party. In my office. For the staff. Which is me."
 },
 "NOOR_05": {
  "hello": "Hello.",
  "body": [
   "The living room works. I sit in it every evening. That is the review.",
   "Would you be willing to help me again? Two rooms this time: the bedroom, quiet, with plenty of air, and the small room at the end, which is for thinking. The small room needs a chair, a shelf and one lamp. One. Not none, not three.",
   "White, blue, grey, light wood, something soft underfoot in the bedroom, no more than twelve pieces a room, no patterns. One tone of wood. And still no desk. I'd have mentioned it, but you already know."
  ],
  "bye": "Regards,",
  "ps": "I've started playing a piece with both hands. Very slowly. Don't tell my sister."
 },
 "THEO_05": {
  "hello": "Hey you,",
  "body": [
   "Wren has discovered stairs and the cabin has discovered it has no more space. We've found a flat on Orchard Rise with a proper dining room. And the bakery's doing well enough that Elena says ‘yes, we can’, which is the first time in five years.",
   "Could you help us move in? Pretty please, with a fresh loaf on top? I'd love everyone round one table: grandad, aunts, the lot. (Grandad only trusts wood he can knock on.) A living room for naps, a dining room for noise, and something soft on the floor in both because Wren is walking at full speed. Bring what still works from the cabin. The sideboard followed us. It does that.",
   "Same as before: white, green, yellow and blue, solid wood, nothing fragile and nothing white to sit on."
  ],
  "bye": "Thank you, again and always,",
  "ps": "Come by at six one morning. The first loaf is still yours."
 },
 "ROSA_05": {
  "hello": "Darling,",
  "body": [
   "I have spent the whole summer at the cabin, and the flat in town has been told it is very much loved and very much empty. The cabin's bedroom is still a mattress and an opinion.",
   "Will you help me, darling? I want to sleep to the sound of the water. A proper bed and bedside table, a wardrobe for the costumes I can't bear to give up, something soft underfoot, and a lamp on each side. Greens and blues, light wood, a touch of gold, and one pattern, just the one.",
   "Nothing too dark; the window is the whole show. Do say yes."
  ],
  "bye": "Fondly, and nearly asleep,",
  "ps": "The veil is nearly finished. It's in the wardrobe. Do not look. I know where you live."
 },
 "MIA_06": {
  "hello": "Dear {you},",
  "body": [
   "Alex asked. In muddy boots, on the allotment, between the dahlias and the compost heap, and I said yes before they'd finished the question. The wedding is in spring, at the white church on Church Hill. The whole street is coming. I have already started growing the flowers.",
   "Before the noise starts I'd like one calm room, and you're the only one I'd trust with it. Please? A bedroom that feels like a deep breath. Soft pink, green and beige, a plant or two, flowers from the garden by the bed, soft things (a rug and a few cushions) and a lamp on each side. And a wardrobe for the dress. The one nobody's allowed to see.",
   "Nothing dark. Not even a little."
  ],
  "bye": "Yours, practically married,",
  "ps": "Rosa has promised me a veil. I'm terrified and thrilled."
 },
 "JULES_06": {
  "hello": "GUESS WHAT,",
  "body": [
   "The landlord offered me the top floor of the mill. THE TOP FLOOR. A live-work loft with three rooms and a door that closes. I said yes before he'd finished the sentence, then said yes again to be safe.",
   "You were there for the suitcase and the eleven boxes of paint, so you HAVE to do this one. PLEASE. Pretty pleeeease with glitter on top? The art room needs ALL the colour: easel, things on every wall, a desk and a laptop for the boring business side, because there is one now. The living room must not look like a dentist's waiting room. The bedroom should be soft and quiet.",
   "Blue and orange somewhere, a plant for Gerald, and as many paintings as the walls can bear."
  ],
  "bye": "Yours, no longer in an attic,",
  "ps": "I've named the loft. It's called ‘Gerald's Place’. He doesn't know."
 },
 "SAM_06": {
  "hello": "Dear friend,",
  "body": [
   "Robin and I have bought a place. Together. A first-floor flat over the old market in Old Town, with a round window in the living room and a kitchen the size of my first flat. We own a dish rack. It's the best day of my life, and I have organised a lot of days.",
   "You've been there for most of it, so I would be honoured if you'd furnish this one too. Kitchen first, obviously, with gadgets worth bragging about: mixers, kettles, a very large coffee machine. Then the living room: dark wood, red and leather, and in the corner a place for Robin's violin, with a chair beside it so the music has company.",
   "A little drama is a seasoning, not a main course. One wood, one family of metals, and no flowers. Say yes?"
  ],
  "bye": "Yours, in a rare moment of restraint,",
  "ps": "Robin says I'm not allowed a second mixer. We'll see."
 },
 "NOOR_06": {
  "hello": "Hello.",
  "body": [
   "I've left the firm. Not dramatically; I handed in a typed letter, in triplicate, on a Tuesday. Noor Architects now has one client, a small office near the quay and a very strong opinion about desks.",
   "I would like to ask you to do this one as well. Please. This is the one place I will have a desk. A proper desk, a good chair, a laptop, and a lamp that doesn't glare. A big table for drawings, a shelf for models. White, grey, a little blue, light wood; fourteen pieces at most; air.",
   "No patterns, nothing dark. One tone of wood. And one plant. Exactly one. I'll know if there are two."
  ],
  "bye": "With some warmth, which people keep noticing,",
  "ps": "The piano piece is nearly finished. The neighbours have asked for an encore. I said no."
 },
 "THEO_06": {
  "hello": "Hey you,",
  "body": [
   "Wren is two and a bit, has opinions about socks and has outgrown the cot. And I'd like you to be the first to know that Elena says there might be another one on the way. We've told nobody. Not even grandad.",
   "Could you help us with her first proper room? Pretty please? A bed that isn't white (we've learnt), a place for toys and clothes, a soft rug because she runs everywhere in socks, a few books, a plant out of her reach, and enough colour to make it hers. Blue and yellow if you can; they're our colours.",
   "Nothing fragile, please. She throws things."
  ],
  "bye": "Thank you, again and always,",
  "ps": "The bakery has a queue round the corner. A queue! Someone's brought a chair."
 },
 "ROSA_06": {
  "hello": "Darling,",
  "body": [
   "The veil got more applause than the cake. I'm told this is unprecedented. Suddenly everybody in the Cove wants costumes: the lantern children, the regatta crew, the school play, one gentleman who would like to be a wolf.",
   "I've rented a tiny shop in Old Town and called it The Costume Cupboard, and I would be so grateful, darling, if you'd dress it for me. A big table to cut on, a chair, at least two wardrobes for the finished costumes, somewhere for customers to sit while I pin them, and lamps that flatter, from more than one place.",
   "And colour! Red, yellow, blue, green, a flash of gold. A pattern, but one: a soloist. And no white."
  ],
  "bye": "With a pin in my mouth and a crown on my head,",
  "ps": "I'm sewing something for you. I won't say what. It involves a great deal of red."
 }
};
  QUESTS.forEach(function(q){ if (LETTERS_V014[q.id]) q.letter = LETTERS_V014[q.id]; });

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
             idle:["Jules is leaning out of a window with paint on her nose.",
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
                   "Theo waves a rolling pin like a flag.",
                   "Theo is assembling something small with far too many screws."] },
    rosa:  { paper:'rosa',  sign:'Rosa',  hi:'Darling,', replyBye:'Fondly, Rosa',
             ask:"One moment, darling. One had rather hoped for…",
             idle:["Rosa is on her balcony, wearing something magnificent.",
                   "Rosa is pinning a hem on a mannequin and judging the street.",
                   "Rosa raises one eyebrow at you. It is affection."] },
    town:  { paper:'town',  sign:'Everyone on the street', hi:'', replyBye:'', ask:'', idle:[] }
  };
  Object.keys(VOICES).forEach(function(k){ CHARACTERS[k].voice = VOICES[k]; });

  // (The letters are written inside each job above: q.letter.)

  /* ---------------------------------------------------------------- rewards */
  // Every job leaves a thank-you gift: pieces that stay locked in story mode
  // until the neighbour gives them to you. Hand in your best work (all 5
  // hearts) and they tuck an extra one into the envelope.
  var REWARDS = {};   // quest id -> { items, bonus }, filled from each job's `reward`
  var GIFT_OWNER = {};   // item id -> { quest, bonus }
  QUESTS.forEach(function(q){
    var r = q.reward;
    if (!r) return;
    REWARDS[q.id] = r;
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
                   ["The window gets to be the show. Bravo.","I wanted the window left bare. It's the whole show."]),
    mia_sun:    Qk('mia_sun','mia','No curtains in the green room (the plants need all the light)',{kinds:['curtain'],max:0,room:'green'},
                   ["The window is bare and the plants are sunbathing. Thank you.","The curtains are keeping the sun off my seedlings."]),
    mia_blooms: Qk('mia_blooms','mia','Flowers by the bed, picked from the garden',{kinds:['flowers'],min:1},
                   ["Flowers by the bed. You know me too well.","No flowers by the bed. I'll have to pick some myself."]),
    noor_soft:  Qk('noor_soft','noor','Something soft to quiet the room: a rug or curtains',{kinds:['rug','curtain'],min:1},
                   ["Soft things. I played a wrong note and nobody heard it.","A hard room is a loud room. The neighbours would have heard."]),
    theo_stools:Qk('theo_stools','theo','Two stools at the counter (he is always up and down)',{kinds:['stool'],min:2,room:'kitchen'},
                   ["Two stools. Elena sat on one and I sat on the other and we both ate toast. Perfect.","No stools at the counter. I'm always up and down."]),
    theo_rug:   Qk('theo_rug','theo','A soft rug (she runs everywhere now, in socks)',{kinds:['rug'],min:1},
                   ["A soft rug. She slid across it three times and cheered.","Wren does her running in socks. A soft rug would have helped."]),
    rosa_daylight:Qk('rosa_daylight','rosa','No curtains in the sewing room (one must see the colour of thread in daylight)',{kinds:['curtain'],max:0,room:'spare'},
                   ["Bare windows. One can see the true colour of everything.","Curtains in a sewing room. One can't match thread through lace."])
  };
  // each job lists the quirks it knows about (ids); here they become the real thing
  QUESTS.forEach(function(q){ q.quirks = (q.quirks || []).map(function(id){ return QUIRKS[id]; }); });

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

  /* ---------------------------------------------------------- lives moving on */
  // What a neighbour is "now": their age (birthdays fall on the 1st of a month), their job
  // and a line about them that moves on with each job you finish.
  function ageOf(cid, day){
    var c = CHARACTERS[cid], d = dateOf(day || 0), t = TOWN.calendar;
    var b = c.bday == null ? 0 : c.bday;
    return c.age + (d.y - t.year) + (d.m >= b ? 1 : 0) - (t.month >= b ? 1 : 0);
  }
  function jobAtDay(cid, day){
    var job = CHARACTERS[cid].job;
    questsOf(cid).forEach(function(q){ if (q.day <= day && q.job) job = q.job; });
    return job;
  }
  function jobOf(cid, doneMap){
    var job = CHARACTERS[cid].job;
    questsOf(cid).forEach(function(q){ if (doneMap && doneMap[q.id] && q.job) job = q.job; });
    return job;
  }
  var BLURBS = {
    MIA_01:"Has her own keys, a living room, and a florist on her street.",
    MIA_02:"The whole flat is hers now, with a standing Friday order of dahlias.",
    MIA_03:"Has taken up gardening. The little green room is a seed nursery.",
    MIA_04:"Alex has moved in. There are board games in the hall and a bike in the bedroom.",
    MIA_05:"A garden with a crooked apple tree, a table for six, and a stall by the gate.",
    MIA_06:"Engaged! Grows her own flowers and is happier than anyone has seen her.",
    JULES_01:"The attic is unpacked. The paint, naturally, first.",
    JULES_02:"Has been paid for a book jacket and is not over it.",
    JULES_03:"Graduated in a hat that didn't fit. Has clients, deadlines and a laptop.",
    JULES_04:"Has prints at the Paper Moth and a flat of her own at the Mills.",
    JULES_05:"Sold all six. The gallery wants twelve more, and she sleeps in a bed now.",
    JULES_06:"The top floor of the mill is hers. The Paper Moth keeps a waiting list.",
    SAM_01:"Cooks for eleven in a kitchen with ambitions. Still waiting for an oven.",
    SAM_02:"Dinner for twelve is a regular thing now.",
    SAM_03:"Guests stay until 2am, which Sam considers a triumph.",
    SAM_04:"Head of events. Robin has moved in and sleeps lightly.",
    SAM_05:"Quit with a speech. Sam & Co. Events has a client, an invoice and an office.",
    SAM_06:"Sam & Robin bought their first place together, over the old market.",
    NOOR_01:"The bedroom is quiet. She has not said thank you. She has nodded.",
    NOOR_02:"Said ‘you understood me’ out loud, within hearing of two colleagues.",
    NOOR_03:"Is learning the piano. Do not mention it.",
    NOOR_04:"Made partner and bought the top floor of her own building.",
    NOOR_05:"Two quiet rooms and exactly one lamp.",
    NOOR_06:"Left the firm, politely. Noor Architects has one desk and she says it is enough.",
    THEO_01:"Settling into a cabin on Lantern Lane. Baby due in spring.",
    THEO_02:"Wren is here. So is a great deal of laundry.",
    THEO_03:"Practising at home for something much bigger than home.",
    THEO_04:"Co-owner of Crumb & Crown. The shop cat came with it.",
    THEO_05:"A family flat on Orchard Rise, with a dining room for grandad.",
    THEO_06:"Owner of Crumb & Crown and dad to a two-year-old with opinions.",
    ROSA_01:"Has opinions about beige. They are not favourable.",
    ROSA_02:"Teaches sewing at the village hall. Everyone stays for tea.",
    ROSA_03:"Twelve pupils and a waiting list. She says this is the correct number.",
    ROSA_04:"Bought a cabin on Lantern Lane and kept the flat. ‘I am not a monster.’",
    ROSA_05:"Sleeps to the sound of the water more often than not.",
    ROSA_06:"Runs The Costume Cupboard in Old Town. Retired in name only."
  };
  function blurbOf(cid, doneMap){
    var b = CHARACTERS[cid].blurb;
    questsOf(cid).forEach(function(q){ if (doneMap && doneMap[q.id] && BLURBS[q.id]) b = BLURBS[q.id]; });
    return b;
  }

  /* ----------------------------------------------------------- places & happenings */
  // Little places that appear on the map as the story goes on. Shops stay for
  // good. Happenings are on for `len` days from `day`. There is no money in the
  // Cove: shops set pieces aside by reputation (see SHOP_STOCK) and happenings
  // have little things to do (see EVENT_PLAY).
  var SPOTS = [
    { id:'flowers',  kind:'shop', icon:'flower',  name:'Fennel & Fern',          x:54.3, y:54.3, day:D(1),
      blurb:"A striped awning, buckets of dahlias and a very serious cat called Parsley.", soon:"Ask Parsley nicely: the best bunches get set aside for people the town knows." },
    { id:'bakery',   kind:'shop', icon:'loaf',    name:'Crumb & Crown Bakery',     x:41.5, y:56.5, day:D(4),
      blurb:"Open at seven, sold out by eleven. The old baker is handing Theo every recipe he owns, one loaf at a time. A shop cat supervises.", soon:"The baker puts the best cakes aside for people the town knows." },
    { id:'antiques', kind:'shop', icon:'urn',     name:'Marigold & Moss Antiques', x:50.5, y:23.2, day:D(7),
      blurb:"In the pink house with the porch on Lantern Lane, where the old families of the Cove send their attics. Chairs with stories, lamps with opinions, most of it very heavy.", soon:"Marigold keeps her best pieces back for people the town trusts." },
    { id:'books',    kind:'shop', icon:'book',    name:'The Dog-Eared Bookshop',   x:27.0, y:22.0, day:D(11),
      blurb:"A crooked little shop on Orchard Rise with a ladder on rails, a sleeping dog and a very good children's corner.", soon:"The good shelves are kept for people who have earned a bit of a name." },
    { id:'gallery',  kind:'shop', icon:'frame',   name:'The Paper Moth Gallery',   x:95.2, y:40.5, day:D(14),
      blurb:"Small prints, big frames, and a free glass of something fizzy on opening night.", soon:"The best prints are hung for people the town speaks well of." },
    { id:'miagarden', kind:'shop', icon:'flower', name:"Mia's Garden Gate",        x:24.4, y:62.0, day:D(25), needs:'MIA_05',
      blurb:"A trestle by the garden gate with buckets of whatever bloomed this morning, a jar for the money nobody uses, and a hand-written sign: “Friends pay less.”", soon:"Mia keeps the best bunches back for friends of the street." },

    { id:'fleamarket', kind:'happening', icon:'flag', name:'Flea Market on Orchard Green', x:46.0, y:19.5, day:D(2), len:28,
      blurb:"Tables of teapots, brass bells and one suspiciously large clock. Bring a bag." },
    { id:'harvest',  kind:'happening', icon:'flag',   name:'Harvest Market',      x:49.0, y:56.0, day:D(5), len:28,
      blurb:"Pumpkins, chutneys and a jam stall with a queue. Old Town smells of cinnamon." },
    { id:'lights',   kind:'happening', icon:'lantern', name:'Winter Lights',       x:30.0, y:63.0, day:D(6), len:28,
      blurb:"Every window on Church Hill gets a candle. The steeple gets a star." },
    { id:'tulips',   kind:'happening', icon:'flower', name:'Tulip Day at Fennel & Fern', x:54.3, y:52.0, day:D(10), len:28,
      blurb:"A bucket of tulips outside for everyone, free. Parsley supervises the queue." },
    { id:'regatta',  kind:'happening', icon:'sail',   name:'Summer Regatta',   x:61.5, y:87.0, day:D(13), len:28,
      blurb:"Sails, bunting and a prize for the most dramatic wobble." },
    { id:'appleday', kind:'happening', icon:'flag',   name:'Apple Day on Orchard Green', x:46.0, y:19.5, day:D(16), len:28,
      blurb:"Every garden brings its one stubborn apple tree's apples. There is a competition. There is always a competition." },
    { id:'soupswap', kind:'happening', icon:'bell', name:'Soup Swap on Church Hill', x:29.5, y:60.0, day:D(18), len:28,
      blurb:"Bring a pot, leave with a different pot. Forty ladles and a very opinionated dachshund." },
    { id:'eggs',     kind:'happening', icon:'flag',   name:'Egg Hunt on Orchard Green', x:46.0, y:19.5, day:D(22), len:28,
      blurb:"Chocolate eggs in the hedges and one very suspicious dachshund." },
    { id:'bonfire',  kind:'happening', icon:'lantern', name:'Summer’s End Bonfire',   x:5.5, y:88.5, day:D(26), len:28,
      blurb:"On the beach below Church Hill. Marshmallows, guitar, and someone's grandad telling the same story." },
    { id:'openstudio', kind:'happening', icon:'frame', name:'Open Studio at the Mills', x:85.0, y:62.0, day:D(27), len:28,
      blurb:"Doors open all along the loft stairwells. Paint, prints, tea and a cake that was definitely baked by someone else." },
    { id:'lantern',  kind:'happening', icon:'lantern', name:'Lantern Night on Lantern Lane', x:47.0, y:26.0, day:D(30), len:28,
      blurb:"Paper lanterns along the lane, hot chocolate, and a neighbour who ‘didn't plan any of this’." },
    { id:'wedding',  kind:'happening', icon:'bell',   name:"Mia & Alex's Wedding", x:33.0, y:54.0, day:D(33), len:55,
      blurb:"Saturday 22 April, two o'clock, at the white church. The whole street is invited." }
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
    // shops open
    { id:'e_flowers', day:D(1), kind:'shop', spot:'flowers', title:'A florist has opened on Canal Row',
      lines:["Fennel & Fern has put out its striped awning and a hundred buckets of dahlias.","Parsley the shop cat is in charge of the till. Mia was seen outside before it opened. Obviously."] },
    { id:'e_bakery', day:D(4), kind:'shop', spot:'bakery', title:'A bakery has opened in Old Town',
      lines:["Crumb & Crown has lit its ovens on the corner by the clock tower. Open at seven, sold out by eleven.","The old baker is teaching Theo the recipes. The shop cat supervises both of them."] },
    { id:'e_antiques', day:D(7), kind:'shop', spot:'antiques', title:'Antiques on Lantern Lane',
      lines:["Marigold & Moss has opened in the pink house with the porch on Lantern Lane, where the old families send their attics.","Everything is ‘one of a kind’. Most of it is very heavy."] },
    { id:'e_books', day:D(11), kind:'shop', spot:'books', title:'A bookshop on Orchard Rise',
      lines:["The Dog-Eared Bookshop has opened in the crooked house on the lane: a ladder on rails, a sleeping dog and a very good children's corner.","The dog is not for sale. People have asked."] },
    { id:'e_gallery', day:D(14), kind:'shop', spot:'gallery', title:'A gallery on the Far Shore',
      lines:["The Paper Moth has opened in the red-brick house across the water: small prints, big frames, a very quiet owner.","Opening night: a free glass of something fizzy."] },
    { id:'e_miastall', day:D(25), kind:'shop', spot:'miagarden', title:"Mia's garden gate is open",
      lines:["A trestle table by the gate of the garden flat on Church Hill, buckets of whatever bloomed this morning, and a sign: “Friends pay less.”","Parsley has been to inspect it. Parsley has opinions about the dahlias."] },

    // one happening in every season
    { id:'e_flea', react:[['jules',"A teapot, a clock and nothing I needed. Perfect."],['mia',"I'm bringing a tin of lemon cookies. For research."],['sam',"Fourteen stalls and not one with a proper sign. I'm only offering to help."]], day:D(2), kind:'happening', spot:'fleamarket', title:'Flea Market on Orchard Green',
      lines:["Saturday morning, long tables, hand-painted signs: teapots, brass bells, a very large clock.","Bring a bag. Haggle politely."], tease:"Flea market on Orchard Green" },
    { id:'e_harvest', react:[['rosa',"Yellow everywhere. Autumn finally agrees with me."],['mia',"I'm entering the pumpkin loaf. Quietly."],['sam',"I'm not catering. I'm advising. Loudly."]], day:D(5), kind:'happening', spot:'harvest', title:'Harvest Market in Old Town',
      lines:["Pumpkins, chutneys and a jam stall with an actual queue.","The first red leaf landed on the clock tower on Tuesday. The market is its reward."], tease:"Harvest Market in Old Town" },
    { id:'e_lights', react:[['sam',"I may have helped with the star. Only a little. Someone held the ladder."],['rosa',"I'm sewing little cloaks for the lantern children."],['mia',"Soup. I'm bringing soup. And bread."]], day:D(6), kind:'happening', spot:'lights', title:'Winter Lights on Church Hill',
      lines:["Every window gets a candle. The steeple gets a star.","Neighbours bring soup, and a surprising amount of tinsel."], tease:"Winter Lights on Church Hill" },
    { id:'e_tulips', react:[['mia',"Tulips! For the bedroom, the table, and possibly my hair."],['jules',"Yellow ones. For the easel. Obviously."],['sam',"I walked past. Twice. I didn't take one. (I took one.)"]], day:D(10), kind:'happening', spot:'tulips', title:'Tulip Day at Fennel & Fern',
      lines:["A bucket of tulips outside the shop for anyone who wants one, free.","Parsley supervises the queue and judges your choice."], tease:"Tulip Day at Fennel & Fern" },
    { id:'e_regatta', react:[['sam',"A prize for the most dramatic wobble? I've entered myself."],['theo',"Lovely boats. I'd have put gears on them."],['mia',"I'll wave from the harbour wall. And bake for the winners."]], day:D(13), kind:'happening', spot:'regatta', title:'Summer Regatta at the Harbour',
      lines:["Bunting on every mast and a prize for the most dramatic wobble.","The harbour master has been practising his ‘ahoy’."], tease:"Summer Regatta at the Harbour" },
    { id:'e_apple', react:[['mia',"An apple tart. Perhaps three. For the competition, obviously."],['rosa',"Autumn. At last, a season with proper colours."],['theo',"Our tree's apples are tiny. I'm entering them anyway."]], day:D(16), kind:'happening', spot:'appleday', title:'Apple Day on Orchard Green',
      lines:["Every garden on the Rise brings the apples of its one stubborn tree. There is a competition.","There is always a competition."], tease:"Apple Day on Orchard Green" },
    { id:'e_soup', react:[['mia',"Pumpkin and lemon soup. Don't ask. Do taste."],['rosa',"I'll bring a ladle and an opinion."],['noor',"A pot with a lid that fits. I check."]], day:D(18), kind:'happening', spot:'soupswap', title:'Soup Swap on Church Hill',
      lines:["Bring a pot of something hot, leave with someone else's pot of something hot.","Forty ladles, six leeks and a very opinionated dachshund."], tease:"Soup swap on Church Hill" },
    { id:'e_eggs', react:[['theo',"Wren is too small to hunt, so she supervises from a pram."],['mia',"I'll bake an egg-shaped cake. Don't judge me."],['rosa',"Costumes for the little ones: bunny ears, whiskers, the lot."]], day:D(22), kind:'happening', spot:'eggs', title:'Egg Hunt on Orchard Green',
      lines:["Chocolate eggs in the hedges and one very suspicious dachshund.","Under-sevens first, then everybody."], tease:"Egg hunt on Orchard Green" },
    { id:'e_bonfire', react:[['jules',"Sparks and charcoal. I may sketch with a burnt stick."],['mia',"Marshmallows. Maybe I'll even stay past nine."],['sam',"I brought the sausages. I'm not saying I organised it."]], day:D(26), kind:'happening', spot:'bonfire', title:'Summer’s End Bonfire on the Beach',
      lines:["The last warm evening ends with a fire on the sand below Church Hill.","Marshmallows, a guitar and somebody's grandad telling the same story."], tease:"Bonfire on the beach" },
    { id:'e_studio', react:[['mia',"I baked the cake. Jules asked very nicely. Several times."],['noor',"I'll come. I'll admire. I'll say nothing about the staircase."],['rosa',"I'll bring a shawl, in case someone needs a costume."]], day:D(27), kind:'happening', spot:'openstudio', title:'Open Studio at the Mills',
      lines:["Doors open all along the loft stairwells: paint, prints, tea and a very large dog.","The cake was definitely baked by someone else."], tease:"Open Studio at the Mills" },
    { id:'e_lantern', react:[['theo',"Hot chocolate for the lane. Elena says I'm in charge of the mugs."],['mia',"I'm baking for the whole lane. Possibly twice."],['rosa',"Candlelight in the trees, right outside my own door. I shall wear the green shawl."]], day:D(30), kind:'happening', spot:'lantern', title:'Lantern Night on Lantern Lane',
      lines:["Paper lanterns line the lane at dusk and little candle boats are set afloat in the bay. Hot chocolate by the cabins.","Bring a jumper; the evenings get cold fast."], tease:"Lantern Night on Lantern Lane" },
    { id:'e_wedding', react:[['rosa',"I'm making the veil. Don't tell Mia."],['sam',"I offered to produce it. I've been told to stand quietly."],['noor',"I'll bring a gift and an opinion on the pews."]], day:D(33), kind:'invite', spot:'wedding', from:'mia', title:'You are invited',
      names:'Mia & Alex', lines:["are getting married.","Saturday 22 April · Two o'clock · The white church on Church Hill","Cake to follow. Tea to follow cake. Dancing to follow tea."],
      sign:'Please say yes. There is a lemon loaf.', tease:"Mia & Alex's wedding" },

    // a birth
    { id:'e_birth', react:[['rosa',"Coat measured, cut and basted. She won't escape it."],['mia',"A lemon loaf is on its way. And no vases."],['jules',"I drew her a tiny heron in a tiny raincoat."]], day:D(9), kind:'birth', from:'theo', title:'Wren has arrived!',
      lines:["Wren, born on a very rainy morning, a few weeks before she was due. Loud, tiny, and already in charge.","Theo and Elena say thank you for the living room, and ask for no vases."], sign:'Theo, Elena & Wren' },

    // moves: these arrive when the matching job is finished
    { id:'h_jules', react:[['mia',"Cake is in the oven. It's lemon. It's always lemon."],['noor',"I looked at the staircase. It is four millimetres off. I love it."],['rosa',"Six prints on a gallery wall. I'll buy one. I'll haggle."]], after:'JULES_04', kind:'home', who:'jules', home:'JULES_HOME_B', title:'Jules has moved flats',
      lines:["Same mill, one staircase along: two rooms, one for painting and one, eventually, for living.","The gallery has taken six prints. Jules has not stopped smiling since."] },
    { id:'h_noor', react:[['sam',"A ceiling for a kite! I'll bring a ladder. And wine."],['jules',"I'm making her a very small, very square drawing."],['theo',"Up that many stairs? I'll bring the bread. Warm."]], after:'NOOR_04', kind:'home', who:'noor', home:'NOOR_HOME_B', title:'Noor bought the top floor',
      lines:["Same tower, a few floors higher: tall windows, a ceiling you could lose a kite in.","No desk. She was very clear."] },
    { id:'h_rosa', react:[['theo',"A neighbour up the lane! I'll bring bread. And Wren."],['mia',"Tea with a view of the bay. I'm bringing the lemon loaf."],['jules',"Ducks on the cushions? I can draw some. Don't tell her."]], after:'ROSA_04', kind:'home', who:'rosa', home:'ROSA_CABIN_A', second:true, title:'Rosa has bought a cabin',
      lines:["A little house on Lantern Lane, with a kitchen window that looks straight down to the bay.","She is keeping her flat in town. ‘I am not a monster, darling.’"] },
    { id:'h_mia', react:[['rosa',"A tablecloth, darling. She's grown up."],['jules',"I'm bringing a painting. Don't say no."],['sam',"A table that seats six? I can work with that."]], after:'MIA_05', kind:'home', who:'mia', home:'MIA_HOME_B', title:'Mia & Alex have a garden',
      lines:["Keys in, boxes unpacked (mostly), a dining table with an actual tablecloth and a crooked apple tree out the back.","Mia's first flat on Canal Row is quiet now. The new place is on Church Hill."] },
    { id:'h_theo', react:[['rosa',"A dining room for grandad and the aunts. Wonderful."],['mia',"I'm baking for the housewarming. Obviously."],['noor',"A sideboard that follows them. I respect that."]], after:'THEO_05', kind:'home', who:'theo', home:'THEO_HOME_B', title:'Theo & Elena have a family flat',
      lines:["A proper dining room on Orchard Rise, with space for grandad, the aunts and the sideboard.","The cabin on Lantern Lane is quiet now. Wren has already named the new stairs."] },
    { id:'h_jules2', react:[['mia',"Cake. Don't ask. It's lemon."],['noor',"A door that closes. Finally, an artist with sense."],['sam',"I'm planning the Open Studio. Jules says I'm not. I'm planning it."]], after:'JULES_06', kind:'home', who:'jules', home:'JULES_LOFT', title:'Jules has moved to the top floor',
      lines:["Same mill, the top floor: a loft with a door that closes and a room just for paint.","The Paper Moth has a waiting list for the next prints. Three years ago it was one suitcase and eleven boxes of paint."] },
    { id:'h_sam', react:[['noor',"A dish rack and a big kitchen. A good start."],['mia',"I'll bring bread. Sam will bring opinions."],['rosa',"Red and leather? He listens, that one."]], after:'SAM_06', kind:'home', who:'sam', home:'SAM_HOME_B', title:'Sam & Robin bought a home',
      lines:["Their first place together, in Old Town, with a dish rack and a very big kitchen.","The oven is, we are told, ‘on its way’."] }
  ];

  /* ------------------------------------------------------------------ shops
     No money in the Cove, so the shops go by reputation instead: a shopkeeper
     sets pieces aside for people the town trusts. Each shelf has a renown level
     (index into RENOWN_LEVELS: 0 Hobbyist, 1 Friend of the Street, 2 Local
     Favourite, 3 Pride of the Cove). Once you reach it you can go to the shop
     and take the piece home; it is yours for every job after that.
     A row can carry a third entry, a season ('spring' | 'summer' | 'autumn' | 'winter'):
     that piece is only on the shelves in that season (taken pieces stay yours).
     `have` = pieces the shop also stocks that are already on your shelves.
     (Free play ignores all of this: everything is there from the start.) */
  var SHOP_STOCK = {
    bakery: {
      stock: [
        ['stacked-cups-beige',0,'spring'], ['food-bread-basket-baquettes',6,'spring'], ['food-bakedbread',16,'spring'], ['food-cookie-jar',26,'spring'], ['mixer-eduard-chrome',53,'spring'], ['food-pistachio-cake',85,'spring'],
        ['stacked-plates-white',0,'summer'], ['food-bread-basket',4,'summer'], ['water-carafe-sima-chrome',14,'summer'], ['food-lemon-cake',32,'summer'], ['oil-bottle-green',47,'summer'], ['food-strawberry-cake',100,'summer'],
        ['sprenkled-plates',0,'autumn'], ['food-bread-coolingrack',7,'autumn'], ['stacked-pots-orange',12,'autumn'], ['food-pecan-pie',28,'autumn'], ['coffeemaker-alana',56,'autumn'], ['food-plum-cake',90,'autumn'],
        ['kettle-adam-chrome',0,'winter'], ['food-muffin-tray',5,'winter'], ['stacked-cups-blue',15,'winter'], ['food-orange-cake',24,'winter'], ['mocca-maker-fred-silver',50,'winter'], ['food-redvelvet-cake',105,'winter']
      ],
      have: ['food-cuttingboard-withdough','food-cuttingboards-wood','food-cuttingboards-marble','food-potcollection-copper']
    },
    flowers: {
      stock: [
        ['plant-kiki',0,'spring'], ['flowers-hilda-white',6,'spring'], ['vase-serena',16,'spring'], ['flowers-nina-rosa',47,'spring'], ['flowers-sia-green',100,'spring'],
        ['hangingplant-sulie',0,'summer'], ['flowers-dara-blue',4,'summer'], ['fiddle-leaf-small',14,'summer'], ['flowers-lia-blue',56,'summer'], ['monstera-tall',90,'summer'],
        ['mini-plant',0,'autumn'], ['flowers-gina-brown',7,'autumn'], ['plant-zilotta',12,'autumn'], ['flowers-nadja-red',50,'autumn'], ['plant-hugo',105,'autumn'],
        ['vase-timmy',0,'winter'], ['flowers-mina-red',5,'winter'], ['plant-sala',15,'winter'], ['fiddle-leaf-tall',44,'winter'], ['zuzu-plant-tall',95,'winter']
      ],
      have: ['blooming-flowers','flowers-jutta-rosa','flowers-sia-rosa','flowers-lola-white','monstera-small']
    },
    antiques: {
      stock: [
        ['sideboard-nikola-darkwood',0,'spring'], ['recordplayer-rosa',6,'spring'], ['lamp-felix',16,'spring'], ['marble-pillar-jutta',26,'spring'], ['rug-elena-darkbrown',53,'spring'], ['piano-luther-white',85,'spring'],
        ['cabinet-hime',0,'summer'], ['recordplayer-beige',4,'summer'], ['lamp-heidi-blue',14,'summer'], ['piano-alexander-brown',32,'summer'], ['cowhide-carrie-lightbrown',47,'summer'], ['piano-beth-brown',100,'summer'],
        ['sideboard-akio-darkwood',0,'autumn'], ['recordplayer-black',7,'autumn'], ['standing-lamp-jonah',12,'autumn'], ['piano-alexander-black',28,'autumn'], ['armchair-cherice-brown',56,'autumn'], ['piano-beth-black',90,'autumn'],
        ['sideboard-toto-darkwood',0,'winter'], ['fireplace-maka-beige',5,'winter'], ['wall-lamp-stefania',15,'winter'], ['fireplace-marlo-marble-grey',24,'winter'], ['armchair-eddy-green',50,'winter'], ['grand-piano-riga-black',105,'winter']
      ],
      have: ['sideboard-lulu-darkwood','cabinet-luna-darkwood','armchair-bruno-green','wall-lamp-rita']
    },
    books: {
      stock: [
        ['wallshelf-omo',0,'spring'], ['book-collection-beige',6,'spring'], ['lamp-juniper',16,'spring'], ['book-collection-marblebookends-small',26,'spring'], ['bookshelf-atina-mediumwood',53,'spring'], ['books-leaning-white',85,'spring'],
        ['wallshelf-cudos-lightwood',0,'summer'], ['book-collection-blue-21',4,'summer'], ['armchair-lisa-beige',14,'summer'], ['book-collection-blue-22',32,'summer'], ['bookshelf-atoria-mediumwood',47,'summer'], ['books-stacked-white-small',100,'summer'],
        ['wallshelf-cudos-mediumwood',0,'autumn'], ['book-collection-earthy',7,'autumn'], ['pillow-willow-beige',12,'autumn'], ['book-collection-marblebookends-wide',28,'autumn'], ['lamp-imogen',56,'autumn'], ['books-stacked-thick-beige',90,'autumn'],
        ['wallshelf-cudos-darkwood',0,'winter'], ['bockstack-01',5,'winter'], ['pillow-willow-blue',15,'winter'], ['book-collection-beige-thick',24,'winter'], ['armchair-lisa-grey',50,'winter'], ['books-stacked-thick-black',105,'winter']
      ],
      have: ['book-collection-big','book-collection-small','book-collection-orange','book-stack-standing','bockstack-02','books-blank-stack-white']
    },
    miagarden: {
      stock: [
        ['plant-kiko',0,'spring'], ['sidetable-eve',8,'spring'], ['zuzu-plant',19,'spring'], ['plant-aria',54,'spring'],
        ['banana-leaf',0,'summer'], ['stool-cobi-green',6,'summer'], ['pothos-potted',17,'summer'], ['fiddle-leaf-medium',63,'summer'],
        ['snake-plant',0,'autumn'], ['lamp-ivy',9,'autumn'], ['ficus-elastica',15,'autumn'], ['rubber-tree-alix',57,'autumn'],
        ['faux-fern',0,'winter'], ['chair-tony',7,'winter'], ['plant-svenja',18,'winter'], ['snake-plant-tall',51,'winter']
      ],
      have: []
    },
    gallery: {
      stock: [
        ['rug-spirelli-rosa',0,'spring'], ['painting-field-beige',14,'spring'], ['stone-couchtable-iris',32,'spring'], ['painting-shadow-fern-pink',90,'spring'],
        ['lamp-fulu-blue',0,'summer'], ['painting-green-mist',12,'summer'], ['rug-jannis-rosa',28,'summer'], ['painting-polly-blue-beige',105,'summer'],
        ['lamp-fulu-blush',0,'autumn'], ['painting-rocks-beige-dark',15,'autumn'], ['travertine-couchtable-sara',24,'autumn'], ['paiting-easel-karl',95,'autumn'],
        ['cowhide-carrie-black',0,'winter'], ['modern-painting',13,'winter'], ['marble-couchtable',30,'winter'], ['painting-turner-pink',85,'winter']
      ],
      have: ['painting-fern','painting-fern-blue','painting-livia','painting-polly-green-beige','painting-turner-beige','wallart-tulipa']
    }
  };
  // How well the town must know you before a shop sets a piece aside (renown points). These are the
  // shop's own steps, higher than the job levels, so early on you will see lovely things you cannot
  // have yet. They come round again every year.
  var SHOP_TIERS = [ { at:0, title:'Passer-by' }, { at:12, title:'Familiar Face' }, { at:30, title:'Trusted Neighbour' }, { at:55, title:'Cove Favourite' } ];
  function shopTier(points){
    var t = 0;
    for (var i = 0; i < SHOP_TIERS.length; i++) if (points >= SHOP_TIERS[i].at) t = i;
    return t;
  }
  // what the shopkeeper says when you take something home
  var SHOP_SAY = {
    bakery:   { one:"Thanks for stopping by! It will be boxed up and sent over still warm. Enjoy it!", many:"Thanks for stopping by! Everything will be boxed up and sent over still warm. Enjoy!" },
    flowers:  { one:"Thanks for stopping by! It will be wrapped up and sent over to you. Take good care of it!", many:"Thanks for stopping by! The plants will be packed up and sent over to you. Take good care of them!" },
    antiques: { one:"A fine choice. Marigold will wrap it in old newspaper and have it sent over. Mind the weight!", many:"A fine haul. Marigold will wrap everything in old newspaper and have it sent over. Mind the weight!" },
    books:    { one:"Thanks for stopping by! It will be wrapped in brown paper and sent over. Happy reading!", many:"Thanks for stopping by! They will be wrapped in brown paper and sent over. Happy reading!" },
    miagarden:{ one:"“Friends pay less,” says Mia, and wraps it in yesterday's newspaper. It will be sent over, roots and all.", many:"“Friends pay less,” says Mia, and wraps everything in yesterday's newspaper. It will all be sent over, roots and all." },
    gallery:  { one:"Lovely choice. It will be wrapped with care and sent over to you.", many:"Lovely choices. Everything will be wrapped with care and sent over to you." }
  };
  var SHOP_OWNER = {};   // item id -> { spot, need (renown points), season|null }
  Object.keys(SHOP_STOCK).forEach(function(spot){
    SHOP_STOCK[spot].stock.forEach(function(r){ SHOP_OWNER[r[0]] = { spot:spot, need:r[1], season:r[2] || null }; });
  });
  function shopOf(itemId){ return SHOP_OWNER[itemId] || null; }

  /* ------------------------------------------------------------------ playing the events
     Every happening has three little things to do or people to talk to. Each
     has three answers (the first one listed is the right one; the game shuffles
     them). Get two of the three right and the town gives you a keepsake from
     the day. The prizes below are stand-ins from the existing catalogue; swap
     the id for a new seasonal piece whenever it exists. A wrong answer only
     earns a funny line, and you can always try again. */
  var EVENT_PLAY = {
    e_bonfire: { prize:'cowhide-carrie-darkbrown', prizeSay:"Something warm to sit on, still smelling faintly of woodsmoke.", st:[
      { who:'Sam', c:'sam', role:'Events producer', say:"Fire's built, sausages are ready. Where does everybody sit?", o:[
        ["In a wide circle, facing the sea.", "“A view and a fire. See? Production.”"],
        ["Wherever they like.", "“Chaos. Charming chaos. I'll allow it.”"],
        ["As close to the flames as possible.", "“Warm. Briefly. Then very much not.”"] ] },
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"Someone's offered me a marshmallow stick. It's nearly nine, which is when I usually go home.", o:[
        ["Take it, toast one, stay a little longer.", "“…One more. Just one more. Okay, three.”"],
        ["Say thanks and head home.", "“Sensible. Slightly sad. Sensible.”"],
        ["Toast the whole bag at once.", "A small fireball is reported. Nobody is hurt. Everybody is delighted."] ] },
      { who:'Jules', c:'jules', role:'Illustration student', say:"I want to draw the fire, but all I have is a pencil. Ideas?", o:[
        ["Take a burnt stick from the edge. Free charcoal.", "“A BURNT STICK. You get me.”"],
        ["Borrow somebody's pen.", "“Fine, but pens don't smudge. I need smudge.”"],
        ["Hold the pencil in the fire for effect.", "“Now I have a pencil stub and a legend.”"] ] }
    ]},
    e_apple: { prize:'plant-hector', prizeSay:"A little apple tree in a pot, tiny apples and all.", st:[
      { who:'Judge Hollis', c:null, role:'Apple Day judge', say:"A shiny giant, a lumpy one with a lovely smell, or Theo's tiny one off the cabin tree. Which takes the ribbon?", o:[
        ["Theo's tiny one. It has the best story.", "“Same as last year. The town expects it.”"],
        ["The shiny giant.", "“Handsome. Wooden inside, I'd wager.”"],
        ["All of them, baked in one pie.", "“Disqualified for being delicious.”"] ] },
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"I'm baking apple tart for the competition. One big one, or more?", o:[
        ["One for the table, one for the judge, one for emergencies.", "“Three! The emergency one is always the best one.”"],
        ["One big one.", "“Big. Impressive. Very hard to slice quietly.”"],
        ["Lemon. Obviously.", "“…It's an apple day. But I appreciate you.”"] ] },
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"The light on the orchard is pure gold. What should I wear to judge?", o:[
        ["The mustard coat. It matches the leaves.", "“Matching the season is simply good manners.”"],
        ["The green shawl.", "“Lovely, darling, but it argues with the trees.”"],
        ["Her old rain mac.", "“I am not dressing as a bin bag.”"] ] }
    ]},
    e_studio: { prize:'standig-lamp-jens', prizeSay:"A tall studio lamp that someone left behind on the stairs.", st:[
      { who:'Jules', c:'jules', role:'Illustration student', say:"Someone asked the price of the print by the door and I panicked. What do I say?", o:[
        ["A small, honest price, and a smile.", "“Honest. Small. A smile. I can do a smile.”"],
        ["“Whatever you like.”", "“Last time somebody paid me in biscuits.”"],
        ["Triple it. Art is expensive.", "“Triple. I like your confidence. I do not like my rent.”"] ] },
      { who:'Noor', c:'noor', role:'Architect', say:"The staircase is four millimetres off. Do I tell Jules?", o:[
        ["Tell her you love it.", "“I do love it. That is the part I will say.”"],
        ["Say nothing.", "“A silence. She'll know. They always know.”"],
        ["Bring a spirit level.", "“…I did bring one. How did you know.”"] ] },
      { who:'Jules', c:'jules', role:'Illustration student', say:"Whose name goes on the cake card? It was definitely baked by someone else.", o:[
        ["Mia's, in nice letters. Credit where it's due.", "“Mia. In nice letters. She'll cry.”"],
        ["No name. A mystery cake.", "“Mystery cake. People will ask. I'll lie.”"],
        ["Yours, obviously.", "“Mine? She'd find out by the first bite.”"] ] }
    ]},
    e_tulips: { prize:'flowers-frida-rosa', prizeSay:"A free bunch of tulips, still cold from Parsley's bucket.", st:[
      { who:'Jules', c:'jules', role:'Illustration student', say:"Tulips for my easel. Which colour sits between blue and orange?", o:[
        ["Yellow.", "“Yellow. Of course. How did I not see it?”"],
        ["Red.", "“Red fights with orange. Loudly.”"],
        ["Purple with a bow.", "“A bow. On a tulip. I'm unwell.”"] ] },
      { who:'Sam', c:'sam', role:'Events producer', say:"I walked past twice and then took one. How do I make this right?", o:[
        ["Leave a thank-you note at the shop door.", "“A note! Production values! I'm going to cry a little.”"],
        ["Put it back.", "“A tulip can't be put back. That's not how stems work.”"],
        ["Take a second one so it balances.", "“It does not balance. Parsley is watching.”"] ] },
      { who:'Parsley', c:null, role:'Shop cat', say:"Parsley sits between two buckets and stares at you. One is yellow, one is red.", o:[
        ["Choose the bucket she's sitting beside.", "Parsley blinks slowly. The highest of honours."],
        ["Choose the bigger bucket.", "Parsley closes her eyes. You have been dismissed."],
        ["Ignore the cat.", "Parsley knocks a tulip into the street, with great intention."] ] }
    ]},
    e_eggs: { prize:'bowl-with-oranges', prizeSay:"A bowl of the last few eggs, found behind the hedge.", st:[
      { who:'Theo', c:'theo', role:'Baker', say:"Wren is too small for eggs, but I'm hiding some anyway. Where?", o:[
        ["Low in the hedge, where under-sevens reach.", "“Low. Of course. I keep forgetting I'm tall.”"],
        ["On top of the church.", "“Even I can't reach that. The pigeons can.”"],
        ["In the dachshund's bed.", "The dachshund is delighted. The eggs are… less so."] ] },
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"Egg-shaped cake. Don't judge me. What flavour?", o:[
        ["Lemon.", "“LEMON. You never doubted me.”"],
        ["Chocolate.", "“Chocolate. It's fine. It's a chocolate day.”"],
        ["Sardine.", "“…Please never say that near a cake again.”"] ] },
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"Bunny ears for the little ones. How many pairs shall I make?", o:[
        ["A few more than the number of children.", "“Spares. Always spares. Somebody sits on a pair.”"],
        ["Exactly one pair each.", "“Exactly. And then Pip eats one.”"],
        ["Just one pair. They can share.", "“Sharing ears. I suppose they do all hear the same story.”"] ] }
    ]},
    e_flea: { prize:'chair-victor', prizeSay:"A battered old chair that came home on your back.", st:[
      { who:'Sam', c:'sam', role:'Events producer', say:"Fourteen stalls and not one with a proper sign. Where do I start?", o:[
        ["A big sign at the entrance, with a hand-drawn map.", "“A map. Obvious. I'll draw it. Badly.”"],
        ["Ask everyone where everything is.", "“Efficient. Exhausting. Mostly exhausting.”"],
        ["Hang a sign that says ‘SIGN’.", "“…It's not wrong.”"] ] },
      { who:'Jules', c:'jules', role:'Illustration student', say:"I came for nothing and found a teapot, a clock and a spoon. I can only carry one.", o:[
        ["The teapot. You'll draw it forever.", "“It has a chip. It's perfect. I'll draw the chip.”"],
        ["The clock.", "“Too big. Too loud. It ticks in a different time zone.”"],
        ["The spoon.", "“A spoon is not a plan.”"] ] },
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"I brought a tin of lemon cookies, for research. Where do I put it?", o:[
        ["On the stall next to the teapots. Tea needs cookies.", "“TEA NEEDS COOKIES. You're hired.”"],
        ["Under the clock.", "“The clock's unsold. The cookies will be, too.”"],
        ["Sell them for one euro each.", "“One euro? Do you know what butter costs?”"] ] }
    ]},
    e_regatta: { prize:'wall-lamp-bianca', prizeSay:"A little ship's lamp from the harbour master's shed.", st:[
      { who:'Sam', c:'sam', role:'Events producer', say:"There's a prize for the most dramatic wobble. How do I win?", o:[
        ["Wobble slowly, then recover at the last second.", "“The recovery. That's the thing. Always the recovery.”"],
        ["Wobble the whole way.", "“Consistency, yes, but no arc.”"],
        ["Capsize on purpose.", "“Tragic. Memorable. Wet.”"] ] },
      { who:'Theo', c:'theo', role:'Baker', say:"Lovely boats, but they'd go faster with gears. Where would you put them?", o:[
        ["By the rudder, quietly.", "“Quietly. So no one can prove it.”"],
        ["On the mast, loudly.", "“Loudly. That's how they'd confiscate it.”"],
        ["Inside the loaf. Of bread.", "“…A gear loaf. I'm writing that down.”"] ] },
      { who:'Harbour Master Finn', c:null, role:'Harbour master', say:"I've been practising my ‘ahoy’ all week. Which one sounds best?", o:[
        ["A long, rolling “a-HOY”.", "He closes his eyes. “Yes. That's the sea in a word.”"],
        ["A short “ahoy”.", "“Efficient. Slightly rude. Fine.”"],
        ["“Hello”.", "“The boats don't understand ‘hello’. Not yet.”"] ] }
    ]},
    e_lantern: { prize:'paper-lamp', prizeSay:"A paper lantern, still warm from the candle.", st:[
      { who:'Theo', c:'theo', role:'Baker', say:"Hot chocolate for the whole lane, and Elena says I'm in charge of the mugs. How many?", o:[
        ["More than you think. The evening gets cold.", "“More than I think. That's most things in my life.”"],
        ["Twelve.", "“Twelve. Wren will use three. Wren will use none.”"],
        ["One, shared.", "“One mug. Shared. By forty people. Hmm.”"] ] },
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"Candlelight in the trees. I shall wear a shawl. Which?", o:[
        ["The green one.", "“The green one. Of course. The trees will think I'm family.”"],
        ["The black one.", "“Black in candlelight? I'd vanish. That's rather the point, but no.”"],
        ["A cardigan.", "“A CARDIGAN. At my age. I've never been so insulted.”"] ] },
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"I'm baking for the whole lane, possibly twice. What first?", o:[
        ["Something warm that travels: gingerbread.", "“Gingerbread. Warm. Tin. Done.”"],
        ["A big cake.", "“Big cakes don't travel well in the dark.”"],
        ["Ice cream.", "“It's a night for hot things. I'm very sorry.”"] ] }
    ]},
    e_harvest: { prize:'stacked-pots-white', prizeSay:"A stack of empty jam pots, scraped clean by the queue.", st:[
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"I'm entering the pumpkin loaf, quietly. Where do I put it on the table?", o:[
        ["At the end of the row, where people walk slowest.", "“Where they walk slowest. You're ruthless. I like it.”"],
        ["Right at the front.", "“Front. Loud. Visible. Terrifying.”"],
        ["Behind the jam, so no one sees.", "“Behind the jam is where the best things hide.”"] ] },
      { who:'Sam', c:'sam', role:'Events producer', say:"I'm not catering, I'm advising. Loudly. On what?", o:[
        ["The queue at the jam stall.", "“The queue. Yes. I've drawn it. It has a spiral.”"],
        ["The weather.", "“I can't control the weather. I've tried.”"],
        ["Everything.", "“Everything. Always. That's the job.”"] ] },
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"Yellow everywhere. What shall I buy?", o:[
        ["A yellow squash. It matches my shawl.", "“It matches! The squash and I are one.”"],
        ["A red apple.", "“Red is fine. Red is brave. Red will fight the shawl.”"],
        ["Something not yellow.", "“Not yellow? At a harvest market? I'm leaving.”"] ] }
    ]},
    e_soup: { prize:'pot-white', prizeSay:"A swapped soup pot, with the lid that fits.", st:[
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"Pumpkin and lemon soup. Don't ask. Do taste.", o:[
        ["Taste it, with bread.", "“With BREAD. It's a different soup with bread.”"],
        ["Pass politely.", "“Passing. I've been passed before. It's fine.”"],
        ["Add more lemon.", "“More lemon? You're my favourite.”"] ] },
      { who:'Noor', c:'noor', role:'Architect', say:"I need a pot with a lid that fits. How do I check?", o:[
        ["Close it and tilt it gently.", "“Tilt. Of course. Gravity is honest.”"],
        ["Look at it carefully.", "“Looking is not testing. I've looked at many lids.”"],
        ["Taste the lid.", "“…I won't ask why.”"] ] },
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"I brought a ladle and an opinion. Which do I give first?", o:[
        ["The ladle, then the opinion.", "“The ladle first. A soup needs a hand before it needs a view.”"],
        ["The opinion first.", "“Opinion first? I've done that. It rarely goes well.”"],
        ["Neither. Just stand there.", "“I do that well, too. But no.”"] ] }
    ]},
    e_lights: { prize:'standig-paper-lamp', prizeSay:"A tall paper light that glowed in a Church Hill window.", st:[
      { who:'Sam', c:'sam', role:'Events producer', say:"The steeple star! Somebody is holding the ladder. What do I check first?", o:[
        ["That the ladder's feet are steady.", "“The feet. Yes. I'll remember the feet.”"],
        ["That the star is straight.", "“Straight, yes. Not so useful if I fall.”"],
        ["That the neighbours are watching.", "“Always. That's the whole job.”"] ] },
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"Little cloaks for the lantern children. What colour will glow best in candlelight?", o:[
        ["Deep red.", "“Deep red. It will glow like a coal. Perfect.”"],
        ["White.", "“White in candlelight just looks cold. I'd know.”"],
        ["Black.", "“Black? They'd vanish. I'd lose half the children.”"] ] },
      { who:'Mia', c:'mia', role:'Vet receptionist', say:"I'm carrying soup and bread up the hill. How?", o:[
        ["Soup in the middle, bread in a basket on top.", "“The soup is the anchor. I needed that.”"],
        ["Bread on the bottom, soup on top.", "“Soup on bread? A soggy tragedy.”"],
        ["Carry the soup in my coat.", "“My coat is not a pot. It will be, soon.”"] ] }
    ]},
    e_wedding: { prize:'vase-amora-white', prizeSay:"A white vase left over from the church flowers.", st:[
      { who:'Rosa', c:'rosa', role:'Retired costume maker', say:"I'm making Mia's veil and I mustn't tell her. Where do I hide it?", o:[
        ["In a hatbox at the back of the church.", "“A hatbox. The one place a bride never looks.”"],
        ["In the wardrobe.", "“That's where she keeps her dress. She'd see it.”"],
        ["On a hat stand in the window.", "“In the WINDOW? Darling, the whole street would see.”"] ] },
      { who:'Sam', c:'sam', role:'Events producer', say:"I've been told to stand quietly on the day. Where?", o:[
        ["Beside the cake table, where you can see everything.", "“The cake table. See everything, say nothing. Perfect.”"],
        ["In the pews, like a guest.", "“Pews are for guests. I have never been a guest.”"],
        ["Under the pews.", "“…I'd fit, actually. But no.”"] ] },
      { who:'Noor', c:'noor', role:'Architect', say:"I've measured the pews. I have a view. What shall I do with it?", o:[
        ["Whisper it to the vicar after the wedding.", "“After. Of course. A view is a gift, not a surprise.”"],
        ["Announce it during the vows.", "“During the vows? I'd be asked to leave. Rightly.”"],
        ["Rebuild them overnight.", "“I've thought about it. I won't.”"] ] }
    ]}
  };
  // the job a neighbour has on a given day of the story, so a station reads "Jules, gallery
  // artist" in the third year and "Jules, illustration student" in the first
  Object.keys(EVENT_PLAY).forEach(function(eid){
    var ev = null;
    EVENTS.forEach(function(e){ if (e.id === eid) ev = e; });
    if (!ev) return;
    EVENT_PLAY[eid].st.forEach(function(st){ if (st.c) st.role = jobAtDay(st.c, ev.day); });
  });
  var EVENT_PRIZE = {};   // item id -> { event }
  Object.keys(EVENT_PLAY).forEach(function(eid){ EVENT_PRIZE[EVENT_PLAY[eid].prize] = { event:eid }; });
  function prizeOf(itemId){ return EVENT_PRIZE[itemId] || null; }
  function eventPlay(eid){ return EVENT_PLAY[eid] || null; }
  var EVENT_NEED = 2;   // right answers (out of three) that earn the keepsake

  var EVENT_BY_ID = {};
  EVENTS.forEach(function(e){
    EVENT_BY_ID[e.id] = e;
    if (e.after){ e.day = (QUEST_BY_ID_EARLY(e.after) || {}).day || 0; }
  });
  function QUEST_BY_ID_EARLY(id){ for (var i = 0; i < QUESTS.length; i++) if (QUESTS[i].id === id) return QUESTS[i]; return null; }
  // events that are due: their day has come (or their job is done) and they haven't been shown
  // Has this event come round yet? A "home" card (someone has moved) comes the moment the job's letter
  // arrives, before the player decorates; everything else follows the calendar or a finished job.
  function eventKnown(e, today, doneMap, openMap){
    if (!e.after) return e.day <= today;
    if (doneMap && doneMap[e.after]) return true;
    return e.kind === 'home' && !!(openMap && openMap[e.after]);
  }
  function eventsDue(today, doneMap, seen, openMap){
    var s = {}; (seen || []).forEach(function(id){ s[id] = true; });
    return EVENTS.filter(function(e){
      if (s[e.id]) return false;
      return eventKnown(e, today, doneMap, openMap);
    }).sort(function(a, b){ return a.day - b.day; });
  }
  // what's coming up in the next few weeks (for the calendar)
  function upcoming(today, doneMap, horizon){
    return EVENTS.filter(function(e){ return !e.after && e.tease && e.day > today && e.day <= today + (horizon || 45); })
      .sort(function(a, b){ return a.day - b.day; });
  }
  // what already happened, for the calendar's month view
  function pastEvents(today, doneMap, openMap){
    return EVENTS.filter(function(e){ return eventKnown(e, today, doneMap, openMap); });
  }

  /* ------------------------------------------------------------- newspaper */
  // "The Cove Courier": an issue appears once the story reaches its day.
  var NEWS = [
    // ---------------------------------------------------------------- Year one
    { day:D(0), lead:{ h:"Pennywhistle Cove Wakes Up Slowly", t:"The first ferry leaves at seven, the clock tower runs four minutes fast, and nobody minds. New neighbours are arriving all week, say the removal vans." },
      items:[ {h:"Pigeon census", t:"Up by twelve. The council blames the ferry café."}, {h:"Canal Row", t:"A new tenant has been seen carrying a houseplant, a bread knife and a key she keeps looking at."} ],
      notice:"WANTED: someone who is good with rooms. Apply anywhere in the Cove." },
    { day:D(1), lead:{ h:"A Florist for Canal Row", t:"Fennel & Fern has put up its striped awning with a hundred buckets of dahlias and one cat. Early customers described the queue as ‘polite but hungry for tulips’.", spot:'flowers' },
      items:[ {h:"Up at the Mills", t:"Someone has moved into the attic with eleven boxes of paint and no curtains. Passers-by report an easel in the window."}, {h:"Ferry", t:"Late again, with feeling."} ],
      notice:"LOST: one cat, answers to ‘Parsley’. Does not answer." },
    { day:D(2), lead:{ h:"Teapots, Bells and One Large Clock", t:"By ten o'clock on Saturday there wasn't a teapot left on Orchard Green. One shopper went home with a grandfather clock and no plan.", spot:'fleamarket' },
      items:[ {h:"Dinner parties", t:"A flat on Glass Row is said to have a ‘kitchen with ambitions’. The guests are optimistic."}, {h:"Pigeons", t:"Still up. Nobody is surprised."} ],
      notice:"OPEN MIC Thursday at the harbour café. Bring a song, or a snack." },
    { day:D(3), lead:{ h:"Back to Work, Gently", t:"September brings the school bell, the harbour wind and a small queue of people looking for a second sofa. The ferry café has put out its autumn menu: soup, soup and a daring soup." },
      items:[ {h:"Glass Row", t:"A calm new tenant has moved in. Neighbours describe the flat as ‘very tidy’ and the tenant as ‘audibly measuring’."}, {h:"Cat watch", t:"Parsley was seen in the bakery window. The bakery is not open yet. We suspect inside information."} ],
      notice:"EXTRA FERRY on Saturdays. It will be late, as always." },
    { day:D(4), lead:{ h:"Fresh Bread on the Corner", t:"Crumb & Crown has lit its ovens by the clock tower. It opens at seven and sells out by eleven. The old baker is teaching his young apprentice everything, and the shop cat supervises both.", spot:'bakery' },
      items:[ {h:"Lantern Lane", t:"A young couple has taken a cabin up the lane. Smoke from the chimney, sunflowers in the window, a very large crib in the hall."}, {h:"First leaf", t:"A red one landed on the clock tower on Tuesday. The Courier asks the others to follow in an orderly fashion."} ],
      notice:"WANTED: a second oven, gently used. Ask at the harbour café." },
    { day:D(5), lead:{ h:"Jam Stall Queue Reaches Clock Tower", t:"The Harvest Market filled Old Town with pumpkins, chutneys and cinnamon. The jam stall queue set a new record, and a very sticky one.", spot:'harvest' },
      items:[ {h:"Sewing classes", t:"A retired costume maker has begun teaching at the village hall. Six people and a dachshund have signed up."}, {h:"First frost", t:"The canal has a thin glass lid. The ducks are unbothered."} ],
      notice:"LOST: one mitten, red. Possibly on the clock tower." },
    { day:D(6), lead:{ h:"Every Window Gets a Candle", t:"Church Hill turned its lights on at dusk on Friday, and the steeple got a star. Soup was provided by anyone with a pot.", spot:'lights' },
      items:[ {h:"Mulled things", t:"The harbour café now serves hot apple, hot cider and, on request, hot hot chocolate."}, {h:"Skates", t:"The canal is not yet frozen. The ducks have asked everyone to stop asking."} ],
      notice:"THANK YOU to whoever left soup on the clock tower steps." },
    { day:D(7), lead:{ h:"Marigold & Moss Opens on Church Hill", t:"The pink porch house has opened its doors to antiques. Every item is ‘one of a kind’ and most are extremely heavy. Browsers are advised to bring a friend.", spot:'antiques' },
      items:[ {h:"Resolutions", t:"The bakery reports a 300% rise in ‘just one more’."}, {h:"A first cheque", t:"An illustrator at the Mills has been paid for a book jacket. She has asked that nobody mentions the colour pink. Everybody has."} ],
      notice:"NEW YEAR'S SWIM cancelled due to common sense." },
    { day:D(8), lead:{ h:"Snow Day", t:"School is closed, the bakery is open, and the ducks are furious. Chimneys all over town are smoking happily, the cabins on Lantern Lane most of all." },
      items:[ {h:"Sledges", t:"The hill behind the church is officially ‘fast’. Crumb & Crown sold hot buns from the top of it."}, {h:"Glass Row", t:"A flat now seats ten. The neighbours are ‘delighted, mostly’."} ],
      notice:"FOUND: one sledge. Not yours. Very good sledge." },
    { day:D(9), lead:{ h:"Wren Has Arrived", t:"Born on a very rainy morning, a little early and entirely loud. Mother, father and the shop cat are doing well. The cabin on Lantern Lane has been asked to keep the lamp on." },
      items:[ {h:"Thaw", t:"The first crocus appeared on Orchard Rise to cheers from a cat. The canal has un-frozen and the ducks have forgiven everyone."}, {h:"Ferry", t:"Back on schedule. Almost."} ],
      notice:"CASSEROLES for the Lantern Lane cabin: please leave them at the door, not the baby." },
    { day:D(10), lead:{ h:"Tulips for Everyone", t:"A bucket outside Fennel & Fern, free for anyone who wanted one. Parsley judged every pick. Six people left with tulips and a smaller ego.", spot:'tulips' },
      items:[ {h:"A new smell on Canal Row", t:"Someone is growing basil on a windowsill, for the second year running. It has become a landmark."}, {h:"Ferry", t:"Cancelled for rain, resumed for pride."} ],
      notice:"SEEDLINGS wanted. And gardening gloves, medium." },
    { day:D(11), lead:{ h:"A Bookshop on the Rise", t:"The Dog-Eared Bookshop has opened on Orchard Rise with a ladder on rails and a dog on the doormat. The dog has been asked to sign copies.", spot:'books' },
      items:[ {h:"Village hall", t:"The sewing class has a waiting list. The tea is the main reason."}, {h:"Marmalade", t:"The harbour café has run out. Both of them."} ],
      notice:"WANTED: someone to pick up the village hall chairs. Bring a trolley." },

    // --------------------------------------------------------------- Year two
    { day:D(12), lead:{ h:"Caps Thrown on the Mills Green", t:"The art school's graduates threw their hats, and one of them did not land. A young illustrator took her certificate and a very large portfolio and went home to put the kettle on." },
      items:[ {h:"A new hobby on Canal Row", t:"A vet receptionist has turned her spare room into a nursery for seedlings. The shop cat approves."}, {h:"Midsummer", t:"The Courier reminds everybody that the evenings are long and the ferry is not."} ],
      notice:"LOST: one graduation cap. Last seen near the canal." },
    { day:D(13), lead:{ h:"A Prize for the Most Dramatic Wobble", t:"The Summer Regatta filled the harbour with bunting and bad steering. The winner stayed upright. The runner-up did not, and was cheered more loudly.", spot:'regatta' },
      items:[ {h:"Freelance", t:"An illustrator at the Mills now has ‘actual clients’ and says she intends to continue."}, {h:"Heatwave", t:"The canal ducks are reported to be ‘sulking’."} ],
      notice:"LOST: one sailor's hat. Answers to nothing." },
    { day:D(14), lead:{ h:"Art Across the Water", t:"The Paper Moth Gallery has opened on the Far Shore, in the red-brick house with the green door. Prints are small, frames are big, and the owner is shy.", spot:'gallery' },
      items:[ {h:"Opening night", t:"A free glass of something fizzy and a very polite queue. One visitor asked if the walls were for sale."}, {h:"Ferry", t:"Now stops at the Far Shore. On request. Mostly."} ],
      notice:"WANTED: wall space, any size. Ask at the gallery." },
    { day:D(15), lead:{ h:"Back to School, Back to Scales", t:"The Cove's autumn calendar begins with a new piano in the glass tower on Glass Row. Passers-by report one note repeated, then silence, then the same note again. They approve." },
      items:[ {h:"Ferry café", t:"Autumn menu launched: soup, soup and a bold new soup."}, {h:"Conkers", t:"The council has asked for them back."} ],
      notice:"PIANO LESSONS: ask discreetly. No names." },
    { day:D(16), lead:{ h:"The Smallest Apple Wins Again", t:"The Apple Day competition was won, as usual, by a very small apple and a very large opinion. Every garden on the Rise brought its one stubborn tree.", spot:'appleday' },
      items:[ {h:"Crumb & Crown", t:"The old baker has offered his apprentice a share in the shop. The apprentice is reported to have been briefly unwell in a bush."}, {h:"Nights", t:"Drawing in. The bakery lights go on at five."} ],
      notice:"APPLES wanted for chutney. Bring a bag." },
    { day:D(17), lead:{ h:"Twelve in the Sewing Class", t:"The village hall sewing class now has twelve pupils, a waiting list and a very good kettle. The teacher says this is ‘the correct number’." },
      items:[ {h:"Frost", t:"The first, early and bright. The ducks have been told."}, {h:"Bake sale", t:"The church roof is two buns away from a new tile."} ],
      notice:"LOST: one thimble, silver. The teacher is not angry. She is merely very quiet." },
    { day:D(18), lead:{ h:"Forty Ladles on Church Hill", t:"The Soup Swap went ahead in a light drizzle: forty ladles, six leeks and one very opinionated dachshund. Nobody went home with their own pot.", spot:'soupswap' },
      items:[ {h:"Canal Row", t:"A garden-loving receptionist now shares her flat with someone who owns a bicycle. The hall has been informed."}, {h:"First snow", t:"Brief. Sincere."} ],
      notice:"THANK YOU to whoever left a pot on the clock tower steps." },
    { day:D(19), lead:{ h:"The Paper Moth Hangs Six", t:"Six small prints by a Mills illustrator went up on the gallery wall on Monday. By Friday there were six red dots. The artist is said to have sat down on the pavement." },
      items:[ {h:"January", t:"Fewer lights. More tea. The Courier recommends both."}, {h:"Ferry", t:"Operating normally, which is to say, with feeling."} ],
      notice:"WANTED: a frame shop. Prints are outgrowing the wall." },
    { day:D(20), lead:{ h:"Dinner for Twelve, No Chairs Left", t:"A promoted events producer in the glass tower hosted dinner for twelve and borrowed chairs from six neighbours. The chairs have since been returned. Mostly." },
      items:[ {h:"Glass Row", t:"A teacher has moved in, which the building describes as ‘an improvement in the noise levels’."}, {h:"Valentine's", t:"The bakery sold out of heart-shaped cookies by half past seven. Early."} ],
      notice:"WANTED: a very large pot. Ask at Glass Row." },
    { day:D(21), lead:{ h:"A Partner at the Firm", t:"A familiar architect on Glass Row made partner and bought the top floor of her own building. ‘I intend to stay,’ she is reported to have said, and then measured the stairs." },
      items:[ {h:"Thaw", t:"The first crocus. The cat on Orchard Rise was unimpressed."}, {h:"Crumb & Crown", t:"New sourdough on Saturdays. Queue before seven."} ],
      notice:"EGG HUNT April, Orchard Green. Under-sevens first." },
    { day:D(22), lead:{ h:"Chocolate Eggs in the Hedges", t:"The Egg Hunt filled Orchard Green with hedges, hunters and one very suspicious dachshund. Under-sevens went first. Everybody else went second, with dignity.", spot:'eggs' },
      items:[ {h:"Old baker retires", t:"The old baker has left Crumb & Crown. He gave the keys to his apprentice and the cat to nobody in particular."}, {h:"A new sign", t:"A tiny shop in Old Town has painted ‘coming soon’ on its window. Nobody knows what for."} ],
      notice:"THANK YOU to the baker who gave us forty years of bread." },
    { day:D(23), lead:{ h:"A Cabin on Lantern Lane", t:"A retired costume maker has bought a cabin on Lantern Lane and kept her flat in town. ‘I am not a monster, darling,’ she told the Courier." },
      items:[ {h:"May", t:"Window boxes everywhere. The town smells of lilac and toast."}, {h:"Tulips", t:"Still going. Fennel & Fern is out of buckets."} ],
      notice:"WANTED: ducks to live elsewhere. Just for a weekend." },

    // ------------------------------------------------------------- Year three
    { day:D(24), lead:{ h:"A Garden with a Crooked Apple Tree", t:"A Canal Row receptionist and her partner have moved up to Church Hill: a flat with a gate, an apple tree and what she calls ‘room to grow things’. The neighbours are watching the hedge." },
      items:[ {h:"Midsummer", t:"Long light, late ferries and a very good smell from the bakery."}, {h:"Seedlings", t:"On offer at the gate, free to anyone who can carry them."} ],
      notice:"WANTED: spades. And the confidence to dig." },
    { day:D(25), lead:{ h:"Friends Pay Less", t:"A trestle table has appeared by the garden gate on Church Hill, with buckets of whatever bloomed this morning. The sign reads: ‘Friends pay less.’ The money jar remains largely unused.", spot:'miagarden' },
      items:[ {h:"Gallery", t:"The Paper Moth's six prints have been joined by twelve. A queue forms outside on Saturdays."}, {h:"Regatta rehearsals", t:"The harbour master has been practising his ‘ahoy’ at the geese."} ],
      notice:"BUCKETS needed. Return Sunday, with flowers." },
    { day:D(26), lead:{ h:"Summer's End on the Beach", t:"The last warm evening ended with a fire on the sand below Church Hill: marshmallows, a guitar and somebody's grandad telling the same story. It improved.", spot:'bonfire' },
      items:[ {h:"Glass Row", t:"An events producer has resigned from a very large firm in a very small speech. A sign has gone up on a door nearby."}, {h:"Evenings", t:"Cooler. Jumpers recommended."} ],
      notice:"LOST: one sausage, last seen on a stick." },
    { day:D(27), lead:{ h:"Doors Open at the Mills", t:"Half the Mills opened their doors, and the stairwells hummed with paint and kettles. Visitors were told the cake was baked by someone else. It was.", spot:'openstudio' },
      items:[ {h:"Piano, two quiet rooms", t:"Glass Row is reported to have a second silent room. Passers-by suspect something is being practised."}, {h:"Harvest", t:"Pumpkins everywhere. The bakery has begun to use them in everything."} ],
      notice:"THANK YOU to the neighbours who stayed to wash up." },
    { day:D(28), lead:{ h:"Rooms for Everyone", t:"A baker on Orchard Rise has found a flat with a proper dining room. ‘Grandad only trusts wood he can knock on,’ he told the Courier. The table has been chosen accordingly." },
      items:[ {h:"First frost", t:"Early. The ducks have moved to the side with the sun."}, {h:"Crumb & Crown", t:"Opens at seven. Sells out by half past ten. The queue is a landmark."} ],
      notice:"WANTED: a very sturdy table. Knock before you buy." },
    { day:D(29), lead:{ h:"Falling Leaves, Rising Costumes", t:"Everyone in the Cove wants a costume for the lantern children, the school play and the regatta. A retired costume maker has taken on a small shop front in Old Town and will name it soon." },
      items:[ {h:"Soup season", t:"Church Hill is already practising for the Soup Swap. Nobody is admitting it."}, {h:"Canal", t:"The ducks have a new bridge. They are suspicious."} ],
      notice:"LOST: one measuring tape, soft. Expect a stern letter." },
    { day:D(30), lead:{ h:"Lantern Night on Lantern Lane", t:"Paper lanterns along the lane at dusk, little candle boats on the bay, and hot chocolate by the cabins. A neighbour said she ‘didn't plan any of this’. Everybody knew she had.", spot:'lantern' },
      items:[ {h:"A question on the allotment", t:"A flower grower from Church Hill was asked something between the dahlias and the compost heap. She said yes before it was finished."}, {h:"Winter", t:"Arrived. Politely."} ],
      notice:"CONGRATULATIONS to two people, privately. We know. We're not telling." },
    { day:D(31), lead:{ h:"The Top Floor at the Mills", t:"The landlord offered the top floor of the mill to the illustrator who once rented the attic. ‘I said yes before he finished the sentence,’ she told the Courier. The gallery has a waiting list." },
      items:[ {h:"New Year", t:"The bakery reports a 300% rise in ‘just one more’. Again."}, {h:"Ferry", t:"On time on Tuesday. Everyone is still shaken."} ],
      notice:"WANTED: paint, in every colour. Ask at the Mills." },
    { day:D(32), lead:{ h:"A Key for Two in Old Town", t:"An events founder and a Year 3 teacher have bought a flat above the old market with a kitchen ‘the size of my entire first flat’. The oven, we are told, is on its way." },
      items:[ {h:"February", t:"Snow, then more snow. The ducks have issued a statement."}, {h:"Valentine's", t:"The bakery sold out of heart cookies by seven. A new record."} ],
      notice:"BREAD: reserve early. The queue starts at six." },
    { day:D(33), lead:{ h:"Wedding Invitation Goes Round Town", t:"Mia and Alex will marry at the white church on Saturday 22 April, and the whole street is invited. The bakery has been warned about the cake. A veil is rumoured to be in the making.", spot:'wedding' },
      items:[ {h:"Noor Architects", t:"A well-known partner has left a well-known firm, politely, with three copies of the letter. Her new office has a desk. She says it is the only one."}, {h:"March", t:"Crocuses, mud and one very optimistic sun hat."} ],
      notice:"CONFETTI: biodegradable, please." },
    { day:D(34), lead:{ h:"Wedding Bells (and One Dropped Cake)", t:"The church was full, the sun came out for the vows, and the three-tier lemon cake survived all but one corner. The veil, sewn by costume-maker Rosa, got more applause than the cake. The couple left in a rowing boat hung with tin cans." },
      items:[ {h:"Dancing", t:"Went on until the ducks complained."}, {h:"A big-girl room", t:"A baker's daughter, just two, has asked for a bed of her own. She was heard to say ‘mine’ very clearly."} ],
      notice:"THANK YOU to everyone who stayed to wash up." },
    { day:D(35), lead:{ h:"Three Years in the Cove", t:"Three years ago the removal vans started arriving. Today a costume cupboard has opened in Old Town, a baker has a bakery, a florist has a gate and an illustrator has a top floor. The clock tower is still four minutes fast." },
      items:[ {h:"The Costume Cupboard", t:"Rosa's workroom is open on Fridays. Queues of children, a very patient dachshund."}, {h:"Midsummer", t:"The bonfire is back on the calendar. Please bring your own marshmallows."} ],
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
    var avoidOk = !hasStuff || reqs.filter(function(r){ return r.tier === 'avoid'; }).every(function(r){ return r.met; });

    return { reqs:reqs, quirks:quirks, brief:brief, mustAll:mustAll, quirksOk:quirksOk, avoidOk:avoidOk };
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

  // The brief counts for most. A neighbour who asked for something and did not get it cannot
  // be delighted: missing must-haves cap the room at two hearts, a broken "please not" at
  // three, and five hearts also needs the unspoken things understood.
  function heartsFor(briefScore, qualityScore, mustAll, anyPieces, quirksOk, avoidOk){
    if (!anyPieces) return 1;
    var final = 0.65 * briefScore + 0.35 * qualityScore;
    var h = final < 25 ? 1 : (final < 45 ? 2 : (final < 65 ? 3 : (final < 88 ? 4 : 5)));
    if (mustAll && h < 3) h = 3;                      // if you listened to every must-have, you get at least 3
    if (!mustAll && h > 2) h = 2;                     // the thing they asked for is missing
    if (avoidOk === false && h > 3) h = 3;            // you did the one thing they asked you not to
    if (quirksOk === false && h > 4) h = 4;           // five hearts means they felt truly understood
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
    QUIRKS: QUIRKS, giftsEarned: giftsEarned, giftOwner: giftOwner, SHOP_STOCK: SHOP_STOCK, shopOf: shopOf, SHOP_TIERS: SHOP_TIERS, shopTier: shopTier, SHOP_SAY: SHOP_SAY, EVENT_PLAY: EVENT_PLAY, eventPlay: eventPlay, prizeOf: prizeOf, EVENT_NEED: EVENT_NEED, REWARDS: REWARDS, VOICES: VOICES,
    starsFor: starsFor, isKind: isKind,
    evaluate: evaluate, quality: quality, qualityDetail: qualityDetail, analyze: analyze, districtAt: districtAt, dateOf: dateOf, monthOf: monthOf, seasonOf: seasonOf, todayOf: todayOf, ageOf: ageOf, jobOf: jobOf, jobAtDay: jobAtDay, blurbOf: blurbOf, D: D, SPOTS: SPOTS, spotById: function(id){ return SPOT_BY_ID[id] || null; }, spotsAt: spotsAt, EVENTS: EVENTS, eventById: function(id){ return EVENT_BY_ID[id] || null; }, eventsDue: eventsDue, eventKnown: eventKnown, upcoming: upcoming, pastEvents: pastEvents, NEWS: NEWS, issuesAt: issuesAt, heartsFor: heartsFor, buildReply: buildReply
  };
})();
