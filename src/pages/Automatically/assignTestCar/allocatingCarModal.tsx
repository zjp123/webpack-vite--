import React, {useEffect, useState} from "react";
import {connect} from 'dva';
import {Button, Tag, Select, Radio, message} from "antd";
import AdvancedModal from "@/components/AdvancedModal/index.ts";

const AllocatingCarModal = ({dispatch, planList, carList, safeList, saveList, visible, closeModal, title}) => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [currentSelected, setCurrentSelected] = useState({car: null, safe: null})
  const [showList, setShowList] = useState([])
  const [planValue, setPlanValue] = useState(null)
  const [carValue, setCarValue] = useState(null)
  const [safeValue, setSafeValue] = useState(null)
  const [isShowMyModal, setIsShowMyModal] = useState(false)
  const [isNew, setIsNew] = useState(true)
  // 重置数据
  const cleanup = () => {
    setSelectedPlan(null)
    setCurrentSelected({car: null, safe: null})
    setShowList([])
    setPlanValue(null)
    setCarValue(null)
    setSafeValue(null)
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        planList: [],
        carList: [],
        safeList: [],
        saveList: []
      }
    })
  }

  // 初始化数据
  useEffect(() => {
    if (visible) {
      getPlanList()
      getSaveList()
    } else {
      cleanup()
    }
    return () => {
      cleanup()
    }
  }, [visible])

  // 判断是否有草稿，如果有的话弹出modal框
  useEffect(() => {
    if (saveList && saveList.length > 0) {
      setIsShowMyModal(true)
    }
  }, [saveList])

  // 加载计划列表
  useEffect(() => {
    if (selectedPlan) {
      const {examSiteCode, examSiteId, preasignId} = selectedPlan
      dispatch({
        type: 'assignTestCar/loadCarList',
        payload: {examSiteCode, examPlanId: preasignId}
      })
      dispatch({
        type: 'assignTestCar/loadSafeList',
        payload: {examSiteId,  examPlanId: preasignId}
      })
    }
  }, [selectedPlan])

  // 监听当前选中的车辆和安全员信息
  useEffect(() => {
    // 如果当前选中的信息里有车辆信息，或有安全员信息
    const boolean = Boolean(currentSelected.safe || currentSelected.car)
    // 设置提交表单的数据结构
    const data = {
      examSiteId: boolean ? selectedPlan.examSiteId : '',
      preasignId: boolean ? selectedPlan.preasignId : '',
      userId: currentSelected.safe ? currentSelected.safe.id : '',
      safetyOfficerName: currentSelected.safe ? currentSelected.safe.safetyOfficerName : '',
      examSite: boolean ? selectedPlan.examSite : '',
      assignSite: currentSelected.car ? currentSelected.car.assignSite : '',
      assignCarId: currentSelected.car ? currentSelected.car.assignCarId : ''
    }
    // 如果有车辆信息，并且有安全员信息，则保存至已选中列表中，并且清空当前选中的车辆和安全员信息
    if (currentSelected.car && currentSelected.safe) {
      setShowList(prevState => {
        prevState[prevState.length - 1] = data
        return [...prevState]
      })
      setCurrentSelected({car: null, safe: null})
      setSafeValue(null)
      setCarValue(null)
      setIsNew(true)
    } else {
      // 如果没有同时选择车辆和安全员
      setShowList(prevState => {
        if (data.assignCarId || data.userId) {
          if (isNew) {
            prevState = [...prevState, {}]
            setIsNew(false)
          }
          // 更新最后一个对象
          prevState[prevState.length - 1] = data
          prevState = [...prevState]
        }
        return prevState
      })
    }
  }, [currentSelected])

  // 删除已选中的计划，并清空当前选中的车辆和安全员信息
  const delPostItem = (index) => {
    setSafeValue(null)
    setCarValue(null)
    setShowList(prevState => [...prevState.filter((item, i) => i !== index)])
  }

  // 获取草稿列表
  const getSaveList = () => {
    dispatch({
      type: 'assignTestCar/loadSafManualAssignmentDraft'
    })
  }

  // 获取计划列表
  const getPlanList = () => {
    dispatch({
      type: 'assignTestCar/loadPlanList'
    })
  }

  // 选择计划
  const handleChange = (value) => {
    setPlanValue(value)
    const temp = planList?.find(item => item.preasignId === value)
    setSelectedPlan(temp)
    // 切换计划时清空当前选中的车辆和安全员和已选中列表
    setShowList([])
    setCarValue(null)
    setSafeValue(null)
    dispatch({
      type: 'assignTestCar/save',
      payload: {
        carList: [],
        safeList: [],
      }
    })
  }

  // 选择车辆
  const onChangeCar = e => {
    setCarValue(e.target.value)
    const temp = carList.find(item => item.assignCarId === e.target.value)
    setCurrentSelected({...currentSelected, car: temp})
  };

  // 选择安全员
  const onChangeSafe = e => {
    setSafeValue(e.target.value)
    const temp = safeList.find(item => item.id === e.target.value)
    setCurrentSelected({...currentSelected, safe: temp})
  };

  const onCancel = () => {
    setIsShowMyModal(false)
    dispatch({
      type: 'assignTestCar/toClearSafManualAssignmentDraft'
    })
  }

  // 弹出的modal框
  const MyModal = ({show}) => {
    const loadSaveList = () => {
      const {preasignId: value, examSite} = saveList[0]
      handleChange(value)
      setPlanValue(examSite)
      setShowList([...saveList])
      setIsShowMyModal(false)
    }
    return (
      show && <div className='my-modal'>
        <p>您有一份之前保存的草稿是否加载?</p>
        <div className='my-modal-footer'>
          <Button style={{marginRight: '10px'}} onClick={onCancel}>取消</Button>
          <Button type='primary' onClick={loadSaveList}>加载</Button>
        </div>
      </div>
    )
  }

  // 提交表单
  const onSubmit = async (type) => {
    const flag = showList.find(item => !item.userId || !item.safetyOfficerName)
    if(flag) {
      message.error(`请选择安全员!`)
    } else {
      if(showList.length <=0) {
        message.error(`分车信息不能为空!`)
      } else {
        const res = await dispatch({
          type: 'assignTestCar/saveSafManualAssignment',
          payload: showList.map(item => {
            item.tempStorage = type
            return item
          })
        })
        if (res) {
          closeModal()
          cleanup()
        }
      }
    }
  }

  return (
    <AdvancedModal title={title} visible={visible} closeModal={closeModal} onSave={() => onSubmit(0)}
                   onSubmit={() => onSubmit(1)}>
      {isShowMyModal && <MyModal show={isShowMyModal}/>}
      <AdvancedModal.Item title='请选择考试计划'>
        <Select placeholder="选择考试计划" onChange={handleChange} value={planValue}>
          {planList && planList.map(({examTitle, preasignId}, index) => {
            return (
              <Select.Option value={preasignId} key={index}>
                {examTitle}
              </Select.Option>
            )
          })}
        </Select>
      </AdvancedModal.Item>
      <AdvancedModal.Item title='请选择安全员'>
        <Radio.Group onChange={onChangeSafe} value={safeValue}>
          {safeList && safeList.map(({id, safetyOfficerName}, index) => {
            return (
              <Radio value={id} key={id} disabled={showList.find(item => item.userId === id)}>
                {safetyOfficerName}
              </Radio>
            )
          })}
        </Radio.Group>
      </AdvancedModal.Item>
      <AdvancedModal.Item title='请选择考试车'>
        <Radio.Group onChange={onChangeCar} value={carValue}>
          {carList && carList.map(({assignCarId, assignSite}, index) => {
            return (
              <Radio value={assignCarId} key={index} disabled={showList.find(item => item.assignCarId === assignCarId)}>
                {assignSite}
              </Radio>
            )
          })}
        </Radio.Group>
      </AdvancedModal.Item>
      <AdvancedModal.Item title={<>已选择 <span style={{color: 'red'}}>{showList.length}</span> 条分车信息</>}>
        {
          showList.map((item, index) => {
            return item.examSiteId &&
              <Tag className='my-tag' key={index} onClose={(e) => {
                e.preventDefault()
                delPostItem(index)
              }} closable>{
                item.userId &&
                <span className='start'>
                            安全员: {item.safetyOfficerName}
                  ({item.userId})
                              <span className='icon-start'/>
                          </span>
              }{
                item.assignCarId &&
                <span className='end'>
                            考试车:
                              <span className='icon-end'/>
                  {item.assignSite}
                          </span>}
              </Tag>
          })
        }
      </AdvancedModal.Item>
    </AdvancedModal>
  )
}

export default connect(({assignTestCar}) => ({
  planList: assignTestCar.planList,
  carList: assignTestCar.carList,
  safeList: assignTestCar.safeList,
  saveList: assignTestCar.saveList
}))(AllocatingCarModal);
