let wheel = $('.wheelBody')
let contentCon = $('.contentCon')
let winBar = $('.winBar')
let length, preAngle
let starAngle = 0
let giftBox = []
let data = []
let url = './db.json'

let rand = function(start, end) {
	return Math.floor(Math.random() * (end - start) + start)
}

let shuffle = function(a, b) {
	let num = Math.random() > 0.5 ? -1 : 1
	return num
}

let showGift = function(r) {
	$('.pattern')
		.eq(r)
		.addClass('picked')
	$('.content')
		.eq(r)
		.addClass('picked')
	$('h2').text(`${data[r].text}!`)
	winBar.fadeIn(300)
}

let showNum = function() {
	$('.content').each(function() {
		let index = $(this).index()
		$(this)
			.find('span')
			.text(data[index].num)
	})
}

let again = function(r) {
	$('.pattern').removeClass('picked')
	$('.content').removeClass('picked')
	winBar.fadeOut(300)
}

let handRotate = function(gift, second) {
	let goAngle = starAngle + 1440 + gift * preAngle - (starAngle % 360)
	starAngle = goAngle
	$('.hand').css({
		transition: `${second}ms`,
		transform: `rotate(${goAngle}deg)`,
	})
	setTimeout(function() {
		showGift(gift)
		showNum()
		$('.hand').on('click', clickHandler)
	}, second)
}

let clickHandler = function() {
	$('.hand').off('click')
	if (giftBox.length == 0) {
		init()
		$('.hand').on('click', clickHandler)
	} else {
		again()
		let gift = giftBox.sort(shuffle).pop()
		data[gift].num--
		handRotate(gift, 3000)
	}
}

let init = function() {
	starAngle = 0
	giftBox = []
	winBar.hide()
	wheel.html('<div class="hand"><p>PRESS</p><img src="./images/hand.svg" /></div>')
	contentCon.html('')
	$('.hand').css({
		transition: 'unset',
		transform: 'unset',
	})
	$.get(url, function(res) {
		data = res
		data.forEach((item, index) => {
			preAngle = 360 / data.length
			let patternAngle = preAngle / -2 + index * preAngle
			let pattern = $('<div class="pattern"></div>')
			let inner = $('<div class="inner"></div>')
			let content = $(
				`<div class="content"><h3>${item.icon}</h3><p>${item.text}</p><span>${item.num}</span></div>`
			)

			pattern.css('transform', `rotate(${patternAngle}deg)`)
			inner.css('transform', `rotate(${preAngle}deg)`)
			content.css('transform', `rotate(${index * preAngle}deg)`)
			pattern.append(inner)
			wheel.append(pattern)
			contentCon.append(content)

			for (let i = 0; i < item.num; i++) {
				giftBox.push(index)
			}
		})
	})
	$('.hand').on('click', clickHandler)
}

init()

$('.btnGroup a').on('click', function() {
	if ($(this).hasClass('to2017')) {
		url = './db.json'
		$(this)
			.addClass('active')
			.siblings()
			.removeClass('active')
	} else if ($(this).hasClass('to2018')) {
		url = './db2018.json'
		$(this)
			.addClass('active')
			.siblings()
			.removeClass('active')
	}
	init()
})
