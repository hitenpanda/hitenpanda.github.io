import os

os.makedirs("public/media/insights", exist_ok=True)

# 1. Official Vector Paths
FORBES_PATH = 'M113.3 18.2c0-5.8.1-11.2.4-16.2L98.4 4.9v1.4l1.5.2c1.1.1 1.8.5 2.2 1.1.4.7.7 1.7.9 3.2.2 2.9.4 9.5.3 19.9 0 10.3-.1 16.8-.3 19.3 5.5 1.2 9.8 1.7 13 1.7 6 0 10.7-1.7 14.1-5.2 3.4-3.4 5.2-8.2 5.2-14.1 0-4.7-1.3-8.6-3.9-11.7-2.6-3.1-5.9-4.6-9.8-4.6-2.6 0-5.3.7-8.3 2.1zm.3 30.8c-.2-3.2-.4-12.8-.4-28.5.9-.3 2.1-.5 3.6-.5 2.4 0 4.3 1.2 5.7 3.7 1.4 2.5 2.1 5.5 2.1 9.3 0 4.7-.8 8.5-2.4 11.7-1.6 3.1-3.6 4.7-6.1 4.7-.8-.2-1.6-.3-2.5-.4zM41 3H1v2l2.1.2c1.6.3 2.7.9 3.4 1.8.7 1 1.1 2.6 1.2 4.8.8 10.8.8 20.9 0 30.2-.2 2.2-.6 3.8-1.2 4.8-.7 1-1.8 1.6-3.4 1.8l-2.1.3v2h25.8v-2l-2.7-.2a4.9 4.9 0 0 1-3.4-1.8c-.7-1-1.1-2.6-1.2-4.8-.3-4-.5-8.6-.5-13.7l5.4.1c2.9.1 4.9 2.3 5.9 6.7h2V18.9h-2c-1 4.3-2.9 6.5-5.9 6.6l-5.4.1c0-9 .2-15.4.5-19.3h7.9c5.6 0 9.4 3.6 11.6 10.8l2.4-.7L41 3zm-4.7 30.8c0 5.2 1.5 9.5 4.4 12.9 2.9 3.4 7.2 5 12.6 5s9.8-1.7 13-5.2c3.2-3.4 4.7-7.7 4.7-12.9s-1.5-9.5-4.4-12.9c-2.9-3.4-7.2-5-12.6-5s-9.8 1.7-13 5.2c-3.2 3.4-4.7 7.7-4.7 12.9zm22.3-11.4c1.2 2.9 1.7 6.7 1.7 11.3 0 10.6-2.2 15.8-6.5 15.8-2.2 0-3.9-1.5-5.1-4.5-1.2-3-1.7-6.8-1.7-11.3C47 23.2 49.2 18 53.5 18c2.2-.1 3.9 1.4 5.1 4.4zm84.5 24.3c3.3 3.3 7.5 5 12.5 5 3.1 0 5.8-.6 8.2-1.9 2.4-1.2 4.3-2.7 5.6-4.5l-1-1.2c-2.2 1.7-4.7 2.5-7.6 2.5-4 0-7.1-1.3-9.2-4-2.2-2.7-3.2-6.1-3-10.5H170c0-4.8-1.2-8.7-3.7-11.8-2.5-3-6-4.5-10.5-4.5-5.6 0-9.9 1.8-13 5.3-3.1 3.5-4.6 7.8-4.6 12.9 0 5.2 1.6 9.4 4.9 12.7zm7.4-25.1c1.1-2.4 2.5-3.6 4.4-3.6 3 0 4.5 3.8 4.5 11.5l-10.6.2c.1-3 .6-5.7 1.7-8.1zm46.4-4c-2.7-1.2-6.1-1.9-10.2-1.9-4.2 0-7.5 1.1-10 3.2s-3.8 4.7-3.8 7.8c0 2.7.8 4.8 2.3 6.3 1.5 1.5 3.9 2.8 7 3.9 2.8 1 4.8 2 5.8 2.9 1 1 1.6 2.1 1.6 3.6 0 1.4-.5 2.7-1.6 3.7-1 1.1-2.4 1.6-4.2 1.6-4.4 0-7.7-3.2-10-9.6l-1.7.5.4 10c3.6 1.4 7.6 2.1 12 2.1 4.6 0 8.1-1 10.7-3.1 2.6-2 3.9-4.9 3.9-8.5 0-2.4-.6-4.4-1.9-5.9-1.3-1.5-3.4-2.8-6.4-4-3.3-1.2-5.6-2.3-6.8-3.3-1.2-1-1.8-2.2-1.8-3.7s.4-2.7 1.3-3.7 2-1.4 3.4-1.4c4 0 6.9 2.9 8.7 8.6l1.7-.5-.4-8.6zm-96.2-.9c-1.4-.7-2.9-1-4.6-1-1.7 0-3.4.7-5.3 2.1-1.9 1.4-3.3 3.3-4.4 5.9l.1-8-15.2 3v1.4l1.5.1c1.9.2 3 1.7 3.2 4.4.6 6.2.6 12.8 0 19.8-.2 2.7-1.3 4.1-3.2 4.4l-1.5.2v1.9h21.2V49l-2.7-.2c-1.9-.2-3-1.7-3.2-4.4-.6-5.8-.7-12-.2-18.4.6-1 1.9-1.6 3.9-1.8 2-.2 4.3.4 6.7 1.8l3.7-9.3z'
X_PATH = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'
GITHUB_PATH = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
SUBSTACK_PATH = 'M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z'

