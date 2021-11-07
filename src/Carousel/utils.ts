import {Callback} from "./types";

export const setCssVars = (element: HTMLElement, property: string|{[name: string]: string|number}, value?: string|number) => {
	if (typeof property === 'string') {
		element.style.setProperty('--' + property, value.toString());
	} else {
		Object.keys(property).forEach(key => setCssVars(element, key, property[key]))
	}
}

export const easeOut = (t: number, duration: number): number => 100 * Math.sin(t / duration * (Math.PI / 2)); // Basic sine easing out function

export const getNearestScrollSnapPoint = (element: HTMLElement): number => {
	const elementLeftPosition = element.offsetLeft;
	const elementRightPosition = elementLeftPosition + element.clientWidth;
	const parentElement = element.parentElement;
	const parentScrollPosition = parentElement.scrollLeft;
	const parentWidth = parentElement.clientWidth;
	const children = parentElement.childNodes;
	const scrollAmount = Math.min(elementLeftPosition - parentScrollPosition, Math.abs(elementRightPosition - (parentScrollPosition + parentWidth)));

	for (let i=0, l=children.length; i<l; i++) {
		const childOffset = (children[i] as HTMLElement).offsetLeft;
		if (childOffset >= parentScrollPosition+scrollAmount) {
			return childOffset;
		}
	}

	return elementLeftPosition;
};

export const animScrollTo = (element: HTMLElement, destination: number, duration: number, afterScrolling: Callback): Callback => {
	let active = true;
	const scrollPosition = element.scrollLeft;
	const loop = (t) => {
		if (active) {
			requestAnimationFrame(() => {
				const d = Math.round(duration / 25);
				const p = easeOut(t, d);

				element.scrollTo((scrollPosition + Math.floor((destination - scrollPosition) / 100 * p)), 0);

				if (t < d) {
					loop(++t);
				} else {
					element.style.scrollSnapType = 'x mandatory';
					afterScrolling && afterScrolling();
				}
			});
		}
	};

	element.style.scrollSnapType = 'none';
	loop(0);

	return () => {
		active = false;
		element.style.scrollSnapType = 'x mandatory';
	};
};
