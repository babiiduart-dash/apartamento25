# Finanças do Apartamento 25

Dashboard para organizar as finanças da casa: contas compartilhadas
("Contas da Casa"), divididas entre **Bárbara** e **Gabriel**, e as contas
pessoais de cada um.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente http://localhost:5173).

## Como funciona

- **Visão geral**: totais do mês, divisão das contas da casa entre Bárbara e
  Gabriel, e saldo (renda - despesas) de cada um.
- **Contas da Casa**: contas compartilhadas (condomínio, financiamento,
  água, luz, gás, internet, IPTU, etc.), com a porcentagem que cada um paga.
- **Bárbara** / **Gabriel**: contas pessoais de cada um (cartão, plano de
  saúde, celular, etc.), no mesmo formato da agenda 2026 da Bárbara. As
  contas de Gabriel começam vazias - é só clicar em "Adicionar conta" para
  preencher.
- **Contas recorrentes**: cadastro das contas que se repetem todo mês (ou
  todo ano, como o IPTU). A partir do mês configurado em "A partir de", elas
  são lançadas automaticamente em cada mês com o valor padrão - você ajusta
  o valor real e marca como pago em cada aba.

## Dados

Os dados ficam salvos no navegador (localStorage). Use os botões
**Exportar dados** / **Importar dados** no topo para fazer backup ou
transferir entre dispositivos.