# Poster 1: Forbes Tech - Autonomous AI Systems
poster1 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021024"/>
      <stop offset="50%" stop-color="#041838"/>
      <stop offset="100%" stop-color="#08254f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#5483B3" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#021024" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="1500" fill="url(#bg1)"/>
  <rect width="1200" height="1500" fill="url(#glow1)"/>

  <!-- Architectural Grid Hairlines -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#5483B3" stroke-opacity="0.25" stroke-width="1"/>
  <line x1="80" y1="260" x2="1120" y2="260" stroke="#5483B3" stroke-opacity="0.25" stroke-width="1"/>
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#5483B3" stroke-opacity="0.25" stroke-width="1"/>
  <line x1="80" y1="80" x2="80" y2="1380" stroke="#5483B3" stroke-opacity="0.25" stroke-width="1"/>
  <line x1="1120" y1="80" x2="1120" y2="1380" stroke="#5483B3" stroke-opacity="0.25" stroke-width="1"/>

  <!-- Top Header with Official Forbes Vector Logo -->
  <g transform="translate(120, 130)">
    <g transform="scale(1.2)">
      <path d="{FORBES_PATH}" fill="#FFFFFF"/>
    </g>
    <text x="320" y="38" fill="#5483B3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" letter-spacing="3">TECH COUNCIL // ANALYSIS</text>
    <text x="960" y="38" text-anchor="end" fill="#C1E8FF" font-family="'Geist Mono', Menlo, Monaco, monospace" font-size="16" letter-spacing="2">VOL. 26 • N° 01</text>
  </g>

  <!-- Giant Swiss Display Typography -->
  <g transform="translate(120, 480)">
    <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="18" letter-spacing="5" font-weight="500">SYSTEMS ARCHITECTURE</text>
    <text x="0" y="110" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="108" font-weight="800" letter-spacing="-3">Autonomous</text>
    <text x="0" y="215" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="108" font-weight="800" letter-spacing="-3">AI Agents</text>
    <text x="0" y="315" fill="#C1E8FF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="44" font-weight="300" letter-spacing="-1">Deterministic Tools &amp; Foundation Systems</text>
  </g>

  <!-- Editorial System Schematic Graphic (Minimalist, Precise, Non-AI) -->
  <g transform="translate(120, 920)">
    <rect x="0" y="0" width="960" height="280" rx="16" fill="#021024" fill-opacity="0.6" stroke="#5483B3" stroke-opacity="0.3" stroke-width="1"/>
    
    <!-- Coordinate markers -->
    <text x="40" y="50" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="14" letter-spacing="2">01 // HARNESS SPECIFICATION</text>
    <text x="40" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="500">Closed-Loop Intent Verification vs Probabilistic Generation</text>
    <line x1="40" y1="120" x2="920" y2="120" stroke="#5483B3" stroke-opacity="0.15" stroke-width="1"/>

    <!-- Architectural metrics columns -->
    <g transform="translate(40, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">REASONING CORE</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">MIRA Foundation</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Sub-second dispatch</text>
    </g>

    <g transform="translate(360, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">TOOL DETERMINISM</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Sandbox Boundary</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Self-correcting loop</text>
    </g>

    <g transform="translate(680, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">SYSTEM STATUS</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Production Ready</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Realtime Telemetry</text>
    </g>
  </g>

  <!-- Bottom Colophon -->
  <g transform="translate(120, 1340)">
    <text x="0" y="0" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">HITEN PANDA // MIRA AI ARCHITECTURE</text>
    <text x="960" y="0" text-anchor="end" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">PUBLISHED VIA FORBES TECH</text>
  </g>
