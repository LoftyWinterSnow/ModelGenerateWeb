import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Text2ModelComponent from './subpages/text2modelPage';
import LoginPage from './subpages/loginPage';
import MainPage from './subpages/mainPage';
import Export from './subpages/exportPage';
import Img2ModelPage from './subpages/img2modelPage';



function App() {

	return (

		<Router>
			<Routes>
				<Route path="/" exact element={<Navigate to='/home' />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/home" element={<MainPage />}>
					<Route index element={<Home />} />
					<Route path="text2model" element={<Text2ModelComponent />} />
					<Route path="img2model" element={<Img2ModelPage />} />
					<Route path="export" element={<Export />} />

				</Route>

			</Routes>
		</Router>
	);
}

function Home() {
	return (
		<div style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		}}>
			<h1>欢迎试用本工具</h1>
			<p>本工具仍在开发中, 如果出现问题，请<Link to='https://github.com/LoftyWinterSnow'>联系我</Link></p>
		</div>
		
	);
}

export default App;
