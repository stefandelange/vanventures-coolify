"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import L, { type PathOptions } from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import {
  countryVisits,
  stateVisits,
  stateCenters,
  provinceVisits,
  provinceCenters,
  VISITOR_COLORS,
  PROFILE_IMAGES,
  type Visitor,
} from "@/data/travel-data";
import countriesGeoJSON from "@/data/countries.json";
import usStatesGeoJSON from "@/data/us-states.json";
import canadaProvincesGeoJSON from "@/data/canada-provinces.json";
import franceMetroGeoJSON from "@/data/france-metro.json";

function getIsoCode(properties: Record<string, unknown>): string {
  const iso = properties.ISO_A3 as string;
  if (iso && iso !== "-99") return iso;
  return (properties.ADM0_A3 as string) ?? "";
}

function createProfileIcon(visitor: Visitor): L.DivIcon {
  const { url, objectPosition } = PROFILE_IMAGES[visitor];
  const { border } = VISITOR_COLORS[visitor];
  const size = 40;
  const altText =
    visitor === "both"
      ? "Kathrin &amp; Stefan"
      : visitor === "stefan"
        ? "Stefan"
        : "Kathrin";

  const html = `<div style="width:${size}px;height:${size}px;border-radius:50%;border:3px solid ${border};overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.35);"><img src="${url}" alt="${altText}" style="width:100%;height:100%;object-fit:cover;object-position:${objectPosition};display:block;" /></div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function WorldTravelMap() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const countryMarkers = useMemo(() => {
    const markers: { position: [number, number]; visitor: Visitor }[] = [];
    const features = (countriesGeoJSON as unknown as FeatureCollection)
      .features;
    for (const feat of features) {
      const props = feat.properties as Record<string, unknown>;
      const iso = getIsoCode(props);
      const visitor = countryVisits[iso];
      if (visitor && props.LABEL_X != null && props.LABEL_Y != null) {
        markers.push({
          position: [props.LABEL_Y as number, props.LABEL_X as number],
          visitor,
        });
      }
    }
    return markers;
  }, []);

  const stateMarkers = useMemo(() => {
    return Object.entries(stateVisits)
      .filter(([state]) => stateCenters[state])
      .map(([state, visitor]) => ({
        position: stateCenters[state],
        visitor,
      }));
  }, []);

  const provinceMarkers = useMemo(() => {
    return Object.entries(provinceVisits)
      .filter(([province]) => provinceCenters[province])
      .map(([province, visitor]) => ({
        position: provinceCenters[province],
        visitor,
      }));
  }, []);

  const countryStyle = useCallback((feature?: Feature): PathOptions => {
    if (!feature?.properties)
      return { fillOpacity: 0, weight: 0.4, color: "#cbd5e1" };
    const iso = getIsoCode(feature.properties as Record<string, unknown>);
    // USA, Canada and France are handled by dedicated layers
    if (iso === "USA" || iso === "CAN" || iso === "FRA") {
      return { fillOpacity: 0, weight: 0, color: "transparent" };
    }
    const visitor = countryVisits[iso];
    if (!visitor) {
      return { fillOpacity: 0, weight: 0.4, color: "#cbd5e1" };
    }
    const { fill, border, fillOpacity } = VISITOR_COLORS[visitor];
    return { fillColor: fill, fillOpacity, color: border, weight: 1.5 };
  }, []);

  const stateStyle = useCallback((feature?: Feature): PathOptions => {
    if (!feature?.properties)
      return { fillOpacity: 0, weight: 0.4, color: "#cbd5e1" };
    const name = (feature.properties as Record<string, unknown>).name as string;
    const visitor = stateVisits[name];
    if (!visitor) {
      return { fillOpacity: 0, weight: 0.4, color: "#cbd5e1" };
    }
    const { fill, border, fillOpacity } = VISITOR_COLORS[visitor];
    return { fillColor: fill, fillOpacity, color: border, weight: 1.5 };
  }, []);

  const provinceStyle = useCallback((feature?: Feature): PathOptions => {
    if (!feature?.properties)
      return { fillOpacity: 0, weight: 0.4, color: "#cbd5e1" };
    const name = (feature.properties as Record<string, unknown>).name as string;
    const visitor = provinceVisits[name];
    if (!visitor) {
      return { fillOpacity: 0, weight: 0.4, color: "#cbd5e1" };
    }
    const { fill, border, fillOpacity } = VISITOR_COLORS[visitor];
    return { fillColor: fill, fillOpacity, color: border, weight: 1.5 };
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[27, 10]}
      zoom={2}
      minZoom={2}
      maxZoom={10}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        data={countriesGeoJSON as unknown as GeoJSON.GeoJsonObject}
        style={countryStyle}
      />
      <GeoJSON
        data={usStatesGeoJSON as unknown as GeoJSON.GeoJsonObject}
        style={stateStyle}
      />
      <GeoJSON
        data={canadaProvincesGeoJSON as unknown as GeoJSON.GeoJsonObject}
        style={provinceStyle}
      />
      <GeoJSON
        data={franceMetroGeoJSON as unknown as GeoJSON.GeoJsonObject}
        style={() => {
          const { fill, border, fillOpacity } =
            VISITOR_COLORS[countryVisits["FRA"]];
          return { fillColor: fill, fillOpacity, color: border, weight: 1.5 };
        }}
      />
      {[
        ...countryMarkers,
        ...stateMarkers,
        ...provinceMarkers,
        {
          position: [46.2, 2.2] as [number, number],
          visitor: countryVisits["FRA"],
        },
      ].map(({ position, visitor }, i) => (
        <Marker
          key={`${visitor}-${i}`}
          position={position}
          icon={createProfileIcon(visitor)}
        />
      ))}
    </MapContainer>
  );
}
