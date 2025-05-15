function adicionarItem() {
    const cliente = document.getElementById('cliente').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const comprimento = parseFloat(document.getElementById('comprimento').value);
    const largura = parseFloat(document.getElementById('largura').value);
    const produto = document.getElementById('produto').value;
    const material = document.getElementById('material').value;
    const maoObra = parseFloat(document.getElementById('mao_obra').value);
    const cuba = parseFloat(document.getElementById('cuba').value);
    const frete = parseFloat(document.getElementById('frete').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const desconto = parseFloat(document.getElementById('desconto').value);

    const metro = comprimento * largura;
    const totalCalculado = (((valor * metro + maoObra + cuba) * quantidade) + frete ).toFixed(2);
    const total = totalCalculado.toFixed(2);
    document.getElementById('total').value = total.toFixed(2);

    const descontoValor = total * (desconto / 100);
    const totalAvista = (total - descontoValor).toFixed(2);

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        <strong>Cliente:</strong> ${cliente}<br>
        <strong>Produto:</strong> ${produto}<br>
        <strong>Material:</strong> ${material}<br>
        <strong>M²:</strong> ${metro.toFixed(2)}<br>
        <strong>Total:</strong> R$ ${totalAvista}
    `;
    document.getElementById('lista-itens').appendChild(card);
}

function calcularTotal() {
    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const maoObra = parseFloat(document.getElementById('maoObra').value) || 0;
    const cuba = parseFloat(document.getElementById('cuba').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    const frete = parseFloat(document.getElementById('frete').value) || 0;

    const metro = comprimento * largura;
    const total = (((valor * metro + maoObra + cuba) * quantidade) + frete);
    document.getElementById('total').value = `R$ ${total.toFixed(2)}`;
}