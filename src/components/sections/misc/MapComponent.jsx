'use client';
import { useEffect, useState } from "react";
import('leaflet/dist/leaflet.css');

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
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rasterGroup, setRasterGroup] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Clear existing map if it exists
      if (map) {
        map.remove();
        setMap(null);
      }

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

      const rasterLayerGroup = L.layerGroup().addTo(leafletMap);
      setRasterGroup(rasterLayerGroup);
      
      setMap(leafletMap);
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isClient]);

  const createLegend = (L, dataType) => {
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
        dataType.includes("PBL") ? '[ppbv]' :
        dataType.includes("PO3") ? '[ppbv/hr]' :
        dataType.includes("Sens.") ? '[ppbv/hr]' :
        'Unknown'

      div.appendChild(gradient);
      div.appendChild(labels);
      div.appendChild(unit);
      return div;
    };

    return legend;
  };

  const loadGeoTiff = async () => {
      if (!map || !rasterGroup) return;
      setIsLoading(true);
  
      try {
          const L = (await import("leaflet")).default;
          const georasterModule = await import("georaster");
          const georasterLayerModule = await import("georaster-layer-for-leaflet");
          const parseGeoraster = georasterModule.default;
          const GeoRasterLayer = georasterLayerModule.default;
  
          const monthNum = monthToNumber[selectedMonth];
          const fileName = `TROPOMI_${dataFields[selectedData]}_${selectedYear}_${monthNum}.tif`;
          const url = `https://raw.githubusercontent.com/ahsouri/ozonerates-geotifs/main/images/${fileName}`;
  
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch GeoTIFF: ${response.statusText}`);
          const arrayBuffer = await response.arrayBuffer();
          const georaster = await parseGeoraster(arrayBuffer);
  
          // Clear previous raster layers and legend
          rasterGroup.clearLayers();
          setRasterLayer(null);
          if (legend) {
              map.removeControl(legend);
              setLegend(null);
          }
  
          // Create new raster layer
          const layer = new GeoRasterLayer({
              georaster,
              opacity: 0.7,
              resolution: 256,
              pixelValuesToColorFn: values => {
                  if (!values || values.length === 0) return 'rgba(0, 0, 0, 0)';
                  if (values.length === 1) {
                      const value = values[0];
                      if (value === 0 || value === -9999) return 'rgba(0, 0, 0, 0)';
                      const normalized = Math.min(Math.max(value, 0), 255);
                      const index = Math.floor((normalized / 255) * (jetColors.length - 1));
                      const [r, g, b] = jetColors[index];
                      return `rgb(${r},${g},${b})`;
                  }
                  const [r, g, b] = values;
                  return (b < 132 && r === 0 && g === 0)
                      ? 'rgba(0, 0, 0, 0)'
                      : `rgb(${r},${g},${b})`;
              }
          });
  
          layer.addTo(rasterGroup);
          setRasterLayer(layer);
          map.fitBounds(layer.getBounds());
  
          // Create and add new legend
          const newLegend = createLegend(L, selectedData);
          newLegend.addTo(map);
          setLegend(newLegend);
  
          // Refresh map view
          map.invalidateSize();
      } catch (error) {
          console.error("Error loading GeoTIFF:", error);
          alert(`Error loading map: ${error.message}`);
      } finally {
          setIsLoading(false);
      }
  };
  

  if (!isClient) {
    return (
      <div style={{
        height: "700px",
        width: "100%",
        backgroundColor: "#000",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        Loading map...
      </div>
    );
  }

  const refreshPage = () => {
    window.location.reload();
  };
  return (
<div>
  <div style={{ 
    textAlign: "center", 
    marginBottom: "20px", 
    padding: "10px",
    backgroundColor: "#f5f5f5", // Light gray background for better visibility
    borderRadius: "8px" // Rounded corners
  }}>
    {/* Controls Row */}
    <div style={{ marginBottom: "15px" }}>
      <label>Year: </label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        style={{ 
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100px",
          marginRight: "20px"
        }}
        disabled={isLoading}
      >
        {years.map(year => <option key={year} value={year}>{year}</option>)}
      </select>

      <label>Month: </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{ 
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100px",
          marginRight: "20px"
        }}
        disabled={isLoading}
      >
        {months.map(month => <option key={month} value={month}>{month}</option>)}
      </select>

      <label>Data: </label>
      <select
        value={selectedData}
        onChange={(e) => setSelectedData(e.target.value)}
        style={{ 
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "200px",
          marginRight: "20px"
        }}
        disabled={isLoading}
      >
        {Object.keys(dataFields).map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <button
        onClick={loadGeoTiff}
        disabled={isLoading}
        style={{
          marginLeft: "20px",
          padding: "10px 20px",
          backgroundColor: isLoading ? "#cccccc" : "purple",
          color: "white",
          border: "none",
          borderRadius: "20px",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#6b46c1")}
        onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "purple")}
      >
        {isLoading ? "Loading..." : "Load The Map"}
      </button>
      <button
        onClick={refreshPage}
        style={{
          marginLeft: "20px",
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#cc0000")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "red")}
      >
        Refresh
      </button>
    </div>

    {/* Notes Section */}
    <div style={{
      textAlign: "center",
      marginBottom: "10px",
      color: "black",
      fontWeight: "bold",
      fontSize: "14px"
    }}>
      Note: It is highly recommended to press "refresh" when changing the dropdowns and reloading the map.
    </div>
    <div style={{
      textAlign: "center",
      color: "black",
      fontSize: "14px"
    }}>
      The maps are rendered on your computer so it may take time to see the full resolution depending on your computer performance.
    </div>
  </div>

  {/* Map Section */}
  <div id="map" style={{ height: "700px", width: "100%", marginBottom: "20px" }} />
</div>
  );
}