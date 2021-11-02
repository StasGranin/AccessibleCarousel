import {CarouselProps} from "./types";

export const defaultProps: CarouselProps = {
	slidesToScroll: 1,
	focusOnScroll: true,
	scrollDuration: 500,
	ariaAnnounceSlides: true,
	ariaSlideAnnouncement: (slideIndex, slidesCount) =>
		`Slide number ${slideIndex + 1}; ${slideIndex === slidesCount - 1 ? 'Last slide of the carousel;' : ''}`,
	showDots: false,
	showArrows: false,
};