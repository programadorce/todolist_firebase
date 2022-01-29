//Traduz para português brasileiro a autenticação Firebase
firebase.auth().languageCode = 'pt-BR'

//Função para tratar a submissão do formulário de autenticação
authForm.onsubmit = function (event) {
  event.preventDefault()

  if (authForm.submitAuthForm.innerHTML == 'Acessar') {
    showItem(loading)
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      showError('Falha no acesso: ', error)
    })

  } else {
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      showError('Falha no cadastro: ', error)
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
    showError('Falha ao sair da conta: ', error)
  })
}

//Função que permite o usuario validar o e-mail.

function sendEmailVerification() {
  showItem(loading)
  firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(() => {
    var user = firebase.auth().currentUser
    alert('E-mail de verificação foi enviado para ' + user.email + '! Verifique sua caixa de entrada')
  }).catch(() => {
    showError('Falha ao enviar mensagem de verficação de e-mail: ', error)
  }).finally(() => {
    hideItem(loading)
  })
}

//Função que permite o usuario redefinir senha
function sendPasswordResetEmail() {
  var email = prompt("Redefinir senha! Informe seu endereço de e-mail.", authForm.email.value)
  if (email) {
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(() => {
      alert('E-mail de Redefinição de senha foi enviado para ' + email + '! Verifique sua caixa de entrada')
    }).catch(() => {
      showError('Falha ao tentar redefinir senha: ', error)
    }).finally(() => {
      hideItem(loading)
    })
  } else {
    alert("É preciso preencher o campo de e-mail para redefinir a senha")
  }

}

//Função que permit a autenticação pelo Google
function signInWithGoogle() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error) {
    showError('Falha ao autenticar usando o Google: ', error)
  })
}

//Função que permit a autenticação pelo GitHub
function signInWithGitHub() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch((error) => {
    showError('Falha ao autenticar usando o GitHub: ', error)
  })
}

//Função que permit a autenticação pelo facebook
function signInWithFacebook() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch((error) => {
    showError('Falha ao autenticar usando o Facebook: ', error)
  })
}
//Função que permite atualiza nomes de usuários
function updateUserName() {
  var newUserName = prompt("Informe um novo nome de usuário.", userName.innerHTML);
  if (newUserName && newUserName != "") {
    userName.innerHTML = newUserName;
    showItem(loading)
    firebase.auth().currentUser.updateProfile({
      displayName: newUserName
    }).catch(() => {
      showError('Falha ao atualizar seu nome: ', error)
    }).finally(() => {
      hideItem(loading)
    })

  } else {
    alert("O nome de usuário não pode ser vazio")
  }
}

function deleteUser() {
  var confirmation = confirm("Realmente deseja excluir a sua conta?")
  if (confirmation) {
    firebase.auth().currentUser.delete().then(() => {
      showItem(loading)
      alert("Usuário deletado com sucesso!!")
    }).catch((error) => {
      showError('Falha ao deletar usuário: ', error)
    }).finally(() => {
      hideItem(loading)
    })
  } else {
    showError('Erro ao deletar usuário: ', error)
  }

}


