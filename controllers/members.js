const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../utils');
const Intl = require('intl');

//

// index
exports.index = function (req, res) {
  return res.render('members/index', { members: data.members });
};

//Mostra um instrutor específico
exports.show = function (req, res) {
  const { id } = req.params;

  const foundMember = data.members.find(function (member) {
    return member.id == id;
  });

  if (!foundMember) return res.send('Not found');

  var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const member = {
    ...foundMember,
    birth: age(foundMember.birth),
  };

  return res.render('members/show', { member });
};

// create
exports.create = function (req, res) {
  return res.render('members/create');
};

// Cria instrutor
exports.post = function (req, res) {
  //retorna todos as chaves do formulario
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Fill all the fields');
    }
  }

  req.body.birth = Date.parse(req.body.birth);
  req.body.created_at = Date.now();
  req.body.id = Number(data.members.length + 1);

  // Desestruturando o objeto
  const {
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
    id,
  } = req.body;

  data.members.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send('Write file error');

    return res.redirect('/members');
  });
};

// função para editar dados do instrutor
exports.edit = function (req, res) {
  const { id } = req.params;

  const foundMember = data.members.find(function (member) {
    return member.id == id;
  });

  if (!foundMember) return res.send('Not found');

  const member = {
    ...foundMember,
    birth: date(foundMember.birth),
  };
  console.log(member.birth);

  return res.render('members/edit', { member });
};

// Modificar cadastro
exports.put = function (req, res) {
  //busca do body
  const { id } = req.body;
  // salvar o index do instrutor encontrado
  let index = 0;

  const foundMember = data.members.find(function (member, foundIndex) {
    if (id == member.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundMember) return res.send('Not found');

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
  };

  data.members[index] = member;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send('Write error!');

    return res.redirect(`/members/${id}`);
  });
};

// DELETAR INSTRUTOR
exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredMembers = data.members.filter(function (member) {
    return member.id != id;
  });

  data.members = filteredMembers;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return req.send('Writefile error!');

    return res.redirect('/members');
  });
};
