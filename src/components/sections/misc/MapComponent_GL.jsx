'use client';
import { useEffect, useRef, useState } from 'react';
import maplibre from 'maplibre-gl';
import { fromArrayBuffer } from 'geotiff';
import 'maplibre-gl/dist/maplibre-gl.css';

// Constants (same as before)
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
  const mapContainerRef = useRef(null);
  const legendRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState(2019);
  const [selectedMonth, setSelectedMonth] = useState("Jul");
  const [selectedData, setSelectedData] = useState("PO3");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibre.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 20],
      zoom: 2,
      attributionControl: false
    });

    map.on('load', () => {
      setIsMapReady(true);
      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const loadGeoTiff = async () => {
    if (!mapRef.current || !isMapReady) {
      console.log("Map not ready yet");
      return;
    }
    setIsLoading(true);

    try {
      const monthNum = monthToNumber[selectedMonth];
      const fileName = `TROPOMI_${dataFields[selectedData]}_${selectedYear}_${monthNum}.tif`;
      const url = `https://raw.githubusercontent.com/ahsouri/ozonerates-geotifs/main/images/${fileName}`;
      console.log("Loading:", url);

      // Remove existing layer if it exists
      if (mapRef.current.getLayer('raster-layer')) {
        mapRef.current.removeLayer('raster-layer');
        mapRef.current.removeSource('raster-source');
      }

      // Fetch and parse GeoTIFF
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const tiff = await fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      const [minX, minY, maxX, maxY] = image.getBoundingBox();
      const rasterData = await image.readRasters();
      console.log("GeoTIFF loaded with bounds:", {minX, minY, maxX, maxY});

      // Create canvas for the raster
      const canvas = document.createElement('canvas');
      canvas.width = rasterData.width;
      canvas.height = rasterData.height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(rasterData.width, rasterData.height);

      // Find min/max values for normalization
      let minVal = Infinity;
      let maxVal = -Infinity;
      for (let i = 0; i < rasterData[0].length; i++) {
        const val = rasterData[0][i];
        if (val !== 0 && val !== -9999) {
          minVal = Math.min(minVal, val);
          maxVal = Math.max(maxVal, val);
        }
      }
      console.log("Data range:", minVal, maxVal);

      // Apply jet color scale with proper normalization
      for (let i = 0; i < rasterData[0].length; i++) {
        const value = rasterData[0][i];
        if (value === 0 || value === -9999) {
          imageData.data[i * 4 + 3] = 0; // Transparent for no data
          continue;
        }

        // Normalize value to 0-255 based on actual data range
        const normalized = Math.floor(((value - minVal) / (maxVal - minVal)) * 255);
        const index = Math.min(Math.floor((normalized / 255) * (jetColors.length - 1)), jetColors.length - 1);
        const [r, g, b] = jetColors[index];
        
        imageData.data[i * 4] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = b;
        imageData.data[i * 4 + 3] = 178; // ~70% opacity
      }

      ctx.putImageData(imageData, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');
      console.log("Image URL created");

      // Add raster source and layer
      mapRef.current.addSource('raster-source', {
        type: 'image',
        url: imageUrl,
        coordinates: [
          [minX, maxY], // top-left
          [maxX, maxY], // top-right
          [maxX, minY], // bottom-right
          [minX, minY], // bottom-left
        ]
      });

      mapRef.current.addLayer({
        id: 'raster-layer',
        type: 'raster',
        source: 'raster-source',
        paint: {
          'raster-opacity': 0.7
        }
      });

      console.log("Layer added, fitting bounds");
      mapRef.current.fitBounds([[minX, minY], [maxX, maxY]], { padding: 20 });
      updateLegend();

    } catch (error) {
      console.error("Error loading GeoTIFF:", error);
      alert(`Error loading map: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLegend = () => {
    if (!legendRef.current) return;
  
    let min, mid, max;
    if (selectedData.includes("PBL")) {
      min = "-1.0"; mid = "2.0"; max = "5.0";
    } else if (selectedData.includes("NO2 VCD")) {
      min = "-1.0"; mid = "5.5"; max = "12.0";
    } else if (selectedData.includes("HCHO VCD")) {
      min = "-1.0"; mid = "19.5"; max = "40.0";
    } else if (selectedData === "JNO2") {
      min = "5"; mid = "12.5"; max = "20";
    } else {
      min = "-4.0"; mid = "2.0"; max = "8.0";
    }
  
    const unit = selectedData.includes("VCD") ? '[Pmolec/cm²]' : 
                 selectedData === "JNO2" ? '[1000*1/s]' : 
                 '[ppbv/hr]';
  
    const gradient = jetColors.map((c, i) => 
      `rgb(${c[0]},${c[1]},${c[2]}) ${(i / (jetColors.length - 1)) * 100}%`
    ).join(', ');
  
    legendRef.current.innerHTML = `
      <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2); border: 1px solid #ccc">
        <div style="background: linear-gradient(to right, ${gradient}); height: 25px; width: 250px; margin-bottom: 5px;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #333">
          <span>${min}</span><span>${mid}</span><span>${max}</span>
        </div>
        <div style="text-align: center; font-weight: bold; margin-top: 5px">${unit}</div>
      </div>
    `;
  };

  return (
    <div className="w-full">
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: "700px", 
          width: "100%", 
          marginBottom: "20px",
          position: 'relative'
        }}
      >
        <div 
          ref={legendRef}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 1
          }}
        />
      </div>
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Year: </label>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          disabled={isLoading}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label style={{ marginLeft: "20px" }}>Month: </label>
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          disabled={isLoading}
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <label style={{ marginLeft: "20px" }}>Data: </label>
        <select 
          value={selectedData}
          onChange={(e) => {
            setSelectedData(e.target.value);
            updateLegend();
          }}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          disabled={isLoading}
        >
          {Object.keys(dataFields).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
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
      </div>
    </div>
  );
}