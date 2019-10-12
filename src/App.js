import React from 'react';
import HTML from 'html-parse-stringify';
import {
  Form,
  Tree,
  Button,
  Input,
  Icon,
  Select
} from "antd";
import {
  partial
} from 'lodash'
import "antd/es/tree/style/css"
import 'antd/dist/antd.css';
import './App.css';
const { DirectoryTree, TreeNode } = Tree;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
class App extends React.Component {
  state = {
    domTree: [],
    buryPointData: {}
  }
  editUrl = 'http://easinote-dev.test.seewo.com/mobile/'
  componentDidMount() {
    window.addEventListener('message', (event) => {
      if (!this.editUrl.includes(event.origin)) { return }
      if (event.data.includes('selectId&&')) {
        const xpathData = event.data.replace('selectId&&', '').split('&&')
        this.submitReportData(xpathData[0], xpathData[1])
        return
      }
      const domTree = HTML.parse(event.data)
      this.setState({ domTree })
    }, false)
  }

  onSelect = (keys) => {
    let id = keys[0]
    document.getElementById("iframe").contentWindow.postMessage(id, this.editUrl)
    this.setState({ buryPointData: {} })
  }

  renderTreeNode = (data, parentId) => {
    return data.map((item, index) => {
      const selfId = index !== 0 ? `${item.name}:nth-child(${index + 1})` : `${item.name}`
      if (item.children) {
        return <TreeNode title='container' key={`${parentId}>${selfId}`}>
          {this.renderTreeNode(item.children, `${parentId}>${selfId}`)}
        </TreeNode>
      }
      return <TreeNode title={item.type} key={`${parentId}/textNode`} isLeaf ></TreeNode>
    })
  }

  submit = (event) => {
    document.getElementById("iframe").contentWindow.postMessage('getSelectXpath', this.editUrl)
  }

  submitReportData = (xpathId, text) => {
    const { buryPointData } = this.state
    const param = {
      ...buryPointData,
      xpathId,
      text
    }
    console.log(param)
  }

  onChange = (name, e) => {
    const { buryPointData } = this.state
    let value = e
    if(name === 'name') {
      value = e.target.value
    }
    buryPointData[name] = value
    this.setState({
      buryPointData
    }) 
  }
  render() {
    return (
      <div className="App">
        <div className="dom-tree">
          <div className="tree-node">
            <DirectoryTree
              onSelect={this.onSelect}>
              {this.state.domTree
                && this.state.domTree.length
                && this.renderTreeNode(this.state.domTree, '#root')}
            </DirectoryTree>
          </div>
          <div className="iframe">
            <iframe id="iframe" title="edit-container" src={this.editUrl}></iframe>
          </div>
        </div>
        <div className="edit-form">
          <Form {...formItemLayout} onSubmit={this.submit}>
          <Form.Item label="埋点名称">
                <Input onChange={partial(this.onChange, 'name')}></Input>
            </Form.Item>
            <Form.Item label="埋点事件">
              <Select
                onChange={partial(this.onChange, 'event')}
              >
                {['click', 'exporse'].map(item => {
                  return <Option key={item} value={item}>{item}</Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="primary" onClick={this.submit}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedAppFieldSet = Form.create({ name: 'App_form_item' })(App);

export default WrappedAppFieldSet;
