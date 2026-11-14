# Minha Biblioteca

Sistema de gerenciamento de uma biblioteca universitária desenvolvido em C# com ASP.NET Core Web API e um front-end em HTML, Bootstrap e JavaScript.

O projeto permite cadastrar, consultar, atualizar e excluir livros e revistas. A API mantém os dados em memória e o front-end consome seus endpoints usando `fetch`.

## Integrantes

Preencha com os integrantes da equipe:

1. Samuel Rodrigues Magro RGM: 114.021

## Objetivos do projeto

- Criar uma Web API para gerenciar materiais de uma biblioteca.
- Aplicar herança, abstração, encapsulamento e polimorfismo.
- Utilizar uma interface para representar a capacidade de empréstimo.
- Separar o acesso aos dados usando Repository Pattern.
- Usar injeção de dependência e `Singleton`.
- Criar uma interface web responsiva para consumir a API.
- Praticar DOM, eventos, formulários, validação e requisições HTTP.

## Organização do projeto

```text
MinhaBiblioteca/
├── Controllers/
│   └── MateriaisController.cs
├── Models/
│   ├── IEmprestimo.cs
│   ├── Livro.cs
│   ├── MaterialBiblioteca.cs
│   └── Revista.cs
├── Repositories/
│   ├── IMaterialRepository.cs
│   └── MaterialRepository.cs
├── Properties/
│   └── launchSettings.json
├── front/
│   ├── index.html
│   └── script.js
├── MinhaBiblioteca.csproj
├── Program.cs
└── README.md
```

## Endpoints da API

Neste projeto, a rota configurada no controller é `/api/`.

| Método | Endpoint | Função |
|---|---|---|
| `GET` | `/api/` | Lista todos os materiais |
| `GET` | `/api/{id}` | Consulta um material pelo ID |
| `POST` | `/api/livro` | Cadastra um livro |
| `POST` | `/api/revista` | Cadastra uma revista |
| `PUT` | `/api/livro/{id}` | Atualiza um livro |
| `PUT` | `/api/revista/{id}` | Atualiza uma revista |
| `DELETE` | `/api/{id}` | Exclui um material |
| `GET` | `/api/{id}/descricao` | Retorna descrição e prazo de empréstimo |
| `POST` | `/api/{id}/emprestar` | Tenta realizar um empréstimo |

O ID é gerado pela API no cadastro. Os dados ficam sujeitos às seguintes validações:

- título obrigatório;
- ano de publicação maior ou igual a zero;
- autor obrigatório e páginas maiores que zero para livros;
- edição maior que zero e mês entre 1 e 12 para revistas.

## Front-end

O front-end está na pasta `front` e contém uma tela para:

- listar livros e revistas;
- cadastrar livros e revistas;
- atualizar materiais;
- excluir materiais após confirmação;
- exibir mensagens de sucesso e erro;
- mostrar os campos correspondentes ao tipo escolhido.

O JavaScript utiliza `querySelector`, `classList`, `textContent`, eventos de formulário, `preventDefault`, validação dos dados e `fetch` com `GET`, `POST`, `PUT` e `DELETE`.

O Bootstrap é utilizado nos cards, formulário, grid responsivo, botões, alertas, tabela e classes de espaçamento. Os campos possuem `label` associado e a página usa layout responsivo.

A URL configurada atualmente em `front/script.js` é:

```javascript
const URL_API = "http://localhost:5215/api";
```

Se a API for executada em outra porta, altere essa constante.

## Como executar a API

Na raiz do projeto, execute:

```bash
dotnet run
```

Com a aplicação em execução, o Swagger pode ser acessado em:

```text
https://localhost:7194/swagger
```

ou na URL HTTPS apresentada pelo terminal.

## Como executar o front-end

1. Inicie a API.
2. Abra a pasta `front` no Visual Studio Code.
3. Abra `index.html` com o Live Server ou outro servidor local.
4. Confirme se `URL_API` aponta para a porta da API em execução.

O front-end depende da API estar ativa e utiliza a política de CORS configurada no `Program.cs`.

## Dificuldades encontradas

Descreva aqui as dificuldades reais da equipe e como elas foram resolvidas. Alguns exemplos de assuntos que podem ser relatados:

- configuração da porta da API e do CORS;
- comunicação entre o front-end e a API;
- atualização do formulário para livro e revista;
- tratamento de respostas de erro;
- criatividade e logica na construcao da pagina com o JS;
