import {Callback, CarouselSlide, ScrollAnimationOptions} from "./types";
import {animScrollTo, getNearestScrollSnapPoint} from "./utils";

export const getSlideElement = (slide: CarouselSlide): HTMLElement => slide.ref.current;

export const isElementInView = (element: HTMLElement): boolean => {
	const elementLeftPosition = element.offsetLeft;
	const elementWidth = element.clientWidth;
	const elementRightPosition = elementLeftPosition + elementWidth;
	const parentElement = element.parentElement;
	const parentScrollPosition = parentElement.scrollLeft;
	const parentWidth = parentElement.clientWidth;
	const farEdge = elementWidth > parentWidth ? elementLeftPosition : elementRightPosition;

	return elementLeftPosition >= parentScrollPosition && farEdge <= parentScrollPosition + parentWidth;
}

export const scrollSlideToView = (slide: CarouselSlide, {duration, force, beforeScrolling, afterScrolling}: ScrollAnimationOptions): Callback => {
	const slideElement = getSlideElement(slide);
	const scrollerElement = slideElement.parentElement;
	const maxScrollingDestination = scrollerElement.scrollWidth - scrollerElement.clientWidth;
	let scrollingDestination = slideElement.offsetLeft;

	beforeScrolling && beforeScrolling();

	if (!force) {
		if (isElementInView(slideElement)) {
			afterScrolling && afterScrolling();
			return;
		}

		scrollingDestination = getNearestScrollSnapPoint(slideElement);
	}

	return animScrollTo(scrollerElement, Math.min(scrollingDestination, maxScrollingDestination), duration, afterScrolling);
};

export const scrollXSlides = (slides: CarouselSlide[], slidesToScroll: number, options: ScrollAnimationOptions): Callback => {
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