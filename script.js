/* ===== 1. MODO CLARO / ESCURO ===== */
const btnTema = document.getElementById('btn-tema');

function atualizarBotao() {
  btnTema.textContent = document.body.classList.contains('claro') ? '☾ Escuro' : '☀ Claro';
}
if (localStorage.getItem('tema') === 'claro') {
  document.body.classList.add('claro');
}
atualizarBotao();

btnTema.addEventListener('click', function () {
  document.body.classList.toggle('claro');
  const tema = document.body.classList.contains('claro') ? 'claro' : 'escuro';
  localStorage.setItem('tema', tema);   // lembra a escolha
  atualizarBotao();
});

/* ===== 2. CURSOR DE F1 COM RASTRO (efeito de mouse) ===== */
const carro = document.getElementById('carro');
let ultimoX = 0;
let ultimoRastro = 0;

document.addEventListener('mousemove', function (e) {
  carro.style.left = e.clientX + 'px';
  carro.style.top = e.clientY + 'px';

  // vira o carro para o lado em que o mouse anda
  if (e.clientX > ultimoX + 2) {
    carro.style.transform = 'translate(-50%, -50%) scaleX(-1)';
  } else if (e.clientX < ultimoX - 2) {
    carro.style.transform = 'translate(-50%, -50%)';
  }
  ultimoX = e.clientX;

  // cria uma bolinha de rastro a cada 30 ms
  const agora = Date.now();
  if (agora - ultimoRastro > 30) {
    criarRastro(e.clientX, e.clientY);
    ultimoRastro = agora;
  }
});

function criarRastro(x, y) {
  const rastro = document.createElement('div');
  rastro.className = 'rastro';
  rastro.style.left = x + 'px';
  rastro.style.top = y + 'px';
  document.body.appendChild(rastro);
  setTimeout(function () { rastro.remove(); }, 3000);   // remove depois de 3 s
}

/* ===== 3. TEXTO DIGITANDO ===== */
const frases = [
  'Desenvolvedor full stack em formação',
  'Front-end com HTML, CSS e JavaScript',
  'Back-end e bancos de dados SQL'
];
const campoTexto = document.getElementById('digitando');
let fraseAtual = 0;
let letra = 0;
let apagando = false;

function digitar() {
  const frase = frases[fraseAtual];
  letra = apagando ? letra - 1 : letra + 1;
  campoTexto.textContent = frase.substring(0, letra);

  let tempo = apagando ? 30 : 70;
  if (!apagando && letra === frase.length) {
    apagando = true;
    tempo = 1500;
  } else if (apagando && letra === 0) {
    apagando = false;
    fraseAtual = (fraseAtual + 1) % frases.length;
    tempo = 400;
  }
  setTimeout(digitar, tempo);
}
digitar();

/* ===== 4. BARRAS DE HABILIDADE ANIMAM AO ROLAR A PÁGINA ===== */
const barras = document.querySelectorAll('.nivel');
const observador = new IntersectionObserver(function (itens) {
  itens.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.style.width = item.target.dataset.nivel + '%';
    }
  });
});
barras.forEach(function (barra) { observador.observe(barra); });

/* ===== 5. FORMULÁRIO: MÁSCARAS ===== */
const campoNome = document.getElementById('nome');
const campoTelefone = document.getElementById('telefone');
const campoEmail = document.getElementById('email');
const campoMensagem = document.getElementById('mensagem');

// Nome: aceita só letras e espaços
campoNome.addEventListener('input', function () {
  campoNome.value = campoNome.value.replace(/[^A-Za-zÀ-ÿ ]/g, '');
});

// Telefone: (00) 00000-0000
campoTelefone.addEventListener('input', function () {
  let n = campoTelefone.value.replace(/\D/g, '').substring(0, 11);   // só números
  if (n.length > 10) {
    n = n.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (n.length > 6) {
    n = n.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
  } else if (n.length > 2) {
    n = n.replace(/^(\d{2})(\d*)$/, '($1) $2');
  } else if (n.length > 0) {
    n = '(' + n;
  }
  campoTelefone.value = n;
});

// E-mail: tudo minúsculo e sem espaços
campoEmail.addEventListener('input', function () {
  campoEmail.value = campoEmail.value.toLowerCase().replace(/\s/g, '');
});

// Mensagem: contador de letras
campoMensagem.addEventListener('input', function () {
  document.getElementById('contador').textContent = campoMensagem.value.length + ' / 500';
});

/* ===== 6. MODAL ===== */
const modal = document.getElementById('modal');

function abrirModal(titulo, texto) {
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-texto').textContent = texto;
  modal.classList.add('aberto');
}
function fecharModal() {
  modal.classList.remove('aberto');
}
document.getElementById('modal-fechar').addEventListener('click', fecharModal);
modal.addEventListener('click', function (e) {
  if (e.target === modal) fecharModal();   // clicar fora fecha
});

/* ===== 7. ENVIO DO FORMULÁRIO (validação) ===== */
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const telefoneNumeros = campoTelefone.value.replace(/\D/g, '');
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoEmail.value);
  const erros = [];

  if (campoNome.value.trim().length < 3) erros.push('nome');
  if (telefoneNumeros.length < 10) erros.push('telefone');
  if (!emailValido) erros.push('e-mail');
  if (campoMensagem.value.trim().length < 10) erros.push('mensagem');

  // marca os campos com erro em vermelho
  campoNome.classList.toggle('erro', erros.includes('nome'));
  campoTelefone.classList.toggle('erro', erros.includes('telefone'));
  campoEmail.classList.toggle('erro', erros.includes('e-mail'));
  campoMensagem.classList.toggle('erro', erros.includes('mensagem'));

  if (erros.length > 0) {
    abrirModal('Pit stop!', 'Confira estes campos: ' + erros.join(', ') + '.');
    return;
  }

  // Aqui você pode enviar os dados para um back-end (fetch)
  abrirModal('Mensagem enviada!', 'Obrigado pelo contato, ' + campoNome.value.split(' ')[0] + '!');
  this.reset();
  document.getElementById('contador').textContent = '0 / 500';
});