import {Main} from "@/pages/Main.tsx"
import {RunContextProvider} from "@/contexts/RunContextProvider.tsx"

//
function App() {
    return <div className={'h-screen'}>
        <RunContextProvider>
            <Main/>
        </RunContextProvider>
    </div>
}

export default App
