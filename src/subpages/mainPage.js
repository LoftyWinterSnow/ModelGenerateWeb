import React, { useState} from 'react';
import { Layout, Menu, Divider, Card, Avatar, theme } from 'antd';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import '../static/css/mainPage.css';
import { HomeOutlined, UserOutlined, EditOutlined, FormOutlined, 
	FontColorsOutlined, PictureOutlined, ExportOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';


const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;

const menuItems = [
	{
		key: 'home',
		icon: <HomeOutlined />,
		label: <Link to="/home">首页</Link>,
	},
	{
		key: 'generate',
		icon: <FormOutlined />,
		label: '生成',
		children: [
			{
				key: 'text2model',
				icon: <FontColorsOutlined />,
				label: <Link to="text2model">文字生成模型</Link>,
			},
			{
				key: 'img2model',
				icon: <PictureOutlined />,
				label: <Link to="img2model">图片生成模型</Link>,
			},
		],
	},
	{
		key: 'postProcess',
		icon: <EditOutlined />,
		label: '后处理',
		children: [
			{
				key: 'export',
				icon: <ExportOutlined />,
				label: <Link to="export">导出</Link>,
			}
		]
	}
];

function MainPage() {
	const [collapsed, setCollapsed] = useState(false);
	const toggle = () => {
		setCollapsed(!collapsed);

	};
	
	const location = useLocation().pathname.split('/')
    let currentPage = location.slice(-1)[0]
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	var userName = '游客';
	return (
		<ConfigProvider theme={{
			components: {
				Layout: {
					triggerBg: colorBgContainer,
					triggerColor: "black",
				},
			},
		}}>
			<Layout style={{ height: '100vh', width: '100vw' , overflow: 'hidden' }}>
				<Header  >
					<h1 style={{
						color: '#fff',
						fontSize: '24px',
						margin: '0 0 0 20px'
					}}>
						融合多模态AI的VR场景三维重建生成器
					</h1>
				</Header>
				<Layout className="site-layout">
					<Sider collapsible collapsed={collapsed} onCollapse={toggle} style={{
						backgroundColor: colorBgContainer,
					}}>
						<div style={{
							display: 'flex',
							alignItems: 'center',

							padding: '10px 0px 10px 20px'
							//justifyContent: 'center'

						}}>
							<Avatar size={40} >
								{userName.slice(0, 1)}
							</Avatar>
							{!collapsed && (
								<Divider type='vertical' />
							)}
							{!collapsed && (
								<Card bordered={false} size={'small'}
									style={{
										boxShadow: 'none',
										backgroundColor: 'transparent',
										color: '#fff'
									}}>
									<Meta

										title={userName}
										description="欢迎试用"
										className="custom-meta-style"
									/>
								</Card>
							)}
						</div>
						<Menu theme="light" mode="inline" selectedKeys={[currentPage]} items={menuItems}>
						</Menu>
					</Sider>

					<Content>
						<Outlet />
					</Content>
				</Layout>
			</Layout >
		</ConfigProvider>
	);
}


export default MainPage;
