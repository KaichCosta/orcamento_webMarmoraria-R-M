let gruposOriginais = [];
let grupos = []; // Inicialize como um array vazio

window.onload = function () {
    const container = document.getElementById("historico-container");
    const dadosSalvos = localStorage.getItem("gruposOrcamento");

    if (dadosSalvos) {
        gruposOriginais = JSON.parse(dadosSalvos); // Atribui os dados salvos aos grupos originais
        grupos = [...gruposOriginais]; // Inicializa 'grupos' com uma cópia dos dados originais

        console.log("gruposOriginais após parse:", gruposOriginais);
        console.log("Número de grupos originais:", gruposOriginais.length);

        if (gruposOriginais.length === 0) { // Use gruposOriginais.length aqui
            container.innerHTML = "<p>Nenhum orçamento salvo.</p>";
            // Se não há orçamentos, esconde o painel de filtros/resumos
            const filtroPainel = document.getElementById("filtro-resumo-painel");
            if (filtroPainel) filtroPainel.style.display = "none";
            console.log("Nenhum orçamento salvo, painel de filtros escondido.");
            return;
        }

        // Popula os dropdowns de filtro com os dados existentes
        popularFiltros();
        // Calcula e exibe os totais iniciais (sem filtro aplicado)
        calcularEExibirTotais(grupos);
        // Renderiza os cards iniciais
        renderizarGrupos(grupos); 

        // Chame a função para renderizar os cards
        //renderizarGrupos();

    } else {
        container.innerHTML = "<p>Nenhum orçamento salvo.</p>";

        // Se não há orçamentos, esconde o painel de filtros/resumos
        const filtroPainel = document.getElementById("filtro-resumo-painel");
        if (filtroPainel) filtroPainel.style.display = "none";
        console.log("Nenhum dado no localStorage, painel de filtros escondido.");
    }

    // Adiciona event listeners para os filtros
    // Verifique se os elementos existem antes de adicionar o listener
    const filtroClienteEl = document.getElementById("filtro-cliente");
    const filtroMaterialEl = document.getElementById("filtro-material");
    const filtroProdutoEl = document.getElementById("filtro-produto");
    const aplicarFiltrosBtn = document.getElementById("aplicar-filtros-btn");

    if (filtroClienteEl) filtroClienteEl.addEventListener("change", aplicarFiltros);
    if (filtroMaterialEl) filtroMaterialEl.addEventListener("change", aplicarFiltros);
    if (filtroProdutoEl) filtroProdutoEl.addEventListener("change", aplicarFiltros);
    if (aplicarFiltrosBtn) aplicarFiltrosBtn.addEventListener("click", aplicarFiltros);

    console.log("--- Fim do window.onload ---");
};

function popularFiltros() {
    console.log("--- popularFiltros: Iniciando ---");
    const filtroClienteSelect = document.getElementById("filtro-cliente");
    const filtroMaterialSelect = document.getElementById("filtro-material");
    const filtroProdutoSelect = document.getElementById("filtro-produto");

    // Adicionado verificação para garantir que os elementos existem
    if (!filtroClienteSelect || !filtroMaterialSelect || !filtroProdutoSelect) {
        console.error("Erro: Elementos SELECT de filtro não encontrados no HTML.");
        return;
    }

    // Limpa opções anteriores (exceto a opção "Todos")
    filtroClienteSelect.innerHTML = '<option value="todos">Todos os Clientes</option>';
    filtroMaterialSelect.innerHTML = '<option value="todos">Todos os Materiais</option>';
    filtroProdutoSelect.innerHTML = '<option value="todos">Todos os Produtos</option>';

    const clientesUnicos = new Set();
    const materiaisUnicos = new Set();
    const produtosUnicos = new Set();

    gruposOriginais.forEach(grupo => {
        clientesUnicos.add(grupo.cliente);
        grupo.itens.forEach(item => {
            materiaisUnicos.add(item.material);
            produtosUnicos.add(item.produto);
        });
    });

    console.log("Clientes únicos encontrados:", Array.from(clientesUnicos));
    console.log("Materiais únicos encontrados:", Array.from(materiaisUnicos));
    console.log("Produtos únicos encontrados:", Array.from(produtosUnicos));

    // Adiciona opções aos dropdowns de cliente
    Array.from(clientesUnicos).sort().forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente;
        option.textContent = cliente;
        filtroClienteSelect.appendChild(option);
    });

    // Adiciona opções aos dropdowns de material
    Array.from(materiaisUnicos).sort().forEach(material => {
        const option = document.createElement("option");
        option.value = material;
        option.textContent = material;
        filtroMaterialSelect.appendChild(option);
    });

    // Adiciona opções aos dropdowns de produto
    Array.from(produtosUnicos).sort().forEach(produto => {
        const option = document.createElement("option");
        option.value = produto;
        option.textContent = produto;
        filtroProdutoSelect.appendChild(option);
    });
    console.log("--- popularFiltros: Finalizado ---");
}

/**
 * Função para calcular e exibir os totais agregados (m², a prazo, à vista).
 * @param {Array} dados - O array de grupos de orçamento a ser usado para o cálculo.
 */

