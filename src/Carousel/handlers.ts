import React from "react";
import {Callback, CarouselEvent, CarouselSlide, ScrollAnimationOptions, SetFocusFn} from "./types";
import {getSlideElement, scrollSlideToView, scrollXSlides} from "./helpers";

export const handleUserScrolling = (scrollerElement: HTMLElement, callback: SetFocusFn): Callback => {
	let scrollPosition = null;
	let initialScrollPosition = scrollerElement.scrollLeft;
	let loopHandle = null;

	const listen = () => {
		clearTimeout(loopHandle);

		scrollPosition = scrollerElement.scrollLeft;
		loopHandle = setTimeout(() => {
			if (scrollerElement.scrollLeft === scrollPosition) {
				callback(null, 'Scroll', initialScrollPosition < scrollPosition ? 'Forward' : 'Back');
			} else {
				listen();
			}
		}, 100);
	};

	const onTouchStart = () => scrollPosition = scrollerElement.scrollLeft;
	const onTouchEnd = () => scrollPosition !== scrollerElement.scrollLeft && listen();

	scrollerElement.addEventListener('touchstart', onTouchStart);
	scrollerElement.addEventListener('touchend', onTouchEnd);

	return () => {
		clearTimeout(loopHandle);
		scrollerElement.removeEventListener('touchstart', onTouchStart)
		scrollerElement.removeEventListener('touchend', onTouchEnd)
	};
};

export const handleArrowsOnScroll = (scrollerElement: HTMLElement) => {
	const carouselElementStyle = scrollerElement.parentElement.style;
	const onScroll = () => {
		carouselElementStyle.setProperty('--prev-button-opacity', Math.min(scrollerElement.scrollLeft / 20, 1).toString());
		carouselElementStyle.setProperty('--next-button-opacity', Math.min((scrollerElement.scrollWidth - scrollerElement.scrollLeft - scrollerElement.clientWidth) / 20, 1).toString());
	};

	scrollerElement.addEventListener('scroll', onScroll);
	onScroll();

	return () => scrollerElement.removeEventListener('scroll', onScroll)
}

export const handleKeyboardNavigation = (event: React.KeyboardEvent, carouselSlides: CarouselSlide[], focusedIndex: number, setFocusedIndexFn: SetFocusFn) => {
	const slidesCount = carouselSlides.length;

	switch (event.key) {
		case 'ArrowLeft':
		case 'ArrowUp':
			event.preventDefault();
			setFocusedIndexFn(focusedIndex > 0 ? focusedIndex - 1 : 0, 'KeyPress', event.key);
			break;
		case 'ArrowRight':
		case 'ArrowDown':
			event.preventDefault();
			setFocusedIndexFn(focusedIndex < slidesCount-1 ? focusedIndex + 1 : focusedIndex, 'KeyPress', event.key);
			break;
		case 'Enter':
			carouselSlides[focusedIndex].onSelectHandler && carouselSlides[focusedIndex].onSelectHandler();
			break;
	}
};

export const handleSlideFocus = (carouselSlides: CarouselSlide[], slideIndex: number, animationDuration, scrollingAnimationRef: React.RefObject<Callback>): Callback => {
	const slide = carouselSlides[slideIndex];
	const slideFirstElement = getSlideElement(slide);

	slideFirstElement.focus({preventScroll: true});
	carouselSlides.forEach((slide, index) => getSlideElement(slide).tabIndex = index === slideIndex ? 0 : -1);

	return scrollSlideToView(slide, {
		duration: animationDuration,
		beforeScrolling: scrollingAnimationRef.current // Clear the previously running scrolling animation
	});
}

export const handleArrowButtonsNavigation = (event, carouselSlides, slidesToScroll, scrollingAnimationRef: React.RefObject<Callback>, options: ScrollAnimationOptions): Callback => {
	event.preventDefault(); // Prevent losing focus on arrow button click

	return scrollXSlides(carouselSlides, slidesToScroll, {
		duration: options.duration,
		force: true,
		beforeScrolling: scrollingAnimationRef.current,
		afterScrolling: options.afterScrolling
	})
};