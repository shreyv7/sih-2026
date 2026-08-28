import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import * as THREE from "three";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Cpu,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuildingDeepDive } from "@/components/carbon/building-deep-dive";
import { ScrollNav, type ScrollNavSection } from "@/components/carbon/scroll-nav";
import { getBuildingDeepDiveData } from "@/lib/carbon-data";
import { cn } from "@/lib/utils";

interface AB3BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildingId?: string;
}

const sections: ScrollNavSection[] = [
  { id: "section-measurement", label: "Stage 1: Measurement & Solar", shortLabel: "Measurement", badge: "Telemetry" },
  { id: "section-diagnosis", label: "Stage 2: Anomaly Root Cause", shortLabel: "Diagnosis", badge: "Flagged" },
  { id: "section-actions", label: "Stage 3: Action Lab Optimizer", shortLabel: "Action Lab", badge: "Sim" },
  { id: "section-verification", label: "Stage 4: M&V Proof Ledger", shortLabel: "Verification", badge: "Proof" },
  { id: "section-ask", label: "Stage 5: Grounded AI Assistant", shortLabel: "Contextual AI", badge: "AI" },
];

export function AB3BuildingModal({ isOpen, onClose, buildingId = "ab3" }: AB3BuildingModalProps) {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? "section-measurement");
  const [isRotating, setIsRotating] = useState(true);

  const buildingData = useMemo(() => getBuildingDeepDiveData(buildingId), [buildingId]);
  const { specs } = buildingData;

  // Three.js 3D Building Scene Setup
  useEffect(() => {
    if (!isOpen || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.032);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(16, 13, 20);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    dirLight.position.set(20, 30, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x34d399, 3.5, 30);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0xf59e0b, 2.5, 20);
    accentLight.position.set(2, 6, -3);
    scene.add(accentLight);

    // 3. Ground Grid & Holographic Base
    const grid = new THREE.GridHelper(26, 26, 0x38bdf8, 0x1e293b);
    grid.position.y = -0.05;
    scene.add(grid);

    const baseRingGeo = new THREE.RingGeometry(8, 8.4, 64);
    const baseRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.02;
    scene.add(baseRing);

    // 4. Building Hierarchy Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // Materials
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x0f2744,
      roughness: 0.4,
      metalness: 0.6,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.7,
      opacity: 0.85,
      transparent: true,
      roughness: 0.15,
      ior: 1.5,
      metalness: 0.1,
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.8,
    });

    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.2,
      metalness: 0.9,
    });

    const hvacNormalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.5,
      metalness: 0.7,
    });

    const hvacAlertMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });

    // Helper to create glowing extruded blocks
    const createBlock = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      material: THREE.Material,
      withEdges = true
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y + h / 2, z);
      buildingGroup.add(mesh);

      if (withEdges) {
        const edgesGeo = new THREE.EdgesGeometry(geo);
        const edges = new THREE.LineSegments(edgesGeo, edgeMat);
        edges.position.copy(mesh.position);
        buildingGroup.add(edges);
      }
      return mesh;
    };

    let beaconX = 0;
    let beaconY = 6;
    let beaconZ = 0;

    const normId = buildingId.toLowerCase();

    if (normId === "b14" || normId.includes("14")) {
      // ----------------------------------------------------
      // B14: 12-Floor Residential Student Hostel Tower
      // ----------------------------------------------------
      // Main 12-floor central hostel tower
      createBlock(6.5, 9.6, 6.0, 0, 0, 0, concreteMat);

      // 12 Ribbon Window Rows
      for (let floor = 0; floor < 12; floor++) {
        createBlock(6.6, 0.35, 6.1, 0, 0.4 + floor * 0.75, 0, glassMat, false);
      }

      // East & West residential wings
      createBlock(3.5, 7.5, 4.5, -4.5, 0, 0, concreteMat);
      for (let floor = 0; floor < 9; floor++) {
        createBlock(3.6, 0.35, 4.6, -4.5, 0.4 + floor * 0.75, 0, glassMat, false);
      }

      createBlock(3.5, 7.5, 4.5, 4.5, 0, 0, concreteMat);
      for (let floor = 0; floor < 9; floor++) {
        createBlock(3.6, 0.35, 4.6, 4.5, 0.4 + floor * 0.75, 0, glassMat, false);
      }

      // Ground floor reception lobby & entrance canopy
      createBlock(4.0, 1.4, 2.5, 0, 0, 3.8, glassMat);
      createBlock(4.5, 0.2, 3.0, 0, 1.4, 3.8, concreteMat);

      // Rooftop Solar Array (180 kWp - 400 Panels)
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const panel = createBlock(1.1, 0.06, 0.9, -2.1 + c * 1.4, 9.65, -1.8 + r * 1.2, solarMat, false);
          panel.rotation.x = 0.18;
        }
      }

      // Rooftop Geysers & Split AC Banks
      createBlock(1.2, 0.8, 1.2, -4.5, 7.55, 0.5, hvacNormalMat);
      createBlock(1.4, 1.0, 1.4, 4.5, 7.55, 0.5, hvacAlertMat);

      beaconX = 4.5;
      beaconY = 9.2;
      beaconZ = 0.5;
    } else if (normId === "kmc" || normId.includes("library")) {
      // ----------------------------------------------------
      // KMC: 5-Floor Central Health Sciences Library
      // ----------------------------------------------------
      // Main 5-Floor Library Block
      createBlock(10.0, 5.5, 7.5, 0, 0, 0, concreteMat);

      // Glass Reading Hall Perimeter Facade
      for (let floor = 0; floor < 5; floor++) {
        createBlock(10.1, 0.65, 7.6, 0, 0.5 + floor * 1.0, 0, glassMat, false);
      }

      // Central Cylindrical Glass Atrium Rotunda
      const rotundaGeo = new THREE.CylinderGeometry(2.4, 2.4, 6.2, 32);
      const rotunda = new THREE.Mesh(rotundaGeo, glassMat);
      rotunda.position.set(0, 3.1, 0.8);
      buildingGroup.add(rotunda);

      // Rotunda top skylight ring
      const skylightGeo = new THREE.TorusGeometry(2.4, 0.15, 16, 32);
      const skylight = new THREE.Mesh(skylightGeo, concreteMat);
      skylight.rotation.x = Math.PI / 2;
      skylight.position.set(0, 6.2, 0.8);
      buildingGroup.add(skylight);

      // 120 kWp Solar PV Array on North Roof Section
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const panel = createBlock(1.4, 0.08, 1.0, -3.2 + c * 1.6, 5.55, -2.4 + r * 1.2, solarMat, false);
          panel.rotation.x = 0.15;
        }
      }

      // Dual 150 TR Water-Cooled Chillers & Primary Pumps
      createBlock(1.8, 1.2, 1.4, -3.5, 5.55, 1.5, hvacNormalMat);
      createBlock(2.0, 1.4, 1.6, 3.5, 5.55, 1.5, hvacAlertMat);

      beaconX = 3.5;
      beaconY = 7.6;
      beaconZ = 1.5;
    } else {
      // ----------------------------------------------------
      // AB3: 4-Floor Academic Block + Central Chiller
      // ----------------------------------------------------
      createBlock(9, 4.8, 6.5, 0, 0, 0, concreteMat);

      // Glass Facade / Window Ribbons
      createBlock(9.1, 0.7, 6.6, 0, 0.8, 0, glassMat, false);
      createBlock(9.1, 0.7, 6.6, 0, 2.0, 0, glassMat, false);
      createBlock(9.1, 0.7, 6.6, 0, 3.2, 0, glassMat, false);
      createBlock(9.1, 0.7, 6.6, 0, 4.2, 0, glassMat, false);

      // AB3 North Lab Wing
      createBlock(5.5, 3.6, 4.5, 5.2, 0, -0.8, concreteMat);
      createBlock(5.6, 0.6, 4.6, 5.2, 1.2, -0.8, glassMat, false);
      createBlock(5.6, 0.6, 4.6, 5.2, 2.4, -0.8, glassMat, false);

      // AB3 Entrance Atrium & Canopy
      createBlock(3.5, 2.2, 2.5, -0.5, 0, 3.8, glassMat);
      createBlock(4.2, 0.25, 3.2, -0.5, 2.2, 3.8, concreteMat);

      // Rooftop Solar Photovoltaic Array
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const panel = createBlock(1.4, 0.08, 1.1, -3 + col * 1.6, 4.85, -1.8 + row * 1.4, solarMat, false);
          panel.rotation.x = 0.15;
        }
      }

      // Rooftop HVAC & Chiller Units
      createBlock(1.1, 0.9, 1.1, 3.4, 4.85, 1.4, hvacNormalMat);
      createBlock(1.3, 1.1, 1.3, 5.2, 3.65, -0.8, hvacAlertMat);

      beaconX = 5.2;
      beaconY = 5.6;
      beaconZ = -0.8;
    }

    // Floating Anomaly Beacon above flagged equipment
    const beaconGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(beaconX, beaconY, beaconZ);
    buildingGroup.add(beacon);

    // Floating Data Node Particles around Building Twin
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = Math.random() * 10 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.22,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Interaction & Drag
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let autoRotate = true;
    let userTimeout: NodeJS.Timeout | null = null;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      autoRotate = false;
      setIsRotating(false);
      if (userTimeout) clearTimeout(userTimeout);
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;

      buildingGroup.rotation.y += deltaX * 0.008;
      camera.position.y = Math.max(4, Math.min(24, camera.position.y - deltaY * 0.04));
      camera.lookAt(0, 3, 0);
    };

    const onPointerUp = () => {
      isDragging = false;
      if (userTimeout) clearTimeout(userTimeout);
      userTimeout = setTimeout(() => {
        autoRotate = true;
        setIsRotating(true);
      }, 2500);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 6. Render Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      if (autoRotate) {
        buildingGroup.rotation.y += 0.004;
      }

      // Pulsing Anomaly Beacon
      const pulseScale = 1 + Math.sin(elapsed * 4.5) * 0.25;
      beacon.scale.set(pulseScale, pulseScale, pulseScale);
      accentLight.intensity = 2.0 + Math.sin(elapsed * 4.5) * 1.2;

      // Rotating subtle ground ring
      baseRing.rotation.z += 0.002;

      // Floating particles gentle drift
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!canvasContainerRef.current) return;
      const newWidth = canvasContainerRef.current.clientWidth;
      const newHeight = canvasContainerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (userTimeout) clearTimeout(userTimeout);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, buildingId]);

  const scrollToStage = (stageId: string) => {
    setActiveSectionId(stageId);
    const container = scrollContainerRef.current;
    if (!container) return;
    const target = container.querySelector(`#${stageId}`) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-2xl [background-image:radial-gradient(circle_at_50%_0%,rgba(6,25,50,0.5)_0%,rgba(2,6,18,0.95)_100%)] text-white animate-in fade-in duration-300 select-none overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* STICKY TOP HEADER */}
      {/* ========================================================================= */}
      <header className="shrink-0 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-xl z-40">
        {/* Left: Building Title & Coordinates */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <Cpu className="size-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                {specs.name}
              </h2>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                3D Digital Twin
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {specs.campus} · {specs.coordinates} · {specs.type}
            </p>
          </div>
        </div>

        {/* Center: Stage Jump Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToStage(s.id)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                activeSectionId === s.id
                  ? "bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              <span className="text-[10px] opacity-70 font-mono">0{idx + 1}</span>
              <span>{s.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Right: Hardware badge & Close CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hardware-Agnostic Tier 1 + BMS</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-white/20 hover:border-white/30 transition cursor-pointer"
          >
            <X className="size-4" />
            <span>Close View</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN SPLIT: Sticky 3D Model Left + Scrollable Cards Right */}
      {/* ========================================================================= */}
      <div className="relative flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT COLUMN: Pure Clean 3D Building Model */}
          <aside className="lg:col-span-5 xl:col-span-5 h-[340px] lg:h-full flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 bg-slate-950/40 p-2 sm:p-4 backdrop-blur-sm overflow-hidden relative">
            {/* Three.js Interactive Canvas Container */}
            <div className="relative h-full w-full flex items-center justify-center">
              <div
                ref={canvasContainerRef}
                className="h-full w-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
              />
            </div>
          </aside>

          {/* RIGHT COLUMN: Vertically Scrollable Glassmorphism Dashboard Cards */}
          <main
            ref={scrollContainerRef}
            className="lg:col-span-7 xl:col-span-7 h-[calc(100vh-68px-340px)] lg:h-full overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth"
          >
            <div className="max-w-4xl mx-auto">
              <BuildingDeepDive buildingId={buildingId} onJumpToSection={scrollToStage} />
            </div>
          </main>
        </div>

        {/* Floating Right-Side Scroll Stepper (on wide viewports) */}
        <div className="pointer-events-auto fixed right-5 top-28 z-40 hidden 2xl:block">
          <ScrollNav
            sections={sections}
            containerRef={scrollContainerRef}
            activeId={activeSectionId}
            onSelect={setActiveSectionId}
          />
        </div>
      </div>
    </div>
  );
}
