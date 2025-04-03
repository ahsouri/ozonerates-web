import { useEffect, useState } from "react";
import L from "leaflet";
import parseGeoraster from "georaster";

import GeoRasterLayer from "georaster-layer-for-leaflet";
import "leaflet/dist/leaflet.css";

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
  "Jan": "01",
  "Feb": "02",
  "Mar": "03",
  "Apr": "04",
  "May": "05",
  "Jun": "06",
  "Jul": "07",
  "Aug": "08",
  "Sep": "09",
  "Oct": "10",
  "Nov": "11",
  "Dec": "12"
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

  useEffect(() => {
    const newMap = L.map("map", {
      minZoom: 2,
      maxZoom: 18,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
      worldCopyJump: false
    }).setView([20, 0], 2);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      noWrap: true,
      bounds: [[-85, -175], [85, 175]],
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    const newLegend = createLegend(selectedData);
    newLegend.addTo(newMap);
    setLegend(newLegend);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, []);

  const createLegend = (dataType) => {
    const isNO2OrHCHO = dataType === "NO2 PBL mixing ratios" || dataType === "HCHO PBL mixing ratios";
    const isNO2VCD = dataType === "HCHO VCDs" 
    const isHCHOVCD = dataType === "NO2 VCDs";
    const isJNO2 = dataType === "JNO2";
    const isPO3 =  dataType === "PO3";
    const isPO3sens = dataType === "Sens. to NOx" || dataType === "Sens. to VOC" 
    
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'legend-container');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      div.style.border = '1px solid #ccc';
      
      const gradient = document.createElement('div');
      gradient.style.background = 'linear-gradient(to right, ' + 
        jetColors.map((color, i) => {
          return `rgb(${color[0]},${color[1]},${color[2]}) ${(i / (jetColors.length - 1)) * 100}%`;
        }).join(', ') + ')';
      gradient.style.height = '25px';
      gradient.style.width = '250px';
      gradient.style.marginBottom = '5px';
      gradient.style.border = '1px solid #999';
      
      const labels = document.createElement('div');
      labels.style.display = 'flex';
      labels.style.justifyContent = 'space-between';
      labels.style.fontFamily = 'Arial, sans-serif';
      labels.style.fontSize = '12px';
      labels.style.color = '#333';
      
      if (isNO2OrHCHO) {
        labels.innerHTML = `
          <span>-1.0</span>
          <span>2.0</span>
          <span>5.0</span>
        `;
      } 
      if (isPO3 || isPO3sens) {
        labels.innerHTML = `
          <span>-4.0</span>
          <span>2.0</span>
          <span>8.0</span>
        `;
      }
      if (isJNO2) {
        labels.innerHTML = `
          <span>5</span>
          <span>12.5</span>
          <span>20</span>
        `;
      }
      if (isNO2VCD) {
        labels.innerHTML = `
          <span>-1.0</span>
          <span>5.0</span>
          <span>11.0</span>
        `;
      }
      if (isHCHOVCD) {
        labels.innerHTML = `
          <span>-1.0</span>
          <span>19.5</span>
          <span>40.0</span>
        `;
      }
      
      const unit = document.createElement('div');
      unit.style.textAlign = 'center';
      unit.style.fontWeight = 'bold';
      unit.style.fontSize = '12px';
      unit.style.marginTop = '3px';
      unit.style.color = '#333';
      
      if (isNO2OrHCHO) {
        unit.textContent = '[ppbv]';
      } else if (isNO2VCD || isHCHOVCD) {
        unit.textContent = '[Pmolec/cm²]';
      } else if (isPO3 || isPO3sens) {
        unit.textContent = '[ppbv/hr]';
      } else if (isJNO2) {
        unit.textContent = '[1000*1/s]';
      }
      
      div.appendChild(gradient);
      div.appendChild(labels);
      div.appendChild(unit);
      
      return div;
    };
    
    return legend;
  };

  const loadGeoTiff = async () => {
    if (!map) return;

    const monthNumber = monthToNumber[selectedMonth];
    let fileName = `TROPOMI_${dataFields[selectedData]}_${selectedYear}_${monthNumber}.tif`;
    
    // GitHub raw content URL (replace with your actual repo details)
    const geoTiffUrl = `https://raw.githubusercontent.com/ahsouri/ozonerates-geotifs/main/images/${fileName}`;
    
    console.log('Loading GeoTIFF from:', geoTiffUrl);
    
    try {
      const response = await fetch(geoTiffUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      if (rasterLayer) {
        map.removeLayer(rasterLayer);
      }

      const layer = new GeoRasterLayer({
        georaster,
        opacity: 0.60,
        pixelValuesToColorFn: values => {
          const red = values[0];
          const green = values[1];
          const blue = values[2];
          return (blue < 132 && red === 0.0 && green === 0.0) 
            ? "rgba(0, 0, 0, 0)"
            : `rgb(${red}, ${green}, ${blue})`;
        },
        resolution: 256,
        bounds: [[-89.9, -179.9], [89.9, 179.9]],
        clip: true
      });

      layer.addTo(map);
      setRasterLayer(layer);

      if (legend) {
        map.removeControl(legend);
      }
      const newLegend = createLegend(selectedData);
      newLegend.addTo(map);
      setLegend(newLegend);

    } catch (error) {
      console.error("Error loading GeoTIFF:", error);
      alert(`Failed to load GeoTIFF: ${error.message}`);
    }
  };

  return (
    <div>
      <div id="map" style={{ 
        height: "700px", 
        width: "100%", 
        marginBottom: "20px",
        backgroundColor: "#000",
        overflow: "hidden"
      }}></div>
      <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px"}}>
        <label style={{ marginRight: "10px" }}>Year:</label>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        <label style={{ marginLeft: "20px", marginRight: "10px" }}>Month:</label>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          {months.map(month => <option key={month} value={month}>{month}</option>)}
        </select>

        <label style={{ marginLeft: "20px", marginRight: "10px" }}>Data:</label>
        <select 
          value={selectedData} 
          onChange={(e) => setSelectedData(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          {Object.keys(dataFields).map(data => (
            <option key={data} value={data}>{data}</option>
          ))}
        </select>

        <button 
          onClick={loadGeoTiff} 
          style={{ 
            marginLeft: "20px", 
            padding: "10px 20px", 
            backgroundColor: "purple", 
            color: "white", 
            border: "none", 
            borderRadius: "20px", 
            cursor: "pointer", 
            fontSize: "16px", 
            transition: "0.3s ease-in-out", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" 
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#800080"}
          onMouseOut={(e) => e.target.style.backgroundColor = "purple"}
        >
          Load The Map
        </button>
      </div>
    </div>
  );
}