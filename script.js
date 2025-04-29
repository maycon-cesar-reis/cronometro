$ = id => {
    if ("." === id.substr(0, 1)) {
        const itens = document.querySelectorAll(id);
        if (itens.length < 2) {
            return itens[0];
        }
        return itens;
    }
    return document.getElementById(id);
}

var estado = undefined;
var tempo  = "00:01:00";

function atualizaAcoes(acao) {
    if (!acao) {
        acao = 'pausa';
    }

    const opcoes = {
        inicia : ['pausa'],
        pausa  : ['inicia', 'limpa', 'edita'],
        edita  : ['ok'],
        fim    : ['limpa']
    }

    const acoes = $('.acoes div') || [];
    for (let i = 0; i < acoes.length; i++) {
        acoes[i].classList.remove('ativa')
    }

    opcoes[acao].map(chave => {
        $("." + chave).classList.add('ativa');
    });
}

function inicia(display) {
    atualizaAcoes('inicia');
    document.body.classList.remove('invertido');
    estado = setInterval(() => decrementa(display), 1000);
}

function pausa() {
    atualizaAcoes('pausa');
    clearInterval(estado);
}

function fim() {
    atualizaAcoes('fim');
    clearInterval(estado);
}

function limpa(display) {
    atualizaAcoes('pausa');
    clearInterval(estado);
    display.innerHTML = tempo;
    document.body.classList.remove('invertido');
}

function edita() {
    $('.display').classList.toggle('edicao');
    $('.campo'  ).classList.toggle('edicao');
    if ($('.campo').classList.contains('edicao')) {
        $('campo').value = $('.display').innerHTML;
        atualizaAcoes('edita');
    } else {
        tempo = $('campo').value;
        $('.display').innerHTML = tempo;
        atualizaAcoes('pausa');
    }
}

function atualizaCores() {
    const atexto =  $('.display').innerHTML.split(":") || [];
    
    let minuto  = atexto.length == 3 ? atexto[1] * 1 : 0;
    let segundo = atexto.length == 3 ? atexto[2] * 1 : atexto * 1;
    
    if (!minuto && segundo < 11) {
        if (segundo % 2) {
            document.body.classList.remove('invertido');
        } else {
            document.body.classList.add('invertido');
        }
    }
}

function atualizaDisplay(display, hora, minuto, segundo) {

    hora    = hora == 0 && minuto == 0 && segundo < 11 ? "" : ((100 + hora  ) + "").substr(1) + ":";
    minuto  = hora == 0 && minuto == 0 && segundo < 11 ? "" : ((100 + minuto) + "").substr(1) + ":";
    segundo = hora == 0 && minuto == 0 && segundo < 10 ? segundo : ((100 + segundo) + "").substr(1);

    display.innerHTML = hora + minuto + segundo;

    atualizaCores(minuto, segundo);

    if (!hora && !minuto && !segundo) {
        fim();
    }
}

function decrementa(display) {
    const texto  = display.innerHTML;
    const atexto = texto.split(":") || [];
    
    let hora    = atexto.length == 3 ? atexto[0] * 1 : 0;
    let minuto  = atexto.length == 3 ? atexto[1] * 1 : 0;
    let segundo = atexto.length == 3 ? atexto[2] * 1 : atexto * 1;

    segundo--;
    
    if (segundo < 0) {
        segundo = 59;
        minuto--;
    }
    
    if (minuto < 0) {
        segundo = 59;
        minuto  = hora > 0 ? 59 : 0;
        hora--;
    }

    if (hora < 0) {
        hora = 0
    }

    atualizaDisplay(display, hora, minuto, segundo);
}

document.addEventListener("DOMContentLoaded", () => {
    const display = $('.display');
    const start   = $('.inicia');
    const pause   = $('.pausa');
    const clear   = $('.limpa');
    const edit    = $('.edita');
    const ok      = $('.ok');

    start.addEventListener('click', () => inicia(display));
    pause.addEventListener('click', () => pausa(display));
    clear.addEventListener('click', () => limpa(display));
    edit.addEventListener( 'click', () => edita());
    ok.addEventListener(   'click', () => edita());

    display.innerHTML = tempo;
    atualizaAcoes('pausa');

});