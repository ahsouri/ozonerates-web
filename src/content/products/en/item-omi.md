---
title: 'OMI-based PO₃'
description: "Take advantage of the OMI long-term records of observations"
main:
  id: 1
  content: ""
  imgCard: "@/images/OMI_PO3.png"
  imgMain: "@/images/OMI_PO3.png"
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
  title: "A global product meets longevity over 15-years"
  subTitle: |
    Discover our product, designed for long-term research with global coverage. Using bias-corrected OMI HCHO and NO2 retrievals along with other geophysical variables, this product generates PO₃ estimates and sensitivity maps at a spatial resolution of 0.25x0.25 degrees, spanning the period from 2005 to 2019. Perfect for long-term analysis, it provides reasonable, comprehensive data for tracking locally produced trends and environmental impacts over nearly two decades. Ideal for researchers seeking to understand air quality dynamics over time.
  btnTitle: "Download the data"
  btnURL: "https://doi.org/10.7910/DVN/6QOCNF"
descriptionList:
  - title: "Bias-corrected OMI data"
    subTitle: "We have corrected TROPOMI VCD biases based on studies of Pinardi et al. (2021) and Ayazpour et al. (2025)."
  - title: "High temporal coverage"
    subTitle: "All aspects of the product are produced 2005-2019, suitable for anomaly detection and long-term trend analysis."
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
    subTitle: "2005-2019"
specificationsRight:
  - title: "Algorithm"
    subTitle: "A synergy of OMI, MINDS, aircraft, and ground-based remote sensing data is used in a fine-tuned 
     deep neural network algorithm"
  - title: "Key variables"
    subTitle: "PO3 (ozone production rates estimates within PBL), PO3_error (absolute error budget), PO3_NO2 (the sensivitity of PO3 to NO2, a proxy for reactive nitrogen), PO3_HCHO (the sensitivity of PO3 to HCHO, a proxy for VOC reactivity)"
  - title: "Error quantification"
    subTitle: "We have included the DNN estimate error, the column to the surface conversion error, and OMI unresolved and random errors into the equation to build confidence in our product."
documentation:
  title: "Please cite the following papers if you use our product in your research:"
  subTitle: "Reference: 1) Souri et al. (2025), Beyond HCHO/NO2: Ozonerates v1.0 Harnesses Satellite Data and Deep Learning to Provide Global Daily Net Ozone Production Rates and Sensitivity Maps Within Planetary Boundary Layer at ~1330 Local Standard Time (2005-2023)                 2) Souri, A. H., González Abad, G., Wolfe, G. M., Verhoelst, T., Vigouroux, C., Pinardi, G., Compernolle, S., Langerock, B., Duncan, B. N., and Johnson, M. S.: Feasibility of robust estimates of ozone production rates using a synergy of satellite observations, ground-based remote sensing, and models, Atmos. Chem. Phys., 25, 2061–2086, https://doi.org/10.5194/acp-25-2061-2025, 2025." 
  btnTitle: "Download the user guide"
  btnURL: "#"
blueprints:
  first: "@/images/blueprint-1.avif"
  second: "@/images/blueprint-2.avif"  
---
