import React, {useEffect, useMemo, useRef, useState} from "react";
import Arrow from "./Arrows";
import Slides from "./Slides";
import Dots from "./Dots";
import {CarouselSlide, CarouselProps, SetFocusFn} from '../types'
import {
	handleArrowButtonsNavigation,
	handleArrowsOnScroll,
	handleKeyboardNavigation,
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

	const carouselSlides: CarouselSlide[] = useMemo(() => React.Children.toArray(children)
		.filter((child) => React.isValidElement(child))
		.map((child: JSX.Element, index) => {
			const slide: CarouselSlide = {
				child: React.cloneElement(child, {...child.props,
					onActionHandler: fn => {
						slide.onActionHandler = fn;
					},
					onFocusHandler: fn => {
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

	const setFocused: SetFocusFn = (slideIndex, trigger, which) => {
		if (slideIndex === null) {
			if (isElementInView(getSlideElement(carouselSlides[focusedSlideIndex]))) {
				return;
			}
			slideIndex = getFirstVisibleSlideIndex(carouselSlides)
		}

		setFocusedSlideIndex(slideIndex);

		settings.onSlideFocus && settings.onSlideFocus({
			trigger,
			which,
			currentIndex: slideIndex,
			prevIndex: prevFocusedSlideIndex.current
		});
	};

	const onKeyDown = (event: React.KeyboardEvent) => handleKeyboardNavigation(event, carouselSlides, focusedSlideIndex, setFocused);
	const onArrowButtonMouseDown = (event, slidesToScroll) =>
		animRef.current = handleArrowButtonsNavigation(event, carouselSlides, slidesToScroll, animRef, {
			duration: settings.scrollDuration,
			afterScrolling: () =>
				settings.focusOnScroll && setFocused(null, 'Arrow', slidesToScroll > 0 ? 'Previous' : 'Next')
		});

	useEffect(() => {
		animRef.current = handleSlideFocus(carouselSlides[focusedSlideIndex], settings.scrollDuration, animRef);
		prevFocusedSlideIndex.current = focusedSlideIndex;
	}, [focusedSlideIndex, carouselSlides, settings.scrollDuration]);

	useEffect(() => handleSwipe(scrollerRef.current, (direction, distance) => {
			settings.onSwipe && settings.onSwipe({
				direction,
				distance,
				firstVisibleSlideIndex: getFirstVisibleSlideIndex(carouselSlides)
			});

			settings.focusOnScroll && setFocused(null, 'Swipe', direction)
		}),
		[focusedSlideIndex, carouselSlides, settings.focusOnScroll, settings.onSwipe]);

	useEffect(() => handleArrowsOnScroll(scrollerRef.current), [carouselSlides, settings.showArrows]);
	useEffect(() => animRef.current, []); // On unmount stop any running animation loop

	return (
		<div className="carousel" onKeyDown={onKeyDown} aria-orientation="horizontal" role="composite" aria-label={props['aria-label']}>
			<Arrow direction="back" settings={settings} onAction={onArrowButtonMouseDown} />
			<Slides carouselSlides={carouselSlides} settings={settings} focusedIndex={focusedSlideIndex} scrollerRef={scrollerRef}/>
			<Arrow direction="forward" settings={settings} onAction={onArrowButtonMouseDown} />
			<Dots carouselSlides={carouselSlides} settings={settings} focusedIndex={focusedSlideIndex} onAction={setFocused}/>
		</div>);
}

export default Carousel;