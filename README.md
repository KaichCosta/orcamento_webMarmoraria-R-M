# Sistema de Orçamentos - Marmoraria R&M

## 📝 Descrição

Este projeto é uma aplicação web completa desenvolvida para uso interno da Marmoraria R&M. O sistema serve como uma ferramenta para que os funcionários possam criar, gerenciar e consultar orçamentos de serviços em mármore e granito de forma rápida e eficiente, substituindo processos manuais e planilhas.

A aplicação é 100% client-side, utilizando o `localStorage` do navegador para persistência de dados, o que a torna leve e fácil de usar em qualquer dispositivo com um navegador moderno.

## ✨ Funcionalidades Principais

* **Dashboard Inicial:** Uma página inicial que serve como painel de controle, mostrando métricas importantes e dando acesso rápido às principais funções.

* **Criação de Orçamentos:** Um formulário detalhado para adicionar itens, calcular metros quadrados (m²), mão de obra, custos adicionais e aplicar descontos.

* **Histórico de Orçamentos:** Uma página dedicada para visualizar todos os orçamentos salvos, com funcionalidades de busca e filtro por cliente, material ou produto.

* **Edição e Remoção:** Possibilidade de editar itens de um orçamento já salvo ou remover itens e orçamentos inteiros.

* **Geração de PDF:** Funcionalidade para gerar um PDF profissional do orçamento, usando um template da empresa, pronto para ser enviado ao cliente.

* **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, funcionando bem tanto em desktops quanto em dispositivos móveis.

## 🚀 Tecnologias Utilizadas

* **HTML5:** Para a estrutura semântica das páginas.

* **CSS3:** Para a estilização, layout (Flexbox) e responsividade.

* **JavaScript (Vanilla JS):** Para toda a lógica da aplicação, incluindo:

    * Manipulação do DOM (criação dinâmica de elementos).

    * Cálculos de orçamento em tempo real.

    * Gerenciamento de dados e eventos.

* **Browser `localStorage`:** Utilizado como "banco de dados" para salvar e carregar os orçamentos no navegador do usuário.

* [**pdf-lib**](https://pdf-lib.js.org/)**:** Biblioteca JavaScript para carregar um template PDF e preenchê-lo com os dados do orçamento.

## 🔧 Como Rodar o Projeto

Este é um projeto front-end, o acesso pode ser feito em <a href="https://orcamento-da-rm.netlify.app/" target="_blank" > APP <a/>
