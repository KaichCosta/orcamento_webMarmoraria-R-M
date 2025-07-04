let gruposOriginais = [];
let grupos = []; // Inicialize como um array vazio

window.onload = function () {
    const container = document.getElementById("historico-container");
    const dadosSalvos = localStorage.getItem("gruposOrcamento");

    console.log("--- Início do window.onload ---");
    console.log("Dados salvos no localStorage:", dadosSalvos);

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

        // 1. Popula os dropdowns de filtro, como antes. local
        popularFiltros();

        // 2. Chama a função que DESENHA OS CARDS na tela.
        //    (Essa é a sua renderizarGrupos, agora com a lógica completa e corrigida).
        renderizarGrupos(grupos);

        // 3. Chama a função que SÓ CALCULA os totais e retorna os números.
        const totaisGerais = calcularTotaisGerais(grupos);

        // 4. Chama a função que SÓ EXIBE o resumo na tela, usando os números calculados.
        exibirResumo(totaisGerais);

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

/**
 * Função para popular os dropdowns de filtro com valores únicos de clientes, materiais e produtos.
 */
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
            if (item.material) materiaisUnicos.add(item.material); // Verifica se existe antes de adicionar
            if (item.produto) produtosUnicos.add(item.produto);   // Verifica se existe antes de adicionar
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
// Renomeada para ter um nome mais preciso
function calcularTotaisGerais(dados) {
    console.log("--- calcularTotaisGerais: Iniciando cálculos ---");

    // 1. Cria um objeto para guardar os totais
    let totais = {
        mlinear: 0,
        m2: 0,
        frete: 0,
        aprazo: 0,
        avista: 0
    };

    // 2. Faz o loop nos dados APENAS para somar os valores
    dados.forEach((grupo) => {
        if (grupo && Array.isArray(grupo.itens)) {
            grupo.itens.forEach((item) => {
                totais.mlinear += parseFloat(item.comprimento || 0);
                totais.m2 += parseFloat(item.m2 || 0);
                totais.frete += parseFloat(item.frete || 0);
                totais.aprazo += parseFloat(item.totalAprazo || 0);
                totais.avista += parseFloat(item.totalAvista || 0);
            });
        }
    });

    console.log("--- calcularTotaisGerais: Finalizado ---");
    console.log("Objeto de totais calculado:", totais);

    // 3. RETORNA o objeto com os resultados prontos
    return totais;
}

/**
 * Função principal para aplicar os filtros selecionados.
 */
function aplicarFiltros() {
    console.log("--- aplicarFiltros (VERSÃO CORRIGIDA): Iniciando ---");
    const filtroCliente = document.getElementById("filtro-cliente")?.value || "todos";
    const filtroMaterial = document.getElementById("filtro-material")?.value || "todos";
    const filtroProduto = document.getElementById("filtro-produto")?.value || "todos";

    let gruposFiltrados = [...gruposOriginais]; 

    if (filtroCliente !== "todos") {
        gruposFiltrados = gruposFiltrados.filter(grupo => grupo.cliente === filtroCliente);
    }

    if (filtroMaterial !== "todos" || filtroProduto !== "todos") {
        gruposFiltrados = gruposFiltrados.map(grupo => {
            const itensFiltrados = grupo.itens ? grupo.itens.filter(item => {
                const materialCorresponde = (filtroMaterial === "todos" || item.material === filtroMaterial);
                const produtoCorresponde = (filtroProduto === "todos" || item.produto === filtroProduto);
                return materialCorresponde && produtoCorresponde;
            }) : [];
            return { ...grupo, itens: itensFiltrados };
        }).filter(grupo => grupo.itens.length > 0);
    }

    console.log(`Encontrados ${gruposFiltrados.length} orçamentos após o filtro.`);

    renderizarGrupos(gruposFiltrados);

    const totaisFiltrados = calcularTotaisGerais(gruposFiltrados);

    // Exibe o resumo com os totais atualizados
    exibirResumo(totaisFiltrados);

    console.log("--- aplicarFiltros: Finalizado ---");
}

function renderizarGrupos(gruposParaRenderizar) {
    console.log("--- renderizarGrupos: Iniciando com", gruposParaRenderizar.length, "grupos ---");
    const container = document.getElementById("historico-container");
    const limparBtn = container.querySelector('.limpar-btn'); // Pega o botão existente

    if (!container) {
        console.error("ERRO GRAVE: Container 'historico-container' não encontrado.");
        return;
    }

    container.innerHTML = '';
    if (limparBtn) {
        container.appendChild(limparBtn);
        console.warn("Botão 'limpar-btn' não encontrado para ser re-adicionado.");
    }

    if (!Array.isArray(gruposParaRenderizar) || gruposParaRenderizar.length === 0) {
        container.innerHTML += "<p>Nenhum orçamento salvo.</p>";
        console.error("BUG ENCONTRADO AQUI: A condição para 'lista vazia' foi ativada. Parando a renderização.");
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

        // Adicionado verificação para garantir que grupo.itens existe e é um array
        if (grupo && Array.isArray(grupo.itens)) {
            grupo.itens.forEach((item, itemIndex) => {
                const itemCardDiv = document.createElement("div");
                itemCardDiv.className = "item-card";

                // HTML dos dados do item
                itemCardDiv.innerHTML = `
                    <button class="remove-btn" data-grupo-index="${grupoIndex}" data-item-index="${itemIndex}" onclick="removerItemBtn(this)">X</button>
                    <p><strong>Produto:</strong> ${item.produto}</p>
                    <p><strong>Material:</strong> ${item.material}</p>
                    <p><strong>M²:</strong> ${item.m2 ? parseFloat(item.m2).toFixed(2) : 'N/A'}</p>
                    <p><strong>Total a prazo:</strong> R$ ${parseFloat(item.totalAprazo || 0).toFixed(2)}</p>
                    <p><strong>Total à vista:</strong> R$ ${parseFloat(item.totalAvista || 0).toFixed(2)}</p>
                    <hr/>
                `;

            const botaoEditar = document.createElement("button");
            botaoEditar.className = "edit-item-btn";
            botaoEditar.innerText = "Editar Item";

            botaoEditar.onclick = () => {
                localStorage.setItem("grupoIndexEditando", grupoIndex);
                localStorage.setItem("itemIndexEditando", itemIndex);
                localStorage.setItem("grupoEditando", JSON.stringify(grupo));
                window.location.href = "index.html";
            };

                // Adiciona o botão ao card
            itemCardDiv.appendChild(botaoEditar);

                // Adiciona o card do item ao grupo
            grupoDiv.appendChild(itemCardDiv);
            });

        } else {
            console.warn(`Grupo ${grupo.cliente} não tem 'itens' ou 'itens' não é um array ao renderizar.`);
        }

        const botaoPDF = document.createElement('button');
        botaoPDF.className = 'gerar-pdf-btn'; // Dando uma classe para você poder estilizar depois
        botaoPDF.innerText = 'Gerar PDF do Orçamento';

        botaoPDF.onclick = () => gerarPdfPreview(grupoIndex); 

        grupoDiv.appendChild(botaoPDF);

        container.appendChild(grupoDiv);
    });
    console.log("--- renderizarGrupos: Finalizado ---");
}

