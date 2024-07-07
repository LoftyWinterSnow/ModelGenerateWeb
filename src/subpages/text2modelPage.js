import React, { useState, useToken } from 'react';
import { Input, Button, Image, Spin, Card, Layout, theme, message } from 'antd';
import {ArrowRightOutlined } from '@ant-design/icons';
import { NavLink , useNavigate } from 'react-router-dom';
const { Search } = Input;


function Text2ModelComponent() {
    const [renderedImg, setRenderedImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState(null);
    const { Header, Content, Footer, Sider } = Layout;
    const {token} = theme.useToken()

    function handleTaskSearch(task_id) {
        var resUrl;
        const apiKey = "tsk_0ct_V56UlLp48qMkSBfK1EMPM0FkuEgi0IRyzxb5OSR"

        const prevOptions = {
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
        };
        resUrl = fetch(`/api/task/${task_id}`, prevOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status},info : ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log(data);
                if (data.code !== 0) {
                    throw new Error(`Content error! message: ${data.message},suggestion : ${data.suggestion}`);
                }
                if (data.data.status === 'running' || data.data.status === 'queued') {
                    handleTaskSearch(task_id)
                    //console.log(data.data.status)
                }
                else {
                    const imgUrl = data.data.result.rendered_image.url //xxxx.webp
                    const modelUrl = data.data.result.model.url //xxxx.glb
                    setLoading(false);
                    setRenderedImg(imgUrl);
                    setModel(modelUrl)
                }


            })
            .catch(error => {
                //console.error(error);
                message.error('生成失败,请检查网络设置或者重选择提示词')
                setLoading(false);
            });
        return resUrl
    }
    function handleText2Model(prompt) {
        const apiKey = "tsk_0ct_V56UlLp48qMkSBfK1EMPM0FkuEgi0IRyzxb5OSR"
        const data = {
            type: 'text_to_model',
            prompt: prompt
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        }
        fetch('/api/task', options)
            .then((response) => {
                //.log(111, response)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, info: ${response.statusText}`)
                }

                return response.json()
            })
            .then((data) => {

                handleTaskSearch(data.data.task_id)


            })
            .catch((error) => {
                //console.error(error)
                message.error('生成失败,请检查网络设置或者重选择提示词')
                setLoading(false);
            })
    }

    const handleButtonClick = (prompt) => {
        setLoading(true);
        // handleTaskSearch('da0f5918-7e4c-46bd-846f-2b23127ca7cf')

        if (prompt != '') {
            handleText2Model(prompt);

        } else {
            message.error('请输入提示词')
            setLoading(false);
        }

        // var res = handleTaskSearch('aaa')
        // res.then((data) => {
        //     console.log('img', data.img)

        //     console.log('mdl', data.mdl)
        // })


    };
    const navigate = useNavigate();
    return (
        <>
            <Layout style={{ height: '100%', width: '100%' }}>

                <Content style={{ height: '100%' }}>
                    <div style={{
                        width: '100%',
                        height: '100%',

                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex'
                    }}>
                        {loading ? (
                            <Spin tip="加载中..." style={{ background: 'tranparent' }}>

                            </Spin>
                        ) : (
                            renderedImg ? (<>
                                <Image src={renderedImg} alt="生成的图片" />
                                <Button style={{
                                    textAlign: 'center', 
                                    fontSize: 20,
                                    color: token.colorPrimary,
                                    display: 'table-cell',
                                    border: 'none',
                                    background: 'transparent',
                                }} onClick={()=>{
                                    navigate(`/home/export`)
                                    window.localStorage.setItem('modelUrl', model)

                                }}><ArrowRightOutlined style={{fontSize: 64}}/><br />3D预览</Button>
                            </>) : <p>请输入提示词</p>
                        )}


                    </div>

                </Content>
                <Footer>
                    <Search
                        placeholder="input prompt"
                        size='large'
                        enterButton="Submit"
                        onSearch={handleButtonClick}

                    />


                </Footer>
            </Layout>
        </>

    );
}

export default Text2ModelComponent;
