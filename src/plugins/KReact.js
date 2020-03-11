// jsx => vnode
// createElement 生成vnode
// vnode 是一个对象 包含 type，props，children等值。注意：传入children 每行babel都会调用createElement，从而实现递归

function createElement(type, props, ...children) {
    if (type) {
        delete props.__source;
        delete props.__self;
    }
    
    // 如果class组件有传入默认defaultProps
    let defaultProps = {};
    if (type && type.defaultProps) {
        defaultProps = { ...type.defaultProps };
    }

    return {
        type: type,
        props: {
            ...defaultProps,
            ...props,
            children: children.map(item => typeof item === 'object' ? item : _createTextNode(item))
        }
    }
}



// 因为文本节点只有内容，没有type和props等值，生成的vnode和其他树结构不符合，需要转换结构
function _createTextNode(item) {    
    return {
        type: 'Text',
        props: {
            nodeValue: item,
            children: []
        }
    }
}

export default {
    createElement
}