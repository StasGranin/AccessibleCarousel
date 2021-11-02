import React from "react";

export type CarouselSlide = {
	child: React.ReactNode;
	ref: React.RefObject<HTMLLIElement> | null;
	onActionHandler: Callback;
	onAction: (event: React.UIEvent) => void;
	onFocusHandler: Callback;
};

export type Callback = (...args:any[]) => void;
export type SetFocusFn = (slideIndex: number|null, trigger: FocusEvent['trigger'], which?: FocusEvent['which']) => void;

export type ScrollAnimationOptions = {
	duration: number;
	animationRef?: React.RefObject<Callback>;
	force?: boolean;
	afterScrolling?: Callback;
	beforeScrolling?: Callback;
};

/* --- Component prop types --- */

export type FocusEvent = {
	trigger: 'Click'|'KeyPress'|'Arrow'|'Scroll'|'Swipe'|'Dots';
	which?: string|number|null;
	currentIndex: number;
	prevIndex: number;
};

export type SwipeEvent = {
	direction: 'Back'|'Forward';
	distance: number;
	firstVisibleSlideIndex: number;
};

export type CarouselProps = {
	slidesToScroll?: number;
	focusOnScroll?: boolean;
	scrollDuration?: number;
	ariaAnnounceSlides?: boolean;
	ariaSlideAnnouncement?: (slideIndex: number, slidesCount: number) => string;
	showArrows?: boolean;
	prevArrow?: JSX.Element;
	nextArrow?: JSX.Element;
	showDots?: boolean;
	dots?: (CustomDotsComponentProps) => JSX.Element;
	onSlideFocus?: (CarouselEvent) => void;
	onSwipe?: (SwipeEvent) => void;
};

export type SlidesProps = {
	carouselSlides: CarouselSlide[];
	settings: CarouselProps;
	focusedIndex: number;
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