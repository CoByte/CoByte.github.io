let scrambleChars = "qwertyuiopasdfghjklzxcvbnm1234567890"

function scramble(toBeScrambled) {
    let size = toBeScrambled.length
    var scrambled = []

    for (var i = 0; i < size; i++) {
        if (toBeScrambled[i] == " ") {
            scrambled.push(" ")
        } else {
            scrambled.push(scrambleChars[~~(scrambleChars.length * Math.random())])
        }
    }

    return scrambled
}

var data = []
var count = -1
var finished = 0

document.addEventListener('DOMContentLoaded', function() {
    for (textBlob of document.getElementsByClassName("content-block")) {
        var children = textBlob.children
        
        var header = processText(children[0].textContent)
        var text = processText(children[1].textContent)

        data.push([
            header,
            text
        ])

        children[0].innerHTML = scramble(header).join("")
        children[1].innerHTML = scramble(text).join("")
    }
});

async function decrypt() {

    if (count == data.length - 1) {
        return
    }

    if (count == data.length - 2 && finished != data.length) {
        var button = document.getElementById("button!")
        button.innerHTML = "DECRYPTING"
        button.style.backgroundColor = "orange"
    }

    count++

    var target = document.getElementsByClassName("content-block")[count].children

    var header = data[count][0]
    var text = data[count][1]

    var order = []
    for (var i = 0; i < (header.length + text.length); i++) {
        order.push(i)
    }
    shuffle(order)

    for (var i = 1; i <= order.length; i++) {
        var headerScramble = scramble(header)
        var textScramble = scramble(text)

        for (var j = 0; j < i; j++) {
            var correct = order[j]

            if (correct >= header.length) {
                correct -= header.length

                textScramble[correct] = text[correct]

            } else {
                headerScramble[correct] = header[correct]
            }
        }

        target[0].innerHTML = headerScramble.join("")
        target[1].innerHTML = textScramble.join("")

        await sleep(5)
    }

    finished++

    if (finished == data.length) {
        var button = document.getElementById("button!")
        button.innerHTML = "DECRYPTED"
        button.style.backgroundColor = "greenyellow"
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function processText(text) {
    return text.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
}