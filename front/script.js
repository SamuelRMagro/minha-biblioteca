const URL_API = "http://localhost:5215/api";

const listaMateriais = document.querySelector("#lista-materiais");
const btnCarregar = document.querySelector("#btn-carregar");
const statusLista = document.querySelector("#status-lista");

const formulario = document.querySelector("#form-material");
const tipo = document.querySelector("#tipo");
const titulo = document.querySelector("#titulo");
const ano = document.querySelector("#ano");
const autor = document.querySelector("#autor");
const paginas = document.querySelector("#paginas");
const edicao = document.querySelector("#edicao");
const mes = document.querySelector("#mes");
const camposLivro = document.querySelector("#campos-livro");
const camposRevista = document.querySelector("#campos-revista");
const statusFormulario = document.querySelector("#status-formulario");
const saidaFormulario = document.querySelector("#saida-formulario");
const formBadge = document.querySelector("#form-badge");
const formTitulo = document.querySelector("#form-titulo");
const btnSalvar = document.querySelector("#btn-salvar");
const btnCancelar = document.querySelector("#btn-cancelar");

let idEditando = null;

function mostrarStatus(elemento, mensagem, tipoMensagem) {
  elemento.textContent = mensagem;
  elemento.className = `alert alert-${tipoMensagem} mt-3`;
}

function mostrarErro(elemento, erro) {
  elemento.textContent = erro.message;
}

function mudarCampos() {
  const livroSelecionado = tipo.value === "livro";

  camposLivro.classList.toggle("d-none", !livroSelecionado);
  camposRevista.classList.toggle("d-none", livroSelecionado);

  autor.required = livroSelecionado;
  paginas.required = livroSelecionado;
  edicao.required = !livroSelecionado;
  mes.required = !livroSelecionado;
}

function limparFormulario() {
  formulario.reset();
  tipo.value = "livro";
  mudarCampos();

  idEditando = null;
  formBadge.textContent = "POST";
  formBadge.className = "badge text-bg-warning";
  formTitulo.textContent = "Cadastrar material";
  btnSalvar.textContent = "Cadastrar material";
  btnCancelar.classList.add("d-none");
}

