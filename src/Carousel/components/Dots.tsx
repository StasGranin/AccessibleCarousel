import React from "react";
import {DotsProps} from "../types";

const Dots: React.FC<DotsProps> = ({carouselSlides, focusedIndex, settings: {showDots, dots}, onAction}) => {
	if (showDots){
		if (dots) {
			const dotsReactElement = dots({carouselSlides, focusedIndex, onAction});

			if (React.isValidElement(dotsReactElement)) {
				return React.cloneElement(dotsReactElement, {...(dotsReactElement as JSX.Element).props})
			}
		} else {
			return (<ul className="dots" aria-hidden={true}>
				{carouselSlides.map((frame, index) =>
					<li key={index} className={`dot ${index === focusedIndex ? 'focused' : ''}`} tabIndex={-1} onClick={() => onAction(index, 'Dots', index)} />
				)}
			</ul>)
		}
	}

	return (<></>);
};



export default Dots;