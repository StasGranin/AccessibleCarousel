import {CarouselSlide, ScrollAnimationOptions} from "./types";

/* --- Private functions --- */

const easeOut = (t: number, duration: number): number => 100 * Math.sin(t / duration * (Math.PI / 2)); // Basic sine easing out function

const getNearestScrollSnapPoint = (element: HTMLElement): number => {
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

const animScrollTo = (element: HTMLElement, destination: number, duration: number, afterScrolling: Function): () => void => {
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


/* --- Exportable helper functions --- */

export const getSlideElement = (slide: CarouselSlide): HTMLElement => slide.ref.current;

export const isElementInView = (element: HTMLElement): boolean => {
	const elementLeftPosition = element.offsetLeft;
	const elementRightPosition = elementLeftPosition + element.clientWidth;
	const parentElement = element.parentElement;
	const parentScrollPosition = parentElement.scrollLeft;
	const parentWidth = parentElement.clientWidth;

	return (elementLeftPosition >= parentScrollPosition) && (elementRightPosition <= parentScrollPosition + parentWidth)
}

export const scrollSlideToView = (slide: CarouselSlide, {duration, force, beforeScrolling, afterScrolling}: ScrollAnimationOptions) => {
	const slideElement = getSlideElement(slide);
	const scrollerElement = slideElement.parentElement;
	let scrollingDestination = slideElement.offsetLeft;

	beforeScrolling && beforeScrolling();

	if (!force) {
		if (isElementInView(slideElement)) {
			afterScrolling && afterScrolling();
			return;
		}

		scrollingDestination = getNearestScrollSnapPoint(slideElement);
	}

	return animScrollTo(scrollerElement, scrollingDestination, duration, afterScrolling);
};

export const scrollXSlides = (slides: CarouselSlide[], slidesToScroll: number, options: ScrollAnimationOptions) => {
	const scrollerElement = getSlideElement(slides[0]).parentElement;
	const scrollerScrollPos = scrollerElement.scrollLeft;

	for (let i=0, l=slides.length; i<l; i++) {
		if (getSlideElement(slides[i]).offsetLeft >= scrollerScrollPos) {
			const targetSlideIndex = Math.max(0, Math.min(l-1, i+slidesToScroll));
			return scrollSlideToView(slides[targetSlideIndex], options);
		}
	}

	return scrollSlideToView(slides[0], options);
};

export const getFirstVisibleSlideIndex = (slides: CarouselSlide[]): number  => {
	for (let i=0, l=slides.length; i<l; i++) {
		if (isElementInView(getSlideElement(slides[i]))) {
			return i;
		}
	}

	return 0;
};