function calcularTotal() {
    const valor = parseFloat(document.getElementById('valor').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const mao_obra = parseFloat(document.getElementById('mao_obra').value) || 0;
    const cuba = parseFloat(document.getElementById('cuba').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    const frete = parseFloat(document.getElementById('frete').value) || 0;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;
    const m2 = comprimento * largura;
    const total = (((valor * m2 + mao_obra + cuba) * quantidade) + frete);
    document.getElementById('total').value = `R$ ${total.toFixed(2)}`;
    const descontoValor = total * (desconto / 100);
    const total_vista = (total - descontoValor);
    document.getElementById('total_vista').value = `R$ ${total_vista.toFixed(2)}`;
}

function adicionarAoGrupo() {
    const cliente = document.getElementById('cliente').value.trim();
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

    if (modoEdicao) {
        // --- BLOCO DE LÓGICA PARA ATUALIZAR UM ITEM ---
        console.log(`MODO EDIÇÃO: Atualizando item ${indiceItemEditando} do grupo ${indiceGrupoEditando}...`);

        // Pega a lista completa de grupos do localStorage
        let todosOsGrupos = JSON.parse(localStorage.getItem("gruposOrcamento")) || [];

        // Encontra o item exato que precisa ser atualizado
        const itemParaAtualizar = todosOsGrupos[indiceGrupoEditando].itens[indiceItemEditando];

        // Atualiza as propriedades do item com os novos valores dos campos
        itemParaAtualizar.produto = produto;
        itemParaAtualizar.material = material;
        itemParaAtualizar.valor = valor;
        itemParaAtualizar.comprimento = comprimento;
        itemParaAtualizar.largura = largura;
        itemParaAtualizar.quantidade = quantidade;
        itemParaAtualizar.mao_obra = mao_obra;
        itemParaAtualizar.cuba = cuba;
        itemParaAtualizar.frete = frete;
        itemParaAtualizar.desconto = desconto;
        
        // Recalcula os totais para ESTE item
        const m2 = itemParaAtualizar.comprimento * itemParaAtualizar.largura;
        itemParaAtualizar.m2 = m2 * itemParaAtualizar.quantidade;
        
        const totalAprazo = ((itemParaAtualizar.valor * itemParaAtualizar.m2 + itemParaAtualizar.mao_obra + itemParaAtualizar.cuba)) + itemParaAtualizar.frete;
        const descontoValor = totalAprazo * (itemParaAtualizar.desconto / 100);
        
        itemParaAtualizar.totalAprazo = totalAprazo;
        itemParaAtualizar.totalAvista = totalAprazo - descontoValor;

        // Salva a lista inteira (com o item modificado) de volta no localStorage
        localStorage.setItem("gruposOrcamento", JSON.stringify(todosOsGrupos));

        // Avisa o usuário e volta para o histórico
        alert("Item atualizado com sucesso!");
        modoEdicao = false; // Desativa o modo de edição
        window.location.href = "historico.html";

    } else {
        console.log("MODO ADIÇÃO: Adicionando novo item...");
        // O cálculo para UM item
        const m2 = comprimento * largura;
        const totalM2 = m2 * quantidade; // Total de m² para esta adição
        const totalAprazo = ((valor * totalM2 + mao_obra + cuba)) + frete;
        const descontoValor = totalAprazo * (desconto / 100);
        const totalAvista = totalAprazo - descontoValor;

        document.getElementById('total').value = `R$ ${totalAprazo.toFixed(2)}`;
        document.getElementById('total_vista').value = `R$ ${totalAvista.toFixed(2)}`;

        const novoItem = {
            cliente,
            produto,
            material,
            valor,
            m2: totalM2,
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

        let grupos = JSON.parse(localStorage.getItem("gruposOrcamento")) || [];
        let grupo = grupos.find(g => g.cliente === cliente);

        if (!grupo) {
            grupo = { cliente: cliente, itens: [], dataHora: new Date().toLocaleString('pt-BR') };
            grupos.push(grupo);
        }

        const itemExistente = grupo.itens.find(item => item.produto === novoItem.produto && item.material === novoItem.material);

        if (itemExistente) {
            itemExistente.quantidade += novoItem.quantidade;
            itemExistente.m2 += novoItem.m2; // Soma a nova metragem quadrada
            itemExistente.totalAprazo += novoItem.totalAprazo; // Soma o novo total
            itemExistente.totalAvista += novoItem.totalAvista; // Soma o novo total com desconto

        } else {
        // SE O ITEM É NOVO (não foi encontrado na lista):
        // adiciona ele ao grupo.
            grupo.itens.push(novoItem);
        }

        localStorage.setItem("gruposOrcamento", JSON.stringify(grupos));
        alert("Item adicionado ao orçamento!");
    }

}

let produtos = {};

fetch('produtos.json')
    .then(response => response.json())
    .then(data => {
        produtos = data;
    
        const datalist = document.getElementById('lista-produtos');
        Object.keys(produtos).forEach(nome => {
            const option = document.createElement('option');
            option.value = nome;
            datalist.appendChild(option);
        })
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));

    // Atualiza o valor da MÃO DE OBRA automaticamente ao selecionar um produto
    document.getElementById('produto').addEventListener('change', function () {
    const produtoSelecionado = this.value;
    const valormao_obra = produtos[produtoSelecionado];

    const inputMao_obra = document.getElementById('mao_obra');
    if (valormao_obra !== null && valormao_obra !== undefined) {
        inputMao_obra.value = valormao_obra;
    } else {
        inputMao_obra.value = '';
    }

    calcularTotal();
});

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
    const valorM2 = materiais[materialSelecionado];

    const inputValor = document.getElementById('valor');
    if (valorM2 !== null && valorM2 !== undefined) {
        inputValor.value = valorM2;
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

    // Remove o item da lista original
    const cliente = dados.cliente;
    const grupo = grupos.find(g => g.cliente === cliente);
    const index = grupo.itens.findIndex(i =>
        JSON.stringify(i) === JSON.stringify(dados)
    );

    if (index !== -1) {
        grupo.itens.splice(index, 1);
        atualizarGrupoVisual(grupo);
    }

    calcularTotal?.();
}


let grupos = [];

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

function removerItemBtn(botao) {
    const cliente = botao.dataset.cliente;
    const index = parseInt(botao.dataset.index, 10);
    removerItem(cliente, index);
}

function editarItemBtn(botao) {
    editarItem(botao);
}

function salvarOrcamento(cliente) {
    if (!cliente) {
        mostrarAlerta("Informe o nome do cliente para salvar o orçamento.");
        return;
    }

    // Carrega grupos existentes DOM
    let gruposSalvos = JSON.parse(localStorage.getItem('gruposOrcamento')) || [];

    // Verifica se o grupo já existe
    const indiceExistente = gruposSalvos.findIndex(g => g.cliente === cliente);

    const grupoAtual = grupos.find(g => g.cliente === cliente);

    if (!grupoAtual) {
        mostrarAlerta("Grupo atual não encontrado.");
        return;
    }

    const dataHoraAtual = new Date().toLocaleString("pt-BR");

    if (indiceExistente !== -1) {
        grupoAtual.dataHora = dataHoraAtual;
        // Substitui o grupo existente
        gruposSalvos[indiceExistente] = grupoAtual;
    } else {
        grupoAtual.dataHora = dataHoraAtual;
        // Adiciona novo grupo
        gruposSalvos.push(grupoAtual);
    }

    // Salva de volta no localStorage
    localStorage.setItem('gruposOrcamento', JSON.stringify(gruposSalvos));
    mostrarAlerta(`Orçamento de ${cliente} salvo com sucesso!`);
}

let modoEdicao = false;
let indiceGrupoEditando = -1;
let indiceItemEditando = -1;

window.onload = function() {
    fecharAlerta(); 
    
    const grupoIndexSalvo = localStorage.getItem("grupoIndexEditando");
    const itemIndexSalvo = localStorage.getItem("itemIndexEditando");
    const grupoSalvoString = localStorage.getItem("grupoEditando");

    if (grupoIndexSalvo !== null && itemIndexSalvo !== null && grupoSalvoString !== null) {
        
        console.log("--- INICIANDO MODO DE EDIÇÃO (DEPURAÇÃO) ---");
        
        // CÂMERA 1: Vamos ver os dados brutos que vieram do localStorage
        console.log("Índice do grupo recuperado:", grupoIndexSalvo);
        console.log("Índice do item recuperado:", itemIndexSalvo);
        
        const grupo = JSON.parse(grupoSalvoString);
        // CÂMERA 2: Vamos ver o objeto do grupo depois de convertido
        console.log("Objeto 'grupo' recuperado:", grupo);
        
        // CÂMERA 3: Vamos ver o array de itens que está dentro do grupo
        console.log("Array de itens dentro do grupo:", grupo.itens);

        indiceItemEditando = parseInt(itemIndexSalvo);
        const itemParaEditar = grupo.itens[indiceItemEditando];

        // CÂMERA 4: A PROVA FINAL! Vamos ver se conseguimos pegar o item.
        console.log("Item específico que tentamos pegar ('itemParaEditar'):", itemParaEditar);

        // Se o item foi encontrado, o código continua
        if (itemParaEditar) {
            console.log("Sucesso! Preenchendo o formulário...");
            modoEdicao = true;
            indiceGrupoEditando = parseInt(grupoIndexSalvo);

            document.getElementById('cliente').value = grupo.cliente || '';
            document.getElementById('produto').value = itemParaEditar.produto || '';
            document.getElementById('material').value = itemParaEditar.material || '';
            document.getElementById('valor').value = itemParaEditar.valor || '';
            document.getElementById('comprimento').value = itemParaEditar.comprimento || '';
            document.getElementById('largura').value = itemParaEditar.largura || '';
            document.getElementById('mao_obra').value = itemParaEditar.mao_obra || '';
            document.getElementById('cuba').value = itemParaEditar.cuba || '';
            document.getElementById('frete').value = itemParaEditar.frete || '';
            document.getElementById('quantidade').value = itemParaEditar.quantidade || '';
            document.getElementById('desconto').value = itemParaEditar.desconto || '';

            document.getElementById('btn-adicionar').innerText = "Salvar Alterações";

        } else {
            console.error("ERRO CRÍTICO: Não foi possível encontrar o item com o índice", indiceItemEditando, "dentro do grupo.");
        }

        // Limpa os dados para não entrar em loop de edição
        localStorage.removeItem("grupoIndexEditando");
        localStorage.removeItem("itemIndexEditando");
        localStorage.removeItem("grupoEditando");
    }
};

function mostrarAlerta(mensagem) {
    document.getElementById("alert-msg").textContent = mensagem;
    document.getElementById("alert-custom").style.display = "flex";
}

function fecharAlerta() {
    document.getElementById("alert-custom").style.display = "none";
}
