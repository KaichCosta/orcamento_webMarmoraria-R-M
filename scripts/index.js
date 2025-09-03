document.addEventListener('DOMContentLoaded', () => {
    function carregarDadosDashboard() {
        const grupos = JSON.parse(localStorage.getItem('gruposOrcamento')) || [];

        const totalOrcamentosEl = document.getElementById('total-orcamentos');
        if (totalOrcamentosEl) {
            totalOrcamentosEl.textContent = grupos.length;
        }

        const listaAtividadesEl = document.getElementById('lista-atividades');
        if (listaAtividadesEl && grupos.length > 0) {
            listaAtividadesEl.innerHTML = '';
            const atividadesRecentes = grupos.slice(-3).reverse();

            atividadesRecentes.forEach(grupo => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#">Orçamento para "${grupo.cliente}" - Criado em ${grupo.dataHora || 'data indisponível'}</a>`;
                listaAtividadesEl.appendChild(listItem);
            });
        }
    }
    carregarDadosDashboard();
});