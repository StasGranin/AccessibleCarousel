import React from "react";
import {Callback, CarouselSlide, ScrollAnimationOptions, SetFocusFn} from "./types";
import {getSlideElement, scrollSlideToView, scrollXSlides} from "./helpers";
import {setCssVars} from "./utils";

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

export const handleOnScroll = (scrollerElement: HTMLElement) => {
	const {parentElement, clientWidth, scrollWidth} = scrollerElement;

	const onScroll = () => {
		const {scrollLeft, childNodes} = scrollerElement;

		setCssVars(parentElement, {
			slidesCount: childNodes.length,
			scrollPos: scrollLeft,
			carouselWidth: clientWidth,
			itemsTotalWidth: scrollWidth,
			backArrowDisplay: scrollLeft > 0 ? 'block' : 'none',
			forwardArrowDisplay: scrollLeft < scrollWidth - clientWidth ? 'block' : 'none',
		});
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

	slideElement !== document.activeElement && slideElement.focus({preventScroll: true}); // No need to fire the focus event twice on the same slide

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