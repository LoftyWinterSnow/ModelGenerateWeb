import { Flex, Layout, Menu , message} from 'antd';
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import {
    DownloadOutlined, InfoCircleOutlined, FileAddOutlined
} from '@ant-design/icons';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function GLBViewer({ modelUrl }) {
    const [model, setModel] = useState(null);
    const { Content, Sider, Header } = Layout;

    //const testModelUrl = `https://tripo-data.cdn.bcebos.com/tcli_27fd31f8ad60490fb7e9c4a09a5f4bdd/20240706/da0f5918-7e4c-46bd-846f-2b23127ca7cf/tripo_draft_da0f5918-7e4c-46bd-846f-2b23127ca7cf.glb?auth_key=1720285050-mK_t5XOb-0-5087cb6e75b60ff3758bbed1fa01be42`

    useEffect(() => {
        const loader = new GLTFLoader();

        modelUrl && loader.load(modelUrl, (gltf) => {
            setModel(gltf.scene);
        });
    }, []);

    const toolBarItem = [
        {
            key: '1',
            icon: <FileAddOutlined />,
            onClick: () => {
                message.info('功能开发中')
            },
        },
        {
            key: '2',
            icon: <DownloadOutlined />,
            onClick: () => {
                message.info('功能开发中')
            },
        },
        {
            key: '3',
            icon: <InfoCircleOutlined />,
            onClick: () => {
                message.info('功能开发中')
            },
        },


    ]

    // if (!model) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div style={{
            width: '100%',
            height: "100%",
            position: 'relative',
            display: 'flex'
        }}>

            <div style={{

                position: 'absolute',
                width: '100%',
                height: "100%",
                overflow: 'hidden',



            }}>
                <canvas style={{
                    // background: 'black',
                    position: 'relative',
                    zIndex: 9


                }} ref={(canvas) => {
                    if (canvas) {
                        const parentElement = canvas.parentElement;
                        const parentWidth = parentElement.offsetWidth;
                        const parentHeight = parentElement.offsetHeight * .98;
                        const renderer = new THREE.WebGLRenderer({ canvas });
                        renderer.setSize(parentWidth, parentHeight);
                        renderer.setClearColor(0x000000, 0);

                        // 获取父元素的中心点

                        const camera = new THREE.PerspectiveCamera(75, parentWidth / parentHeight, 0.1, 1000);
                        camera.position.set(2, 1, 0); // 设置相机位置
                        camera.lookAt(0, 0, 0); // 设置相机目标

                        const controls = new OrbitControls(camera, renderer.domElement);

                        const scene = new THREE.Scene();

                        const light = new THREE.DirectionalLight(0xffffff, 1);
                        light.position.set(5, 10, 7.5);
                        scene.add(light);

                        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                        scene.add(ambientLight);

                        const gridHelper = new THREE.GridHelper(10, 10);
                        scene.add(gridHelper);

                        if (model) {
                            scene.add(model);
                            // 计算模型的包围盒
                            const box = new THREE.Box3().setFromObject(model);
                            // 将模型移动到 y 轴以上
                            model.position.y -= box.min.y;

                            console.log('长度：', box.max.x - box.min.x, '宽度：', box.max.y - box.min.y, '高度：', box.max.z - box.min.z)




                        }
                        const animate = () => {
                            requestAnimationFrame(animate);
                            controls.update();
                            renderer.render(scene, camera);
                        };

                        animate();

                        // 监听父元素的长宽变化并resize自身
                        const resizeObserver = new ResizeObserver(entries => {
                            for (let entry of entries) {
                                const { width, height } = entry.contentRect;
                                renderer.setSize(width, height);
                                camera.aspect = width / height;
                                camera.updateProjectionMatrix();
                            }
                        });
                        resizeObserver.observe(parentElement);

                    }
                }

                }
                />
            </div>
            <div style={{

                position: 'absolute',
                width: '100%',
                height: "100%",
                overflow: 'hidden',



            }}>
                <Layout style={{

                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',


                }}>
                    <Header style={{
                        position: 'relative',
                        zIndex: 11,
                        background: 'rgba(200, 200, 200, 0)',

                    }}>

                        <Flex justify='start' align='middle' style={{

                            marginTop: 40
                        }}>
                            <Menu
                                mode='horizontal'
                                items={toolBarItem}
                                style={{
                                    width: 'auto',

                                }}



                            />
                        </Flex>
                    </Header>

                    <Content style={{
                        backgroundColor: 'transparent',
                    }}>

                    </Content>






                </Layout>
            </div>




        </div >
    );
}

export default GLBViewer;
