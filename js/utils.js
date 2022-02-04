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
var userImg = document.getElementById('userImg')
var userName = document.getElementById('userName')
var todoForm = document.getElementById('todoForm')
var todoList = document.getElementById('todoList')
var todoCount = document.getElementById('todoCount')
var ulTodoLit = document.getElementById('ulTodoLit')
var search = document.getElementById('search')
var progressFeedback = document.getElementById('progressFeedback')
var progress = document.getElementById('progress')



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
  if(user.providerData[0].providerId != "password"){
      emailVerified.innerHTML = "Não é necessário verificar e-mail";
      hideItem(sendEmailVeficationDiv)
  }else{
    if(user.emailVerified){
      emailVerified.innerHTML = "E-mail verificado";
      hideItem(sendEmailVeficationDiv)
    }else{
      emailVerified.innerHTML = "E-mail não verificado";
      showItem(sendEmailVeficationDiv)
    }
  }
  
  userImg.src = user.photoURL ? user.photoURL : '/img/unknownUser.png'
  userName.innerHTML = user.displayName;
  userEmail.innerHTML = user.email
  hideItem(auth)
  getDefaultTodoList()

  search.onkeyup = function(){
    if(search.value != ''){
      var searchText = search.value.toLowerCase()
      //Busca tarefas filtradas somente uma vez
      dbRefUsers.child(user.uid)
      .orderByChild('nameLowerCase')
      .startAt(searchText).endAt(searchText + '\uf8ff')
      .once('value').then(function (dataSnapshot){
        fillTodoList(dataSnapshot)
      })
    }else{
      getDefaultTodoList()
    }
  }
  showItem(userContent) 
}

//Busca tarefas em tempo real
function getDefaultTodoList(){
  dbRefUsers.child(firebase.auth().currentUser.uid)
  .orderByChild('name')
  .on('value', function (dataSnapshot){
    fillTodoList(dataSnapshot)
  })
}

//Mostrar conteúdo para usuários não autenticados
function showAuth(){
  authForm.email.value = ''
  authForm.password.value = ''
  hideItem(userContent)
  showItem(auth)
}

//Centralizar e traduzir erros
function showError(prefix, error){
  console.log(error.code)
  hideItem(loading)
  switch (error.code){
    case 'auth/invalid-email': 
    case 'auth/wrong-password': alert(prefix + '' + 'E-mail ou senha inválidos')
    break; 
    case 'auth/email-already-in-use': alert(prefix + '' + 'O E-mail já está cadastrado')
    break;
    case 'auth/weak-password': alert(prefix + '' + 'A senha deve conter no minímo 6 caracteres')
    break;
    case 'auth/popup-closed-by-user': alert(prefix + '' + 'O popup de autenticação foi fechado antes da operação ser concluida')
    break;
    case 'PERMISSION_DENIED': alert(prefix + '' + 'O nome pode ter no máximo 30 caracteres')
    break;

    default: alert(prefix + '' + error.message)  
  }
}

//atributos extras de configuração
var actionCodeSettings = {
  url: 'https://todolist-9b45f.firebaseapp.com'
}







