// vode => dom
// render 接收vnode和传入的插入父节点 返回真实dom

// 实现fiber
// fiber tree数据结构是一种链表结构 除了常规的type props值。具体还有node(真实节点) child(第一个子元素) sibling(第一个子元素的下一个元素) base(上次的fiber节点 用于diff对比)
// 1. 定义一个nextUnitOfWork，表示下一个任务单元，改造render方法 render方法接收最外层vnode tree，需要创建一个根fiber，并将其写入下一个任务单元，开启执行
// 2. 使用调度栈方法requestIdleCallback，他可以自行分配任务时间，决定任务执行，我们只需把调度每个任务的方法或者diff传进去
// 3. 创建调度任务方法workLoop
// 4. workLoop写一个执行任务方法 performUnitOfWork 返回下一个任务nextUnitOfWork方便继续执行
// 5. performUnitOfWork 执行当前任务 根据type类型 执行不同的方法 目的是生成当前fiber的真实dom 并且向下构建子元素的fiber结构
// 6. 调用_createNode或者其它方式 生成当前fiber的真实dom 存在node属性中
// 7. 调用reconcilerChildren 生成子元素的fiber结构 这里主要循环遍历所有子元素 根据元素的是否是同一个元素 判断需要更新还是创建fiber 还是删除 打上相应tags 并形成fiber链表结构方便之后调用
// 8. performUnitOfWork 执行完当前任务 返回下一个任务 原则是先找子节点 如果没有去找兄弟节点 没有返回父节点在找兄弟节点 反复此步骤 直到所有节点均查找完毕 返回false
// 9. workLoop写一个任务结束后提交任务，执行渲染的方法commitRoot 目的是当所有单元任务均执行完毕之后 统一提交进行更新渲染 插入相应dom中完成更新
// 10. commitWorker方法用来提交单元任务 第一次接收根fiber
// 11. 先找到父节点 方便之后创建或更新使用，根据之前fiber中的tags 创建元素 或 更新元素 或 删除元素，实行完当前的元素操作 对他的child和sibling也进行commitWorker
// 12. 最后在fiber不存在时候表明所有元素均执行完毕 至此fiber diff 以及 渲染全部结束

// 写一个数据演示fiber结构
// {
//     type: 'element', fiber类型
//     node: null, 本fiber的真实DOM
//     base: null, 上一个fiber 用于diff
//     props: {}, vode收到的props
//     parent: null, 父节点
//     child: {}, 第一个子节点
//     sibling: {} 子节点的兄弟元素
//     effectTag: '' 节点的状态
// }

import { PLACEMENT, UPDATE, DELETIONS } from './component/CONSTS'

// 表示下一个单元任务
let nextUnitOfWork;
// 表示根fiber
let wipRoot;
// 表示当前的根节点
let currentRoot;
// 表示当前工作的fiber
let wipFiber;
// 当前hooks的深度
let hookIndex;
// 删除的数组
let deltions;

// 虚拟dom转化为真实dom
function render(vnode, container) {
    // 创建根fiber 根fiber是container 他的子元素是里面的vndoe
    wipRoot = {
        node: container,
        props: {children: [vnode]},
        base: currentRoot
    }
    // 赋值给下一个任务单元 以开启任务执行
    nextUnitOfWork = wipRoot;
}

// 创建节点
function _createNode(vnode) {
    const { type, props } = vnode;
    let node;
    // 如果vnode是文本节点
    if (type === 'Text') {
        node = document.createTextNode('');
    } else if (type) {
        // 如果是元素节点
        node = document.createElement(type);
    }

    // 将属性填充进节点中
    _updateNode(node, props);

    return node;
}

// 接收正在工作的fiber以及子节点数组 构建子节点fiber
function reconcilerChildren(workInProgressFiber, children) {
    // 上次的子fiber 用于判断是否是否是同一个fiber 来判断更新或者新增 主要用于diff base主要用来存储之前的fiber
    let oldChildFiber =  workInProgressFiber.base && workInProgressFiber.base.child;

    // 上一个fiber 主要用来形成链表sibing使用
    let prevFiber = null;

    // 循环children创建fiber
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        // 这里先不考虑key值 是否是相同的fiber
        let isSameType = oldChildFiber && child && oldChildFiber.type === child.type;

        // 构建fiber
        let newFiber;
        if (isSameType && child) {
            // 相同打上更新的tags
            newFiber = {
                type: oldChildFiber.type,
                props: oldChildFiber.props,
                node: oldChildFiber.node,
                base: oldChildFiber,
                parent: workInProgressFiber,
                effectTag: UPDATE
            }
        } else if (!isSameType && child) {
            // 创建新的fiber
            // 相同打上新增的tags
            newFiber = {
                type: child.type,
                props: child.props,
                node: null, // 新增的fiber没有真实dom
                base: null, // 新增的fiber没有上次fiber
                parent: workInProgressFiber,
                effectTag: PLACEMENT // tags为新增
            }
        } else if (!isSameType && oldChildFiber) {
            // 打上删除的tags
            oldChildFiber.effectTag = DELETIONS;
            // 把删除的节点push入deltions
            deltions.push(oldChildFiber);
        }

        if (oldChildFiber) {
            // 如果oldChildFiber存在，则把他赋值为他的兄弟元素 方便下次循环使用
            oldChildFiber = oldChildFiber.sibling;
        }

        // 生成链表结构
        if (i === 0) {
            // 第一次循环fiber-child就是第一个子元素
            workInProgressFiber.child = newFiber;
        } else {
            // 不是第一次循环则是他的兄弟元素
            prevFiber.sibling = newFiber;
        }
        // 把newFiber赋值给prevFiber这样和165行配合则可以生成链表 -> a1: { sibling: a2 : { sibling: a3 } }
        prevFiber = newFiber;
    }

    // 循环结束后 所有fiber树构建完成 是否是新增的数据也打上了标签
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

