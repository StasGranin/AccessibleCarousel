import React from "react";
import {DotsProps} from "../types";

const Dots: React.FC<DotsProps> = ({carouselSlides, focusedIndex, settings, onAction}) => {
	if (settings.dots){
		return (<ul className="dots">
			{carouselSlides.map((frame, index) =>
				<li key={index} className={`dot ${index === focusedIndex ? 'focused' : ''}`} tabIndex={-1} onClick={() => onAction(index, 'Dots', index)} />
			)}
		</ul>)
	}

	return (<></>);
};



export default Dots;