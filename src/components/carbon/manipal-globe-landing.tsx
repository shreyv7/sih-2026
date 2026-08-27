import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPinned,
  Maximize2,
  Minimize2,
  Minus,
  Orbit,
  Plus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { AB3BuildingModal } from "@/components/carbon/ab3-building-modal";

const MANIPAL_CENTER: [number, number] = [74.7928, 13.3526];
const AB3_COORDINATES: [number, number] = [74.79309, 13.35126];

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
  const [isOrbitingAB3, setIsOrbitingAB3] = useState(false);
  const [isAB3ModalOpen, setIsAB3ModalOpen] = useState(false);
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
      // Fallback if browser fullscreen request fails or is restricted
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
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
      }, 150);
    }
  }, [isFullscreen]);

  useEffect(() => {
    let cancelled = false;

    const bootMap = async () => {
      if (!containerRef.current) return;

      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          projection: { type: "globe" },
          sources: {
            satellite: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              maxzoom: 18,
              attribution: "Esri, Maxar, Earthstar Geographics",
            },
          },
          layers: [
            {
              id: "background",
              type: "background",
              paint: { "background-color": "#020612" },
            },
            { id: "satellite", type: "raster", source: "satellite" },
          ],
        },
        center: [64, 18],
        zoom: 1.55,
        minZoom: 1,
        maxZoom: 20,
        pitch: 26,
        bearing: 0,
        scrollZoom: true,
        dragPan: true,
        dragRotate: true,
        touchZoomRotate: true,
        touchPitch: true,
        doubleClickZoom: true,
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
        setIsOrbitingAB3(false);

        const loop = () => {
          if (!mapRef.current || selectedRegionRef.current || isUserInteracting) return;
          const bearing = mapRef.current.getBearing();
          mapRef.current.rotateTo(bearing + 0.06, { duration: 0 });
          rotationFrameRef.current = requestAnimationFrame(loop);
        };

        rotationFrameRef.current = requestAnimationFrame(loop);
      };

      beginRotationRef.current = startRotation;

      // 3D Orbiting animation around AB3 Building
      const startAB3Orbit = () => {
        stopRotation();
        setIsOrbitingAB3(true);

        const orbitLoop = () => {
          if (!mapRef.current || selectedRegionRef.current?.id !== "ab3" || isUserInteracting) return;
          const currentBearing = mapRef.current.getBearing();
          mapRef.current.rotateTo(currentBearing + 0.16, { duration: 0 });
          mapRef.current.setCenter(AB3_COORDINATES);
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
          if (selectedRegionRef.current?.id === "ab3") {
            startAB3Orbit();
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
        markersRef.current.forEach(({ id, element }) => {
          if (id === "ab3") {
            const showAB3 = activeRegionId === "manipal" || activeRegionId === "ab3" || currentZoom >= 13.5;
            element.style.display = showAB3 ? "inline-flex" : "none";
          } else if (id === "manipal") {
            // Hide Manipal overall tag when in zoomed-in mode so only AB3 is pinned
            const isZoomedIn = activeRegionId === "manipal" || activeRegionId === "ab3" || currentZoom >= 12.5;
            element.style.display = isZoomedIn ? "none" : "inline-flex";
          } else if (id === "india") {
            element.style.display = currentZoom >= 8 ? "none" : "inline-flex";
          }
        });
      };

      const focusRegion = (region: RegionHotspot) => {
        selectedRegionRef.current = region;
        setSelectedRegion(region);
        setIsOrbitingAB3(false);
        stopRotation();

        map.flyTo({
          center: region.coordinates,
          zoom: region.zoom,
          pitch: region.pitch,
          bearing: region.bearing,
          duration: 3600,
          curve: 1.45,
          essential: true,
        });

        updateMarkers(region.zoom, region.id);

        if (region.id === "ab3") {
          map.once("moveend", () => {
            if (selectedRegionRef.current?.id === "ab3") {
              startAB3Orbit();
              setIsAB3ModalOpen(true);
            }
          });
          setTimeout(() => {
            if (selectedRegionRef.current?.id === "ab3") {
              setIsAB3ModalOpen(true);
            }
          }, 1200);
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
          element.className = `globe-hotspot ${region.id === "ab3" ? "globe-hotspot--target" : ""}`;
          // Hide AB3 initially in global view until Manipal is visited
          if (region.id === "ab3") {
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
    setIsOrbitingAB3(false);
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
      if (id === "ab3") element.style.display = "none";
      if (id === "manipal" || id === "india") element.style.display = "inline-flex";
    });

    map.once("moveend", () => beginRotationRef.current());
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#020612] text-white select-none">
      {/* Universal Space & Cosmic Nebula Background (Uniform across the entire page) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(255,225,160,0.22),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(255,180,90,0.12),transparent_40%),radial-gradient(circle_at_20%_45%,rgba(35,85,155,0.16),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(12,30,65,0.3),transparent_60%),linear-gradient(180deg,#030917_0%,#020612_55%,#01040a_100%)]" />

      {/* Universal Starfield Layer 1 (Twinkling stars across the full viewport) */}
      <div className="pointer-events-none absolute inset-0 opacity-85 [background-image:radial-gradient(2px_2px_at_25px_35px,#fff,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_65px_120px,#93c5fd,rgba(0,0,0,0)),radial-gradient(1px_1px_at_140px_60px,#fff,rgba(0,0,0,0)),radial-gradient(2px_2px_at_200px_160px,#fde047,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_280px_90px,#fff,rgba(0,0,0,0)),radial-gradient(2px_2px_at_340px_220px,#a7f3d0,rgba(0,0,0,0)),radial-gradient(1px_1px_at_410px_140px,#fff,rgba(0,0,0,0)),radial-gradient(2.5px_2.5px_at_490px_50px,#ffffff,rgba(0,0,0,0))] [background-repeat:repeat] [background-size:520px_520px]" />

      {/* Universal Starfield Layer 2 (Fainter depth stars across the full viewport) */}
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

            {/* Manual Zoom In / Zoom Out Floating Controls */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-slate-950/80 p-1 shadow-xl backdrop-blur-md">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In (or use mouse scroll / trackpad pinch)"
                aria-label="Zoom In"
                className="flex size-8 items-center justify-center rounded-xl text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <Plus className="size-4" />
              </button>
              <div className="h-px bg-white/10 mx-1" />
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out (or use mouse scroll / trackpad pinch)"
                aria-label="Zoom Out"
                className="flex size-8 items-center justify-center rounded-xl text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <Minus className="size-4" />
              </button>
            </div>

          </div>
        </section>
      </div>

      {/* AB3 3D Holographic Digital Twin & Intelligence Cards Modal */}
      <AB3BuildingModal
        isOpen={isAB3ModalOpen}
        onClose={() => setIsAB3ModalOpen(false)}
      />
    </div>
  );
}
