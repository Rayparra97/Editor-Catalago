import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Sliders, Check, Key, Eye, EyeOff, RefreshCw, Layers, ShieldCheck, Download } from 'lucide-react';

export default function App() {
  // Estados de Configuración y API
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  // Estados del Flujo (3 Pasos)
  const [backgroundType, setBackgroundType] = useState('default'); // 'default' o 'custom'
  const [customBgImage, setCustomBgImage] = useState(null);
  const [workImage, setWorkImage] = useState(null);
  
  // Estados de Procesamiento y Resultado
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [originalResult, setOriginalResult] = useState(null);
  const [activeColor, setActiveColor] = useState('original');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Referencias de archivos
  const bgInputRef = useRef(null);
  const workInputRef = useRef(null);

  // Guardar API Key
  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', tempKey);
    setApiKey(tempKey);
    setShowSettings(false);
  };

  // Cargar imagen de fondo personalizada
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBgImage(reader.result);
        setBackgroundType('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Cargar foto del trabajo (taller)
  const handleWorkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkImage(reader.result);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función principal con IA de Gemini (Blindaje estricto de diseño y herrajes)
  const handleGenerateCatalog = async () => {
    if (!apiKey) {
      setShowSettings(true);
      alert('Por favor ingresa tu API Key de Google AI Studio en el ícono de ajustes (⚙️).');
      return;
    }
    if (!workImage) {
      alert('Sube o selecciona primero la foto del trabajo de herrería.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Analizando geometría y protegiendo herrajes originales...');

    try {
      // Prompt optimizado con restricciones severas de no invención y fidelidad absoluta
      const promptText = `
You are an expert architectural visualization AI and master metalwork catalog editor. Your task is to process a workshop photo of a custom metal door or window and place it into a professional showroom catalog background with absolute geometric and structural fidelity.

CRITICAL INSTRUCTIONS:
1. ZERO INVENTIONS / STRICT REPLICATION: You MUST NOT invent, add, modify, or remove any structural elements, metal bars, square reliefs, or decorative panels from the door or window in the source image. The metal structure must be copied 1inia-for-line (milimetrically identical) to the input photo.
2. HARDWARE SHIELDING: The lock mechanism, handle (manillón), hinges, and hanging keys with tags MUST remain 100% untouched and identical to the original workshop photo. Do not alter their position, shape, or details.
3. SMOKED MIRROR GLASS ("papel ahumado espejo"): Transform all glass panels into elegant dark smoked glass with a subtle, realistic mirror reflection effect, maintaining transparency depth.
4. SCENERY INTEGRATION (89% Wood / 11% Marble): Place the isolated door/window strictly straight and centered (front alzada frontal view, 100% plumb). The background consists of a vertical wood slat wall (occupying the upper 89%) and a white-gray veined marble porcelain floor (occupying the lower 11%). 
5. GROUND CONTACT: Position the bottom frame support legs exactly at the junction line between the wood wall and the marble floor, casting a natural, subtle contact shadow. No exaggerated or fake mirror floor reflections.
6. OUTPUT: Return only the final high-resolution catalog-ready edited image.
      `;

      // Llamada directa a la API de Gemini Flash con soporte de imágenes
      const response = await fetch(`
