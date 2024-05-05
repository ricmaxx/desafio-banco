const bancodedados = require("../src/bancodedados");

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;
  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  const conta = bancodedados.contas.find(
    (conta) => conta.numero === numero_conta
  );
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "O valor do depósito deve ser maior que zero!" });
  }
  conta.saldo += valor;
  bancodedados.depositos.push({ data: new Date(), numero_conta, valor });
  return res.status(204).end();
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  if (!numero_conta || !valor || !senha) {
    return res.status(400).json({
      mensagem: "O número da conta, o valor e a senha são obrigatórios!",
    });
  }
  const conta = bancodedados.contas.find(
    (conta) => conta.numero === numero_conta
  );
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta!" });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "O valor do saque deve ser maior que zero!" });
  }
  if (conta.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente!" });
  }
  conta.saldo -= valor;
  bancodedados.saques.push({ data: new Date(), numero_conta, valor });
  return res.status(204).end();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res.status(400).json({
      mensagem:
        "Os números das contas de origem e destino, o valor e a senha são obrigatórios!",
    });
  }
  const contaOrigem = bancodedados.contas.find(
    (conta) => conta.numero === numero_conta_origem
  );
  const contaDestino = bancodedados.contas.find(
    (conta) => conta.numero === numero_conta_destino
  );
  if (!contaOrigem || !contaDestino) {
    return res
      .status(404)
      .json({ mensagem: "Uma das contas bancárias não foi encontrada!" });
  }
  if (senha !== contaOrigem.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta!" });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "O valor da transferência deve ser maior que zero!" });
  }
  if (contaOrigem.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente!" });
  }
  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;
  bancodedados.transferencias.push({
    data: new Date(),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  });
  return res.status(204).end();
};

module.exports = {
  depositar,
  sacar,
  transferir,
};
