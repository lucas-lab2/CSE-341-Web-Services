# Guia Completo para o Vídeo de Demonstração (Walk-through Video)

> **Regra Geral**: O vídeo deve ter **menos de 2 minutos** (menos de 120 segundos). Seja direto e siga o roteiro abaixo.

---

## Onde hospedar o vídeo
Grave usando **Loom** (recomendado, gera link direto), **OBS Studio** ou gravação de tela do Mac (`Cmd + Shift + 5`).
Se gravar localmente, envie para o **YouTube como Não Listado (Unlisted)** e teste o link em uma aba anônima.

---

## Roteiro Passo a Passo (Script para Ler no Vídeo)

### 1. Introdução (10 segundos)
- **O que mostrar**: Sua tela (navegador ou VS Code).
- **O que falar (Inglês)**:
  > *"Hi everyone, my name is Lucas Miranda, and this is my Week 1 Books Web Service demonstration for CSE 341."*

---

### 2. Demonstrar o Serviço Rodando no Render (50 segundos)
- **O que mostrar**: Abra o navegador com as abas do Render.
- **URL base**: `https://cse-341-web-services-2ox1.onrender.com`

- **Passo A — Buscar todos os livros (All Books)**:
  - Acesse: `https://cse-341-web-services-2ox1.onrender.com/books`
  - Mostre os 3 livros retornados em formato JSON (`b1`, `b2`, `b3`).
  - **Fale**: *"First, here is the `GET /books` endpoint hosted on Render. As you can see, it returns the complete list of books from MongoDB Atlas with HTTP status 200."*

- **Passo B — Buscar um único livro por ID (Single Book)**:
  - Acesse: `https://cse-341-web-services-2ox1.onrender.com/books/b1`
  - Mostre o livro retornado (ex: The Hobbit).
  - **Fale**: *"Next, querying a single book by ID at `/books/b1`. It successfully retrieves the specific book document."*

- **Passo C — Testar um ID inválido (Invalid Book)**:
  - Acesse: `https://cse-341-web-services-2ox1.onrender.com/books/invalid`
  - Mostre o JSON: `{"message": "Book not found"}` e abra o DevTools (F12 ou Inspecionar -> Rede/Network) para mostrar o status **404**.
  - **Fale**: *"Finally, when querying an invalid book ID like `/books/invalid`, the API returns a 404 status code with a JSON message saying 'Book not found'."*

---

### 3. Explicar o Controller no VS Code (50 segundos)
- **O que mostrar**: Abra o arquivo `src/controllers/booksController.js` no VS Code.

- **Aponte para a função `getBookById` e explique os 3 casos e os códigos de status**:
  - **Fale (Inglês)**:
    > *"Now in my code, here is the `getBookById` controller function in `booksController.js`:*
    > 
    > *1. **Success case**: We query the `books` collection using `findOne({ id: req.params.id })`. If the document is found, we return the book with **status 200 OK**, which is the standard HTTP status for a successful GET request.*
    > 
    > *2. **Not found case**: If `findOne` returns `null` or undefined, we return a **status 404 Not Found** with `{ message: 'Book not found' }`. We use 404 because the client requested a resource identifier that doesn't exist.*
    > 
    > *3. **Error case**: Everything is wrapped in a `try...catch` block. If the database connection drops or an unexpected error occurs, it catches it and responds with **status 500 Internal Server Error**, signaling an unexpected server-side failure.*"

---

### 4. Conclusão (10 segundos)
- **Fale (Inglês)**:
  > *"That covers the working hosted API, the controller implementation, and the status codes. Thank you for watching!"*

---

## Checklist Rápido Antes de Gravar:
- [ ] O serviço no Render está ativo e respondendo
- [ ] VS Code aberto em `src/controllers/booksController.js`
- [ ] Abas do navegador pré-abertas ou fáceis de digitar
- [ ] Duração total menor que 2 minutos
