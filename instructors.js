const fs   = require('fs')
const data = require('./data.json')

// exporta função para criar instrutor
exports.post = function(req, res){

  //retorna todos as chaves do formulario
  const keys = Object.keys(req.body)

  for(key of keys){
   if ( req.body[key] == "" ) {
     return res.send("Fill all the fields")
   }
  }

  req.body.birth = Date.parse(req.body.birth)
  req.body.created_at = Date.now()
  req.body.id = Number(data.instructors.length + 1)
  
  // Desestruturando o objeto
  const { avatar_url, name, birth, gender, services, created_at, id } = req.body

  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  })

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
    if (err) return res.send('Write file error')

    return res.redirect("/instructors")
  })

  //return res.send(req.body)
}

// exporta função para atualização dos dados

// exporta função para deletar os dados
