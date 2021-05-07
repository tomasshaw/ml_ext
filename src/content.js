const matchingAnswerSelector =
	'div.ui-pdp-questions__questions-list__container-answer__isNoCollapsed > span.ui-pdp-size--SMALL'
const matchingMoreQuestionsSelector = 'ui-pdp-action-modal__link'

function main() {
	const answerArray = document.querySelectorAll(matchingAnswerSelector)
	answerArray.forEach(async (htmlEl) => {
		const newComments = await createNewComments(htmlEl.innerHTML.split(' '))
		htmlEl.innerHTML = newComments.join(' ')
	})
}

async function createNewComments(textArray) {
	const newCommentArray = await Promise.all(
		textArray.map(async (word) => {
			const matched = word.match('[Mm]{1}[Ll]{1}[A-z]{1}[-]?[0-9]+')
			try {
				if (matched) {
					console.log(matched)
					const [
						itemLink,
						itemPrice,
						itemName,
						itemPicture,
					] = await getProductInfoWithApi(matched[0])
					return createHTMLWidget({
						itemLink,
						itemPrice,
						itemName,
						itemPicture,
					})
				}
				return word
			} catch (err) {
				console.warn('No se encontro el item')
				return word
			}
		})
	)
	return newCommentArray
}

function createHTMLWidget({ itemLink, itemPrice, itemName, itemPicture }) {
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
				font-size: larger;
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
	const link = `https://api.mercadolibre.com/items?ids=${match
		.split('-')
		.join('')}`
	const res = await fetch(link, {
		method: 'GET',
	})
	if (!res.ok) {
		const text = await res.json()
		throw text?.message || text
	}
	const productJSON = await res.json()
	const product = productJSON[0].body
	return [
		product.permalink,
		product.price,
		product.title,
		product.pictures?.[0]?.secure_url || product.pictures?.[0]?.url,
	]
}

main()

try {
	const observer = new MutationObserver(main)
	observer.observe(document.getElementsByTagName('BODY')[0], {
		subtree: true,
		childList: true,
	})
} catch (err) {
	console.log(err)
	console.log('error al inicializar observer')
}
