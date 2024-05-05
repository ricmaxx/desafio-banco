const express = require("express");
const app = express();
const contaRoutes = require("../routes/contaRoutes");
const transacaoRoutes = require("../routes/transacaoRoutes");

app.use(express.json());

app.use(contaRoutes);
app.use(transacaoRoutes);

app.listen(3000);
