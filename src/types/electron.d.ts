
declare global {
    interface Window {
        electronApi: {
            appClose: () => void
        }
    }
}

export {}