function carregarMateriais() {
  mostrarStatus(statusLista, "Carregando materiais...", "info");
  listaMateriais.textContent = "";

  fetch(URL_API)
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("A API respondeu com erro.");
      return resposta.json();
    })
    .then(function (materiais) {
      materiais.forEach(function (material) {
        const coluna = document.createElement("div");
        coluna.className = "col-12 col-md-6 col-lg-4";

        const card = document.createElement("article");
        card.className = "card h-100 shadow-sm";

        const corpo = document.createElement("div");
        corpo.className = "card-body";

        const tituloCard = document.createElement("h3");
        tituloCard.className = "h5";
        tituloCard.textContent = material.titulo;

        const informacoes = document.createElement("p");
        informacoes.className = "text-secondary";

        if (material.tipo === "Livro") {
          informacoes.textContent =
            `Livro - Autor: ${material.autor} | ${material.paginas} páginas | ${material.anoPublicacao}`;
        } else {
          informacoes.textContent =
            `Revista - Edição: ${material.edicao} | Mês: ${material.mesPublicacao} | ${material.anoPublicacao}`;
        }

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.className = "btn btn-outline-info btn-sm";
        botaoEditar.textContent = "Editar";
        botaoEditar.addEventListener("click", function () {
          idEditando = material.id;
          tipo.value = material.tipo.toLowerCase();
          titulo.value = material.titulo;
          ano.value = material.anoPublicacao;
          autor.value = material.autor || "";
          paginas.value = material.paginas || "";
          edicao.value = material.edicao || "";
          mes.value = material.mesPublicacao || "";
          mudarCampos();

          formBadge.textContent = "PUT";
          formBadge.className = "badge text-bg-info";
          formTitulo.textContent = `Atualizar material ${material.id}`;
          btnSalvar.textContent = "Atualizar material";
          btnCancelar.classList.remove("d-none");
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "btn btn-outline-danger btn-sm";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", function () {
          if (!window.confirm(`Deseja excluir o material ${material.id}?`)) return;

          mostrarStatus(statusLista, "Enviando DELETE...", "info");

          fetch(`${URL_API}/${material.id}`, {
            method: "DELETE",
          })
            .then(function (resposta) {
              if (!resposta.ok) throw new Error("A API respondeu com erro.");
              return resposta;
            })
            .then(function () {
              mostrarStatus(statusLista, "DELETE realizado com sucesso.", "success");
              carregarMateriais();
            })
            .catch(function (erro) {
              mostrarErro(listaMateriais, erro);
              mostrarStatus(
                statusLista,
                "Não foi possível excluir o material.",
                "danger",
              );
            });
        });

        const acoes = document.createElement("div");
        acoes.className = "d-flex flex-wrap gap-2";
        acoes.append(botaoEditar, botaoExcluir);

        if (material.tipo === "Livro") {
          const botaoEmprestar = document.createElement("button");
          botaoEmprestar.type = "button";
          botaoEmprestar.className = "btn btn-outline-success btn-sm";
          botaoEmprestar.textContent = "Emprestar";
          botaoEmprestar.addEventListener("click", function () {
            mostrarStatus(
              statusLista,
              "Enviando solicitação de empréstimo...",
              "info",
            );

            fetch(`${URL_API}/${material.id}/emprestar`, {
              method: "POST",
            })
              .then(function (resposta) {
                if (!resposta.ok) throw new Error("A API respondeu com erro.");
                return resposta.json();
              })
              .then(function (retorno) {
                mostrarStatus(statusLista, retorno.mensagem, "success");
              })
              .catch(function (erro) {
                mostrarErro(listaMateriais, erro);
                mostrarStatus(
                  statusLista,
                  "Não foi possível emprestar o material.",
                  "danger",
                );
              });
          });

          acoes.append(botaoEmprestar);
        }

        corpo.append(tituloCard, informacoes, acoes);
        card.append(corpo);
        coluna.append(card);
        listaMateriais.append(coluna);
      });

      mostrarStatus(statusLista, "GET realizado com sucesso.", "success");
    })
    .catch(function (erro) {
      mostrarErro(listaMateriais, erro);
      mostrarStatus(statusLista, "Não foi possível carregar os materiais.", "danger");
    });
}

function pegarDadosFormulario() {
  const dados = {
    titulo: titulo.value.trim(),
    anoPublicacao: Number(ano.value),
  };

  if (tipo.value === "livro") {
    dados.autor = autor.value.trim();
    dados.paginas = Number(paginas.value);
  } else {
    dados.edicao = Number(edicao.value);
    dados.mesPublicacao = Number(mes.value);
  }

  return dados;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const dados = pegarDadosFormulario();
  let formularioValido =
    dados.titulo !== "" && dados.anoPublicacao >= 0;

  if (tipo.value === "livro") {
    formularioValido = formularioValido && dados.autor !== "" && dados.paginas > 0;
  } else {
    formularioValido =
      formularioValido &&
      dados.edicao > 0 &&
      dados.mesPublicacao >= 1 &&
      dados.mesPublicacao <= 12;
  }

  if (!formularioValido) {
    mostrarStatus(statusFormulario, "Preencha os campos corretamente.", "danger");
    return;
  }

  const metodo = idEditando === null ? "POST" : "PUT";
  let endereco = `${URL_API}/${tipo.value}`;

  if (idEditando !== null) {
    endereco += `/${idEditando}`;
  }

  mostrarStatus(statusFormulario, `Enviando ${metodo}...`, "info");

  fetch(endereco, {
    method: metodo,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(dados),
  })
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("A API respondeu com erro.");
      return resposta.json();
    })
    .then(function (retorno) {
      saidaFormulario.textContent = JSON.stringify(retorno, null, 2);
      mostrarStatus(statusFormulario, `${metodo} realizado com sucesso.`, "success");
      limparFormulario();
      carregarMateriais();
    })
    .catch(function (erro) {
      mostrarErro(saidaFormulario, erro);
      mostrarStatus(statusFormulario, `Não foi possível realizar o ${metodo}.`, "danger");
    });
});

tipo.addEventListener("change", mudarCampos);
btnCarregar.addEventListener("click", carregarMateriais);
btnCancelar.addEventListener("click", function () {
  limparFormulario();
  statusFormulario.className = "alert d-none mt-3";
});

mudarCampos();
carregarMateriais();
