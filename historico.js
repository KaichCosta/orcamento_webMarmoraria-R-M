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

        // Popula os dropdowns de filtro com os dados existentes
        popularFiltros();
        // Calcula e exibe os totais iniciais (sem filtro aplicado)
        calcularEExibirTotais(grupos);
        // Renderiza os cards iniciais
        renderizarGrupos(grupos);

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
function calcularEExibirTotais(dados) {
    console.log("--- calcularEExibirTotais: Iniciando com", dados.length, "grupos ---");
    
    // As variáveis de totais continuam aqui no início, isso está correto.
    let totalMlinear = 0;
    let totalM2 = 0;
    let totalFrete = 0;
    let totalAprazo = 0;
    let totalAvista = 0;

    const containerDeHistorico = document.getElementById('historico-container');
    containerDeHistorico.innerHTML = ''; // Limpa a tela antes de redesenhar. Correto.

    // Inicia o loop principal para cada grupo/orçamento
    dados.forEach((grupo, grupoIdx) => {
        if (grupo && Array.isArray(grupo.itens)) {
            // 1. CRIA O CARD e adiciona o nome do cliente. Correto.
            const cardDoGrupo = document.createElement('div');
            cardDoGrupo.className = 'grupo-card';
            const nomeClienteElemento = document.createElement('h2');
            nomeClienteElemento.textContent = `Cliente: ${grupo.cliente}`;
            cardDoGrupo.appendChild(nomeClienteElemento);


            grupo.itens.forEach((item) => {
                // --- Parte A: Adiciona os totais para o resumo geral ---
                totalMlinear += parseFloat(item.comprimento || 0);
                totalM2 += parseFloat(item.m2 || 0);
                totalFrete += parseFloat(item.frete || 0);
                totalAprazo += parseFloat(item.totalAprazo || 0);
                totalAvista += parseFloat(item.totalAvista || 0);

                // --- Parte B: Cria o elemento visual para ESTE item ---
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card'; // Supondo que você tenha uma classe para isso
                itemCard.innerHTML = `
                    <p><strong>Produto:</strong> ${item.produto} - ${item.material}</p>
                    <p><strong>Medidas:</strong> ${item.comprimento} x ${item.largura} | <strong>m²:</strong> ${parseFloat(item.m2 || 0).toFixed(2)} | <strong>Qtde:</strong> ${item.quantidade}</p>
                    <p><strong>Valor:</strong> R$ ${parseFloat(item.totalAprazo || 0).toFixed(2)}</p>
                `;
                // Anexa o card do item ao card do grupo
                cardDoGrupo.appendChild(itemCard);
            });

            // 3. CRIA E CONFIGURA O BOTÃO DE PDF. Correto.
            const botaoPDF = document.createElement('button');
            botaoPDF.innerText = 'Gerar PDF do Orçamento';

            console.log(`[CRIANDO BOTÃO] O índice para este botão é: ${grupoIdx} (Tipo: ${typeof grupoIdx})`);
            
            botaoPDF.onclick = () => {
            // LOG 2: VAMOS VER O VALOR DE 'grupoIdx' NO MOMENTO DO CLIQUE
                console.log(`[BOTÃO CLICADO] A função gerarPdfPreview será chamada com o índice: ${grupoIdx}`);
                gerarPdfPreview(grupoIdx); 
            }; 
            
            cardDoGrupo.appendChild(botaoPDF);

            // 4. ANEXA O CARD DO GRUPO COMPLETO AO CONTÊINER. Correto.
            containerDeHistorico.appendChild(cardDoGrupo);

        } else {
            console.warn(`Grupo ${grupoIdx} não tem 'itens' ou 'itens' não é um array.`, grupo);
        }
    }); // <-- FIM DO LOOP PRINCIPAL 'dados.forEach'

    // 5. ATUALIZA OS TOTAIS GERAIS NA TELA (AGORA NO LUGAR CERTO!)
    // Este código agora roda UMA VEZ SÓ, depois que tudo foi calculado.
    const totalMlinearEl = document.getElementById("total-mlinear");
    const totalM2El = document.getElementById("total-m2");
    const totalFreteEl = document.getElementById("total-frete");
    const totalAprazoEl = document.getElementById("total-aprazo");
    const totalAvistaEl = document.getElementById("total-avista");

    if (totalMlinearEl) totalMlinearEl.textContent = totalMlinear.toFixed(2);
    if (totalM2El) totalM2El.textContent = totalM2.toFixed(2);
    if (totalFreteEl) totalFreteEl.textContent = totalFrete.toFixed(2);
    if (totalAprazoEl) totalAprazoEl.textContent = `R$ ${totalAprazo.toFixed(2)}`;
    if (totalAvistaEl) totalAvistaEl.textContent = `R$ ${totalAvista.toFixed(2)}`;

    console.log("--- calcularEExibirTotais: Finalizado ---");
    console.log("Totais FINAIS calculados:", { totalMlinear, totalM2, totalFrete, totalAprazo, totalAvista });
}

/**
 * Função principal para aplicar os filtros selecionados.
 */
