import React, {useEffect, useState} from "react";
import {Button, Select, Form, message} from "antd";
import AdvancedModal from "@/components/AdvancedModal";
import {HWSignature} from "@/components";
import {connect} from "dva";
import {getDict} from "@/utils/publicFunc";

const Modal = ({dispatch, eSginUserListList, visible, id}) => {
  const [form] = Form.useForm();
  const [signPic, setSignPic] = useState<any>()
  const [signId, setSignId] = useState('')
  const [defaultImg, setDefaultImg] = useState('')

  useEffect(() => {
    if (id) {
      getDetail()
    }
    return () => {
      dispatch({
        type: 'electronicSignature/save',
        payload: {
          visible: false,
          id: '',
        }
      })
    }
  }, [])

  const getDetail = async () => {
    dispatch({
      type: 'electronicSignature/loadDetailESign',
      payload: {
        id
      }
    }).then(res => {
      if (res) {
        setSignId(res.id)
        setDefaultImg(res.picUrl)
        setSignPic(res.picUrl)
        form.setFieldsValue({
          userId: {value: res.userId, label: res.userName},
        })
      }
    })
  }

  // 获取签字的 url
  const getSignedUrl = (signPhoto) => {
    setSignPic(signPhoto)
  }

  const closeModal = () => {
    dispatch({
      type: "electronicSignature/save",
      payload: {
        visible: false
      }
    })
  }

  const onSubmit = () => {
    if (!signPic) {
      message.error('请先签字')
      return
    }
    form.validateFields().then(values => {
      const payload = signId
        ? {id: signId, picUrl: signPic}
        : {userId: values?.userId?.value, picUrl: signPic}
      try {
        dispatch({
          type: "electronicSignature/addOrUpdateESign",
          payload
        })
      } catch (err) {

      }
    })
    closeModal()
  }

  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  const handleChiefSearch = async (val) => {
    console.log(val)
  }

  const footer = <Button onClick={closeModal}>上传电子签名(签章)</Button>

  return (
    <AdvancedModal title="新增签名" visible={visible}
                   closeModal={closeModal}
                   showOnSave={false}
                   onSubmit={onSubmit}>
      <Form form={form}>
        <AdvancedModal.Item title="关联账号">
          <Form.Item name="userId" rules={[{required: true, message: "请选择账号"}]}>
            <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入关联账号"
              filterOption={handleFilterOption}
            >
              {eSginUserListList?.map(({value, label, id}) => {
                console.log(value, label)
                return <Select.Option value={value} key={id}>{label}</Select.Option>
              })}
            </Select>
          </Form.Item>
        </AdvancedModal.Item>
        <AdvancedModal.Item title="电子签名">
          <HWSignature
            defaultImg={defaultImg}
            getSignedUrl={getSignedUrl}
          />
        </AdvancedModal.Item>
      </Form>
    </AdvancedModal>
  )
}

export default connect(({electronicSignature, global}) => ({
  visible: electronicSignature.visible,
  id: electronicSignature.id,
  eSginUserListList: global.eSginUserListList
}))(Modal)
