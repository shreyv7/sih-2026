import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Cpu,
  GraduationCap,
  Home,
  Library,
  MapPinned,
  Maximize2,
  Minimize2,
  Minus,
  Orbit,
  Plus,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { AB3BuildingModal } from "@/components/carbon/ab3-building-modal";

const MANIPAL_CENTER: [number, number] = [74.7928, 13.3526];
const AB3_COORDINATES: [number, number] = [74.79309, 13.35126];
const B14_COORDINATES: [number, number] = [74.795507, 13.345226];
const KMC_COORDINATES: [number, number] = [74.78710, 13.35590];

type RegionHotspot = {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
};

const hotspots: RegionHotspot[] = [
  {
    id: "india",
    name: "India",
    description: "National climate and campus growth context",
    coordinates: [78.9629, 22.5937],
    zoom: 4.6,
    pitch: 24,
    bearing: -10,
  },
  {
    id: "manipal",
    name: "MAHE, Manipal",
    description: "View Manipal campus from the top",
    coordinates: MANIPAL_CENTER,
    zoom: 15.6,
    pitch: 0,
    bearing: 0,
  },
  {
    id: "ab3",
    name: "AB3 (Academic Block 3)",
    description: "MIT Manipal · 13.35126° N, 74.79309° E",
    coordinates: AB3_COORDINATES,
    zoom: 17.8,
    pitch: 62,
    bearing: -28,
  },
  {
    id: "b14",
    name: "Hostel Block 14 (B14)",
    description: "MIT Manipal · 13.345226° N, 74.795507° E",
    coordinates: B14_COORDINATES,
    zoom: 17.8,
    pitch: 64,
    bearing: 22,
  },
  {
    id: "kmc",
    name: "KMC Central Library",
    description: "KMC Manipal · 13.35590° N, 74.78710° E",
    coordinates: KMC_COORDINATES,
    zoom: 17.8,
    pitch: 60,
    bearing: -45,
  },
];

type HotspotMarkerEntry = {
  id: string;
  marker: Marker;
  element: HTMLElement;
};

