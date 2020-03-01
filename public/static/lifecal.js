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

const loadSettings = function(onsuccess, onfail) {
  getDB(function(store) {
    let request = store.get(0)
    request.onsuccess = function() {
      const user = request.result
      if (user) {
        onsuccess(user)
      } else {
        onfail()
      }
    }
    request.onfail = function() {
      onfail()
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

const drawCalendar = function(birthday, lifespan) {
  const now = Date.now()
  const usedWeeks = Math.round((now - birthday) / 7 / 86400.0 / 1000.0)
  const allWeeks = lifespan * 52

  document.getElementById('used-weeks').innerText = usedWeeks.toString()
  document.getElementById('all-weeks').innerText = allWeeks.toString()

  const tables = document.getElementsByTagName('table')
  const table = tables[0]
  while (table.firstChild) {
    table.removeChild(table.lastChild)
  }
  for (let y = 1; y <= lifespan; y++) {
    const tr = document.createElement('tr')
    const yearLabel = document.createElement('td')
    yearLabel.classList.add('year-label')
    if (y % 5 == 0) {
      yearLabel.innerText = y.toString()
    }
    tr.appendChild(yearLabel)

    for (let w = 0; w < 52; w++) {
      const week = document.createElement('td')
      week.classList.add('week')
      if (((y - 1) * 52 + w) < usedWeeks) {
        week.classList.add('spent')
      }
      tr.appendChild(week)
    }
    table.appendChild(tr)
  }
}

const loadServiceWorker = function() {
  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope)
  }, function(err) {
    console.log('ServiceWorker registration failed: ', err)
  })
}

window.onload = function() {
  loadServiceWorker()
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const is_reset = urlParams.get('reset')
  if (is_reset) {
    clearSettings()
  }
  const forms = document.getElementsByTagName('form')
  if (forms.length > 0) {
    const form = forms[0]
    form.addEventListener('submit', submitForm)
  }

  loadSettings(onsuccess = function(user) {
    document.getElementsByTagName('form')[0].style.display = 'none'
    const birthday = new Date(user.birthday)
    const dateStr = birthday.getFullYear() + '-' + (birthday.getMonth() + 1) + '-' + birthday.getDate()
    drawCalendar(birthday, user.lifespan)
  }, onfail = function() {
    document.getElementsByTagName('section')[0].style.display = 'none'
  })

}
