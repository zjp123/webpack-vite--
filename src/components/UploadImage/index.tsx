import { Upload, message, Spin, Button, Space, Tooltip, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { imagesUpload } from '@/api/common'
import { PhotoSlider } from 'react-photo-view'
import 'react-photo-view/dist/index.css'
import { DeleteOutlined, EyeOutlined, UploadOutlined, FullscreenOutlined, PictureOutlined, PlusOutlined, RotateRightOutlined } from '@ant-design/icons/lib'
import { getBase64, getChangeArrayPosition } from '@/utils'
import './style.less'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface FileList {
    id: string
    uid: string
    name: string
    status: string
    url: string
}

interface UploadImageProps {
    num?: number //上传图片数量
    getImageUrls: (urlList: Array<string>) => void //图片返回数据['https://pic.58cdn.com.cn/*********']
    picUrl?: Array<any> //picUrl 图片组件回显['imgUrl']
    size?: string //展示图片大小
    cut?: boolean //是否支持裁剪
    isReturnArray?: boolean //返回数据类型目前支持返回数组对象，以及数组字符串
    isPreview?: boolean //是否可以预览
    isDelete?: boolean //是否可以删除
    isUpload?: boolean //是否可以重新上传
    isSetCover?: boolean //是否可以设为封面
    multiple?: boolean //是否可以多张上传
    initialAspectRatio?: number // 裁剪比例
}

function GetRandomNum(Min,Max)
{
  var Range = Max - Min;
  var Rand = Math.random();
  return(Min + Math.round(Rand * Range));
}

const PicturesWall: React.FC<UploadImageProps> = (props) => {
    const { getImageUrls, picUrl, size, cut, num = 10, isReturnArray, isPreview, isDelete, isUpload, isSetCover, initialAspectRatio } = props
    const uploadRef = useRef()
    const [uploadIndex, setUploadIndex] = useState(-1) //重新上传图片下标
    const [visible, setVisible] = useState(false) //是否展示裁剪框
    const [photoIndex, setPhotoIndex] = useState(0) // 图片下标，预览时使用
    const [fileList, setFileList] = useState<FileList[]>([]) //上传完成图片列表
    let [uploadImagesLength, setUploadImagesLength] = useState(0) //上传图片列表长度
    const [uploadLoading, setUploadLoading] = useState(true) //是否展示全局loading

    useEffect(() => {
        let urlList: Array<any> = []
        if (fileList.length > 0) {
            fileList.map((item) => {
                let tempArray = isReturnArray ? item.url : { url: item.url, id: item.id }
                urlList.push(tempArray)
            })
        }
        getImageUrls(urlList)
    }, [fileList])

    useEffect(() => {
        if (picUrl && picUrl.length > 0) {
            setUploadImagesLength(picUrl.length) //编辑
            picUrl.map((item: any, index) => {
                if (item) {
                    fileList.push({
                        id: item.id || '',
                        uid: index.toString(),
                        name: '',
                        status: 'done',
                        url: isReturnArray ? item : item.url,
                    })
                } else {
                    fileList.push({
                        id: item.id || '',
                        uid: index.toString(),
                        name: '',
                        status: 'done',
                        url: 'https://img.58cdn.com.cn/dist/jxt/images/defaultPic.png',
                    })
                }
            })
            setFileList(() => [...fileList])
        }
    }, [picUrl])

    useEffect(() => {
        setUploadLoading(uploadImagesLength === fileList.length)
    }, [uploadImagesLength, fileList])

    /**
     * 图片预览
     * @param index
     */
    const handlePreview = (index: number) => {
        setVisible(true)
        setPhotoIndex(index)
    }

    /**
     * 上传图片判断是否大于5MB
     * @param file
     */
    const handleBeforeUpload = (file: File) => {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
            message.error('上传图片大小不能超过5MB')
        }
        return isLt2M
    }
    /**
     * 获取图片
     * @param option
     */
    const customRequest = async (option: any) => {
        try {
            let res = await getBase64(option.file)
            fileRequest(res, option)
        } catch (e) {
            message.error(`图片${option.file.name}上传失败请重试`)
        }
    }

    /**
     * 图片上传
     */
    const fileRequest = async (res: string, option = null) => {
        let uploadBox: any = document.querySelector('#again-upload')
        try {
            setImgUpload(true)
            let url = await imagesUpload(res as string)
            setImgUpload(false)
            uploadBox && (uploadBox.value = '')
            uploadIndex === -1
                ? fileList.push({
                      id: '',
                      uid: option ? option.file.uid : '' + GetRandomNum(1, 999),
                      name: option ? option.file.name : '',
                      status: 'done',
                      url: url,
                  })
                : fileList.splice(uploadIndex, 1, {
                      id: '',
                      uid: option ? option.file.uid : '' + GetRandomNum(1, 999),
                      name: option ? option.file.name : '',
                      status: 'done',
                      url: url,
                  })
            if (fileList.length > num) {
                return
            }
            setFileList(() => [...fileList])
            setUploadIndex(-1)
            if (editImageModalVisible) {
                setEditImageModalVisible(false)
            }
        } catch (e) {
            setImgUpload(false)
            uploadBox && (uploadBox.value = '')
            uploadIndex === -1
                ? fileList.push({
                      id: '',
                      uid: option ? option.file.uid : '',
                      name: option ? option.file.name : '',
                      status: 'error',
                      url: '',
                  })
                : fileList.splice(uploadIndex, 1, {
                      id: '',
                      uid: option ? option.file.uid : '',
                      name: option ? option.file.name : '',
                      status: 'error',
                      url: '',
                  })
            setFileList(() => [...fileList])
            setUploadIndex(-1)
            message.error(`图片${option.file.name}上传失败请重试`)
        }
    }

    /**
     * 删除图片
     * @param file
     */
    const handleRemove = (file: any) => {
        let imageFile = JSON.parse(JSON.stringify(fileList))
        imageFile.map((item: any, index: number) => {
            if (item.uid === file.uid) {
                imageFile.splice(index, 1)
            }
        })
        setFileList(imageFile)
        setUploadImagesLength(uploadImagesLength - 1)
    }

    /**
     * 单张图片上传
     * @param index
     */
    const handleUpload = (index: number) => {
        setUploadIndex(index)
        // @ts-ignore
        document.querySelector('#again-upload').click()
        // uploadRef.current.click()
    }

    /**
     * 设置图片封面
     */
    const handleSetCover = (index: number) => {
        const list = getChangeArrayPosition(index, fileList as [])
        setFileList(list)
    }

    /**
     * 图片裁剪
     */
    const [srcCropper, setSrcCropper] = useState('')
    const [imgUpload, setImgUpload] = useState(false)
    const [editImageModalVisible, setEditImageModalVisible] = useState(false)
    const cropperRef = useRef<HTMLImageElement>(null)
    const cutHandleBeforeUpload = async (file: File) => {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
            message.error(`上传图片大小不能超过5MB`)
            return isLt2M
        }
        let res = await getBase64(file)
        setSrcCropper(res)
        setEditImageModalVisible(true)
        return false
    }
    const modalFooter = () => {
        return (
            <>
                <Space style={{ float: 'left' }} size={1}>
                    <Button
                        key="choice"
                        type="primary"
                        style={{ marginRight: 20 }}
                        onClick={() => {
                            ;(document.querySelector('#again-upload') as any).click()
                        }}
                    >
                        选图
                    </Button>
                    <Button
                        key="large"
                        type="primary"
                        onClick={() => {
                            const imageElement: any = cropperRef?.current
                            const cropper: any = imageElement?.cropper
                            cropper.zoom(0.1)
                        }}
                    >
                        放大
                    </Button>
                    <Button
                        key="small"
                        type="primary"
                        onClick={() => {
                            const imageElement: any = cropperRef?.current
                            const cropper: any = imageElement?.cropper
                            cropper.zoom(-0.1)
                        }}
                    >
                        缩小
                    </Button>
                    <Button
                        key="left"
                        type="primary"
                        onClick={() => {
                            const imageElement: any = cropperRef?.current
                            const cropper: any = imageElement?.cropper
                            cropper.rotate(-90)
                        }}
                    >
                        左转
                    </Button>
                    <Button
                        key="right"
                        type="primary"
                        onClick={() => {
                            const imageElement: any = cropperRef?.current
                            const cropper: any = imageElement?.cropper
                            cropper.rotate(90)
                        }}
                    >
                        右转
                    </Button>
                </Space>
                <Button
                    key="back"
                    onClick={() => {
                        setEditImageModalVisible(false)
                    }}
                >
                    取消
                </Button>
                <Button
                    key="artwork"
                    type="primary"
                    loading={imgUpload}
                    onClick={() => {
                        fileRequest(srcCropper)
                    }}
                >
                    原图上传
                </Button>
                <Button
                    key="submit"
                    type="primary"
                    loading={imgUpload}
                    onClick={() => {
                        const imageElement: any = cropperRef?.current
                        const cropper: any = imageElement?.cropper
                        fileRequest(cropper.getCroppedCanvas().toDataURL())
                    }}
                >
                    确定
                </Button>
            </>
        )
    }
    const cropperModal = () => {
        return (
            <Modal
                title="图片编辑"
                forceRender
                maskClosable={false}
                visible={editImageModalVisible}
                onCancel={() => {
                    setEditImageModalVisible(false)
                }}
                onOk={() => {
                    const imageElement: any = cropperRef?.current
                    const cropper: any = imageElement?.cropper
                    fileRequest(cropper.getCroppedCanvas().toDataURL())
                }}
                footer={modalFooter()}
                confirmLoading={imgUpload}
            >
                <Cropper
                    src={srcCropper} //图片路径，即是base64的值，在Upload上传的时候获取到的
                    ref={cropperRef}
                    preview=".uploadCrop"
                    // viewMode={1} //定义cropper的视图模式
                    zoomable={true} //是否允许放大图像
                    movable={true}
                    guides={false} //显示在裁剪框上方的虚线
                    background={true} //是否显示背景的马赛克
                    rotatable={true} //是否旋转
                    cropBoxResizable={true}
                    cropBoxMovable={true}
                    dragMode="move"
                    center={true}
                    initialAspectRatio={initialAspectRatio}
                    style={{
                        height: 450,
                    }}
                />
            </Modal>
        )
    }

    /**
     * 图片渲染
     * @param originNode
     * @param file
     * @param currFileList
     */
    const handleItemRender = (originNode: any, file: any, currFileList: any) => {
        const { name, status, url } = file
        const index = currFileList.indexOf(file)
        return (
            <div className="ant-upload-list-picture-card-container" style={{ userSelect: 'none' }}>
                {status !== 'error' ? (
                    <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card">
                        <div className="ant-upload-list-item-info">
                            <span className="ant-upload-span" style={{ width: '100%', height: '100%', display: 'inline-block' }}>
                                <img src={url + '?h=86&w=86&ss=1'} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </span>
                        </div>
                        <span className="ant-upload-list-item-actions">
                            {isUpload && (
                                <Tooltip title="重新上传">
                                    <UploadOutlined className="anticon anticon-delete" onClick={() => handleUpload(index)} />
                                </Tooltip>
                            )}
                            {isPreview && (
                                <Tooltip title="预览">
                                    <EyeOutlined onClick={() => handlePreview(index)} />
                                </Tooltip>
                            )}
                            {isDelete && (
                                <Tooltip title="删除">
                                    <DeleteOutlined onClick={() => handleRemove(file)} />
                                </Tooltip>
                            )}
                            {currFileList.length > 1 && isSetCover && (
                                <span
                                    onClick={() => handleSetCover(index)}
                                    style={{
                                        color: '#ffffff',
                                        display: 'block',
                                        marginTop: '10px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    设为封面
                                </span>
                            )}
                        </span>
                    </div>
                ) : (
                    <div className="ant-upload-list-item ant-upload-list-item-error ant-upload-list-item-list-type-picture-card">
                        <div className="ant-upload-list-item-info">
                            <span className="ant-upload-span">
                                <div className="ant-upload-list-item-thumbnail ant-upload-list-item-file">
                                    <PictureOutlined />
                                </div>
                                <span className="ant-upload-list-item-name" title={name}>
                                    {name}
                                </span>
                            </span>
                        </div>
                        <span className="ant-upload-list-item-actions">
                            <UploadOutlined className="anticon anticon-delete" onClick={() => handleUpload(index)} />
                            <DeleteOutlined onClick={() => handleRemove(file)} />
                        </span>
                    </div>
                )}
            </div>
        )
    }
    /**
     * 上传文件改变时的状态
     */
    const handleChange = (file: any) => {
        let fileLength = file.fileList.length > 10 ? 10 : file.fileList.length
        setUploadIndex(-1)
        file.fileList.map((item) => {
            if (item.size && item.size / 1024 / 1024 > 5) {
                fileLength--
            }
        })
        setUploadImagesLength(fileLength)
        if (fileLength !== uploadImagesLength) {
            setUploadLoading(false)
        }
    }

    /**
     * 图片上传加载效果
     */
    const uploadImageLoading = () =>
        ReactDOM.createPortal(
            <div
                className="image-loading"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <Spin className="center-loading" tip="上传中..."/>
            </div>,
            document.body
        )

    /**
     * 全屏切换
     */
    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            const element = document.getElementById('PhotoView_Slider')
            if (element) {
                element.requestFullscreen()
            }
        }
    }

    const uploadButton = (
        // @ts-ignore
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
    )

    const uploadBox = () => {
        if (cut) {
            return (
                <Upload
                    accept=".jpg, .png, .jpeg, .bmp"
                    listType="picture-card"
                    className={`avatar-uploader ${size} ${num === 1 ? 'single' : ''}`}
                    // @ts-ignore
                    fileList={fileList}
                    itemRender={handleItemRender}
                    onChange={handleChange}
                    // customRequest={customRequest}
                    beforeUpload={cutHandleBeforeUpload as any}
                >
                    {fileList.length >= num ? null : uploadButton}
                </Upload>
            )
        } else {
            return (
                <>
                    <Upload
                        accept=".jpg, .png, .jpeg, .bmp"
                        listType="picture-card"
                        className={`avatar-uploader ${size} ${num === 1 ? 'single' : ''}`}
                        // @ts-ignore
                        fileList={fileList}
                        itemRender={handleItemRender}
                        onChange={handleChange}
                        customRequest={customRequest}
                        beforeUpload={handleBeforeUpload}
                        multiple={props.multiple}
                    >
                        {fileList.length >= num ? null : uploadButton}
                    </Upload>
                    {!uploadLoading && uploadImageLoading()}
                </>
            )
        }
    }

    return (
        <>
            {uploadBox()}
            <PhotoSlider
                images={fileList.map((item) => ({ src: item.url }))}
                maskClosable={false} //背景可点击关闭，默认 true
                visible={visible}
                toolbarRender={({ rotate, onRotate }) => {
                    return (
                        <>
                            <RotateRightOutlined
                                onClick={() => onRotate(rotate + 90)}
                                style={{
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    marginRight: '20px',
                                }}
                            />
                            {document.fullscreenEnabled && (
                                <FullscreenOutlined
                                    onClick={toggleFullScreen}
                                    style={{
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        marginRight: '20px',
                                    }}
                                />
                            )}
                        </>
                    )
                }}
                onClose={() => setVisible(false)}
                index={photoIndex}
                onIndexChange={(x: number) => setPhotoIndex(x)}
            />
            {cropperModal()}
            <input
                type="file"
                ref={uploadRef}
                accept=".jpg, .png, .jpeg, .bmp"
                id="again-upload"
                onChange={async (e) => {
                    if (cut) {
                        cutHandleBeforeUpload(e.target.files[0])
                    } else {
                        let res = await getBase64(e.target.files[0])
                        fileRequest(res)
                    }
                }}
                style={{ opacity: 0, width: 0, height: 0, display: 'inline-block' }}
            />
        </>
    )
}

PicturesWall.defaultProps = {
    size: '',
    num: 10, //默认上传数量
    cut: false,
    multiple: false,
    isReturnArray: true, //返回数组['123.png']
    isPreview: true, //是否可以预览
    isDelete: true, //是否可以删除
    isUpload: true, //是否可以重新上传
    isSetCover: true, //是否支持设为封面
    initialAspectRatio: 4 / 3,
}

export default PicturesWall