export function ManipalGlobeLanding() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const rotationFrameRef = useRef<number | null>(null);
  const markersRef = useRef<HotspotMarkerEntry[]>([]);
  const beginRotationRef = useRef<() => void>(() => { });
  const focusRegionRef = useRef<(region: RegionHotspot) => void>(() => { });
  const selectedRegionRef = useRef<RegionHotspot | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionHotspot | null>(null);
  const [activeBuildingId, setActiveBuildingId] = useState<string>("ab3");
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const openBuildingTwin = (buildingId: string) => {
    const targetHotspot = hotspots.find((h) => h.id === buildingId);
    if (targetHotspot) {
      focusRegionRef.current(targetHotspot);
    } else {
      setActiveBuildingId(buildingId);
      setIsBuildingModalOpen(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.resize();
        }, 150);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
    }
  }, [isFullscreen]);

  useEffect(() => {
    let cancelled = false;

    const bootMap = async () => {
      if (!containerRef.current || mapRef.current) return;

      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              attribution: "Esri World Imagery",
            },
          },
          layers: [
            {
              id: "osm-layer",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: [64, 18],
        zoom: 1.55,
        pitch: 26,
        bearing: 0,
        attributionControl: false,
      });

      mapRef.current = map;

      let isUserInteracting = false;
      let resumeTimeout: NodeJS.Timeout | null = null;

      const stopRotation = () => {
        if (rotationFrameRef.current !== null) {
          cancelAnimationFrame(rotationFrameRef.current);
          rotationFrameRef.current = null;
        }
      };

      const startRotation = () => {
        stopRotation();
        const rotate = () => {
          if (!mapRef.current || isUserInteracting || selectedRegionRef.current) return;
          const currentCenter = mapRef.current.getCenter();
          const nextLng = (currentCenter.lng + 0.045) % 360;
          mapRef.current.setCenter([nextLng, currentCenter.lat]);
          rotationFrameRef.current = requestAnimationFrame(rotate);
        };
        rotationFrameRef.current = requestAnimationFrame(rotate);
      };

      beginRotationRef.current = startRotation;

      // 3D Orbiting animation around active building
      const startBuildingOrbit = (coords: [number, number]) => {
        stopRotation();

        const orbitLoop = () => {
          if (!mapRef.current || !["ab3", "b14", "kmc"].includes(selectedRegionRef.current?.id || "") || isUserInteracting) return;
          const currentBearing = mapRef.current.getBearing();
          mapRef.current.rotateTo(currentBearing + 0.16, { duration: 0 });
          mapRef.current.setCenter(coords);
          mapRef.current.setPitch(66);
          rotationFrameRef.current = requestAnimationFrame(orbitLoop);
        };

        rotationFrameRef.current = requestAnimationFrame(orbitLoop);
      };

      const onInteractionStart = () => {
        isUserInteracting = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
        stopRotation();
      };

      const onInteractionEnd = () => {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          isUserInteracting = false;
          const curId = selectedRegionRef.current?.id;
          if (curId === "ab3") {
            startBuildingOrbit(AB3_COORDINATES);
          } else if (curId === "b14") {
            startBuildingOrbit(B14_COORDINATES);
          } else if (curId === "kmc") {
            startBuildingOrbit(KMC_COORDINATES);
          } else if (!selectedRegionRef.current) {
            startRotation();
          }
        }, 1500);
      };

      let dragStartX = 0;
      let dragStartY = 0;
      let isDraggingGlobe = false;

      const containerEl = containerRef.current;
      if (containerEl) {
        containerEl.addEventListener("pointerdown", (e) => {
          if ((e.target as HTMLElement)?.closest(".globe-hotspot")) return;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          isDraggingGlobe = true;
          onInteractionStart();
        });

        window.addEventListener("pointermove", (e) => {
          if (!isDraggingGlobe || !mapRef.current) return;
          const dx = e.clientX - dragStartX;
          const dy = e.clientY - dragStartY;
          dragStartX = e.clientX;
          dragStartY = e.clientY;

          const currentBearing = mapRef.current.getBearing();
          const currentPitch = mapRef.current.getPitch();
          mapRef.current.rotateTo(currentBearing - dx * 0.35, { duration: 0 });
          mapRef.current.setPitch(Math.min(75, Math.max(0, currentPitch - dy * 0.2)));
        });

        window.addEventListener("pointerup", () => {
          if (isDraggingGlobe) {
            isDraggingGlobe = false;
            onInteractionEnd();
          }
        });
      }

      const updateMarkers = (currentZoom: number, activeRegionId: string | null) => {
        const isBuildingActive = ["ab3", "b14", "kmc"].includes(activeRegionId || "");
        markersRef.current.forEach(({ id, element }) => {
          if (id === "ab3" || id === "b14" || id === "kmc") {
            const showBuilding = activeRegionId === "manipal" || isBuildingActive || currentZoom >= 13.5;
            element.style.display = showBuilding ? "inline-flex" : "none";
          } else if (id === "manipal") {
            const isZoomedIn = activeRegionId === "manipal" || isBuildingActive || currentZoom >= 12.5;
            element.style.display = isZoomedIn ? "none" : "inline-flex";
          } else if (id === "india") {
            element.style.display = currentZoom >= 8 ? "none" : "inline-flex";
          }
        });
      };

      const focusRegion = (region: RegionHotspot) => {
        selectedRegionRef.current = region;
        setSelectedRegion(region);
        stopRotation();

        map.flyTo({
          center: region.coordinates,
          zoom: region.zoom,
          pitch: region.pitch,
          bearing: region.bearing,
          duration: 3200,
          curve: 1.45,
          essential: true,
        });

        updateMarkers(region.zoom, region.id);

        if (region.id === "ab3" || region.id === "b14" || region.id === "kmc") {
          setActiveBuildingId(region.id);
          map.once("moveend", () => {
            if (selectedRegionRef.current?.id === region.id) {
              startBuildingOrbit(region.coordinates);
              setIsBuildingModalOpen(true);
            }
          });
          setTimeout(() => {
            if (selectedRegionRef.current?.id === region.id) {
              setIsBuildingModalOpen(true);
            }
          }, 1100);
        }
      };

      focusRegionRef.current = focusRegion;

      map.on("load", () => {
        try {
          map.setProjection({ type: "globe" });
          (map as any).setFog?.({
            color: "rgba(7, 16, 28, 0.85)",
            "high-color": "rgba(10, 27, 46, 0.6)",
            "space-color": "rgba(2, 6, 18, 1)",
            "horizon-blend": 0.14,
            "star-intensity": 0.35,
          });
        } catch {
          // Fallback if environment doesn't support fog
        }

        markersRef.current = hotspots.map((region) => {
          const element = document.createElement("button");
          element.type = "button";
          const isBuilding = ["ab3", "b14", "kmc"].includes(region.id);
          element.className = `globe-hotspot ${isBuilding ? "globe-hotspot--target" : ""}`;
          
          if (isBuilding) {
            element.style.display = "none";
          }
          element.innerHTML = `
            <span class="globe-hotspot__pulse"></span>
            <span class="globe-hotspot__label">
              <strong>${region.name}</strong>
            </span>
          `;
          element.addEventListener("click", () => focusRegion(region));

          const marker = new maplibregl.Marker({ element, anchor: "center" })
            .setLngLat(region.coordinates)
            .addTo(map);

          return { id: region.id, marker, element };
        });

        map.on("zoom", () => {
          updateMarkers(map.getZoom(), selectedRegionRef.current?.id || null);
        });

        setMapReady(true);
        startRotation();
      });
    };

    bootMap();

    return () => {
      cancelled = true;
      if (rotationFrameRef.current !== null) {
        cancelAnimationFrame(rotationFrameRef.current);
      }
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const resetExperience = () => {
    selectedRegionRef.current = null;
    setSelectedRegion(null);
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: [64, 18],
      zoom: 1.55,
      pitch: 26,
      bearing: 0,
      duration: 2600,
      essential: true,
    });

    markersRef.current.forEach(({ id, element }) => {
      if (id === "ab3" || id === "b14" || id === "kmc") element.style.display = "none";
      if (id === "manipal" || id === "india") element.style.display = "inline-flex";
    });

    map.once("moveend", () => beginRotationRef.current());
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#020612] text-white select-none">
      {/* Universal Space & Cosmic Nebula Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(255,225,160,0.22),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(255,180,90,0.12),transparent_40%),radial-gradient(circle_at_20%_45%,rgba(35,85,155,0.16),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(12,30,65,0.3),transparent_60%),linear-gradient(180deg,#030917_0%,#020612_55%,#01040a_100%)]" />

      {/* Universal Starfield Layer 1 */}
      <div className="pointer-events-none absolute inset-0 opacity-85 [background-image:radial-gradient(2px_2px_at_25px_35px,#fff,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_65px_120px,#93c5fd,rgba(0,0,0,0)),radial-gradient(1px_1px_at_140px_60px,#fff,rgba(0,0,0,0)),radial-gradient(2px_2px_at_200px_160px,#fde047,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_280px_90px,#fff,rgba(0,0,0,0)),radial-gradient(2px_2px_at_340px_220px,#a7f3d0,rgba(0,0,0,0)),radial-gradient(1px_1px_at_410px_140px,#fff,rgba(0,0,0,0)),radial-gradient(2.5px_2.5px_at_490px_50px,#ffffff,rgba(0,0,0,0))] [background-repeat:repeat] [background-size:520px_520px]" />

      {/* Universal Starfield Layer 2 */}
      <div className="pointer-events-none absolute inset-0 opacity-65 [background-image:radial-gradient(1.5px_1.5px_at_80px_230px,#fff,rgba(0,0,0,0)),radial-gradient(2px_2px_at_170px_310px,#38bdf8,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_380px,#fff,rgba(0,0,0,0)),radial-gradient(2px_2px_at_360px_270px,#fed7aa,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_440px_390px,#fff,rgba(0,0,0,0))] [background-repeat:repeat] [background-size:580px_580px]" />

      {/* Glowing Celestial Sun Flare in Space */}
      <div className="pointer-events-none absolute top-[8%] right-[12%] size-44 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-[11%] right-[14%] size-16 rounded-full bg-amber-100/35 blur-xl" />

      <div
        className={`relative z-10 grid h-full w-full transition-all duration-300 ${isFullscreen ? "grid-cols-1" : "lg:grid-cols-[1fr_1.35fr]"
          }`}
      >
        {!isFullscreen && (
          <section className="flex h-full flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="space-y-6 max-w-xl">
              <h1 className="font-['Cormorant_Garamond',serif] text-5xl leading-[0.98] font-semibold text-white sm:text-6xl lg:text-7xl">
                Intelligent carbon
                <br />
                mapping for MAHE.
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Explore real-time continuous telemetry, AI root-cause diagnostics, and closed-loop optimization across Manipal's primary facility assets.
              </p>

              {/* Quick Building Launch Cards */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Featured 3D Digital Twins
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => openBuildingTwin("ab3")}
                    className="flex flex-col text-left rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-emerald-400/50 hover:bg-emerald-950/20 transition cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <GraduationCap className="size-4 text-emerald-400 group-hover:scale-110 transition" />
                      <span className="text-[9px] font-bold text-emerald-300 uppercase px-1.5 py-0.5 rounded bg-emerald-500/20">65 kWp</span>
                    </div>
                    <strong className="text-xs text-white font-semibold group-hover:text-emerald-300">AB3 MIT</strong>
                    <span className="text-[10px] text-slate-400">Academic & Chiller</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openBuildingTwin("b14")}
                    className="flex flex-col text-left rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-emerald-400/50 hover:bg-emerald-950/20 transition cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Home className="size-4 text-cyan-400 group-hover:scale-110 transition" />
                      <span className="text-[9px] font-bold text-cyan-300 uppercase px-1.5 py-0.5 rounded bg-cyan-500/20">180 kWp</span>
                    </div>
                    <strong className="text-xs text-white font-semibold group-hover:text-cyan-300">B14 Hostel</strong>
                    <span className="text-[10px] text-slate-400">12 Floors · 360 Rms</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openBuildingTwin("kmc")}
                    className="flex flex-col text-left rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-emerald-400/50 hover:bg-emerald-950/20 transition cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Library className="size-4 text-indigo-400 group-hover:scale-110 transition" />
                      <span className="text-[9px] font-bold text-indigo-300 uppercase px-1.5 py-0.5 rounded bg-indigo-500/20">120 kWp</span>
                    </div>
                    <strong className="text-xs text-white font-semibold group-hover:text-indigo-300">KMC Library</strong>
                    <span className="text-[10px] text-slate-400">Health Sciences</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  className="h-11 rounded-full bg-white px-6 text-sm font-medium text-slate-950 shadow-lg hover:bg-slate-100"
                >
                  <Link to="/buildings">
                    Open Building View
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-white/15 bg-white/5 px-5 text-sm text-white hover:bg-white/10"
                  onClick={() => resetExperience()}
                >
                  Reset View
                </Button>
              </div>
            </div>
          </section>
        )}

        <section
          className={`relative flex h-full flex-col justify-between transition-all duration-300 ${isFullscreen ? "p-0" : "p-4 sm:p-6 lg:p-8"
            }`}
        >
          {/* Top Map Controls */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/75 px-3.5 py-1.5 text-xs tracking-[0.14em] text-white shadow-lg backdrop-blur transition hover:bg-slate-900 hover:border-white/30 cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="size-3.5 text-cyan-300" />
                  <span className="font-medium">EXIT FULLSCREEN</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-3.5 text-cyan-300" />
                  <span className="font-medium">FULLSCREEN</span>
                </>
              )}
            </button>
          </div>

          <div
            className={`relative flex-1 overflow-hidden transition-all duration-300 ${isFullscreen
              ? "h-full w-full rounded-none border-none bg-transparent"
              : "rounded-3xl border-none bg-transparent"
              }`}
          >
            <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

            {/* Manual Zoom Controls */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-slate-950/80 p-1 shadow-xl backdrop-blur-md">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                aria-label="Zoom In"
                className="flex size-8 items-center justify-center rounded-xl text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <Plus className="size-4" />
              </button>
              <div className="h-px bg-white/10 mx-1" />
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                aria-label="Zoom Out"
                className="flex size-8 items-center justify-center rounded-xl text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <Minus className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 3D Holographic Digital Twin & Intelligence Modal */}
      <AB3BuildingModal
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        buildingId={activeBuildingId}
      />
    </div>
  );
}
