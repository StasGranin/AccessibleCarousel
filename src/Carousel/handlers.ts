import React from "react";
import {Callback, CarouselSlide, ScrollAnimationOptions, SetFocusFn} from "./types";
import {getSlideElement, scrollSlideToView, scrollXSlides} from "./helpers";

export const handleSwipe = (scrollerElement: HTMLElement, callback: (direction: string, distance: number) => void): Callback => {
	let scrollPosition = null;
	let initialScrollPosition = scrollerElement.scrollLeft;
	let loopHandle = null;

	const listen = () => {
		clearTimeout(loopHandle);

		scrollPosition = scrollerElement.scrollLeft;
		loopHandle = setTimeout(() => {
			if (scrollerElement.scrollLeft === scrollPosition) {
				initialScrollPosition !== scrollPosition && callback(initialScrollPosition < scrollPosition ? 'Forward' : 'Back', Math.abs(initialScrollPosition-scrollPosition));
			} else {
				listen();
			}
		}, 100);
	};

	const onTouchStart = () => initialScrollPosition = scrollerElement.scrollLeft;
	const onTouchEnd = () => initialScrollPosition !== scrollerElement.scrollLeft && listen();

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
			focusedIndex > 0 && setFocusedIndexFn(focusedIndex - 1, 'KeyPress', event.key);
			break;
		case 'ArrowRight':
		case 'ArrowDown':
			event.preventDefault();
			focusedIndex < slidesCount-1 && setFocusedIndexFn(focusedIndex + 1, 'KeyPress', event.key);
			break;
		case 'Enter':
			carouselSlides[focusedIndex].onActionHandler && carouselSlides[focusedIndex].onActionHandler();
			break;
	}
};

export const handleSlideFocus = (slide: CarouselSlide, animationDuration, scrollingAnimationRef: React.RefObject<Callback>): Callback => {
	const slideElement = getSlideElement(slide);

	slideElement !== document.activeElement && slideElement.focus({preventScroll: true});

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