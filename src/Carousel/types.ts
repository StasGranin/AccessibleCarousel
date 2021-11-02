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
	slidesToScroll?: number;
	focusOnScroll?: boolean;
	scrollDuration?: number;
	showArrows?: boolean;
	prevArrow?: JSX.Element;
	nextArrow?: JSX.Element;
	showDots?: boolean;
	dots?: (CustomDotsComponentProps) => JSX.Element;
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

export type CustomDotsComponentProps = {
	carouselSlides: CarouselSlide[];
	focusedIndex: number;
	onAction: SetFocusFn;
};