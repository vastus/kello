class Kello
  
  constructor: (hours, mins, secs) ->
    @date  = new Date()
    @start = @date.getTime()
    @hours = hours || 0
    @mins  = mins  || 0
    @secs  = secs  || 0
    @times = ['hours', 'mins', 'secs']
    @kaynnista()

  toString: ->
    return "#{@getHours()}:#{@getMins()}:#{@getSecs()}"

  kaynnista: ->
    console.log("Kello käynnistetty")

  getHours: ->
    return @padWithZeros(@getDate().getUTCHours())

  getMins: ->
    return @padWithZeros(@getDate().getUTCMinutes())

  getSecs: ->
    return @padWithZeros(@getDate().getUTCSeconds())

  get: (time) ->
    switch time
      when 'hours' then return @getHours()
      when 'mins' then return @getMins()
      when 'secs' then return @getSecs()
      else throw new TypeError("Time must be one of [#{@times}], not #{time}")

  padWithZeros: (num) ->
    if (num < 10)
      num = "0#{num}"
    return num

  getDate: ->
    erotus = new Date().getTime() - @start
    return new Date(erotus)

  setTime: (hours, mins, secs) ->
    @start -= 1000*((hours * 60 * 60) + (mins * 60) + (secs))

# -- /Kello

class Logic

  constructor: ->
    @states      = ["normal", "adjust"]
    @modes       = ["clock", "counter", "timer"]
    @adjustables = ["clock", "timer"]
    @init()

  init: ->
    @state = "normal"
    console.log(@toString())

  curState: (state) ->
    if state?
      return state is @state
    return @state

  changeState: (state) ->
    if state not in @states
      throw new TypeError("State must be one of: [#{@states}], not #{state}")
    return @state = state

  curMode: ->
    return @modes[0]

  changeMode: ->
    mode = @modes.shift()
    @modes.push(mode)
    console.log(@toString())
    return mode

  adjust: ->
    if (@curMode() in @adjustables)
      @changeState('adjust')
      console.log("Adjusting: #{@curMode()}")
    else
      console.log("Mode [#{@curMode()}] is not adjustable")

  toString: ->
    return "In mode: [#{@curMode()}]"

# -- /Interface

kello = new Kello()
logic = new Logic()

jQuery ->

  # div that displays the mode (and state)
  mode = $('#mode')

  # control buttons
  modeBtn  = $('#modeBtn')
  enterBtn = $('#enterBtn')
  upBtn    = $('#upBtn')
  downBtn  = $('#downBtn')

  # local vars
  start = 0
  adjustTimeout = setTimeout

  clock =
    running: false
    hours:
      interval: setInterval
      updateValue: 60 * 60 * 1000
      prev: 0
      elem: $('#hours')
    mins:
      interval: setInterval
      updateValue: 60 * 1000
      prev: 0
      elem: $('#mins')
    secs:
      interval: setInterval
      updateValue: 1000
      prev: 0
      elem: $('#secs')
    elems: [$('#hours'), $('#mins'), $('#secs')]
    selectedElem: 0
    run: ->
      updateSecs()
      updateMins()
      updateHours()
    freeze: ->
      intervals = [this.secs.interval, this.mins.interval, this.hours.interval]
      clearInterval(interval) for interval in intervals
    reset: ->
      kello = new Kello()
      this.run()

  # display the mode
  setStatus = (opt) ->
    if opt
      mode.html(logic.curMode().toUpperCase() + " - " + logic.curState())
    else
      mode.html(logic.curMode().toUpperCase())

  # change mode fn
  changeMode = ->
    logic.changeMode()
    setStatus()

  # adjust the current mode
  adjust = ->
    logic.adjust()
    setStatus(1)

  changeState = ->
    logic.changeState('normal')
    setStatus()

  # press and hold modeBtn for 2 s 
  # to adjust current mode
  modeBtn.mousedown ->
    start = new Date().getTime()
    adjustTimeout = setTimeout (->
      adjust()
    ), 2000

  # change the mode when modeBtn
  # has been clicked (held down < 2 s)
  # and the current mode is normal
  modeBtn.mouseup ->
    clearTimeout(adjustTimeout)
    erotus = new Date().getTime() - start
    if erotus < 2000
      changeMode() if logic.curState('normal')

  enterBtn.click ->
    if logic.curState('adjust')
      changeState('normal')

  # adjusting clock time
  modeBtn.click ->
    if logic.curMode('clock') and logic.curState('adjust')
      clock.freeze()
      clock.selectedElem = toggleElems(clock.elems)
      blinkToggle(clock.selectedElem)

  upBtn.click ->
    console.log('click')
    if logic.curMode('clock') and logic.curState('adjust')
      increment(clock.selectedElem)

  downBtn.click ->
    console.log('click')
    if logic.curMode('clock') and logic.curState('adjust')
      decrement(clock.selectedElem)

  increment = (elem) ->
    console.log("cur: " + elem.html())
    num = parseInt(elem.html())
    elem.html(num + 1)

  decrement = (elem) ->
    console.log("cur: " + elem.html())
    num = parseInt(elem.html())
    elem.html(num - 1)

  updateClockProperty = (property, elem) ->
    clock[property].interval = setInterval (->
      num = kello.get(property)
      clock[property].elem.html(num)
      clock[property].prev = num
    ), clock[property].updateValue

  updateHours = ->
    updateClockProperty('hours')

  updateMins = ->
    updateClockProperty('mins')

  updateSecs = ->
    updateClockProperty('secs')

  toggleElems = (elems) ->
    elem = elems.shift()
    elems.push(elem)
    return elem

  blinkToggle = (elem) ->
    elem.toggleClass('blink')

  # do this after that
  setStatus()
  clock.run()

