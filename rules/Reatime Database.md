#Padrão
{
  "rules": {
    ".read": false,  
    ".write": false
  }
}

#Público
{
  "rules": {
    ".read": true,  
    ".write": true
  }
}

#Usuários autenticados
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

#acesso restrito ao dono dos dados
{
  "rules": {
    "users":{
      "$uid":{
        ".read": "$uid == auth.uid",
    		".write": "$uid == auth.uid"
      }
    }
  }
}

#acesso restrito ao dono dos dados e restrição da quantidade de caracteres
{
  "rules": {
    "users":{
      "$uid":{
        ".read": "$uid == auth.uid",
    		".write": "$uid == auth.uid",
          "$tid": {
            ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30"
          }
      }
    }
  }
}



