// vode => dom
// render 接收vnode和传入的插入父节点 返回真实dom

// 实现转化type类型，string， function， class， component， fragment
// 实现事件

// 虚拟dom转化为真实dom
function render(vnode, container) {
    // console.log(vnode);
    // vnodeTree => domTree
    const node = _createNode(vnode);

    container.appendChild(node);
}

// 创建class节点
function _createComNode({ type, props }) {
    let comp = new type(props);
    let vvnode = comp.render();
    let vnode = _createNode(vvnode);
    return vnode;
}

// 创建function节点
function _createFnNode({ type, props }) {
    let vvnode = type(props);
    let vnode = _createNode(vvnode);
    return vnode;
}

// 创建节点
function _createNode(vnode) {
    const { type, props } = vnode;
    let node;
    // 如果vnode是文本节点
    if (type === 'Text') {
        node = document.createTextNode('');
    } else if (typeof type === 'function') {
        // 如果是class组件节点
        if (type.prototype.isReactComponent) {
           node =  _createComNode(vnode);
        } else {
            // 如果是function组件节点
            node = _createFnNode(vnode);
        }
    } else if (type) {
        // 如果是元素节点
        node = document.createElement(type);
    } else {
        // 如果type是一个fragment
        // document。createDocumentFragment 将文档碎片插入到父元素
        node = document.createDocumentFragment();
    }

    // 将属性填充进节点中
    if (type) {
        _updateNode(node, props);
    }
    
    //由于存在children，所以需要递归
    _createChildrenNode(props.children, node);

    return node;
}

// 接收子节点vnode数组以及父节点dom
function _createChildrenNode(children, parent) {
    for(let i = 0; i < children.length; i++) {
        let _child = children[i];
        if (Array.isArray(_child)) {
            for (let j = 0; j < _child.length; j++) {
                render(_child[j], parent)
            }
        } else {
            render(children[i], parent);
        }
    }
}

// 接收dom以及props，进行赋值
function _updateNode(node, values) {
    Object.keys(values)
        .filter(item => item !== 'children')
        .forEach(key => {
            if (key.slice(0, 2) === 'on') {
                let _typeName = key.slice(2).toLocaleLowerCase();
                document.addEventListener(_typeName, values[key]);
            } else {
                node[key] = values[key];
            }
        })
}

export default {
    render
}