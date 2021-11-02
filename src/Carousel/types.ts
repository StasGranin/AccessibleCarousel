import React from "react";

export type CarouselSlide = {
	child: React.ReactNode;
	ref: React.RefObject<HTMLLIElement> | null;
	onSelectHandler: Callback;
	onAction: (event: React.UIEvent) => void;
};

export type Callback = (...args:any[]) => void;
export type SetFocusFn = (slideIndex: number|null, trigger: CarouselEvent['trigger'], which?: CarouselEvent['which']) => void;

export type ScrollAnimationOptions = {
	duration: number;
	animationRef?: React.RefObject<Callback>;
	force?: boolean;
	afterScrolling?: Callback;
	beforeScrolling?: Callback;
};

/* --- Component prop types --- */

export type CarouselEvent = {
	type: 'SlideFocus'|'Scroll';
	trigger: 'Click'|'KeyPress'|'Arrow'|'Scroll'|'Dots';
	which?: string|number|null;
	currentIndex: number;
	prevIndex: number;
};

export type CarouselProps = {
	isMobile?: boolean; // ?
	slidesToScroll?: number;
	focusOnScroll?: boolean;
	speed?: number;
	arrows?: boolean;
	prevArrow?: JSX.Element;
	nextArrow?: JSX.Element;
	dots?: boolean;
	appendDots?(dots: React.ReactNode): JSX.Element;
	onSlideFocus?: (CarouselEvent) => void;
};

export type SlidesProps = {
	carouselSlides: CarouselSlide[];
	scrollerRef: React.RefObject<HTMLUListElement>
};

export type ArrowProps = {
	direction: 'back'|'forward';
	settings: CarouselProps;
	onAction: (event: React.UIEvent, slidesToScroll: number) => any;
}

export type DotsProps = {
	carouselSlides: CarouselSlide[];
	focusedIndex: number;
	settings: CarouselProps;
	onAction: SetFocusFn;
}