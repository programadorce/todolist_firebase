authForm.onsubmit = function (event) {
  event.preventDefault()

  if (authForm.submitAuthForm.innerHTML == 'Acessar') {
    showItem(loading)
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      console.log("Falha no acesso")
      console.log(error)
    })

  } else {
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      console.log("Falha no cadastro")
      console.log(error)
    })
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  hideItem(loading)
  if (user) {
    showUserContent(user)
  } else {
    showAuth()
  }
})

function signOut() {
  firebase.auth().signOut().catch(function (error) {
    console.log("Falha ao sair da conta")
    console.log(error)
  })
}


