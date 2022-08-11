import React, { Fragment, isValidElement, forwardRef, FC } from "react"
import { Form, Row, Col, Button, Space } from "antd"
import "./style.less"

const FormItem = Form.Item
/**
 * 搜索表单布局
 * @type {Object}
 */
const SEARCH_FORM_TITLE_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}
/**
 * 搜索表单布局
 * @type {Object}
 */
const SEARCH_FORM_LAYOUT = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
}

interface SearchProps {
  form: any
  col?: number // 列宽 max：24
  components: Array<object> // 搜索项列表
  actions?: object // 按钮节点
  defaultExtend?: boolean // 默认展开|闭合
  size?: string // 如果表单内的所有表单组件均添加了size='small'属性，则加上该属性可改变行间距
  extend?: boolean // 展开|闭合状态
  onExtend?: Function // 切换展开事件回掉
  bottom?: number // formItem 的 marginBottom 数量
  beforeSearch?: (arg0?: object) => void
  handleSearch: (arg0?: object) => void
  onFieldsChange?: (arg0?: unknown, arg1?: any) => void
}

const defaultExtend: FC<SearchProps> = forwardRef(
  (props: SearchProps, ref: RefType) => {
    const { form, col, bottom, handleSearch, onFieldsChange, size, actions, onExtend } = props
    const renderSearchItem = (item, hide) => {
      const { col: itemCol, render } = item
      if (render) {
        return render()
      } else {
        let formLayout = SEARCH_FORM_LAYOUT,
          className = ""
        if (item.label) {
          formLayout = SEARCH_FORM_TITLE_LAYOUT
          className = "has-title"
        }
        return <Col key={item.key} span={itemCol || col}>
          <FormItem
            {...formLayout}
            style={{ marginBottom: bottom }}
            name={item.key} /** 添加 name */
            label={item.label}
            className={hide ? `${className} hide-item` : className}
          >
            {
              item.component
            }
          </FormItem>
        </Col>
      }
    }

    const getExtendProp = () => {
      return "extend"
      // return 'extend' in props ? props.extend : state.extend;
    }

    /**
     * 根据展开状态获取名称
     */
    const getExtend = (extend) => {
      if (extend) {
        return {
          name: "收起",
          type: "up"
        }
      } else {
        return {
          name: "展开",
          type: "down"
        }
      }
    }

    /**
     * 获取 按钮 节点
     * @param showExtend => 是否需要展开/收起
     * @param colSpan => action 的 col 所占的 span 数
     * @param className => action 的 FormItem 的类名
     * @return {*}
     */
    const getActionsNode = (showExtend, colSpan, className) => {
      const extend = getExtendProp()
      const { name } = getExtend(extend)
      const actionNode = isValidElement(actions) || Array.isArray(actions) ? actions : actions["component"]
      let align = "right"
      if ("align" in actions) {
        align = actions["align"]
      } else if (!showExtend && colSpan < 24) {
        align = "left"
      }
      return (
        <Col
          span={actions["col"] || (24 - colSpan) || 24}
          style={{ textAlign: "right" }}
        >
          <FormItem
            className={className}
            style={{
              marginBottom: bottom
            }}
          >
            {
              showExtend && <span>
                <a
                  className='more'
                  onClick={() => {
                    // setState({
                    //     extend: !extend
                    // });
                    onExtend && onExtend(!extend)
                  }}
                ></a>
              </span>
            }
            <Space><Button htmlType="submit" type="primary">查询</Button>{actionNode}</Space>
          </FormItem>
        </Col>
      )
    }

    // const getFormWapper = () => {
    //     const result = findFormNode(ref);
    //     return result ? Fragment : Form;
    // }

    const renderSearchForm = () => {
      const { components, col } = props
      let splitIndex = [], // 存放 span 数大于 24 后的第一个 formItem 的 index 索引
        colSpan = 0
      components.forEach((item, index) => {
        // 累加 span 数
        colSpan += (item["col"] || col)
        // 记录 span 数大于 24 后的第一个 item 的 index
        if (colSpan > 24) {
          splitIndex.push(index)
          colSpan = (item["col"] || col)
        }
      })
      let showExtend = splitIndex.length > 0, // 是否需要收起/展开
        fillGroup,
        lastGroup

      if (showExtend) {
        fillGroup = components.slice(0, splitIndex[splitIndex.length - 1])
        lastGroup = components.slice(splitIndex[splitIndex.length - 1])
      } else {
        fillGroup = []
        lastGroup = components
      }

      const extend = getExtendProp()
      const hidden = showExtend && !extend
      const actionClassName = !extend && splitIndex.length > 0 ? "extend-more" : ""
      // const actionSpan = 24 - Math.ceil((24 / col) * lastGroup.length);
      let curSpan = 0
      return (
        <Fragment>
          {
            fillGroup.length > 0 && <Row gutter={4}>
              {
                fillGroup.map((item) => {
                  // 第一行不隐藏
                  if (curSpan < 24) {
                    curSpan += (item.col || col)
                    return renderSearchItem(item, false)
                  } else {
                    return renderSearchItem(item, hidden)
                  }
                })
              }
            </Row>
          }
          <Row gutter={4}>
            {
              lastGroup.map((item) => renderSearchItem(item, hidden))
            }
            {
              getActionsNode(showExtend, colSpan, actionClassName)
            }
          </Row>
        </Fragment>
      )
    }

    const emitSearch = (values: object): void => {
      handleSearch(values)
      // beforeSearch(values)用于处理一些特殊情况
    }
    return (
      <div
        ref={(ref) => {
          ref = ref
        }}
        className={`ks-search-form ${size === "small" ? " ks-search-form-sm" : ""}`}
      >
        <Form
          autoComplete="off"
          colon={false}
          form={form}
          //  initialValues={initialValues}
          onFieldsChange={onFieldsChange}
          onFinish={emitSearch}
        >
          {renderSearchForm()}
        </Form>
      </div>
    )
  }
)
defaultExtend.defaultProps = {
  col: 4,
  defaultExtend: true,
  bottom: 6,
  components: []
}
export default defaultExtend
