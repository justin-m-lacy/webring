const PADDING = 20;

/**
 * Get preferred top position for a popup, where targRect is the
 * rollover element that triggered the popup.
 * @param elm
 * @param targRect
 */
const getTop = (elm: HTMLElement, targRect: DOMRect) => {

	const y = targRect.top - 40;

	return (y < PADDING) ? PADDING : (

		y + elm.offsetHeight > (window.innerHeight - PADDING) ?
			(window.innerHeight - PADDING - elm.offsetHeight) : y

	);

}

export const centerX = (elm: HTMLElement) => {

	const style = elm.style;
	style.left = ((window.innerWidth - elm.offsetWidth) / 2) + 'px'

};

export const centerXY = (elm: HTMLElement, pctY: number) => {

	const style = elm.style;
	style.left = ((window.innerWidth - elm.offsetWidth) / 2) + 'px'
	style.top = ((pctY || 0.5) * (window.innerHeight - elm.offsetHeight)) + 'px';

};

/**
 *
 * @param  elm - element being positioned
 * @param  target - target being rolled over.
 * @param pad - padding distance between element and popup.
 */
export const positionAt = (elm: HTMLElement, target: HTMLElement, pad = 32) => {

	const style = elm.style;
	const rect = target.getBoundingClientRect();
	//let myBox = this.$el.getBoundingClientRect();

	const left = rect.left;
	if (left < window.innerWidth / 2) {

		style.left = (left + target.offsetWidth + pad) + 'px';

	} else {

		style.left = (left - elm.offsetWidth - pad) + 'px';
	}

	style.top = getTop(elm, rect) + 'px';

};