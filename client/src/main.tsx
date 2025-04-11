import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";

// Import fonts
const importFonts = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap';
  document.head.appendChild(link);
  
  // Font Awesome
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  document.head.appendChild(faLink);
};

// Update document title
document.title = "EcoPoints - Gamifying Carbon Neutrality";
importFonts();

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
