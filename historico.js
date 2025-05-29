let grupos = []; // Inicialize como um array vazio

window.onload = function () {
    const container = document.getElementById("historico-container");
    const dadosSalvos = localStorage.getItem("gruposOrcamento");

    if (dadosSalvos) {
        grupos = JSON.parse(dadosSalvos); // Atribua os dados salvos à variável global

        if (grupos.length === 0) {
            container.innerHTML = "<p>Nenhum orçamento salvo.</p>";
            return;
        }

        // Chame a função para renderizar os cards
        renderizarGrupos();

    } else {
        container.innerHTML = "<p>Nenhum orçamento salvo.</p>";
    }
};

// função para renderizar os grupos (melhor para organizar o código)
function renderizarGrupos() {
    const container = document.getElementById("historico-container");
    const limparBtn = container.querySelector('.limpar-btn'); // Pega o botão existente

    // Limpa o conteúdo atual do container, mantendo o botão de limpar
    container.innerHTML = '';
    container.appendChild(limparBtn); // Adiciona o botão de volta

    if (grupos.length === 0) {
        container.innerHTML += "<p>Nenhum orçamento salvo.</p>";
        return;
    }

    grupos.forEach((grupo, grupoIndex) => {
        const grupoDiv = document.createElement("div");
        grupoDiv.className = "grupo-card";
        grupoDiv.setAttribute('data-grupo-index', grupoIndex);

        grupoDiv.innerHTML = `
            <h2>Cliente: ${grupo.cliente}</h2>
            <h3><strong></strong> ${grupo.dataHora || 'Data não disponível'}</h3>
        `;

        // Agora, iteramos sobre os itens para criar os cards individuais
        grupo.itens.forEach((item, itemIndex) => {
            const itemCardDiv = document.createElement("div");
            itemCardDiv.className = "item-card"; // Classe para estilizar o item

            itemCardDiv.innerHTML = `
                <button class="remove-btn" data-grupo-index="${grupoIndex}" data-item-index="${itemIndex}" onclick="removerItemBtn(this)">X</button>
                <p><strong>Produto:</strong> ${item.produto}</p>
                <p><strong>Material:</strong> ${item.material}</p>
                <p><strong>Total a prazo:</strong> R$ ${item.totalAprazo.toFixed(2)}</p>
                <p><strong>Total à vista:</strong> R$ ${item.totalAvista.toFixed(2)}</p>
                <button class="edit-item-btn" onclick='editarItemHistorico(${JSON.stringify(item)}, "${grupo.cliente}")'>Editar Item</button>
                <hr/>
            `;
            grupoDiv.appendChild(itemCardDiv); // Adiciona o card do item dentro do grupoDiv
        });

        container.appendChild(grupoDiv); // Adiciona o grupoDiv (com seus itens) ao container principal
    });
}

function editarItemHistorico(item, cliente) {
    const dadosParaEditar = {
        ...item,
        cliente: cliente
    };

    localStorage.setItem('itemEmEdicao', JSON.stringify(dadosParaEditar));
    window.location.href = 'index.html';
}

function mostrarAlerta(mensagem) {
    document.getElementById("alert-msg").textContent = mensagem;
    document.getElementById("alert-custom").style.display = "flex";
}

function fecharAlerta() {
    document.getElementById("alert-custom").style.display = "none";
}

function salvarGruposNoStorage() {
    localStorage.setItem("gruposOrcamento", JSON.stringify(grupos));
}

function removerItemBtn(botao) {
    const grupoIndex = parseInt(botao.dataset.grupoIndex);
    const itemIndex = parseInt(botao.dataset.itemIndex);

    // Validação básica
    if (isNaN(grupoIndex) || isNaN(itemIndex) || !grupos[grupoIndex] || !grupos[grupoIndex].itens[itemIndex]) {
        console.error("Índices inválidos para remoção.");
        return;
    }

    const grupo = grupos[grupoIndex];

    // Remove o item do array de itens do grupo
    grupo.itens.splice(itemIndex, 1);

    // Se o grupo não tiver mais itens, remove o grupo inteiro
    if (grupo.itens.length === 0) {
        grupos.splice(grupoIndex, 1);
    }

    salvarGruposNoStorage(); // Salva as alterações no localStorage
    renderizarGrupos(); // Renderiza novamente os cards para atualizar a interface
}