function calcularTotal() {
    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const mao_obra = parseFloat(document.getElementById('mao_obra').value) || 0;
    const cuba = parseFloat(document.getElementById('cuba').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    const frete = parseFloat(document.getElementById('frete').value) || 0;

    const metro = comprimento * largura;
    const total = (((valor * metro + mao_obra + cuba) * quantidade) + frete);
    document.getElementById('total').value = `R$ ${total.toFixed(2)}`;
}

function adicionarItem() {
    const cliente = document.getElementById('cliente').value;
    const produto = document.getElementById('produto').value;
    const material = document.getElementById('material').value;

    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const mao_obra = parseFloat(document.getElementById('mao_obra').value) || 0;
    const cuba = parseFloat(document.getElementById('cuba').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const frete = parseFloat(document.getElementById('frete').value) || 0;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;

    const metro = comprimento * largura;
    const totalAprazo = (((valor * metro + mao_obra + cuba) * quantidade) + frete ).toFixed(2);
    const descontoValor = totalAprazo * (desconto / 100);
    const totalAvista = (totalAprazo - descontoValor);

    const dadosItem = {
        cliente,
        produto,
        material,
        valor,
        comprimento,
        largura,
        mao_obra,
        cuba,
        frete,
        quantidade,
        desconto
    };

    const card = document.createElement('div');
    card.className = 'item-card';

    // Salva os dados como atributo no card (transformado em JSON)
    card.dataset.item = JSON.stringify(dadosItem);

    card.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        <button class="edit-btn" onclick="editarItem(this)">Editar</button>
        <strong>Cliente:</strong> ${cliente}<br>
        <strong>Produto:</strong> ${produto}<br>
        <strong>Material:</strong> ${material}<br>
        <strong>M²:</strong> ${metro.toFixed(2)}<br>
        <strong>Total a prazo:</strong> R$ ${totalAprazo}<br>
        <strong>Total a vista:</strong> R$ ${totalAvista}
    `;
    document.getElementById('lista-itens').appendChild(card);
}

let materiais = {};

fetch('materiais.json')
    .then(response => response.json())
    .then(data => {
        materiais = data;
    
        const datalist = document.getElementById('lista-materiais');
        Object.keys(materiais).forEach(nome => {
            const option = document.createElement('option');
            option.value = nome;
            datalist.appendChild(option);
        })
    })
    .catch(error => console.error('Erro ao carregar materiais:', error));

    // Atualiza o valor do m² automaticamente ao selecionar um material
    document.getElementById('material').addEventListener('change', function () {
    const materialSelecionado = this.value;
    const valorMetro = materiais[materialSelecionado];

    const inputValor = document.getElementById('valor');
    if (valorMetro !== null && valorMetro !== undefined) {
        inputValor.value = valorMetro;
    } else {
        inputValor.value = '';
    }

    calcularTotal();
});

function editarItem(botao) {
    const card = botao.parentElement;
    const dados = JSON.parse(card.dataset.item);

    // Preenche os campos com os dados do card
    document.getElementById('cliente').value = dados.cliente;
    document.getElementById('produto').value = dados.produto;
    document.getElementById('material').value = dados.material;
    document.getElementById('valor').value = dados.valor;
    document.getElementById('comprimento').value = dados.comprimento;
    document.getElementById('largura').value = dados.largura;
    document.getElementById('mao_obra').value = dados.mao_obra;
    document.getElementById('cuba').value = dados.cuba;
    document.getElementById('frete').value = dados.frete;
    document.getElementById('quantidade').value = dados.quantidade;
    document.getElementById('desconto').value = dados.desconto;

    // Remove o card da lista (vai ser refeito quando clicar em "Adicionar Item")
    card.remove();

    calcularTotal();
}