function exibirResumo(totais) {
    const totalMlinearEl = document.getElementById("total-mlinear");
    const totalM2El = document.getElementById("total-m2");
    const totalFreteEl = document.getElementById("total-frete");
    const totalAprazoEl = document.getElementById("total-aprazo");
    const totalAvistaEl = document.getElementById("total-avista");

    if (totalMlinearEl) totalMlinearEl.textContent = totais.mlinear.toFixed(2);
    if (totalM2El) totalM2El.textContent = totais.m2.toFixed(2);
    if (totalFreteEl) totalFreteEl.textContent = totais.frete.toFixed(2);
    if (totalAprazoEl) totalAprazoEl.textContent = `R$ ${totais.aprazo.toFixed(2)}`;
    if (totalAvistaEl) totalAvistaEl.textContent = `R$ ${totais.avista.toFixed(2)}`;
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
    console.log("Alerta: " + mensagem);
}

function fecharAlerta() {
    console.log("Alerta fechado.");
}

function salvarGruposNoStorage() {
    // Esta função agora salva os gruposOriginais, não os grupos filtrados
    localStorage.setItem("gruposOrcamento", JSON.stringify(gruposOriginais));
    console.log("Dados salvos no localStorage.");
}

function removerItemBtn(botao) {
    console.log("--- removerItemBtn: Iniciando ---");
    const grupoIndex = parseInt(botao.dataset.grupoIndex);
    const itemIndex = parseInt(botao.dataset.itemIndex);

    if (!gruposOriginais[grupoIndex] || !gruposOriginais[grupoIndex].itens || !gruposOriginais[grupoIndex].itens[itemIndex]) {
        console.error("Erro: Ícone de remoção clicado para um item/grupo que não existe mais no array original.");
        // Se o item/grupo já foi removido, apenas reaplica os filtros para atualizar a UI
        aplicarFiltros();
        popularFiltros();
        return;
    }

    const grupo = gruposOriginais[grupoIndex];

    // Remove o item do array de itens do grupo original
    grupo.itens.splice(itemIndex, 1);
    console.log(`Item ${itemIndex} removido do grupo ${grupoIndex}.`);

    // Se o grupo não tiver mais itens, remove o grupo inteiro do original
    if (grupo.itens.length === 0) {
        gruposOriginais.splice(grupoIndex, 1);
        console.log(`Grupo ${grupo.cliente} removido por estar vazio.`);
    }

    salvarGruposNoStorage(); // Salva as alterações no localStorage (dos dados originais)


    aplicarFiltros();
    popularFiltros(); // Atualiza os filtros caso algum cliente/material/produto tenha sumido
    console.log("--- removerItemBtn: Finalizado ---");
}

