import React, { useState } from 'react';
import { Layout, Menu, Divider, Card, Avatar } from 'antd';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Text2ModelComponent from './src/subpages/text2modelPage';
import { HomeOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import MainPage from './src/subpages/mainPage';



const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;

const menuItems = [
	{
		key: '1',
		icon: <HomeOutlined />,
		label: <Link to="/home">Home</Link>,
	},
	{
		key: '2',
		icon: <UserOutlined />,
		label: 'Submenu',
		children: [
			{
				key: '2-1',
				icon: <VideoCameraOutlined />,
				label: <Link to="/home/text2model">text2model</Link>,
			},
		],
	},
];

function App() {
	const [collapsed, setCollapsed] = useState(false);

	const toggle = () => {
		setCollapsed(!collapsed);
	};
	var userName = '用户名';
	return (
		<Router>
			<Routes>
				<Route path="/" exact element={<Navigate to='/login' />} />
				<Route path="/login" element={<div>login</div>} />
				<Route path="/home" element={<MainPage />} />

			</Routes>
		</Router>
	);
}

function Home() {
	return <h2>Home</h2>;
}

export default App;
