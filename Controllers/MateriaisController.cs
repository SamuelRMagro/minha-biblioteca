using BibliotecaApi.Models;
using BibliotecaApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers;

[ApiController]
[Route("api/")]
public class MateriaisController : ControllerBase
{
    private readonly IMaterialRepository _repository;

    public MateriaisController(IMaterialRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IActionResult ObterTodos()
    {
        var materiais = _repository.ObterTodos().Cast<object>().ToList();
        return Ok(materiais);
    }

    [HttpGet("{id}")]
    public IActionResult ObterPorId(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material is null)
        {
            return NotFound($"Material {id} não encontrado.");
        }

        return Ok(material);
    }

    [HttpPost("livro")]
    public IActionResult CadastrarLivro([FromBody] Livro livro)
    {
        var erro = ValidarLivro(livro);
        if (erro is not null)
        {
            return BadRequest(new { mensagem = erro });
        }

        var criado = _repository.Adicionar(livro);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPost("revista")]
    public IActionResult CadastrarRevista([FromBody] Revista revista)
    {
        var erro = ValidarRevista(revista);
        if (erro is not null)
        {
            return BadRequest(new { mensagem = erro });
        }

        var criado = _repository.Adicionar(revista);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPut("livro/{id}")]
    public IActionResult AtualizarLivro(int id, [FromBody] Livro livro)
    {
        var erro = ValidarLivro(livro);
        if (erro is not null)
        {
            return BadRequest(new { mensagem = erro });
        }

        if (!_repository.Atualizar(id, livro))
        {
            return NotFound(new { mensagem = $"Material {id} não encontrado." });
        }

        return Ok(livro);
    }

    [HttpPut("revista/{id}")]
    public IActionResult AtualizarRevista(int id, [FromBody] Revista revista)
    {
        var erro = ValidarRevista(revista);
        if (erro is not null)
        {
            return BadRequest(new { mensagem = erro });
        }

        if (!_repository.Atualizar(id, revista))
        {
            return NotFound(new { mensagem = $"Material {id} não encontrado." });
        }

        return Ok(revista);
    }

    [HttpDelete("{id}")]
    public IActionResult Excluir(int id)
    {
        if (!_repository.Remover(id))
        {
            return NotFound(new { mensagem = $"Material {id} não encontrado." });
        }

        return NoContent();
    }

    [HttpGet("{id}/descricao")]
    public IActionResult ObterDescricao(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material is null)
        {
            return NotFound(new { mensagem = $"Material {id} não encontrado." });
        }

        return Ok(new
        {
            id = material.Id,
            tipo = material.Tipo,
            descricao = material.Descricao(),
            prazoEmprestimo = material.CalcularPrazo()
        });
    }

    [HttpPost("{id}/emprestar")]
    public IActionResult Emprestar(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material is null)
        {
            return NotFound(new { mensagem = $"Material {id} não encontrado." });
        }

        if (material is not IEmprestimo emprestavel)
        {
            return BadRequest(new
            {
                mensagem = $"O material '{material.Titulo}' ({material.Tipo}) não pode ser emprestado."
            });
        }

        return Ok(new { mensagem = emprestavel.Emprestar() });
    }


    private static string? ValidarMaterial(MaterialBiblioteca material)
    {
        if (string.IsNullOrWhiteSpace(material.Titulo))
        {
            return "O título é obrigatório.";
        }

        if (material.AnoPublicacao < 0)
        {
            return "O ano de publicação não pode ser menor que 0.";
        }

        return null;
    }

    private static string? ValidarLivro(Livro livro)
    {
        var erro = ValidarMaterial(livro);
        if (erro is not null)
        {
            return erro;
        }

        if (string.IsNullOrWhiteSpace(livro.Autor))
        {
            return "O autor é obrigatório.";
        }

        if (livro.Paginas <= 0)
        {
            return "O número de páginas deve ser maior que 0.";
        }

        return null;
    }

    private static string? ValidarRevista(Revista revista)
    {
        var erro = ValidarMaterial(revista);
        if (erro is not null)
        {
            return erro;
        }

        if (revista.Edicao <= 0)
        {
            return "O número da edição deve ser maior que 0.";
        }

        if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
        {
            return "O mês de publicação deve estar entre 1 e 12.";
        }

        return null;
    }
}
