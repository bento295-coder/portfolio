// Sobe o servidor local do painel (Decap CMS) sempre na porta 8081.
// O decap-server lê a variável PORT, que no dev é a porta do Vite (5173);
// sem isto os dois disputariam a mesma porta.
process.env.PORT = process.env.CMS_PORT || '8081'
require('decap-server/dist/index.js')
