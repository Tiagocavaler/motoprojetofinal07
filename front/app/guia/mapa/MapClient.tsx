// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapClient({ filtros, busca }) {
  const mapRef = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetch("/map-data/markers-1.0.json").then(r=>r.json()).then(setMarkers).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!mapRef.current || map.current) return;
    map.current = L.map(mapRef.current, {crs:L.CRS.Simple,minZoom:-2,maxZoom:2,center:[500,500],zoom:0,zoomControl:false});
    const bounds = [[0,0],[1000,1000]];
    // tenta carregar imagem, se não tiver usa fundo escuro
    L.imageOverlay("/map/palworld-official.jpg", bounds).addTo(map.current).on('error',()=>{
      L.rectangle(bounds,{color:"#0b1620",fillColor:"#0b1620",fillOpacity:1,weight:0}).addTo(map.current);
    });
    map.current.fitBounds(bounds);
    layer.current = L.layerGroup().addTo(map.current);
  }, []);

  useEffect(() => {
    if (!layer.current) return;
    layer.current.clearLayers();
    let list = markers.filter(m=>filtros[m.type]);
    if(busca) list = list.filter(m=>m.name.toLowerCase().includes(busca.toLowerCase()));
    list.forEach(m=>{
      const icon = L.divIcon({html:`<div style="background:${m.color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px ${m.color}"></div>`,iconSize:[12,12],iconAnchor:[6,6],className:""});
      L.marker([m.y,m.x],{icon}).addTo(layer.current).bindPopup(`<b>${m.name}</b><br/>${m.level||''}`);
    });
  }, [markers,filtros,busca]);

  return <div ref={mapRef} style={{width:"100%",height:"100%",background:"#061018"}} />;
}