Chrome extension to visually upgrade MercadoLibre's comment section

Api call for item: `curl -X GET "https://api.mercadolibre.com/items?ids=MLA899797923"`

TODO:
✓ 1. Init development folder structure for developing chrome extensions
✓ 2. Create a manifest file
✓ 3. Create front-side UI for comment replacement widget
✓ 4. Create first iteration of regex matching ml's product links
✓ 5. Create logic for detecting comment which matches the regex
✓ 6. Load the widget data
✓ 7. Replace the link with (loaded?) widget
✓ 8. Prettify it. Text color grey / standard h5 style. Bigger price. More shadows. border between price and title? Force double line height in title in all titles (visual coordination between widgets). Remove margin right in widget
~9. Add support for new version of mercadolibre's products~

Update:
New TODO:
  1. Use ML item API
  2. Modify loading to use new API call
