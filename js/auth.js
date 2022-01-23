//Traduz para português brasileiro a autenticação Firebase
firebase.auth().languageCode = 'pt-BR'

//Função para tratar a submissão do formulário de autenticação
authForm.onsubmit = function (event) {
  event.preventDefault()

  if (authForm.submitAuthForm.innerHTML == 'Acessar') {
    showItem(loading)
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      console.log("Falha no acesso")
      console.log(error)
      hideItem(loading)
    })

  } else {
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      console.log("Falha no cadastro")
      console.log(error)
      hideItem(loading)
    })
  }
}

//Função que centraliza e trata a autenticação
firebase.auth().onAuthStateChanged(function (user) {
  hideItem(loading)
  if (user) {
    showUserContent(user)
  } else {
    showAuth()
  }
})

//função que permite ao usuário sair da conta
function signOut() {
  firebase.auth().signOut().catch(function (error) {
    console.log("Falha ao sair da conta")
    console.log(error)
  })
}

//Função que permite o usuario validar o e-mail.

function sendEmailVerification(){
  showItem(loading)
  firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(()=>{
    var user = firebase.auth().currentUser
    alert('E-mail de verificação foi enviado para ' +  user.email + '! Verifique sua caixa de entrada')
  }).catch(()=>{
    alert('Houve um erro ao enviar a o e-mail de verificação')
  }).finally(()=>{
    hideItem(loading)
  })
}

//Função que permite o usuario redefinir senha
function sendPasswordResetEmail() {
  var email = prompt("Redefinir senha! Informe seu endereço de e-mail.",authForm.email.value)
  if(email){
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email,actionCodeSettings).then(()=>{
      alert('E-mail de Redefinição de senha foi enviado para ' +  email + '! Verifique sua caixa de entrada')
    }).catch(()=>{
      alert("Houve um erro ao enviar e-mail de redefinição de senha")
      console.log(error)
    }).finally(()=>{
      hideItem(loading)
    })
  }else{
      alert("É preciso preencher o campo de e-mail para redefinir a senha")
  }
  
}

//Função que permit a autenticação pelo Google
function signInWithGoogle(){
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error){
    alert("Houve um erro ao autenticar usando o Google")
    console.log(error)
    hideItem(loading)
  })
}



