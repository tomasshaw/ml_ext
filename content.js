const priceExtras = {
	stringMatch: 'price-tag-fraction',
	charsToIgnore: 20,
	charsLength: 12,
}
const nameExtras = {
	stringMatch: 'item-title__primary',
	charsToIgnore: 24,
	charsLength: 60,
}
const pictureExtras = {
	stringMatch: 'gallery__thumbnail',
	charsToIgnore: 150,
	charsLength: 400,
	splitCond: '"',
	arrPosWanted: 1,
}

function main() {
	const answerArray = document.querySelectorAll('div.questions__content p')
	answerArray.forEach(async (htmlEl) => {
		const newComments = await createNewComments(htmlEl.innerHTML.split(' '))
		htmlEl.innerHTML = newComments.join(' ')
	})
}

async function createNewComments(textArray) {
	const newCommentArray = await Promise.all(
		textArray.map(async (word) => {
			const matched = word.match('articulo.mercadolibre.com.ar')
			if (matched) {
				const itemLink = matched.input
				const [itemPrice, itemName, itemPicture] = await getProductInfo(
					itemLink
				)
				return createHTMLWidget({ itemPrice, itemName, itemPicture, itemLink })
			}
			const newMatched = word.match('[p][/]{1}[MLml]{2}[A-z]{1}[0-9]+')
			if (newMatched) {
				const itemLink = newMatched.input
				const [itemPrice, itemName, itemPicture] = await getProductInfoWithApi(
					newMatched[0].split('/').pop()
				)
				return createHTMLWidget({ itemPrice, itemName, itemPicture, itemLink })
			}
			return word
		})
	)
	return newCommentArray
}

function createHTMLWidget({ itemPrice, itemName, itemPicture, itemLink }) {
	const htmlWidget = `
		<style>
			.wrapperDiv {
				margin: 4px 0;
				width: calc(100% - 2px);
				height: 70px;
				border: 2px solid;
				border-color: rgb(245,245,245);
				border-radius: 4px;
				box-shadow: 2px 2px 2px 1px rgba(0,0,0,.1);
				display: flex;
			}
			.ml_widget_picture {
				width: 70px;
				height: 70px;
				white-space: nowrap;
				text-align: center;
				margin-right: 8px;
				border-right: 1px solid;
				border-right-color: rgba(51, 51, 51, 0.1);
			}
			.ml_name_and_title {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.ml_h5_text{
				text-decoration: none;
				color: rgba(0, 0, 0, 0.8);
				text-align: center;
			}
			.ml_item_title{
				text-decoration: none;
				color: rgba(0, 0, 0, 0.8);
			}
			.ml_item_price{
				text-decoration: none;
				color: rgba(0, 0, 0, 0.8);
				margin: auto;
			}
			.productImage {
				max-width: 65px;
				max-height: 65px;
				vertical-align: middle;
			}
			.img_helper{
				display: inline-block;
				height: 100%;
				vertical-align: middle;
			}
		</style>
		<a href="${itemLink}" target="_blank" class="wrapperDiv">
		<div class="ml_widget_picture">
			<span class="img_helper"></span>
			<img class="productImage" src=${itemPicture}>
		</div>
		<div class="ml_name_and_title">
			<h5 class="ml_h5_text ml_item_title">${itemName}</h5>
			<h5 class="ml_h5_text ml_item_price">$ ${itemPrice}</h5>
		</div>
		</a>`
	return htmlWidget
}

async function getProductInfoWithApi(match) {
	const link = `https://api.mercadolibre.com/products/${match}`
	const res = await fetch(link, {
		method: 'GET',
	})
	const productJSON = await res.json()
	return [
		productJSON.buy_box_winner.price,
		productJSON.name,
		productJSON.pictures[0].url,
	]
}

async function getProductInfo(link) {
	//validar que sea link
	const res = await fetch(link, {
		method: 'GET',
	})
	const body = await res.text()
	return [
		getItemData(body, priceExtras),
		getItemData(body, nameExtras),
		getItemData(body, pictureExtras),
	]
}

function getItemData(
	htmlText,
	{ stringMatch, charsToIgnore, charsLength, splitCond, arrPosWanted }
) {
	const filtered = htmlText
		.substr(htmlText.search(stringMatch) + charsToIgnore, charsLength)
		.split(splitCond || '<')
	return filtered[arrPosWanted || 0].trim()
}

main()