function calcularEExibirTotais(dados) {
    let totalM2 = 0;
    let totalAprazo = 0;
    let totalAvista = 0;

    dados.forEach(grupo => {
        grupo.itens.forEach(item => {
            // Assumindo que 'm2' existe no item. Se for outra propriedade, ajuste aqui.
            // Se 'm2' não existir, ou for opcional, adicione uma verificação: item.m2 || 0
            totalM2 += parseFloat(item.m2 || 0); // Converta para número e some
            totalAprazo += parseFloat(item.totalAprazo || 0);
            totalAvista += parseFloat(item.totalAvista || 0);
        });
    });

    const totalM2El = document.getElementById("total-m2");
    const totalAprazoEl = document.getElementById("total-aprazo");
    const totalAvistaEl = document.getElementById("total-avista");

    if (totalM2El) totalM2El.textContent = totalM2.toFixed(2);
    if (totalAprazoEl) totalAprazoEl.textContent = totalAprazo.toFixed(2);
    if (totalAvistaEl) totalAvistaEl.textContent = totalAvista.toFixed(2);
    console.log("Totais calculados:", { totalM2, totalAprazo, totalAvista });
    console.log("--- calcularEExibirTotais: Finalizado ---");
}

/**
 * Função principal para aplicar os filtros selecionados.
 */
function aplicarFiltros() {
    const filtroCliente = document.getElementById("filtro-cliente").value;
    const filtroMaterial = document.getElementById("filtro-material").value;
    const filtroProduto = document.getElementById("filtro-produto").value;

    let gruposFiltrados = [...gruposOriginais]; // Começa com todos os dados originais

    // Filtra por cliente
    if (filtroCliente !== "todos") {
        gruposFiltrados = gruposFiltrados.filter(grupo => grupo.cliente === filtroCliente);
    }

    // Filtra por material e produto (precisa iterar pelos itens dentro dos grupos)
    if (filtroMaterial !== "todos" || filtroProduto !== "todos") {
        gruposFiltrados = gruposFiltrados.map(grupo => {
            const itensFiltrados = grupo.itens.filter(item => {
                const materialCorresponde = (filtroMaterial === "todos" || item.material === filtroMaterial);
                const produtoCorresponde = (filtroProduto === "todos" || item.produto === filtroProduto);
                return materialCorresponde && produtoCorresponde;
            });
            // Retorna um novo grupo com apenas os itens filtrados
            // Se não houver itens após o filtro, o grupo não será incluído na próxima etapa
            return { ...grupo, itens: itensFiltrados };
        }).filter(grupo => grupo.itens.length > 0); // Remove grupos que ficaram sem itens após o filtro
    }

    grupos = gruposFiltrados; // Atualiza a variável global 'grupos' com os dados filtrados

    // Se não houver orçamentos após o filtro, exibe mensagem e esconde os cards
    const container = document.getElementById("historico-container");
    const limparBtn = container.querySelector('.limpar-btn');
    container.innerHTML = ''; // Limpa o conteúdo
    container.appendChild(limparBtn); // Adiciona o botão de volta

    if (container) { // Adicionado verificação para garantir que o container existe
        container.innerHTML = ''; // Limpa o conteúdo
        if (limparBtn) { // Adicionado verificação para garantir que o botão existe
            container.appendChild(limparBtn); // Adiciona o botão de volta
        }
    }

    if (grupos.length === 0) {
        if (container) {
            container.innerHTML += "<p>Nenhum orçamento encontrado com os filtros aplicados.</p>";
        }
        console.log("Nenhum orçamento encontrado com os filtros aplicados.");
    } else {
        renderizarGrupos(grupos); // Renderiza os cards com os dados filtrados
        console.log("Renderizando", grupos.length, "grupos filtrados.");
    }

    // Recalcula e exibe os totais com base nos dados filtrados
    calcularEExibirTotais(grupos);
    console.log("--- aplicarFiltros: Finalizado ---");
}

// função para renderizar os grupos (melhor para organizar o código)
function renderizarGrupos(gruposParaRenderizar) {
    console.log("--- renderizarGrupos: Iniciando com", gruposParaRenderizar.length, "grupos ---");
    const container = document.getElementById("historico-container");
    const limparBtn = container.querySelector('.limpar-btn'); // Pega o botão existente

    if (!container) {
        console.error("Erro: Container 'historico-container' não encontrado.");
        return;
    }

    // Limpa o conteúdo atual do container, mantendo o botão de limpar
    container.innerHTML = '';
    if (limparBtn) {
        container.appendChild(limparBtn); // Adiciona o botão de volta
    } else {
        console.warn("Botão 'limpar-btn' não encontrado para ser re-adicionado.");
    }


    if (gruposParaRenderizar.length === 0) {
        container.innerHTML += "<p>Nenhum orçamento salvo.</p>";
        console.log("Nenhum orçamento para renderizar.");
        return;
    }

    gruposParaRenderizar.forEach((grupo, grupoIndex) => {
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
                <p><strong>M²:</strong> ${item.m2 ? item.m2.toFixed(2) : 'N/A'}</p> <p><strong>Total a prazo:</strong> R$ ${item.totalAprazo.toFixed(2)}</p>
                <p><strong>Total à vista:</strong> R$ ${item.totalAvista.toFixed(2)}</p>
                <button class="edit-item-btn" onclick='editarItemHistorico(${JSON.stringify(item)}, "${grupo.cliente}")'>Editar Item</button>
                <hr/>
            `;
            grupoDiv.appendChild(itemCardDiv); // Adiciona o card do item dentro do grupoDiv
        });

        container.appendChild(grupoDiv); // Adiciona o grupoDiv (com seus itens) ao container principal
    });
    console.log("--- renderizarGrupos: Finalizado ---");
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