const bancodedados = require("../src/bancodedados");

const listarContas = (req, res) => {
  const senhaBanco = req.query.senha_banco;
  if (senhaBanco !== bancodedados.banco.senha) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }
  return res.json(bancodedados.contas);
};

const criarConta = (req, res) => {
  const novaConta = req.body;
  const { cpf, email } = novaConta;
  const contaExistente = bancodedados.contas.find(
    (conta) => conta.usuario.cpf === cpf || conta.usuario.email === email
  );
  if (contaExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
  }
  const numeroConta = (bancodedados.contas.length + 1).toString();
  novaConta.numero = numeroConta;
  novaConta.saldo = 0;
  bancodedados.contas.push(novaConta);
  return res.status(201).end();
};

const atualizarUsuario = (req, res) => {
  const numeroConta = req.params.numeroConta;
  const { nome, cpf, email } = req.body;
  const conta = bancodedados.contas.find(
    (conta) => conta.numero === numeroConta
  );
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  const contaExistente = bancodedados.contas.find(
    (c) =>
      (c.usuario.cpf === cpf || c.usuario.email === email) &&
      c.numero !== numeroConta
  );
  if (contaExistente) {
    return res
      .status(400)
      .json({ mensagem: "O CPF informado já existe cadastrado!" });
  }
  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.email = email;
  return res.status(204).end();
};

const excluirConta = (req, res) => {
  const numeroConta = req.params.numeroConta;
  const conta = bancodedados.contas.find(
    (conta) => conta.numero === numeroConta
  );
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  if (conta.saldo !== 0) {
    return res
      .status(400)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }
  bancodedados.contas = bancodedados.contas.filter(
    (conta) => conta.numero !== numeroConta
  );
  return res.status(204).end();
};

const consultarSaldo = (req, res) => {
  const numeroConta = req.query.numero_conta;
  const senha = req.query.senha;
  const conta = bancodedados.contas.find(
    (conta) => conta.numero === numeroConta
  );
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta!" });
  }
  return res.json({ saldo: conta.saldo });
};

const emitirExtrato = (req, res) => {
  const numeroConta = req.query.numero_conta;
  const senha = req.query.senha;
  const conta = bancodedados.contas.find(
    (conta) => conta.numero === numeroConta
  );
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta!" });
  }
  const extrato = {
    depositos: bancodedados.depositos.filter(
      (deposito) => deposito.numero_conta === numeroConta
    ),
    saques: bancodedados.saques.filter(
      (saque) => saque.numero_conta === numeroConta
    ),
    transferenciasEnviadas: bancodedados.transferencias.filter(
      (transferencia) => transferencia.numero_conta_origem === numeroConta
    ),
    transferenciasRecebidas: bancodedados.transferencias.filter(
      (transferencia) => transferencia.numero_conta_destino === numeroConta
    ),
  };
  return res.json(extrato);
};

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  consultarSaldo,
  emitirExtrato,
};
