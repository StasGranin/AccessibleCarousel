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
	const prevFocusedSlideIndex = useRef(null);
	const scrollerRef = useRef<HTMLUListElement>(null);
	const animRef = useRef(() => {});

	// Create the carouselSlides object based on props.children
	// This is an array of Slide objects containing: the wrapped child, it's DOM node ref and slide interaction handler functions
	const carouselSlides: CarouselSlide[] = useMemo(() => React.Children.toArray(children)
		.filter((child) => React.isValidElement(child))
		.map((child: JSX.Element, index) => {
			const slide: CarouselSlide = {
				child: React.cloneElement(child, {...child.props,
					slideIndex: index,
					// These hook function are called by the Slide.child component on mounting to provide the Carousel with a way to interact with the child.
					// This is used to simulate onClick and onFocus events generated by the carousel on the child
					onActionHook: fn => {
						slide.onActionHandler = fn;
					},
					onFocusHook: fn => {
						slide.onFocusHandler = fn;
					},
				}),
				ref: React.createRef<HTMLLIElement>(),
				onActionHandler: null,
				onFocusHandler: null,
				onAction: event => {
					event.preventDefault();
					getSlideElement(slide).focus({preventScroll: true});
					setFocused(index, 'Click');
				}
			};
			return slide;
		}), [children]);

	// Wrapper function over setFocusedSlideIndex(). Probably the most important function here
	const setFocused: SetFocusFn = (slideIndex, trigger, which) => {
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
	const onKeyDown = (event: React.KeyboardEvent) => handleKeyboardNavigation(event, carouselSlides, focusedSlideIndex, setFocused);

	// Handle arrow button paging
	const onArrowButtonMouseDown = (event, slidesToScroll) =>
		animRef.current = handleArrowButtonsNavigation(event, carouselSlides, slidesToScroll, animRef, {
			duration: settings.scrollDuration,
			afterScrolling: () =>
				settings.focusOnScroll && setFocused(null, 'Arrow', slidesToScroll > 0 ? 'Previous' : 'Next')
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

			settings.focusOnScroll && setFocused(null, 'Swipe', direction)
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
			<Dots carouselSlides={carouselSlides} settings={settings} focusedIndex={focusedSlideIndex} onAction={setFocused}/>
		</div>);
}

export default Carousel;