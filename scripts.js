function calcularTotal() {
    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const mao_obra = parseFloat(document.getElementById('mao_obra').value) || 0;
    const cuba = parseFloat(document.getElementById('cuba').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    const frete = parseFloat(document.getElementById('frete').value) || 0;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;
    const metro = comprimento * largura;
    const total = (((valor * metro + mao_obra + cuba) * quantidade) + frete);
    document.getElementById('total').value = `R$ ${total.toFixed(2)}`;
    const descontoValor = total * (desconto / 100);
    const total_vista = (total - descontoValor);
    document.getElementById('total_vista').value = `R$ ${total_vista.toFixed(2)}`;
}

function adicionarAoGrupo() {
    const cliente = document.getElementById('cliente').value;
    const produto = document.getElementById('produto').value;
    const material = document.getElementById('material').value;
    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const mao_obra = parseFloat(document.getElementById('mao_obra').value) || 0;
    const cuba = parseFloat(document.getElementById('cuba').value) || 0;
    const frete = parseFloat(document.getElementById('frete').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;

    const metro = comprimento * largura;
    const totalAprazo = ((valor * metro + mao_obra + cuba) * quantidade) + frete;
    const descontoValor = totalAprazo * (desconto / 100);
    const totalAvista = totalAprazo - descontoValor;

    // Atualiza campos na interface
    document.getElementById('total').value = `R$ ${totalAprazo.toFixed(2)}`;
    document.getElementById('total_vista').value = `R$ ${totalAvista.toFixed(2)}`;

    // PROS GRUPOS:

    let grupo = grupos.find(g => g.cliente === cliente);
    if (!grupo) {
        grupo = { cliente, itens: [] };
        grupos.push(grupo);
        criarGrupoVisual(grupo);
    }

    const novoItem = {
        produto,
        material,
        metro,
        totalAprazo,
        totalAvista,
        comprimento,
        largura,
        quantidade
    };

    grupo.itens.push(novoItem);
    atualizarGrupoVisual(grupo);
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

let grupos = [];

function adicionarAoGrupo() {
    const cliente = document.getElementById('cliente').value;
    const produto = document.getElementById('produto').value;
    const material = document.getElementById('material').value;
    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;

    const metro = comprimento * largura;
    const totalItem = valor * metro;

    let grupo = grupos.find(g => g.cliente === cliente);

    if (!grupo) {
        grupo = {
        cliente,
        itens: [],
        };
        grupos.push(grupo);
        criarGrupoVisual(grupo);
    }

    const novoItem = { produto, material, metro, total: totalItem };
    grupo.itens.push(novoItem);

    atualizarGrupoVisual(grupo);
}

function criarGrupoVisual(grupo) {
    const container = document.getElementById('grupo-orcamentos');
    const div = document.createElement('div');
    div.className = 'grupo-card';
    div.id = `grupo-${grupo.cliente}`;

    div.innerHTML = `
        <h3>Orçamento de: ${grupo.cliente}</h3>
        <div class="itens-grupo"></div>
        <button class="save-btn" onclick="salvarOrcamento('${grupo.cliente}')">Salvar Orçamento</button>
    `;

    container.appendChild(div);
}

function atualizarGrupoVisual(grupo) {
    const grupoDiv = document.querySelector(`#grupo-${grupo.cliente} .itens-grupo`);
    grupoDiv.innerHTML = ''; // limpa para recriar

    grupo.itens.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
            <button class="edit-btn" onclick="editarItem(this)">Editar</button>
            <p><strong>Produto:</strong> ${item.produto}</p>
            <p><strong>Material:</strong> ${item.material}</p>
            <p><strong>M²:</strong> ${item.metro.toFixed(2)}</p>
            <p><strong>Total a prazo:</strong> R$ ${item.totalAprazo}</p>
            <p><strong>Total à vista:</strong> R$ ${item.totalAvista.toFixed(2)}</p>
        `;
        grupoDiv.appendChild(card);
    });
}

function salvarOrcamento(cliente) {
    const grupo = grupos.find(g => g.cliente === cliente);
    if (grupo) {
        localStorage.setItem(`orcamento-${cliente}`, JSON.stringify(grupo));
        alert(`Orçamento de ${cliente} salvo com sucesso!`);
    }
}
