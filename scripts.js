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
    const total = ((valor * metro + maoObra + cuba + frete) * quantidade).toFixed(2);
    const descontoValor = total * (desconto / 100);
    const totalFinal = (total - descontoValor).toFixed(2);

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        <strong>Cliente:</strong> ${cliente}<br>
        <strong>Produto:</strong> ${produto}<br>
        <strong>Material:</strong> ${material}<br>
        <strong>M²:</strong> ${metro.toFixed(2)}<br>
        <strong>Total:</strong> R$ ${totalFinal}
    `;
    document.getElementById('lista-itens').appendChild(card);
}