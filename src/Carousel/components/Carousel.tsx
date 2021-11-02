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
	handleUserScrolling
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
					onSelectHandler: fn => {
						slide.onSelectHandler = fn;
					}
				}),
				ref: React.createRef<HTMLLIElement>(),
				onSelectHandler: null,
				onAction: event => {
					event.preventDefault();
					getSlideElement(slide).focus({preventScroll: true});
					setFocused(index, 'Click');
				}
			};
			return slide;
		}), [children]);

	const setFocused: SetFocusFn = (slideIndex, trigger, which) => {
		if (!slideIndex) {
			if (isElementInView(getSlideElement(carouselSlides[focusedSlideIndex]))) {
				return;
			}
			slideIndex = getFirstVisibleSlideIndex(carouselSlides)
		}

		setFocusedSlideIndex(slideIndex);

		settings.onSlideFocus && settings.onSlideFocus({
			type: 'SlideFocus',
			trigger,
			which,
			currentIndex: slideIndex,
			prevIndex: prevFocusedSlideIndex.current
		});
	};

	const onKeyDown = (event: React.KeyboardEvent) => handleKeyboardNavigation(event, carouselSlides, focusedSlideIndex, setFocused);
	const onArrowButtonMouseDown = (event, slidesToScroll) => animRef.current = handleArrowButtonsNavigation(event, carouselSlides, slidesToScroll, animRef, {
		duration: settings.scrollDuration,
		afterScrolling: () => settings.focusOnScroll && setFocused(null, 'Arrow', slidesToScroll > 0 ? 'Previous' : 'Next')
	});

	useEffect(() => {
		animRef.current = handleSlideFocus(carouselSlides, focusedSlideIndex, settings.scrollDuration, animRef);
		prevFocusedSlideIndex.current = focusedSlideIndex;
	}, [focusedSlideIndex, carouselSlides, settings.scrollDuration]);

	useEffect(() => handleUserScrolling(scrollerRef.current, setFocused),
		[focusedSlideIndex, carouselSlides, settings.focusOnScroll]);

	useEffect(() => handleArrowsOnScroll(scrollerRef.current),
		[carouselSlides, settings.showArrows]);

	return (
		<div className="carousel" onKeyDown={onKeyDown} aria-orientation="horizontal">
			<Arrow direction="back" settings={settings} onAction={onArrowButtonMouseDown} />
			<Slides carouselSlides={carouselSlides} scrollerRef={scrollerRef}/>
			<Arrow direction="forward" settings={settings} onAction={onArrowButtonMouseDown} />
			<Dots carouselSlides={carouselSlides} settings={settings} focusedIndex={focusedSlideIndex} onAction={setFocused}/>
		</div>);
}

export default Carousel;