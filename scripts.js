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
    const cliente = document.getElementById('cliente').value.trim();
    const clienteID = cliente.replace(/\s+/g, "_");
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

    const novoItem = {
        produto,
        material,
        metro,
        comprimento,
        largura,
        quantidade,
        mao_obra,
        cuba,
        frete,
        desconto,
        totalAprazo,
        totalAvista
    };

    let grupo = grupos.find(g => g.cliente === cliente);

    if (!grupo) {
        grupo = { cliente, itens: [novoItem] };
        grupos.push(grupo);
        criarGrupoVisual(grupo);
    } else {
        grupo.itens.push(novoItem);
        atualizarGrupoVisual(grupo);
    }
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

    document.getElementById('cliente').value = dados.cliente || '';
    document.getElementById('produto').value = dados.produto || '';
    document.getElementById('material').value = dados.material || '';
    document.getElementById('valor').value = dados.valor || '';
    document.getElementById('comprimento').value = dados.comprimento || '';
    document.getElementById('largura').value = dados.largura || '';
    document.getElementById('mao_obra').value = dados.mao_obra || '';
    document.getElementById('cuba').value = dados.cuba || '';
    document.getElementById('frete').value = dados.frete || '';
    document.getElementById('quantidade').value = dados.quantidade || '';
    document.getElementById('desconto').value = dados.desconto || '';

    card.remove();
    calcularTotal?.();
}

let grupos = [];

function criarGrupoVisual(grupo) {
    const container = document.getElementById('grupo-orcamentos');
    const clienteID = grupo.cliente.replace(/\s+/g, "_");
    let grupoDiv = document.getElementById(`grupo-${clienteID}`);


    if (!grupoDiv) {
        grupoDiv = document.createElement('div');
        grupoDiv.className = 'grupo-card';
        grupoDiv.id = `grupo-${grupo.cliente.replace(/\s+/g, "_")}`;

        grupoDiv.innerHTML = `
            <h2>Orçamento de: ${grupo.cliente}</h2>
            <button class="remove-btn" onclick="removerGrupo('${grupo.cliente}')">X</button>
            <div class="itens-grupo"></div>
            <button class="save-btn" onclick="salvarOrcamento('${grupo.cliente}')">Salvar Orçamento</button>
        `;


        container.appendChild(grupoDiv);
        setTimeout(() => atualizarGrupoVisual(grupo), 0);
    } else {
        atualizarGrupoVisual(grupo);
    }
}

function atualizarGrupoVisual(grupo) {
    const clienteID = grupo.cliente.replace(/\s+/g, "_");
    const grupoDiv = document.querySelector(`#grupo-${clienteID} .itens-grupo`);
    console.log(grupoDiv)
    grupoDiv.innerHTML = ''; 

    grupo.itens.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        //card.dataset.index = index;
        //card.dataset.cliente = grupo.cliente;
        card.dataset.item = JSON.stringify(item);

        card.innerHTML = `
            <button class="remove-btn" data-cliente="${grupo.cliente}" data-index="${index}" onclick="removerItemBtn(this)">X</button>
            <button class="edit-btn" data-cliente="${grupo.cliente}" data-index="${index}" onclick="editarItemBtn(this)">Editar</button>
            <p><strong>Produto:</strong> ${item.produto}</p>
            <p><strong>Material:</strong> ${item.material}</p>
            <p><strong>M²:</strong> ${item.metro.toFixed(2)}</p>
            <p><strong>Total a prazo:</strong> R$ ${item.totalAprazo.toFixed(2)}</p>
            <p><strong>Total à vista:</strong> R$ ${item.totalAvista.toFixed(2)}</p>
        `;
        grupoDiv.appendChild(card);
    });
}

function removerItem(cliente, index) {
    // Acha o grupo no array
    const grupo = grupos.find(g => g.cliente === cliente);
    if (!grupo) return;

    // Remove o item do array
    grupo.itens.splice(index, 1);

    // Atualiza a visualização
    if (grupo.itens.length === 0) {
        // Remove o grupo inteiro da interface
        const clienteID = cliente.replace(/\s+/g, "_");
        const grupoDiv = document.getElementById(`grupo-${clienteID}`);

        if (grupoDiv) {
            grupoDiv.remove();
        }

        // Remove do array de grupos também
        const indexGrupo = grupos.findIndex(g => g.cliente === cliente);
        if (indexGrupo !== -1) {
            grupos.splice(indexGrupo, 1);
        }
    } else {
        // Só atualiza a visualização se ainda tiver itens
        atualizarGrupoVisual(grupo);
    }
}

function removerGrupo(cliente) {
    const clienteID = cliente.replace(/\s+/g, "_");

    // Remove da lista de grupos
    grupos = grupos.filter(g => g.cliente !== cliente);

    // Remove do DOM
    const grupoCard = document.getElementById(`grupo-${clienteID}`);
    if (grupoCard) {
        grupoCard.remove();
    }
}

function salvarOrcamento(cliente) {
    const grupo = grupos.find(g => g.cliente === cliente);
    if (grupo) {
        localStorage.setItem(`orcamento-${cliente}`, JSON.stringify(grupo));
        alert(`Orçamento de ${cliente} salvo com sucesso!`);
    }
}
