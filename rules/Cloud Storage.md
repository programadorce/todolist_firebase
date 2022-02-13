#Padrão - para usuários autenticados
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

#Teste
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: true;
    }
  }
}

#bloqueado
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: false;
    }
  }
}


#Personalizado - Acesso restrito ao dono do arquivo
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /todoListFiles/{uid}/{allPaths=**} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
      allow delete: if request.auth.uid == uid
      && request.resource.size < 1024 * 1024
      && request.resource.contentType.matches('image/.*');
    }
  }
}