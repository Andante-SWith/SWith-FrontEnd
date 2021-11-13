
let eventGuid = 0//저장된 값 불러오기?
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
    end:todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00',
    end:todayStr + 'T12:00:00',
  }
  //   start: todayStr + 'T12:00:00'
  // },
  // {
  //   id: createEventId(),
  //   title: 'Example event 1',
  //   start: todayStr +'T16:00:00'
  // },
  // {
  //   id: createEventId(),
  //   title: 'Example event 2',
  //   start: '2021-11-10'
  // },
  // {
  //   id: createEventId(),
  //   title: 'Example event 3',
  //   start: '2021-11-10'+'T13:00:00'
  // },
  // {
  //   id: createEventId(),
  //   title: 'Example event 4',
  //   start: '2021-11-10'+'T16:00:00'
  // },

 

  
]


export function createEventId() {
  return String(eventGuid++)
}
export function currentID() {
  return String(eventGuid)
}

// console.log(text.substr(14)); // , world!

