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

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        <strong>Cliente:</strong> ${cliente}<br>
        <strong>Produto:</strong> ${produto}<br>
        <strong>Material:</strong> ${material}<br>
        <strong>M²:</strong> ${metro.toFixed(2)}<br>
        <strong>Total a prazo:</strong> R$ ${totalAprazo}
        <strong>Total a vista:</strong> R$ ${totalAvista}
    `;
    document.getElementById('lista-itens').appendChild(card);
}

let precos = {};

fetch('materiais.json')
    .then(res => res.json())
    .then(data => {
        precos = data;
    });

    document.getElementById('material').addEventListener('change', function () {
    const materialSelecionado = this.value;
    const precoMetro = precos[materialSelecionado] || 0;
    document.getElementById('valor').value = precoMetro;
    calcularTotal();
});
