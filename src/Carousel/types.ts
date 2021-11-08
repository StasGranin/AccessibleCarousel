import React from "react";

export type CarouselSlide = {
	index: number;
	child: React.ReactNode; // Slide React component extended with carousel hooks
	ref: React.RefObject<HTMLLIElement> | null; // Since most of the dirty work is node with proper DOM manipulation (as God intended to), we need to keep the dom node around
	onActionHandler: Callback; // If provided by the Slide.child, Carousel will call this function on pressing the Enter key
	onFocusHandler: Callback; // If provided, Carousel will call this function on setting focus to the slide
	onAction: (event: React.UIEvent) => void; // Currently bound to MouseDown event of the slide
};

export type Callback = (...args:any[]) => void;
export type SetFocusFn = (slideIndex: number|null, trigger: FocusEvent['trigger'], which?: FocusEvent['which']) => void;

export type ScrollAnimationOptions = {
	duration: number; // in ~ms
	animationRef?: React.RefObject<Callback>; // This ref will hold the animation loop's killswitch function
	force?: boolean; // If true - attempt to scroll to the destination ignoring snap points
	afterScrolling?: Callback;
	beforeScrolling?: Callback; // Used by the Carousel as a way to terminate a previously running animation
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
	slidesToScroll?: number; // Number of slides to scroll by clicking the arrow button
	focusOnScroll?: boolean; // Will scrolling/swiping cause the first visible slide to focus if the currently focused slide is not in view
	scrollDuration?: number; // Duration of the scrolling animation in ~ms
	ariaAnnounceSlides?: boolean; // If true - carousel will plant additional hints for the screen reader
	ariaSlideAnnouncement?: (slideIndex: number, slidesCount: number) => string; // Additional hints' text generation function
	showArrows?: boolean;
	prevArrow?: JSX.Element;
	nextArrow?: JSX.Element;
	showDots?: boolean;
	dots?: (props: CustomDotsComponentProps) => JSX.Element;
	onSlideFocus?: (event: FocusEvent) => void;
	onSwipe?: (event: SwipeEvent) => void;
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