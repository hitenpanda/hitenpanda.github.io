import os

os.makedirs('public/media/work', exist_ok=True)

cards = [
    {
        'file': 'coming-soon-01.svg',
        'idx': '01',
        'title': 'AUTONOMOUS AI',
        'subtitle': 'AGENTIC REASONING & EVAL LOOPS',
        'tag': 'MIRA AI LABS // 2026',
        'accent': '#5483B3',
        'geom': '''
            <!-- Neural Network Graph -->
            <g stroke='#5483B3' stroke-width='1.5' opacity='0.4'>
                <line x1='300' y1='650' x2='600' y2='520' />
                <line x1='300' y1='650' x2='600' y2='780' />
                <line x1='300' y1='850' x2='600' y2='650' />
                <line x1='300' y1='850' x2='600' y2='910' />
                <line x1='600' y1='520' x2='900' y2='620' />
                <line x1='600' y1='650' x2='900' y2='750' />
                <line x1='600' y1='780' x2='900' y2='750' />
                <line x1='600' y1='910' x2='900' y2='880' />
            </g>
            <circle cx='300' cy='650' r='12' fill='#C1E8FF' />
            <circle cx='300' cy='850' r='10' fill='#5483B3' />
            <circle cx='600' cy='520' r='16' fill='#5483B3' />
            <circle cx='600' cy='650' r='14' fill='#C1E8FF' />
            <circle cx='600' cy='780' r='10' fill='#5483B3' />
            <circle cx='600' cy='910' r='12' fill='#5483B3' />
            <circle cx='900' cy='620' r='20' fill='#C1E8FF' />
            <circle cx='900' cy='750' r='14' fill='#5483B3' />
            <circle cx='900' cy='880' r='12' fill='#5483B3' />
            <circle cx='900' cy='620' r='36' fill='none' stroke='#C1E8FF' stroke-width='1.5' stroke-dasharray='4 4' />
        '''
    },
    {
        'file': 'coming-soon-02.svg',
        'idx': '02',
        'title': 'ROBOTICS KINEMATICS',
        'subtitle': 'IMU FUSION & MOTOR CONTROL',
        'tag': 'ROBOX CLUB CU // 2026',
        'accent': '#C1E8FF',
        'geom': '''
            <!-- Kinematic Wheel & Telemetry Gauges -->
            <circle cx='600' cy='720' r='220' fill='none' stroke='#5483B3' stroke-width='2' opacity='0.5' />
            <circle cx='600' cy='720' r='180' fill='none' stroke='#C1E8FF' stroke-width='1' stroke-dasharray='6 6' />
            <circle cx='600' cy='720' r='90' fill='#051b38' stroke='#5483B3' stroke-width='3' />
            <circle cx='600' cy='720' r='24' fill='#C1E8FF' />
            <!-- Axis Crosshairs -->
            <line x1='340' y1='720' x2='860' y2='720' stroke='#5483B3' stroke-width='1.5' stroke-dasharray='8 4' opacity='0.7' />
            <line x1='600' y1='460' x2='600' y2='980' stroke='#5483B3' stroke-width='1.5' stroke-dasharray='8 4' opacity='0.7' />
            <!-- Angle Arc -->
            <path d='M 740 720 A 140 140 0 0 0 699 621' fill='none' stroke='#C1E8FF' stroke-width='3' />
            <text x='755' y='645' font-family='monospace' font-size='22' fill='#C1E8FF'>θ = 44.8°</text>
        '''
    },
    {
        'file': 'coming-soon-03.svg',
        'idx': '03',
        'title': 'EVENT ENCLAVE CU',
        'subtitle': 'LIVE PRODUCTION & STAGE OS',
        'tag': 'DACA // CHANDIGARH UNIVERSITY',
        'accent': '#5483B3',
        'geom': '''
            <!-- Stage Grid & Waveforms -->
            <g stroke='#5483B3' stroke-width='1.5' opacity='0.3'>
                <line x1='200' y1='850' x2='600' y2='550' />
                <line x1='600' y1='550' x2='1000' y2='850' />
                <line x1='300' y1='850' x2='600' y2='620' />
                <line x1='600' y1='620' x2='900' y2='850' />
            </g>
            <!-- Audio Console Wave Meters -->
            <rect x='340' y='680' width='30' height='140' rx='4' fill='#5483B3' opacity='0.6' />
            <rect x='400' y='620' width='30' height='200' rx='4' fill='#5483B3' opacity='0.8' />
            <rect x='460' y='560' width='30' height='260' rx='4' fill='#C1E8FF' />
            <rect x='520' y='640' width='30' height='180' rx='4' fill='#5483B3' opacity='0.7' />
            <rect x='580' y='510' width='30' height='310' rx='4' fill='#C1E8FF' />
            <rect x='640' y='590' width='30' height='230' rx='4' fill='#5483B3' opacity='0.9' />
            <rect x='700' y='660' width='30' height='160' rx='4' fill='#5483B3' opacity='0.6' />
            <rect x='760' y='710' width='30' height='110' rx='4' fill='#5483B3' opacity='0.4' />
            <rect x='820' y='740' width='30' height='80' rx='4' fill='#5483B3' opacity='0.3' />
            <text x='580' y='480' font-family='monospace' font-size='22' fill='#C1E8FF' text-anchor='middle'>PEAK 0.0 dB // DACA CU</text>
        '''
    },
    {
        'file': 'coming-soon-04.svg',
        'idx': '04',
        'title': 'FULLSTACK PLATFORM',
        'subtitle': 'DISTRIBUTED REALTIME TELEMETRY',
        'tag': 'CCUHACKS // HACKATHON CORE',
        'accent': '#C1E8FF',
        'geom': '''
            <!-- Distributed Mesh Topology -->
            <rect x='280' y='560' width='200' height='120' rx='8' fill='#051b38' stroke='#5483B3' stroke-width='2' />
            <text x='380' y='625' font-family='monospace' font-size='20' fill='#C1E8FF' text-anchor='middle'>INGEST NODE</text>
            <rect x='720' y='560' width='200' height='120' rx='8' fill='#051b38' stroke='#5483B3' stroke-width='2' />
            <text x='820' y='625' font-family='monospace' font-size='20' fill='#C1E8FF' text-anchor='middle'>EVAL CORE</text>
            <rect x='500' y='760' width='200' height='120' rx='8' fill='#051b38' stroke='#C1E8FF' stroke-width='2.5' />
            <text x='600' y='825' font-family='monospace' font-size='20' fill='#FFFFFF' text-anchor='middle'>REALTIME SYNC</text>
            <path d='M 380 680 L 500 790 M 820 680 L 700 790 M 480 620 L 720 620' stroke='#C1E8FF' stroke-width='2' stroke-dasharray='6 6' />
        '''
    },
    {
        'file': 'coming-soon-05.svg',
        'idx': '05',
        'title': 'ADAPTIVE LEARNING',
        'subtitle': 'SOCRATIC KNOWLEDGE ENGINE',
        'tag': 'IMPACTED // FOUNDATION',
        'accent': '#5483B3',
        'geom': '''
            <!-- Golden Ratio Spiral & Taxonomy -->
            <path d='M 600 720 A 60 60 0 0 1 660 780 A 120 120 0 0 1 540 900 A 240 240 0 0 1 300 660 A 420 420 0 0 1 720 240' fill='none' stroke='#5483B3' stroke-width='2.5' opacity='0.8' />
            <circle cx='600' cy='720' r='8' fill='#C1E8FF' />
            <circle cx='660' cy='780' r='10' fill='#5483B3' />
            <circle cx='540' cy='900' r='14' fill='#C1E8FF' />
            <circle cx='300' cy='660' r='18' fill='#5483B3' />
            <circle cx='720' cy='240' r='24' fill='#C1E8FF' />
        '''
    },
    {
        'file': 'coming-soon-06.svg',
        'idx': '06',
        'title': 'GLSL MOTION LABS',
        'subtitle': '120FPS REFRACTION & OPTICS',
        'tag': 'SHADERS & DISPERSION // 2026',
        'accent': '#C1E8FF',
        'geom': '''
            <!-- Sinusoidal Waves & Optics -->
            <path d='M 180 640 Q 380 500 600 640 T 1020 640' fill='none' stroke='#5483B3' stroke-width='3' opacity='0.6' />
            <path d='M 180 720 Q 380 580 600 720 T 1020 720' fill='none' stroke='#C1E8FF' stroke-width='3.5' />
            <path d='M 180 800 Q 380 660 600 800 T 1020 800' fill='none' stroke='#5483B3' stroke-width='2' opacity='0.4' />
            <circle cx='600' cy='720' r='120' fill='none' stroke='#C1E8FF' stroke-width='1.5' stroke-dasharray='4 8' />
            <circle cx='600' cy='720' r='8' fill='#FFFFFF' />
        '''
    }
]