async function gerarPdfPreview(indiceDoGrupo) {
    console.log(`Gerando PDF para o grupo de índice: ${indiceDoGrupo}`);

    const { PDFDocument, rgb, StandardFonts } = PDFLib;

    const grupoParaImprimir = grupos[indiceDoGrupo];
    
    if (!grupoParaImprimir) {
        console.error(`Erro: Grupo com índice ${indiceDoGrupo} não encontrado.`);
        alert(`Erro ao gerar PDF: grupo não encontrado.`);
        return; 
    }

    const nomeCliente = grupoParaImprimir.cliente;
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    let totalGeral = 0;
    grupoParaImprimir.itens.forEach(item => {
        totalGeral += parseFloat(item.totalAprazo || 0); 
    });
    const totalFormatado = `R$ ${totalGeral.toFixed(2)}`;

    const urlTemplate = 'pdf/orcamento.pdf'; // Verifique se o nome do arquivo está correto
    console.log("O fetch está tentando acessar esta URL:", new URL(urlTemplate, window.location.href).href);

    const existingPdfBytes = await fetch(urlTemplate).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Escreve os dados principais
    firstPage.drawText(nomeCliente, { x: 120, y: 705, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold), size: 14 });
    firstPage.drawText(dataAtual, { x: 480, y: 705, font: await pdfDoc.embedFont(StandardFonts.Helvetica), size: 12 });
    firstPage.drawText(totalFormatado, { x: 480, y: 150, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold), size: 18 });
    
    // Escreve os itens do orçamento
    let yAtual = 600; 
    grupoParaImprimir.itens.forEach(item => {
        // <-- CORREÇÃO 2: Garante que 'item.m2' seja tratado como número
        const textoItem = `${item.quantidade}x ${item.produto} (${item.material}) - ${parseFloat(item.m2 || 0).toFixed(2)}m²`;
        firstPage.drawText(textoItem, { x: 80, y: yAtual, size: 10 });
        yAtual -= 20; 
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
}