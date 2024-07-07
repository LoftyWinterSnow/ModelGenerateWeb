import React, { useState, useParams } from "react"
import GLBViewer from "./glbViewer"
import { Layout, Menu, message } from "antd"
import { useSearchParams, useNavigate } from "react-router-dom"

const Export = () => {
    const { Sider, Content } = Layout
    const [modelUrl, setModelUrl] = useState(window.localStorage.getItem('modelUrl'))

    //console.log(modelUrl)


    return (
        <Layout style={{

            height: '100%',
            width: '100%',

        }}>
            <Content style={{

                height: '100%',
                width: '100%',
                overflow: 'hidden',

            }}>

                <GLBViewer
                    modelUrl={modelUrl}
                />



            </Content>
        </Layout>
    )
}

export default Export
