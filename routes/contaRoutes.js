const express = require("express");
const router = express.Router();
const contaController = require("../controllers/contaController");

router.get("/contas", contaController.listarContas);
router.post("/contas", contaController.criarConta);
router.put("/contas/:numeroConta/usuario", contaController.atualizarUsuario);
router.delete("/contas/:numeroConta", contaController.excluirConta);
router.get("/contas/saldo", contaController.consultarSaldo);
router.get("/contas/extrato", contaController.emitirExtrato);

module.exports = router;
