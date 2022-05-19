function ticketMVC() {
    const storage = Storage()
    const { tickets } = storage.get()
  
    return {
      init() {
        // needed because #/ navigation breaks [autofocus]
        this.$refs.newticketInput.focus()
      },
  
      save() {
        this.$nextTick(() => {
          storage.set({ tickets: this.tickets })
        })
      },
  
      // data
  
      tickets,
      newticket: '',
  
      // filtering
  
      listtickets() {
        switch (this.filter) {
          case 'active':
            return this.tickets.filter(isNotCompleted)
          case 'completed':
            return this.tickets.filter(isCompleted)
          default:
            return this.tickets
        }
      },
  
      // toggle compeleted check
  
      toggleAll({ target: { checked } }) {
        this.tickets.forEach(ticket => {
          ticket.completed = checked
        })
      },
  
      toggle(ticket, { target: { checked } }) {
        ticket.completed = checked
      },
  
      countIncomplete() {
        return this.tickets.reduce(
          (acc, { completed }) => acc + Number(!completed),
          0,
        )
      },
  
      // adding new tickets
  
      add() {
        const id = new Date().getTime()
        this.tickets = [
          ...this.tickets,
          { id, title: this.newticket.trim(), completed: false },
        ]
        this.newticket = ''
      },
  
      // removing tickets
  
      remove(ticket) {
        const idx = findIdx(ticket, this.tickets)
        this.tickets = [
          ...this.tickets.slice(0, idx),
          ...this.tickets.slice(idx + 1, this.tickets.length),
        ]
      },
  
      clear() {
        this.tickets = this.tickets.filter(isNotCompleted)
      },
  
      // editing tickets
  
      editing(ticket) {
        ticket.editing = true
        ticket.edit = ticket.title
  
        this.$nextTick(() => {
          document.getElementById(`edit-${ticket.id}`).focus()
        })
      },
  
      edit(ticket) {
        const newTitle = ticket.edit.trim()
        if (!newTitle) {
          this.remove(ticket)
        } else {
          ticket.title = newTitle
          this.reset(ticket)
        }
      },
  
      reset(ticket) {
        ticket.editing = false
        ticket.edit = ''
      },
  
      // counter at the bottom
  
      showCounter() {
        const count = this.countIncomplete()
        return `<strong>${count}</strong> item${count === 1 ? '' : 's'} left`
      },
    }
  }
  
  function Storage() {
    const KEY = 'tickets-alpinejs'
    const defaultData = '{ "tickets": [] }'
  
    return {
      get() {
        return JSON.parse(localStorage.getItem(KEY) || defaultData)
      },
      set({ tickets, ...rest }) {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            ...rest,
            tickets: tickets.map(({ id, title, completed }) => ({
              id,
              title,
              completed,
            })),
          }),
        )
      },
    }
  }
  
  function findIdx(ticket, tickets) {
    const idx = tickets.findIndex(({ id }) => id === ticket.id)
    if (idx < 0) throw Error(`Can not find ticket`)
    return idx
  }
  
  function isCompleted({ completed }) {
    return completed
  }
  
  function isNotCompleted({ completed }) {
    return !completed
  }
  