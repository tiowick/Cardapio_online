$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

var VALOR_CARRINHO = 0;

var VALOR_ENTREGA = 5;

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },
};

cardapio.metodos = {
  // obtem lista de itens no cardápio
  obterItensCardapio: (categoria = "burgers", vermais = false) => {
    var filtro = MENU[categoria];
    console.log(filtro);

    if (!vermais) {
      $("#itensCardapio").html("");
      $("#btnVerMais").removeClass("hidden");
    }

    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${id}/g, e.id);

      // botão ver mais clicado (12 itens)
      if (vermais && i >= 8 && i < 12) {
        $("#itensCardapio").append(temp);
      }

      // paginação inicial (8 itens)
      if (!vermais && i < 8) {
        $("#itensCardapio").append(temp);
      }
    });

    //remove o ativo

    $(".container-menu a").removeClass("active");

    // seta o menu para ativo
    $("#menu-" + categoria).addClass("active");
  },

  //ciclando no botão ver mais
  verMais: () => {
    var ativo = $(".container-menu a.active").attr("id").split("menu-")[1]; // menu-burgers
    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btnVerMais").addClass("hidden");
  },

  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
    if (qntdAtual > 0) {
      $("#qntd-" + id).text(qntdAtual - 1);
    }
  },

  aumentarQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    $("#qntd-" + id).text(qntdAtual + 1);
  },

  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
    if (qntdAtual > 0) {
      //obter categiria ativa
      var categoria = $(".container-menu a.active")
        .attr("id")
        .split("menu-")[1];
      // obter lista de itens
      let filtro = MENU[categoria];
      //obter o item
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });
      if (item.length > 0) {
        //validar se já existe item no carrinho
        let exite = $.grep(MEU_CARRINHO, (elem, index) => {
          return elem.id == id;
        });
        // caso exista, alterar a quantidade
        if (exite.length > 0) {
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }
        // caso não, adiciona ele
        else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }

        cardapio.metodos.mensagem("Item adicionado ao carrinho!", "green");
        $("#qntd-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();
      }
    }
  },

  atualizarBadgeTotal: () => {
    var total = 0;
    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qntd;
    });
    if (total > 0) {
      $(".botao-carrinho").removeClass("hidden");
      $(".container-total-carrinho").removeClass("hidden");
    } else {
      $(".botao-carrinho").addClass("hidden");
      $(".container-total-carrinho").addClass("hidden");
    }
    $(".badge-total-carrinho").html(total);
  },

  mensagem: (texto, cor = "red", tempo = 3500) => {
    let id = Math.floor(Date.now() * Math.random().toString());

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-" + id).removeClass("fadeInDown");
      $("#msg-" + id).addClass("fadeOutUp");
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800);
    }, tempo);
  },

  abrirCarrinho: (abrir) => {
    if (abrir) {
      $("#modalCarrinho").removeClass("hidden");
      cardapio.metodos.carregarCarrinho();
    } else {
      $("#modalCarrinho").addClass("hidden");
    }
  },

  // altera os textos e exibe os botões das etapas
  carregarEtapa: (etapa) => {
    if (etapa == 1) {
      $("#lblTituloEtapa").text("Seu carrinho:");
      $("#itensCarrinho").removeClass("hidden");
      $("#localEntrega").addClass("hidden");
      $("#resumoCarrinho").addClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa-1").addClass("active");

      $("#btnEtapaPedido").removeClass("hidden");
      $("#btnEtapaEndereco").addClass("hidden");
      $("#btnEtapaResumo").addClass("hidden");
      $("#btnVoltar").addClass("hidden");
    }
    if (etapa == 2) {
      $("#lblTituloEtapa").text("Endereço de entrega:");
      $("#itensCarrinho").addClass("hidden");
      $("#localEntrega").removeClass("hidden");
      $("#resumoCarrinho").addClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa-1").addClass("active");
      $(".etapa-2").addClass("active");

      $("#btnEtapaPedido").addClass("hidden");
      $("#btnEtapaEndereco").removeClass("hidden");
      $("#btnEtapaResumo").addClass("hidden");
      $("#btnVoltar").removeClass("hidden");
    }
    if (etapa == 3) {
      $("#lblTituloEtapa").text("Resumo do pedido:");
      $("#itensCarrinho").addClass("hidden");
      $("#localEntrega").addClass("hidden");
      $("#resumoCarrinho").removeClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa-1").addClass("active");
      $(".etapa-2").addClass("active");
      $(".etapa-3").addClass("active");

      $("#btnEtapaPedido").addClass("hidden");
      $("#btnEtapaEndereco").addClass("hidden");
      $("#btnEtapaResumo").removeClass("hidden");
      $("#btnVoltar").removeClass("hidden");
    }
  },

  voltarEtapa: () => {
    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapa(etapa - 1);
  },

  // carrega a lista de itens do carrinho
  carregarCarrinho: () => {

    cardapio.metodos.carregarEtapa(1);

    if (MEU_CARRINHO.length > 0) {

      $("#itensCarrinho").html('');

      $.each(MEU_CARRINHO, (i, e) => {

        let temp = cardapio.templates.itemCarrinho 
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${id}/g, e.id)
        .replace(/\${qntd}/g, e.qntd);

        $("#itensCarrinho").append(temp);

        if((i + 1) == MEU_CARRINHO.length){

          cardapio.metodos.carregarValores();
        }
        

      })

    }
    else{
      $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio.</p>');
      cardapio.metodos.carregarValores();
    }

  },

  // diminuir quantidade do item no carrinho
  diminuirQuantidadeCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    if (qntdAtual > 1) {
      $("#qntd-carrinho-" + id).text(qntdAtual - 1);
      cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
    }
    else {
      cardapio.metodos.removerItemCarrinho(id);
    }

  },

  aumentarQuantidadeCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    $("#qntd-carrinho-" + id).text(qntdAtual + 1);
    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

  },

  // botão remover item do carrinho
  removerItemCarrinho: (id) => {

    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id});
    cardapio.metodos.carregarCarrinho();

    // atualiza o botão carrinho com a quantidade atualizada.
    cardapio.metodos.atualizarBadgeTotal();
  },

  //atualiza o carrinho com a quantidade atual.
  atualizarCarrinho: (id, qntd) => {

    let objIndex =  MEU_CARRINHO.findIndex((obj => obj.id == id));
    MEU_CARRINHO[objIndex].qntd = qntd;

    // atualiza o botão carrinho com a quantidade atualizada.
    cardapio.metodos.atualizarBadgeTotal();

    // atualiza os valores (R$) totais em reais. 
    cardapio.metodos.carregarValores();

  },
  // carrega os valores de subtotal, entrega e total!
  carregarValores: () => {

    VALOR_CARRINHO = 0;

    $("#lblSubtotal").text('R$ 0,00');
    $("#lblValorEntrega").text('+ R$ 0,00');
    $("#lblValorTotal").text('R$ 0,00');

    $.each(MEU_CARRINHO, (i, e) => {

      VALOR_CARRINHO += parseFloat(e.price * e.qntd);

      if ((i + 1) ==  MEU_CARRINHO.length){
        
        $("#lblSubtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
        $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);

      }

    })

  },


};



// abrir modal de carrinho

cardapio.templates = {
  item: `
    
    <div class="col-3">
        <div class="card card-item" id="\${id}">
            <div class="img-produto">
                <img
                    src="\${img}" />

            </div>
            <p class="title-produto text-center mt-4">
                <b>\${name}</b>
            </p>
            <p class="price-produto text-center">
                <b>\${price}</b>
            </p>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>

            </div>

        </div>
    </div>
    </div>
   
   `,

   itemCarrinho: `

   <div class="col-12 item-carrinho">
     <div class="img-produto">
       <img src="\${img}"/>
     </div>
     <div class="dados-produto">
       <p class="title-produto"><b>\${name}</b></p>
       <p class="price-produto"><b>\${price}</b></p>
     </div>
     <div class="add-carrinho">
       <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
       <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
       <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
       <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
     </div>
   </div>
 `
 
};
