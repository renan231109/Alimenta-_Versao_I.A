import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import Groq from 'groq-sdk';


dotenv.config({
  path: '.env.grooq'
});


const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface TriagemRequestBody {
  mensagem: string;
}

router.post('/triagem', async (req: Request<{}, {}, TriagemRequestBody>, res: Response) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem || !mensagem.trim()) {
      return res.status(400).json({
        erro: 'Mensagem não pode estar vazia.'
      });
    }

    const resposta = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente inteligente e amigável. Responda a qualquer pergunta de forma clara, precisa e útil. Você pode responder sobre o nosso site do Alimenta+, o Alimenta+ utiliza geolocalização, inteligência artificial, gamificação e análise de dados para conectar doadores (mercados, restaurantes, padarias) a famílias e ONGs, reduzir o desperdício de alimentos próprios para consumo, priorizar doações urgentes com a Food Rescue AI, gamificar a solidariedade com pontos e certificados digitais, demonstrar impacto social em tempo real, desenvolvido para apresentação em Feira de Ciências, simulando uma startup pronta para lançamento.'
        },
        {
          role: 'user',
          content: mensagem
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7
    });

    res.json({
      resposta: resposta.choices[0]?.message?.content ?? 'Sem resposta gerada.'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: 'Erro ao gerar resposta da IA.'
    });
  }
});

export default router;
