const path = require("path");

// Font configuration for the application
const fontConfig = {
  // Available fonts for certificate generation
  fonts: {
    Arial: {
      name: "Arial",
      family: "Arial",
      weight: "normal",
      style: "normal",
    },
    "Times New Roman": {
      name: "Times New Roman",
      family: "Times New Roman",
      weight: "normal",
      style: "normal",
    },
    "Courier New": {
      name: "Courier New",
      family: "Courier New",
      weight: "normal",
      style: "normal",
    },
    Verdana: {
      name: "Verdana",
      family: "Verdana",
      weight: "normal",
      style: "normal",
    },
    MyCustomAlexBrush: {
      name: "Alex Brush",
      family: "MyCustomAlexBrush",
      weight: "normal",
      style: "normal",
      file: "AlexBrush-Regular.ttf",
      woff2: "AlexBrush-Regular.woff2",
      isCustom: true,
    },
  },

  // Get font path for server-side rendering
  getFontPath: function (fontFamily) {
    const font = this.fonts[fontFamily];
    if (!font || !font.isCustom) {
      return null; // System font, no file needed
    }

    return path.join(__dirname, "../public/font", font.file);
  },

  // Get font CSS for client-side
  getFontCSS: function (fontFamily) {
    const font = this.fonts[fontFamily];
    if (!font || !font.isCustom) {
      return null; // System font, no CSS needed
    }

    return `
      @font-face {
        font-family: "${font.family}";
        src: url("/font/${font.woff2}") format("woff2"),
             url("/font/${font.file}") format("truetype");
        font-display: swap;
      }
    `;
  },

  // Add new custom font
  addCustomFont: function (fontName, fontFamily, fileName, woff2Name) {
    this.fonts[fontFamily] = {
      name: fontName,
      family: fontFamily,
      weight: "normal",
      style: "normal",
      file: fileName,
      woff2: woff2Name,
      isCustom: true,
    };
  },

  // Get all available fonts for dropdown
  getAvailableFonts: function () {
    return Object.keys(this.fonts).map((key) => ({
      value: key,
      name: this.fonts[key].name,
      isCustom: this.fonts[key].isCustom || false,
    }));
  },
};

module.exports = fontConfig;
