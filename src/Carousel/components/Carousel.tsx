import React, {useEffect, useMemo, useRef, useState} from "react";
import Arrow from "./Arrows";
import Slides from "./Slides";
import Dots from "./Dots";
import {CarouselSlide, CarouselProps, SetFocusFn} from '../types'
import {
	handleArrowButtonsNavigation,
	handleKeyboardNavigation,
	handleOnScroll,
	handleSlideFocus,
	handleSwipe
} from "../handlers";
import {
	getFirstVisibleSlideIndex,
	getSlideElement,
	isElementInView,
} from "../helpers";

import {defaultProps} from "../defaults";

const Carousel: React.FC<CarouselProps> = ({children, ...props}) => {
	const settings = {...defaultProps, ...props};
	const [focusedSlideIndex, setFocusedSlideIndex] = useState(0);
	const prevFocusedSlideIndex = useRef(null); // Right not its only use is for providing data to the onSlideFocus events
	const scrollerRef = useRef<HTMLUListElement>(null);
	const animRef = useRef(() => {}); // This holds the kill-switch function of the currently running animation loop

	// Create the carouselSlides object based on props.children
	// This is an array of Slide objects containing: the wrapped child, it's DOM node ref and slide interaction handler functions
	const carouselSlides: CarouselSlide[] = useMemo(() => React.Children.toArray(children)
		.filter((child) => React.isValidElement(child))
		.map((child: JSX.Element, index) => {
			const slide: CarouselSlide = {
				child: React.cloneElement(child, {...child.props,
					slideIndex: index,
					// These hook function are called by the Slide.child component on its mounting to provide the Carousel with a way to interact with the child.
					// This is used to simulate onClick and onFocus events triggered by the carousel on the child
					onActionHook: fn => {
						slide.onActionHandler = fn;
					},
					onFocusHook: fn => {
						slide.onFocusHandler = fn;
					},
				}),
				ref: React.createRef<HTMLLIElement>(), // The DOM node of the wrapper element of the original child; What we mostly interact with
				onActionHandler: null, // The return value of the hook function goes here
				onFocusHandler: null,
				onAction: event => { // What to do when clicking the item. It is called Action instead of Click to support other possible interaction options
					event.preventDefault();
					getSlideElement(slide).focus({preventScroll: true});
					setFocusedSlide(index, 'Click');
				}
			};
			return slide;
		}), [children]);

	// Wrapper function over setFocusedSlideIndex(). Probably the most important function here
	const setFocusedSlide: SetFocusFn = (slideIndex, trigger, which) => {
		if (slideIndex === null) {
			if (isElementInView(getSlideElement(carouselSlides[focusedSlideIndex]))) {
				return;
			}
			slideIndex = getFirstVisibleSlideIndex(carouselSlides)
		}

		slideIndex = Math.min(slideIndex, carouselSlides.length - 1); // Make sure we're not trying to access a removed slide
		setFocusedSlideIndex(slideIndex);

		settings.onSlideFocus && settings.onSlideFocus({
			trigger,
			which,
			currentIndex: slideIndex,
			prevIndex: prevFocusedSlideIndex.current
		});
	};

	// Handle keyboard navigation
	const onKeyDown = (event: React.KeyboardEvent) => handleKeyboardNavigation(event, carouselSlides, focusedSlideIndex, setFocusedSlide);

	// Handle arrow button paging
	const onArrowButtonMouseDown = (event, slidesToScroll) =>
		animRef.current = handleArrowButtonsNavigation(event, carouselSlides, slidesToScroll, animRef, {
			duration: settings.scrollDuration,
			afterScrolling: () =>
				settings.focusOnScroll && setFocusedSlide(null, 'Arrow', slidesToScroll > 0 ? 'Previous' : 'Next')
		});

	// Handler for the focusedSlideIndex change
	useEffect(() => {
		const slidesCount = carouselSlides.length;

		if (slidesCount) {
			if (focusedSlideIndex > slidesCount - 1) { // Remediate a situation when the focusedItem was removed
				setFocusedSlideIndex(slidesCount - 1);
				return;
			}
			animRef.current = handleSlideFocus(carouselSlides[focusedSlideIndex], settings.scrollDuration, animRef);
			prevFocusedSlideIndex.current = focusedSlideIndex;
		}
	}, [focusedSlideIndex, carouselSlides, settings.scrollDuration]);

	// Handle swiping the carousel
	useEffect(() => handleSwipe(scrollerRef.current, (direction, distance) => {
			settings.onSwipe && settings.onSwipe({
				direction,
				distance,
				firstVisibleSlideIndex: getFirstVisibleSlideIndex(carouselSlides)
			});

			settings.focusOnScroll && setFocusedSlide(null, 'Swipe', direction)
		}),
		[focusedSlideIndex, carouselSlides, settings.focusOnScroll, settings.onSwipe]);

	// Handle arrow buttons hide/show on carousel scrolling
	useEffect(() => handleOnScroll(scrollerRef.current), [carouselSlides]);

	// On unmount terminate the currently running scrolling animation loop
	useEffect(() => animRef.current, []);

	return (
		<div className="carousel" onKeyDown={onKeyDown} aria-orientation="horizontal" role="carousel" aria-label={props['aria-label']}>
			<Arrow direction="back" settings={settings} onAction={onArrowButtonMouseDown} />
			<Slides carouselSlides={carouselSlides} settings={settings} focusedIndex={focusedSlideIndex} scrollerRef={scrollerRef}/>
			<Arrow direction="forward" settings={settings} onAction={onArrowButtonMouseDown} />
			<Dots carouselSlides={carouselSlides} settings={settings} focusedIndex={focusedSlideIndex} onAction={setFocusedSlide}/>
		</div>);
}

export default Carousel;