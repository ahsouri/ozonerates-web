---
title: 'OMI-based PO₃'
description: "Take advantage of the OMI long-term records of observations"
main:
  id: 3
  content: ""
  imgCard: "@/images/coming_soon.jpg"
  imgMain: "@/images/coming_soon.jpg"
  imgAlt: "OMI-based PO₃"
tabs:
  - id: "tabs-with-card-item-1"
    dataTab: "#tabs-with-card-1"
    title: "Description"
  - id: "tabs-with-card-item-2"
    dataTab: "#tabs-with-card-2"
    title: "Specifications"
  - id: "tabs-with-card-item-3"
    dataTab: "#tabs-with-card-3"
    title: "Documentation and References"
longDescription:
  title: "A global product meets longevity over 20-years"
  subTitle: |
    Discover our cutting-edge air quality analysis tool, designed for long-term research with global coverage. By utilizing bias-corrected OMI HCHO and NO2 retrievals, this product generates PO₃ estimates and sensitivity maps at a spatial resolution of 0.25x0.25 degrees, spanning the period from 2005 to 2024. Perfect for long-term analysis, it provides reliable, comprehensive data for tracking ozone trends and environmental impacts over nearly two decades. Ideal for researchers seeking to understand air quality dynamics over time.
  btnTitle: "Download the data"
  btnURL: "#"
descriptionList:
  - title: "Bias-corrected OMI data"
    subTitle: "We have corrected TROPOMI VCD biases based on studies of Pinardi et al. (2021) and Ayazpour et al. (2024)."
  - title: "High temporal coverage"
    subTitle: "All aspects of the product are produced 2005-2024, suitable for anomaly detection and long-term trend analysis."
  - title: "Valuable byproducts"
    subTitle: "In addition to PO3 estimates, we have offered you sensitivity maps of PO₃ to HCHO and NO2, and HCHO and NO2 mixing ratios near-the-surface derived from a synergy of OMI and a state-of-the-art NASA's model"
specificationsLeft:
  - title: "Spatial Resolution"
    subTitle: "0.25x0.25 degrees (~ 25x25 km2)"
  - title: "Temporal Resolution"
    subTitle: "Daily at ~13:30 LST"
  - title: "Spatial Coverage"
    subTitle: "Global"
  - title: "Temporal Coverage"
    subTitle: "2005-2024"
specificationsRight:
  - title: "Algorithm"
    subTitle: "A synergy of OMI, MINDS, aircraft, and ground-based remote sensing data is used in a fine-tuned 
     deep neural network algorithm"
  - title: "Key variables"
    subTitle: "PO3 (ozone production rates estimates within PBL), PO3_error (absolute error budget), PO3_NO2 (the sensivitity of PO3 to NO2, a proxy for NOx), PO3_HCHO (the sensitivity of PO3 to HCHO, a proxy for VOC reactivity)"
  - title: "Error quantification"
    subTitle: "We have included the DNN estimate error, the column to the surface conversion error, and OMI unresolved and random errors into the equation to build confidence in our product."
documentation:
  title: "Please cite the following papers if you use our product in your research:"
  subTitle: "Reference: Souri et al., 2025, blah blah blah, Journal of Blahgggggggggggggggggggggggggggggggggggggggggg" 
  btnTitle: "Download the user guide"
  btnURL: "#"
blueprints:
  first: "@/images/blueprint-1.avif"
  second: "@/images/blueprint-2.avif"  
---