for card in cards:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bgGrad_{card['idx']}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#021024" />
      <stop offset="50%" stop-color="#051b38" />
      <stop offset="100%" stop-color="#021024" />
    </linearGradient>
    <pattern id="gridPattern_{card['idx']}" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0a284e" stroke-width="1" opacity="0.45" />
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="1500" fill="url(#bgGrad_{card['idx']})" />
  <rect width="1200" height="1500" fill="url(#gridPattern_{card['idx']})" />

  <!-- Outer Swiss Hairline Border -->
  <rect x="60" y="60" width="1080" height="1380" fill="none" stroke="#5483B3" stroke-width="1.5" opacity="0.35" />

  <!-- Header Metadata -->
  <g font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
    <text x="100" y="130" font-family="monospace" font-size="20" fill="#5483B3" letter-spacing="3">[ {card['idx']} // 06 ]</text>
    <text x="1100" y="130" font-family="monospace" font-size="18" fill="#C1E8FF" text-anchor="end" letter-spacing="3">STATUS: COMING SOON</text>
    <line x1="100" y1="160" x2="1100" y2="160" stroke="#5483B3" stroke-width="1" opacity="0.25" />

    <!-- Big Bold Display Typography -->
    <text x="100" y="270" font-size="78" font-weight="800" fill="#FFFFFF" letter-spacing="-2">COMING SOON</text>
    <text x="100" y="340" font-size="32" font-weight="600" fill="#C1E8FF" letter-spacing="-0.5">{card['title']}</text>
    <text x="100" y="380" font-family="monospace" font-size="19" fill="#5483B3" letter-spacing="1">{card['subtitle']}</text>
  </g>

  <!-- Dynamic Geometry Graphic -->
  {card['geom']}

  <!-- Bottom Metadata Section -->
  <g font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
    <line x1="100" y1="1320" x2="1100" y2="1320" stroke="#5483B3" stroke-width="1" opacity="0.25" />
    <text x="100" y="1365" font-family="monospace" font-size="18" fill="#5483B3" letter-spacing="2">PROJECT // {card['tag']}</text>
    <text x="1100" y="1365" font-family="monospace" font-size="18" fill="#C1E8FF" text-anchor="end" letter-spacing="2">HITEN PANDA // 2026</text>
    <text x="100" y="1405" font-family="monospace" font-size="16" fill="#5483B3" opacity="0.7">LAT: 30.7333° N, 76.7794° E // PRODUCTION ARCHIVE</text>
  </g>
</svg>'''
    filepath = f'public/media/work/{card["file"]}'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg.strip())
    print(f'Wrote {filepath}')
