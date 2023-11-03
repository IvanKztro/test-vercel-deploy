/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#3D3EB4",
          secondary: "#22367D",
          neutral: "#D7E749",
          success: "#36D399",
          info: "#3ABFF8",
          warning: "#FBBD23",
          error: "#EC486E",
          accent: "#362BAD",
          accent2: "#3D3EB480",
          accent3: "#5018B7",
          accent4: "#633DB4",
          "base-100": "#FFFFFF",
          "base-200": "#C3C8CE",
        },
      },
    ],
  },
};
