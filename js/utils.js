//Definindo referências para elementos das páginas
var authForm = document.getElementById('authForm')
var authFormTitle = document.getElementById('authFormTitle')
var register = document.getElementById('register')
var access = document.getElementById('access')

//Alterar o formulario de autenticação para o cadastro de contas
function toggleToRegister(){
  authForm.submitAuthForm.innerHTML = "Cadastrar conta";
  authFormTitle.innerHTML = "Insira seus dados para se cadastar"

  hideItem(register)
  showItem(access)
}

//Alterar o formulario para acesso a contas já existente
function toggleToAcess(){
  authForm.submitAuthForm.innerHTML = "Acessar";
  authFormTitle.innerHTML = "Acesse a sua conta para continuar"

  hideItem(access)
  showItem(register)
}

//Simplifica a exibição de elementos da página
function showItem(element){
  element.style.display = 'block'
}

//Simplifica a remoção de elementos da página
function hideItem(element){
  element.style.display = 'none'
}


