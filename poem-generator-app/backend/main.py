from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

# Create the FastAPI app
app = FastAPI()

# Allow your frontend to talk to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up OpenAI (get API key from environment variable)
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

# Define what data we expect
class PoemRequest(BaseModel):
    topic: str = "nature"

# Create poem endpoint
@app.post("/generate-poem")
async def generate_poem(request: PoemRequest):
    try:
        client = openai.OpenAI(api_key=openai.api_key)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": f"Write a beautiful, short poem about {request.topic}. Make it inspiring and meaningful."}
            ],
            max_tokens=150
        )
        
        poem = response.choices[0].message.content
        return {"poem": poem}
    
    except Exception as e:
        return {"error": str(e)}

# Test endpoint
@app.get("/")
async def root():
    return {"message": "Poem generator backend is running!"}
