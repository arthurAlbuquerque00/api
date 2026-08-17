// Nome(s): SEU NOME AQUI    Tema: Jogos (nome, plataforma, nota)
const express = require('express');
const fs = require('fs');
const app = express();
const ARQUIVO = 'dados.json';

app.use(express.json()); // permite ler o corpo (body) em JSON

// Lê os itens do arquivo e retorna um array
function lerDados() {
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
}

// Salva o array de volta no arquivo
function salvarDados(itens) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(itens, null, 2));
}

// GET /itens -> lista todos (PRONTA)
app.get('/itens', (req, res) => {
  res.json(lerDados());
});

// GET /itens/:id -> retorna um item pelo id (404 se não existir)
app.get('/itens/:id', (req, res) => {
  const id = Number(req.params.id);
  const itens = lerDados();
  const item = itens.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: 'Item nao encontrado' });
  }

  res.json(item);
});

// POST /itens -> cria um novo item (PRONTA)
app.post('/itens', (req, res) => {
  const itens = lerDados();
  const novo = { id: Date.now(), ...req.body };
  itens.push(novo);
  salvarDados(itens);
  res.status(201).json(novo);
});

// PUT /itens/:id -> atualiza um item existente pelo id
app.put('/itens/:id', (req, res) => {
  const id = Number(req.params.id);
  const itens = lerDados();
  const item = itens.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: 'Item nao encontrado' });
  }

  Object.assign(item, req.body);
  salvarDados(itens);
  res.json(item);
});

// DELETE /itens/:id -> remove um item pelo id
app.delete('/itens/:id', (req, res) => {
  const id = Number(req.params.id);
  const itens = lerDados();
  const item = itens.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: 'Item nao encontrado' });
  }

  const itensAtualizados = itens.filter(i => i.id !== id);
  salvarDados(itensAtualizados);
  res.json({ mensagem: 'Item removido com sucesso', item });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
