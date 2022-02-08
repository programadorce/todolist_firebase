var database = firebase.database()
var dbRefUsers = database.ref('users')

//Trata da submissão do formularios de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault();
  var file = todoForm.file.files[0] // Seleciona o primeiro arquivo da seleção de arquivos
  if (todoForm.name.value != '') {
    if (file != null) { //verifica se o arquivo foi selecionado
      if (file.type.includes('image')) {//verifica se o arquivo é uma imagem
        //Compõe nome do arquivo
        var imgName = firebase.database().ref().push().key + '-' + file.name
        //compõe o caminho do arquivo
        var imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        //Referencia de arquivo usando o caminho criado na linha acima
        var storageRef = firebase.storage().ref(imgPath)
        //inicia o precesso de upload
        var upload = storageRef.put(file)

        trackUpload(upload).then(function () {
          storageRef.getDownloadURL().then(function (downLoadURL) {
            var data = {
              imgUrl: downLoadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }
            dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
              console.log('Tarefa "' + data.name + '" adicionada com sucesso')
            }).catch((error) => {
              showError('Falha ao adicionar tarefa: ', error)
            })
            todoForm.name.value = ''
            todoForm.file.value = ''
          })
        }).catch(function (error) {
          showError('Falha ao adicionar tarefa: ', error)
        })


      } else {
        alert("O arquivo selecionado precisar se uma imagem. Tente novamente")
      }
    } else {
      var data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }

      dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
        console.log('Tarefa "' + data.name + '" adicionada com sucesso')
      }).catch((error) => {
        showError('Falha ao adicionar tarefa: ', error)
      })

      todoForm.name.value = ''
    }

  } else {
    alert('O nome da tarefa não pode está vazia')
  }
}


//Rastreia o progresso de upload.
function trackUpload(upload) {
  return new Promise(function (resolve, reject) {
    showItem(progressFeedback)
    upload.on('state_changed',
      function (snapshot) { //Recebe informações sobre o upload
        console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%')
        progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
      }, function (error) {
        hideItem(progressFeedback)
        reject(error)
      }, function () {
        console.log("Sucesso no upload")
        hideItem(progressFeedback)
        resolve()
      }
    )

    var playPauseUpload = true; // Estado de controle do nosso upload

    idPauseBtn.onclick = function () { //Botão pausar/continuar de upload clicado
      playPauseUpload = !playPauseUpload //Inverte o estado do controle do ulpload

      if (playPauseUpload) {
        upload.resume()
        idPauseBtn.innerHTML = "Pausar"
      } else {
        upload.pause()
        idPauseBtn.innerHTML = "Continuar"
      }
    }
    cancelBtn.onclick = function () {
      upload.cancel()
      hideItem(progressFeedback)
      resetTodoForm()
    }
  })
}

//Exibir lista de tarefas de usuário
function fillTodoList(dataSnapshot) {
  ulTodoLit.innerHTML = ''
  var num = dataSnapshot.numChildren();
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':';

  dataSnapshot.forEach(function (item) {
    var value = item.val();
    var li = document.createElement('li')
    li.id = item.key

    var imgLi = document.createElement('img')
    imgLi.src = value.imgUrl ? value.imgUrl : 'img/defaultTodo.png'
    imgLi.setAttribute('class', 'imgTodo')
    li.appendChild(imgLi)


    var spanLi = document.createElement('span')
    spanLi.appendChild(document.createTextNode(value.name))
    //spanLi.id = item.key
    li.appendChild(spanLi)

    var liRemoveBtn = document.createElement('button')
    liRemoveBtn.appendChild(document.createTextNode('Excluir'))
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")')
    liRemoveBtn.setAttribute('class', 'danger todoBtn')
    li.appendChild(liRemoveBtn)

    var liUpdateBtn = document.createElement('button')
    liUpdateBtn.appendChild(document.createTextNode('Editar'))
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")')
    liUpdateBtn.setAttribute('class', 'alternative todoBtn')
    li.appendChild(liUpdateBtn)

    ulTodoLit.appendChild(li)
  })

}

function removeTodo(key) {
  var todoName = document.querySelector('#' + key + ' > span')
  var todoImg = document.querySelector('#' + key + ' > img')
  var confirmation = confirm('Realmente deseja remover a tarefa \"' + todoName.innerHTML + '\" ?')
  if (confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then(() => {
      console.log('tarefa ' + todoName.innerHTML + ' removida com sucesso')
      removeFile(todoImg.src)
    }).catch((error) => {
      showError('Falha ao remove tarefa: ', error)
    })
  }
}

