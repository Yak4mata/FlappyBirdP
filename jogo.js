console.log('[Yak4] Flappy Bird');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


//[Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height)


    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );


    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

  },
};



//[Chao]

function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      //fazendo chao repetir
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      //      console.log('[movimentacao]', movimentacao % repeteEm);
      //      console.log('chao.x', chao.x);
      //      console.log('[repeteEm]', repeteEm);

      chao.x = movimentacao % repeteEm;

    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );

      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}




//fazendo colidiiiiiiir
function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y

  if (flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

//[CRIANDO FLAPPY BIRD]
function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.67,
    pula() {
      console.log('Devo pular');
      flappyBird.velocidade = - flappyBird.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,

    //atualizandooooooooo
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        console.log('fez colisao');
        som_HIT.play();

        mudaParaTela(Telas.GAME_OVER);
        return;
      }


      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      console.log(flappyBird.velocidade);
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },


    movimentos: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],

    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrame = 10;
      const passouOIntervalo = frames % intervaloDeFrame === 0;

      if (passouOIntervalo) {
        const baseDoIncrimento = 1;
        const incremento = baseDoIncrimento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
    },

    desenha() {
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;
}


// MENSAGEM GET READY
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h,

    );
  },
};

//
// [Telas]
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function (par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // [Cano do Céu]
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )

        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },

    temColisaoComOFlappyBird(par) {

      const cabecaDoFlappy = globais.flappyBird.y
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
        console.log('flappy bird invadia a area');

        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }


      return false;
    },

    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        console.log('passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function (par) {
        par.x = par.x - 2;

        if (canos.temColisaoComOFlappyBird(par)) {
          console.log('voce perdeu')
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }

      });

    }
  }
  return canos;
}

//[CRIANDO O PLACAR/ATUALIZANDO]

function criaPlacar() {

  const placar = {
    pontuacao: 0,

    desenha(){
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
      placar.pontuacao
    },
    
    atualiza(){
      const intervaloDeFrame = 10;
      const passouOIntervalo = frames % intervaloDeFrame === 0;
      if(passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;

      }

    }
  }
  return placar;
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },

    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  inicializa() {
  globais.placar =  criaPlacar();  
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },

  //fazendo o flappy atualizar na tela
  click() {
    globais.flappyBird.pula();
  },

  atualiza() {
    globais.canos.atualiza();
    globais.flappyBird.atualiza();
    globais.chao.atualiza();
    globais.placar.atualiza();
  }
};
// [MENSAGEM GAME OVER]
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h,

    );
  },
};


Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();
  },

  atualiza() {

  },
  click() {
    mudaParaTela(Telas.INICIO);
  }
}


function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;

  requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();