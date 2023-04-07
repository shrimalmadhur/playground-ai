## Playground AI
Playing with Langchain and OpenAPI

There are two envirornment file.
* One for indexer which is in the root (.env.example). You have to provide `ALCHEMY_API_KEY`
* One for server location in server folder. You have to provide `OPENAI_API_KEY`

### Indexer
Code to index Ethereum transaciton data

* If you are re-indexing the data, plase execute `make clean_db` to clean up and then recreate db.

### Python Notebook
iPython notebook to play around and test code

### Flask Server
Rest server for query the datbase using natural language.

#### Pre-req
* `pip3 install flask`
* `pip3 install python-dotenv`
* `pip3 install langchain`
* `pip3 install openai`

### Example request
```
curl --location 'http://localhost:5000/query' \
--header 'Content-Type: application/json' \
--data '{
    "query": "show me all ETH transactions"
}'
```