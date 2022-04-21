class Middle {

    itemO = {'class': 'o-item'}
    itemD = {'class': 'd-item'}
    table
    addDButton
    addOButton
    delDButton
    delOButton
    policz
    lastD = 0
    lastO = 0
    podTd
    popTd
    podF
    popF
    popyt = 0
    podaz = 0
    error

    init() {
        this.table = document.querySelector('table')
        this.addDButton = document.getElementById('addD')
        this.addOButton = document.getElementById('addO')
        this.delDButton = document.getElementById('delD')
        this.delOButton = document.getElementById('delO')
        this.error = document.getElementById('error')

        this.policz = document.getElementById('policz')

        this.podF = document.getElementById('f-pod')
        this.popF = document.getElementById('f-pop')

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

        this.updatePopEvent()
        this.updatePodEvent()
        this.bindEvents()
    }


    bindEvents() {
        this.addDButton.addEventListener('click', () => {
            this.addD()
        }, false)

        this.delDButton.addEventListener('click', () => {
            this.removeDRow()
        }, false)

        this.addOButton.addEventListener('click', () => {
            this.addO()
        }, false)

        this.delOButton.addEventListener('click', () => {
            this.removeOCol()
        }, false)

        this.policz.addEventListener('click', async () => {
            await this.sendData()
        }, false)
    }

    updatePodEvent() {
        this.podTd = document.querySelectorAll('.podaz')

        this.podTd.forEach((item) => {
            item.addEventListener('input', () => {
                this.podaz = 0

                this.podTd.forEach(item => {
                    this.podaz += Number(item.innerText)
                })

                this.updateF()
            }, false)
        })

    }

    updatePopEvent() {
        this.popTd = document.querySelectorAll('.popyt')

        this.popTd.forEach((item) => {
            item.addEventListener('input', () => {
                this.popyt = 0

                this.popTd.forEach(item => {
                    this.popyt += Number(item.innerText)
                })

                this.updateF()
            }, false)
        })
    }


    updateF() {
        if (this.popyt !== this.podaz) {
            document.getElementById('f-pop').innerText = this.podaz.toString()
            document.getElementById('f-pod').innerText = this.popyt.toString()
        }

        if (this.popyt === this.podaz) {
            document.getElementById('f-pop').innerText = "0"
            document.getElementById('f-pod').innerText = "0"
        }
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

        this.updatePopEvent()
        this.updatePodEvent()
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
        pod.classList.add('podaz')
        pod.dataset.for = `D${this.lastD}`
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

        this.updatePopEvent()
        this.updatePodEvent()
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
            if(i === count + 1) {
                td.classList.add('popyt')
                td.dataset.for = `O${this.lastO}`
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

    async sendData() {
        const json = this.createData()

        let response

        try {
            response = await fetch('/calculate', {
                body: JSON.stringify(json),
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch((error) => {
                this.error.classList.add('show')
            })
        } catch (e) {
            this.error.classList.add('show')
        }

        if(!response.ok) {
            this.error.classList.add('show')
            return
        }

        this.error.classList.remove('show')
        const body = await response.json()

        console.log(body)
    }

    createData() {
        let json = {'unitPrice': [], 'demand': [], 'supply': [], 'cost': [], 'price': []}

        const tbody = this.table.querySelector('tbody')
        const thead = this.table.querySelector('thead')

        let cena = Array.from(tbody.children[tbody.children.length - 1].children)
        let pop = Array.from(tbody.children[tbody.children.length - 2].children)
        let unit = Array.from(tbody.children)
        let supply = Array.from(tbody.children)
        let cost = Array.from(tbody.children)

        pop.shift()
        cena.shift()

        unit.pop()
        unit.pop()

        supply.pop()
        supply.pop()

        cost.pop()
        cost.pop()

        pop = pop.filter( item => item.innerText !== "").map(item => Number(item.innerText))
        cena = cena.filter( item => item.innerText !== "").map(item => Number(item.innerText))
        unit = unit
            .map( item => Array.from(item.children))
            .map(item => {
                item.shift()
                item.pop()
                item.pop()

                return item
            }).map( item => item.map( i => Number(i.innerText)))

        supply = supply
            .map( item => item.children[item.children.length - 2])
            .map( item => Number(item.innerText))

        cost = cost
            .map( item => item.children[item.children.length - 1])
            .map( item => Number(item.innerText))

        json.supply = supply
        json.cost = cost
        json.unitPrice = unit
        json.demand = pop
        json.price = cena

        return json
    }
}

const middle = new Middle()
document.addEventListener('DOMContentLoaded', () => {
    middle.init()
}, false)

