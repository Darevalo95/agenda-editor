import React from 'react';
import { createRoot } from 'react-dom/client';

import AgendaEditor from './components/AgendaEditor';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

    render() {
        return (
            <>
                <AgendaEditor/>
            </>
        );
    }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

