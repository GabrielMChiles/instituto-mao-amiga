# Roteiro de Demonstração do Aplicativo (Máximo 3 Minutos)

## Passo a Passo Executável

1. **Registrar uma Doação (00:00 - 00:45)**
   - Abrir o app e clicar no botão `+` no topo da tela de histórico.
   - Selecionar o tipo "ROUPA", escolher o ponto de destino "Ponto Jardim Goiás".
   - Preencher a quantidade "10" e a descrição "Agasalhos de frio infantis".
   - Clicar em "Confirmar Doação". Voltar automaticamente para a tela inicial.

2. **Ver o Histórico e o Resumo Atualizado (00:45 - 01:15)**
   - Mostrar o Card de Resumo no topo recalculando os totais instantaneamente.
   - Destacar o total geral de doações e a lista ordenada por maior quantidade de itens.

3. **Filtrar Doações (01:15 - 01:45)**
   - Tocar no campo de busca "Buscar por tipo de item...".
   - Digitar "roupa". Mostrar a lista sendo filtrada em tempo real enquanto o Card de Resumo do topo permanece intacto com os totais globais.
   - Limpar a busca.

4. **Editar e Excluir uma Doação (01:45 - 02:30)**
   - Tocar no item recém-criado para abrir a tela de Detalhes.
   - Clicar no botão "Editar". Alterar a quantidade de "10" para "15". Salvar e confirmar a atualização no histórico.
   - Entrar no detalhe novamente e acionar o botão "Excluir". Confirmar o alerta nativo. O item desaparece e os totais do resumo recalculam instantaneamente.

5. **Testar Persistência (Fechar e Reabrir) (02:30 - 03:00)**
   - Fechar o aplicativo completamente (encerrar o processo na multitarefa).
   - Reabrir o app e comprovar que todos os dados persistem perfeitamente através do `AsyncStorage`.

---