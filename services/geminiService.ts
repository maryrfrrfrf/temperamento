import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserAnswer, TemperamentProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Knowledge Base: Melancólico
const MELANCHOLIC_KNOWLEDGE_BASE = `
CONTEXTO DE PROFUNDIDADE PARA MELANCÓLICO (Use como base, mas traduza para linguagem simples):

DORES – Interpessoal:
- Sentem-se não compreendidos ("Ninguém me entende").
- Sofrem com decepções pois criam roteiros mentais perfeitos que as pessoas não cumprem.
- Sentem falta de troca justa ("Eu me dou demais, recebo de menos").
- Sentem-se desvalorizados quando recebem conselhos rasos ("Para de drama").
- Nos relacionamentos, têm medo de se entregar e ser rejeitados, então às vezes se afastam.

DESEJOS – Interpessoal:
- Desejam ser ouvidos com profundidade, sem julgamentos rápidos.
- Querem lealdade absoluta.
- Preferem relacionamentos poucos, mas verdadeiros e seguros.

COMPORTAMENTOS – Interpessoal:
- Criam expectativas altas e se frustram fácil.
- Se isolam para se proteger.
- Dificuldade enorme com críticas (ficam lembrando daquilo por dias).
- Guardam tudo para si até não aguentar mais (o corpo acaba sentindo).

DORES – Intrapessoal:
- Dificuldade em confiar que as coisas vão dar certo sem o controle delas.
- Mente que não desliga ("Tempestade interna 24h").
- Se cobram demais, querem tudo perfeito.
- Sentimento de culpa e de "não ser bom o suficiente".
- Ficam remoendo erros do passado.

DESEJOS – Intrapessoal:
- Desejam paz mental e parar de pensar tanto.
- Querem transformar a sensibilidade em algo útil, e não só sofrimento.
- Querem sentir segurança para poder errar sem se punir.

COMPORTAMENTOS – Intrapessoal:
- Imaginam conversas e situações inteiras na cabeça antes de acontecerem.
- São perfeccionistas.
- Gostam de fugir para livros, séries ou mundos imaginários para descansar da realidade.
`;

// Knowledge Base: Sanguíneo
const SANGUINE_KNOWLEDGE_BASE = `
CONTEXTO DE PROFUNDIDADE PARA SANGUÍNEO (Use como base, mas traduza para linguagem simples):

DORES – Interpessoal:
- Sentem-se julgados como "imaturos" ou "bobos" por pessoas muito sérias.
- Acham que as pessoas só gostam deles quando estão felizes ou fazendo graça.
- Medo profundo de ficar sozinho ou ser excluído.
- Culpa por falar demais ou ferir alguém sem querer com uma brincadeira.

DESEJOS – Interpessoal:
- Querem ser amados pelo que são por dentro, não só pela alegria que trazem.
- Querem ser levados a sério.
- Querem conseguir manter relacionamentos estáveis, pois têm medo de enjoar ou perder o foco.
- Precisam de elogios e validação para se sentirem seguros.

COMPORTAMENTOS – Interpessoal:
- Falam bastante, tocam nas pessoas, ocupam o espaço.
- Quando estão tristes, fogem do assunto ou fazem piada para não chorar na frente dos outros.
- Fazem de tudo para agradar e deixar o ambiente leve.

DORES – Intrapessoal:
- Sofrem por começar mil coisas e não terminar nada.
- Se sentem meio "fúteis" ou sem profundidade comparados aos outros.
- Humor muda muito rápido (uma hora estão ótimos, na outra desanimam).
- Falam sem pensar e depois morrem de vergonha.

DESEJOS – Intrapessoal:
- Querem muito ter disciplina e foco.
- Querem aprender a pensar antes de agir.
- Querem mostrar que também têm sentimentos profundos e espirituais.

COMPORTAMENTOS – Intrapessoal:
- Mudam de hobby e interesse toda hora.
- Usam o riso como escudo.
- Tentam ser otimistas para não sofrer.
`;

