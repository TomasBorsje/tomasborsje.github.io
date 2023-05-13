const ratioSlider = document.getElementById('ratioSlider');
const hideEnchantCheckbox = document.getElementById('hideEnchants')
const outputDisplay = document.getElementById('outputDisplay')
const loadingMessage = document.getElementById('loadingMessage')
const ratioLabel = document.getElementById('ratioLabel')

const minBuyInput = document.getElementById("minBuy")
const maxBuyInput = document.getElementById("maxBuy")
const minSellInput = document.getElementById("minSell")
const maxSellInput = document.getElementById("maxSell")

// Prio queue
const topN = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }

    size() {
        return this._heap.length;
    }

    isEmpty() {
        return this.size() == 0;
    }

    peek() {
        return this._heap[topN];
    }

    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }

    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > topN) {
            this._swap(topN, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    replace(value) {
        const replacedValue = this.peek();
        this._heap[topN] = value;
        this._siftDown();
        return replacedValue;
    }

    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > topN && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }

    _siftDown() {
        let node = topN;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
            ) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}

// Script
let bazaarData = null;

let movingRatio = 0.25
let minBuyPrice = 100
let maxBuyPrice = 2000000
let minSellPrice = 100
let maxSellPrice = 99999999999999
let numProducts = 20
let allowEnchantments = false

let calculatedProducts;

// Init
if (document.readyState !== 'loading') {
    InitData();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        InitData();
    });
}

ratioSlider.onchange = function () {
    // Re-Render
    movingRatio = ratioSlider.value
    ratioLabel.innerHTML = "Profit Per Unit Ratio: "+parseFloat(movingRatio).toFixed(2)
    RenderOutput()
}

hideEnchantCheckbox.onchange = function() {
    // Re-Render
    allowEnchantments = !hideEnchantCheckbox.checked
    RenderOutput()
}

minSellInput.onchange = function() {
    // Re-Render
    minSellPrice = minSellInput.value;
    RenderOutput()
}
maxSellInput.onchange = function() {
    // Re-Render
    maxSellPrice = maxSellInput.value;
    RenderOutput()
}
minBuyInput.onchange = function() {
    // Re-Render
    minBuyPrice = minBuyInput.value;
    RenderOutput()
}
maxBuyInput.onchange = function() {
    // Re-Render
    maxBuyPrice = maxBuyInput.value;
    RenderOutput()
}

function RenderOutput() {
    loadingMessage.innerHTML = ""
    outputDisplay.replaceChildren()
    calculatedProducts = new PriorityQueue((a, b) => a[0] > b[0]);

    // Iterate through each product
    Object.keys(bazaarData.products).forEach((product_name) => {
        // For each product:
        const product = bazaarData.products[product_name];
        const summary = product.quick_status;

        if (summary.buyPrice === 0 && summary.sellPrice === 0) {
            return;
        }
        if (product.product_id.includes("ENCHANTMENT") && !allowEnchantments) {
            return;
        }

        // Valid product
        const price_diff = summary.buyPrice - summary.sellPrice;
        const sell_rate = summary.buyMovingWeek / summary.buyPrice

        if (summary.buyPrice > minBuyPrice && summary.buyPrice < maxBuyPrice
            && summary.sellPrice > minSellPrice && summary.sellPrice < maxSellPrice) {

            const score = price_diff * (1 - movingRatio) + price_diff * sell_rate * movingRatio;
            const productInfo = [Math.round(score), product.product_id, summary.buyPrice.round(1), summary.sellPrice.round(1), price_diff.round(2),Math.sqrt(sell_rate * 1000)];
            calculatedProducts.push(productInfo);
        }
    });

    // Get a reference to the outputDisplay table element
    const outputTable = document.getElementById('outputDisplay');

    // Create the table element
    const table = document.createElement('table');

    // Create the header row
    const headerRow = document.createElement('tr');

    // Loop through the first row of data to create the header cells
    for (let i = 0; i < 6; i++) {
        const headerCell = document.createElement('th');
        switch (i) {
            case 0:
                headerCell.textContent = "Score";
                break;
            case 1:
                headerCell.textContent = "Name";
                break;
            case 2:
                headerCell.textContent = "Buy Price";
                break;
            case 3:
                headerCell.textContent = "Sell Price";
                break;
            case 4:
                headerCell.textContent = "Profit Per Unit";
                break;
            case 5:
                headerCell.textContent = "Sell Rate"
                break;
        }
        headerRow.appendChild(headerCell);
    }

    // Append the header row to the table
    table.appendChild(headerRow);

    // Loop through the rest of the data to create rows and cells
    for (let i = 0; i < numProducts; i++) {
        const row = document.createElement('tr');
        const product = calculatedProducts.pop()
        for (let j = 0; j < product.length; j++) {
            const cell = document.createElement('td');
            cell.textContent = product[j].toLocaleString();
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    // Append the table to the outputDisplay table element
    outputTable.appendChild(table);

}

async function InitData() {
    const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
    bazaarData = await response.json();
    console.log(bazaarData)
    RenderOutput();
}

