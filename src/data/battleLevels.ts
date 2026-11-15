export interface BattleLevel {
  level: number;
  rankTitle: string;
  rivalName: string;
  rivalCodename: string;
  theme: string;
  brief: string;
  targetScore: number;
  rivalScore: number;
  rivalPrompt: string;
}

export const BATTLE_LEVELS: BattleLevel[] = [
  {
    level: 1,
    rankTitle: 'Simulation Initiate',
    rivalName: 'Echo-01',
    rivalCodename: 'Rookie Compiler',
    theme: 'Foundational Composition',
    brief: 'Create a cinematic wide shot of an ancient stone sanctuary hidden deep inside an overgrown rainforest.',
    targetScore: 65,
    rivalScore: 62,
    rivalPrompt: 'An ancient stone temple hidden in a green rainforest, moss on walls, vines hanging down, soft daylight filtering through trees, wide angle shot.'
  },
  {
    level: 2,
    rankTitle: 'Grid Wanderer',
    rivalName: 'GlitchHop',
    rivalCodename: 'Neon Scavenger',
    theme: 'Atmospheric Lighting & Reflections',
    brief: 'Depict a nocturnal street ramen cart operating beneath flickering neon signs in a rainy, reflective cyber city.',
    targetScore: 70,
    rivalScore: 68,
    rivalPrompt: 'Nighttime street ramen cart in a wet cyberpunk alley, neon magenta and turquoise glow, rain puddles reflecting neon signs, chef cooking hot noodles, atmospheric steam.'
  },
  {
    level: 3,
    rankTitle: 'Sub-Zero Recon',
    rivalName: 'FrostByte',
    rivalCodename: 'Glacial Tracker',
    theme: 'Weather Physics & Textures',
    brief: 'Frame a futuristic tracked snowcat explorer cresting a wind-whipped Arctic glacier under the Aurora Borealis.',
    targetScore: 74,
    rivalScore: 72,
    rivalPrompt: 'Heavy tracked Arctic exploration vehicle driving across a frozen snowy ridge, violent blizzard blowing snow particles, vivid green aurora borealis in night sky, warm cockpit glow.'
  },
  {
    level: 4,
    rankTitle: 'Abyssal Diver',
    rivalName: 'ViperFish',
    rivalCodename: 'Deep-Trench Pilot',
    theme: 'Volumetric Optics & Bioluminescence',
    brief: 'Capture a deep-sea research submarine illuminating a gigantic bioluminescent cephalopod in the pitch-black midnight zone.',
    targetScore: 78,
    rivalScore: 76,
    rivalPrompt: 'Deep sea exploration submarine with bright dual spotlights shining through murky water, illuminating a colossal glowing bioluminescent squid with cyan and purple tentacles, marine snow floating in beam, extreme macro bokeh.'
  },
  {
    level: 5,
    rankTitle: 'Dune Drifter',
    rivalName: 'SandScraper',
    rivalCodename: 'Solar Nomad',
    theme: 'High Dynamic Range & Shadows',
    brief: 'Depict a solitary scavenger walking beside a massive crashed starship engine half-buried under undulating desert dunes at sunset.',
    targetScore: 81,
    rivalScore: 80,
    rivalPrompt: 'Lone nomad in desert wraps standing next to an enormous rusted spaceship turbine half-buried in sand, intense golden hour sun low on horizon, long directional shadows across rippling dunes, atmospheric heat haze.'
  },
  {
    level: 6,
    rankTitle: 'Chrono Weaver',
    rivalName: 'Clockwork-9',
    rivalCodename: 'Precision Mechanist',
    theme: 'Intricate Detailing & Macro Focus',
    brief: 'Produce a macro photograph peering into the exposed gears of an ancient astrological clockwork device made of brass, velvet, and obsidian.',
    targetScore: 84,
    rivalScore: 83,
    rivalPrompt: 'Extreme macro photograph of antique brass clockwork mechanism, interlocking intricate gears with engraved astronomical constellations, dark velvet and polished obsidian accents, shallow depth of field, razor-sharp gear teeth, f/2.0 aperture.'
  },
  {
    level: 7,
    rankTitle: 'Void Navigator',
    rivalName: 'Astra-Vex',
    rivalCodename: 'Orbital Tactician',
    theme: 'Zero-G Scale & Hard Surface Shading',
    brief: 'Illustrate an astronaut repairing a damaged solar array on an orbital space station with the glowing curved edge of Earth below.',
    targetScore: 87,
    rivalScore: 86,
    rivalPrompt: 'Spacewalk astronaut in white EVA suit replacing shattered solar panels on an orbital laboratory, stark contrast between harsh unfiltered direct sunlight and pitch black space, curvature of Earth with blue atmosphere haze below, hyper-realistic reflections on gold visor.'
  },
  {
    level: 8,
    rankTitle: 'Colossus Hunter',
    rivalName: 'TitanForge',
    rivalCodename: 'Monolith Architect',
    theme: 'Vertical Perspective & Scale Juxtaposition',
    brief: 'Construct a scene where a lone warrior on horseback looks up at an ancient stone golem walking through a mountain canyon.',
    targetScore: 90,
    rivalScore: 89,
    rivalPrompt: 'Dramatic low-angle worm-eye perspective looking upward from a rocky mountain pass, small cloaked warrior on horseback in the foreground looking at a towering mountain-sized stone golem stepping across peaks, volumetric mist, epic cinematic fantasy film grain.'
  },
  {
    level: 9,
    rankTitle: 'Neural Sovereign',
    rivalName: 'CyberSynapse',
    rivalCodename: 'Subconscious Synthesizer',
    theme: 'Abstract Surrealism & Physics Subversion',
    brief: 'Create a surreal zero-gravity library where thousands of open glowing books form spiral galaxies around an astronomer drifting at the center.',
    targetScore: 93,
    rivalScore: 92,
    rivalPrompt: 'Surreal infinite library floating in cosmic void, leather-bound books fluttering open and orbiting like spiral galaxies, glowing starlight lettering lifting off pages, Victorian astronomer suspended in zero gravity reaching toward a book, volumetric nebula light, cinematic octane masterpiece.'
  },
  {
    level: 10,
    rankTitle: 'Grand Architect',
    rivalName: 'NEXA-CORE-OMNIPRESENT',
    rivalCodename: 'Platform Overlord',
    theme: 'Ultimate Cinematic Synthesis',
    brief: 'Synthesize a breathtaking utopian mega-metropolis integrated inside a giant hollowed asteroid, featuring hanging botanical gardens, transparent transit tubes, and a miniature artificial sun.',
    targetScore: 96,
    rivalScore: 95,
    rivalPrompt: 'Masterclass architectural concept art of a self-contained utopian megacity built inside the curved interior of an asteroid, cascading vertical terraced botanical gardens, illuminated glass monorail tubes looping between spiraling glass towers, glowing miniature fusion sun suspended at the core, 16:9 widescreen anamorphic lens, ray-traced ambient occlusion, 8k resolution.'
  }
];