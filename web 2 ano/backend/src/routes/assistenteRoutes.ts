import dotenv from 'dotenv';

dotenv.config({
  path: '.env.grooq'
});

import express, { Request, Response } from 'express';
import Groq from 'groq-sdk';

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
            'Você é um assistente inteligente e amigável. Responda a qualquer pergunta de forma clara, precisa e útil. Você pode responder sobre matemática, geografia, história, ciência, e praticamente qualquer tópico.'
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