// 创建class节点
function _createComNode(fiber) {
    const { type, props } = fiber;
    let comp = new type(props);
    let children = [comp.render()];
    reconcilerChildren(fiber, children);
}

// 创建function节点
function _createFnNode(fiber) {
    // 如果当前运行的fiber是个funtion组件 需要给当前的fiber重置创建一个hooks属性 并要把hook下标重置
    wipFiber = fiber;
    wipFiber.hooks = [];
    hookIndex = 0;

    const { type, props } = fiber;
    let children = [type(props)];
    reconcilerChildren(fiber, children);
}

// 其他元素节点
function _createElement(fiber) {
    // 如果node不存在则创建一个node
    if (!fiber.node) {
        fiber.node = _createNode(fiber);
    }
    const { children } = fiber.props;
    reconcilerChildren(fiber, children);
}

// 创建子节点的fiber
function _createFragment(fiber) {
    const { children } = fiber.props;
    reconcilerChildren(fiber, children);
}

// 接收任务 并执行任务
function performUnitOfWork(fiber) {
    // 执行当前的任务
    const { type } = fiber;
    if (typeof type === 'function') {
        type.prototype.isReactComponent
            ? _createComNode(fiber)
            : _createFnNode(fiber);
    } else if (type) {
        // 如果是元素节点
        _createElement(fiber);
    } else {
        // 如果没有type 一般是根元素或者Fragment
        _createFragment(fiber)
    }

    // 执行完当前的任务 需要返回下一个任务
    // 如果child成功构建 说明有子元素，按照子元素优先的原则 先返回子元素
    if (fiber.child) {
        return fiber.child;
    }
    // 如果child不存在 则说明没有子元素，那就去查找兄弟元素
    let nextFiber = fiber;
    // 循环查找 如果兄弟元素存在 则返回兄弟元素 不存在则返回父元素继续查找兄弟元素 直到找到或者所有元素不存在为止
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }

    return null;
}

// 创建hooks
// 每个fiber上新增一个属性hooks数组，用来存放hooks，所有的hooks都在里面
export function useState(init) {
    // 如果存在一个旧的hook 则需要从当前工作的fiber中找出这个hook
    let oldHook = wipFiber.base && wipFiber.base.hooks[hookIndex];

    // 创建一个 hook 用来存放state以及每次更新的数组
    let hook = {
        state: oldHook ? oldHook.state : init, // 当前hook的state
        queue: [] // 当前hook更新的数组 即当前hook的执行数组 长度即执行了几次
    }

    // 找出hook中执行数组
    const actions = oldHook ? oldHook.queue : [];

    // 将最后一次执行的state 赋值给hook
    actions.forEach(action => {
        hook.state = action;
    });

    // 渲染setState
    let setState = action => {
        // 将action push进queue中 比如state + 1;
        hook.queue.push(action);

        // 创建wipRoot 将其加入调用栈 然后执行 即从当前节点开始执行
        wipRoot = {
            node: currentRoot.node,
            props: currentRoot.props,
            base: currentRoot
        }

        // 将下一个任务单元设置为当前赋值后的任务
        nextUnitOfWork = wipRoot;
    };

    // 将当前拼装好的hook push入当前工作fiber的hooks中 之后在调用useState的时候能够取到该hook
    wipFiber.hooks.push(hook);
    // 之后hookIndex +1
    hookIndex++;

    return [hook.state, setState];
}

function commitWorker(fiber) {
    // 如果fiber不存在则退出
    if (!fiber) {
        return;
    }

    // 找出父节点的fiber
    let parentNodeFiber = fiber.parent;
    // 如果父节点的node不存在 则向上找父元素
    while(!parentNodeFiber.node) {
        parentNodeFiber = parentNodeFiber.parent;
    }
    // 拿出真实父节点DOM
    const parentNode = parentNodeFiber.node;

    if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
        // 如果当前节点是一个新节点，则直接插入
        parentNode.appendChild(fiber.node);
    } else if (fiber.effectTag === UPDATE && fiber.node !== null) {
        // 如果当前节点是一个旧节点，则需要先进行一遍赋值
        _updateNode(fiber.node, fiber.props);
    } else if (fiber.effectTag === DELETIONS && fiber.node !== null) {
        // 删除节点 传入当前元素和父元素
        commitDeletions(fiber, parentNode);
    }

    // 当前节点执行完，需要继续执行他的子节点和子节点的兄弟节点
    commitWorker(fiber.child);
    commitWorker(fiber.sibling);

}

function commitDeletions(fiber, parentNode) {
    if (fiber.node) {
        // 如果这个fiber的node存在
        parentNode.removeChild(fiber.node);
    } else {
        // 因为父节点删除后下次再执行也要把子节点删除了
        commitDeletions(fiber.child, parentNode);
    }
}

function commitRoot() {
    // 提交fiber tree上所有的节点 从root开始
    commitWorker(wipRoot.child);
    // 记录当前工作的根节点
    currentRoot = wipRoot;
    // 清空wipRoot 防止反复调用
    wipRoot = null;
}


// 创建任务调度方法 调度diff或者是渲染任务 接收一个传入的deadline值 表示任务剩余时间
function workLoop(deadline) {
    // 循环调度执行所有任务 规则是有下一个任务并且循环时间尚未结束
    while(nextUnitOfWork && deadline.timeRemaining() > 1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    // 执行完所有的任务，需要统一提交，渲染并插入到真实的dom节点中
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
}

requestIdleCallback(workLoop);

export default {
    render
}