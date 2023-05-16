const ratioSlider = document.getElementById('ratioSlider');
const outputDisplay = document.getElementById('outputDisplay')
const ratioLabel = document.getElementById('ratioLabel')

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

function titleCase(str) {
    str = str.toLowerCase();
    str = str.split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' '); // ["I'm", "A", "Little", "Tea", "Pot"].join(' ') => "I'm A Little Tea Pot"
}

// Script
let bazaarData = null;

let movingRatio = 0.25
let minBuyPrice = 100
let maxBuyPrice = 2000000
let minSellPrice = 100
let maxSellPrice = 99999999999999
let numProducts = 48
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

function RenderOutput() {
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


    const displayHolder = document.getElementById("ItemDisplayHolder")
    const originalNode = document.getElementById("originalItemDisplay")

    displayHolder.replaceChildren()
    // Loop through the rest of the data to populate grid
    for (let i = 0; i < numProducts; i++) {
        const row = document.createElement('tr');
        const product = calculatedProducts.pop()
        for (let j = 0; j < product.length; j++) {
            const cell = document.createElement('td');
            cell.textContent = product[j].toLocaleString();
            row.appendChild(cell);
        }
        const itemImage = GetItemImage(product[1]);
        const rowNum = Math.floor(i/3)

        const copiedNode = originalNode.cloneNode(true)

        copiedNode.style.gridRow = rowNum

        copiedNode.querySelector(".itemDisplayName").innerHTML = titleCase(product[1].replace(/_/g, " "))

        let itemValues = copiedNode.querySelectorAll(".itemValue")
        itemValues[0].innerHTML = product[3].toLocaleString()
        itemValues[1].innerHTML = product[2].toLocaleString()
        itemValues[2].innerHTML = product[4].toLocaleString()
        itemValues[3].innerHTML = product[5].toFixed(1) + GetItemSellRateString(product[5])
        itemValues[3].style.color = GetItemSellRateColor(product[5])

        copiedNode.querySelector(".itemImageDisplay").src = itemImage.src;

        displayHolder.appendChild(copiedNode)

    }
}

function GetItemSellRateString(sellRate) {
    if(sellRate < 1) {
        return " (Very Low)"
    }
    if(sellRate < 30) {
        return " (Low)"
    }
    if(sellRate < 300) {
        return " (Medium)"
    }
    if(sellRate < 4000) {
        return " (High)"
    }
    return " (Very High)"
}

function GetItemSellRateColor(sellRate) {
    if(sellRate < 1) {
        return "#ff2121"
    }
    if(sellRate < 30) {
        return "#fd6868"
    }
    if(sellRate < 300) {
        return "#c9c9c9"
    }
    if(sellRate < 4000) {
        return "#97ff5b"
    }
    return "#49ff00"
}

function checkIfImageExists(url, callback) {
    const img = new Image();
    img.src = url;

    if (img.complete) {
        callback(true);
    } else {
        img.onload = () => {
            callback(true);
        };

        img.onerror = () => {
            callback(false);
        };
    }
}

function GetItemImage(itemName) {
    let imageName = itemName
    if(imageName.startsWith("ENCHANTED_")) {
        imageName = imageName.substring(10)
    }
    let image = new Image();
    image.onerror = function() {
        image.src = "./images/furf/question.png"
    }
    image.src = "./images/furf/"+imageName+".png"
    return image
}

async function InitData() {
    const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
    bazaarData = await response.json();
    RenderOutput();
}

