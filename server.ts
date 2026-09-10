import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily if key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- API ROUTES ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "MendelMind", version: "1.0.0" });
});

// 1. Educational AI Tutor
app.post("/api/gemini/tutor", async (req, res) => {
  try {
    const { question, subject, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Falta la pregunta o tema." });
    }

    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `Eres MendelMind IA, un tutor virtual cálido, motivador y pedagógico para estudiantes de 6.º de primaria (11-12 años).
Tus reglas de oro:
1. Explica con lenguaje claro, accesible, amigable y ejemplos de la vida diaria apropiados para 6.° de primaria.
2. NUNCA des simplemente la respuesta final de una tarea de forma directa; guía al estudiante paso a paso con el procedimiento, dando pistas e invitándolo a reflexionar.
3. Si el estudiante comete un error o duda, anímalo amablemente y explica el 'por qué'.
4. Estructura tus respuestas con emojis agradables, pasos numerados o viñetas cortas.
5. Materias principales: Matemática, Comunicación, Ciencia y Tecnología, Personal Social, Inglés, Arte y Cultura, Educación Física.
6. Mantén un tono entusiasta, felicitando el esfuerzo del estudiante.`;

      // Build contents
      const prompt = `Curso: ${subject || "General"}\nPregunta o duda del estudiante: ${question}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text });
    } else {
      // High-quality contextual fallback
      const fallbackReplies: Record<string, string> = {
        Matemática: `¡Excelente pregunta de Matemática! 🧠✨\n\nPara resolver este tipo de problema, recordemos el procedimiento paso a paso:\n\n1. **Identifica los datos:** ¿Qué números tenemos y qué nos pide encontrar el problema?\n2. **El truco clave:** Si estamos trabajando con fracciones o ecuaciones, recuerda que lo que hacemos en un lado o en el numerador, debemos equilibrarlo.\n3. **Pista de oro:** Si sumas fracciones con distinto denominador, primero busca el Mínimo Común Múltiplo (MCM).\n\n¿Quieres que probemos con un ejemplo con números más sencillos juntos? ¡Tú puedes lograrlo! 💪`,
        "Ciencia y Tecnología": `¡Qué curiosidad tan científica tienes! 🔬🌱\n\nEn Ciencia y Tecnología de 6.º de primaria, este fenómeno se explica así:\n\n- **La idea principal:** En la naturaleza, todos los elementos están interconectados.\n- **Un ejemplo cotidiano:** Piensa en cómo las plantas realizan la fotosíntesis usando la luz solar, agua y dióxido de carbono para producir su propio alimento y liberar oxígeno.\n- **Pregunta para ti:** ¿Qué crees que pasaría si cambiáramos uno de esos elementos? ¡Pruébalo mentalmente y me cuentas! 🚀`,
        default: `¡Hola! Soy tu tutor MendelMind IA. 🌟\n\nMe encanta que investigues y quieras aprender más. Para este tema de 6.° de primaria:\n\n1. **Paso 1:** Lee bien el concepto clave.\n2. **Paso 2:** Busca relacionarlo con algo que ves en tu día a día.\n3. **Paso 3:** Realiza un ejercicio corto para afianzar la memoria.\n\n¿Qué parte específica te parece más desafiante para que te dé una pista genial? ¡Vamos paso a paso! ✨`,
      };

      const reply = fallbackReplies[subject] || fallbackReplies.default;
      return res.json({ reply });
    }
  } catch (err: any) {
    console.error("Error in /api/gemini/tutor:", err);
    return res.status(500).json({
      error: "No se pudo generar la respuesta en este momento.",
      fallback: "¡Tu tutor MendelMind IA está listo! Recuerda repasar las notas del tema y formular tu pregunta paso a paso."
    });
  }
});

// 2. Quiz Generator
app.post("/api/gemini/quiz", async (req, res) => {
  try {
    const { course = "Matemática", topic = "Fracciones", questionCount = 5, difficulty = "Media" } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Genera un cuestionario educativo para un estudiante de 6.º de primaria (11-12 años).
Curso: ${course}
Tema: ${topic}
Dificultad: ${difficulty}
Cantidad de preguntas: ${questionCount}

IMPORTANTE: Incluye variedad de tipos de preguntas:
- "multiple_choice" (4 opciones: A, B, C, D)
- "true_false" (Verdadero o Falso)
- "fill_blank" (Completar con palabra clave)
- "short_answer" (Pregunta conceptual corta)

Devuelve ÚNICAMENTE un arreglo JSON válido con el siguiente formato estricto (sin formato markdown adicional ni texto fuera del JSON):
[
  {
    "id": 1,
    "type": "multiple_choice",
    "question": "¿Pregunta clara?",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": "Opción A",
    "explanation": "Explicación didáctica y amigable de por qué esta es la respuesta correcta."
  },
  {
    "id": 2,
    "type": "true_false",
    "question": "Afirmación para evaluar...",
    "options": ["Verdadero", "Falso"],
    "correctAnswer": "Verdadero",
    "explanation": "Explicación didáctica..."
  },
  {
    "id": 3,
    "type": "fill_blank",
    "question": "Las fracciones que tienen el mismo denominador se llaman fracciones _______.",
    "options": ["Homogéneas", "Heterogéneas", "Impropias", "Mixtas"],
    "correctAnswer": "Homogéneas",
    "explanation": "Homogéneas significa que comparten el mismo denominador."
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const text = response.text || "[]";
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ questions: parsed });
    } else {
      // Fictional realistic 6th grade curriculum questions
      const mathQuestions = [
        {
          id: 1,
          type: "multiple_choice",
          question: "¿Cuál es el resultado de sumar 2/5 + 1/5?",
          options: ["3/5", "3/10", "2/10", "1/5"],
          correctAnswer: "3/5",
          explanation: "Al sumar fracciones con el mismo denominador (homogéneas), se suman directamente los numeradores: 2 + 1 = 3, manteniendo el 5 en el denominador."
        },
        {
          id: 2,
          type: "true_false",
          question: "La fracción 7/4 es una fracción impropia porque el numerador es mayor que el denominador.",
          options: ["Verdadero", "Falso"],
          correctAnswer: "Verdadero",
          explanation: "¡Correcto! Una fracción impropia representa más de un entero completo, por eso su numerador es mayor o igual que el denominador."
        },
        {
          id: 3,
          type: "fill_blank",
          question: "Para simplificar la fracción 12/18 dividimos tanto el numerador como el denominador entre su máximo común divisor, que es el número _______.",
          options: ["6", "2", "3", "9"],
          correctAnswer: "6",
          explanation: "El máximo divisor común de 12 y 18 es 6. 12 ÷ 6 = 2 y 18 ÷ 6 = 3, quedando la fracción irreductible 2/3."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "¿Qué fracción es equivalente a 3/4?",
          options: ["6/8", "5/6", "9/10", "4/3"],
          correctAnswer: "6/8",
          explanation: "Multiplicando tanto el numerador como el denominador por 2: 3 × 2 = 6 y 4 × 2 = 8, por lo que 6/8 es exactamente equivalente a 3/4."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Si tienes 3/4 de una pizza y comes 1/2 (que equivale a 2/4), ¿cuánta pizza te queda?",
          options: ["1/4", "1/2", "2/4", "1/8"],
          correctAnswer: "1/4",
          explanation: "Restamos 3/4 - 2/4 = 1/4. Te queda un cuarto de pizza para más tarde."
        }
      ];

      return res.json({ questions: mathQuestions.slice(0, Number(questionCount) || 5) });
    }
  } catch (err) {
    console.error("Error in /api/gemini/quiz:", err);
    return res.status(500).json({ error: "Error al generar cuestionario con IA" });
  }
});

// 3. Smart Study Plan Generator
app.post("/api/gemini/study-plan", async (req, res) => {
  try {
    const { upcomingExams = [], tasks = [], weakAreas = [] } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Como MendelMind IA para 6.º de primaria, crea un plan de estudio semanal equilibrado ("Mi plan inteligente").
Exámenes próximos: ${JSON.stringify(upcomingExams)}
Tareas pendientes: ${JSON.stringify(tasks)}
Áreas que necesitan refuerzo: ${JSON.stringify(weakAreas)}

Devuelve ÚNICAMENTE un objeto JSON estructurado con:
{
  "summary": "Breve mensaje motivacional para la semana",
  "weeklyTargetMinutes": 180,
  "dailySchedule": [
    {"day": "Lunes", "course": "Matemática", "topic": "Fracciones y decimales", "durationMinutes": 25, "tip": "Usa papel para dibujar los gráficos."},
    {"day": "Martes", "course": "Comunicación", "topic": "Comprensión lectora", "durationMinutes": 20, "tip": "Subraya las palabras desconocidas."},
    {"day": "Miércoles", "course": "Ciencia y Tecnología", "topic": "Ecosistemas", "durationMinutes": 25, "tip": "Haz un mapa conceptual rápido."},
    {"day": "Jueves", "course": "Personal Social", "topic": "Culturas preincas", "durationMinutes": 20, "tip": "Repasa las fechas clave."},
    {"day": "Viernes", "course": "Repaso general", "topic": "Cuestionario de prueba", "durationMinutes": 20, "tip": "¡Prepárate para el fin de semana con tranquilidad!"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } else {
      return res.json({
        summary: "¡Plan inteligente optimizado! Enfocado en reforzar Fracciones antes de tu examen del próximo martes.",
        weeklyTargetMinutes: 110,
        dailySchedule: [
          { day: "Lunes", course: "Matemática", topic: "Suma y resta de fracciones", durationMinutes: 20, tip: "Prueba el cuestionario rápido en MendelMind." },
          { day: "Martes", course: "Comunicación", topic: "Textos argumentativos", durationMinutes: 15, tip: "Identifica la idea principal del autor." },
          { day: "Miércoles", course: "Ciencia y Tecnología", topic: "Célula animal y vegetal", durationMinutes: 25, tip: "Repasa los organelos con tarjetas." },
          { day: "Jueves", course: "Matemática", topic: "Problemas con fracciones", durationMinutes: 25, tip: "Dedica 15 minutos en Modo Concentración." },
          { day: "Viernes", course: "Repaso General", topic: "Revisión de tareas y trivia", durationMinutes: 25, tip: "¡Gana tus PapelPuntos de fin de semana!" }
        ]
      });
    }
  } catch (err) {
    console.error("Error in /api/gemini/study-plan:", err);
    return res.status(500).json({ error: "Error al generar plan de estudio" });
  }
});

// 4. Smart Insights and Recommendations
app.post("/api/gemini/recommendations", async (req, res) => {
  try {
    const { studentStats } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Analiza las estadísticas de este estudiante de 6.º de primaria: ${JSON.stringify(studentStats)}.
Genera 3 recomendaciones breves, empáticas y muy prácticas para mejorar sus hábitos y estudio.
Devuelve un arreglo JSON de cadenas: ["recomendación 1", "recomendación 2", "recomendación 3"]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ recommendations: parsed });
    } else {
      return res.json({
        recommendations: [
          "Has tenido dificultades con fracciones en dos cuestionarios. Te recomendamos practicar 15 minutos hoy para dominarlo.",
          "Esta semana redujiste tu tiempo de YouTube en 25 minutos. ¡Excelente autocontrol!",
          "Llevas 2 días sin practicar Comunicación. ¿Qué tal un cuestionario express de 5 preguntas?"
        ]
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MendelMind server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