function aplicarFiltros() {
    console.log("--- aplicarFiltros: Iniciando ---");
    const filtroCliente = document.getElementById("filtro-cliente")?.value || "todos";
    const filtroMaterial = document.getElementById("filtro-material")?.value || "todos";
    const filtroProduto = document.getElementById("filtro-produto")?.value || "todos";

    console.log("Valores dos filtros:", { filtroCliente, filtroMaterial, filtroProduto });
    console.log("Grupos originais antes da filtragem:", gruposOriginais.length);

    let gruposFiltrados = [...gruposOriginais]; // Começa com todos os dados originais

    // Filtra por cliente
    if (filtroCliente !== "todos") {
        gruposFiltrados = gruposFiltrados.filter(grupo => grupo.cliente === filtroCliente);
        console.log("Grupos após filtro de cliente:", gruposFiltrados.length);
    }

    // Filtra por material e produto (precisa iterar pelos itens dentro dos grupos)
    if (filtroMaterial !== "todos" || filtroProduto !== "todos") {
        gruposFiltrados = gruposFiltrados.map(grupo => {
            // Garante que grupo.itens exista antes de tentar filtrar
            const itensFiltrados = grupo.itens ? grupo.itens.filter(item => {
                const materialCorresponde = (filtroMaterial === "todos" || item.material === filtroMaterial);
                const produtoCorresponde = (filtroProduto === "todos" || item.produto === filtroProduto);
                return materialCorresponde && produtoCorresponde;
            }) : []; // Se não tiver itens, retorna um array vazio
            
            return { ...grupo, itens: itensFiltrados };
        }).filter(grupo => grupo.itens.length > 0); // Remove grupos que ficaram sem itens após o filtro
        console.log("Grupos após filtro de material/produto:", gruposFiltrados.length);
    }

    // Garante que 'grupos' seja sempre um array, mesmo que vazio
    grupos = gruposFiltrados || []; 

    // Se não houver orçamentos após o filtro, exibe mensagem e esconde os cards
    const container = document.getElementById("historico-container");
    const limparBtn = container.querySelector('.limpar-btn'); // Pega o botão existente

    if (container) {
        container.innerHTML = ''; // Limpa o conteúdo
        if (limparBtn) {
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
// Agora recebe o array de grupos a ser renderizado como parâmetro
function renderizarGrupos(gruposParaRenderizar) {
    console.log("--- renderizarGrupos: Iniciando com", gruposParaRenderizar.length, "grupos ---");
    const container = document.getElementById("historico-container");
    const limparBtn = container.querySelector('.limpar-btn'); // Pega o botão existente

    if (!container) {
        console.error("Erro: Container 'historico-container' não encontrado.");
        return;
    }

    container.innerHTML = '';
    if (limparBtn) {
        container.appendChild(limparBtn);
        console.warn("Botão 'limpar-btn' não encontrado para ser re-adicionado.");
    }

    if (!Array.isArray(gruposParaRenderizar) || gruposParaRenderizar.length === 0) {
        container.innerHTML += "<p>Nenhum orçamento salvo.</p>";
        console.log("Nenhum orçamento para renderizar ou 'gruposParaRenderizar' não é um array.");
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
                itemCardDiv.className = "item-card"; // Classe para estilizar o item

                itemCardDiv.innerHTML = `
                    <button class="remove-btn" data-grupo-index="${grupoIndex}" data-item-index="${itemIndex}" onclick="removerItemBtn(this)">X</button>
                    <p><strong>Produto:</strong> ${item.produto}</p>
                    <p><strong>Material:</strong> ${item.material}</p>
                    <p><strong>M²:</strong> ${item.m2 ? item.m2.toFixed(2) : 'N/A'}</p> <!-- Adicionado M² aqui -->
                    <p><strong>Total a prazo:</strong> R$ ${item.totalAprazo.toFixed(2)}</p>
                    <p><strong>Total à vista:</strong> R$ ${item.totalAvista.toFixed(2)}</p>
                    <button class="edit-item-btn" onclick='editarItemHistorico(${JSON.stringify(item)}, "${grupo.cliente}")'>Editar Item</button>
                    <hr/>
                `;
                grupoDiv.appendChild(itemCardDiv); // Adiciona o card do item dentro do grupoDiv
            });
        } else {
            console.warn(`Grupo ${grupo.cliente} não tem 'itens' ou 'itens' não é um array ao renderizar.`);
        }

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
    // Implemente sua lógica de alerta customizado aqui, se necessário
    console.log("Alerta: " + mensagem);
}

function fecharAlerta() {
    // Implemente sua lógica para fechar alerta customizado aqui
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

    // Validação básica
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
        // Não precisamos de findIndex aqui, já temos o grupoIndex
        gruposOriginais.splice(grupoIndex, 1);
        console.log(`Grupo ${grupo.cliente} removido por estar vazio.`);
    }

    salvarGruposNoStorage(); // Salva as alterações no localStorage (dos dados originais)

    // Após remover, reaplica os filtros e renderiza tudo novamente
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
        // <-- CORREÇÃO 1: Garante que a soma seja matemática
        totalGeral += parseFloat(item.totalAprazo || 0); 
    });
    // Agora 'totalGeral' é um número e podemos usar .toFixed() nele
    const totalFormatado = `R$ ${totalGeral.toFixed(2)}`;

    const urlTemplate = 'pdf/orcamento.pdf'; // Verifique se o nome do arquivo está correto
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