</svg>'''

# Poster 2: GitHub Trending - Open Source Robotics & Embodied AI
poster2 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e17"/>
      <stop offset="50%" stop-color="#0d1424"/>
      <stop offset="100%" stop-color="#060911"/>
    </linearGradient>
    <radialGradient id="glow2" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#5483B3" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0a0e17" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="url(#bg2)"/>
  <rect width="1200" height="1500" fill="url(#glow2)"/>

  <!-- Hairline framing -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="260" x2="1120" y2="260" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="80" x2="80" y2="1380" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="1120" y1="80" x2="1120" y2="1380" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Top Header with Official GitHub Vector Logo -->
  <g transform="translate(120, 140)">
    <g transform="scale(3)">
      <path d="{GITHUB_PATH}" fill="#FFFFFF"/>
    </g>
    <text x="100" y="46" fill="#5483B3" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" letter-spacing="3">TRENDING REPOSITORIES // ROBOTICS</text>
    <text x="960" y="46" text-anchor="end" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="16">huggingface/lerobot</text>
  </g>

  <!-- Typography -->
  <g transform="translate(120, 480)">
    <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="18" letter-spacing="5" font-weight="500">HARDWARE &amp; KINEMATICS</text>
    <text x="0" y="110" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Embodied AI</text>
    <text x="0" y="215" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">&amp; Robotics</text>
    <text x="0" y="315" fill="#C1E8FF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="44" font-weight="300" letter-spacing="-1">From Policy Weights to Microcontroller PWM</text>
  </g>

  <!-- Technical Schematic -->
  <g transform="translate(120, 920)">
    <rect x="0" y="0" width="960" height="280" rx="16" fill="#090d16" fill-opacity="0.8" stroke="#5483B3" stroke-opacity="0.3" stroke-width="1"/>
    
    <text x="40" y="50" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="14" letter-spacing="2">02 // LOW-LATENCY EMBEDDED CONTROL</text>
    <text x="40" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="500">Imitation Learning, Sensor Fusion &amp; Kinematics</text>
    <line x1="40" y1="120" x2="920" y2="120" stroke="#5483B3" stroke-opacity="0.15" stroke-width="1"/>

    <g transform="translate(40, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">CONTROL LOOP</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">1000 Hz RTOS</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Serial UART Telemetry</text>
    </g>

    <g transform="translate(360, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">NEURAL POLICY</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">LeRobot v0.4</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Diffusion Policy ACT</text>
    </g>

    <g transform="translate(680, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">HARDWARE STACK</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">RoboX Club CU</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Core Team Member</text>
    </g>
  </g>

  <!-- Bottom Colophon -->
  <g transform="translate(120, 1340)">
    <text x="0" y="0" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">HITEN PANDA // ROBOX HARDWARE INITIATIVE</text>
    <text x="960" y="0" text-anchor="end" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">GITHUB OPEN SOURCE INDEX</text>
  </g>
</svg>'''

