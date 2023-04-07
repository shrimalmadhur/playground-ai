from flask import Flask, request
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms.openai import OpenAI
from langchain.agents import AgentExecutor
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

db = SQLDatabase.from_uri("sqlite:///../db/sample.db")
toolkit = SQLDatabaseToolkit(db=db)

agent_executor = create_sql_agent(
    llm=OpenAI(temperature=0),
    toolkit=toolkit
)

@app.post('/query')
def query():
    params = request.get_json(force=True)
    return agent_executor.run(params["query"])