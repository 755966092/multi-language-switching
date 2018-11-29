/**
 * @param el 元素选择器 
 * @param data 语言文件 object
 *
 * @class Language
 */
class Language {
    /**
     *Creates an instance of Language.
     * @param {String} el 元素选择器
     * @param {Object} data 语言文件对象
     * @memberof Language
     */
    constructor(el, data) {
        this.el = typeof el === "string" ? document.querySelector(el) : el
        this.data = data
        
        // 编译语言
        if (this.el) {
            //1. 把el中所有的子节点都放入到内存中， fragment
            let fragment = this.node2fragment(this.el)
            //2. 在内存中编译fragment
            this.compile(fragment)
            //3. 把fragment一次性的添加到页面
            this.el.appendChild(fragment)
        }
    }

    node2fragment(node) {
        let fragment = document.createDocumentFragment()
        // 把el中所有的子节点挨个添加到文档碎片中
        let childNodes = node.childNodes
        this.toArray(childNodes).forEach(node => {
            // 把所有的子节点都添加到frament中
            fragment.appendChild(node)
        })
        return fragment
    }
    // 解析
    compile(fragment) {
        let childNodes = fragment.childNodes

        this.toArray(childNodes).forEach(node => {

            // 编译标签节点
            if (this.isElementNode(node)) {
                // 如果是元素， 需要解析指令
                this.compileElement(node)
            }

            // 编译文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            }

            // 如果当前节点还有子节点，需要递归的解析
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }
    // 解析文本标签
    compileText(node) {
        let txt = node.textContent
        let reg = /\{\{(.+)\}\}/
        if (reg.test(txt)) {
            let expr = RegExp.$1
            
            node.textContent = txt.replace(reg, this.getDataValue(this.data, expr))
        }
    }
    // 解析指令标签
    compileElement(node) {
        let attributes = node.attributes
        let data = this.data
        this.toArray(attributes).forEach(attr => {

            // 解析lang的指令
            let attrName = attr.name
            if (attrName === 'lang') {
                let attrValue = attr.value
                node.textContent = this.getDataValue(data, attrValue)
            }
            // 解析lang-xxx的指令
            if (this.isDirective(attrName)) {
                attrName = attrName.slice(5)
                let attrValue = attr.value
                node[attrName] = this.getDataValue(data, attrValue)
            }
        })
    }

    /* 工具方法 */
    toArray(likeArray) {
        return [].slice.call(likeArray)
    }
    isElementNode(node) {
        //nodeType: 节点的类型  1：元素节点  3：文本节点
        return node.nodeType === 1
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isDirective(attrName) {
        return attrName.startsWith("lang-")
    }
    getDataValue(data, expr) {
        // 获取到data中的数据, 防止语言文件 有多级对象
        let val = data
        expr.split(".").forEach(key => {
            val = val[key]
        })
        return val
    }
}