from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_KEY = "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"

class Texto(BaseModel):
    mensagem: str

@app.post("/melhorar")
def melhorar_texto(dados: Texto):
    prompt = f"""
Reescreva a mensagem abaixo para atendimento ao cliente.
Seja profissional, cordial, humano e objetivo.

Mensagem:
{dados.mensagem}
"""

    resposta = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    data = resposta.json()

    texto = data["choices"][0]["message"]["content"]

    return {"resposta": texto}
