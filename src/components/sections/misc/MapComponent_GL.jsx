'use client';
import maplibre from 'maplibre-gl';
import GeoTIFF from 'geotiff';
import 'maplibre-gl/dist/maplibre-gl.css';

// Your original constants
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

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let selectedYear = 2019;
  let selectedMonth = "Jul";
  let selectedData = "PO3";
  let isLoading = false;
  let map = null;
  const mapContainer = document.createElement('div');
  const legendRef = document.createElement('div');

  // Create the UI
  function createUI() {
    const container = document.createElement('div');
    
    // Map container setup
    mapContainer.style.height = "700px";
    mapContainer.style.width = "100%";
    mapContainer.style.marginBottom = "20px";
    mapContainer.style.position = 'relative';
    
    // Legend setup
    legendRef.style.position = 'absolute';
    legendRef.style.bottom = '20px';
    legendRef.style.right = '20px';
    legendRef.style.zIndex = '1';
    mapContainer.appendChild(legendRef);
    
    // Controls container
    const controls = document.createElement('div');
    controls.style.textAlign = "center";
    controls.style.marginBottom = "20px";
    
    // Year select
    const yearLabel = document.createElement('label');
    yearLabel.textContent = "Year: ";
    const yearSelect = document.createElement('select');
    yearSelect.value = selectedYear;
    yearSelect.style.padding = "8px";
    yearSelect.style.borderRadius = "4px";
    yearSelect.style.border = "1px solid #ccc";
    yearSelect.disabled = isLoading;
    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
    yearSelect.addEventListener('change', (e) => {
      selectedYear = parseInt(e.target.value);
    });
    
    // Month select
    const monthLabel = document.createElement('label');
    monthLabel.textContent = "Month: ";
    monthLabel.style.marginLeft = "20px";
    const monthSelect = document.createElement('select');
    monthSelect.value = selectedMonth;
    monthSelect.style.padding = "8px";
    monthSelect.style.borderRadius = "4px";
    monthSelect.style.border = "1px solid #ccc";
    monthSelect.disabled = isLoading;
    months.forEach(month => {
      const option = document.createElement('option');
      option.value = month;
      option.textContent = month;
      monthSelect.appendChild(option);
    });
    monthSelect.addEventListener('change', (e) => {
      selectedMonth = e.target.value;
    });
    
    // Data select
    const dataLabel = document.createElement('label');
    dataLabel.textContent = "Data: ";
    dataLabel.style.marginLeft = "20px";
    const dataSelect = document.createElement('select');
    dataSelect.value = selectedData;
    dataSelect.style.padding = "8px";
    dataSelect.style.borderRadius = "4px";
    dataSelect.style.border = "1px solid #ccc";
    dataSelect.disabled = isLoading;
    Object.keys(dataFields).forEach(d => {
      const option = document.createElement('option');
      option.value = d;
      option.textContent = d;
      dataSelect.appendChild(option);
    });
    dataSelect.addEventListener('change', (e) => {
      selectedData = e.target.value;
      updateLegend();
    });
    
    // Load button
    const loadButton = document.createElement('button');
    loadButton.textContent = isLoading ? "Loading..." : "Load The Map";
    loadButton.style.marginLeft = "20px";
    loadButton.style.padding = "10px 20px";
    loadButton.style.backgroundColor = isLoading ? "#cccccc" : "purple";
    loadButton.style.color = "white";
    loadButton.style.border = "none";
    loadButton.style.borderRadius = "20px";
    loadButton.style.cursor = isLoading ? "not-allowed" : "pointer";
    loadButton.style.transition = "background-color 0.3s";
    loadButton.addEventListener('mouseover', (e) => {
      if (!isLoading) e.currentTarget.style.backgroundColor = "#6b46c1";
    });
    loadButton.addEventListener('mouseout', (e) => {
      if (!isLoading) e.currentTarget.style.backgroundColor = "purple";
    });
    loadButton.addEventListener('click', loadGeoTiff);
    
    // Assemble controls
    controls.appendChild(yearLabel);
    controls.appendChild(yearSelect);
    controls.appendChild(monthLabel);
    controls.appendChild(monthSelect);
    controls.appendChild(dataLabel);
    controls.appendChild(dataSelect);
    controls.appendChild(loadButton);
    
    // Assemble main container
    container.appendChild(mapContainer);
    container.appendChild(controls);
    
    document.body.appendChild(container);
    
    // Initialize map
    initMap();
  }

  // Initialize the map
  function initMap() {
    map = new maplibre.Map({
      container: mapContainer,
      style: 'https://demotiles.maplibre.org/style.json', // default style
      center: [0, 20],
      zoom: 2
    });
  }

  // Load GeoTIFF function
  async function loadGeoTiff() {
    if (!map) return;
    isLoading = true;
    updateButtonState();

    try {
      const monthNum = monthToNumber[selectedMonth];
      const fileName = `TROPOMI_${dataFields[selectedData]}_${selectedYear}_${monthNum}.tif`;
      const url = `https://raw.githubusercontent.com/ahsouri/ozonerates-geotifs/main/images/${fileName}`;

      // Remove existing layer if it exists
      if (map.getLayer('raster-layer')) {
        map.removeLayer('raster-layer');
        map.removeSource('raster-source');
      }

      // Fetch and parse GeoTIFF
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      const [minX, minY, maxX, maxY] = image.getBoundingBox();
      const rasterData = await image.readRasters();

      // Create canvas for the raster
      const canvas = document.createElement('canvas');
      canvas.width = rasterData.width;
      canvas.height = rasterData.height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(rasterData.width, rasterData.height);

      // Apply jet color scale
      for (let i = 0; i < rasterData[0].length; i++) {
        const value = rasterData[0][i];
        if (value === 0 || value === -9999) {
          // Transparent for no data
          imageData.data[i * 4 + 3] = 0;
          continue;
        }

        // Normalize value to jetColors index (adjust scale as needed)
        const normalized = Math.min(Math.max(value, 0), 255);
        const index = Math.floor((normalized / 255) * (jetColors.length - 1));
        const [r, g, b] = jetColors[index];
        
        imageData.data[i * 4] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = b;
        imageData.data[i * 4 + 3] = 178; // ~70% opacity
      }

      ctx.putImageData(imageData, 0, 0);
      const imageUrl = canvas.toDataURL();

      // Add raster source and layer
      map.addSource('raster-source', {
        type: 'image',
        url: imageUrl,
        coordinates: [
          [minX, maxY], // top-left
          [maxX, maxY], // top-right
          [maxX, minY], // bottom-right
          [minX, minY], // bottom-left
        ]
      });

      map.addLayer({
        id: 'raster-layer',
        type: 'raster',
        source: 'raster-source',
        paint: {
          'raster-opacity': 0.7
        }
      });

      // Fit bounds to the raster
      map.fitBounds([[minX, minY], [maxX, maxY]]);
      updateLegend();

    } catch (error) {
      console.error("Error loading GeoTIFF:", error);
      alert(`Error loading map: ${error.message}`);
    } finally {
      isLoading = false;
      updateButtonState();
    }
  }

  function updateButtonState() {
    const buttons = document.querySelectorAll('select, button');
    buttons.forEach(button => {
      button.disabled = isLoading;
    });
    const loadButton = document.querySelector('button');
    if (loadButton) {
      loadButton.textContent = isLoading ? "Loading..." : "Load The Map";
      loadButton.style.backgroundColor = isLoading ? "#cccccc" : "purple";
      loadButton.style.cursor = isLoading ? "not-allowed" : "pointer";
    }
  }

  function updateLegend() {
    if (!legendRef) return;
  
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
  
    legendRef.innerHTML = `
      <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2); border: 1px solid #ccc">
        <div style="background: linear-gradient(to right, ${gradient}); height: 25px; width: 250px; margin-bottom: 5px;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #333">
          <span>${min}</span><span>${mid}</span><span>${max}</span>
        </div>
        <div style="text-align: center; font-weight: bold; margin-top: 5px">${unit}</div>
      </div>
    `;
  }

  // Initialize the application
  createUI();
});