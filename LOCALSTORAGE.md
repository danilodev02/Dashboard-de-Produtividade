# LocalStorage: como funciona

O `localStorage` e uma API do navegador para guardar pequenos dados em pares `chave -> valor`. Os dados ficam salvos no computador do usuario e permanecem mesmo depois de fechar o navegador.

---

# SessionStorage: como funciona

O `sessionStorage` e muito parecido com o `localStorage`, mas os dados **duram apenas enquanto a aba (ou janela) estiver aberta**. Quando a aba fecha, o navegador limpa os dados automaticamente.

## Caracteristicas principais

- Duracao: so vale durante a sessao da aba.
- Escopo: por dominio/origem (ex.: `https://meusite.com`).
- Limite: normalmente em torno de 5 a 10 MB por origem (varia por navegador).
- Tipo de dados: sempre texto (string). Objetos precisam de `JSON.stringify`.

## Metodos mais usados

- `sessionStorage.setItem(chave, valor)`
- `sessionStorage.getItem(chave)`
- `sessionStorage.removeItem(chave)`
- `sessionStorage.clear()`

## Exemplo simples

```js
// salvar
sessionStorage.setItem('tema', 'claro');

// ler
const tema = sessionStorage.getItem('tema');

// remover
sessionStorage.removeItem('tema');
```

## Salvando objetos

```js
const usuario = { nome: 'Ana', idade: 28 };
sessionStorage.setItem('usuario', JSON.stringify(usuario));

const salvo = JSON.parse(sessionStorage.getItem('usuario'));
```

## Quando usar SessionStorage

- Dados temporarios que nao precisam sobreviver ao fechamento da aba.
- Passar informacoes entre paginas do mesmo site durante uma navegacao unica.
- Estados de UI (filtros, rascunhos simples, abas abertas).

## Observacoes importantes

- `sessionStorage` so funciona em ambiente de navegador.
- Nao compartilha dados entre abas diferentes.
- Evite guardar dados sensiveis (senhas, tokens). O acesso e direto pelo JS.

## Caracteristicas principais

- Persistencia: os dados nao expiram automaticamente.
- Escopo: por dominio/origem (ex.: `https://meusite.com`).
- Limite: normalmente em torno de 5 a 10 MB por origem (varia por navegador).
- Tipo de dados: sempre texto (string). Objetos precisam de `JSON.stringify`.

## Metodos mais usados

- `localStorage.setItem(chave, valor)`
- `localStorage.getItem(chave)`
- `localStorage.removeItem(chave)`
- `localStorage.clear()`

## Exemplo simples

```js
// salvar
localStorage.setItem('tema', 'escuro');

// ler
const tema = localStorage.getItem('tema');

// remover
localStorage.removeItem('tema');
```

## Salvando objetos

  ```js
  const usuario = { nome: 'Ana', idade: 28 };
  localStorage.setItem('usuario', JSON.stringify(usuario));

  const salvo = JSON.parse(localStorage.getItem('usuario'));
  ```

  ## Observacoes importantes

- `localStorage` so funciona em ambiente de navegador.
- Alguns navegadores bloqueiam em modo anonimo ou com politicas de privacidade.
- Evite guardar dados sensiveis (senhas, tokens). O acesso e direto pelo JS.

## Exemplo de login/cadastro (didatico)

Este exemplo e **didatico** e mostra apenas como guardar um estado de login
e um cadastro simples no `localStorage`. Nao use para senhas reais.

```js
// cadastro simples (exemplo didatico)
function cadastrar(email, senha) {
  // NAO faca isso em apps reais
  const usuario = { email, senha };
  localStorage.setItem('usuario_demo', JSON.stringify(usuario));
  return true;
}



// login simples (exemplo didatico)
function login(email, senha) {
  const salvo = JSON.parse(localStorage.getItem('usuario_demo'));
  if (!salvo) return false;
  return salvo.email === email && salvo.senha === senha;
}

// uso
cadastrar('ana@email.com', '123456');
const ok = login('ana@email.com', '123456');
console.log('login ok?', ok);
```

Se quiser, posso adaptar o texto para o estilo do seu projeto ou adicionar exemplos usando seu codigo atual.
