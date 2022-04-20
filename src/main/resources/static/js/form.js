class Middle {

    itemO = {'class': 'o-item'}
    itemD = {'class': 'd-item'}
    table
    addDButton
    addOButton
    delDButton
    delOButton
    lastD = 0
    lastO = 0
    popyt
    podaż

    init() {
        this.table = document.querySelector('table')
        this.addDButton = document.getElementById('addD')
        this.addOButton = document.getElementById('addO')
        this.delDButton = document.getElementById('delD')
        this.delOButton = document.getElementById('delO')

        document.querySelectorAll('th[data-d-id]').forEach(item => {
            if (Number(item.dataset.dId) > this.lastD) {
                this.lastD = Number(item.dataset.dId)
            }
        })

        document.querySelectorAll('th[data-o-id]').forEach(item => {
            if (Number(item.dataset.oId) > this.lastO) {
                this.lastO = Number(item.dataset.oId)
            }
        })

        this.bindEvents()
    }


    bindEvents() {
        this.addDButton.addEventListener('click', () => {
            this.addD()
        })

        this.delDButton.addEventListener('click', () => {
            this.removeDRow()
        })

        this.addOButton.addEventListener('click', () => {
            this.addO()
        })

        this.delOButton.addEventListener('click', () => {
            this.removeOCol()
        })
    }

    addD() {
        const thead = this.table.querySelector('thead tr')
        const elems = thead.childElementCount - 1 - 2
        const tr = this.createDRow(elems)

        let tbody = this.table.querySelector('tbody')


        const cena = tbody.children[tbody.children.length - 1]
        const popyt = tbody.children[tbody.children.length - 2]
        const df = tbody.children[tbody.children.length - 3]
        tbody.removeChild(cena)
        tbody.removeChild(popyt)
        tbody.removeChild(df)

        tbody.append(tr, df, popyt, cena)
    }

    createTitleD(elem) {
        const id = this.lastD + 1;
        const span = document.createElement('span')
        span.innerHTML = `D<sub>${id}</sub>`
        elem.append(span)

        this.lastD++
    }

    createTitleO(elem) {
        const id = this.lastO + 1;
        const span = document.createElement('span')
        span.innerHTML = `O<sub>${id}</sub>`
        elem.append(span)
        elem.id = `O${id}`
        this.lastO++
    }

    createDRow(elems) {
        const tr = document.createElement('tr')
        const th = document.createElement('th')
        this.createTitleD(th)
        tr.append(th)
        tr.id = `D${this.lastD}`

        for (let i = 0; i < elems; i ++) {
            const td = document.createElement('td')
            td.setAttribute('contenteditable', (i !== elems - 1).toString())

            if(i === elems - 1) {
                td.classList.add('text-secondary')
            }
            td.innerText = "0";

            tr.append(td)
        }

        const pod = document.createElement('td')
        const koszt = document.createElement('td')

        pod.innerText = "0"
        koszt.innerText = "0"

        pod.setAttribute('contenteditable', "true")
        koszt.setAttribute('contenteditable', "true")

        tr.append(pod, koszt)

        return tr
    }

    removeDRow() {
        const elem = document.getElementById(`D${this.lastD}`)
        if (!elem) {
            return
        }

        elem.remove()

        this.lastD--;
    }

    removeOCol() {
        const elem = document.getElementById(`O${this.lastO}`)

        if (!elem) {
            return
        }
        const thead = document.querySelector('thead tr')
        const tbody = document.querySelector('tbody')
        const index = Array.prototype.indexOf.call(thead.children, elem)

        Array.from(tbody.children).forEach(item => {
            item.children.item(index).remove()
        })

        elem.remove()


        this.lastO--;
    }

    addO() {
        const thead = this.table.querySelector('thead tr')
        const tbody = this.table.querySelector('tbody')

        const ohIndex = this.createOh(thead)
        this.addTdInRow(ohIndex, tbody)
    }

    createOh(thead) {
        const th = document.createElement('th')
        this.createTitleO(th)

        const koszt = thead.children[thead.children.length - 1]
        const pod = thead.children[thead.children.length - 2]
        const of = thead.children[thead.children.length - 3]

        thead.removeChild(koszt)
        thead.removeChild(pod)
        thead.removeChild(of)

        thead.append(th, of, pod, koszt)

        return Array.prototype.indexOf.call(thead.children, th)
    }

    addTdInRow(ohIndex, tbody) {
        const count = tbody.children.length - 3
        Array.from(tbody.children).forEach((item, i) => {
            const td = document.createElement('td')
            td.setAttribute('contenteditable', (i !== count).toString())
            td.innerHTML = '0'

            if(i === count) {
                td.classList.add('text-secondary')
            }
            const k = item.children[item.children.length - 1]
            const p = item.children[item.children.length - 2]
            const o = item.children[item.children.length - 3]

            item.removeChild(k)
            item.removeChild(p)
            item.removeChild(o)

            item.append(td, o, p, k)
        })

    }
}

const middle = new Middle()
document.addEventListener('DOMContentLoaded', () => {
    middle.init()
}, false)

