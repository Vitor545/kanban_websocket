import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/login';
import Kanban from './pages/kanban';
import Register from './pages/register';
import './styles/styles.css';

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/kanban' element={<Kanban />} />
				<Route path='/register' element={<Register />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
