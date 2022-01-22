//Definindo referências para elementos das páginas
var authForm = document.getElementById('authForm')
var authFormTitle = document.getElementById('authFormTitle')
var register = document.getElementById('register')
var access = document.getElementById('access')
var loading = document.getElementById('loading')
var auth = document.getElementById('auth')
var userContent = document.getElementById('userContent')
var userEmail = document.getElementById('userEmail')
var emailVerified = document.getElementById('emailVerified')
var sendEmailVeficationDiv = document.getElementById('sendEmailVeficationDiv')
var passwordReset = document.getElementById('passwordReset')



//Alterar o formulario de autenticação para o cadastro de contas
function toggleToRegister(){
  authForm.submitAuthForm.innerHTML = "Cadastrar conta";
  authFormTitle.innerHTML = "Insira seus dados para se cadastar"

  hideItem(register)
  showItem(access)
  hideItem(passwordReset)
}

//Alterar o formulario para acesso a contas já existente
function toggleToAcess(){
  authForm.submitAuthForm.innerHTML = "Acessar";
  authFormTitle.innerHTML = "Acesse a sua conta para continuar"

  hideItem(access)
  showItem(register)
  showItem(passwordReset)
}

//Simplifica a exibição de elementos da página
function showItem(element){
  element.style.display = 'block'
}

//Simplifica a remoção de elementos da página
function hideItem(element){
  element.style.display = 'none'
}


//Mostrar conteúdo para usuários autenticados
function showUserContent(user){
  console.log(user)
  if(user.emailVerified){
    emailVerified.innerHTML = "E-mail verificado";
    hideItem(sendEmailVeficationDiv)
  }else{
    emailVerified.innerHTML = "E-mail não verificado";
    showItem(sendEmailVeficationDiv)
  }
  userEmail.innerHTML = user.email
  hideItem(auth)
  showItem(userContent) 
}

//Mostrar conteúdo para usuários não autenticados
function showAuth(){
  authForm.email.value = ''
  authForm.password.value = ''
  hideItem(userContent)
  showItem(auth)
}

//atributos extras de configuração
var actionCodeSettings = {
  url: 'http://127.0.0.1:5500/'
}




