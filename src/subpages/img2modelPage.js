import React, { useState } from "react"
import { Image, message, Upload, Flex, Button, Spin, theme, Layout } from "antd"
import { ArrowRightOutlined, UploadOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";




const Img2ModelPage = () => {
    const { Content, Footer } = Layout;
    const { Dragger } = Upload
    const navigate = useNavigate()
    const [img, setImg] = useState('')
    const [imgType, setImgType] = useState('')
    const [imgToken, setImgToken] = useState('')
    const [model, setModel] = useState('')
    const [tid, setTid] = useState('')
    const [renderedImg, setRenderedImg] = useState('')
    const [loading, setLoading] = useState(false);
    const props = {
        accept: ".png, .jpeg",
        name: 'file',
        multiple: false,
        maxCount: 1,
        async onChange(info) {
            if (info.file.status === 'uploading') {
                const imgPth = URL.createObjectURL(info.file.originFileObj)
                setImg(imgPth)
                var uploadRes = await uploadImage(imgPth)
                setImgToken(uploadRes.data.image_token)

            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files)
        }
    }
    const { token } = theme.useToken()
    async function uploadImage(file) {
        const apiKey = "tsk_0ct_V56UlLp48qMkSBfK1EMPM0FkuEgi0IRyzxb5OSR"
        //console.log(file)
        const responseImg = await fetch(file);
        const imgData = await responseImg.blob();
        setImgType(imgData.type.split("/")[1])
        try {
            const formData = new FormData();

            formData.append('file', imgData);

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Error uploading image: ${response.statusText}`)
            }

            const data = await response.json()

            //console.log('img token:', data.data.image_token)    
            return data

        } catch (error) {
            //console.error('Error:', error)
            message.error('Error uploading image')
        }
    }
    function handleImg2Model() {
        setLoading(true);
        if (imgToken !== '') {
            const apiKey = "tsk_0ct_V56UlLp48qMkSBfK1EMPM0FkuEgi0IRyzxb5OSR"
            //console.log('img token:', imgToken)
            const data = {
                type: 'image_to_model',
                file: {
                    type: imgType,
                    file_token: imgToken
                }
            }
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + apiKey
                },
                body: JSON.stringify(data)
            }
            fetch('/api/task', options)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status},info : ${response.statusText}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    //console.log(data)
                    handleTaskSearch(data.data.task_id)
                })
                .catch((error) => {
                    //console.error(error)
                })


        } else {
            message.error('Please upload an image first!')
            setLoading(false);
        }

    }

    function handleTaskSearch(task_id) {
        var resUrl;
        const apiKey = "tsk_0ct_V56UlLp48qMkSBfK1EMPM0FkuEgi0IRyzxb5OSR"
        //setTid(task_id)
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
                    // console.log(imgUrl, modelUrl)
                    // return { img: imgUrl, mdl: modelUrl }
                }


            })
            .catch(error => {
                //console.error(error);
                message.error('生成失败,请检查网络设置或者重选择提示词')
                setLoading(false);
            });
        return resUrl
    }

    return (
        <Layout style={{
            height: '100%',
            width: '100%',

        }}>
            <Content style={{ display: 'flex' }}>
                <div style={{
                    width: '50%',
                    height: '100%',
                    padding: 20

                }}>
                    {img !== '' ?
                        (<div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            backgroundColor: "gray"
                        }}>
                            <Image src={img} alt="preview" ></Image>
                        </div>) :
                        (<Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">点击或者拖拽以上传图片</p>
                            <p className="ant-upload-hint">
                                请一次只上传一张图片，仅支持<code>png</code>和<code>jpeg</code>格式
                            </p>
                        </Dragger>)}


                </div>
                <div style={{
                    width: '50%',
                    height: '100%',
                    padding: 20,
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: token.colorFillAlter,
                        borderRadius: token.borderRadiusLG,
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


                </div>
            </Content>
            <Footer>
                <div style={{


                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                        <Button type="primary" style={{ width: '100%', height: '10%' }} onClick={handleImg2Model}>
                            生成模型<ArrowRightOutlined />

                        </Button>
                    </div>
                </div>
            </Footer>

        </Layout>
    )
}

export default Img2ModelPage;