// Knowledge Base: Colérico
const CHOLERIC_KNOWLEDGE_BASE = `
CONTEXTO DE PROFUNDIDADE PARA COLÉRICO (Use como base, mas traduza para linguagem simples):

DORES – Interpessoal:
- Sentem-se sozinhos porque acham difícil confiar tarefas aos outros ("Se eu não fizer, sai errado").
- Sofrem muito quando alguém tenta podar suas ideias ou controlá-los.
- Sentem culpa depois que explodem com alguém que amam.
- As pessoas acham que eles são "maus" ou "frios", mas eles só querem resolver os problemas rápido.

DESEJOS – Interpessoal:
- Querem ser reconhecidos como competentes, não como mandões.
- Querem poder ser firmes e diretos sem que as pessoas fiquem magoadas.
- Precisam de liberdade para agir.

COMPORTAMENTOS – Interpessoal:
- Tentam "salvar" todo mundo e resolver a vida de todos, e acabam exaustos.
- Ficam irritados com gente lenta ou indecisa.
- São muito leais: "Eu posso brigar com você, mas defendo você de qualquer um".

DORES – Intrapessoal:
- Acham que têm que carregar o mundo nas costas.
- Não conseguem relaxar (sentem culpa se ficam parados).
- Seguram a raiva para não parecerem descontrolados, e isso gera ansiedade.

DESEJOS – Intrapessoal:
- Querem ter mais paciência e calma.
- Querem usar a energia forte deles para construir coisas boas, não para brigar.
- Querem curar feridas do passado onde foram impedidos de liderar ou falar.

COMPORTAMENTOS – Intrapessoal:
- Vivem na velocidade 2x. Odeiam esperar.
- Têm muita energia, mas de repente "apagam" de cansaço.
- Querem aprender tudo sozinhos e rápido.
`;

const profileSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    primary: { type: Type.STRING, enum: ['Sanguíneo', 'Colérico', 'Melancólico', 'Fleumático'] },
    secondary: { type: Type.STRING, enum: ['Sanguíneo', 'Colérico', 'Melancólico', 'Fleumático'] },
    percentages: {
      type: Type.OBJECT,
      properties: {
        sanguine: { type: Type.NUMBER, description: "Porcentagem 0-100" },
        choleric: { type: Type.NUMBER, description: "Porcentagem 0-100" },
        melancholic: { type: Type.NUMBER, description: "Porcentagem 0-100" },
        phlegmatic: { type: Type.NUMBER, description: "Porcentagem 0-100" }
      },
      required: ["sanguine", "choleric", "melancholic", "phlegmatic"]
    },
    analysis: { type: Type.STRING, description: "Uma análise explicativa e acolhedora. Use linguagem simples. Evite termos acadêmicos difíceis." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 a 5 pontos fortes explicados de forma simples." },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 a 5 pontos de atenção explicados com empatia." },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Conselhos práticos para o dia a dia." }
  },
  required: ["primary", "secondary", "percentages", "analysis", "strengths", "weaknesses", "recommendations"]
};

export const analyzeTemperament = async (answers: UserAnswer[]): Promise<TemperamentProfile> => {
  const answersText = answers.map(a => `Situação: ${a.questionText}\nReação Escolhida: ${a.selectedOption}`).join('\n---\n');

  const prompt = `
    Analise as respostas deste teste de temperamento.
    
    === GUIA DE PERSONALIDADE (Use para entender o usuário) ===
    
    [MELANCÓLICO]
    ${MELANCHOLIC_KNOWLEDGE_BASE}

    [SANGUÍNEO]
    ${SANGUINE_KNOWLEDGE_BASE}

    [COLÉRICO]
    ${CHOLERIC_KNOWLEDGE_BASE}

    === INSTRUÇÃO DE TOM DE VOZ ===
    1. Fale como um mentor sábio e amigo, não como um livro de medicina.
    2. TRADUZA OS TERMOS:
       - Em vez de "Implosão psicossomática", diga "Você guarda tanto sentimento que seu corpo acaba sentindo dores ou cansaço".
       - Em vez de "Paranoia social", diga "Você fica imaginando que as pessoas estão te julgando".
       - Em vez de "Inconstância volitiva", diga "Você tem dificuldade de terminar o que começou".
    3. Seja assertivo, mas carinhoso. A pessoa precisa se sentir "lida", mas acolhida.
    4. FLEUMÁTICO: Se este for o resultado, descreva a "força tranquila". Fale sobre como a busca por paz às vezes faz a pessoa engolir sapos e perder oportunidades, e como sua diplomacia é um superpoder.

    RESPOSTAS DO USUÁRIO:
    ${answersText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        systemInstruction: `
          Você é especialista em comportamento humano. 
          Sua missão é explicar para uma pessoa leiga como funciona a mente dela baseada nos 4 temperamentos.
          
          Regra de Ouro: CLAREZA E EMPATIA.
          Não use "psiquês" ou palavras difíceis sem explicar. 
          Faça a pessoa ler e dizer: "Nossa, sou exatamente assim, e finalmente entendi porquê".
        `,
        responseMimeType: "application/json",
        responseSchema: profileSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    return JSON.parse(text) as TemperamentProfile;
  } catch (error) {
    console.error("Erro na análise de temperamento:", error);
    throw error;
  }
};