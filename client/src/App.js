import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';

function App() {
    return ( < div className = "App" >
        <div>
            <BrowserRouter>
                <MainRouter />
            </BrowserRouter>
        </div>
            
        </div>
    );
}

export default App