function removeFile(imgUrl) {
  //console.log(imgUrl)
  var result = imgUrl.indexOf('img/defaultTodo.png')
  if (result == -1) {
    firebase.storage().refFromURL(imgUrl).delete().then(function () {
      console.log("Arquivo removido com sucesso")
    }).catch(function (error) {
      console.log("Falha ao remover arquivo")
      console.log(error)
    })
  } else {
    console.log("Nenhum arquivo removido")
  }
}

var updateTodoKey = null
function updateTodo(key) {
  updateTodoKey = key //Atribui o conteúdo de key dentro de uma variavél global
  var todoName = document.querySelector('#' + key + ' > span')
  //Altera o título da barra de tarefa
  todoFormTitle.innerHTML = "<strong>Editar a tarefa:</strong>" + todoName.innerHTML
  //altera o texto da entrada de nome (coloca o nome da tarefa a ser atualizada)
  todoForm.name.value = todoName.innerHTML
  hideItem(submitTodoForm)
  showItem(cancelUpdateTodo)

}

//Restaura o estado inicial do formulário de tarefas
function resetTodoForm() {
  todoFormTitle.innerHTML = 'Adicionar tarefa'
  hideItem(cancelUpdateTodo)
  submitTodoForm.style.display = 'initial'
  todoForm.name.value = ''
  todoForm.file.value = ''

}

function confirmTodoUpadate() {
  hideItem(cancelUpdateTodo)
  if (todoForm.name.value != '' || file != null) {
    var todoImg = document.querySelector('#' + updateTodoKey + ' > img')
    var file = todoForm.file.files[0] // Seleciona o primeiro aquivo da seleção de aquivos
    if (file != null) { //verifica se o arquivo foi selecionado
      if (file.type.includes('image')) {//verifica se o arquivo é uma imagem
        //Compõe nome do arquivo
        var imgName = firebase.database().ref().push().updateTodoKey + '-' + file.name
        //compõe o caminho do arquivo
        var imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        //Referencia de arquivo usando o caminho criado na linha acima
        var storageRef = firebase.storage().ref(imgPath)
        //inicia o precesso de upload
        var upload = storageRef.put(file)

        trackUpload(upload).then(function () {
          storageRef.getDownloadURL().then(function (downLoadURL) {
            var data = {
              imgUrl: downLoadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }

            dbRefUsers.child(firebase.auth().currentUser.uid).child(updateTodoKey).update(data).then(() => {
              console.log('tarefa ' + data.name + ' atualizada com sucesso')
            }).catch(() => {
              showError('Falha ao atualizar tarefa: ', error)
            })

            removeFile(todoImg.src)//Remove imagem antiga
            resetTodoForm() //Restaurar o estado inicial do formulário de tarefas
            
          })
          }).catch(function (error) {
            showError('Falha ao atualizar tarefa: ', error)
        })
      } else {
        alert("O arquivo selecioando precisar ser uma imagem")
      }
    } else {
      var data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }

      dbRefUsers.child(firebase.auth().currentUser.uid).child(updateTodoKey).update(data).then(() => {
        console.log('tarefa ' + data.name + ' atualizada com sucesso')
      }).catch(() => {
        showError('Falha ao atualizar tarefa: ', error)
      })
      resetTodoForm() //Restaurar o estado inicial do formulário de tarefas
    }
  } else {
    alert("O nome da tarefa não pode ser vazio!")
    resetTodoForm()
  }
}

function updateTodo2(key) {
  var selectedItem = document.getElementById(key)
  var newTodoname = prompt('Escolha um novo nome para a tarefa \"' + selectedItem.innerHTML + '\".', selectedItem.innerHTML)
  if (newTodoname != '') {
    var data = {
      name: newTodoname,
      nameLowerCase: newTodoname.toLowerCase()
    }
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data).then(() => {
      console.log('tarefa ' + data.name + ' atualizada com sucesso')
    }).catch(() => {
      showError('Falha ao atualizar tarefa: ', error)
    })
  } else {
    alert('O nome da tarefa não pode ser em branco para atualizar a tarefa')
  }

}



