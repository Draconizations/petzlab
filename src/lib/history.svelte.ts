export const history = createHistory()

interface TrailEntry {
  undo: () => void,
  redo: () => void
}

function createHistory() {
  let trail: TrailEntry[] = $state([])
  let _index = $state(-1)
  let _listening = $state(false)
  
  return {
    push: (undo: () => void, redo: () => void) => {
      if (_index < trail.length - 1) {
        console.log("oops!")
       trail = trail.slice(0, _index + 1)
      }
      trail.push({
        undo,
        redo
      })
      
      _index += 1
    },
    undo: () => {
      if (_index > -1) {
        trail[_index]?.undo()
        _index -= 1
      }
    },
    redo: () => {
      if (_index < trail.length - 1) {
        trail[_index + 1]?.redo()
        _index += 1
      }
    },
    get listening() {
      return _listening
    },
    set listening(listening: boolean) {
      _listening = listening
    },
    get trail() {
      return trail
    },
    get index() {
      return _index
    }
  }
}