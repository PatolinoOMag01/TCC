function formatarInline(texto, chave) {
  const partes = texto.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);

  return partes.map((parte, indice) => {
    const key = `${chave}-${indice}`;

    if (parte.startsWith("**") && parte.endsWith("**")) {
      return <strong key={key}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith("`") && parte.endsWith("`")) {
      return <code key={key}>{parte.slice(1, -1)}</code>;
    }
    if (parte.startsWith("*") && parte.endsWith("*")) {
      return <em key={key}>{parte.slice(1, -1)}</em>;
    }

    return parte;
  });
}

export default function RespostaFormatada({ texto }) {
  const conteudo = texto
    .trim()
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/\s*```$/, "")
    .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, "");
  const linhas = conteudo.split(/\r?\n/);
  const blocos = [];
  let paragrafo = [];
  let tipoLista = null;
  let itensLista = [];

  function finalizarParagrafo() {
    if (paragrafo.length) {
      blocos.push({ tipo: "paragrafo", texto: paragrafo.join(" ") });
      paragrafo = [];
    }
  }

  function finalizarLista() {
    if (itensLista.length) {
      blocos.push({ tipo: tipoLista, itens: itensLista });
      itensLista = [];
      tipoLista = null;
    }
  }

  linhas.forEach((linha) => {
    const limpa = linha.trim();
    if (!limpa) {
      finalizarParagrafo();
      finalizarLista();
      return;
    }

    const titulo = limpa.match(/^(#{1,3})\s+(.+)$/);
    if (titulo) {
      finalizarParagrafo();
      finalizarLista();
      blocos.push({ tipo: titulo[1].length <= 2 ? "titulo" : "subtitulo", texto: titulo[2] });
      return;
    }

    const itemMarcado = limpa.match(/^[-*+]\s+(.+)$/);
    const itemNumerado = limpa.match(/^\d+[.)]\s+(.+)$/);
    if (itemMarcado || itemNumerado) {
      finalizarParagrafo();
      const novoTipo = itemNumerado ? "lista-numerada" : "lista";
      if (tipoLista && tipoLista !== novoTipo) finalizarLista();
      tipoLista = novoTipo;
      itensLista.push((itemMarcado || itemNumerado)[1]);
      return;
    }

    finalizarLista();
    paragrafo.push(limpa);
  });

  finalizarParagrafo();
  finalizarLista();

  return (
    <div className="resposta-formatada">
      {blocos.map((bloco, indice) => {
        const key = `bloco-${indice}`;
        if (bloco.tipo === "titulo") return <h2 key={key}>{formatarInline(bloco.texto, key)}</h2>;
        if (bloco.tipo === "subtitulo") return <h3 key={key}>{formatarInline(bloco.texto, key)}</h3>;
        if (bloco.tipo === "lista" || bloco.tipo === "lista-numerada") {
          const Lista = bloco.tipo === "lista" ? "ul" : "ol";
          return (
            <Lista key={key}>
              {bloco.itens.map((item, itemIndice) => (
                <li key={`${key}-${itemIndice}`}>{formatarInline(item, `${key}-${itemIndice}`)}</li>
              ))}
            </Lista>
          );
        }
        return <p key={key}>{formatarInline(bloco.texto, key)}</p>;
      })}
    </div>
  );
}
