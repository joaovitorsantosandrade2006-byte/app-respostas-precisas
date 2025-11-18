import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Pergunta inválida" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um assistente educacional especializado em todas as matérias escolares e acadêmicas. 
          Forneça respostas precisas, detalhadas e educativas. 
          Explique conceitos de forma clara e didática, adequada para estudantes.
          Use exemplos quando apropriado.
          Mantenha um tom amigável e encorajador.
          Se a pergunta for sobre um tópico específico, forneça uma explicação completa mas concisa.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || "Não foi possível gerar uma resposta.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Erro na API de busca:", error);
    return NextResponse.json(
      { error: "Erro ao processar a pesquisa" },
      { status: 500 }
    );
  }
}
