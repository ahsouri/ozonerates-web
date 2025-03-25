---
title: "TROPOMI-based PO₃"
description: "Leverage the TROPOMI high spatial resolution"
main:
  id: 3
  content: ""
  imgCard: "@/images/TROPOMI_PO3.png"
  imgMain: "@/images/TROPOMI_PO3.png"
  imgAlt: "TROPOMI-based PO₃"
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
  title: "A global product meets a fine resolution"
  subTitle: |
    Introducing our advanced air quality product, leveraging bias-corrected TROPOMI HCHO and NO2 retrievals to deliver reasonable global daily PO₃ estimates. This product offers high spatial resolution at 0.1x0.1 degrees, covering the period from 2018 to 2023, along with corresponding sensitivity maps. Ideal for researchers and environmental scientists, it provides reasonable accuracy and global coverage for tracking locally-prodcued ozone pollution and understanding its impacts.
  btnTitle: "Download the data"
  btnURL: "https://doi.org/10.7910/DVN/LTY8JT"
descriptionList:
  - title: "Bias-corrected TROPOMI data"
    subTitle: "We have meticulously corrected TROPOMI VCD biases using FTIR/MAX-DOAS observations."
  - title: "High-spatial resolution"
    subTitle: "All aspects of the product are produced at 0.1x0.1 degrees, suitable for urban air quality tracking."
  - title: "Valuable byproducts"
    subTitle: "In addition to PO₃ estimates, we have offered you sensitivity maps of PO3 to HCHO and NO2, and HCHO and NO2 mixing ratios near-the-surface derived from a synergy of TROPOMI and a state-of-the-art NASA's model"
specificationsLeft:
  - title: "Spatial Resolution"
    subTitle: "0.1x0.1 degrees (~ 10x10 km2)"
  - title: "Temporal Resolution"
    subTitle: "Daily at ~13:30 LST"
  - title: "Spatial Coverage"
    subTitle: "Global"
  - title: "Temporal Coverage"
    subTitle: "2018-2023"
specificationsRight:
  - title: "Algorithm"
    subTitle: "A synergy of TROPOMI, MINDS, aircraft, and ground-based remote sensing data is used in a fine-tuned 
     deep neural network algorithm"
  - title: "Key variables"
    subTitle: "PO3 (ozone production rates estimates within PBL), PO3_error (absolute error budget), PO3_NO2 (the sensivitity of PO3 to NO2, a proxy for NOx), PO3_HCHO (the sensitivity of PO3 to HCHO, a proxy for VOC reactivity)"
  - title: "Error quantification"
    subTitle: "We have included the DNN estimate error, the column to the surface conversion error, and TROPOMI unresolved and random errors into the equation to build confidence in our product."
documentation:
  title: "Please cite the following papers if you use our product in your research:"
  subTitle: "Reference: Souri et al., 2025, Souri et al. (2025), Beyond HCHO/NO2: Ozonerates v1.0 Harnesses Satellite Data and Deep Learning to Provide Global Daily Net Ozone Production Rates and Sensitivity Maps Within Planetary Boundary Layer at ~1330 Local Standard Time (2005-2023) Souri, A. H., González Abad, G., Wolfe, G. M., Verhoelst, T., Vigouroux, C., Pinardi, G., Compernolle, S., Langerock, B., Duncan, B. N., and Johnson, M. S.: Feasibility of robust estimates of ozone production rates using a synergy of satellite observations, ground-based remote sensing, and models, Atmos. Chem. Phys., 25, 2061–2086, https://doi.org/10.5194/acp-25-2061-2025, 2025." 
  btnTitle: "Download the user guide"
  btnURL: "#"
blueprints:
  first: "@/images/blueprint-1.avif"
  second: "@/images/blueprint-2.avif"  
---
