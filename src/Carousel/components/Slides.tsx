import React from "react";
import {SlidesProps} from "../types";

const Slides: React.FC<SlidesProps> = ({carouselSlides, scrollerRef}) =>
	(<ul className="scroller" ref={scrollerRef} >
		{carouselSlides.map((slide, index) => (
			<li className="slide" key={index} ref={slide.ref} tabIndex={index === 0 ? 0 : -1} onMouseDown={(event) => slide.onAction(event)}>
				{slide.child}
			</li>))
		}
	</ul>)

export default Slides;