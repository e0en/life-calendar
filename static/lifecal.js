const dbName = 'life-calendar'
const storeName = 'users'

const getDB = function(onsuccess) {
  let openRequest = indexedDB.open(dbName)
  openRequest.onupgradeneeded = function() {
    let db = openRequest.result
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, {keyPath: 'id'})
    }
  }
  openRequest.onerror = function() {
    console.error('Error', openRequest.error)
  }
  openRequest.onsuccess = function() {
    let db = openRequest.result
    let tx = db.transaction(storeName, 'readwrite')
    let store = tx.objectStore(storeName)

    onsuccess(store)

    tx.oncomplete = function() {
      db.close()
    }
  }
}

const saveSettings = function(birthday, lifespan) {
  user = {
    id: 0,
    birthday: birthday,
    lifespan: lifespan
  }

  getDB(function(store) {
    let request = store.put(user)
    request.onsuccess = function() {
      console.log('User added to the store', request.result)
    }
    request.onerror = function() {
      console.log('Error', request.error)
    }
  })
}

const loadSettings = function(onsuccess) {
  getDB(function(store) {
    let request = store.get(0)
    request.onsuccess = function() {
      const user = request.result
      if (user) {
        onsuccess(user)
      }
    }
  })
}

const clearSettings = function() {
  getDB(function(store) {
    let request = store.delete(0)
  })
}

const submitForm = function(ev) {
  const forms = document.getElementsByTagName('form')
  const form = forms[0]
  const birthday = form.elements['birthday'].value
  const lifespan = form.elements['lifespan'].value
  saveSettings(birthday, lifespan)
}

window.onload = function() {
  const forms = document.getElementsByTagName('form')
  if (forms.length > 0) {
    console.log(forms)
    const form = forms[0]
    form.addEventListener('submit', submitForm)
  }

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const birthday = urlParams.get('birthday')
  const lifespan = urlParams.get('lifespan')
  const is_reset = urlParams.get('reset')
  if (is_reset) {
    clearSettings()
  }


  if (birthday && lifespan) {
    saveSettings(birthday, lifespan)
  } else if (!(birthday && lifespan)) {
    loadSettings(function(user) {
      window.location = '/?birthday=' + user.birthday + '&lifespan=' + user.lifespan
    })
  }
}
