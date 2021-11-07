import React from "react";
import {SlidesProps} from "../types";

const Slides: React.FC<SlidesProps> = ({carouselSlides, settings, focusedIndex, scrollerRef}) =>
	(<ul className="scroller" ref={scrollerRef}>
		{carouselSlides.map((slide, index) => (
			<li className={`slide ${index === focusedIndex ? 'focused' : ''}`} key={index} ref={slide.ref}
			    tabIndex={index === focusedIndex ? 0 : -1}
			    onFocus={()=>slide.onFocusHandler && slide.onFocusHandler()}
			    onMouseDown={(event) => slide.onAction(event)}>
				{settings.ariaAnnounceSlides &&
					<span className="hiddenAriaLabel"
					      role="status"
					      aria-label={settings.ariaSlideAnnouncement(index, carouselSlides.length)} />
				}
				{slide.child}
			</li>))
		}
	</ul>)

export default Slides;