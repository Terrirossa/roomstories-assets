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
var Story = (function(){

  /* ------------------------------------------------------------------ town */
  var TOWN = {
    name: 'Pennywhistle Cove',
    map: 'story/town_map.jpg',
    aspect: [2400, 1350],
    // Seasonal versions of the map. Put a file name here (for example 'story/town_map_autumn.jpg')
    // and the town switches to it whenever the story calendar reaches that season.
    // A season left as null just uses the main map with a gentle colour wash.
    seasonMaps: { spring:null, summer:null, autumn:null, winter:null },
    // the story calendar: day 0 is this date (month is 0-based: 5 = June)
    calendar: { year:2025, month:5, day:2 },
    // ambient life on the map (positions are in % of the map image; the sparkle
    // points were checked against the painting so nothing glitters on land)
    fx: {"glints":[[0.0,0.0],[21.1,0.0],[25.0,0.0],[28.9,0.0],[32.9,0.0],[36.8,0.0],[41.7,0.0],[46.0,0.0],[50.2,0.0],[39.0,3.0],[43.7,3.2],[26.9,3.3],[35.0,3.3],[19.3,3.3],[30.8,3.4],[23.2,3.6],[48.2,4.1],[15.2,4.1],[91.7,5.1],[52.1,5.3],[11.5,5.3],[87.5,5.4],[97.5,5.5],[59.0,6.0],[83.8,6.3],[37.2,6.4],[79.5,6.3],[33.2,6.6],[41.5,6.6],[21.1,6.7],[45.3,6.7],[29.0,6.8],[25.2,6.8],[64.0,7.0],[55.3,7.3],[16.8,7.6],[94.4,7.9],[67.6,8.0],[76.0,7.9],[99.9,8.4],[49.8,8.4],[89.6,8.6],[13.0,8.7],[8.8,9.4],[81.7,9.5],[85.6,9.6],[61.0,9.6],[39.2,9.6],[0.3,9.3],[72.4,9.6],[43.4,10.0],[31.4,9.9],[26.8,10.2],[22.7,10.1],[35.2,10.3],[52.9,10.5],[97.0,10.9],[64.8,10.8],[19.0,11.0],[47.0,11.0],[78.0,11.2],[92.5,11.2],[68.9,11.6],[15.2,12.0],[57.8,11.8],[88.4,12.3],[11.5,12.4],[83.2,13.0],[74.5,12.9],[41.2,13.0]],
      "boats":[
      // x/y = where the boat floats (in % of the map), w = its width (1 = 1% of the picture),
      // rx/ry = how far it drifts, dur = seconds for one slow loop, flip = face the other way
      {img:"story/boats/boat2.png", x:30.4, y:4.6,  w:1.8, rx:.7, ry:.28, dur:52, delay:0,  flip:false},
      {img:"story/boats/boat1.png", x:38.0, y:4.4,  w:2.1, rx:.6, ry:.25, dur:61, delay:-14, flip:true},
      {img:"story/boats/boat6.png", x:41.0, y:5.4,  w:2.0, rx:1.1,ry:.35, dur:74, delay:-30, flip:false},
      {img:"story/boats/boat5.png", x:10.3, y:13.3, w:1.5, rx:.5, ry:.22, dur:47, delay:-9,  flip:false},
      {img:"story/boats/boat4.png", x:23.7, y:1.9,  w:1.5, rx:.6, ry:.2,  dur:56, delay:-22, flip:true},
      {img:"story/boats/boat3.png", x:78.8, y:55.2, w:1.9, rx:.35,ry:.3,  dur:44, delay:-5,  flip:false}
    ],
      "leaves":{"area":[1,30,33,72],"count":14},"smoke":[]},
    // named neighbourhoods (polygons in % of the map image). The first one that
    // contains a point wins, so the small ones come first.
    districts: [
      {id:"lake",name:"Lantern Lake",blurb:"Log cabins on the point. Smoke from at least one chimney, always.",poly:[[47,0],[100,0],[100,8],[86,8.5],[72,10],[60,9.5],[50,6]],label:[75,2.2]},
      {id:"eastbank",name:"Far Shore",blurb:"Quiet brick houses across the water. Reached by a very patient ferry.",poly:[[91,30],[100,28],[100,56],[94,52],[91,44]],label:[96,36]},
      {id:"orchard",name:"Orchard Rise",blurb:"Tidy lanes, neat gardens and a surprising number of cats.",poly:[[14,17],[24,15],[40,14],[52,15],[53,22],[52,29],[44,30],[34,31],[24,31],[16,28]],label:[33,22.5]},
      {id:"glass",name:"Glass Row",blurb:"The new towers. Lifts, balconies, and a view of the other towers.",poly:[[63,24],[72,20],[84,21],[91,26],[91,40],[84,50],[75,52],[67,47],[63,38]],label:[77,31]},
      {id:"canal",name:"Canal Row",blurb:"Narrow brick houses with their feet in the water.",poly:[[52,47],[60,43],[66,49],[72,55],[73,68],[70,79],[62,81],[54,77],[52,64]],label:[61,72]},
      {id:"oldtown",name:"Old Town",blurb:"Red brick, a clock tower that runs a little fast, and the best pavement for gossip.",poly:[[37,26],[47,24],[58,25],[63,28],[63,42],[58,44],[52,47],[52,70],[44,72],[38,64],[36,48],[37,34]],label:[45,44]},
      {id:"church",name:"Church Hill",blurb:"White clapboard, a very tall steeple, and neighbours who bring casseroles.",poly:[[0,33],[12,28],[26,31],[34,34],[37,40],[36,60],[40,70],[32,79],[16,83],[0,81]],label:[17,60]},
      {id:"mills",name:"The Old Mills",blurb:"Warehouses turned into lofts: high ceilings, big windows, echoing stairwells.",poly:[[73,54],[91,50],[100,57],[100,100],[74,100],[72,86],[75,72]],label:[90,78]},
      {id:"harbour",name:"The Harbour",blurb:"Boats come and go. Mostly come.",poly:[[0,86],[20,88],[40,84],[56,83],[72,86],[74,100],[0,100]],label:[36,94]},
      {id:"bay",name:"Kingfisher Bay",blurb:"Wide, bright, and full of sails on a Sunday.",poly:[[0,0],[47,0],[50,6],[60,9.5],[60,14],[40,14],[20,16],[0,17]],label:[28,8]}
    ],
    prologue: [
      "Pennywhistle Cove is the kind of town where everybody knows whose bicycle is whose.",
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
    theo:  { id:'theo',  name:'Theo',  age:29, job:'Bicycle mechanic',        color:'#d9a441',
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
    MIA_HOME_A:    { owner:'mia',   name:"Mia's first flat",       family:'sunlit-living-room-twin-windows', district:'canal', map:{x:59.5,y:63},
                     rooms:[ {key:'living',  label:'Living room', arch:'both-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'both-bothdoors'},
                             {key:'spare',   label:'Little spare room', arch:'both-leftdoor'} ] },
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
    SAM_HOME_A:    { owner:'sam',   name:"Sam's city apartment",   family:'sunlit-living-room-twin-windows', district:'glass', map:{x:75,y:38},
                     rooms:[ {key:'kitchen', label:'Kitchen',     arch:'big-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'big-bothdoors'},
                             {key:'living',  label:'Living room', arch:'big-leftdoor'} ] },
    SAM_HOME_B:    { owner:'sam',   name:"Sam & Robin's home",     family:'historic', district:'oldtown', map:{x:44,y:35},
                     rooms:[ {key:'kitchen', label:'Kitchen',     arch:'twowindows-rightdoor'},
                             {key:'living',  label:'Living room', arch:'roundwindow-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'baywindowright-leftdoor'} ] },
    NOOR_HOME_A:   { owner:'noor',  name:"Noor's rental",          family:'sunlit-living-room-twin-windows', district:'glass', map:{x:69,y:31},
                     rooms:[ {key:'bedroom', label:'Bedroom',     arch:'right-rightdoor'},
                             {key:'living',  label:'Living room', arch:'right-bothdoors'},
                             {key:'kitchen', label:'Kitchen',     arch:'right-leftdoor'} ] },
    NOOR_HOME_B:   { owner:'noor',  name:"Noor's top-floor flat", family:'loft', district:'glass', map:{x:72.5,y:34},
                     rooms:[ {key:'living',  label:'Living room', arch:'twowindows-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'onewindow-bothdoors'},
                             {key:'study',   label:'Quiet room',  arch:'onewindow-leftdoor'} ] },
    THEO_HOME_A:   { owner:'theo',  name:"Theo & Elena's cabin",   family:'cozy-cabin', district:'lake', map:{x:73.4,y:7.4},
                     rooms:[ {key:'living',  label:'Living room', arch:'bigwindow-rightdoor'},
                             {key:'bedroom', label:'Bedroom',     arch:'smallwindow-leftdoor'} ] },
    THEO_HOME_B:   { owner:'theo',  name:"Theo's family flat",     family:'sunlit-living-room-twin-windows', district:'orchard', map:{x:35,y:22},
                     rooms:[ {key:'living',  label:'Living room', arch:'left-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'left-bothdoors'},
                             {key:'bedroom', label:'Bedroom',     arch:'left-leftdoor'} ] },
    ROSA_HOME_A:   { owner:'rosa',  name:"Rosa's old apartment",   family:'historic', district:'oldtown', map:{x:46.5,y:63},
                     rooms:[ {key:'sitting', label:'Sitting room',arch:'twowindows-rightdoor'},
                             {key:'dining',  label:'Dining room', arch:'roundwindow-bothdoors'},
                             {key:'guest',   label:'Guest bedroom',arch:'baywindowright-leftdoor'} ] },
    ROSA_CABIN_A:  { owner:'rosa',  name:"Rosa's lakeside cabin",   family:'cozy-cabin', district:'lake', map:{x:70.2,y:7.6},
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
    message:"I've never had a room where I get to choose everything! Green and cream, light wood, somewhere comfy to sit. And flowers, please. There's a florist about to open on my street and I'm already emotionally invested.",
    brief:[
      R('must','role','A proper living room: a couch or armchair, a table and a lamp',{role:'living',room:'living'},
        ["It's a real living room — I can actually sit down in it!","I'm still sitting on a moving box, but I'm sure it's character-building."]),
      R('must','flowers','At least one bunch of flowers',{kinds:['flowers'],min:1},
        ["You remembered the flowers!","The flower-shop lady is going to ask where my flowers went."]),
      R('like','palette','Mostly green, cream and light wood',{colors:['Green','Beige','White','Yellow','Light Wood'],minShare:0.5},
        ["It's so soft and green in here. It's like a hug.","I love it, I just… wanted a bit more green and cream?"]),
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
      R('like','pink','Soft pink and cream in the bedroom',{colors:['Rosa','Pink','Blush','Beige','White'],minShare:0.5,room:'bedroom'},["The bedroom is the softest thing I've ever seen."]),
      R('like','green','Plenty of green in the little room',{colors:['Green'],min:2,room:'spare'},["The little room feels like a garden."]),
      R('avoid','nodark','Nothing dark or black',{colors:['Black','Dark Wood'],max:0},[null,"A couple of the pieces are a bit dark for my taste."])
    ],
    reply:{ low:"The rooms feel less empty, and that's a lot already.", mid:"Now the whole flat feels like me. Thank you.", high:"I invited my mum round. I didn't apologise for anything. That's new." }
  },
  { id:'MIA_03', char:'mia', title:'Our First Place', property:'MIA_HOME_B', change:'move', edit:['living','dining','bedroom'],
    requires:['MIA_02'], minRenown:15, day:178, allowance:92,
    story:"Mia and Alex are moving in together. Alex likes navy and simple shapes. Mia wants her softer, greener self to come along.",
    message:"Alex wants navy, I still want green, and we both want it to feel like home. Could you bring a bit of my old living room with us? And leave room for flowers on the dining table. (Alex says hi. Alex is very organised.)",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room is ours already."]),
      R('must','dining','A dining table with seats',{role:'dining',room:'dining'},["We can have people over. A frightening thought!"]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["We both want to go to bed right now, which is the best review."]),
      R('must','flowers','Flowers in the living and dining rooms',{kinds:['flowers'],min:1,rooms:['living','dining'],each:true},["Flowers on the table! Alex actually gasped."]),
      R('like','palette','Green, blue and cream together, with light wood',{colors:['Green','Blue','Beige','White','Light Wood'],minShare:0.6},["It's Alex AND me. I didn't think it would work!"]),
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
      R('like','blue','Cobalt blue: a few blue pieces',{colors:['Blue'],min:3},["So much blue. Yes."]),
      R('like','orange','Some orange pop',{colors:['Orange','Red','Yellow'],min:2},["That orange makes me want to paint something silly."]),
      R('like','mix','At least four different colours (nothing like a matching set)',{minDistinct:4},["Nothing matches and I love it."]),
      R('avoid','nobeige','Not predominantly beige or white',{colors:['Beige','White'],maxShare:0.4},[null,"It's gone a bit beige in here. I feel it in my bones."])
    ],
    reply:{ low:"It's a roof and an easel. I can work with that.", mid:"I can walk in and want to make something. That's all I wanted.", high:"I put the easel down and painted until 3am. The room made me do it." }
  },
  { id:'JULES_02', char:'jules', title:'My First Paid Commission', property:'JULES_HOME_A', change:'refresh', edit:['studio'],
    requires:['JULES_01','SAM_01'], day:58, allowance:30,
    story:"Someone has actually paid Jules for an illustration! The studio gets a refresh — the room you made stays as it is, with a few new things.",
    message:"Someone has actually PAID me. I'd like to spend a little on this place. Keep the easel and the blue, but could we try something lilac with it? It still needs to feel like my room.",
    brief:[
      R('must','easel','Keep the easel',{kinds:['easel'],min:1},["The easel is still the boss of the room."]),
      R('must','new','Bring in at least 3 new pieces',{newMin:3},["A few new bits and it feels like I grew up a little."]),
      R('like','blue','Keep the blue',{colors:['Blue'],min:3},["Blue stays. Good."]),
      R('like','lilac','Something lilac or pink (the Carla couch comes in lilac!)',{colors:['Pink','Rosa','Blush'],min:2},["LILAC. You found lilac!"]),
      R('avoid','nobeige','Not beige-dominated',{colors:['Beige','White'],maxShare:0.35},[null,"There's a lot of beige creeping back in."])
    ],
    reply:{ low:"A tiny bit fancier. A tiny bit more me.", mid:"It's like my room grew up and kept its personality.", high:"I'm going to tell the client it's from my 'inspiration space'. It's from you." }
  },
  { id:'JULES_03', char:'jules', title:'A Door with My Name on It', property:'JULES_HOME_B', change:'upstairs', edit:['living','bedroom','art'],
    requires:['JULES_02'], minRenown:15, day:214, allowance:94,
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
    message:"The bedroom can wait. I want a kitchen I'm excited to cook in. Dark wood, burgundy, plenty of metal. Spare no mixers! (The oven is on back-order. It's been on back-order for six weeks. We don't talk about it.)",
    brief:[
      R('must','kitchen','A working kitchen: a counter or island, and a fridge',{role:'kitchen',room:'kitchen'},["It looks like a kitchen where things happen."]),
      R('must','gadgets','At least 3 cooking gadgets: mixers, coffee machines, kettles',{kinds:['gadget'],min:3},["Gadgets! I'll have the whole team making pasta by Friday."]),
      R('like','dark','Dark wood, burgundy and brown',{colors:['Dark Wood','Red','Brown'],min:2},["Dark wood and a dash of red. Theatrical. I'm in love."]),
      R('like','metal','Metal finishes: chrome and steel',{colors:['Chrome','Steel','Silver'],min:3},["So much chrome. My reflection approves."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"Is that… a flower? In my kitchen? We'll talk."]),
      R('avoid','nolightwood','No pale rustic wood',{colors:['Light Wood'],max:0},[null,"I spotted some pale wood. It's very… farmhouse."])
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
      R('like','dark','Dark wood and burgundy continued from the kitchen',{colors:['Dark Wood','Red','Brown'],min:4},["The kitchen's mood carries all the way through. Chef's kiss."]),
      R('like','orange','Burnt orange accents',{colors:['Orange'],min:2},["That orange! Sunset in a room."]),
      R('like','chrome','A few chrome or black pieces for drama',{colors:['Chrome','Black'],min:3},["A little chrome, a little black. Seventies in the best way."]),
      R('avoid','noflowers','No flowers',{kinds:['flowers'],max:0},[null,"Flowers again. I see what's happening."]),
      R('avoid','nolightwood','No pale rustic wood',{colors:['Light Wood'],max:0},[null,"A bit of pale wood got in. It's like a cabin visited."])
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
      R('like','dark','Dark wood and burgundy in the kitchen and living room',{colors:['Dark Wood','Red','Brown'],min:5,rooms:['kitchen','living']},["The public rooms say 'Sam'."]),
      R('like','lightbed','A lighter bedroom: mostly cream and white',{colors:['Beige','White','Light Wood'],minShare:0.5,room:'bedroom'},["Robin says it's the best room. I'm not offended. I'm a little offended."]),
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
    message:"The bedroom first. Chalk white, blue, pale wood. I look at plans all day; I don't want work following me to bed. Fewer things, chosen well.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["It's quiet. The good kind."]),
      R('like','palette','Mostly white, blue, grey and pale wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["The palette is… correct."]),
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
      R('like','palette','White, blue, grey and pale wood',{colors:['White','Blue','Grey','Light Wood'],minShare:0.6},["Same restraint. Different room. Well done."]),
      R('like','wood','Pale wood in the living room',{colors:['Light Wood'],min:2,room:'living'},["The wood in the living room is lovely."]),
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
      R('like','palette','White, blue, grey and pale wood',{colors:['White','Blue','Grey','Light Wood','Travertine'],minShare:0.55},["Clean. Proportional. Quietly correct."]),
      R('like','calm','No more than 12 pieces per room',{maxItems:12,rooms:['living','bedroom','study'],each:true},["Lots of air. Lots of calm."]),
      R('avoid','nopattern','No busy patterns',{kinds:['patterned'],max:0},[null,"A pattern. Of course."])
    ],
    reply:{ low:"It's a start. I'll live with it.", mid:"Considered. That's the word I'd use.", high:"I came home from the site, took my shoes off, and nobody needed me. The flat agrees. Thank you." }
  },

  /* ======================== THEO ======================== */
  { id:'THEO_01', char:'theo', title:'Before the Baby Arrives', property:'THEO_HOME_A', change:'new', edit:['living'],
    requires:['NOOR_01'], day:74, allowance:32,
    starters:[ {room:'living', asset:'sideboard-akio-mediumwood', x:56, y:58, width:null} ],
    story:"Theo and Elena have found a little cabin on the lake point with just enough room for a growing family. Their belongings have arrived. The living room is a collection of temporary solutions.",
    message:"We want somewhere we can both sit and breathe for a minute. Elena likes warm white; I'd love some mustard or blue. It doesn't need to be fancy. Oh, and we kept the old sideboard. It might be useful.",
    brief:[
      R('must','living','A living room to sit and breathe in',{role:'living',room:'living'},["We sat down and just… breathed. Thank you."]),
      R('like','white','Warm white and cream',{colors:['White','Beige'],min:2},["Elena says the white is very her."]),
      R('like','mustard','A bit of mustard: yellow or orange',{colors:['Yellow','Orange'],min:1},["Mustard! I knew we needed some."]),
      R('like','blue','Denim blue',{colors:['Blue'],min:1},["That blue is lovely and sturdy."]),
      R('like','wood','Practical wood',{colors:['Light Wood','Medium Wood'],min:1},["Good solid wood."]),
      R('avoid','nowhitecouch','No white upholstery',{kinds:['couch','armchair'],colors:['White'],max:0},[null,"White upholstery and a baby on the way? Brave."]),
      R('avoid','novases','Nothing fragile: no vases',{kinds:['vase'],max:0},[null,"A vase! Which will be on the floor by Tuesday."])
    ],
    reply:{ low:"It's a good start. We'll make it ours.", mid:"This feels like somewhere we can actually settle in.", high:"Elena cried a little and said it was 'hormones'. I think it was the sideboard." }
  },
  { id:'THEO_02', char:'theo', title:'A Room for Us, Too', property:'THEO_HOME_A', change:'more', edit:['bedroom'],
    requires:['THEO_01','ROSA_01'], day:345, allowance:36,
    story:"The baby has arrived and so has a lot of laundry. Theo and Elena have spent their money on essentials and left their own bedroom for last. They'd love one room that's restful and adult.",
    message:"The living room still makes us happy. Could you help with our bedroom now? Elena suggested green. I'd like to keep the wood and keep it simple. And somewhere to put clothes that isn't 'the chair'.",
    brief:[
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["It's a real bedroom. With a bed we can find the floor around."]),
      R('must','storage','Somewhere to put clothes: a sideboard or cabinet',{kinds:['sideboard'],min:1},["Storage that isn't a chair. Finally."]),
      R('like','green','Forest green and warm white',{colors:['Green','White','Beige'],minShare:0.5},["Green and white. Elena says it's 'calm in a fresh way'."]),
      R('like','wood','Sturdy wood',{colors:['Light Wood','Medium Wood'],min:2},["The wood keeps it grounded."]),
      R('avoid','nowhitebed','No white bed',{kinds:['bed'],colors:['White'],max:0},[null,"A white bed, with a baby in the house? Daring."]),
      R('avoid','novases','Nothing fragile',{kinds:['vase'],max:0},[null,"A vase. I'm sorry. Our history with vases is not good."])
    ],
    reply:{ low:"It's somewhere to sleep. That's a lot, right now.", mid:"Restful. Adult. That's all we asked.", high:"We slept for six hours straight. The baby did too. Is this witchcraft?" }
  },
  { id:'THEO_03', char:'theo', title:'Enough Room for Everyone', property:'THEO_HOME_B', change:'move', edit:['living','dining','bedroom'],
    requires:['THEO_02'], minRenown:15, day:380, allowance:86,
    starters:[ {room:'living', asset:'sideboard-akio-mediumwood', x:60, y:58, width:null} ],
    story:"Theo is now a co-owner of the bicycle shop and the family has moved to a bigger flat with a proper dining room. They can afford new furniture, but they brought the sideboard. It might be useful.",
    message:"We've finally got a proper dining room! I'd love us all to sit down together when family visits. Bring what still works from the old place, we don't need to start from zero. (The sideboard is back. It followed us.)",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["The living room is comfy and ready for naps."]),
      R('must','dining','A dining room with a table and seats',{role:'dining',room:'dining'},["A table. For everyone. I might cry into the soup."]),
      R('must','bedroom','A bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom is peaceful."]),
      R('like','palette','Warm white, green, mustard and denim blue, with wood',{colors:['White','Beige','Green','Yellow','Orange','Blue','Light Wood','Medium Wood'],minShare:0.65},["It's cheerful AND practical. A rare combo."]),
      R('like','mustard','A touch of mustard',{colors:['Yellow','Orange'],min:1},["Mustard is back."]),
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
    message:"I've hated that arrangement for years. The dark wood stays — I'm very attached to the sideboard. And I want proper colour: wine, ochre, something with a pattern. Retirement is no reason to turn everything beige, darling.",
    brief:[
      R('must','sitting','A sitting room with two places to sit, a table and a lamp',{role:'sitting',room:'sitting'},["Yes. Now one can receive."]),
      R('must','pattern','Something patterned: a rug, a cushion, a painting',{kinds:['patterned'],min:1},["A pattern! One feels dressed."]),
      R('like','wine','Wine red, ochre and dark wood',{colors:['Red','Orange','Yellow','Dark Wood','Brown','Gold','Brass'],minShare:0.45},["Wine, ochre, dark wood. You've been listening, darling."]),
      R('like','red','At least two wine-red pieces',{colors:['Red'],min:2},["Red, yes. A life without red is a life unlived."]),
      R('like','ochre','Ochre: some yellow or orange',{colors:['Yellow','Orange'],min:2},["That ochre warms the soul."]),
      R('avoid','noall','Not a pale room: little white or cream',{colors:['White','Beige'],maxShare:0.25},[null,"There's rather a lot of cream. One could faint."])
    ],
    reply:{ low:"It's a start. I'll complain about it fondly.", mid:"Plenty of colour, and it still feels like my home. Good.", high:"I sat in it and wanted to hold a small dinner party immediately. That's a compliment, darling." }
  },
  { id:'ROSA_02', char:'rosa', title:'Stay for Tea', property:'ROSA_HOME_A', change:'more', edit:['dining','guest'],
    requires:['ROSA_01','MIA_02'], day:146, allowance:68,
    story:"Rosa has started teaching small sewing classes in the village hall. Friends stay for tea afterwards, and her daughter visits at weekends. The dining room needs attention, and the guest room is 'where I put things I haven't decided about'.",
    message:"Everyone ends up staying longer now. The dining room needs some attention, and my daughter deserves better than the room where I put things I haven't decided about. Teal in her room, I think. Wine and ochre for the table.",
    brief:[
      R('must','dining','A dining table with seats',{role:'dining',room:'dining'},["Tea for six, and a debate. Perfect."]),
      R('must','guest','A guest bedroom: a bed and a bedside table',{role:'bedroom',room:'guest'},["My daughter will feel adored. And a bit spoilt."]),
      R('like','dining','Wine, ochre and dark wood in the dining room',{colors:['Red','Orange','Yellow','Dark Wood','Brown'],minShare:0.4,room:'dining'},["The dining room is a stage set for conversation."]),
      R('like','guest','Teal and cream in the guest room: green, blue and cream',{colors:['Green','Blue','Beige','White'],minShare:0.5,room:'guest'},["The guest room is so peaceful. Almost suspicious."]),
      R('like','brass','A touch of brass or gold',{colors:['Brass','Gold'],min:1},["A bit of gold. One should always have a bit of gold."]),
      R('like','dark','Dark wood in the dining room',{colors:['Dark Wood'],min:2,room:'dining'},["The wood is substantial. I approve."]),
      R('avoid','nowhite','Not white and pale everywhere',{colors:['White'],maxShare:0.25},[null,"Too much white. It's a hospital, not a home."])
    ],
    reply:{ low:"A fine beginning. One expects improvements.", mid:"Lovely. Now everyone will stay even longer. Good.", high:"Four people stayed until midnight. I've found the room's 'one more cup' effect. Marvellous." }
  },
  { id:'ROSA_03', char:'rosa', title:'The Little House by the Lake', property:'ROSA_CABIN_A', change:'second', edit:['living','kitchen','bedroom'],
    requires:['ROSA_02'], minRenown:15, day:366, allowance:110,
    story:"With long-held savings and an inheritance, Rosa has bought a little cabin on the lake. She keeps her city flat. The cabin is small and bright, and calls for a lighter, breezier version of her taste.",
    message:"I want to know I'm near the water when I open the windows. I don't need little ducks on the cushions. Lighter wood, some green and blue — but don't make it anonymous, darling. A little ochre. I do have a reputation.",
    brief:[
      R('must','living','A living room',{role:'living',room:'living'},["I could read here for weeks."]),
      R('must','kitchen','A kitchen, with a counter and a fridge',{role:'kitchen',room:'kitchen'},["Tea, toast. A kitchen of dignity."]),
      R('must','bedroom','A bedroom with a bed and a bedside table',{role:'bedroom',room:'bedroom'},["The bedroom will let me sleep to the sound of the water."]),
      R('like','palette','Green, blue, cream and light wood',{colors:['Green','Blue','Beige','White','Light Wood'],minShare:0.6},["It's the lake in a room. Not literal. Wonderful."]),
      R('like','ochre','Small ochre accents: yellow, orange or gold',{colors:['Yellow','Orange','Gold','Brass'],min:1},["That bit of ochre is me, in tiny form."]),
      R('like','wood','Light wood in a few places',{colors:['Light Wood'],min:3},["Light, lovely wood."]),
      R('like','table','A table in the kitchen to eat at',{kinds:['dining'],min:1,room:'kitchen'},["A kitchen table. Bliss."]),
      R('avoid','nodark','Not an all-dark-wood interior',{colors:['Dark Wood'],maxShare:0.2},[null,"Rather a lot of dark wood for a lakeside cabin, darling."])
    ],
    reply:{ low:"It's a house by the lake. One forgives a great deal.", mid:"It's light and it's mine. Lovely.", high:"I opened the window, heard the ducks, and decided to stay till autumn. You've ruined my city flat for me." }
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
             idle:["Theo is fixing a bike on the pavement and singing badly.",
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
    MIA_01: { hello:"Hello!",
      body:["Priya at the vet practice says you're the person who ‘does rooms’. I have a key now. My own key! I keep checking my pocket.",
            "I can only afford to make one room nice, so: the living room. Somewhere comfy, a little table, a lamp. Green, cream and light wood, please. And flowers! (A florist is about to open on my street and I'm already emotionally invested.)",
            "No black furniture or shiny chrome, please. Shiny things make me nervous."],
      bye:"Thank you so much,", ps:"There will be cookies." },
    MIA_02: { hello:"Hello again!",
      body:["I passed my probation! And every evening I still end up in the living room you made, like a cat in the only sunny spot.",
            "Could you do the other two rooms? A soft pink bedroom, and the little room as a reading corner, green like a tiny garden. Flowers in both, please, and nothing too dark."],
      bye:"Thank you again,", ps:"Jules says hi. They talked about you for forty minutes." },
    MIA_03: { hello:"Dear friend,",
      body:["Alex and I are moving in together! A real flat with a real dining table. We've never owned a table that wasn't also a desk.",
            "Alex likes navy and clean shapes; I like green and anything that smells of baking. Could you find the middle? A living room, a dining room and a bedroom. Flowers on the table, a few blue pieces for Alex, and nothing too dark. We're cosy people, not moody ones."],
      bye:"Gratefully (and sticky),", ps:"There's a lemon loaf waiting. In my head, but still." },

    JULES_01: { hello:"HELLO!!",
      body:["Mia gave me your name and a cookie. I have one suitcase and ELEVEN boxes of paint. The paint is unpacked. The bed is… somewhere?",
            "One room that does everything. The EASEL first, then somewhere to sleep, then somewhere to sit and stare at the ceiling. Cobalt blue, some orange, lots of colours that don't match. Matching is how they get you.",
            "Please don't make it beige. BEIGE IS HOW THEY GET YOU."],
      bye:"Yours in turpentine,", ps:"I drew you on the back. You look like a potato in a nice jumper." },
    JULES_02: { hello:"OKAY SO,",
      body:["SOMEONE PAID ME. For a drawing of a heron in a raincoat. I've read the email eleven times.",
            "Keep the easel and the blue, but bring in three or four new things, and could we try lilac or pink? The Carla couch comes in lilac and I've been staring at it for days. And less beige. I can feel it creeping back."],
      bye:"Gratefully chaotic,", ps:"The heron is going on a mug." },
    JULES_03: { hello:"GUESS WHAT,",
      body:["I GRADUATED. And the mill's landlord has offered me the whole top floor. A live-work loft. A DOOR THAT CLOSES.",
            "The art room needs ALL the colour: easel, things on the walls, a rainbow that had too much coffee. The bedroom should be soft and quiet. And please don't let the living room look like a dentist's waiting room."],
      bye:"Yours, slightly overwhelmed,", ps:"I'm planning an Open Studio. I will make cake. (I can't bake.)" },

    SAM_01: { hello:"Good evening,",
      body:["I've just moved for a better job and invited my whole team to dinner on Friday. Eleven people, a flat that seats four. It'll be wonderful.",
            "The kitchen comes first: dark wood, burgundy, plenty of chrome and steel, an island big enough to put a party on, and a fridge that hums reassuringly. And gadgets: three mixers at least. No flowers (they wilt when I look at them) and nothing pale and rustic.",
            "(The oven is on back-order. We don't discuss it.)"],
      bye:"Warmly, and in need of a whisk,", ps:"Friday, seven o'clock. That's an invitation, not a request." },
    SAM_02: { hello:"My friend,",
      body:["The kitchen is a triumph. Eleven people ate in it and the only casualty was a lemon. Now people ask if they can ‘stay a bit longer’.",
            "A dining table with enough seats to pretend I planned this, and a room next door to collapse in. Leather, please. Keep the dark wood and burgundy, add burnt orange and a little chrome or black. Still no flowers. Still nothing pale."],
      bye:"Gratefully,", ps:"Someone asked if the dishwasher was a ‘feature wall’. I'm flattered." },
    SAM_03: { hello:"Dear friend,",
      body:["I got promoted. And Robin and I have bought a place, together. We own a dish rack. Best day of my life.",
            "Kitchen first, obviously, with gadgets worth bragging about. Dark wood, burgundy and leather in the living room. The bedroom lighter, cream and white, because Robin would like to sleep somewhere that isn't a stage set. A little drama is a seasoning, not a main course. And no flowers!"],
      bye:"Yours, in a rare moment of restraint,", ps:"Robin says I'm not allowed a second mixer. We'll see." },

    NOOR_01: { hello:"Hello.",
      body:["Sam passed on your details. He said you actually listen. I'll assume that's true.",
            "I've moved. That's not up for discussion. I'd like one room finished: the bedroom. A bed, a bedside table, chalk white, a little blue, pale wood. Twelve things at most; I counted. Somewhere to put things away. No busy patterns."],
      bye:"Regards,", ps:"If a shelf is two centimetres off, I'll know." },
    NOOR_02: { hello:"Hello again.",
      body:["The bedroom works. I said so out loud, in the office. One colleague dropped a stapler.",
            "Now the living room and the kitchen: the same restraint, but each with its own temperament. Pale wood in the living room; steel, chrome or white in the kitchen. Keep the blue. Fourteen pieces a room at most. No patterns."],
      bye:"Regards,", ps:"My sister asked who did the bedroom. I said ‘someone good’." },
    NOOR_03: { hello:"Hello.",
      body:["I have bought the top floor of my building: tall windows, a ceiling you could lose a kite in. I intend to stay.",
            "A living room I want to sit in at the end of the day, a quiet bedroom, and a small room to think in: a chair, a shelf, a good lamp. No desk. One good piece of stone or marble. White, blue, grey, pale wood; twelve pieces a room at most; no patterns."],
      bye:"With some warmth, which I'm told is noticeable,", ps:"The windows are 3.4 metres tall. I measured twice." },

    THEO_01: { hello:"Hi there!",
      body:["Noor said you were good, and she doesn't say that about anyone. Elena and I have found a little cabin on the lake. The baby's due in spring and the living room is full of ‘temporary solutions’.",
            "We'd love somewhere to sit and breathe: warm white, a bit of mustard, denim blue, solid wood. Nothing white to sit on (small person incoming) and nothing breakable. I once owned a vase. It's a sad story. We kept the old sideboard. It might be useful."],
      bye:"Cheers!", ps:"If you ever need a bike fixed, I'm yours. I'm not great with words." },
    THEO_02: { hello:"Hi again!",
      body:["She's here! Wren, seven weeks old, very loud, already stealing my heart and my socks. Elena sends a tired thank-you for the living room.",
            "Our bedroom is last on the list. Restful, please: green and warm white, sturdy wood, a bed that isn't white, and somewhere for clothes that isn't ‘the chair’. It has become load-bearing. Nothing fragile."],
      bye:"Sleepily yours,", ps:"Rosa has offered to sew Wren a coat. I'm scared of her." },
    THEO_03: { hello:"Hey you,",
      body:["Two bits of news. I'm now co-owner of the bicycle shop (the old owner cried, I cried, the shop cat cried). And we've found a flat with a proper dining room!",
            "I'd love everyone round one table: grandad, aunts, the lot. Living room for naps, dining room for noise, bedroom for six hours of sleep. Bring what still works from the old place. The sideboard followed us. It does that. Same as before: warm white, green, mustard, denim, solid wood, nothing fragile."],
      bye:"Thank you, again and always,", ps:"Bring your bike round. I'll tune it." },

    ROSA_01: { hello:"My dear,",
      body:["I have retired from thirty-one years in the costume department of the Playhouse and been told to ‘relax’. I have never been less relaxed. My sitting room has been wrong since 1998.",
            "The sideboard stays. Everything else must earn its place: two places to sit, a table, and a lamp with personality. And colour, darling: wine red, ochre, dark wood and something patterned. What I will not have is a pale room. Not cream. Not ‘greige’."],
      bye:"With great expectations,", ps:"Theo says you're good. He once tried to pay me in bicycle tyres." },
    ROSA_02: { hello:"Darling,",
      body:["I've begun teaching sewing at the village hall, and everyone stays for tea afterwards. ‘Everyone’ is currently six people and one opinionated dachshund.",
            "The dining room needs a proper table, seats for all, and the mood of a stage set before the curtain goes up: wine, ochre, dark wood, a touch of gold. My daughter visits at weekends and deserves a proper guest room: a bed, a bedside table, and teal (greens and blues with cream). And no white. It's a home, not a hospital."],
      bye:"Fondly, and with a flourish,", ps:"Mia's flowers have the whole village talking." },
    ROSA_03: { hello:"Darling,",
      body:["I have done something impulsive. I have bought a little house on the lake. Small, bright, slightly crooked, with a kitchen window that looks straight at the water. I'm keeping the flat in town; I'm not a monster.",
            "It needs a lighter version of me: a living room for a book and the view, a kitchen with a table for toast with dignity, and a bedroom to be rocked to sleep in. Green, blue and cream, light wood, a small touch of ochre. No ducks on the cushions. And not too much dark wood. It's a cabin, not a library in a thriller."],
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
  // the day of the story that was reached by the jobs finished so far
  function todayOf(doneMap){
    var t = 0;
    QUESTS.forEach(function(q){ if (doneMap && doneMap[q.id] && q.day > t) t = q.day; });
    return t;
  }

  /* ----------------------------------------------------------- places & happenings */
  // Little places that appear on the map as the story goes on. Shops stay for
  // good. Happenings are on for `len` days from `day`. (You can't buy anything
  // in the shops yet — the shop cards say "coming soon".)
  var SPOTS = [
    { id:'flowers',  kind:'shop', icon:'flower',  name:'Fennel & Fern',          x:54.3, y:54.3, day:30,
      blurb:"A striped awning, buckets of dahlias and a very serious cat called Parsley.", soon:"Soon you'll be able to buy fresh flowers here." },
    { id:'antiques', kind:'shop', icon:'urn',     name:'Marigold & Moss Antiques', x:46.0, y:47.0, day:70,
      blurb:"Chairs with stories, lamps with opinions. Everything is ‘one of a kind’ and most of it is very heavy.", soon:"Soon you'll be able to hunt for one-off pieces here." },
    { id:'gallery',  kind:'shop', icon:'frame',   name:'The Paper Moth Gallery',   x:95.2, y:40.5, day:150,
      blurb:"Small prints, big frames, and a free glass of something fizzy on opening night.", soon:"Soon you'll be able to buy art for your rooms here." },
    { id:'bikes',    kind:'shop', icon:'wheel',   name:'Spoke & Sprocket',         x:51.6, y:62.0, needs:'THEO_01',
      blurb:"The bicycle shop where Theo works. There is a shop cat. It supervises.", soon:"" },

    { id:'fleamarket', kind:'happening', icon:'flag', name:'Flea Market on Orchard Green', x:46.0, y:19.5, day:40, len:8,
      blurb:"Tables of teapots, bicycle bells and one suspiciously large clock. Bring a bag." },
    { id:'regatta',  kind:'happening', icon:'sail',   name:'Midsummer Regatta',   x:61.5, y:87.0, day:47, len:9,
      blurb:"Sails, bunting and a prize for the most dramatic wobble." },
    { id:'lantern',  kind:'happening', icon:'lantern', name:'Lantern Night',       x:71.8, y:9.0, day:90, len:8,
      blurb:"Paper lanterns on the water, hot chocolate, and a lake-side neighbour who ‘didn't plan any of this’." },
    { id:'harvest',  kind:'happening', icon:'flag',   name:'Harvest Market',      x:49.0, y:56.0, day:134, len:10,
      blurb:"Pumpkins, chutneys and a jam stall with a queue. Old Town smells of cinnamon." },
    { id:'lights',   kind:'happening', icon:'lantern', name:'Winter Lights',       x:30.0, y:63.0, day:200, len:16,
      blurb:"Every window on Church Hill gets a candle. The steeple gets a star." },
    { id:'wedding',  kind:'happening', icon:'bell',   name:"Priya & Dev's Wedding", x:33.0, y:54.0, day:300, len:33,
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
    { id:'e_flowers', day:30, kind:'shop', spot:'flowers', title:'A florist has opened on Canal Row',
      lines:["Fennel & Fern has put out its striped awning and a hundred buckets of dahlias.","Parsley the shop cat is in charge of the till. Mia was seen outside before it opened. Obviously."] },
    { id:'e_flea', day:40, kind:'happening', spot:'fleamarket', title:'Flea Market on Orchard Green',
      lines:["Saturday morning, long tables, hand-painted signs: teapots, bicycle bells, a very large clock.","Bring a bag. Haggle politely."], tease:"Flea market on Orchard Green" },
    { id:'e_regatta', day:47, kind:'happening', spot:'regatta', title:'Midsummer Regatta at the Harbour',
      lines:["Bunting on every mast and a prize for the most dramatic wobble.","The harbour master has been practising his ‘ahoy’."], tease:"Midsummer Regatta at the Harbour" },
    { id:'e_antiques', day:70, kind:'shop', spot:'antiques', title:'Antiques in Old Town',
      lines:["Marigold & Moss has opened on the corner by the clock tower. Chairs with stories, lamps with opinions.","Everything is ‘one of a kind’. Most of it is very heavy."] },
    { id:'e_lantern', day:90, kind:'happening', spot:'lantern', title:'Lantern Night at the Lake',
      lines:["Paper boats with candles are set afloat at dusk. Hot chocolate by the cabins.","Bring a jumper; the lake gets cold fast."], tease:"Lantern Night at the Lake" },
    { id:'e_harvest', day:134, kind:'happening', spot:'harvest', title:'Harvest Market in Old Town',
      lines:["Pumpkins, chutneys and a jam stall with an actual queue.","The first red leaf landed on the clock tower on Tuesday. The market is its reward."], tease:"Harvest Market in Old Town" },
    { id:'e_gallery', day:150, kind:'shop', spot:'gallery', title:'A gallery on the Far Shore',
      lines:["The Paper Moth has opened in the red-brick house across the water: small prints, big frames, a very quiet owner.","Opening night: a free glass of something fizzy."] },
    { id:'e_lights', day:200, kind:'happening', spot:'lights', title:'Winter Lights on Church Hill',
      lines:["Every window gets a candle. The steeple gets a star.","Neighbours bring soup, and a surprising amount of tinsel."], tease:"Winter Lights on Church Hill" },
    { id:'e_birth', day:296, kind:'birth', from:'theo', title:'Wren has arrived!',
      lines:["Wren, born on a very rainy Tuesday morning. Loud, tiny, and already in charge.","Theo and Elena say thank you for the living room, and ask for no vases."], sign:'Theo, Elena & Wren' },
    { id:'e_wedding', day:300, kind:'invite', spot:'wedding', from:'mia', title:'You are invited',
      names:'Priya & Dev', lines:["are getting married.","Saturday 25 April · Two o'clock · The white church on Church Hill","Cake to follow. Tea to follow cake. Dancing to follow tea."],
      sign:'Please say yes. There is a lemon loaf.', tease:"Priya & Dev's wedding" },
    { id:'e_spring', day:334, kind:'happening', spot:'springmarket', title:'The flea market is back',
      lines:["Seedlings, bunting and the very large clock, still unsold.","Spring on Orchard Green."], tease:"Spring Flea Market" },

    // moves: these arrive when the matching job is finished
    { id:'h_mia', after:'MIA_03', kind:'home', who:'mia', home:'MIA_HOME_B', title:'Mia & Alex have moved in!',
      lines:["Keys in, boxes unpacked (mostly), a dining table with an actual tablecloth.","Mia's first flat on Canal Row is quiet now. The new place is on Church Hill."] },
    { id:'h_jules', after:'JULES_03', kind:'home', who:'jules', home:'JULES_HOME_B', title:'Jules has moved upstairs',
      lines:["Same mill, one staircase higher: a loft with a door that closes and a room just for paint.","The Open Studio is next Saturday. There will be cake. (Mia is baking it.)"] },
    { id:'h_sam', after:'SAM_03', kind:'home', who:'sam', home:'SAM_HOME_B', title:'Sam & Robin bought a home',
      lines:["Their first place together, in Old Town, with a dish rack and a very big kitchen.","The oven is, we are told, ‘on its way’."] },
    { id:'h_noor', after:'NOOR_03', kind:'home', who:'noor', home:'NOOR_HOME_B', title:'Noor bought the top floor',
      lines:["Same tower, a few floors higher: tall windows, a ceiling you could lose a kite in.","No desk. She was very clear."] },
    { id:'h_theo', after:'THEO_03', kind:'home', who:'theo', home:'THEO_HOME_B', title:'Theo & Elena have a family flat',
      lines:["A proper dining room on Orchard Rise, with space for grandad, the aunts and the sideboard.","Theo is now co-owner of Spoke & Sprocket, too."] },
    { id:'h_rosa', after:'ROSA_03', kind:'home', who:'rosa', home:'ROSA_CABIN_A', second:true, title:'Rosa has bought a cabin',
      lines:["A little house on the lake, with a kitchen window that looks straight at the water.","She is keeping her flat in town. ‘I am not a monster, darling.’"] }
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
    { day:0, lead:{ h:"Pennywhistle Cove Wakes Up Slowly", t:"The bakery opens at seven, the clock tower runs four minutes fast, and nobody minds. New neighbours are arriving all week, say the removal vans." },
      items:[ {h:"Pigeon census", t:"Up by twelve. The council blames the bakery."}, {h:"Lost", t:"One blue bicycle bell. Reward: a lemon cookie."} ],
      notice:"WANTED: someone who is good with rooms. Apply anywhere in the Cove." },
    { day:30, lead:{ h:"A Florist for Canal Row", t:"Fennel & Fern opened its striped awning today with a hundred buckets of dahlias and one cat. Early customers described the queue as ‘polite but hungry for tulips’.", spot:'flowers' },
      items:[ {h:"Dinner parties", t:"A flat in Glass Row now seats eleven. The neighbours are ‘delighted, mostly’."}, {h:"Harbour notice", t:"Starboard is the right-hand side. Please stop asking."} ],
      notice:"FOR SALE: bicycle, hardly ridden. Ask for Theo." },
    { day:60, lead:{ h:"Flea Market Sells Out of Teapots", t:"By ten o'clock on Saturday there wasn't a teapot left on Orchard Green. One shopper went home with a grandfather clock and no plan.", spot:'fleamarket' },
      items:[ {h:"Regatta results", t:"First place: the boat that stayed upright. Second: a very wobbly one."}, {h:"Weather", t:"Hottest week on record. The canal ducks are reported to be ‘sulking’."} ],
      notice:"OPEN MIC Thursday at the harbour café. Bring a song, or a snack." },
    { day:90, lead:{ h:"Antiques Arrive in Old Town", t:"Marigold & Moss has opened on the corner by the clock tower. Every item is ‘one of a kind’ and most are extremely heavy. Browsers are advised to bring a friend.", spot:'antiques' },
      items:[ {h:"Lantern Night", t:"This Saturday at the lake. Paper boats, hot chocolate, jumpers."}, {h:"Bike clinic", t:"Free tune-ups at Spoke & Sprocket for anyone who can find their bike."} ],
      notice:"LOST: one cat, answers to ‘Parsley’. Does not answer." },
    { day:120, lead:{ h:"Autumn Arrives, Tidily", t:"The first red leaf landed on the clock tower on Tuesday. The Courier welcomes it and asks the others to follow in an orderly fashion.", },
      items:[ {h:"Sewing classes", t:"Full. The waiting list is now one dachshund."}, {h:"Harbour", t:"The summer sails are coming down. The winter coats are going on."} ],
      notice:"SOUP SWAP Sunday, Church Hill. Bring a ladle." },
    { day:150, lead:{ h:"Art Across the Water", t:"The Paper Moth Gallery has opened on the Far Shore, in the red-brick house with the green door. Prints are small, frames are big, the owner is shy.", spot:'gallery' },
      items:[ {h:"Harvest Market", t:"The jam stall queue reached the clock tower. A new record."}, {h:"Pumpkins", t:"Carving results: ‘surprisingly anatomical’."} ],
      notice:"EXTRA FERRY on Saturdays. It will be late, as always." },
    { day:180, lead:{ h:"Candles in Every Window", t:"Church Hill is stringing up its Winter Lights: a candle in every window and a star on the steeple. Soup will be provided by anyone with a pot.", spot:'lights' },
      items:[ {h:"First frost", t:"The canal has a thin glass lid. The ducks are unbothered."}, {h:"Mills", t:"Waiting list for a window seat in the old lofts. Longer than the stairs."} ],
      notice:"LOST: one mitten, red. Possibly on the clock tower." },
    { day:210, lead:{ h:"The Year in Review", t:"Looking back: a florist, an antiques shop, a gallery, two markets and a great many casseroles. The Cove has had a busy seven months, and a very good season for cake.", },
      items:[ {h:"New Year's swim", t:"Cancelled due to common sense."}, {h:"Resolutions", t:"The bakery reports a 300% rise in ‘just one more’."} ],
      notice:"THANK YOU to whoever left soup on the clock tower steps." },
    { day:240, lead:{ h:"Snow Day", t:"School is closed, the bakery is open, and the ducks are furious. Chimneys all over town are smoking happily, the lake-side cabins most of all.", },
      items:[ {h:"Hot soup index", t:"Rising. Alarmingly."}, {h:"Sledges", t:"The hill behind the church is officially ‘fast’."} ],
      notice:"FOUND: one sledge. Not yours. Very good sledge." },
    { day:270, lead:{ h:"Thaw!", t:"The first crocus appeared on Orchard Rise this morning, to cheers from a cat. The canal has un-frozen. The ducks have forgiven everyone.", },
      items:[ {h:"Window boxes", t:"Planting season is officially open. Neighbours are asked not to overdo the geraniums."}, {h:"Ferry", t:"Back on schedule. Almost."} ],
      notice:"SEEDLINGS free outside Fennel & Fern, Saturday." },
    { day:300, lead:{ h:"A Wedding Invitation Goes Round Town", t:"Priya (of the vet practice) and Dev will marry at the white church on Saturday 25 April, and the whole street is invited. The bakery has been warned about the cake.", spot:'wedding' },
      items:[ {h:"Spring flea market", t:"Returns in May. The large clock is still unsold."}, {h:"A new arrival", t:"Wren, 3.1 kilos, loud. Mother, father and the shop cat are doing well."} ],
      notice:"CONFETTI: biodegradable, please." },
    { day:330, lead:{ h:"Wedding Bells (and One Dropped Cake)", t:"The church was full, the sun came out for the vows, and the three-tier lemon cake survived all but one corner. Priya and Dev left in a bicycle sidecar.", },
      items:[ {h:"Dancing", t:"Went on until the ducks complained."}, {h:"Flowers", t:"The church smelled of peonies. Fennel & Fern sold out."} ],
      notice:"THANK YOU to everyone who stayed to wash up." },
    { day:360, lead:{ h:"A Whole Year in the Cove", t:"A year ago the removal vans started arriving. Today the clock tower is still four minutes fast, the harbour is full of sails, and the neighbours know whose bicycle is whose.", },
      items:[ {h:"Midsummer", t:"The regatta is back on the calendar. Please practise your wobble."}, {h:"Lake", t:"Cabin windows are open again. Ducks have been told."} ],
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
    if (test.max != null){
      return { met: count <= test.max, progress: String(count) };
    }
    var need = test.min != null ? test.min : 1;
    return { met: count >= need, progress: Math.min(count, need) + '/' + need };
  }

  // pieces: [{assetId, roomKey, q, starter, x}] (only pieces in this property)
  // getAsset: id -> asset
  function evaluate(quest, pieces, getAsset){
    var entries = [];
    pieces.forEach(function(p){
      var a = getAsset(p.assetId);
      if (a) entries.push({ asset:a, piece:p });
    });
    function inRooms(keys){ return entries.filter(function(e){ return keys.indexOf(e.piece.roomKey) !== -1; }); }

    var reqs = quest.brief.map(function(req){
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
    });

    function frac(tier){
      var list = reqs.filter(function(r){ return r.tier === tier; });
      if (!list.length) return 1;
      return list.filter(function(r){ return r.met; }).length / list.length;
    }
    var scoped = inRooms(quest.edit);
    var hasStuff = scoped.length > 0;
    var brief = Math.round(100 * (0.55 * frac('must') + 0.30 * frac('like') + 0.15 * (hasStuff ? frac('avoid') : 0)));
    var mustAll = reqs.filter(function(r){ return r.tier === 'must'; }).every(function(r){ return r.met; });

    return { reqs:reqs, brief:brief, mustAll:mustAll };
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

  function heartsFor(briefScore, qualityScore, mustAll, anyPieces){
    if (!anyPieces) return 1;
    var final = 0.5 * briefScore + 0.5 * qualityScore;
    var h = final < 25 ? 1 : (final < 45 ? 2 : (final < 65 ? 3 : (final < 86 ? 4 : 5)));
    if (mustAll && h < 3) h = 3;     // if you listened to every must-have, you get at least 3
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
    var missed = evalResult.reqs.filter(function(r){ return !r.met && r.miss && r.tier !== 'avoid'; });
    var broke = evalResult.reqs.filter(function(r){ return !r.met && r.miss && r.tier === 'avoid'; });
    if (hearts <= 4){
      var m = missed[0] || broke[0];
      if (m) out.miss = m.miss;
    }
    return out;
  }

  return {
    TOWN: TOWN, RENOWN_LEVELS: RENOWN_LEVELS, renownLevel: renownLevel,
    CHARACTERS: CHARACTERS, PROPERTIES: PROPERTIES, QUESTS: QUESTS, ROLES: ROLES, KINDS: KINDS, MOODS: MOODS,
    questById: questById, questsOf: questsOf, isUnlocked: isUnlocked,
    giftsEarned: giftsEarned, giftOwner: giftOwner, REWARDS: REWARDS, VOICES: VOICES,
    starsFor: starsFor, isKind: isKind,
    evaluate: evaluate, quality: quality, qualityDetail: qualityDetail, analyze: analyze, districtAt: districtAt, dateOf: dateOf, seasonOf: seasonOf, todayOf: todayOf, SPOTS: SPOTS, spotById: function(id){ return SPOT_BY_ID[id] || null; }, spotsAt: spotsAt, EVENTS: EVENTS, eventById: function(id){ return EVENT_BY_ID[id] || null; }, eventsDue: eventsDue, upcoming: upcoming, pastEvents: pastEvents, NEWS: NEWS, issuesAt: issuesAt, heartsFor: heartsFor, buildReply: buildReply
  };
})();
