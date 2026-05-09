import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event);
  const { cv_json, oferta_trabajo } = body;

  if (!cv_json || !oferta_trabajo) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan datos' });
  }

  const env = event.context.cloudflare?.env;

  if (!env || !env.AI) {
    throw createError({ statusCode: 500, statusMessage: 'El entorno de IA no está disponible' });
  }

  // ==========================================
  // AQUÍ VA TU PROMPT DE ÉLITE (System Prompt)
  // ==========================================
  /* const systemPrompt = `Eres un Executive Recruiter de élite y un experto en optimización de sistemas ATS (Applicant Tracking Systems). 
Tu objetivo es tomar un CV base (en formato JSON) y reescribirlo para que haga "match" perfecto con una Oferta de Trabajo, maximizando las posibilidades de contratación.

REGLAS ESTRICTAS DE REDACCIÓN:
1. TONO PROFESIONAL: Usa un tono corporativo, persuasivo y orientado a resultados. Inicia las viñetas de experiencia con verbos de acción fuertes (ej. Desarrolló, Lideró, Optimizó, Diseñó).
2. FIDELIDAD ABSOLUTA (CERO ALUCINACIONES): TIENES ESTRICTAMENTE PROHIBIDO inventar habilidades, años de experiencia, herramientas, idiomas o títulos académicos que no existan en el CV original. 
3. REALCE ESTRATÉGICO: Si el candidato tiene una habilidad que se menciona en la oferta de trabajo, muévela hacia arriba, dale más visibilidad y reescribe la experiencia para que conecte directamente con las necesidades de la empresa.
4. FORMATO INQUEBRANTABLE: Debes devolver ÚNICA Y EXCLUSIVAMENTE un objeto JSON válido con la misma estructura que el original. No incluyas saludos, ni bloques de markdown (\`\`\`json), solo el objeto puro.`; */

  // ==========================================
  // AQUÍ VA TU PROMPT DE ÉLITE (System Prompt)
  // ==========================================
  const systemPrompt = `Actúas como el Algoritmo de un Sistema ATS (Applicant Tracking System) de Nivel Empresarial y un Consultor de Carreras de Élite.
Tu misión es tomar un CV base (en formato JSON) y adaptarlo estratégicamente a una Oferta de Trabajo específica. Debes garantizar el mayor "ATS Match Score" posible, adaptando el lenguaje del CV al lenguaje de la vacante, pero manteniendo una veracidad intachable.

REGLAS CRÍTICAS Y ESTRICTAS (DE CUMPLIMIENTO OBLIGATORIO):

1. OPTIMIZACIÓN ATS (KEYWORD MIRRORING):
   - Analiza la Oferta de Trabajo y extrae las palabras clave exactas (herramientas, metodologías, hard/soft skills).
   - Si el candidato posee una habilidad equivalente, RENÓMBRALA para que coincida de forma EXACTA y literal con el término de la oferta (ej. si el CV dice "React" y la oferta pide "React.js", cámbialo a "React.js").
   - Reorganiza el orden de los arrays (como listas de habilidades o viñetas de experiencia) para que los términos coincidentes con la oferta aparezcan en los primeros lugares.

2. FIDELIDAD ABSOLUTA (CERO ALUCINACIONES - TOLERANCIA CERO):
   - TIENES ESTRICTAMENTE PROHIBIDO inventar o añadir experiencia, herramientas, habilidades, títulos, empresas, años de trabajo o métricas que no existan en el CV original.
   - Tu trabajo es REESCRIBIR, REORGANIZAR y ENFATIZAR la información existente, NUNCA fabricar nueva. Si el candidato no cumple un requisito, ignóralo.

3. REDACCIÓN DE IMPACTO:
   - Reescribe las descripciones de experiencia enfocándote en logros, no solo en responsabilidades.
   - Usa verbos de acción fuertes y corporativos (ej. Arquitecturó, Lideró, Optimizó, Implementó).
   - Si el CV original incluye métricas o números, destácalos para cuantificar el impacto. No inventes números nuevos.

4. PRESERVACIÓN DEL ESQUEMA JSON:
   - Mantén EXACTAMENTE la misma estructura de llaves (keys) del JSON original. No agregues ni elimines propiedades.
   - Solo puedes modificar los valores (values) de texto (resúmenes, descripciones y el orden de los elementos).

5. RESTRICCIÓN DE SALIDA (FORMATO INQUEBRANTABLE):
   - Tu respuesta debe ser ÚNICA Y EXCLUSIVAMENTE un objeto JSON válido.
   - SIN preámbulos, SIN saludos, SIN conclusiones.
   - SIN bloques de código markdown (no uses \`\`\`json ni \`\`\`). 
   - El primer carácter de tu respuesta debe ser obligatoriamente "{" y el último "}".`;

  // 2. Construir los mensajes para la IA usando la variable anterior
  const messages = [
    {
      role: "system",
      content: systemPrompt // <--- AQUÍ ES DONDE LO INYECTAS
    },
    {
      role: "user",
      content: `--- OFERTA DE TRABAJO ---\n${oferta_trabajo}\n\n--- CV DEL CANDIDATO (JSON BASE) ---\n${JSON.stringify(cv_json)}`
    }
  ];

  // 3. Definir el modelo (Asegúrate de copiar el ID exacto desde tu panel de Cloudflare)
  const MODEL_ID = '@cf/openai/gpt-oss-120b'; // o '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

  // 4. Llamar a la IA
  try {
    const aiResponse = await env.AI.run(MODEL_ID, {
      messages: messages,
      max_tokens: 2500, // 🔴 LA SOLUCIÓN: Darle permiso para escribir textos largos
      temperature: 0.1
    });

    // 1. Extraer el texto de forma segura
    let textoIA = "";

    if (typeof aiResponse === 'string') {
      textoIA = aiResponse;
    } else if (aiResponse?.response) {
      textoIA = aiResponse.response;
    } else if (aiResponse?.choices?.[0]?.message) {
      const msg = aiResponse.choices[0].message;
      // Toma el contenido real, o si está vacío (null), toma sus pensamientos
      textoIA = msg.content || msg.reasoning_content || "";
    } else {
      throw new Error(`Estructura de respuesta desconocida: ${JSON.stringify(aiResponse)}`);
    }

    // 2. FILTRAR EL JSON
    const inicio = textoIA.indexOf('{');
    const fin = textoIA.lastIndexOf('}');

    if (inicio !== -1 && fin !== -1) {
      const jsonLimpio = textoIA.substring(inicio, fin + 1);
      return {
        success: true,
        resultado: JSON.parse(jsonLimpio)
      };
    } else {
      throw new Error(`La IA no devolvió JSON válido. Respuesta: ${textoIA}`);
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error de IA: ${error.message}`
    });
  }
});