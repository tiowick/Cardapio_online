$(document).ready(function (){
 cardapio.eventos.init();

})

var cardapio = {};

cardapio.eventos = {
    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    // obtem lista de itens no cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false ) => {
        var filtro = MENU[categoria];
        console.log(filtro);

        if(!vermais){
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');
        }

        

        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item.
            replace(/\${img}/g, e.img).
            replace(/\${name}/g, e.name).
            replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));

            // botão ver mais clicado (12 itens)
            if(vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp);
            }

            // paginação inicial (8 itens)
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp);
            }

            
        })

        //remove o ativo

        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active')
    },

    //ciclando no botão ver mais 
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // menu-burgers
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },
}

cardapio.templates = {

   item: `
    
    <div class="col-3">
        <div class="card card-item">
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
                <span class="btn-menos"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens">0</span>
                <span class="btn-mais"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>

            </div>

        </div>
    </div>
    </div>
   
   `
       
}

