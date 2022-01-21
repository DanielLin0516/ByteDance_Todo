export function uuid() {
    return Math.random().toString(16).slice(2)
}

export function saveStatePlugins(store: { subscribe: (arg0: (mutations: any, state: any) => void) => void }) {
    store.subscribe(
        (mutations: any, state: { board: any }) => {
            localStorage.setItem('board', JSON.stringify(state.board))
        }
    )
}