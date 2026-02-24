<template>
  <div class="saas-container">
    <header class="header">
      <h1>🚀 Adaptador de CV con IA</h1>
      <p>Pasa los filtros ATS adaptando tu experiencia al lenguaje de la oferta.</p>
    </header>

    <main class="grid-layout">
      <!-- Columna Izquierda: Entradas de Texto -->
      <div class="input-section">
        <div class="form-group">
          <label>Tu CV Base (Formato JSON):</label>
          <textarea 
            v-model="cvInput" 
            rows="12" 
            class="code-input"
            placeholder='{"nombre": "Tu nombre"...}'
          ></textarea>
        </div>

        <div class="form-group">
          <label>Oferta de Trabajo (Texto / Requisitos):</label>
          <textarea 
            v-model="jobInput" 
            rows="8"
            placeholder="Pega aquí la oferta de LinkedIn..."
          ></textarea>
        </div>

        <button @click="procesarCV" :disabled="isLoading" class="btn-primary">
          <span v-if="isLoading">✨ Pensando y reescribiendo... (puede tardar 10s)</span>
          <span v-else>⚡ Adaptar CV a la Oferta</span>
        </button>

        <!-- Mensaje de Error -->
        <div v-if="errorMessage" class="error-box">
          ❌ {{ errorMessage }}
        </div>
      </div>

      <!-- Columna Derecha: Resultado -->
      <div class="output-section">
        <label>CV Adaptado (Resultado JSON):</label>
        
        <div v-if="isLoading" class="loading-state">
          <div class="pulse"></div>
          <p>La IA está analizando las palabras clave y redactando como un profesional de RRHH...</p>
        </div>
        
        <pre v-else-if="resultData" class="result-box">{{ JSON.stringify(resultData, null, 2) }}</pre>
        
        <div v-else class="empty-state">
          <p>Tu CV optimizado aparecerá aquí...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- DATOS DE PRUEBA PRECARGADOS ---
// Un CV muy básico (sin mentiras, pero redactado de forma muy simple)
const cvDePrueba = {
  "datos_personales": {
    "nombre": "Alexx Dev",
    "titulo": "Programador"
  },
  "habilidades": ["JavaScript", "React", "CSS", "Git", "Trabajo en equipo"],
  "experiencia": [
    {
      "puesto": "Desarrollador Web",
      "empresa": "Agencia XYZ",
      "descripcion": "Hice páginas web con React. Ayudé a que la página cargara más rápido. Trabajé con los diseñadores para hacer la interfaz."
    }
  ]
}

// Una oferta de trabajo que pide lo mismo, pero con lenguaje corporativo/profesional
const ofertaDePrueba = `Buscamos un Frontend Software Engineer.
Requisitos clave:
- Experiencia sólida desarrollando interfaces de usuario complejas utilizando React.js.
- Pasión por la optimización de rendimiento (performance) en aplicaciones web.
- Capacidad de colaboración cross-funcional con equipos de UI/UX.
- Dominio del control de versiones (Git).`

// --- ESTADOS DE LA APP ---
const cvInput = ref(JSON.stringify(cvDePrueba, null, 2))
const jobInput = ref(ofertaDePrueba)
const resultData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// --- FUNCIÓN PRINCIPAL ---
const procesarCV = async () => {
  errorMessage.value = ''
  resultData.value = null
  
  // 1. Validar que el usuario no haya roto el JSON en el textarea
  let parsedCv = null;
  try {
    parsedCv = JSON.parse(cvInput.value)
  } catch (e) {
    errorMessage.value = 'El CV base no es un JSON válido. Revisa las comillas o comas.'
    return
  }

  if (!jobInput.value.trim()) {
    errorMessage.value = 'Por favor, ingresa una oferta de trabajo.'
    return
  }

  isLoading.value = true

  // 2. Llamar a nuestro backend de Nuxt (que conecta con Cloudflare AI)
  try {
    const response = await $fetch('/api/adapter-cv', {
      method: 'POST',
      body: {
        cv_json: parsedCv,
        oferta_trabajo: jobInput.value
      }
    })

    if (response && response.success) {
      resultData.value = response.resultado
    } else {
      errorMessage.value = 'Ocurrió un error inesperado al recibir los datos.'
    }
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || 'Error de conexión con la IA.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ESTILOS BÁSICOS PARA QUE LUZCA PROFESIONAL */
.saas-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #111;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  box-sizing: border-box;
}

.code-input {
  font-family: monospace;
  background-color: #f9f9f9;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #333;
}

.btn-primary:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.error-box {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  border: 1px solid #f87171;
}

.output-section {
  display: flex;
  flex-direction: column;
}

.result-box {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  overflow-x: auto;
  flex-grow: 1;
  margin: 0;
  white-space: pre-wrap;
}

.empty-state {
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: #6b7280;
  min-height: 300px;
}

.loading-state {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: #475569;
  min-height: 300px;
  text-align: center;
  padding: 2rem;
}

/* Animación de carga */
.pulse {
  width: 40px;
  height: 40px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  margin-bottom: 1rem;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Diseño responsivo para móviles */
@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>