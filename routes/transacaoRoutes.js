const express = require("express");
const router = express.Router();
const transacaoController = require("../controllers/transacaoController");

router.post("/transacoes/depositar", transacaoController.depositar);
router.post("/transacoes/sacar", transacaoController.sacar);
router.post("/transacoes/transferir", transacaoController.transferir);

module.exports = router;
