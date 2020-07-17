const priceExtras = {
	stringMatch: "price-tag-fraction",
	charsToIgnore: 20,
	charsLength: 12,
}
const nameExtras = {
	stringMatch: "item-title__primary",
	charsToIgnore: 24,
	charsLength: 60,
}
const pictureExtras = {
	stringMatch: "gallery__thumbnail",
	charsToIgnore: 150,
	charsLength: 400,
	splitCond: '"',
	arrPosWanted: 1
}

async function main(){
	const answerArray = document.querySelectorAll("div.questions__content p")
	answerArray.forEach(async htmlEl => {
		const newComments = await createNewComments(htmlEl.innerHTML.split(' '))
		htmlEl.innerHTML = newComments.join(' ')
	})
}

async function createNewComments(textArray){
	const newCommentArray = await Promise.all(textArray.map(async (word, index) => {
		const matched = word.match("articulo.mercadolibre.com.ar")
		if(matched){
			const [itemPrice, itemName, itemPicture] = await getProductInfo(matched.input)
			return `${itemName}, ${itemPrice}, <img src=${itemPicture}>`
		}
		return word
	}))
	return newCommentArray
}

async function getProductInfo(link){
	//validar que sea link
	const res = await fetch(link, {
		method: 'GET'
	})
	const body = await res.text()
	return [
		getItemData(body, priceExtras),
		getItemData(body, nameExtras),
		getItemData(body, pictureExtras)
	]
}

function getItemData(htmlText, {
	stringMatch,
	charsToIgnore,
	charsLength,
	splitCond,
	arrPosWanted
}){
	const filtered = htmlText
		.substr(htmlText
		.search(stringMatch)+charsToIgnore, charsLength)
		.split(splitCond || "<")
	return filtered[arrPosWanted || 0].trim()
}

main()
