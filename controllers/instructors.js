const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../utils');
const Intl = require('intl');

// index
exports.index = function (req, res) {
  return res.render('instructors/index', { instructors: data.instructors });
};

//Mostra um instrutor específico
exports.show = function (req, res) {
  const { id } = req.params;

  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id;
  });

  if (!foundInstructor) return res.send('Not found');

  var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const instructor = {
    ...foundInstructor,
    birth: age(foundInstructor.birth),
    services: foundInstructor.services.split(','),
    created_at: new Intl.DateTimeFormat('pt-BR', options).format(
      foundInstructor.created_at
    ),
  };

  return res.render('instructors/show', { instructor });
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
  req.body.id = Number(data.instructors.length + 1);

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

  data.instructors.push({
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

    return res.redirect('/instructors');
  });
};

// função para editar dados do instrutor
exports.edit = function (req, res) {
  const { id } = req.params;

  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id;
  });

  if (!foundInstructor) return res.send('Not found');

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth),
  };
  console.log(instructor.birth);

  return res.render('instructors/edit', { instructor });
};

// Modificar cadastro
exports.put = function (req, res) {
  //busca do body
  const { id } = req.body;
  // salvar o index do instrutor encontrado
  let index = 0;

  const foundInstructor = data.instructors.find(function (
    instructor,
    foundIndex
  ) {
    if (id == instructor.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundInstructor) return res.send('Not found');

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
  };

  data.instructors[index] = instructor;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send('Write error!');

    return res.redirect(`/instructors/${id}`);
  });
};

// DELETAR INSTRUTOR
exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredInstructors = data.instructors.filter(function (instructor) {
    return instructor.id != id;
  });

  data.instructors = filteredInstructors;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return req.send('Writefile error!');

    return res.redirect('/instructors');
  });
};
