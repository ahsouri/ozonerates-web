'use client';
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import parseGeoraster from "georaster";

const years = [2018, 2019, 2020, 2021, 2022, 2023];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dataFields = {
  "PO3": "PO3",
  "Sens. to NOx": "PO3_NOX",
  "Sens. to VOC": "PO3_VOC",
  "NO2 PBL mixing ratios": "NO2_ppbv",
  "HCHO PBL mixing ratios": "HCHO_ppbv",
  "HCHO VCDs": "HCHO_VCD",
  "NO2 VCDs": "NO2_VCD",
  "JNO2": "JNO2",
};
const monthToNumber = {
  "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
  "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
};
const jetColors = [
  [0, 0, 143], [0, 0, 159], [0, 0, 175], [0, 0, 191], [0, 0, 207], [0, 0, 223],
  [0, 0, 239], [0, 0, 255], [0, 16, 255], [0, 32, 255], [0, 48, 255], [0, 64, 255],
  [0, 80, 255], [0, 96, 255], [0, 112, 255], [0, 128, 255], [0, 143, 255], [0, 159, 255],
  [0, 175, 255], [0, 191, 255], [0, 207, 255], [0, 223, 255], [0, 239, 255], [0, 255, 255],
  [16, 255, 239], [32, 255, 223], [48, 255, 207], [64, 255, 191], [80, 255, 175], [96, 255, 159],
  [112, 255, 143], [128, 255, 128], [143, 255, 112], [159, 255, 96], [175, 255, 80], [191, 255, 64],
  [207, 255, 48], [223, 255, 32], [239, 255, 16], [255, 255, 0], [255, 239, 0], [255, 223, 0],
  [255, 207, 0], [255, 191, 0], [255, 175, 0], [255, 159, 0], [255, 143, 0], [255, 128, 0],
  [255, 112, 0], [255, 96, 0], [255, 80, 0], [255, 64, 0], [255, 48, 0], [255, 32, 0],
  [255, 16, 0], [255, 0, 0], [239, 0, 0], [223, 0, 0], [207, 0, 0], [191, 0, 0]
];

export default function MapComponent() {
  const [selectedYear, setSelectedYear] = useState(2019);
  const [selectedMonth, setSelectedMonth] = useState("Jul");
  const [selectedData, setSelectedData] = useState("PO3");
  const [map, setMap] = useState(null);
  const [rasterLayer, setRasterLayer] = useState(null);
  const [legend, setLegend] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const leafletMap = L.map("map", {
      minZoom: 2,
      maxZoom: 18,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
      worldCopyJump: false
    }).setView([20, 0], 2);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      noWrap: true,
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    const newLegend = createLegend(selectedData);
    newLegend.addTo(leafletMap);
    setLegend(newLegend);
    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, [isMounted]);

  const createLegend = (dataType) => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend-container');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      div.style.border = '1px solid #ccc';

      const gradient = document.createElement('div');
      gradient.style.background = 'linear-gradient(to right, ' + jetColors.map((c, i) =>
        `rgb(${c[0]},${c[1]},${c[2]}) ${(i / (jetColors.length - 1)) * 100}%`).join(', ') + ')';
      gradient.style.height = '25px';
      gradient.style.width = '250px';
      gradient.style.marginBottom = '5px';

      const labels = document.createElement('div');
      labels.style.display = 'flex';
      labels.style.justifyContent = 'space-between';
      labels.style.fontSize = '12px';
      labels.style.color = '#333';

      if (dataType.includes("PBL")) labels.innerHTML = `<span>-1.0</span><span>2.0</span><span>5.0</span>`;
      else if (dataType.includes("NO2 VCD")) labels.innerHTML = `<span>-1.0</span><span>5.5</span><span>12.0</span>`;
      else if (dataType.includes("HCHO VCD")) labels.innerHTML = `<span>-1.0</span><span>19.5</span><span>40.0</span>`;
      else if (dataType === "JNO2") labels.innerHTML = `<span>5</span><span>12.5</span><span>20</span>`;
      else labels.innerHTML = `<span>-4.0</span><span>2.0</span><span>8.0</span>`;

      const unit = document.createElement('div');
      unit.style.textAlign = 'center';
      unit.style.fontWeight = 'bold';
      unit.style.marginTop = '5px';
      unit.textContent = dataType.includes("VCD") ? '[Pmolec/cm²]' : 
                         dataType === "JNO2" ? '[1000*1/s]' : 
                         '[ppbv/hr]';

      div.appendChild(gradient);
      div.appendChild(labels);
      div.appendChild(unit);
      return div;
    };

    return legend;
  };

  const loadGeoTiff = async () => {
    const monthNum = monthToNumber[selectedMonth];
    const fileName = `TROPOMI_${dataFields[selectedData]}_${selectedYear}_${monthNum}.tif`;
    const url = `https://raw.githubusercontent.com/ahsouri/ozonerates-geotifs/main/images/${fileName}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      if (rasterLayer) map.removeLayer(rasterLayer);

      const layer = new GeoRasterLayer({
        georaster,
        opacity: 0.6,
        resolution: 256,
        pixelValuesToColorFn: values => {
          const [red, green, blue] = values;
          return (blue < 132 && red === 0.0 && green === 0.0)
            ? "rgba(0, 0, 0, 0)"
            : `rgb(${red},${green},${blue})`;
        }
      });

      layer.addTo(map);
      setRasterLayer(layer);

      if (legend) map.removeControl(legend);
      const newLegend = createLegend(selectedData);
      newLegend.addTo(map);
      setLegend(newLegend);

    } catch (error) {
      console.error("Error loading GeoTIFF:", error);
      alert(`Failed to load GeoTIFF: ${error.message}`);
    }
  };

  if (!isMounted) {
    return (
      <div style={{
        height: "700px", width: "100%",
        backgroundColor: "#000", color: "white",
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div>
      <div id="map" style={{ height: "700px", width: "100%", marginBottom: "20px" }} />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Year: </label>
        <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        <label style={{ marginLeft: "20px" }}>Month: </label>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          {months.map(month => <option key={month} value={month}>{month}</option>)}
        </select>

        <label style={{ marginLeft: "20px" }}>Data: </label>
        <select value={selectedData} onChange={e => setSelectedData(e.target.value)}>
          {Object.keys(dataFields).map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <button onClick={loadGeoTiff} style={{
          marginLeft: "20px",
          padding: "10px 20px",
          backgroundColor: "purple",
          color: "white",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer"
        }}>
          Load The Map
        </button>
      </div>
    </div>
  );
}
