/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        main: "#EC602A",
        mainHover: "#FFDBCD",
        whiteHover: "#F4F4F4",
        grayDarkNavbar: "#807F7F",
        cardTokenDetailsCardDark: "#191919",
        grayLightNavbar: "#666666",
        titleGray: " #C5C5C5",
        grayCards: "#F9F9F9",
        whiteStakingLink: "#e8e8e8",
        whiteStakingLinkHover: "#e1e1e1",
        grayStakingLink: "#282828",
        grayStakingLinkHover: "#353535",
        darkText: "#E0E0E0",
        lightText: "#383838",
        darkBackground: "#1E1E1E",
        borderFooter: "#747474",
        cardGradientDark: "#161616",
      },
      borderWidth: {
        1: "0.5px",
      },
    },
  },
  plugins: [],
};
