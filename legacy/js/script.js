const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");

import questions from "./questions.js";

let currentIndex = 0;
let questionsCorrect = 0;

btnRestart.onclick = () => {
  content.style.display = "flex";
  contentFinish.style.display = "none";

  currentIndex = 0;
  questionsCorrect = 0;
  loadQuestion();
};

function nextQuestion(e) {
  if (e.target.getAttribute("data-correct") === "true") {
    questionsCorrect++;
  }

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    finish();
  }
}

function finish() {
  textFinish.innerHTML = `você acertou ${questionsCorrect} de ${questions.length}`;
  content.style.display = "none";
  contentFinish.style.display = "flex";
}

function loadQuestion() {
  spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
  const item = questions[currentIndex];
  answers.innerHTML = "";
  question.innerHTML = item.question;

  item.answers.forEach((answer) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <button class="answer" data-correct="${answer.correct}">
      ${answer.option}
    </button>
    `;

    answers.appendChild(div);
  });

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", nextQuestion);
  });
}

loadQuestion();

const perguntas = [
  {
    pergunta: "Qual é a capital do Brasil?",
    opcoes: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    respostaCorreta: 2
  },
  {
    pergunta: "Quanto é 2 + 2?",
    opcoes: ["3", "4", "5", "6"],
    respostaCorreta: 1
  }
];

let indicePerguntaAtual = 0;
let pontuacao = 0;

function carregarPergunta() {
  const q = perguntas[indicePerguntaAtual];
  document.getElementById("pergunta").innerText = q.pergunta;
  
  const divOpcoes = document.getElementById("opcoes");
  divOpcoes.innerHTML = "";

  q.opcoes.forEach((opcao, index) => {
    const btn = document.createElement("button");
    btn.innerText = opcao;
    btn.onclick = () => verificarResposta(index);
    divOpcoes.appendChild(btn);
  });
}

//quiz
function verificarResposta(indiceSelecionado) {
  if (indiceSelecionado === perguntas[indicePerguntaAtual].respostaCorreta) {
    pontuacao++;
  }
  proximaPergunta();
}

function proximaPergunta() {
  indicePerguntaAtual++;
  if (indicePerguntaAtual < perguntas.length) {
    carregarPergunta();
  } else {
    exibirResultado();
  }
}

function exibirResultado() {
  document.getElementById("pergunta").classList.add("escondido");
  document.getElementById("opcoes").classList.add("escondido");
  document.getElementById("btn-proximo").classList.add("escondido");
  
  const divResultado = document.getElementById("resultado");
  divResultado.classList.remove("escondido");
  divResultado.innerText = `Você acertou ${pontuacao} de ${perguntas.length} perguntas!`;
}

// Inicializa o quiz ao carregar a página
carregarPergunta();

//api
fetch("api/usuarios.php")
    .then(resposta => resposta.json())
    .then(usuarios => {
        console.log(usuarios);
    })
    .catch(erro => {
        console.error(erro);
    });

    //post
    fetch("api/cadastrar_usuario.php", {
      method: "POST",
  
      headers: {
          "Content-Type": "application/json"
      },
  
      body: JSON.stringify({
          nome: "Sophia",
          email: "sophia@email.com"
      })
  })
  .then(resposta => resposta.json())
  .then(dados => {
      console.log(dados);
  })
  .catch(erro => {
      console.error(erro);
  });