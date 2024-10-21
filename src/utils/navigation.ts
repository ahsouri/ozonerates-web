// An array of links for navigation bar
const navBarLinks = [
  { name: "Home", url: "/" },
  { name: "Free Products", url: "/products" },
  { name: "About us", url: "/aboutus" },
  { name: "Contact", url: "/contact" },
];
// An array of links for footer
const footerLinks = [
//  {
//    section: "Ecosystem",
//    links: [
//      { name: "Documentation", url: "/welcome-to-docs/" },
//      { name: "Tools & Equipment", url: "/products" },
//      { name: "Construction Services", url: "/services" },
//    ],
//  },
  {
    section: "Shorcuts",
    links: [
      { name: "About us", url: "/aboutus" },
      { name: "Products", url: "/products" },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  x: "https://twitter.com/",
  github: "https://github.com/mearashadowfax/ScrewFast",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