# Poster 3: Substack - AI Hardware Architectures & Silicon Bottlenecks
poster3 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0e17"/>
      <stop offset="50%" stop-color="#161524"/>
      <stop offset="100%" stop-color="#0a0812"/>
    </linearGradient>
    <radialGradient id="glow3" cx="70%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#ff6719" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0f0e17" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="url(#bg3)"/>
  <rect width="1200" height="1500" fill="url(#glow3)"/>

  <!-- Framing -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#ff6719" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="260" x2="1120" y2="260" stroke="#ff6719" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#ff6719" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="80" x2="80" y2="1380" stroke="#ff6719" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="1120" y1="80" x2="1120" y2="1380" stroke="#ff6719" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Top Header with Official Substack Vector Logo -->
  <g transform="translate(120, 140)">
    <g transform="scale(3)">
      <path d="{SUBSTACK_PATH}" fill="#FF6719"/>
    </g>
    <text x="100" y="46" fill="#FF8D4D" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" letter-spacing="3">SEMIANALYSIS // DEEP RESEARCH</text>
    <text x="960" y="46" text-anchor="end" fill="#FFFFFF" font-family="'Geist Mono', monospace" font-size="16">substack.com/semianalysis</text>
  </g>

  <!-- Typography -->
  <g transform="translate(120, 480)">
    <text x="0" y="0" fill="#FF8D4D" font-family="'Geist Mono', monospace" font-size="18" letter-spacing="5" font-weight="500">HARDWARE INFRASTRUCTURE</text>
    <text x="0" y="110" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Silicon</text>
    <text x="0" y="215" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Bottlenecks</text>
    <text x="0" y="315" fill="#FFE2D1" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="44" font-weight="300" letter-spacing="-1">Memory Bandwidth, Interconnects &amp; Edge Compute</text>
  </g>

  <!-- Technical Schematic -->
  <g transform="translate(120, 920)">
    <rect x="0" y="0" width="960" height="280" rx="16" fill="#141320" fill-opacity="0.85" stroke="#ff6719" stroke-opacity="0.3" stroke-width="1"/>
    
    <text x="40" y="50" fill="#FF8D4D" font-family="'Geist Mono', monospace" font-size="14" letter-spacing="2">03 // PHYSICAL COMPUTE CONSTRAINTS</text>
    <text x="40" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="500">HBM3e / LPDDR5X Transfer Ceilings vs FLOP Utilization</text>
    <line x1="40" y1="120" x2="920" y2="120" stroke="#ff6719" stroke-opacity="0.15" stroke-width="1"/>

    <g transform="translate(40, 160)">
      <text x="0" y="0" fill="#FF8D4D" font-family="'Geist Mono', monospace" font-size="13">MEMORY HIERARCHY</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">9.6 Gbps HBM3e</text>
      <text x="0" y="60" fill="#FFE2D1" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Sub-nanosecond SRAM</text>
    </g>

    <g transform="translate(360, 160)">
      <text x="0" y="0" fill="#FF8D4D" font-family="'Geist Mono', monospace" font-size="13">QUANTIZATION</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">INT4 / FP8 GEMM</text>
      <text x="0" y="60" fill="#FFE2D1" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Near-Zero Loss Perplexity</text>
    </g>

    <g transform="translate(680, 160)">
      <text x="0" y="0" fill="#FF8D4D" font-family="'Geist Mono', monospace" font-size="13">SYSTEM IMPACT</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Local Edge NPU</text>
      <text x="0" y="60" fill="#FFE2D1" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">True Autonomy</text>
    </g>
  </g>

  <!-- Bottom Colophon -->
  <g transform="translate(120, 1340)">
    <text x="0" y="0" fill="#FFE2D1" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">HITEN PANDA // SILICON INFRASTRUCTURE</text>
    <text x="960" y="0" text-anchor="end" fill="#FF8D4D" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">SUBSTACK CURATED DISPATCH</text>
  </g>
</svg>'''

# Poster 4: X (Twitter) - Autonomous Software Paradigms
poster4 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020408"/>
      <stop offset="50%" stop-color="#050a14"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <radialGradient id="glow4" cx="30%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="url(#bg4)"/>
  <rect width="1200" height="1500" fill="url(#glow4)"/>

  <!-- Framing -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="80" y1="260" x2="1120" y2="260" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="80" y1="80" x2="80" y2="1380" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="1120" y1="80" x2="1120" y2="1380" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>

  <!-- Top Header with Official X Vector Logo -->
  <g transform="translate(120, 140)">
    <g transform="scale(3)">
      <path d="{X_PATH}" fill="#FFFFFF"/>
    </g>
    <text x="100" y="46" fill="#888888" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" letter-spacing="3">AI ARCHITECTURE // CURATED ESSAY</text>
    <text x="960" y="46" text-anchor="end" fill="#FFFFFF" font-family="'Geist Mono', monospace" font-size="16">x.com/karpathy</text>
  </g>

  <!-- Typography -->
  <g transform="translate(120, 480)">
    <text x="0" y="0" fill="#888888" font-family="'Geist Mono', monospace" font-size="18" letter-spacing="5" font-weight="500">SOFTWARE 3.0</text>
    <text x="0" y="110" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Autonomous</text>
    <text x="0" y="215" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Software</text>
    <text x="0" y="315" fill="#CCCCCC" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="44" font-weight="300" letter-spacing="-1">Agents as Runtime &amp; Self-Optimizing Loops</text>
  </g>

  <!-- Thought Piece Callout Card -->
  <g transform="translate(120, 920)">
    <rect x="0" y="0" width="960" height="280" rx="16" fill="#080c14" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>
    
    <text x="40" y="50" fill="#888888" font-family="'Geist Mono', monospace" font-size="14" letter-spacing="2">04 // PARADIGM SHIFT</text>
    <text x="40" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="500">“Code is becoming the artifact; intent is the source code.”</text>
    <line x1="40" y1="120" x2="920" y2="120" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1"/>

    <g transform="translate(40, 160)">
      <text x="0" y="0" fill="#888888" font-family="'Geist Mono', monospace" font-size="13">PARADIGM 1.0</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Explicit Code</text>
      <text x="0" y="60" fill="#AAAAAA" font-family="'Geist Mono', monospace" font-size="14">C / C++ / Python</text>
    </g>

    <g transform="translate(360, 160)">
      <text x="0" y="0" fill="#888888" font-family="'Geist Mono', monospace" font-size="13">PARADIGM 2.0</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Weights &amp; Tensors</text>
      <text x="0" y="60" fill="#AAAAAA" font-family="'Geist Mono', monospace" font-size="14">PyTorch / Neural Nets</text>
    </g>

    <g transform="translate(680, 160)">
      <text x="0" y="0" fill="#888888" font-family="'Geist Mono', monospace" font-size="13">PARADIGM 3.0</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Autonomous Agents</text>
      <text x="0" y="60" fill="#AAAAAA" font-family="'Geist Mono', monospace" font-size="14">Self-Correcting Loops</text>
    </g>
  </g>

  <!-- Bottom Colophon -->
  <g transform="translate(120, 1340)">
    <text x="0" y="0" fill="#CCCCCC" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">HITEN PANDA // AGENTIC SYSTEMS ANALYSIS</text>
    <text x="960" y="0" text-anchor="end" fill="#888888" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">OFFICIAL X VERIFIED POST</text>
  </g>
</svg>'''

# Poster 5: Substack - Scaling AI Education (impactEd)
poster5 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021528"/>
      <stop offset="50%" stop-color="#062b4f"/>
      <stop offset="100%" stop-color="#021024"/>
    </linearGradient>
    <radialGradient id="glow5" cx="60%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#C1E8FF" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#021528" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="url(#bg5)"/>
  <rect width="1200" height="1500" fill="url(#glow5)"/>

  <!-- Framing -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#C1E8FF" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="260" x2="1120" y2="260" stroke="#C1E8FF" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#C1E8FF" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="80" x2="80" y2="1380" stroke="#C1E8FF" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="1120" y1="80" x2="1120" y2="1380" stroke="#C1E8FF" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Top Header with Official Substack Vector Logo -->
  <g transform="translate(120, 140)">
    <g transform="scale(3)">
      <path d="{SUBSTACK_PATH}" fill="#FF6719"/>
    </g>
    <text x="100" y="46" fill="#C1E8FF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" letter-spacing="3">THE SEQUENCE // IMPACTED SPECIAL</text>
    <text x="960" y="46" text-anchor="end" fill="#FFFFFF" font-family="'Geist Mono', monospace" font-size="16">thesequence.substack.com</text>
  </g>

  <!-- Typography -->
  <g transform="translate(120, 480)">
    <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="18" letter-spacing="5" font-weight="500">ADAPTIVE PEDAGOGY</text>
    <text x="0" y="110" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Adaptive AI</text>
    <text x="0" y="215" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Education</text>
    <text x="0" y="315" fill="#C1E8FF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="44" font-weight="300" letter-spacing="-1">Scaling Socratic Dialogue to Underserved Communities</text>
  </g>

  <!-- Impact Metrics Schematic -->
  <g transform="translate(120, 920)">
    <rect x="0" y="0" width="960" height="280" rx="16" fill="#031a33" fill-opacity="0.8" stroke="#5483B3" stroke-opacity="0.3" stroke-width="1"/>
    
    <text x="40" y="50" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="14" letter-spacing="2">05 // COMMUNITY REASONING ENGINE</text>
    <text x="40" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="500">Deconstructing Advanced Concepts into Interactive Explorations</text>
    <line x1="40" y1="120" x2="920" y2="120" stroke="#5483B3" stroke-opacity="0.15" stroke-width="1"/>

    <g transform="translate(40, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">ORGANIZATION</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">impactEd</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Co-Founder</text>
    </g>

    <g transform="translate(360, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">METHODOLOGY</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Socratic Flow</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Dynamic Diagnostic Trees</text>
    </g>

    <g transform="translate(680, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">STUDENT REACH</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Open Access</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Equitable Tech Literacy</text>
    </g>
  </g>

  <!-- Bottom Colophon -->
  <g transform="translate(120, 1340)">
    <text x="0" y="0" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">HITEN PANDA // IMPACTED INITIATIVE</text>
    <text x="960" y="0" text-anchor="end" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">FEATURED ON SUBSTACK</text>
  </g>
</svg>'''

# Poster 6: X (Twitter) - The Hackathon Playbook (ccuhacks)
poster6 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020917"/>
      <stop offset="50%" stop-color="#061c40"/>
      <stop offset="100%" stop-color="#030b1c"/>
    </linearGradient>
    <radialGradient id="glow6" cx="80%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#5483B3" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020917" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="url(#bg6)"/>
  <rect width="1200" height="1500" fill="url(#glow6)"/>

  <!-- Framing -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="260" x2="1120" y2="260" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="80" y1="80" x2="80" y2="1380" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="1120" y1="80" x2="1120" y2="1380" stroke="#5483B3" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Top Header with Official X Vector Logo -->
  <g transform="translate(120, 140)">
    <g transform="scale(3)">
      <path d="{X_PATH}" fill="#FFFFFF"/>
    </g>
    <text x="100" y="46" fill="#5483B3" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" letter-spacing="3">CCUHACKS // ORGANIZER THREAD</text>
    <text x="960" y="46" text-anchor="end" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="16">x.com/ccuhacks</text>
  </g>

  <!-- Typography -->
  <g transform="translate(120, 480)">
    <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="18" letter-spacing="5" font-weight="500">COMMUNITY INFRASTRUCTURE</text>
    <text x="0" y="110" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">The Hackathon</text>
    <text x="0" y="215" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="104" font-weight="800" letter-spacing="-3">Playbook</text>
    <text x="0" y="315" fill="#C1E8FF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="44" font-weight="300" letter-spacing="-1">Scaling Realtime Portals for 1,000+ Engineers</text>
  </g>

  <!-- Metrics Schematic -->
  <g transform="translate(120, 920)">
    <rect x="0" y="0" width="960" height="280" rx="16" fill="#04142e" fill-opacity="0.8" stroke="#5483B3" stroke-opacity="0.3" stroke-width="1"/>
    
    <text x="40" y="50" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="14" letter-spacing="2">06 // DISTRIBUTED EVENT SYSTEMS</text>
    <text x="40" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="500">Live Judging Telemetry &amp; Team Matchmaking Architecture</text>
    <line x1="40" y1="120" x2="920" y2="120" stroke="#5483B3" stroke-opacity="0.15" stroke-width="1"/>

    <g transform="translate(40, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">EVENT SCALE</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">1,000+ Hackers</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">April 2026 Edition</text>
    </g>

    <g transform="translate(360, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">ROLE</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Executive Org</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Platform &amp; Logistics</text>
    </g>

    <g transform="translate(680, 160)">
      <text x="0" y="0" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="13">TELEMETRY</text>
      <text x="0" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Zero Downtime</text>
      <text x="0" y="60" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="14" opacity="0.8">Edge-Deployed Next.js</text>
    </g>
  </g>

  <!-- Bottom Colophon -->
  <g transform="translate(120, 1340)">
    <text x="0" y="0" fill="#C1E8FF" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">HITEN PANDA // CCUHACKS EXECUTIVE</text>
    <text x="960" y="0" text-anchor="end" fill="#5483B3" font-family="'Geist Mono', monospace" font-size="15" letter-spacing="1">POSTED ON X // THREAD #41</text>
  </g>
</svg>'''

files = {
    "public/media/insights/autonomous-ai-systems.svg": poster1,
    "public/media/insights/open-source-robotics.svg": poster2,
    "public/media/insights/ai-hardware-silicon.svg": poster3,
    "public/media/insights/autonomous-software-paradigm.svg": poster4,
    "public/media/insights/impactful-ai-education.svg": poster5,
    "public/media/insights/hackathon-playbook.svg": poster6,
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {path}")

print("All 6 editorial posters generated successfully!")
