(function () {
  'use strict'
  const init = function () {
    const triggers = document.querySelectorAll('[data-max-panel]')
    for (let i = 0; i < triggers.length; ++i) {
      triggers[i].addEventListener('click', function () {
        togglePanel(this)
      })
    }

    const sliders = document.querySelectorAll('input[type="range"]')
    for (let i = 0; i < sliders.length; ++i) {
      if (document.querySelector(`[data-max-range="${sliders[i].id}"]`)) {
        sliders[i].addEventListener('change', function () {
          updateSliderValue(this)
        })
        updateSliderValue(sliders[i])
      }
    }
  }

  const togglePanel = function (btn) {
    const panelid = btn.getAttribute('data-max-panel')
    if (panelid) {
      const panel = document.getElementById(panelid)
      if (panel) {
        if (panel.className.indexOf('max-panel-expanded') === -1) {
          panel.classList.add('max-panel-expanded')
          btn.classList.add('max-panel-expanded')
        } else {
          panel.classList.remove('max-panel-expanded')
          btn.classList.remove('max-panel-expanded')
        }
      }
    }
  }

  const updateSliderValue = function (range) {
    const rangeid = range.id
    const valueDoms = document.querySelectorAll(`[data-max-range="${rangeid}"]`)
    for (let i = 0; i < valueDoms.length; ++i) {
      valueDoms[i].innerHTML = range.value
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()