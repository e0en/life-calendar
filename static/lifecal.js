const saveSettings = function(birthday, lifespan) {
  const storage = window.localStorage
  storage.setItem('birthday', birthday)
  storage.setItem('lifespan', lifespan)
}

const clearSettings = function() {
  const storage = window.localStorage
  storage.removeItem('birthday')
  storage.removeItem('lifespan')
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
    const storage = window.localStorage
    const storedBirthday = storage.getItem('birthday')
    const storedLifespan = storage.getItem('lifespan')
    if (storedBirthday && storedLifespan) {
      window.location = '/?birthday=' + storedBirthday + '&lifespan=' + storedLifespan
    }
  }
}
